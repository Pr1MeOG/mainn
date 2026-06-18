import { useEffect, useMemo, useState } from 'react';

function getRemaining(launchDate) {
  const diff = Math.max(0, new Date(launchDate).getTime() - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

export default function Countdown({ launchDate }) {
  const [remaining, setRemaining] = useState(() => getRemaining(launchDate));

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(getRemaining(launchDate)), 1000);
    return () => window.clearInterval(timer);
  }, [launchDate]);

  const items = useMemo(
    () => [
      ['Days', remaining.days],
      ['Hours', remaining.hours],
      ['Minutes', remaining.minutes],
      ['Seconds', remaining.seconds],
    ],
    [remaining],
  );

  return items.map(([label, value]) => (
    <div key={label} className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 backdrop-blur">
      <p className="font-display text-3xl font-bold tracking-[-0.06em] text-paper sm:text-4xl">
        {String(value).padStart(2, '0')}
      </p>
      <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-slateSoft">{label}</p>
    </div>
  ));
}
