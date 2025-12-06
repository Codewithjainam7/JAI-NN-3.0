
import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { CREATOR_INFO } from '../constants';

interface LandingPageProps {
  onEnter: () => void;
  onNavigate: (page: 'landing' | 'creator' | 'pricing') => void;
}

const useIntersectionObserver = (options = {}) => {
    const elementsRef = useRef<HTMLElement[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                    entry.target.classList.remove('opacity-0');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        elementsRef.current.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (el: HTMLElement | null) => {
        if (el && !elementsRef.current.includes(el)) {
            elementsRef.current.push(el);
        }
    };
};

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter, onNavigate }) => {
  const addToObserver = useIntersectionObserver({ threshold: 0.1 });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="relative min-h-screen w-full bg-black text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-blue-900/10 rounded-full blur-[100px] md:blur-[150px]"></div>
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] md:w-[800px] h-[500px] md:h-[800px] bg-purple-900/10 rounded-full blur-[100px] md:blur-[150px]"></div>
      </div>

      {/* Responsive Navbar - Liquid Glass Enhanced */}
      <nav className="fixed top-4 left-0 right-0 z-50 px-6 md:px-12 max-w-7xl mx-auto pointer-events-none flex items-center justify-between">
        
        {/* Logo */}
        <div className="pointer-events-auto liquid-glass rounded-full px-5 py-2.5 flex items-center gap-3 shadow-2xl backdrop-blur-xl">
           <div className="text-blue-500">
             <Icon name="logo" size={24} />
           </div>
           <span className="font-bold text-lg tracking-tight text-white hidden sm:block">JAI-NN</span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex pointer-events-auto items-center gap-1 px-2 py-1.5 rounded-full liquid-glass shadow-2xl backdrop-blur-xl text-sm font-medium text-white/70">
            <button onClick={() => scrollToSection('features')} className="px-5 py-2.5 rounded-full hover:bg-white/10 hover:text-white transition-colors">Features</button>
            <button onClick={() => scrollToSection('new')} className="px-5 py-2.5 rounded-full hover:bg-white/10 hover:text-white transition-colors">What's New</button>
            <button onClick={() => onNavigate('creator')} className="px-5 py-2.5 rounded-full hover:bg-white/10 hover:text-white transition-colors">Creator</button>
            <button onClick={() => onNavigate('pricing')} className="px-5 py-2.5 rounded-full hover:bg-white/10 hover:text-white transition-colors">Pricing</button>
        </div>

        {/* Right Actions & Mobile Toggle */}
        <div className="flex items-center gap-3 pointer-events-auto">
             <a href={CREATOR_INFO.github} target="_blank" rel="noreferrer" className="hidden sm:flex p-3 rounded-full liquid-glass hover:bg-white/10 transition-colors shadow-lg">
                <Icon name="github" size={20} />
            </a>
             <button 
                onClick={onEnter}
                className="hidden sm:flex px-6 py-3 rounded-full bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)]"
             >
                Launch App
             </button>
             
             {/* Mobile Menu Toggle */}
             <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-3 rounded-full liquid-glass text-white hover:bg-white/10 transition-colors shadow-lg"
             >
                 <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={20} />
             </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl pt-28 px-6 flex flex-col items-center space-y-6 md:hidden animate-fade-in">
              <button onClick={() => scrollToSection('features')} className="text-2xl font-bold text-white">Features</button>
              <button onClick={() => scrollToSection('new')} className="text-2xl font-bold text-white">What's New</button>
              <button onClick={() => {onNavigate('creator'); setMobileMenuOpen(false);}} className="text-2xl font-bold text-white">Creator</button>
              <button onClick={() => {onNavigate('pricing'); setMobileMenuOpen(false);}} className="text-2xl font-bold text-white">Pricing</button>
              <div className="w-16 h-px bg-white/20 my-4"></div>
              <button onClick={onEnter} className="px-8 py-3 rounded-full bg-white text-black font-bold text-lg">Launch Chat</button>
          </div>
      )}

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20 px-6 flex flex-col items-center text-center max-w-5xl mx-auto min-h-[90vh] justify-center">
         <div ref={addToObserver} className="mb-8 opacity-0 transition-all duration-300">
             <span className="px-4 py-1.5 rounded-full liquid-glass text-xs font-mono text-blue-300 shadow-lg shadow-blue-500/10 border border-blue-500/20">
                 JAI-NN 2.0 IS LIVE
             </span>
         </div>
         
         {/* Dynamic Text Animation: Highlight A & I, Scrolling texture on rest */}
         <h1 ref={addToObserver} className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter mb-10 leading-none opacity-0 transition-all duration-300 delay-75">
             <div className="flex flex-col md:block">
               <span className="inline-block">
                 <span className="text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">A</span>
                 <span className="img-pattern-bg bg-clip-text text-transparent bg-center animate-text-pan">rtificial</span>
               </span>
               <span className="hidden md:inline">&nbsp;</span>
               <span className="inline-block">
                 <span className="text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]">I</span>
                 <span className="img-pattern-bg bg-clip-text text-transparent bg-center animate-text-pan">ntelligence.</span>
               </span>
             </div>
         </h1>
         
         <div ref={addToObserver} className="max-w-xl text-lg text-white/50 mb-12 font-light leading-relaxed relative mx-auto opacity-0 transition-all duration-300 delay-100">
             Experience the next evolution of AI.
             <br/>
             Precision coding, reasoning, and now image generation in one interface.
         </div>
         
         <div ref={addToObserver} className="flex flex-col sm:flex-row gap-4 w-full justify-center opacity-0 transition-all duration-300 delay-150">
             <button 
                onClick={onEnter}
                className="group px-10 py-4 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform duration-200 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 relative overflow-hidden"
             >
                 <span className="relative z-10 flex items-center gap-2">
                     Start Chatting 
                     <Icon name="send" size={18} />
                 </span>
             </button>
             <button
                onClick={() => onNavigate('creator')} 
                className="px-10 py-4 liquid-glass text-white rounded-full font-bold text-lg hover:bg-white/10 transition-colors"
             >
                 Meet Creator
             </button>
         </div>
      </section>

      {/* What's New Section */}
      <section id="new" className="relative z-10 py-16 px-6">
          <div ref={addToObserver} className="max-w-5xl mx-auto liquid-glass rounded-[40px] p-8 md:p-12 border border-blue-500/20 shadow-2xl shadow-blue-900/10 opacity-0 transition-all duration-300 hover:scale-[1.01]">
              <div className="flex flex-col md:flex-row items-center gap-12">
                  <div className="flex-1 text-left">
                      <div className="inline-block px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold mb-4 border border-blue-500/30">
                          NEW FEATURE
                      </div>
                      <h2 className="text-4xl md:text-5xl font-bold mb-6">
                          Imagine Anything.
                          <br/>
                          <span className="text-blue-500">Instantly.</span>
                      </h2>
                      <p className="text-white/60 text-lg leading-relaxed mb-8">
                          JAI-NN now features a powerful visual engine. Just type 
                          <code className="bg-white/10 px-2 py-0.5 rounded mx-1 text-white border border-white/10">/imagine</code> 
                          followed by your prompt to generate stunning artwork, diagrams, and concepts in seconds.
                      </p>
                      <button onClick={onEnter} className="flex items-center gap-2 text-white font-semibold hover:text-blue-400 transition-colors group">
                          Try Image Generation <Icon name="send" size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                  </div>
                  <div className="flex-1 w-full relative">
                      <div className="aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative group">
                          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                          <div className="absolute inset-0 flex items-center justify-center">
                              <Icon name="image" size={64} className="text-white/20" />
                          </div>
                          <div className="absolute bottom-4 left-4 right-4 liquid-glass p-4 rounded-xl">
                              <div className="text-xs text-white/50 mb-1">Prompt</div>
                              <div className="text-sm text-white font-medium">"A futuristic glass city in the clouds, cyberpunk style, blue and purple lighting"</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>
      
      {/* Features Grid - Added New Features */}
      <section id="features" className="relative z-10 py-24 px-6 md:px-12 bg-black/50 border-t border-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
              <h2 ref={addToObserver} className="text-3xl md:text-5xl font-bold mb-16 text-center opacity-0 transition-all duration-300">
                  Built for Power Users.
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Core Features */}
                  <FeatureCard 
                     icon="mic" color="blue" title="Voice Mode 2.0" 
                     desc="Hands-free interaction. JAI-NN listens and responds with natural language processing." 
                     addToObserver={addToObserver}
                  />
                  <FeatureCard 
                     icon="image" color="purple" title="Visual Engine" 
                     desc="Generate concepts, art, and diagrams instantly. Just ask /imagine." 
                     addToObserver={addToObserver}
                  />
                  <FeatureCard 
                     icon="lock" color="green" title="Secure Core" 
                     desc="Built with privacy first principles. Your sessions are yours alone." 
                     addToObserver={addToObserver}
                  />
                  
                  {/* Extended Features */}
                  <FeatureCard 
                     icon="code" color="orange" title="Smart Sandbox" 
                     desc="Run Python snippets directly in the chat. Visualize data in real-time." 
                     addToObserver={addToObserver} delay={0.15}
                  />
                   <FeatureCard 
                     icon="users" color="pink" title="Real-time Sync" 
                     desc="Collaborate on prompts and share sessions with your team seamlessly across devices." 
                     addToObserver={addToObserver} delay={0.2}
                  />
                  <FeatureCard 
                     icon="globe" color="teal" title="Web Analysis" 
                     desc="JAI-NN can browse the live web to fetch real-time data and citations." 
                     addToObserver={addToObserver} delay={0.25}
                  />

                  {/* New Added Features per request */}
                  <FeatureCard 
                     icon="zap" color="yellow" title="Lightning Latency" 
                     desc="Powered by Gemini Flash 2.5 for near-instant responses on any device." 
                     addToObserver={addToObserver} delay={0.3}
                  />
                  <FeatureCard 
                     icon="shield" color="indigo" title="Enterprise Guard" 
                     desc="SOC2 compliant data handling with custom retention policies for Ultra users." 
                     addToObserver={addToObserver} delay={0.35}
                  />
                   <FeatureCard 
                     icon="download" color="gray" title="Multi-Format Export" 
                     desc="Export your chats to PDF, Markdown, or JSON with a single click." 
                     addToObserver={addToObserver} delay={0.4}
                  />
              </div>
          </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-white/5 bg-black text-center">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-3 opacity-50 hover:opacity-100 transition-opacity">
                  <Icon name="logo" size={20} />
                  <span className="font-semibold tracking-tight">JAI-NN 2.0</span>
              </div>
              <div className="text-white/30 text-sm">
                  © 2025 {CREATOR_INFO.name}. All rights reserved.
              </div>
          </div>
      </footer>
    </div>
  );
};

// Feature Card with Liquid Glass
const FeatureCard = ({ icon, color, title, desc, addToObserver, delay = 0 }: any) => (
    <div 
        ref={addToObserver} 
        className="liquid-glass p-8 rounded-[32px] opacity-0 transition-all hover:-translate-y-2 duration-300 group shadow-lg shadow-black/20"
        style={{ transitionDelay: `${delay}s` }}
    >
        <div className={`w-14 h-14 rounded-2xl bg-${color}-500/10 group-hover:bg-${color}-500/20 flex items-center justify-center mb-6 text-${color}-400 transition-colors border border-${color}-500/20 shadow-lg shadow-${color}-500/5`}>
            <Icon name={icon} size={28} />
        </div>
        <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
        <p className="text-white/60 leading-relaxed text-sm">{desc}</p>
    </div>
);
