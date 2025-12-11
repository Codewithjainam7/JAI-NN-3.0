export type Role = 'user' | 'model';

export type Page = 'landing' | 'chat' | 'creator' | 'pricing';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
  isThinking?: boolean;
  feedback?: 'up' | 'down';
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export enum ModelId {
  Flash = 'gemini-2.0-flash-lite',
  Pro = 'gemini-2.5-pro-latest',
}

export enum Tier {
  Free = 'FREE',
  Pro = 'PRO',
  Ultra = 'ULTRA',
}

export interface ModelConfig {
  id: ModelId;
  name: string;
  description: string;
  icon: string;
  tiers: Tier[];
}

export interface UserSettings {
  tier: Tier;
  currentModel: ModelId;
  theme: 'dark' | 'light' | 'system';
  accentColor: string;
  dailyImageCount: number;
  dailyImageLimit: number;
  dailyTokenUsage: number;
  dailyTokenLimit: number;
  systemInstruction?: string;
  customStarters?: string[];
  responseStyle?: 'balanced' | 'detailed' | 'concise' | 'creative';
autoSaveChats?: boolean;
soundEffects?: boolean;
compactMode?: boolean;
}
