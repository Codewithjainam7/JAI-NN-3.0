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
  { name: 'iOS Blue', value: '#007AFF', tier: Tier.Free },
  { name: 'Deep Blue', value: '#0051D5', tier: Tier.Free },
  { name: 'Royal Blue', value: '#1d4ed8', tier: Tier.Pro },
  { name: 'Sky Blue', value: '#3b82f6', tier: Tier.Pro },
  { name: 'Midnight', value: '#1e3a8a', tier: Tier.Ultra },
  { name: 'Arctic', value: '#60a5fa', tier: Tier.Ultra },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings, user }) => {
  if (!isOpen) return null;

  const canUseSystemInstructions = settings.tier !== Tier.Free;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl smoked-glass rounded-[2rem] p-8 animate-slide-up max-h-[90vh] overflow-y-auto custom-scrollbar shadow-[0_0_50px_rgba(0,122,255,0.1)]" style={{ borderColor: 'rgba(0, 122, 255, 0.2)' }}>
        
        <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor: 'rgba(0, 122, 255, 0.1)' }}>
            <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-3">
                <Icon name="settings" size={20} style={{ color: '#007AFF' }} />
                SYSTEM CONFIG
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                <Icon name="x" size={20} />
            </button>
        </div>

        {/* Identity */}
        <div className="mb-10">
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border" style={{ borderColor: 'rgba(0, 122, 255, 0.1)' }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center border font-semibold text-xl" style={{ background: 'rgba(0, 122, 255, 0.1)', borderColor: 'rgba(0, 122, 255, 0.3)', color: '#3b82f6' }}>
                    {user ? user.name.charAt(0).toUpperCase() : 'G'}
                </div>
                <div>
                    <div className="font-semibold text-white">{user ? user.name : 'GUEST USER'}</div>
                    <div className="text-xs text-white/40">{user ? user.email : 'ID: ANONYMOUS'}</div>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded border text-[9px] text-white/60" style={{ background: 'rgba(0, 122, 255, 0.05)', borderColor: 'rgba(0, 122, 255, 0.2)' }}>
                        {settings.tier} LICENSE
                    </span>
                </div>
            </div>
        </div>

        {/* Chat Appearance */}
        <div className="mb-10">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">INTERFACE THEME</h3>
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
                                ? 'bg-white/10' : 'bg-transparent hover:bg-white/5'
                            } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            style={{ 
                                borderColor: settings.accentColor === color.value ? 'rgba(0, 122, 255, 0.4)' : 'rgba(255, 255, 255, 0.05)'
                            }}
                        >
                            <div className="w-4 h-4 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: color.value, color: color.value }}></div>
                            <span className="text-xs font-medium text-white/80">{color.name}</span>
                            {isLocked && <Icon name="lock" size={10} className="ml-auto text-white/20" />}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* System Intelligence */}
        <div className="mb-8">
            <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">NEURAL OVERRIDES</h3>
            
            <div className={`p-5 rounded-2xl border mb-4 transition-all ${canUseSystemInstructions ? 'bg-white/5' : 'bg-transparent opacity-60'}`} style={{ borderColor: 'rgba(0, 122, 255, 0.1)' }}>
                <div className="flex justify-between mb-2">
                    <label className="text-xs font-medium text-white/70">SYSTEM INSTRUCTION (PERSONA)</label>
                    {!canUseSystemInstructions && <Icon name="lock" size={12} className="text-white/30" />}
                </div>
                <textarea 
                    disabled={!canUseSystemInstructions}
                    value={settings.systemInstruction || ''}
                    onChange={(e) => onUpdateSettings({ systemInstruction: e.target.value })}
                    placeholder={canUseSystemInstructions ? "Define AI behavior protocols..." : "Unlock Pro to access Neural Configuration."}
                    className="w-full bg-black/50 border rounded-lg p-3 text-sm text-white/80 placeholder-white/20 outline-none h-24 resize-none"
                    style={{ borderColor: 'rgba(0, 122, 255, 0.2)' }}
                />
            </div>
        </div>

        <button 
            onClick={onClose} 
            className="w-full py-3 rounded-xl font-semibold tracking-wide transition-all"
            style={{ 
                background: 'linear-gradient(135deg, #007AFF 0%, #0051D5 100%)',
                color: '#ffffff'
            }}
        >
            SAVE CONFIG
        </button>
      </div>
    </div>
  );
};
