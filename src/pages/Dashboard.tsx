import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import CertificateHistory from '../components/CertificateHistory';
import { LogOut, Download, Plus, LayoutDashboard, FileText } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [formData, setFormData] = useState({
    studentName: '',
    level: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshHistory, setRefreshHistory] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('Sesión no válida');

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

        setFormData({ studentName: '', level: '', date: new Date().toISOString().split('T')[0] });
        setRefreshHistory(prev => !prev);
        alert('✨ Certificado generado correctamente');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Error al generar el certificado');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setError('Error al conectar con el servidor');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-blue-500/30">
      {/* Background Shapes */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]" />
      </div>

      {/* Navbar Dashboard */}
      <nav className="relative z-10 border-b border-white/10 backdrop-blur-md bg-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-blue-400 w-6 h-6" />
            <span className="font-bold text-xl tracking-tight italic">Panel Docente</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:block text-right">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Usuario Activo</p>
              <p className="text-sm font-medium text-slate-300">{user?.email}</p>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl transition-all border border-red-500/20"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-12 gap-12">

          {/* Left Column: Generator Form */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-3 bg-blue-600/20 rounded-bl-3xl border-b border-l border-white/10">
                <Plus className="text-blue-400" />
              </div>

              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <FileText className="text-blue-400 w-6 h-6" />
                Nueva Emisión
              </h2>
              <p className="text-slate-400 text-sm mb-8">Completa los datos para validar la competencia del alumno.</p>

              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Nombre del Estudiante</label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
                    placeholder="Ej. Juan Pérez"
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
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all appearance-none"
                    >
                      <option value="" className="bg-slate-900">Nivel</option>
                      <option value="A1" className="bg-slate-900">A1 - Acceso</option>
                      <option value="A2" className="bg-slate-900">A2 - Plataforma</option>
                      <option value="B1" className="bg-slate-900">B1 - Umbral</option>
                      <option value="B2" className="bg-slate-900">B2 - Avanzado</option>
                      <option value="C1" className="bg-slate-900">C1 - Dominio</option>
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
                      className="w-full bg-slate-900/50 border border-white/10 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
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
                      <span>Generando...</span>
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      <span>Emitir Certificado PDF</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-7">
            <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl h-full">
              <CertificateHistory refreshHistory={refreshHistory} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
