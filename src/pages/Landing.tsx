import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, ArrowRight, Download, History, CheckCircle } from 'lucide-react';

export default function Landing() {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0f172a] text-white selection:bg-blue-500/30">
            {/* Background Shapes */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]" />
            </div>

            {/* Navbar */}
            <nav className="relative z-10 border-b border-white/10 backdrop-blur-md bg-white/5 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="text-blue-400 w-8 h-8" />
                        <span className="font-bold text-xl tracking-tight italic">CertiPro</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full transition-all shadow-lg shadow-blue-600/20"
                            >
                                <span>Ir al Panel de Control</span>
                                <ArrowRight size={18} />
                            </button>
                        ) : (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-slate-300 hover:text-white transition-colors"
                                >
                                    Acceso Administrativo
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full transition-all shadow-lg shadow-blue-600/20"
                                >
                                    Registrarse como Docente
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-32 flex flex-col items-center text-center">
                <div className="space-y-8 max-w-4xl">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full text-blue-400 text-sm font-medium animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Plataforma Exclusiva para Instituciones y Profesores
                    </div>
                    <h1 className="text-6xl lg:text-8xl font-black leading-[1.1] tracking-tight">
                        Gestión <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 animate-gradient-x">Oficial</span> de Certificaciones Académicas.
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Optimiza la validación de competencias de tus estudiantes con nuestro generador de certificados CEFR automatizado y seguro.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6 pt-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="group flex items-center gap-3 bg-white text-slate-900 font-bold px-8 py-4 rounded-2xl hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Comenzar ahora
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                        </button>
                        <div className="flex -space-x-3 overflow-hidden items-center ml-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="inline-block h-10 w-10 rounded-full ring-2 ring-[#0f172a] bg-slate-800 border border-white/10" />
                            ))}
                            <span className="pl-4 text-slate-500 text-sm">+500 docentes ya lo usan</span>
                        </div>
                    </div>
                </div>

                {/* Features Preview */}
                <div className="grid md:grid-cols-3 gap-8 mt-32 w-full">
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:border-blue-500/30 transition-all group">
                        <div className="bg-blue-500/20 p-3 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                            <CheckCircle className="text-blue-400 w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Estándar CEFR</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Generación precisa basada en los marcos comunes europeos de referencia para las lenguas (A1-C1).</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:border-indigo-500/30 transition-all group">
                        <div className="bg-indigo-500/20 p-3 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                            <Download className="text-indigo-400 w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Descargas al Instante</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Formatos PDF de alta calidad listos para imprimir y compartir con tus estudiantes.</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm hover:border-blue-500/30 transition-all group">
                        <div className="bg-blue-500/20 p-3 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                            <History className="text-blue-400 w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold mb-3">Historial Centralizado</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">Control total sobre cada certificado emitido, con acceso seguro mediante Supabase.</p>
                    </div>
                </div>
            </main>

            {/* Footer / Stats */}
            <footer className="relative z-10 border-t border-white/5 bg-black/20 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-slate-500 text-sm">
                        © 2026 Idiomasocw. Todos los derechos reservados.
                    </div>
                    <div className="flex gap-8">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">10k+</div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Graduados</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-white">100%</div>
                            <div className="text-xs text-slate-500 uppercase tracking-widest">Seguro</div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
