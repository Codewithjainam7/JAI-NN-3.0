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
    <div className="min-h-screen w-full bg-black text-white font-sans overflow-y-auto selection:bg-indigo-500/30">
       
       <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-900/10 rounded-full blur-[120px]"></div>
       </div>

       {/* Navbar with Left Aligned Back Button */}
       <nav className="relative z-20 max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
         <button 
            onClick={onBack} 
            className="group px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-3 transition-all"
         >
             <Icon name="arrow-right" size={16} className="rotate-180 text-white/60 group-hover:text-white" />
             <span className="text-sm font-medium font-mono">BACK_TO_BASE</span>
         </button>
         
         <div className="flex items-center gap-2 text-xl font-bold font-mono tracking-tight opacity-50">
             JAI-NN_PRICING
         </div>
       </nav>

       <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-16">
          <div className="text-center mb-20 max-w-3xl mx-auto animate-slide-up">
              <span className="inline-block px-3 py-1 mb-4 rounded border border-white/10 bg-white/5 text-[10px] font-mono tracking-[0.3em] text-white/60">
                 UPGRADE_PATH
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                  Unlock Neural <span className="text-indigo-500">Potency</span>.
              </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
             {PRICING_PLANS.map((plan, idx) => {
                 const isPopular = plan.popular;
                 const isFree = plan.tier === Tier.Free;

                 return (
                     <div 
                        key={plan.name}
                        className={`
                            relative flex flex-col p-8 rounded-[2rem] border transition-all duration-300 animate-slide-up group
                            ${isPopular 
                                ? 'bg-gradient-to-b from-indigo-900/20 to-black border-indigo-500/40 shadow-2xl shadow-indigo-900/20 z-10' 
                                : 'smoked-glass border-white/10 hover:border-white/20'
                            }
                        `}
                        style={{ animationDelay: `${idx * 0.1}s` }}
                     >
                        {!isFree && (
                             <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                                <div className="bg-black/90 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 transform -rotate-6 shadow-2xl">
                                    <span className="text-sm font-bold tracking-widest text-white font-mono">COMING SOON</span>
                                </div>
                             </div>
                         )}

                        {isPopular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg border border-indigo-400">
                                Recommended
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-2 font-mono uppercase tracking-wider">{plan.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">{plan.price}</span>
                                {plan.period && <span className="text-white/50 font-mono text-sm">{plan.period}</span>}
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            {plan.features.map((feat, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm text-white/80 font-mono">
                                    <Icon name="check" size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                                    <span>{feat}</span>
                                </div>
                            ))}
                            {plan.unavailable.map((feat, i) => (
                                <div key={`un-${i}`} className="flex items-start gap-3 text-sm text-white/30 font-mono">
                                    <Icon name="lock" size={16} className="text-white/20 mt-0.5 shrink-0" />
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => onSelectTier(plan.tier)}
                            disabled={!isFree}
                            className={`
                                w-full py-4 rounded-xl text-xs font-bold font-mono tracking-widest transition-all
                                ${isFree
                                    ? 'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10'
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
    </div>
  );
};