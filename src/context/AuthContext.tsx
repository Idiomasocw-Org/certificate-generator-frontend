import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: User) => void;
  signOut: () => void;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  // Función para limpiar cookies antiguas de Supabase que pudieran haber quedado
  const clearSupabaseCookies = () => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name.startsWith('sb-')) {
        document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        console.log(`🧹 Cookie de Supabase eliminada: ${name}`);
      }
    }
  };

  const refreshToken = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });
      return response.ok;
    } catch (e) {
      return false;
    }
  };

  const authFetch = async (url: string, options: RequestInit = {}): Promise<Response> => {
    options.credentials = 'include';
    let response = await fetch(url, options);

    if (response.status === 401) {
      const refreshed = await refreshToken();
      if (refreshed) {
        response = await fetch(url, options);
      } else {
        signOut();
      }
    }
    return response;
  };

  const fetchUser = async () => {
    try {
      const response = await authFetch(`${API_URL}/api/auth/me`);
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user session:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasTokenFlag = Cookies.get('auth_token_exists') === 'true';

    if (hasTokenFlag) {
      fetchUser();
    } else {
      setLoading(false);
      setUser(null);
    }

    // LIMPIEZA TOTAL
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    clearSupabaseCookies(); // Asegurarnos de limpiar cookies de versiones anteriores al cargar
  }, []);

  const login = (newUser: User) => {
    Cookies.set('auth_token_exists', 'true', { expires: 7 });
    setUser(newUser);
  };

  const signOut = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error("Error logging out:", e);
    }

    clearSupabaseCookies(); // Limpiar cookies de Supabase al cerrar sesión
    Cookies.remove('auth_token_exists');
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signOut, authFetch }}>
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
