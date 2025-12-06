
import React, { useState } from 'react';
import { UserSettings, Tier } from '../types';
import { Icon } from './Icon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
}

const ACCENT_COLORS = [
  { name: 'Default Blue', value: '#007AFF', tier: Tier.Free },
  { name: 'Neon Purple', value: '#AF52DE', tier: Tier.Pro },
  { name: 'Cyber Pink', value: '#FF2D55', tier: Tier.Pro },
  { name: 'Sunset Orange', value: '#FF9500', tier: Tier.Pro },
  { name: 'Emerald Green', value: '#34C759', tier: Tier.Ultra },
  { name: 'Electric Teal', value: '#30B0C7', tier: Tier.Ultra },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  if (!isOpen) return null;

  const canUseSystemInstructions = settings.tier !== Tier.Free;
  const canUseUnlimitedStarters = settings.tier === Tier.Ultra;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 md:p-8 animate-slide-up border border-white/10 max-h-[90vh] overflow-y-auto ios-scrollbar shadow-2xl shadow-blue-900/10">
        
        <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 transition-colors">
                <Icon name="x" size={20} />
            </button>
        </div>

        {/* Profile Section */}
        <div className="mb-8">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">Account</h3>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-lg font-bold text-white border-2 border-white/10 shadow-lg shadow-purple-500/20">
                    JJ
                </div>
                <div>
                    <div className="font-medium text-white text-lg">Jainam User</div>
                    <div className="text-sm text-white/50">user@example.com</div>
                    <div className="mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 inline-block border border-blue-500/30 uppercase tracking-wide">
                        {settings.tier} Plan
                    </div>
                </div>
            </div>
        </div>

        {/* Chat Appearance (New) */}
        <div className="mb-8">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Icon name="sparkles" size={14} />
                Chat Appearance
            </h3>
            
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                <label className="block text-sm font-medium text-white mb-4">Interface Accent Color</label>
                <div className="flex flex-wrap gap-4">
                    {ACCENT_COLORS.map(color => {
                        const isLocked = (color.tier === Tier.Pro && settings.tier === Tier.Free) || 
                                       (color.tier === Tier.Ultra && settings.tier !== Tier.Ultra);
                        
                        return (
                            <button
                                key={color.value}
                                disabled={isLocked}
                                onClick={() => onUpdateSettings({ accentColor: color.value })}
                                className={`group relative w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                                    settings.accentColor === color.value 
                                    ? 'border-white scale-110 shadow-lg shadow-white/20' 
                                    : 'border-transparent hover:scale-105'
                                } ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                style={{ backgroundColor: color.value }}
                                title={color.name}
                            >
                                {isLocked && <Icon name="lock" size={14} className="text-black/50" />}
                                {settings.accentColor === color.value && !isLocked && <Icon name="check" size={16} className="text-white drop-shadow-md" />}
                            </button>
                        );
                    })}
                </div>
                <p className="text-xs text-white/30 mt-4">
                    Unlock additional themes with Pro and Ultra tiers.
                </p>
            </div>
        </div>

        {/* System Intelligence */}
        <div className="mb-8">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Icon name="cpu" size={14} />
                System Intelligence
            </h3>
            
            <div className={`p-6 rounded-2xl border transition-all mb-4 ${canUseSystemInstructions ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/5 opacity-80'}`}>
                <div className="flex items-center justify-between mb-3">
                     <label className="block text-sm font-medium text-white">System Persona</label>
                     {!canUseSystemInstructions && (
                         <div className="px-2 py-1 rounded bg-white/10 text-[10px] font-bold text-white/50 flex items-center gap-1 border border-white/5">
                             <Icon name="lock" size={10} /> PRO
                         </div>
                     )}
                </div>
                <p className="text-xs text-white/40 mb-3">Define a custom persona or set of rules for JAI-NN to follow globally.</p>
                <textarea 
                    disabled={!canUseSystemInstructions}
                    placeholder={canUseSystemInstructions ? "e.g., You are a senior engineer who loves concise code..." : "Upgrade to Pro to unlock custom persona injection."}
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 min-h-[100px] resize-none focus:outline-none focus:border-blue-500/50 transition-colors"
                    value={settings.systemInstruction || ''}
                    onChange={(e) => onUpdateSettings({ systemInstruction: e.target.value })}
                />
            </div>

             <div className={`p-6 rounded-2xl border transition-all ${canUseSystemInstructions ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/5 opacity-80'}`}>
                <div className="flex items-center justify-between mb-3">
                     <label className="block text-sm font-medium text-white">Conversation Starters</label>
                     {!canUseUnlimitedStarters && (
                         <div className="px-2 py-1 rounded bg-white/10 text-[10px] font-bold text-white/50 flex items-center gap-1 border border-white/5">
                             <Icon name="lock" size={10} /> {settings.tier === Tier.Pro ? 'ULTRA' : 'PRO'}
                         </div>
                     )}
                </div>
                 <p className="text-xs text-white/40 mb-3">
                    Customize the quick-start prompts on the empty chat screen.
                </p>
                <input 
                    disabled={!canUseUnlimitedStarters}
                    placeholder="Coming in next update..."
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/50 focus:outline-none"
                />
            </div>
        </div>

        <button onClick={onClose} className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-colors shadow-lg shadow-white/10">
            Save Changes
        </button>

      </div>
    </div>
  );
};
