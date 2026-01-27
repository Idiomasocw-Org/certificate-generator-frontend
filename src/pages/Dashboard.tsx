import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import CertificateHistory from '../components/CertificateHistory';
import { Download, LogOut, User, Award, Calendar, CheckCircle2 } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Dashboard() {
  const { user, signOut } = useAuth();

  const [studentName, setStudentName] = useState('');
  const [level, setLevel] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshHistory, setRefreshHistory] = useState(false);

  // Limpiar rastro viejo de LocalStorage si existe (migración a Cookies)
  useState(() => {
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('sb-')) localStorage.removeItem(key);
    });
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error('No autenticado');

      const response = await fetch(`${API_URL}/api/certificates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          studentName,
          level,
          date,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Error al generar certificado');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `${studentName.replace(/\s+/g, '_')}.pdf`;
      a.click();

      URL.revokeObjectURL(url);

      setStudentName('');
      setLevel('');
      setRefreshHistory(prev => !prev);
    } catch (error: any) {
      console.error(error);
      setError(error.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between mb-6">
        <div>
          <p className="text-sm text-gray-500">Docente</p>
          <p className="font-bold">{user?.email}</p>
        </div>
        <button onClick={signOut} className="flex gap-2 text-red-500 font-bold">
          <LogOut size={18} /> Salir
        </button>
      </header>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold">&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Generator Form */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="bg-gradient-to-r from-[#002e5b] to-[#004a8f] px-8 py-6 flex items-center gap-3">
              <div className="bg-[#00bcd4] p-2 rounded-xl text-white">
                <CheckCircle2 size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-white font-black tracking-tight text-lg">Emitir Certificado</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Student Name */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1 mb-2.5 block">Nombre del Estudiante</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#00bcd4]">
                    <User size={20} />
                  </div>
                  <input
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-[#00bcd4]/10 focus:bg-white focus:border-[#00bcd4]/40 transition-all text-sm font-semibold text-[#002e5b] placeholder:text-gray-300"
                    placeholder="Ej: Barbara Arias"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Level Selector */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1 mb-2.5 block">Nivel CEFR</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#00bcd4]">
                    <Award size={20} />
                  </div>
                  <select
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-10 py-4 focus:outline-none focus:ring-4 focus:ring-[#00bcd4]/10 focus:bg-white focus:border-[#00bcd4]/40 transition-all text-sm font-semibold text-[#002e5b] appearance-none cursor-pointer"
                    value={level}
                    onChange={e => setLevel(e.target.value)}
                    required
                  >
                    <option value="">Seleccionar nivel...</option>
                    <option value="A1">A1 - Acceso</option>
                    <option value="A2">A2 - Plataforma</option>
                    <option value="B1">B1 - Umbral</option>
                    <option value="B2">B2 - Avanzado</option>
                    <option value="C1">C1 - Dominio</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-300">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Date Picker */}
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1 mb-2.5 block">Fecha de Emisión</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#00bcd4]">
                    <Calendar size={20} />
                  </div>
                  <input
                    type="date"
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-[#00bcd4]/10 focus:bg-white focus:border-[#00bcd4]/40 transition-all text-sm font-semibold text-[#002e5b] cursor-pointer"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  disabled={loading}
                  className="w-full group relative overflow-hidden bg-[#00bcd4] hover:bg-[#00acc1] text-white py-5 rounded-[1.5rem] font-black text-[13px] uppercase tracking-[0.1em] transition-all shadow-xl shadow-[#00bcd4]/20 hover:shadow-2xl hover:shadow-[#00bcd4]/30 active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>GENERANDO...</span>
                    </div>
                  ) : (
                    <>
                      <Download size={20} className="transition-transform group-hover:translate-y-0.5" />
                      <span>Generar Certificado</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: History Table */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 min-h-full transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <CertificateHistory refreshHistory={refreshHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}
