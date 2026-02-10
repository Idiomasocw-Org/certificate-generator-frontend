import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '' as 'success' | 'error' | '', message: '' });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus({ type: 'error', message: 'Las contraseñas no coinciden' });
            return;
        }

        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const response = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error al restablecer contraseña');

            setStatus({ type: 'success', message: '¡Tu contraseña ha sido actualizada! Ahora puedes iniciar sesión.' });
            setTimeout(() => navigate('/login'), 3000);
        } catch (err: any) {
            setStatus({ type: 'error', message: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#002e5b] text-white flex flex-col justify-center items-center px-6 selection:bg-[#00bcd4]/30">
            <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#00bcd4]/20 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[140px]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-[#00bcd4] rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-[#00bcd4]/20">
                            <Lock className="text-white w-8 h-8" />
                        </div>
                        <h1 className="text-2xl font-black uppercase tracking-tight">Nueva Contraseña</h1>
                        <p className="text-blue-200/50 text-[10px] uppercase tracking-widest font-bold mt-2">Idiomas OCW Security</p>
                    </div>

                    {status.message && (
                        <div className={`mb-6 p-4 rounded-2xl text-xs font-bold border flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200' : 'bg-red-500/10 border-red-500/30 text-red-200'
                            }`}>
                            {status.type === 'success' ? <CheckCircle2 size={18} /> : <div className="w-2 h-2 bg-red-500 rounded-full" />}
                            <span>{status.message}</span>
                        </div>
                    )}

                    {status.type !== 'success' && (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest ml-2 block">Nueva Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-100/30 w-5 h-5" />
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/50 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-blue-200/50 uppercase tracking-widest ml-2 block">Confirmar Contraseña</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-100/30 w-5 h-5" />
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/50 transition-all font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#00bcd4] hover:bg-[#00acc1] text-white font-black py-5 rounded-2xl shadow-xl shadow-[#00bcd4]/20 transition-all flex items-center justify-center gap-3"
                            >
                                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span className="uppercase text-[13px] tracking-widest">Restablecer Contraseña</span>}
                            </button>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <button
                            onClick={() => navigate('/login')}
                            className="inline-flex items-center gap-2 text-[10px] font-bold text-blue-100/40 hover:text-[#00bcd4] transition-colors uppercase tracking-widest py-2 px-4 rounded-xl hover:bg-white/5"
                        >
                            <ArrowLeft size={14} /> Volver al Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
