import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../config';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState({ loading: false, type: '', message: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // Importante para cookies
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en la autenticación');
      }

      if (isSignUp) {
        alert('✨ Cuenta registrada. Ya puedes iniciar sesión.');
        setIsSignUp(false);
      } else {
        login(data.user);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotStatus({ loading: true, type: '', message: '' });

    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al procesar solicitud');

      setForgotStatus({ loading: false, type: 'success', message: data.message });
      setForgotEmail('');
    } catch (err: any) {
      setForgotStatus({ loading: false, type: 'error', message: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-[#002e5b] text-white flex flex-col justify-center items-center px-6 selection:bg-[#00bcd4]/30">
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
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-2xl text-red-100 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-7">
            <div className="space-y-2">
              <label htmlFor="email" className="text-[10px] font-bold text-blue-200/50 uppercase tracking-[0.2em] ml-2 block pointer-events-none">Email Personal</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-100/30 w-5 h-5 pointer-events-none" />
                <input
                  id="email"
                  name="email"
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
              <label htmlFor="password" className="text-[10px] font-bold text-blue-200/50 uppercase tracking-[0.2em] ml-2 block pointer-events-none">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-100/30 w-5 h-5 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-14 py-5 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/50 transition-all font-medium text-white placeholder:text-blue-200/20"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-blue-100/30 hover:text-[#00bcd4] transition-colors p-2 z-20"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isSignUp && (
              <div className="flex justify-end -mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgot(true);
                    setForgotStatus({ loading: false, type: '', message: '' });
                  }}
                  className="text-[10px] font-bold text-blue-200/30 hover:text-[#00bcd4] transition-colors uppercase tracking-widest"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

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

      {/* Modal Olvidé mi contraseña */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#002e5b]/40 backdrop-blur-md" onClick={() => setShowForgot(false)} />
          <div className="relative bg-white/10 backdrop-blur-2xl w-full max-w-md p-10 rounded-[3rem] border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center mb-8">
              <h3 className="text-xl font-black uppercase tracking-tight text-white">Recuperar Acceso</h3>
              <p className="text-blue-100/40 text-[10px] uppercase font-bold tracking-widest mt-2">Introduce tu correo registrado</p>
            </div>

            {forgotStatus.message && (
              <div className={`mb-6 p-4 rounded-2xl text-xs font-bold border flex items-center gap-3 ${forgotStatus.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-red-500/10 border-red-500/30 text-red-200'
                }`}>
                <div className={`w-1.5 h-1.5 rounded-full ${forgotStatus.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                <span>{forgotStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="forgotEmail" className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest ml-2 block pointer-events-none">Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-100/30 w-5 h-5 pointer-events-none" />
                  <input
                    id="forgotEmail"
                    name="forgotEmail"
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/50 transition-all font-medium text-white"
                    placeholder="docente@ocw.com"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={forgotStatus.loading}
                  className="w-full bg-[#00bcd4] hover:bg-[#00acc1] text-white font-black py-5 rounded-2xl shadow-xl shadow-[#00bcd4]/20 transition-all flex items-center justify-center gap-3"
                >
                  {forgotStatus.loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="uppercase text-[11px] tracking-widest">Enviar Instrucciones</span>}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="w-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white font-bold py-4 rounded-2xl transition-all text-[10px] uppercase tracking-widest"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
