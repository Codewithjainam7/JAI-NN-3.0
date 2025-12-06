
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
  { name: 'Blue', value: '#007AFF' },
  { name: 'Purple', value: '#AF52DE' },
  { name: 'Pink', value: '#FF2D55' },
  { name: 'Orange', value: '#FF9500' },
  { name: 'Green', value: '#34C759' },
  { name: 'Teal', value: '#30B0C7' },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  if (!isOpen) return null;

  const canUseSystemInstructions = settings.tier !== Tier.Free;
  const canUseUnlimitedStarters = settings.tier === Tier.Ultra;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 md:p-8 animate-slide-up border border-white/10 max-h-[90vh] overflow-y-auto ios-scrollbar">
        
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-white">Settings</h2>
            <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/60 transition-colors">
                <Icon name="x" size={20} />
            </button>
        </div>

        {/* Profile Section */}
        <div className="mb-8">
            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Profile</h3>
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-xl font-bold text-white border-2 border-white/10 shadow-lg shadow-purple-500/20">
                    J
                </div>
                <div>
                    <div className="font-medium text-white">Jainam User</div>
                    <div className="text-sm text-white/50">user@example.com</div>
                    <div className="mt-2 text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 inline-block border border-blue-500/30">
                        {settings.tier} Plan
                    </div>
                </div>
            </div>
        </div>

        {/* Chat Appearance */}
        <div className="mb-8">
            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon name="sparkles" size={14} />
                Chat Appearance
            </h3>
            
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <label className="block text-sm font-medium text-white mb-3">Accent Color</label>
                <div className="flex flex-wrap gap-3">
                    {ACCENT_COLORS.map(color => (
                        <button
                            key={color.value}
                            onClick={() => onUpdateSettings({ accentColor: color.value })}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${
                                settings.accentColor === color.value 
                                ? 'border-white scale-110 shadow-lg shadow-white/20' 
                                : 'border-transparent hover:scale-105'
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.name}
                        />
                    ))}
                </div>
            </div>
        </div>

        {/* System Intelligence (New) */}
        <div className="mb-8">
            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Icon name="cpu" size={14} />
                System Intelligence
            </h3>
            
            <div className={`p-5 rounded-2xl border transition-all ${canUseSystemInstructions ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/5 opacity-80'}`}>
                <div className="flex items-center justify-between mb-3">
                     <label className="block text-sm font-medium text-white">Custom System Instructions</label>
                     {!canUseSystemInstructions && (
                         <div className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-white/50 flex items-center gap-1">
                             <Icon name="lock" size={10} /> PRO
                         </div>
                     )}
                </div>
                <p className="text-xs text-white/40 mb-3">Define how JAI-NN behaves (e.g., "Be a sarcastic coding wizard").</p>
                <textarea 
                    disabled={!canUseSystemInstructions}
                    placeholder={canUseSystemInstructions ? "e.g., You are a helpful assistant..." : "Upgrade to Pro to unlock custom persona injection."}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 min-h-[100px] resize-none focus:outline-none focus:border-white/30"
                    value={settings.systemInstruction || ''}
                    onChange={(e) => onUpdateSettings({ systemInstruction: e.target.value })}
                />
            </div>

             <div className={`mt-4 p-5 rounded-2xl border transition-all ${canUseSystemInstructions ? 'bg-white/5 border-white/10' : 'bg-white/5 border-white/5 opacity-80'}`}>
                <div className="flex items-center justify-between mb-3">
                     <label className="block text-sm font-medium text-white">Custom Conversation Starters</label>
                     {!canUseUnlimitedStarters && (
                         <div className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-white/50 flex items-center gap-1">
                             <Icon name="lock" size={10} /> {settings.tier === Tier.Pro ? 'ULTRA' : 'PRO'}
                         </div>
                     )}
                </div>
                 <p className="text-xs text-white/40 mb-3">
                    {settings.tier === Tier.Pro ? "You can add up to 2 custom starters." : "Add unlimited custom conversation starters."}
                </p>
                <input 
                    disabled={!canUseSystemInstructions}
                    placeholder="Coming in next update..."
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/50"
                />
            </div>
        </div>

        {/* API Config */}
        <div className="mb-8">
            <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Database & Auth</h3>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                <div className="flex items-center gap-2 text-white/80">
                    <Icon name="lock" size={16} />
                    <span className="text-sm font-medium">Supabase Configuration</span>
                </div>
                <p className="text-xs text-white/40">
                    Supabase integration is ready. Add your <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code> to the environment variables.
                </p>
                <div className="flex gap-2">
                    <input 
                        disabled 
                        type="password" 
                        value="••••••••••••••••" 
                        className="flex-1 bg-black/20 border border-white/10 rounded px-3 py-2 text-sm text-white/30"
                    />
                    <button className="px-3 py-2 bg-white/10 rounded text-sm text-white/60">Edit</button>
                </div>
            </div>
        </div>

        <button onClick={onClose} className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors shadow-lg shadow-white/10">
            Done
        </button>

      </div>
    </div>
  );
};
