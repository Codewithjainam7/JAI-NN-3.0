
import React, { useState } from 'react';
import { Icon } from './Icon';
import { ChatSession, Tier } from '../types';

interface SidebarProps {
  isOpen: boolean;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onPricingOpen: () => void;
  onSettingsOpen: () => void;
  currentTier: Tier;
  onCloseMobile: () => void;
  onHome: () => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  sessions, 
  currentSessionId, 
  onNewChat, 
  onSelectSession, 
  onPricingOpen,
  onSettingsOpen,
  currentTier,
  onCloseMobile,
  onHome,
  onDeleteSession,
  onRenameSession
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleFinishRename = () => {
    if (editingId && editTitle.trim()) {
        onRenameSession(editingId, editTitle);
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') handleFinishRename();
      if (e.key === 'Escape') setEditingId(null);
  };

  return (
    <>
      {/* Sidebar Container - Logic updated for Desktop Toggling */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 bg-black/95 backdrop-blur-xl border-r border-white/10 transform transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] 
          ${isOpen ? 'translate-x-0 w-72' : '-translate-x-full w-72 md:w-0 md:-translate-x-full'}
          md:relative md:flex-shrink-0
        `}
      >
        {/* Hide content when width is 0 on desktop to prevent overflow */}
        <div className={`flex flex-col h-full p-4 w-72 ${!isOpen ? 'md:hidden' : ''}`}>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-8 px-2 pt-2">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center text-[#3B82F6]">
                        <Icon name="logo" size={28} />
                    </div>
                    <h1 className="font-semibold text-lg tracking-tight text-white">JAI-NN</h1>
                 </div>
                 
                 {/* Close Button (Visible on Mobile Only usually, but let's add logic if needed) */}
                 <button onClick={onCloseMobile} className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
                     <Icon name="x" size={20} />
                 </button>

                 <button onClick={onHome} className="hidden md:flex p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors" title="Back to Home">
                     <Icon name="home" size={20} />
                 </button>
            </div>

            {/* New Chat Button */}
            <button 
                onClick={() => {
                  onNewChat();
                  if(window.innerWidth < 768) onCloseMobile();
                }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors mb-6 text-sm font-medium text-white border border-white/5 group shadow-sm"
            >
                <div className="p-1 rounded bg-blue-500/20 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Icon name="plus" size={14} />
                </div>
                New Chat
            </button>

            {/* History List */}
            <div className="flex-1 overflow-y-auto ios-scrollbar -mx-2 px-2">
                <div className="text-xs font-medium text-white/40 px-4 mb-2 uppercase tracking-wider sticky top-0 bg-black/90 backdrop-blur-sm py-1 z-10">History</div>
                <div className="space-y-0.5">
                    {sessions.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                              <Icon name="menu" size={20} />
                          </div>
                          <p className="text-sm text-white/30">No chat history</p>
                      </div>
                    ) : (
                      sessions.map(session => (
                        <div key={session.id} className="group relative">
                            {editingId === session.id ? (
                                <div className="px-2 py-1">
                                    <input
                                        autoFocus
                                        className="w-full bg-white/10 text-white text-sm px-3 py-2 rounded-lg outline-none border border-blue-500 focus:ring-1 focus:ring-blue-500"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        onBlur={handleFinishRename}
                                        onKeyDown={handleKeyDown}
                                    />
                                </div>
                            ) : (
                                <button
                                    onClick={() => {
                                        onSelectSession(session.id);
                                        if(window.innerWidth < 768) onCloseMobile();
                                    }}
                                    className={`w-full text-left px-4 py-3 rounded-xl text-sm truncate transition-all duration-200 relative z-0 ${
                                        currentSessionId === session.id 
                                        ? 'bg-white/10 text-white font-medium shadow-md shadow-black/20' 
                                        : 'hover:bg-white/5 text-white/60 hover:text-white/90'
                                    }`}
                                >
                                    <span className="relative z-0 pr-12 block truncate">
                                        {session.title || 'Untitled Chat'}
                                    </span>
                                </button>
                            )}

                            {/* Floating Actions */}
                            {editingId !== session.id && (
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                                    <div className="flex items-center bg-[#1c1c1e] border border-white/10 rounded-lg shadow-xl overflow-hidden backdrop-blur-md">
                                        <button 
                                            onClick={(e) => handleStartRename(session, e)}
                                            className="p-1.5 hover:bg-white/10 text-white/40 hover:text-blue-400 transition-colors"
                                            title="Rename"
                                        >
                                            <Icon name="edit" size={13} />
                                        </button>
                                        <div className="w-px h-3 bg-white/10"></div>
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if(window.confirm('Delete this chat permanently?')) {
                                                    onDeleteSession(session.id);
                                                }
                                            }}
                                            className="p-1.5 hover:bg-red-500/20 text-white/40 hover:text-red-500 transition-colors"
                                            title="Delete"
                                        >
                                            <Icon name="trash" size={13} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                      ))
                    )}
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-4 space-y-2 border-t border-white/10">
                 <button 
                   onClick={() => {
                       onSettingsOpen();
                       if(window.innerWidth < 768) onCloseMobile();
                   }}
                   className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors text-sm font-medium"
                >
                    <Icon name="settings" size={18} />
                    Settings
                </button>
                <button 
                   onClick={() => {
                       onPricingOpen();
                       if(window.innerWidth < 768) onCloseMobile();
                   }}
                   className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 hover:border-white/20 transition-all group shadow-lg shadow-blue-900/10"
                >
                    <div className="flex flex-col text-left">
                        <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Current Plan</span>
                        <div className="flex items-center gap-2">
                             <span className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">{currentTier}</span>
                             {currentTier === Tier.Free && (
                                 <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                             )}
                        </div>
                    </div>
                    <span className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded text-white/90 transition-colors">Upgrade</span>
                </button>
            </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {isOpen && (
        <div 
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={onCloseMobile}
        ></div>
      )}
    </>
  );
};
