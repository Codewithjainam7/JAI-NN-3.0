import React, { useState, useEffect } from 'react';
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
  const [displayName, setDisplayName] = useState(settings.displayName || (user?.name || ''));
  const [signature, setSignature] = useState(settings.signature || '');
  const [language, setLanguage] = useState(settings.language || 'en');
  const [timezone, setTimezone] = useState(settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(settings.avatarUrl || null);

  useEffect(() => {
    setCustomPrompts(settings.customStarters || DEFAULT_PROMPTS);
    setDisplayName(settings.displayName || (user?.name || ''));
    setSignature(settings.signature || '');
    setLanguage(settings.language || 'en');
    setTimezone(settings.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
    setAvatarPreview(settings.avatarUrl || null);
  }, [settings, user]);

  if (!isOpen) return null;

  const canUseSystemInstructions = settings.tier !== Tier.Free;
  const canUseCustomPrompts = settings.tier !== Tier.Free;
  const canUseAdvancedSettings = settings.tier !== Tier.Free;

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

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result || '');
      setAvatarPreview(url);
      // Save preview url to settings; real upload should be handled by backend separately
      onUpdateSettings({ avatarUrl: url });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveBasic = () => {
    onUpdateSettings({
      displayName: displayName.trim(),
      signature: signature.trim(),
      language,
      timezone
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl smoked-glass rounded-3xl p-6 sm:p-8 animate-slide-up max-h-[90vh] overflow-y-auto custom-scrollbar shadow-[0_0_50px_rgba(10,132,255,0.1)] border border-white/10">
        
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                <Icon name="settings" size={20} className="text-blue-400" />
                Settings
            </h2>
            <div className="flex items-center gap-3">
              <button onClick={handleSaveBasic} className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm">Save</button>
              <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-white/40 transition-colors">
                <Icon name="x" size={18} />
              </button>
            </div>
        </div>

        {/* User Identity / Personalization */}
        <div className="mb-6">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Profile</h3>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-xl shadow-lg overflow-hidden">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      (user ? user.name.charAt(0).toUpperCase() : 'G')
                    )}
                </div>
                <div className="flex-1">
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Display name"
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-2 text-sm text-white placeholder-white/30 outline-none mb-2"
                    />
                    <input
                      type="text"
                      value={signature}
                      onChange={(e) => setSignature(e.target.value)}
                      placeholder="Signature (shown in exports)"
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-2 text-sm text-white placeholder-white/30 outline-none"
                    />
                    <div className="flex items-center gap-2 mt-2 text-xs text-white/40">
                      <label className="flex items-center gap-2">
                        <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" id="avatar-upload" />
                        <button onClick={() => document.getElementById('avatar-upload')?.click()} className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs">Upload Avatar</button>
                      </label>
                      <span>Preferred name and small signature that will appear on exported chat logs.</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Accent Colors */}
        <div className="mb-6">
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

        {/* Personalization - Language / Timezone */}
        <div className="mb-6">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Personalization</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/60 mb-2 block">Language</label>
                  <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-2 text-sm text-white outline-none">
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="zh">Chinese</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-white/60 mb-2 block">Timezone</label>
                  <input value={timezone} onChange={(e) => setTimezone(e.target.value)} className="w-full bg-black/50 border border-white/10 rounded-xl p-2 text-sm text-white outline-none" />
                </div>
            </div>
        </div>

        {/* Response Style */}
        <div className="mb-6">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Response Style</h3>
            <div className="grid grid-cols-2 gap-3">
                {[
                    { id: 'balanced', name: 'Balanced', desc: 'Mix of detail and brevity', icon: 'sparkles' },
                    { id: 'detailed', name: 'Detailed', desc: 'Comprehensive explanations', icon: 'brain' },
                    { id: 'concise', name: 'Concise', desc: 'Quick and to the point', icon: 'zap' },
                    { id: 'creative', name: 'Creative', desc: 'Imaginative responses', icon: 'palette' }
                ].map(style => (
                    <button
                        key={style.id}
                        onClick={() => onUpdateSettings({ responseStyle: style.id as any })}
                        className={`p-4 rounded-xl border transition-all text-left ${
                            settings.responseStyle === style.id || (!settings.responseStyle && style.id === 'balanced')
                                ? 'bg-white/10 border-white/30 shadow-lg' 
                                : 'bg-transparent hover:bg-white/5 border-white/10'
                        }`}
                    >
                        <Icon name={style.icon as any} size={18} className="mb-2 text-blue-400" />
                        <div className="font-semibold text-sm text-white mb-1">{style.name}</div>
                        <div className="text-xs text-white/50">{style.desc}</div>
                    </button>
                ))}
            </div>
        </div>

        {/* System Instructions */}
        <div className="mb-6">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">System Instructions</h3>
            
            <div className={`p-4 rounded-2xl border transition-all ${canUseSystemInstructions ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-60'}`}>
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
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-white/80 placeholder-white/20 outline-none h-28 resize-none focus:border-blue-500/50 transition-colors"
                />
            </div>
        </div>

        {/* Quick Prompts */}
        <div className="mb-6">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-4">Quick Start Prompts</h3>
            
            <div className={`p-4 rounded-2xl border transition-all ${canUseCustomPrompts ? 'bg-white/5 border-white/10' : 'bg-transparent border-white/5 opacity-60'}`}>
                {canUseCustomPrompts ? (
                    <>
                        <div className="flex gap-2 mb-3">
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
                                <Icon name="plus" size={14} />
                            </button>
                        </div>
                        
                        <div className="space-y-2 max-h-40 overflow-y-auto">
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
        <div className="mt-4">
          <button 
              onClick={handleSaveBasic} 
              className="w-full py-3 rounded-xl font-bold tracking-wide transition-all bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-blue-500/30"
          >
              Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};
