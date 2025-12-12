import React from 'react';
import { Icon } from './Icon';
import { CREATOR_INFO } from '../constants';

interface CreatorPageProps {
  onBack: () => void;
}

export const CreatorPage: React.FC<CreatorPageProps> = ({ onBack }) => {
  // We keep reading CREATOR_INFO from constants, but provide fallback values inline
  const info = {
    name: CREATOR_INFO?.name || 'Creator',
    avatar: CREATOR_INFO?.avatar || '/default-avatar.png',
    title: CREATOR_INFO?.title || 'AI Creator',
    description: CREATOR_INFO?.description || '',
    skills: CREATOR_INFO?.skills || [],
    contact: CREATOR_INFO?.contact || '',
    email: CREATOR_INFO?.email || 'jainjainam412@gmail.com',
    phone: CREATOR_INFO?.phone || '',
    website: CREATOR_INFO?.website || '',
    twitter: CREATOR_INFO?.twitter || '',
    linkedin: CREATOR_INFO?.linkedin || '',
    github: CREATOR_INFO?.github || '',
    place: CREATOR_INFO?.place || 'India'
  };

  return (
    <div className="min-h-screen w-full bg-black text-white font-sans relative">
      <div className="fixed inset-0 z-0 pointer-events-none ios26-gradient">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px]" />
      </div>

      <nav className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <button 
          onClick={onBack} 
          className="group px-3 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center gap-2 transition-all text-sm"
        >
          <Icon name="arrow-right" size={16} className="rotate-180 text-white/60 group-hover:text-white" />
          <span className="hidden sm:inline">Back</span>
        </button>

        <div className="flex items-center gap-2 text-xl font-bold tracking-tight opacity-50">
          JAI-NN 3.0
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-20 pt-4 overflow-y-auto max-h-[calc(100vh-96px)]">
        <div className="smoked-glass p-6 sm:p-8 md:p-16 rounded-[48px] border border-white/10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 mb-12">
            <div className="relative shrink-0">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full p-1.5 bg-gradient-to-br from-white/10 to-white/5 border border-white/10 backdrop-blur-sm">
                <img
                  src={info.avatar}
                  alt={info.name}
                  className="w-full h-full rounded-full object-cover border-2 border-black shadow-2xl"
                />
              </div>
            </div>

            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 tracking-tight text-white">
                {info.name}
              </h1>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-sm border border-indigo-500/20 mb-4">
                <Icon name="cpu" size={14} />
                {info.title}
              </div>

              <p className="text-white/60 mb-4">{info.description}</p>

              <div className="flex items-center gap-3">
                {info.website && (
                  <a href={info.website} target="_blank" rel="noreferrer" className="px-4 py-2 rounded-full bg-white text-black text-sm font-bold">
                    VIEW PORTFOLIO
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6 border-t border-white/6 pt-8">
            <div>
              <h3 className="text-xl font-bold mb-4">About</h3>
              <p className="text-white/60 mb-4">{info.description}</p>

              <h4 className="text-sm text-white/80 font-semibold mb-2">Skills & Focus</h4>
              <ul className="list-disc list-inside text-white/70 space-y-2">
                {info.skills.map((s: string, i: number) => <li key={i}>{s}</li>)}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Contact</h3>

              <div className="p-4 rounded-xl bg-black/20 border border-white/6 space-y-3">
                <div className="flex items-center gap-3">
                  <Icon name="mail" size={16} />
                  <a className="underline text-white/80" href={`mailto:${info.email}`}>{info.email}</a>
                </div>

                {info.phone && (
                  <div className="flex items-center gap-3">
                    <Icon name="phone" size={16} />
                    <a className="text-white/80" href={`tel:${info.phone}`}>{info.phone}</a>
                  </div>
                )}

                {info.website && (
                  <div className="flex items-center gap-3">
                    <Icon name="link" size={16} />
                    <a className="text-white/80 underline" href={info.website} target="_blank" rel="noreferrer">{info.website}</a>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Icon name="map-pin" size={16} />
                  <span className="text-white/80">{info.place}</span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  {info.twitter && (
                    <a href={info.twitter} target="_blank" rel="noreferrer" className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10">
                      <Icon name="twitter" size={16} />
                    </a>
                  )}
                  {info.linkedin && (
                    <a href={info.linkedin} target="_blank" rel="noreferrer" className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10">
                      <Icon name="linkedin" size={16} />
                    </a>
                  )}
                  {info.github && (
                    <a href={info.github} target="_blank" rel="noreferrer" className="px-2 py-1 rounded-md bg-white/5 hover:bg-white/10">
                      <Icon name="github" size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default CreatorPage;
