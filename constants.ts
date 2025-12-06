
import { ModelConfig, ModelId, Tier } from './types';

export const CREATOR_INFO = {
  name: "Jainam Jain",
  title: "AI Generalist",
  description: "A visionary developer pursuing the path of an AI Generalist. Creator of JAI-NN, creating bridges between human creativity and artificial intelligence.",
  github: "https://github.com/Codewithjainam7",
  website: "https://jainamjain.netlify.app",
  social: "@Codewithjainam7",
  avatar: "https://github.com/Codewithjainam7.png" // Auto-fetches your GitHub profile picture
};

export const MODELS: ModelConfig[] = [
  {
    id: ModelId.Flash,
    name: 'Gemini Flash 2.5',
    description: 'Fast responses, efficient',
    icon: '⚡',
    tiers: [Tier.Free, Tier.Pro, Tier.Ultra],
  },
  {
    id: ModelId.Pro,
    name: 'Gemini Pro 2.5',
    description: 'Advanced reasoning & logic',
    icon: '🔷',
    tiers: [Tier.Pro, Tier.Ultra],
  },
];

export const PRICING_PLANS = [
  {
    name: 'Free',
    price: '$0',
    tier: Tier.Free,
    features: [
      '10,000 tokens/month',
      'Gemini Flash 2.5 Access',
      'Basic Image Generation (5/day)',
      'Chat History & New Chat',
      'Community Support'
    ],
    unavailable: [
      'Model Switching',
      'Advanced Logic (Pro)'
    ],
    cta: 'Current Plan'
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/mo',
    tier: Tier.Pro,
    popular: true,
    features: [
      '100,000 tokens/month',
      'Gemini Pro 2.5 & Flash',
      'Advanced Image Models',
      'Custom System Prompts',
      'Priority Responses',
      'Smart Context Memory'
    ],
    unavailable: [
      'Unlimited Context',
      'Voice Mode 2.0'
    ],
    cta: 'Upgrade to Pro'
  },
  {
    name: 'Ultra',
    price: '$49',
    period: '/mo',
    tier: Tier.Ultra,
    features: [
      'Unlimited Tokens',
      'Unlimited Image Gens',
      'Real-time Voice Mode 2.0',
      'White-glove Onboarding',
      '24/7 Priority Support',
      'Dedicated Compute Instance'
    ],
    unavailable: [],
    cta: 'Upgrade to Ultra'
  }
];

export const SYSTEM_INSTRUCTION = `You are JAI-NN, an advanced AI assistant created by Jainam Jain. 
Your design philosophy is cleanliness and precision.
You are helpful, witty, and precise.`;
