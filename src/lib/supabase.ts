import { createClient } from '@supabase/supabase-js';

// Access environment variables using Vite's import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Export a function to check if config is valid
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      // Configurar para usar cookies en lugar de localStorage
      storage: {
        getItem: async (key) => {
          // Obtener el valor desde el backend (cookies httpOnly)
          try {
            const response = await fetch(`http://localhost:3000/auth/session?key=${encodeURIComponent(key)}`, {
              credentials: 'include',
            });
            const data = await response.json();
            return data.value;
          } catch (error) {
            console.error('Error getting session from cookie:', error);
            return null;
          }
        },
        setItem: (key, value) => {
          // Enviar al backend para que guarde en cookie httpOnly
          fetch('http://localhost:3000/auth/session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include', // Importante para enviar/recibir cookies
            body: JSON.stringify({ key, value }),
          }).catch(console.error);
        },
        removeItem: (key) => {
          // Enviar al backend para eliminar la cookie
          fetch('http://localhost:3000/auth/session', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ key }),
          }).catch(console.error);
        },
      },
      // Detectar sesión automáticamente
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
  : null as any; // Cast as any to avoid type issues when not configured
