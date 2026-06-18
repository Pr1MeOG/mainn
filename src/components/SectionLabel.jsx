export default function SectionLabel({ eyebrow, title }) {
  return (
    <div>
      <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-emerald">{eyebrow}</p>
      <h2 className="mt-4 max-w-2xl font-display text-4xl font-bold leading-none tracking-[-0.06em] text-paper sm:text-6xl">
        {title}
      </h2>
    </div>
  );
}
