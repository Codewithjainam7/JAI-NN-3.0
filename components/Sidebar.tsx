import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Icon } from './Icon';
import { JAINNLogo } from './JAINNLogo';
import { ChatSession, Tier, User } from '../types';

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
  user: User | null;
  onSignOut: () => void;
  isGuest: boolean;
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
  onRenameSession,
  user,
  onSignOut,
  isGuest
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [actionMenu, setActionMenu] = useState<{ id: string; rect: DOMRect } | null>(null);
  const actionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      // close action menu when clicking outside
      if (actionMenu && actionRef.current && !(actionRef.current as any).contains(e.target)) {
        setActionMenu(null);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [actionMenu]);

  const handleStartRename = (session: ChatSession, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(session.id);
    setEditTitle(session.title);
    setActionMenu(null);
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

  const handleDelete = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this chat permanently?')) {
      onDeleteSession(sessionId);
      setActionMenu(null);
    }
  };

  // portal menu render
  const renderPortalMenu = () => {
    if (!actionMenu) return null;
    // prefer to place menu near the right side of viewport, but avoid going off-screen
    const left = Math.min(document.documentElement.clientWidth - 170, actionMenu.rect.right - 160);
    const top = actionMenu.rect.top + window.scrollY + 8;

    const menu = (
      <div
        ref={actionRef}
        className="fixed z-[9999] bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl py-1 min-w-[160px]"
        style={{ left: `${left}px`, top: `${top}px` }}
      >
        <button
          onClick={() => {
            handleStartRename(sessions.find(s => s.id === actionMenu.id)!, new MouseEvent('click') as any);
          }}
          className="w-full px-3 py-2 text-left text-sm text-white/80 hover:bg-white/5 flex items-center gap-2"
        >
          <Icon name="edit" size={14} />
          Rename
        </button>
        <div className="h-px bg-white/6 my-1"></div>
        <button
          onClick={(e) => handleDelete(actionMenu.id, e as any)}
          className="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2"
        >
          <Icon name="trash" size={14} />
          Delete
        </button>
      </div>
    );

    return createPortal(menu, document.body);
  };

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-40 bg-black/95 backdrop-blur-xl border-r border-white/10 transform transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${isOpen ? 'translate-x-0 w-80 max-w-[85vw]' : '-translate-x-full w-80'}
          md:relative md:flex-shrink-0
        `}
      >
        <div className={`flex flex-col h-full p-4 w-full ${!isOpen ? 'md:hidden' : ''}`}>
          <div className="flex items-center justify-between mb-8 px-2 pt-2">
            <div className="flex items-center gap-3">
              <JAINNLogo size={32} />
              <h1 className="font-semibold text-lg text-white">JAI-NN 3.0</h1>
            </div>

            <button onClick={onCloseMobile} className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors active:scale-95">
              <Icon name="x" size={20} />
            </button>

            <button onClick={onHome} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors active:scale-95" title="Back to Home">
              <div className="flex items-center gap-2">
                <Icon name="home" size={20} />
                <span className="hidden sm:inline text-sm">Home</span>
              </div>
            </button>
          </div>

          <button
            onClick={() => {
              onNewChat();
              if (window.innerWidth < 768) onCloseMobile();
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 hover:border-blue-500/50 transition-colors mb-6 text-sm font-medium text-white shadow-sm active:scale-95"
          >
            <div className="p-1 rounded bg-blue-500/20 text-blue-400">
              <Icon name="plus" size={14} />
            </div>
            New Chat
          </button>

          <div className="flex-1 overflow-y-auto -mx-2 px-2">
            <div className="text-xs font-medium text-white/40 px-4 mb-2 uppercase sticky top-0 bg-black/90 backdrop-blur-sm py-1 z-10">
              {isGuest ? 'Current Session' : 'History'}
            </div>
            <div className="space-y-1 pb-4">
              {isGuest ? (
                <div className="px-4 py-8 text-center">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center text-white/20">
                    <Icon name="lock" size={20} />
                  </div>
                  <p className="text-sm text-white/40 mb-2">Sign in to save chat history</p>
                </div>
              ) : sessions.length === 0 ? (
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
                      <div className="relative">
                        <button
                          onClick={() => {
                            onSelectSession(session.id);
                            if (window.innerWidth < 768) onCloseMobile();
                          }}
                          className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 relative ${
                            currentSessionId === session.id
                              ? 'bg-white/10 text-white font-medium shadow-md shadow-black/20'
                              : 'hover:bg-white/5 text-white/60 hover:text-white/90'
                          }`}
                        >
                          <span className="block truncate pr-10">
                            {session.title || 'Untitled Chat'}
                          </span>
                        </button>

                        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-20">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                              setActionMenu({ id: session.id, rect });
                            }}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors active:scale-95 bg-white/10 backdrop-blur-sm border border-white/10"
                            title="Options"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
                              <circle cx="8" cy="3" r="1.5" fill="currentColor" />
                              <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                              <circle cx="8" cy="13" r="1.5" fill="currentColor" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-auto pt-4 space-y-2 border-t border-white/10">
            <button
              onClick={() => {
                onSettingsOpen();
                if (window.innerWidth < 768) onCloseMobile();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors text-sm font-medium active:scale-95"
            >
              <Icon name="settings" size={18} />
              {isGuest ? 'Sign In to Access Settings' : 'Settings'}
            </button>

            {user && !isGuest && (
              <button
                onClick={() => {
                  if (window.confirm('Sign out from JAI-NN 3.0?')) {
                    onSignOut();
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-white/5 text-white/60 hover:text-red-400 transition-colors text-sm font-medium active:scale-95"
              >
                <Icon name="x" size={18} />
                Sign Out
              </button>
            )}

            <button
              onClick={() => {
                onPricingOpen();
                if (window.innerWidth < 768) onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 hover:border-white/20 transition-all group shadow-lg shadow-blue-900/10 active:scale-95"
            >
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-white/50 uppercase font-semibold">Current Plan</span>
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

      {/* softened overlay to avoid completely blacking out the background */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {renderPortalMenu()}
    </>
  );
};

export default Sidebar;
