import React, { useState } from 'react';
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
  { name: 'iOS Blue', value: '#0A84FF', tier: Tier.Free },
  { name: 'Deep Blue', value: '#0051D5', tier: Tier.Free },
  { name: 'Royal Purple', value: '#5E5CE6', tier: Tier.Free },
  { name: 'Cyan', value: '#32D3E8', tier: Tier.Pro },
  { name: 'Mint Green', value: '#30D158', tier: Tier.Pro },
  { name: 'Orange', value: '#FF9F0A', tier: Tier.Pro },
  { name: 'Pink', value: '#FF2D55', tier: Tier.Ultra },
  { name: 'Indigo', value: '#5856D6', tier: Tier.Ultra },
  { name: 'Teal', value: '#40C8E0', tier: Tier.Ultra },
];

const DEFAULT_PROMPTS = [
  "Explain quantum computing in simple terms",
  "Write a creative story about AI",
  "Help me debug this code",
  "Suggest a healthy meal plan",
  "Create a workout routine",
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings, user }) => {
  const [customPrompts, setCustomPrompts] = useState<string[]>(settings.customStarters || DEFAULT_PROMPTS);
  const [newPrompt, setNewPrompt] = useState('');

  if (!isOpen) return null;

  const canUseSystemInstructions = settings.tier !== Tier.Free;
  const canUseCustomPrompts = settings.tier !== Tier.Free;

  const handleAddPrompt = () => {
    if (newPrompt.trim() && customPrompts.length < 10) {
      const updated = [...customPrompts, newPrompt.trim()];
      setCustomPrompts(updated);
      onUpdateSettings({ customStarters: updated });
      setNewPrompt('');
    }
  };

  const handleRemovePrompt = (index: number) => {
    const updated = customPrompts.filter((_, i) => i !== index);
    setCustomPrompts(updated);
    onUpdateSettings({ customStarters: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl smoked-glass rounded-[2rem] p-6 sm:p-8 animate-slide-up max-h-[90vh] overflow-y-auto custom-scrollbar shadow-[0_0_50px_rgba(10,132,255,0.1)] border border-white/10">
        
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                <Icon name="settings" size={20} className="text-blue-400" />
                Settings
            </h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                <Icon name="x" size={20} />
            </button>
        </div>

        {/* User Identity */}
        <div className="mb-8">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Profile</h3>
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xl shadow-lg">
                    {user ? user.name.charAt(0).toUpperCase() : 'G'}
                </div>
                <div className="flex-1">
                    <div className="font-bold text-white">{user ? user.name : 'GUEST USER'}</div>
                    <div className="text-xs text-white/40">{user ? user.email : 'ID: ANONYMOUS'}</div>
                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-400 tracking-wider">
                        {settings.tier} TIER
                    </span>
                </div>
            </div>
        </div>

        {/* Accent Colors */}
        <div className="mb-8">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Accent Color</h3>
            <div className="grid grid-cols-3 gap-3">
                {ACCENT_COLORS.map(color => {
                    const isLocked = (color.tier === Tier.Pro && settings.tier === Tier.Free) || 
                                   (color.tier === Tier.Ultra && settings.tier !== Tier.Ultra);
                    return (
                        <button
                            key={color.value}
                            disabled={isLocked}
                            onClick={() => onUpdateSettings({ accentColor: color.value })}
                            className={`relative flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                settings.accentColor === color.value 
                                ? 'bg-white/10 border-white/30 shadow-lg' : 'bg-transparent hover:bg-white/5 border-white/10'
                            } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div 
                                className="w-8 h-8 rounded-lg shadow-lg" 
                                style={{ 
                                    backgroundColor: color.value,
                                    boxShadow: `0 0 20px ${color.value}40`
                                }}
                            ></div>
                            <span className="text-xs font-medium text-white/80 flex-1 text-left">{color.name}</span>
                            {isLocked && <Icon name="lock" size={12} className="text-white/20 absolute top-2 right-2" />}
                            {settings.accentColor === color.value && <Icon name="check" size={14} className="text-white absolute top-2 right-2" />}
                        </button>
                    );
                })}
            </div>
        </div>

        {/* System Instructions */}
        <div className="mb-8">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">System Instructions</h3>
            
            <div className={`p-5 rounded-2xl border transition-all ${canUseSystemInstructions ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-60'}`}>
                <div className="flex justify-between items-center mb-3">
                    <label className="text-sm font-medium text-white/70">Custom AI Behavior</label>
                    {!canUseSystemInstructions && (
                        <div className="flex items-center gap-2 text-xs text-white/40">
                            <Icon name="lock" size={12} />
                            <span>Pro Feature</span>
                        </div>
                    )}
                </div>
                <textarea 
                    disabled={!canUseSystemInstructions}
                    value={settings.systemInstruction || ''}
                    onChange={(e) => onUpdateSettings({ systemInstruction: e.target.value })}
                    placeholder={canUseSystemInstructions ? "e.g., You are a helpful coding assistant that explains concepts clearly..." : "Upgrade to Pro to customize AI personality and behavior"}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white/80 placeholder-white/20 outline-none h-32 resize-none focus:border-blue-500/50 transition-colors"
                />
            </div>
        </div>

        {/* Custom Prompts */}
        <div className="mb-8">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Quick Start Prompts</h3>
            
            <div className={`p-5 rounded-2xl border transition-all ${canUseCustomPrompts ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-60'}`}>
                {canUseCustomPrompts ? (
                    <>
                        <div className="flex gap-2 mb-4">
                            <input 
                                type="text"
                                value={newPrompt}
                                onChange={(e) => setNewPrompt(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddPrompt()}
                                placeholder="Add a custom quick prompt..."
                                className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white/80 placeholder-white/20 outline-none focus:border-blue-500/50 transition-colors"
                                maxLength={100}
                            />
                            <button 
                                onClick={handleAddPrompt}
                                disabled={!newPrompt.trim() || customPrompts.length >= 10}
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                            >
                                <Icon name="plus" size={16} />
                            </button>
                        </div>
                        
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {customPrompts.map((prompt, i) => (
                                <div key={i} className="flex items-center gap-2 bg-black/30 rounded-lg px-3 py-2 group">
                                    <span className="flex-1 text-sm text-white/70 truncate">{prompt}</span>
                                    <button 
                                        onClick={() => handleRemovePrompt(i)}
                                        className="p-1 hover:bg-white/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Icon name="trash" size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-white/30 mt-3">{customPrompts.length}/10 prompts</p>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <Icon name="lock" size={32} className="mx-auto mb-3 text-white/20" />
                        <p className="text-sm text-white/40">Upgrade to Pro to create custom quick prompts</p>
                    </div>
                )}
            </div>
        </div>

        {/* Save Button */}
        <button 
            onClick={onClose} 
            className="w-full py-3 rounded-xl font-bold tracking-wide transition-all bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/30"
        >
            Save Changes
        </button>
      </div>
    </div>
  );
};
