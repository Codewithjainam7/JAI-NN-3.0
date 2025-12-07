import React from 'react';
import { UserSettings, Tier, User } from '../types';
import { Icon } from './Icon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (newSettings: Partial<UserSettings>) => void;
  user: User | null;
}

const ACCENT_COLORS = [
  { name: 'OLED Blue', value: '#007AFF', tier: Tier.Free },
  { name: 'Neon Purple', value: '#AF52DE', tier: Tier.Pro },
  { name: 'Cyber Pink', value: '#FF2D55', tier: Tier.Pro },
  { name: 'Sunset Orange', value: '#FF9500', tier: Tier.Pro },
  { name: 'Matrix Green', value: '#34C759', tier: Tier.Ultra },
  { name: 'Electric Teal', value: '#30B0C7', tier: Tier.Ultra },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings, user }) => {
  if (!isOpen) return null;

  const canUseSystemInstructions = settings.tier !== Tier.Free;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl smoked-glass rounded-[2rem] p-8 animate-slide-up max-h-[90vh] overflow-y-auto custom-scrollbar border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
            <h2 className="text-xl font-bold text-white tracking-widest font-mono flex items-center gap-3">
                <Icon name="settings" size={20} className="text-indigo-500" />
                SYSTEM_CONFIG
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                <Icon name="x" size={20} />
            </button>
        </div>

        {/* Identity */}
        <div className="mb-10">
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/5">
                <div className="w-14 h-14 rounded-full bg-indigo-900/50 flex items-center justify-center border border-indigo-500/30 text-indigo-300 font-bold text-xl">
                    {user ? user.name.charAt(0).toUpperCase() : 'G'}
                </div>
                <div>
                    <div className="font-bold text-white font-mono">{user ? user.name : 'GUEST_USER'}</div>
                    <div className="text-xs text-white/40 font-mono tracking-wider">{user ? user.email : 'ID: ANONYMOUS'}</div>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded bg-white/5 border border-white/5 text-[9px] font-mono text-white/60">
                        {settings.tier} LICENSE ACTIVE
                    </span>
                </div>
            </div>
        </div>

        {/* Chat Appearance */}
        <div className="mb-10">
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-4 font-mono">INTERFACE_THEME</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ACCENT_COLORS.map(color => {
                    const isLocked = (color.tier === Tier.Pro && settings.tier === Tier.Free) || 
                                   (color.tier === Tier.Ultra && settings.tier !== Tier.Ultra);
                    return (
                        <button
                            key={color.value}
                            disabled={isLocked}
                            onClick={() => onUpdateSettings({ accentColor: color.value })}
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                settings.accentColor === color.value 
                                ? 'bg-white/10 border-white/30' 
                                : 'bg-transparent border-white/5 hover:bg-white/5'
                            } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="w-4 h-4 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: color.value, color: color.value }}></div>
                            <span className="text-xs font-mono text-white/80">{color.name}</span>
                            {isLocked && <Icon name="lock" size={10} className="ml-auto text-white/20" />}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* System Intelligence */}
        <div className="mb-8">
            <h3 className="text-xs font-bold text-white/30 uppercase tracking-[0.2em] mb-4 font-mono">NEURAL_OVERRIDES</h3>
            
            <div className={`p-5 rounded-2xl border mb-4 transition-all ${canUseSystemInstructions ? 'bg-white/5 border-white/5' : 'bg-transparent border-white/5 opacity-60'}`}>
                <div className="flex justify-between mb-2">
                    <label className="text-xs font-mono text-white/70">SYSTEM_INSTRUCTION (PERSONA)</label>
                    {!canUseSystemInstructions && <Icon name="lock" size={12} className="text-white/30" />}
                </div>
                <textarea 
                    disabled={!canUseSystemInstructions}
                    value={settings.systemInstruction || ''}
                    onChange={(e) => onUpdateSettings({ systemInstruction: e.target.value })}
                    placeholder={canUseSystemInstructions ? "Define AI behavior protocols..." : "Unlock Pro to access Neural Configuration."}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm font-mono text-white/80 placeholder-white/20 focus:border-indigo-500/50 outline-none h-24 resize-none"
                />
            </div>
        </div>

        <button onClick={onClose} className="w-full py-3 rounded-xl bg-white text-black font-bold font-mono tracking-widest hover:bg-indigo-50 transition-colors">
            SAVE_CONFIG
        </button>
      </div>
    </div>
  );
};