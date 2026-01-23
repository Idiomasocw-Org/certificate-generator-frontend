import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import CertificateHistory from '../components/CertificateHistory';

const ADMIN_EMAIL = 'barbaraarias844@gmail.com';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const [formData, setFormData] = useState({
    studentName: '',
    level: '',
    date: ''
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

      if (!session?.access_token) {
        throw new Error('No valid session found');
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
        // Convertir la respuesta a Blob
        const blob = await response.blob();

        // Crear URL temporal
        const url = window.URL.createObjectURL(blob);

        // Crear enlace invisible para descargar
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `certificado_${formData.studentName.replace(/\s+/g, '_')}.pdf`);
        document.body.appendChild(link);

        // Forzar clic
        link.click();

        // Limpiar
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);

        alert('Certificado generado y descargado con éxito');
        setFormData({ studentName: '', level: '', date: '' });
        setRefreshHistory(prev => !prev);
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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <button
            onClick={signOut}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Cerrar Sesión
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Bienvenido, {user?.email}</h2>
          <p className="text-gray-600">
            Completa el formulario para generar un nuevo certificado.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 text-gray-700">Generar Certificado</h3>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Estudiante</label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej. Juan Pérez"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nivel del Curso</label>
              <select
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione un nivel</option>
                <option value="Básico">Básico</option>
                <option value="Intermedio">Intermedio</option>
                <option value="Avanzado">Avanzado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Finalización</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className={`w-full font-bold py-2 px-4 rounded transition duration-300 ${isGenerating
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              {isGenerating ? 'Generando...' : 'Generar Certificado'}
            </button>
          </form>
        </div>

        <CertificateHistory refreshHistory={refreshHistory} />
      </div>
    </div>
  );
}
