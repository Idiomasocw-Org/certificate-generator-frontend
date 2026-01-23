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

    if (loading) return <div className="text-center py-4">Cargando historial...</div>;

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-700">Historial de Certificados</h3>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiante</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nivel</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de Emisión</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {certificates.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No hay certificados generados aún</td>
                            </tr>
                        ) : (
                            certificates.map((cert) => (
                                <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{cert.student_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.course_level}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(cert.completion_date).toLocaleDateString()}
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
