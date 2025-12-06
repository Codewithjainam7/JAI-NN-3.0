
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
    <div className="min-h-screen w-full bg-black text-white font-sans overflow-y-auto selection:bg-blue-500/30">
       
       {/* Background Ambience */}
       <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]"></div>
       </div>

       {/* Header */}
       <nav className="relative z-20 max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-bold">
             <Icon name="logo" size={24} />
             JAI-NN
         </div>
         <button onClick={onBack} className="px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-2 transition-colors">
             <Icon name="home" size={16} />
             <span className="text-sm font-medium">Back to Home</span>
         </button>
       </nav>

       <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-20">
          <div className="text-center mb-16 max-w-3xl mx-auto animate-slide-up">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                  Simple, transparent <span className="text-blue-500">pricing</span>.
              </h1>
              <p className="text-xl text-white/50">
                  Choose the plan that fits your needs. No hidden fees. Cancel anytime.
              </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
             {PRICING_PLANS.map((plan, idx) => {
                 const isPopular = plan.popular;
                 const isFree = plan.tier === Tier.Free;

                 return (
                     <div 
                        key={plan.name}
                        className={`
                            relative flex flex-col p-8 rounded-[32px] border transition-all duration-300 animate-slide-up
                            ${isPopular 
                                ? 'bg-gradient-to-b from-blue-900/20 to-black border-blue-500/30 shadow-2xl shadow-blue-900/20 scale-105 z-10' 
                                : 'glass-panel border-white/10 hover:border-white/20'
                            }
                        `}
                        style={{ animationDelay: `${idx * 0.1}s` }}
                     >
                        {!isFree && (
                             <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
                                <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full border border-white/10 transform -rotate-6 shadow-2xl">
                                    <span className="text-sm font-bold tracking-widest text-white">COMING SOON</span>
                                </div>
                             </div>
                         )}

                        {isPopular && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#007AFF] text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <div className="mb-8">
                            <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-4xl font-bold text-white">{plan.price}</span>
                                {plan.period && <span className="text-white/50">{plan.period}</span>}
                            </div>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                            {plan.features.map((feat, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm text-white/90">
                                    <Icon name="check" size={18} className="text-[#34C759] mt-0.5 shrink-0" />
                                    <span>{feat}</span>
                                </div>
                            ))}
                            {plan.unavailable.map((feat, i) => (
                                <div key={`un-${i}`} className="flex items-start gap-3 text-sm text-white/30">
                                    <Icon name="lock" size={18} className="text-white/20 mt-0.5 shrink-0" />
                                    <span>{feat}</span>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => onSelectTier(plan.tier)}
                            disabled={!isFree}
                            className={`
                                w-full py-4 rounded-xl text-sm font-bold transition-all
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

          {/* Comparison Table Section (Optional Visual Filler) */}
          <div className="mt-24 pt-12 border-t border-white/5 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-2xl font-bold text-center mb-12">Compare Plans</h3>
              <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                      <thead>
                          <tr>
                              <th className="p-4 text-white/40 font-normal border-b border-white/10 w-1/4">Feature</th>
                              <th className="p-4 text-white font-bold border-b border-white/10 text-center w-1/4">Free</th>
                              <th className="p-4 text-blue-400 font-bold border-b border-white/10 text-center w-1/4">Pro</th>
                              <th className="p-4 text-purple-400 font-bold border-b border-white/10 text-center w-1/4">Ultra</th>
                          </tr>
                      </thead>
                      <tbody className="text-sm">
                          <tr>
                              <td className="p-4 border-b border-white/5 text-white/80">Monthly Tokens</td>
                              <td className="p-4 border-b border-white/5 text-center text-white/60">10k</td>
                              <td className="p-4 border-b border-white/5 text-center text-white">100k</td>
                              <td className="p-4 border-b border-white/5 text-center text-white font-bold">Unlimited</td>
                          </tr>
                           <tr>
                              <td className="p-4 border-b border-white/5 text-white/80">Image Generation</td>
                              <td className="p-4 border-b border-white/5 text-center text-white/60">5 / day</td>
                              <td className="p-4 border-b border-white/5 text-center text-white">50 / day</td>
                              <td className="p-4 border-b border-white/5 text-center text-white font-bold">Unlimited</td>
                          </tr>
                           <tr>
                              <td className="p-4 border-b border-white/5 text-white/80">Models</td>
                              <td className="p-4 border-b border-white/5 text-center text-white/60">Flash 2.5</td>
                              <td className="p-4 border-b border-white/5 text-center text-white">Pro + Flash</td>
                              <td className="p-4 border-b border-white/5 text-center text-white font-bold">Pro + Flash</td>
                          </tr>
                          <tr>
                              <td className="p-4 border-b border-white/5 text-white/80">Support</td>
                              <td className="p-4 border-b border-white/5 text-center text-white/60">Community</td>
                              <td className="p-4 border-b border-white/5 text-center text-white">Priority</td>
                              <td className="p-4 border-b border-white/5 text-center text-white font-bold">24/7 Dedicated</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>
       </div>
    </div>
  );
};
