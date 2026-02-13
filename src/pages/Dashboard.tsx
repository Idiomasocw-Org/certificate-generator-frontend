import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import CertificateHistory from '../components/CertificateHistory';
import { Download, LogOut, User, Award, Calendar, CheckCircle2, Settings, Lock, X } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Dashboard() {
  const { user, signOut, authFetch } = useAuth();
  const { showToast } = useToast();

  const [studentName, setStudentName] = useState('');
  const [level, setLevel] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshHistory, setRefreshHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: null as string | null, success: false });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordStatus({ ...passwordStatus, error: 'Las nuevas contraseñas no coinciden' });
      return;
    }

    setPasswordStatus({ ...passwordStatus, loading: true, error: null });

    try {
      const response = await authFetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          oldPassword: passwordForm.oldPassword,
          newPassword: passwordForm.newPassword
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Error al cambiar contraseña');

      setPasswordStatus({ loading: false, error: null, success: true });
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      showToast('Contraseña actualizada exitosamente', 'success');
      setTimeout(() => {
        setPasswordStatus(prev => ({ ...prev, success: false }));
        setShowSettings(false);
      }, 2000);
    } catch (err: any) {
      setPasswordStatus({ loading: false, error: err.message, success: false });
      showToast(err.message || 'Error al cambiar contraseña', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) throw new Error('No autenticado');

      const response = await authFetch(`${API_URL}/api/certificates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      setError(null);
      setRefreshHistory(prev => !prev);

      // Mostrar aviso de éxito
      showToast(`Certificado generado para ${studentName}`, 'success');
    } catch (error: any) {
      console.error("Error al generar certificado:", error);
      const errorMsg = error.message || 'Error al conectar con el servidor';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="flex justify-between items-center mb-10 bg-white/50 backdrop-blur-md p-6 rounded-[2rem] border border-white/20">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-[#002e5b]">
            <User size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Docente Activo</p>
            <p className="font-bold text-[#002e5b]">{user?.email}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-[#002e5b] font-bold rounded-2xl transition-all shadow-sm border border-gray-100"
          >
            <Settings size={18} /> <span className="hidden sm:inline">Ajustes</span>
          </button>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-2xl transition-all border border-red-100"
          >
            <LogOut size={18} /> <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* Modal de Ajustes */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-[#002e5b]/20 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-[#002e5b] p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Lock size={20} />
                </div>
                <h3 className="font-black uppercase tracking-tight">Cambiar Contraseña</h3>
              </div>
              <button onClick={() => setShowSettings(false)} className="hover:bg-white/10 p-2 rounded-xl transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handlePasswordChange} className="p-8 space-y-6">
              {passwordStatus.error && (
                <div className="p-4 bg-red-50 text-red-500 rounded-2xl text-xs font-bold border border-red-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full" /> {passwordStatus.error}
                </div>
              )}
              {passwordStatus.success && (
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold border border-emerald-100 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> ¡Contraseña actualizada con éxito!
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="oldPassword" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block pointer-events-none">Contraseña Actual</label>
                  <input
                    id="oldPassword"
                    name="oldPassword"
                    type="password"
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-[#00bcd4]/10 focus:border-[#00bcd4]/40 transition-all font-semibold"
                    value={passwordForm.oldPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="newPassword" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block pointer-events-none">Nueva Contraseña</label>
                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                    minLength={8}
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-[#00bcd4]/10 focus:border-[#00bcd4]/40 transition-all font-semibold"
                    value={passwordForm.newPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  />
                  <p className="text-[9px] text-gray-400 mt-1 ml-1">Mín. 8 caracteres, 1 mayúscula y 1 número</p>
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block pointer-events-none">Confirmar Nueva Contraseña</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:outline-none focus:ring-4 focus:ring-[#00bcd4]/10 focus:border-[#00bcd4]/40 transition-all font-semibold"
                    value={passwordForm.confirmPassword}
                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={passwordStatus.loading}
                className="w-full bg-[#00bcd4] hover:bg-[#00acc1] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-[#00bcd4]/20 active:scale-[0.98] disabled:opacity-50"
              >
                {passwordStatus.loading ? 'Actualizando...' : 'Guardar Nueva Contraseña'}
              </button>
            </form>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold">&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
            <div className="bg-gradient-to-r from-[#002e5b] to-[#004a8f] px-8 py-6 flex items-center gap-3">
              <div className="bg-[#00bcd4] p-2 rounded-xl text-white">
                <CheckCircle2 size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-white font-black tracking-tight text-lg">Emitir Certificado</h2>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div>
                <label htmlFor="studentName" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1 mb-2.5 block pointer-events-none">Nombre del Estudiante</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#00bcd4] pointer-events-none">
                    <User size={20} />
                  </div>
                  <input
                    id="studentName"
                    name="studentName"
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-4 focus:ring-[#00bcd4]/10 focus:bg-white focus:border-[#00bcd4]/40 transition-all text-sm font-semibold text-[#002e5b] placeholder:text-gray-300"
                    placeholder="Ej: Barbara Arias"
                    value={studentName}
                    onChange={e => setStudentName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="level" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1 mb-2.5 block pointer-events-none">Nivel CEFR</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#00bcd4] pointer-events-none">
                    <Award size={20} />
                  </div>
                  <select
                    id="level"
                    name="level"
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
                </div>
              </div>

              <div>
                <label htmlFor="issueDate" className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] ml-1 mb-2.5 block pointer-events-none">Fecha de Emisión</label>
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 transition-colors group-focus-within:text-[#00bcd4] pointer-events-none">
                    <Calendar size={20} />
                  </div>
                  <input
                    id="issueDate"
                    name="issueDate"
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

        <div className="lg:col-span-7">
          <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-gray-100 min-h-full transition-all hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] overflow-hidden">
            <CertificateHistory refreshHistory={refreshHistory} />
          </div>
        </div>
      </div>
    </div>
  );
}
