import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Github, Instagram, Linkedin, Mail, MousePointer2, ShieldCheck, Sparkles, Twitter } from 'lucide-react';
import { site, rosterPreview, services } from './config.js';
import Countdown from './components/Countdown.jsx';
import WaitlistForm from './components/WaitlistForm.jsx';
import StaticStage from './components/StaticStage.jsx';
import SectionLabel from './components/SectionLabel.jsx';
import { useMousePosition } from './hooks/useMousePosition.js';
import { useReducedMotion } from './hooks/useReducedMotion.js';
import { supportsWebGL } from './lib/supportsWebGL.js';

const HeroScene = lazy(() => import('./components/HeroScene.jsx'));

function App() {
  const pageRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const mouse = useMousePosition();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    setWebglReady(supportsWebGL());
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(max <= 0 ? 0 : Math.min(window.scrollY / max, 1));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const launchText = useMemo(() => {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'long',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata',
    }).format(new Date(site.launchDate));
  }, []);

  return (
    <main ref={pageRef} className="min-h-screen overflow-hidden bg-ink bg-radial-stage bg-noise text-paper antialiased selection:bg-emerald selection:text-ink">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald/10 blur-[100px]" />
        <div className="absolute right-[-180px] top-[18%] h-[440px] w-[440px] rounded-full bg-coral/10 blur-[110px]" />
      </div>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink/60 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className="group flex items-center gap-3" aria-label={`${site.name} home`}>
            <span className="grid h-10 w-10 place-items-center rounded-2xl border border-emerald/35 bg-white/[0.04] shadow-glow">
              <span className="h-4 w-4 rotate-45 rounded-[4px] bg-gradient-to-br from-emerald to-coral transition-transform duration-300 group-hover:rotate-90" />
            </span>
            <span className="font-display text-sm font-bold tracking-[0.32em] text-paper">{site.name}</span>
          </a>

          <div className="hidden items-center gap-6 text-sm font-semibold text-slateSoft md:flex">
            <a className="transition hover:text-paper" href="#about">About</a>
            <a className="transition hover:text-paper" href="#preview">Preview</a>
            <a className="transition hover:text-paper" href="#waitlist">Waitlist</a>
          </div>

          <a
            href={`mailto:${site.contactEmail}`}
            className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-paper transition hover:border-emerald/50 hover:bg-emerald/10"
          >
            Contact
          </a>
        </nav>
      </header>

      <section id="top" className="relative z-10 min-h-screen px-5 pb-20 pt-28 sm:px-8 lg:pt-32">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.95fr]">
          <div className="relative z-20 max-w-3xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald/20 bg-emerald/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.24em] text-emerald shadow-glow">
              <Sparkles size={14} /> {site.eyebrow}
            </div>

            <h1 className="font-display text-5xl font-bold leading-[0.9] tracking-[-0.08em] text-paper sm:text-7xl lg:text-8xl">
              Coming soon.
              <span className="block bg-gradient-to-r from-emerald via-paper to-coral bg-clip-text pt-2 text-transparent">
                Built with depth.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-slateSoft sm:text-xl">
              A new digital home for full-stack development, creator management, brand partnerships, and launch-ready creator systems.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#waitlist"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-emerald px-6 py-4 text-sm font-extrabold text-ink shadow-glow transition hover:-translate-y-0.5 hover:bg-paper"
              >
                Join the launch waitlist
                <ArrowRight size={18} className="transition group-hover:translate-x-1" />
              </a>
              <a
                href={`mailto:${site.contactEmail}?subject=Partnership%20Inquiry%20for%20${site.name}`}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-extrabold text-paper transition hover:border-coral/50 hover:bg-coral/10"
              >
                <Mail size={18} /> Partnership inquiry
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              <Countdown launchDate={site.launchDate} />
            </div>
          </div>

          <div className="relative min-h-[440px] lg:min-h-[650px]" aria-label="Interactive 3D launch object">
            <div className="absolute inset-0 rounded-[3rem] border border-white/10 bg-white/[0.025] shadow-2xl backdrop-blur-sm" />
            <div className="absolute inset-4 rounded-[2.4rem] border border-white/5 bg-gradient-to-b from-white/[0.08] to-transparent" />

            {webglReady && !reducedMotion ? (
              <Suspense fallback={<StaticStage />}> 
                <HeroScene mouse={mouse} scrollProgress={scrollProgress} />
              </Suspense>
            ) : (
              <StaticStage />
            )}

            <div className="absolute bottom-7 left-7 right-7 flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-white/10 bg-ink/55 p-4 backdrop-blur-xl">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald">Launch date</p>
                <p className="mt-1 text-sm font-semibold text-paper">{launchText} IST</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-bold text-slateSoft">
                <MousePointer2 size={14} /> Cursor + scroll reactive
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="relative z-10 px-5 py-24 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.65fr_1fr] lg:items-start">
          <SectionLabel eyebrow="About" title="One creator brain. Two sharp lanes." />
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl backdrop-blur md:p-10">
            <p className="text-2xl font-semibold leading-snug text-paper md:text-4xl">
              I build high-converting digital products and manage creators who need structure, brand clarity, and better opportunities.
            </p>
            <p className="mt-6 text-lg leading-8 text-slateSoft">
              The full site will show the work properly: development services, creator operations, collaboration routes, and a clean path for brands, clients, creators, and fans to connect without noise.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {['Full-stack web', 'Creator operations', 'Brand-ready launches'].map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-ink/40 p-4 text-sm font-bold text-paper">
                  <ShieldCheck className="mb-4 text-emerald" size={20} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="preview" className="relative z-10 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionLabel eyebrow="Preview" title="What unlocks at launch." />
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {services.map((service, index) => (
              <article
                key={service.title}
                className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 shadow-2xl transition duration-500 hover:-translate-y-1 hover:border-emerald/30 hover:bg-white/[0.055] md:p-8"
              >
                <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald/10 blur-3xl transition group-hover:bg-coral/15" />
                <p className="text-sm font-extrabold uppercase tracking-[0.25em] text-emerald">0{index + 1} / {service.tag}</p>
                <h3 className="mt-8 font-display text-3xl font-bold tracking-[-0.05em] text-paper">{service.title}</h3>
                <p className="mt-4 leading-7 text-slateSoft">{service.copy}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 grid gap-5 rounded-[2rem] border border-white/10 bg-ink/50 p-5 backdrop-blur lg:grid-cols-[0.7fr_1fr] lg:p-8">
            <div>
              <p className="text-sm font-extrabold uppercase tracking-[0.25em] text-coral">Roster / work in progress</p>
              <h3 className="mt-4 font-display text-3xl font-bold tracking-[-0.05em] text-paper">A launch wall that proves execution.</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {rosterPreview.map((item) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/[0.035] px-5 py-4 text-sm font-bold text-paper">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="waitlist" className="relative z-10 px-5 py-24 sm:px-8">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] border border-emerald/20 bg-gradient-to-br from-emerald/10 via-white/[0.045] to-coral/10 p-6 shadow-glow backdrop-blur md:p-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-extrabold uppercase tracking-[0.25em] text-emerald">Waitlist</p>
            <h2 className="mt-4 font-display text-4xl font-bold leading-none tracking-[-0.06em] text-paper sm:text-6xl">
              Get first access when the full site drops.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slateSoft">
              One email. No spam. Only launch access, creator updates, and useful partnership drops.
            </p>
          </div>
          <div className="mx-auto mt-9 max-w-2xl">
            <WaitlistForm />
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-xl font-bold tracking-[0.2em] text-paper">{site.name}</p>
            <p className="mt-2 text-sm text-slateSoft">Launching {launchText} IST · Contact: <a className="text-paper hover:text-emerald" href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></p>
          </div>
          <div className="flex items-center gap-3">
            <SocialLink href={site.social.instagram} label="Instagram"><Instagram size={18} /></SocialLink>
            <SocialLink href={site.social.x} label="X"><Twitter size={18} /></SocialLink>
            <SocialLink href={site.social.github} label="GitHub"><Github size={18} /></SocialLink>
            <SocialLink href={site.social.linkedin} label="LinkedIn"><Linkedin size={18} /></SocialLink>
          </div>
        </div>
      </footer>
    </main>
  );
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noreferrer"
      className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slateSoft transition hover:border-emerald/40 hover:bg-emerald/10 hover:text-paper"
    >
      {children}
    </a>
  );
}

export default App;
