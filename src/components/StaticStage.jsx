export default function StaticStage() {
  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden rounded-[3rem]" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,160,.18),transparent_32%),radial-gradient(circle_at_70%_30%,rgba(255,92,56,.16),transparent_26%)]" />
      <div className="absolute bottom-[18%] h-14 w-[72%] rounded-full bg-emerald/10 blur-2xl" />
      <div className="stage-grid absolute inset-x-8 bottom-[18%] h-[34%] rounded-[50%] border border-emerald/20 opacity-70" />

      <img
        src="/hero-fallback.svg"
        alt="Static render of the 3D launch object"
        className="relative h-[78%] w-[78%] max-w-[560px] object-contain drop-shadow-2xl"
        loading="eager"
      />
    </div>
  );
}
