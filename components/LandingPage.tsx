import React, { useEffect, useRef } from 'react';
import { JAINNLogo } from './JAINNLogo';

interface LandingPageProps {
  onEnter: () => void;
  onNavigate: (page: string) => void;
}

/**
 * Landing page:
 * - Full hero with large heading
 * - "EVOLUTION" marquee (smooth, continuous)
 * - Ambient blobs / glow
 * - Features grid
 * - Responsive and accessible
 *
 * Tailwind is used for almost all styling. A few inline styles are used
 * for precise visual effects (glows, drop-shadows, subtle z-index animation).
 */
export const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onNavigate }) => {
  const marqueeRef = useRef<HTMLDivElement | null>(null);

  // Enhance marquee smoothness using requestAnimationFrame for high-frame-rate transform
  useEffect(() => {
    const el = marqueeRef.current;
    if (!el) return;

    // We'll animate transform manually for very smooth performance
    let raf = 0;
    let start = performance.now();
    const duration = 10000; // ms for one full cycle leftwards (10s)
    const step = (t: number) => {
      const elapsed = (t - start) % duration;
      const pct = elapsed / duration; // 0..1
      // translateX from 0% to -50% for two copies
      el.style.transform = `translateX(${-pct * 50}%)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans relative overflow-hidden ios26-gradient">
      {/* Ambient blobs and subtle vignette */}
      <div aria-hidden className="pointer-events-none">
        <div className="absolute -left-40 -top-40 w-[560px] h-[560px] rounded-full bg-gradient-to-br from-indigo-900/20 to-transparent blur-[120px] opacity-70" />
        <div className="absolute -right-40 -bottom-40 w-[680px] h-[680px] rounded-full bg-gradient-to-tr from-purple-900/18 to-transparent blur-[160px] opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(10,132,255,0.02)_0%,transparent_25%),radial-gradient(circle_at_80%_80%,rgba(94,92,230,0.02)_0%,transparent_25%)] pointer-events-none" />
      </div>

      {/* Top nav */}
      <header className="relative z-30">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <JAINNLogo size={36} />
            <span className="font-semibold text-white/90 tracking-wide select-none">JAI-NN 3.0</span>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => onNavigate('creator')} className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-sm">Creator</button>
            <button onClick={() => onNavigate('pricing')} className="px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-sm">Pricing</button>
            <button onClick={onEnter} className="ml-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold">Start Creating</button>
          </div>

          {/* mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => onNavigate('pricing')} className="p-2 rounded-full bg-white/5 border border-white/6">
              {/* hamburger-ish simplified */}
              <svg width="18" height="18" viewBox="0 0 24 24" className="text-white/80" fill="none" stroke="currentColor"><path strokeWidth="1.6" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" /></svg>
            </button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* left: hero copy */}
          <div className="lg:col-span-7 order-2 lg:order-1 text-center lg:text-left">
            <div className="mb-6">
              <div className="mx-auto lg:mx-0 w-28 h-28 rounded-full flex items-center justify-center mb-4 drop-shadow-[0_30px_60px_rgba(94,92,230,0.18)]" style={{ transform: 'translateZ(0)' }}>
                <JAINNLogo size={96} />
              </div>

              <div className="inline-flex items-center gap-2 mb-2 justify-center lg:justify-start">
                <span className="px-3 py-1 rounded-full border border-white/10 bg-black/30 text-xs text-white/60 tracking-wider">NEURAL SYSTEM ONLINE</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6">
              Artificial Intelligence
            </h1>

            {/* Marquee EVOLUTION */}
            <div className="mb-6">
              <div className="overflow-hidden" aria-hidden style={{ height: '3.2rem' }}>
                <div
                  ref={marqueeRef}
                  role="presentation"
                  className="flex whitespace-nowrap items-center gap-12 will-change-transform"
                  style={{ transform: 'translateX(0%)', transition: 'transform linear 0s' }}
                >
                  {/* duplicate several times for continuous repeat */}
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-widest opacity-20 select-none" style={{ letterSpacing: '0.5rem' }}>
                      E V O L U T I O N
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <p className="max-w-2xl text-white/60 text-lg mb-8">
              Experience the next generation of AI-powered conversations. Create, learn, and innovate with advanced neural intelligence at your fingertips.
            </p>

            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              <button onClick={onEnter} className="px-8 py-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform">
                Start Creating
              </button>
              <button onClick={() => onNavigate('creator')} className="px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white">
                About Creator
              </button>
            </div>
          </div>

          {/* right: hero visual / callout */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="w-full rounded-3xl p-6 smoked-glass border border-white/6 shadow-[0_40px_120px_rgba(10,10,20,0.6)]">
              <div className="relative overflow-hidden rounded-2xl">
                {/* rotating soft grid + ring */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[260px] h-[260px] md:w-[300px] md:h-[300px] rounded-full bg-gradient-to-tr from-indigo-900/10 to-purple-900/6 blur-3xl animate-fade-in" />
                </div>

                <div className="relative z-10 p-6">
                  <h3 className="text-lg font-semibold mb-2">Immersive Neural Interface</h3>
                  <p className="text-sm text-white/60 mb-4">A cinematic UI with multi-model chat, image generation, and workspace personalization.</p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/6">
                      <div className="text-xs text-white/50">Free Tier</div>
                      <div className="font-bold text-lg">$0</div>
                      <div className="text-xs text-white/50">5 images / 2k tokens daily</div>
                    </div>
                    <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-800/30 to-purple-800/30 border border-indigo-500/20">
                      <div className="text-xs text-white/50">Pro (coming)</div>
                      <div className="font-bold text-lg">$19</div>
                      <div className="text-xs text-white/50">Unlimited images & tokens</div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button className="flex-1 py-2 rounded-lg bg-white/5 border border-white/8 text-sm">Explore</button>
                    <button onClick={onEnter} className="py-2 px-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-sm">Open Chat</button>
                  </div>
                </div>
              </div>

              {/* footer area inside visual */}
              <div className="mt-6 text-xs text-white/40">Powerful models • Image gen • Personalization</div>
            </div>
          </div>
        </div>

        {/* Features section */}
        <section className="mt-12 lg:mt-20">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Features</h2>
            <p className="text-white/60">A compact set of powerful capabilities that make JAI-NN useful for creators and developers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <article className="p-6 rounded-2xl smoked-glass border border-white/6">
              <div className="mb-3 flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 shadow-md">
                {/* icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2v20" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </div>
              <h3 className="font-semibold mb-1">Multi-model Chat</h3>
              <p className="text-sm text-white/60">Choose between fast/light and high-fidelity models for conversations.</p>
            </article>

            <article className="p-6 rounded-2xl smoked-glass border border-white/6">
              <div className="mb-3 flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-tr from-indigo-600 to-pink-500 shadow-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12h18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </div>
              <h3 className="font-semibold mb-1">Image Generation</h3>
              <p className="text-sm text-white/60">Generate images quickly using natural-language prompts and variations.</p>
            </article>

            <article className="p-6 rounded-2xl smoked-glass border border-white/6">
              <div className="mb-3 flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-tr from-green-400 to-cyan-400 shadow-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 12h14" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </div>
              <h3 className="font-semibold mb-1">Personalization</h3>
              <p className="text-sm text-white/60">Customize accents, quick prompts, system instructions, and export signatures.</p>
            </article>

            <article className="p-6 rounded-2xl smoked-glass border border-white/6">
              <div className="mb-3 flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-tr from-yellow-400 to-orange-400 shadow-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6h16" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </div>
              <h3 className="font-semibold mb-1">Usage Tracking</h3>
              <p className="text-sm text-white/60">Free tier limits are shown and tracked; easy upgrade paths available.</p>
            </article>

            <article className="p-6 rounded-2xl smoked-glass border border-white/6">
              <div className="mb-3 flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 12h18" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </div>
              <h3 className="font-semibold mb-1">Secure Storage</h3>
              <p className="text-sm text-white/60">Conversations and settings saved securely using Supabase (no changes made).</p>
            </article>

            <article className="p-6 rounded-2xl smoked-glass border border-white/6">
              <div className="mb-3 flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-tr from-blue-400 to-indigo-400 shadow-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 12h16" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
              </div>
              <h3 className="font-semibold mb-1">Developer Friendly</h3>
              <p className="text-sm text-white/60">Open foldable components, clear structure and Vite-based build.</p>
            </article>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-white/40 text-sm">
          © JAI-NN 3.0 • Built with ❤️
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
