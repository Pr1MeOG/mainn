import { useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, MailWarning } from 'lucide-react';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(null);
  const startedAt = useMemo(() => Date.now(), []);

  const isEmailValid = emailPattern.test(email.trim());

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage('');

    if (!isEmailValid) {
      setStatus('error');
      setMessage('Drop a real email so I can send your launch access.');
      return;
    }

    setStatus('loading');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          company,
          startedAt,
          source: window.location.pathname,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.ok) {
        throw new Error(data.message || 'Something went wrong. Please try again.');
      }

      setStatus('success');
      setCount(data.count ?? null);
      setMessage(data.duplicate ? 'You are already on the waitlist. I saved your spot.' : 'You are in. Launch access will hit your inbox first.');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage(error.message || 'Something went wrong. Please try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-[2rem] border border-white/10 bg-ink/70 p-3 shadow-2xl backdrop-blur" noValidate>
      <label className="sr-only" htmlFor="email">Email address</label>
      <input
        id="company"
        name="company"
        value={company}
        onChange={(event) => setCompany(event.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value);
            if (status === 'error') setStatus('idle');
          }}
          placeholder="your@email.com"
          className="min-h-14 flex-1 rounded-full border border-white/10 bg-white/[0.04] px-5 text-base font-semibold text-paper outline-none transition placeholder:text-slateSoft/60 focus:border-emerald/60 focus:bg-white/[0.07]"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-emerald px-6 text-sm font-extrabold text-ink shadow-glow transition hover:bg-paper disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === 'loading' ? <Loader2 size={18} className="animate-spin" /> : 'Join waitlist'}
          {status !== 'loading' && <ArrowRight size={18} className="transition group-hover:translate-x-1" />}
        </button>
      </div>

      {message && (
        <div className={`mt-4 flex items-start gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${status === 'success' ? 'bg-emerald/10 text-emerald' : 'bg-coral/10 text-coral'}`}>
          {status === 'success' ? <CheckCircle2 size={18} /> : <MailWarning size={18} />}
          <span>{message}{count ? ` You are signup #${count}.` : ''}</span>
        </div>
      )}

      <p className="mt-4 px-2 text-center text-xs font-medium leading-5 text-slateSoft">
        Protected with validation, rate limiting, and a honeypot field. No spam. No fake hype.
      </p>
    </form>
  );
}
