import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { History, FileText, Search } from 'lucide-react';

interface Certificate {
    id: string;
    student_name: string;
    course_level: string;
    completion_date: string;
    created_at: string;
}

interface Props {
    refreshHistory?: boolean;
}

export default function CertificateHistory({ refreshHistory }: Props) {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user, authFetch } = useAuth();

    const fetchHistory = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await authFetch(`${API_URL}/api/certificates`);

            if (response.ok) {
                const data = await response.json();
                setCertificates(data);
            }
        } catch (error) {
            console.error('Error fetching history:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [refreshHistory, user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="w-8 h-8 border-2 border-[#00bcd4]/30 border-t-[#00bcd4] rounded-full animate-spin" />
                <p className="text-gray-400 text-sm animate-pulse">Cargando registros...</p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden mt-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-[#002e5b] flex items-center gap-2">
                        <History className="text-[#00bcd4] w-5 h-5" />
                        Historial de Emisiones
                    </h3>
                    <p className="text-gray-400 text-[10px] mt-1 uppercase tracking-widest font-bold">
                        Base de datos Idiomas OCW
                    </p>
                </div>
                <div className="bg-[#00bcd4]/10 px-3 py-1 rounded-full border border-[#00bcd4]/20 text-[#00bcd4] text-[10px] font-bold">
                    {certificates.length} REGISTROS
                </div>
            </div>

            {/* Buscador */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                    type="text"
                    placeholder="Buscar por estudiante o nivel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#00bcd4]/20 focus:border-[#00bcd4]/50 transition-all font-medium placeholder:text-gray-300"
                />
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-gray-100 italic">
                            <th className="pb-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Estudiante
                            </th>
                            <th className="pb-4 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Nivel
                            </th>
                            <th className="pb-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                Emisión
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {certificates.filter(cert =>
                            cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            cert.course_level.toLowerCase().includes(searchTerm.toLowerCase())
                        ).length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-12 text-center text-gray-300">
                                    <FileText size={42} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-sm font-medium">
                                        {searchTerm ? 'No se encontraron resultados' : 'Sin certificados emitidos'}
                                    </p>
                                </td>
                            </tr>
                        ) : (
                            certificates
                                .filter(cert =>
                                    cert.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    cert.course_level.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map(cert => (
                                    <tr key={cert.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 pr-4 font-bold text-[#002e5b]">
                                            {cert.student_name}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className="text-[10px] font-black bg-[#00bcd4]/10 text-[#00bcd4] px-2 py-0.5 rounded border border-[#00bcd4]/20">
                                                {cert.course_level}
                                            </span>
                                        </td>
                                        <td className="py-4 pl-4 text-right text-[11px] font-bold text-gray-400 uppercase">
                                            {new Date(cert.completion_date).toLocaleDateString('es-ES')}
                                        </td>
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
