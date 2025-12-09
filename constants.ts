import { ModelId, Tier } from './types';

export const CREATOR_INFO = {
  name: "Jainam Jain",
  title: "AI Generalist",
  description: "A visionary developer pursuing the path of an AI Generalist. Creator of JAI-NN 3.0, creating bridges between human creativity and artificial intelligence.",
  github: "https://github.com/Codewithjainam7",
  website: "https://jainamjain.netlify.app",
  social: "@Codewithjainam7",
  avatar: "https://github.com/Codewithjainam7.png"
};

export const MODELS = [
  {
    id: ModelId.Flash,
    name: 'Gemini Flash 2.5',
    description: 'Fast responses, efficient',
    icon: '⚡',
    iconName: 'zap',
    tiers: [Tier.Free, Tier.Pro, Tier.Ultra],
  },
  {
    id: ModelId.Pro,
    name: 'Gemini Pro 2.5',
    description: 'Advanced reasoning & logic',
    icon: '🔷',
    iconName: 'cpu',
    tiers: [Tier.Pro, Tier.Ultra],
  },
];

export const PRICING_PLANS = [
  {
    name: 'Free',
    price: '$0',
    tier: Tier.Free,
    features: [
      '2,000 tokens/day (~60k/month)',
      'Gemini Flash 2.5 Access',
      'Image Generation (5/day)',
      'Voice Input',
      'File Upload',
      'Chat History',
      'Community Support'
    ],
    unavailable: [
      'Model Switching',
      'Custom AI Instructions',
      'Custom Quick Prompts',
      'Advanced Color Themes',
      'Priority Support'
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
      'All Models (Flash & Pro)',
      'Unlimited Image Generation',
      'Custom System Instructions',
      'Custom Quick Prompts',
      'Advanced Color Themes',
      'Priority Responses',
      'Smart Context Memory',
      'Priority Email Support'
    ],
    unavailable: [
      'Voice Mode 2.0',
      'Dedicated Support',
      'White-glove Onboarding'
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
      'Unlimited Everything',
      'All Premium Features',
      'Real-time Voice Mode 2.0',
      'Ultra Color Themes',
      'White-glove Onboarding',
      '24/7 Priority Support',
      'Dedicated Compute Instance',
      'Custom API Access'
    ],
    unavailable: [],
    cta: 'Upgrade to Ultra'
  }
];

export const SYSTEM_INSTRUCTION = `You are JAI-NN 3.0, an advanced AI assistant created by Jainam Jain. 
Your design philosophy is cleanliness and precision.
You are helpful, witty, and precise. You provide accurate, well-structured responses.`;
