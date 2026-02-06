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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        credentials: 'include',
      });
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
    // Verificamos si existe la cookie de sesión
    const hasToken = Cookies.get('auth_token_exists') === 'true';

    if (hasToken) {
      fetchUser();
    } else {
      setLoading(false);
      setUser(null);
    }

    // LIMPIEZA TOTAL DE LOCALSTORAGE
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  }, []);

  const login = (newUser: User) => {
    Cookies.set('auth_token_exists', 'true', { expires: 1 });
    setUser(newUser);
  };

  const signOut = async () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    try {
      await fetch(`${API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
    } catch (e) {
      console.error("Error logging out:", e);
    }
    Cookies.remove('auth_token_exists');
    setUser(null);
    // Asegurarse de limpiar localStorage por si acaso
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signOut }}>
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
