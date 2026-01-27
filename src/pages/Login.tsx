import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('✨ Cuenta registrada. Ya puedes iniciar sesión.');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#002e5b] text-white flex flex-col justify-center items-center px-6 selection:bg-[#00bcd4]/30">
      {/* Decorative Circles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00bcd4]/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[140px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-10">

          <h1 className="text-4xl font-black tracking-tight mb-2">Idiomas OCW</h1>
          <p className="text-blue-200/60 font-medium text-center text-sm uppercase tracking-widest">
            {isSignUp ? 'Registro de Docente' : 'Acceso al Panel'}
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-100 text-sm font-medium animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-7">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-blue-200/50 uppercase tracking-[0.2em] ml-2 block">Email Personal</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-100/30 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/50 transition-all font-medium placeholder:text-blue-200/20"
                  placeholder="ejemplo@ocw.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-blue-200/50 uppercase tracking-[0.2em] ml-2 block">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-100/30 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/50 transition-all font-medium placeholder:text-blue-200/20"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00bcd4] hover:bg-[#00acc1] text-white font-black py-5 rounded-2xl shadow-xl shadow-[#00bcd4]/20 hover:translate-y-[-2px] active:translate-y-[0] transition-all flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <span className="uppercase text-[13px] tracking-[0.1em]">{isSignUp ? 'Crear mi cuenta' : 'Entrar ahora'}</span>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[11px] font-bold text-blue-100/40 hover:text-[#00bcd4] transition-colors uppercase tracking-[0.15em] py-2 px-4 rounded-xl hover:bg-white/5"
            >
              {isSignUp ? '¿Ya eres docente? Inicia sesión' : '¿No tienes cuenta? Regístrate aquí'}
            </button>
          </div>
        </div>
      </div>

      <p className="mt-12 text-[10px] text-blue-100/20 font-bold uppercase tracking-widest">© 2026 Idiomas OCW • One Culture World</p>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}
