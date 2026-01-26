import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.access_token) return;

            const response = await fetch(`${API_URL}/api/certificates`, {
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                }
            });

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
    }, [refreshHistory]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
            <p className="text-slate-500 text-sm animate-pulse">Cargando registros...</p>
        </div>
    );

    return (
        <div className="overflow-hidden mt-4">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                        <History className="text-indigo-400 w-5 h-5" />
                        Historial de Emisiones
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 uppercase tracking-widest font-medium">Registros guardados en Supabase</p>
                </div>
                <div className="bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 text-blue-400 text-[10px] font-bold">
                    {certificates.length} TOTAL
                </div>
            </div>

            <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b border-white/5">
                            <th className="pb-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Estudiante</th>
                            <th className="pb-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nivel</th>
                            <th className="pb-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-widest">Emisión</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {certificates.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="py-12 text-center">
                                    <div className="flex flex-col items-center opacity-20">
                                        <FileText size={48} className="mb-2" />
                                        <p className="text-sm font-medium">No hay certificados generados aún</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            certificates.map((cert) => (
                                <tr key={cert.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 pr-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold text-xs">
                                                {cert.student_name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">
                                                {cert.student_name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                            {cert.course_level}
                                        </span>
                                    </td>
                                    <td className="py-4 pl-4 whitespace-nowrap text-xs text-slate-500">
                                        {new Date(cert.completion_date).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
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

// Re-using same icons to avoid extra imports if possible, or just add them
import { History, FileText } from 'lucide-react';
