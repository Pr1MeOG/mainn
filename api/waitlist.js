import { Redis } from '@upstash/redis';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';

export const config = {
  runtime: 'nodejs',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
const MAX_EMAIL_LENGTH = 254;
const RATE_LIMIT_WINDOW_SECONDS = 60;
const RATE_LIMIT_MAX = 8;
const LOCAL_DATA_DIR = path.join(process.cwd(), '.data');
const LOCAL_DATA_FILE = path.join(LOCAL_DATA_DIR, 'waitlist.json');
const localRateLimit = new Map();

function getRedis() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  return Redis.fromEnv();
}

function json(res, status, payload) {
  return res.status(status).json(payload);
}

function normalizeEmail(email = '') {
  return String(email).trim().toLowerCase();
}

function hash(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function getIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

function getOriginAllowed(req) {
  const allowed = process.env.ALLOWED_ORIGINS?.split(',').map((item) => item.trim()).filter(Boolean);
  if (!allowed?.length) return true;
  const origin = req.headers.origin;
  if (!origin) return true;
  return allowed.includes(origin);
}

async function checkTurnstile(token, ip) {
  if (!process.env.TURNSTILE_SECRET_KEY) return true;
  if (!token) return false;

  const formData = new FormData();
  formData.append('secret', process.env.TURNSTILE_SECRET_KEY);
  formData.append('response', token);
  formData.append('remoteip', ip);

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  return Boolean(data.success);
}

async function redisRateLimit(redis, key) {
  const count = await redis.incr(key);
  if (count === 1) await redis.expire(key, RATE_LIMIT_WINDOW_SECONDS);
  return count <= RATE_LIMIT_MAX;
}

function localRateLimitCheck(key) {
  const now = Date.now();
  const item = localRateLimit.get(key);
  if (!item || item.resetAt <= now) {
    localRateLimit.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_SECONDS * 1000 });
    return true;
  }
  item.count += 1;
  return item.count <= RATE_LIMIT_MAX;
}

async function saveLocal(signup) {
  await fs.mkdir(LOCAL_DATA_DIR, { recursive: true });

  let data = { emails: [], signups: [] };
  try {
    data = JSON.parse(await fs.readFile(LOCAL_DATA_FILE, 'utf8'));
  } catch {
    // First local signup: create the file.
  }

  const duplicate = data.emails.includes(signup.email);
  if (!duplicate) {
    data.emails.push(signup.email);
    data.signups.unshift(signup);
    await fs.writeFile(LOCAL_DATA_FILE, JSON.stringify(data, null, 2));
  }

  return { duplicate, count: data.emails.length };
}

async function saveRedis(redis, signup) {
  const emailKey = `waitlist:signup:${hash(signup.email)}`;
  const wasAdded = await redis.sadd('waitlist:emails', signup.email);

  if (wasAdded) {
    await redis.hset(emailKey, signup);
    await redis.lpush('waitlist:signups', JSON.stringify(signup));
  }

  const count = await redis.scard('waitlist:emails');
  return { duplicate: !wasAdded, count };
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    return json(res, 405, { ok: false, message: 'Method not allowed.' });
  }

  if (!getOriginAllowed(req)) {
    return json(res, 403, { ok: false, message: 'This origin is not allowed.' });
  }

  const ip = getIp(req);
  const redis = getRedis();
  const body = req.body || {};
  const email = normalizeEmail(body.email);
  const userAgent = String(req.headers['user-agent'] || '').slice(0, 300);
  const source = String(body.source || '/').slice(0, 180);

  // Honeypot: bots often fill hidden fields. Return OK without storing to avoid teaching them.
  if (body.company) {
    return json(res, 200, { ok: true, duplicate: false, count: null });
  }

  const startedAt = Number(body.startedAt || 0);
  if (!Number.isFinite(startedAt) || Date.now() - startedAt < 1800) {
    return json(res, 400, { ok: false, message: 'Please wait a second and submit again.' });
  }

  if (!EMAIL_REGEX.test(email) || email.length > MAX_EMAIL_LENGTH) {
    return json(res, 400, { ok: false, message: 'Enter a valid email address.' });
  }

  const rateKey = `waitlist:rl:${hash(ip)}`;
  const allowed = redis ? await redisRateLimit(redis, rateKey) : localRateLimitCheck(rateKey);
  if (!allowed) {
    return json(res, 429, { ok: false, message: 'Too many attempts. Try again in a minute.' });
  }

  const turnstileOk = await checkTurnstile(body.turnstileToken, ip);
  if (!turnstileOk) {
    return json(res, 403, { ok: false, message: 'Spam check failed. Please refresh and try again.' });
  }

  const signup = {
    email,
    createdAt: new Date().toISOString(),
    source,
    ipHash: hash(ip),
    userAgent,
  };

  try {
    const result = redis ? await saveRedis(redis, signup) : await saveLocal(signup);
    return json(res, 200, { ok: true, ...result });
  } catch (error) {
    console.error('Waitlist save failed:', error);
    return json(res, 500, { ok: false, message: 'Could not save your email right now. Please try again.' });
  }
}
