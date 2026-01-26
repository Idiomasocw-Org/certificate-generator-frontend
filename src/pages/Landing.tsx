import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { GraduationCap, ArrowRight, Download, History, LogIn, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Landing() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        studentName: '',
        level: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleGenerateClick = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            // Si no hay usuario, redirigir a registro con los datos persistidos opcionalmente
            // Para la demo, lo llevamos a login/registro
            navigate('/login');
            return;
        }

        setIsGenerating(true);
        setError(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) {
                navigate('/login');
                return;
            }

            const response = await fetch(`${API_URL}/api/certificates`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const safeName = formData.studentName.trim().replace(/\s+/g, '_') || 'certificado';
                link.setAttribute('download', `${safeName}.pdf`);
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
                window.URL.revokeObjectURL(url);
                alert('✨ Certificado generado y descargado con éxito');
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Error al generar el certificado');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Error al conectar con el servidor. Verifica el túnel.');
        } finally {
            setIsGenerating(false);
        }
    };

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
                        <span className="font-bold text-xl tracking-tight">CertiPro</span>
                    </div>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-all border border-white/10"
                            >
                                <History size={18} />
                                <span>Mi Historial</span>
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-full transition-all shadow-lg shadow-blue-600/20"
                            >
                                <LogIn size={18} />
                                <span>Ingresar</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-24 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-blue-400 text-sm font-medium">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        Generador de Certificados Oficiales
                    </div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight">
                        Valida tus logros con <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">estilo profesional.</span>
                    </h1>
                    <p className="text-lg text-slate-400 max-w-lg leading-relaxed">
                        Crea certificados personalizados en segundos. Herramienta diseñada para el portal de idiomas Idiomasocw.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2 text-slate-300">
                            <CheckCircle className="text-green-400 w-5 h-5" />
                            <span>Niveles CEFR</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                            <CheckCircle className="text-green-400 w-5 h-5" />
                            <span>PDF en Alta Calidad</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-300">
                            <CheckCircle className="text-green-400 w-5 h-5" />
                            <span>Seguridad Supabase</span>
                        </div>
                    </div>
                </div>

                {/* Form Card (Glassmorphism) */}
                <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl relative group">
                    <div className="absolute -top-6 -right-6 bg-blue-600 p-4 rounded-3xl shadow-xl transform rotate-12 group-hover:rotate-6 transition-transform">
                        <GraduationCap className="text-white w-8 h-8" />
                    </div>

                    <h2 className="text-2xl font-bold mb-6">Generar Nuevo Certificado</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleGenerateClick} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-400 ml-1">Nombre completo</label>
                            <input
                                type="text"
                                name="studentName"
                                value={formData.studentName}
                                onChange={handleChange}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                                placeholder="Ej. Barbara Arias"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Nivel CEFR</label>
                                <select
                                    name="level"
                                    value={formData.level}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                                >
                                    <option value="" className="bg-slate-900">Seleccionar</option>
                                    <option value="A1" className="bg-slate-900">Nivel A1</option>
                                    <option value="A2" className="bg-slate-900">Nivel A2</option>
                                    <option value="B1" className="bg-slate-900">Nivel B1</option>
                                    <option value="B2" className="bg-slate-900">Nivel B2</option>
                                    <option value="C1" className="bg-slate-900">Nivel C1</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400 ml-1">Fecha</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isGenerating}
                            className={`w-full relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isGenerating ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Procesando...</span>
                                </>
                            ) : (
                                <>
                                    <Download size={20} />
                                    <span>Generar y Descargar PDF</span>
                                </>
                            )}
                        </button>

                        {!user && (
                            <p className="text-center text-xs text-slate-500 mt-4">
                                * Se requiere registro previo para validar y guardar tu certificado.
                            </p>
                        )}
                    </form>
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
