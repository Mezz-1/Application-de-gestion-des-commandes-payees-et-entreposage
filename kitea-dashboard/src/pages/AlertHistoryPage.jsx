import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // Your authenticated axios instance
import Sidebar from '../components/Sidebar';

export default function AlertsHistoryPage({user}) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlertsHistory = async () => {
            try {
                setLoading(true);
                const response = await api.get('/dashboard/alerts-history');
                setLogs(response.data.data || []);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to load legal notification archives.");
            } finally {
                setLoading(false);
            }
        };

        fetchAlertsHistory();
    }, []);

    if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading audit trail...</div>;
    if (error) return <div className="p-10 text-center font-bold text-red-600">{error}</div>;

    return (

        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-black text-gray-900">Archivage Légal des Notifications</h1>
                <p className="text-xs text-gray-400 mt-1">Legal tracking and traceability ledger for dispatched customer alerts.</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase border-b border-gray-200 tracking-wider">
                            <th className="p-4">ID Alerte</th>
                            <th className="p-4">N° Commande</th>
                            <th className="p-4">Type de Relance</th>
                            <th className="p-4">Date d'Envoi</th>
                            <th className="p-4">Statut Distribution</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xs text-gray-600 font-medium">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-10 text-center text-gray-400 font-bold">
                                    Aucune notification n'a été enregistrée pour le moment.
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id_notification} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-bold text-gray-400">#{log.id_notification}</td>
                                    <td className="p-4 font-bold text-gray-900">#{log.commande_id}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${log.type === 'mise_en_demeure'
                                                ? 'bg-red-100 text-[#B12024]'
                                                : 'bg-amber-100 text-amber-800'
                                            }`}>
                                            {log.type === 'mise_en_demeure' ? 'Mise en Demeure (J+60)' : 'Notification (J+30)'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-500">
                                        {new Date(log.date_envoi).toLocaleString('fr-FR')}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center w-max space-x-1 ${log.statut === 'sent' || log.statut === 'succès'
                                                ? 'bg-emerald-100 text-emerald-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            <span>{log.statut === 'Envoyé' || log.statut === 'succès' ? '● Délivré' : '▲ Échec'}</span>
                                        </span>
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