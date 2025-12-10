import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(
        env.VITE_GEMINI_API_KEY || ''
      ),
      'process.env.SUPABASE_URL': JSON.stringify(
        env.VITE_SUPABASE_URL || ''
      ),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(
        env.VITE_SUPABASE_ANON_KEY || ''
      ),
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom'],
            'markdown-vendor': ['react-markdown', 'remark-gfm'],
          }
        }
      }
    },
    server: {
      port: 5173,
      strictPort: false,
    }
  };
});
