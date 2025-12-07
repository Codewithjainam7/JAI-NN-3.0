# JAI-NN 3.0 - Advanced AI Chatbot

<div align="center">
  <img src="https://img.shields.io/badge/version-3.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/powered%20by-Gemini%202.5-orange" alt="Gemini">
</div>

A cutting-edge AI chatbot interface with glassmorphism design, multi-model support, and advanced features. Built with React, TypeScript, Tailwind CSS, and powered by Google's Gemini AI.

## ✨ Features

- 🎨 **Cinematic Boot Sequence** - Immersive startup animation
- 🌊 **Liquid Glass UI** - Modern glassmorphism design with OLED dark theme
- 🤖 **Multi-Model Support** - Switch between Gemini Flash 2.5 and Pro 2.5
- 🎨 **AI Image Generation** - Built-in image synthesis with Pollinations AI
- 💾 **Persistent Storage** - Chat history and settings sync via Supabase
- 🔐 **Google OAuth** - Secure authentication with Supabase Auth
- 📊 **Usage Tracking** - Daily limits for free tier (2,000 tokens/day, 5 images/day)
- 🎯 **Tier System** - Free, Pro, and Ultra plans (Pro/Ultra coming soon)
- 💬 **Markdown Support** - Rich text formatting with code syntax highlighting
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- A Gemini API key ([Get one here](https://aistudio.google.com/app/apikey))
- A Supabase project ([Create one here](https://supabase.com/dashboard))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/jai-nn-3.0.git
cd jai-nn-3.0
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your keys:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Set up Supabase database**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy and run the contents of `supabase-setup.sql`
   - Enable Google OAuth provider in Authentication > Providers

5. **Run the development server**
```bash
npm run dev
```

Visit `http://localhost:5173` to see your app!

## 📦 Deployment to Vercel

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/jai-nn-3.0)

### Manual Deployment

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Login to Vercel**
```bash
vercel login
```

3. **Deploy**
```bash
vercel
```

4. **Add Environment Variables**
   - Go to your Vercel project dashboard
   - Navigate to Settings > Environment Variables
   - Add your environment variables:
     - `VITE_GEMINI_API_KEY`
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

5. **Redeploy**
```bash
vercel --prod
```

### Update Supabase Redirect URLs

After deployment, add your Vercel domain to Supabase:
1. Go to Supabase Dashboard > Authentication > URL Configuration
2. Add your Vercel URL to **Redirect URLs**:
   - `https://your-app.vercel.app`
   - `https://your-app.vercel.app/**`

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **AI**: Google Gemini 2.5 (Flash & Pro)
- **Image Generation**: Pollinations AI
- **Authentication**: Supabase Auth (Google OAuth)
- **Database**: Supabase (PostgreSQL)
- **Markdown**: react-markdown + remark-gfm
- **Code Highlighting**: react-syntax-highlighter
- **Build Tool**: Vite
- **Deployment**: Vercel

## 📁 Project Structure

```
jai-nn-3.0/
├── components/
│   ├── ChatMessage.tsx       # Message display component
│   ├── CodeBlock.tsx         # Code syntax highlighting
│   ├── CreatorPage.tsx       # About creator page
│   ├── Icon.tsx              # Icon components
│   ├── InputArea.tsx         # Message input area
│   ├── LandingPage.tsx       # Landing page
│   ├── Modals.tsx            # All modal components
│   ├── PricingPage.tsx       # Pricing page
│   ├── SettingsModal.tsx     # Settings interface
│   ├── Sidebar.tsx           # Chat history sidebar
│   └── TiltCard.tsx          # Tilt effect card
├── services/
│   ├── geminiService.ts      # Gemini AI integration
│   └── supabaseService.ts    # Supabase client & auth
├── App.tsx                   # Main app component
├── constants.ts              # App constants
├── types.ts                  # TypeScript types
├── index.html                # HTML entry point
├── index.tsx                 # React entry point
├── vite.config.ts            # Vite configuration
├── supabase-setup.sql        # Database schema
└── .env.local.example        # Environment variables template
```

## 🎨 Features in Detail

### Free Tier Limitations
- **Daily Tokens**: 2,000 tokens/day (~60,000/month)
- **Image Generation**: 5 images/day
- **Model Access**: Gemini Flash 2.5 only
- **Chat History**: Saved with authentication

### Coming Soon (Pro & Ultra)
- Model switching (Gemini Pro 2.5)
- Unlimited tokens and images
- Custom system instructions
- Voice mode 2.0
- Priority support

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Creator

**Jainam Jain**  
AI Generalist | Full Stack Developer

- GitHub: [@Codewithjainam7](https://github.com/Codewithjainam7)
- Portfolio: [jainamjain.netlify.app](https://jainamjain.netlify.app)
- Twitter: @Codewithjainam7

## 🙏 Acknowledgments

- Google Gemini for the powerful AI models
- Supabase for authentication and database
- Pollinations AI for image generation
- The React and TypeScript communities

---

<div align="center">
  Made with ❤️ by Jainam Jain
  
  ⭐ Star this repo if you find it helpful!
</div>
