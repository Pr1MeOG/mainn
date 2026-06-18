# ABHISHEKK — 3D Coming Soon Waitlist

A production-ready single-page teaser site for a digital creator / full-stack developer / creator manager.

## What is included

- React + Vite single-page app
- Tailwind CSS styling
- Three.js / React Three Fiber interactive hero scene
- Static fallback when WebGL or reduced-motion is active
- Live countdown wired to a configurable launch date
- Waitlist form with email validation, honeypot, submit-time check, rate limiting, duplicate handling, and success state
- Persistent production storage through Upstash Redis
- Local JSON fallback for testing without a database
- SEO, Open Graph, Twitter, responsive layout, and Vercel config

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

The regular `npm run dev` command runs the Vite frontend. The API route works best with Vercel's local dev server:

```bash
npm i -g vercel
vercel dev
```

Then open the local URL shown in your terminal.

## Configure the launch date

Edit `.env.local`:

```bash
VITE_LAUNCH_DATE="2026-08-01T20:00:00+05:30"
VITE_CONTACT_EMAIL="mail-hello@abhishekk.me"
```

The countdown uses this date at build time.

## Production database setup

Create a free Upstash Redis database and add these environment variables in Vercel:

```bash
UPSTASH_REDIS_REST_URL="your-upstash-rest-url"
UPSTASH_REDIS_REST_TOKEN="your-upstash-rest-token"
```

Without these values, the API stores test signups in `.data/waitlist.json`. That fallback is only for local testing; Vercel serverless file storage is not persistent.

## Vercel deploy settings

Use these settings if Vercel does not auto-detect them:

- Framework Preset: Vite
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`
- Root Directory: project root

## Recommended Vercel environment variables

```bash
VITE_SITE_NAME="ABHISHEKK"
VITE_LAUNCH_DATE="2026-08-01T20:00:00+05:30"
VITE_CONTACT_EMAIL="mail-hello@abhishekk.me"
VITE_INSTAGRAM_URL="https://instagram.com/pr1mebusiness1511"
VITE_X_URL="https://x.com/pr1mebusiness1511"
VITE_GITHUB_URL="https://github.com/Pr1MeOG"
VITE_LINKEDIN_URL="https://linkedin.com"
UPSTASH_REDIS_REST_URL=""
UPSTASH_REDIS_REST_TOKEN=""
ALLOWED_ORIGINS="https://abhishekk.me,https://www.abhishekk.me,https://bio.abhishekk.me"
```

## Optional stronger spam protection

The API includes a hook for Cloudflare Turnstile. Add this in Vercel if you later add the Turnstile widget on the frontend:

```bash
TURNSTILE_SECRET_KEY="your-secret-key"
```

## Waitlist data keys in Upstash

- `waitlist:emails` — Redis set of unique emails
- `waitlist:signups` — newest-first list of signup payloads
- `waitlist:signup:<sha256-email>` — signup hash metadata
- `waitlist:rl:<sha256-ip>` — short-lived rate limit counter

## Build check

```bash
npm run build
```

## Customization pointers

- Main content: `src/config.js`
- Hero / sections: `src/App.jsx`
- 3D scene: `src/components/HeroScene.jsx`
- Waitlist form: `src/components/WaitlistForm.jsx`
- API route: `api/waitlist.js`
- Colors / Tailwind theme: `tailwind.config.js`
