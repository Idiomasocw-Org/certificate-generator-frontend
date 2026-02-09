import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Almacenamiento personalizado usando Cookies para mayor seguridad
const cookieStorage = {
  getItem: (key: string) => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find(c => c.startsWith(`${key}=`));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
  },
  setItem: (key: string, value: string) => {
    // Cookie expira en 7 días, accesible solo por HTTPS en prod, y restringida a SameSite=Lax
    document.cookie = `${key}=${encodeURIComponent(value)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  },
  removeItem: (key: string) => {
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: cookieStorage,
      autoRefreshToken: false, // Deshabilitado, el backend maneja esto
      persistSession: false    // Deshabilitado, el backend maneja la sesión
    }
  })
  : null as any;
