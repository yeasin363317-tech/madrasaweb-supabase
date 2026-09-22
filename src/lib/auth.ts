import { supabase, REMEMBER_KEY } from '@/lib/supabase';

export async function adminLogin(email: string, password: string, remember = true): Promise<void> {
  try { localStorage.setItem(REMEMBER_KEY, String(remember)); } catch { /* ignore */ }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
}

export async function adminLogout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getAdminSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}
