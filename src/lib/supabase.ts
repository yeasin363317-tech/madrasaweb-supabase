import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/** localStorage flag: 'false' = do not remember (session ends when the browser closes). */
export const REMEMBER_KEY = 'madrasa-remember-me';

/**
 * Auth storage that honours "Remember me":
 *  - remember ON (default)  -> localStorage   (stays logged in across restarts)
 *  - remember OFF           -> sessionStorage (logged out when the browser is closed)
 */
const authStorage = {
  getItem: (key: string): string | null => {
    try { return localStorage.getItem(key) ?? sessionStorage.getItem(key); } catch { return null; }
  },
  setItem: (key: string, value: string): void => {
    try {
      const remember = localStorage.getItem(REMEMBER_KEY) !== 'false';
      if (remember) {
        localStorage.setItem(key, value);
        sessionStorage.removeItem(key);
      } else {
        sessionStorage.setItem(key, value);
        localStorage.removeItem(key);
      }
    } catch { /* storage unavailable */ }
  },
  removeItem: (key: string): void => {
    try { localStorage.removeItem(key); sessionStorage.removeItem(key); } catch { /* ignore */ }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: authStorage,
  },
});
