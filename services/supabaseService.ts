import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
// Note: In Vite, these are polyfilled by the vite.config.ts define block to process.env
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const signInWithGoogle = async () => {
  if (!supabase) return { error: { message: 'Supabase not configured' } };
  
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin,
    },
  });
};

export const signOut = async () => {
  if (!supabase) return;
  return await supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};