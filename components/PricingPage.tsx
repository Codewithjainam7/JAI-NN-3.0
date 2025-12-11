import React from 'react';
import { Icon } from './Icon';
import { PRICING_PLANS } from '../constants';
import { Tier } from '../types';

interface PricingPageProps {
  onBack: () => void;
  onSelectTier: (tier: Tier) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onBack, onSelectTier }) => {
  return (
    <div className="min-h-screen w-full bg-black text-white font-sans overflow-y-auto overflow-x-hidden selection:bg-indigo-500/30 relative">
       
       <div className="fixed inset-0 z-0 pointer-events-none ios26-gradient">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]"></div>
       </div>

       {/* Navbar */}
       <nav className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 py-8 flex items-center justify-between">
         <button 
            onClick={onBack} 
            className="group px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-3 transition-all"
         >
             <Icon name="arrow-right" size={16} className="rotate-180 text-white/60 group-hover:text-white" />
             <span className="text-sm font-medium">Back</span>
         </button>
         
         <div className="flex items-center gap-2 text-xl font-bold tracking-tight opacity-50">
             JAI-NN 3.0
         </div>
       </nav>

       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
          <div className="text-center mb-20 max-w-3xl mx-auto animate-slide-up">
              <span className="inline-block px-4 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 text-[11px] font-bold tracking-wider text-white/60">
                 CHOOSE YOUR PLAN
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight">
                  Unlock Neural <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Power</span>
              </h1>
              <p className="text-white/60 text-base sm:text-lg">Select the perfect plan for your AI journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
             {PRICING_PLANS.map((plan, idx) => {
                 const isPopular = plan.popular;
                 const isFree = plan.tier === Tier.Free;

                 return (
                     <div 
                        key={plan.name}
                        className={`
                            relative flex flex-col p-6 lg:p-8 rounded-[2rem] border transition-all duration-300 animate-slide-up group
                            ${isPopular 
                                ? 'bg-gradient-to-b from-indigo-900/20 to-black border-indigo-500/40 shadow-2xl shadow-indigo-900/20 z-10 scale-105' 
                                : 'smoked-glass border-white/10 hover:border-white/20'
                            }
                        `}
                        style={{ animationDelay: `${idx * 0.1}s` }}
                     >
                        {!isFree && (
                             <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none rounded-[2rem]">
                                <div className="bg-black/90 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 transform -rotate-6 shadow-2xl">
                                    <span className="text-sm font-bold tracking-widest text-white">COMING SOON</span>
                                </div>
                             </div>
                         )}

                        {isPopular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg border border-indigo-400">
                                Recommended
                            </div>
                        )}

                        <div className="mb-6">
                            <h3 className="text-2xl font-bold text-white mb-2 uppercase tracking-wide">{plan.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-bold text-white">{plan.price}</span>
                                {plan.period && <span className="text-white/50 text-base">{plan.period}</span>}
                            </div>
                        </div>

                        <div className="flex-1 space-y-3 mb-8">
                            {plan.features.map((feat, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm text-white/80">
                                    <Icon name="check" size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <span>{feat}</span>
                                </div>
                            ))}
                            {plan.unavailable.map((feat, i) => (
                                <div key={`un-${i}`} className="flex items-start gap-3 text-sm text-white/30">
                                    <Icon name="lock" size={16} className="text-white/20 mt-0.5 shrink-0" />
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => onSelectTier(plan.tier)}
                            disabled={!isFree}
                            className={`
                                w-full py-4 rounded-xl text-sm font-bold tracking-widest transition-all
                                ${isFree
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/30'
                                    : 'bg-white/5 text-white/40 cursor-not-allowed border border-white/5'
                                }
                            `}
                        >
                            {plan.cta}
                        </button>
                     </div>
                 );
             })}
          </div>
       </div>

       <footer className="relative z-10 border-t border-white/10 py-8 text-center text-white/40 text-xs sm:text-sm px-4 mt-20">
        <p>JAI-NN 3.0 • Powered by Gemini 2.5 • Built with ❤️</p>
      </footer>
    </div>
  );
};
