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

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-10 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
        <div className="bg-gradient-to-r from-[#002e5b] to-[#004a8f] px-8 py-4 flex items-center gap-3">
          <div className="bg-[#00bcd4] p-2 rounded-lg text-white">
            <CheckCircle2 size={20} />
          </div>
          <h2 className="text-white font-bold tracking-tight">Generar Nuevo Certificado</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Student Name */}
            <div className="md:col-span-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Nombre Completo del Estudiante</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#00bcd4]">
                  <User size={20} />
                </div>
                <input
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/20 focus:bg-white focus:border-[#00bcd4]/30 transition-all text-gray-700 font-medium placeholder:text-gray-300"
                  placeholder="Ej: Juan Pérez García"
                  value={studentName}
                  onChange={e => setStudentName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Level Selector */}
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Nivel Alcanzado</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#00bcd4]">
                  <Award size={20} />
                </div>
                <select
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-10 py-4 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/20 focus:bg-white focus:border-[#00bcd4]/30 transition-all text-gray-700 font-medium appearance-none cursor-pointer"
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Date Picker */}
            <div>
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Fecha de Emisión</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#00bcd4]">
                  <Calendar size={20} />
                </div>
                <input
                  type="date"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/20 focus:bg-white focus:border-[#00bcd4]/30 transition-all text-gray-700 font-medium cursor-pointer"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              disabled={loading}
              className="group relative overflow-hidden bg-[#00bcd4] hover:bg-[#00acc1] text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-[#00bcd4]/20 hover:shadow-xl hover:shadow-[#00bcd4]/30 active:scale-95 disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Generando...</span>
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

      <CertificateHistory refreshHistory={refreshHistory} />
    </div>
  );
}
