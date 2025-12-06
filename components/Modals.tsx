
import React, { useState } from 'react';
import { ModelId, Tier, UserSettings } from '../types';
import { MODELS, PRICING_PLANS } from '../constants';
import { Icon } from './Icon';

// --- Login Modal ---
interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative w-full max-w-md glass-panel rounded-3xl p-8 animate-slide-up border border-white/10">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-600/20 flex items-center justify-center">
                        <Icon name="logo" size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-white/50 text-sm">Sign in to sync your history and settings</p>
                </div>

                <button 
                    onClick={onLogin}
                    className="w-full py-3 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-3 hover:bg-white/90 transition-colors mb-4"
                >
                    <Icon name="google" size={20} />
                    Continue with Google
                </button>
                
                <button 
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-white/5 text-white font-medium hover:bg-white/10 transition-colors"
                >
                    Continue as Guest
                </button>
            </div>
        </div>
    );
};


// --- Pricing Modal ---

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: Tier;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, currentTier }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl glass-panel rounded-3xl p-6 md:p-10 animate-slide-up max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between mb-8">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                    Upgrade your experience
                </h2>
                <p className="text-white/60">Unlock advanced models, image generation, and more.</p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 transition-colors">
                <Icon name="chevron-down" size={24} />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => {
             const isCurrent = plan.tier === currentTier;
             const isFree = plan.tier === Tier.Free;
             const isUpcoming = true; // All paid plans coming soon per prompt

             return (
               <div key={plan.name} className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300
                    ${isCurrent 
                        ? 'bg-white/5 border-white/20' 
                        : plan.popular 
                            ? 'bg-gradient-to-b from-blue-900/20 to-transparent border-blue-500/30' 
                            : 'glass-panel-light border-white/5'
                    }
               `}>
                  {!isFree && (
                      <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-2xl">
                          <div className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold tracking-widest text-white shadow-xl">
                              COMING SOON
                          </div>
                      </div>
                  )}

                  {plan.popular && (
                      <div className="absolute -top-3 left-6 px-3 py-1 bg-[#007AFF] rounded-full text-[10px] font-bold tracking-wider uppercase shadow-lg text-white">
                          Most Popular
                      </div>
                  )}
                  
                  <div className="mb-4">
                      <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-3xl font-bold text-white">{plan.price}</span>
                          {plan.period && <span className="text-sm text-white/50">{plan.period}</span>}
                      </div>
                  </div>

                  <div className="h-px bg-white/10 w-full mb-6"></div>

                  <div className="flex-1 space-y-4 mb-8">
                      {plan.features.map((feat, i) => (
                          <div key={i} className="flex items-start gap-3 text-sm text-white/90">
                              <Icon name="check" size={16} className="text-[#34C759] mt-0.5 shrink-0" />
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
                    disabled={isCurrent || !isFree}
                    className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all relative overflow-hidden group
                        ${isCurrent 
                            ? 'bg-white/10 text-white/50 cursor-default' 
                            : 'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/10'
                        }`}
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

// --- Model Selector Sheet ---

interface ModelSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: ModelId;
  userTier: Tier;
  onSelect: (id: ModelId) => void;
  onUpgrade: () => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({ isOpen, onClose, currentModel, userTier, onSelect, onUpgrade }) => {
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
        <div className="relative w-full max-w-sm glass-panel rounded-3xl p-6 animate-slide-up">
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6"></div>
          
          <h3 className="text-lg font-bold text-center mb-6">Select Model</h3>
          
          <div className="space-y-3">
             {MODELS.map(model => {
                 const isLocked = !model.tiers.includes(userTier);
                 const isSelected = currentModel === model.id;
                 
                 return (
                     <button
                        key={model.id}
                        onClick={() => {
                            if (isLocked) {
                                onClose();
                                onUpgrade();
                            } else {
                                onSelect(model.id);
                                onClose();
                            }
                        }}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all
                            ${isSelected 
                                ? 'bg-blue-500/20 border-blue-500/50 shadow-lg shadow-blue-500/10' 
                                : 'bg-white/5 border-white/5 hover:bg-white/10'
                            }
                            ${isLocked ? 'opacity-70' : ''}
                        `}
                     >
                         <div className="flex items-center gap-4 text-left">
                             <span className="text-2xl">{model.icon}</span>
                             <div>
                                 <div className="font-semibold text-sm">{model.name}</div>
                                 <div className="text-xs text-white/50">{model.description}</div>
                             </div>
                         </div>
                         
                         {isLocked ? (
                             <div className="px-2 py-1 bg-white/10 rounded-md text-[10px] font-bold tracking-wide flex items-center gap-1">
                                 <Icon name="lock" size={10} />
                                 PRO
                             </div>
                         ) : isSelected ? (
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                                <Icon name="check" size={12} className="text-white" />
                            </div>
                         ) : null}
                     </button>
                 );
             })}
          </div>
        </div>
      </div>
    );
  };
