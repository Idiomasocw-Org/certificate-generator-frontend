import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl max-w-lg w-full border border-gray-700">
          <h2 className="text-2xl font-bold mb-4 text-white">Configuración Necesaria</h2>
          <p className="text-gray-400 mb-6">
            Para continuar, necesitas configurar las variables de entorno de Supabase en un archivo <code className="bg-gray-700 px-2 py-1 rounded text-blue-300">.env</code> en la raíz del proyecto.
          </p>
          <div className="bg-black p-4 rounded-lg font-mono text-sm text-green-400 mb-6 overflow-x-auto">
            <p>VITE_SUPABASE_URL=tu-url-aqui</p>
            <p>VITE_SUPABASE_ANON_KEY=tu-clave-aqui</p>
          </div>
          <p className="text-sm text-gray-500 italic">
            Una vez creado el archivo .env, reinicia el servidor de desarrollo.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
