import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AlertsHistoryPage({ user }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        const fetchAlertsHistory = async () => {
            try {
                setLoading(true);
                const response = await api.get('/dashboard/alerts-history');
                setLogs(response.data.data || []);
                setError(null);
            } catch (err) {
                console.error(err);
                setError("Impossible de charger les archives légales des notifications.");
            } finally {
                setLoading(false);
            }
        };

        fetchAlertsHistory();
    }, []);
    if (loading) {
        return (
            <div className="space-y-6 animate-pulse p-2">
                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="bg-white rounded-xl h-96 border border-gray-200 shadow-sm"></div>
            </div>
        );
    }
    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 border border-red-200 rounded-xl max-w-xl mx-auto mt-10">
                <svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <div className="font-bold text-red-800 text-lg mb-1">Erreur de synchronisation</div>
                <div className="text-sm text-red-600">{error}</div>
            </div>
        );
    }
    const totalPages = Math.ceil(logs.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLogs = logs.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="space-y-6 p-2">
            <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#8B1D34]/10 rounded-lg text-[#8B1D34]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Archivage Légal des Notifications</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Registre officiel de traçabilité et d'audit des alertes clients expédiées.</p>
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/70 text-[11px] font-bold text-gray-500 uppercase border-b border-gray-200 tracking-wider">
                                <th className="py-4 px-6">ID Alerte</th>
                                <th className="py-4 px-6">N° Commande</th>
                                <th className="py-4 px-6">Type de Notification</th>
                                <th className="py-4 px-6">Date & Heure d'Envoi</th>
                                <th className="py-4 px-6">Statut Distribution</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm text-gray-600 font-medium">
                            {currentLogs.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-16 px-6 text-center text-gray-400">
                                        <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0l-3.586-3.586a1 1 0 00-1.414 0L12 12m0 0l-4-4m4 4v6" />
                                        </svg>
                                        <p className="font-semibold text-gray-500">Aucune notification archivée</p>
                                        <p className="text-xs text-gray-400 mt-1">Le journal d'audit est actuellement vierge.</p>
                                    </td>
                                </tr>
                            ) : (
                                currentLogs.map((log) => {
                                    const rawStatus = log.statut ? log.statut.toString().trim().toLowerCase() : '';
                                    const isDelivered = ['sent', 'succès', 'envoyé', 'success', 'delivered'].includes(rawStatus);

                                    return (
                                        <tr key={log.id_notification} className="hover:bg-gray-50/60 transition-colors duration-150">
                                            <td className="py-4 px-6 font-mono text-xs text-gray-400">#{log.id_notification}</td>
                                            <td className="py-4 px-6 font-bold text-gray-900">#{log.commande_id}</td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${
                                                    log.type === 'mise_en_demeure'
                                                        ? 'bg-red-50 text-[#8B1D34] border border-red-100'
                                                        : log.type === 'force_majeure'
                                                        ? 'bg-blue-50 text-blue-700 border border-blue-100'
                                                        : 'bg-amber-50 text-amber-800 border border-amber-100'
                                                }`}>
                                                    {log.type === 'mise_en_demeure' && 'Mise en Demeure (J+60)'}
                                                    {log.type === 'notification' && 'Relance Amiable (J+30)'}
                                                    {log.type === 'force_majeure' && 'Force Majeure (Gel)'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-gray-500 font-normal">
                                                {new Date(log.date_envoi).toLocaleString('fr-FR', {
                                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                                    hour: '2-digit', minute: '2-digit'
                                                })}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold space-x-1.5 ${
                                                    isDelivered
                                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${isDelivered ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                    <span className="capitalize">{isDelivered ? 'Délivré' : 'Échec'}</span>
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                {logs.length > itemsPerPage && (
                    <div className="bg-gray-50/70 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 text-xs font-bold rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-opacity"
                            >
                                Précédent
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-300 text-xs font-bold rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-opacity"
                            >
                                Suivant
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Affichage de <span className="font-bold text-gray-900">{indexOfFirstItem + 1}</span> à{' '}
                                    <span className="font-bold text-gray-900">{Math.min(indexOfLastItem, logs.length)}</span> sur{' '}
                                    <span className="font-bold text-gray-900">{logs.length}</span> correspondances enregistrées
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-lg shadow-sm -space-x-px bg-white border border-gray-200" aria-label="Pagination">
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2.5 py-2 rounded-l-lg text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                                    >
                                        &larr;
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNumber = index + 1;
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => setCurrentPage(pageNumber)}
                                                className={`relative inline-flex items-center px-3.5 py-2 text-xs font-bold border-r border-gray-200 last:border-r-0 transition-colors ${
                                                    currentPage === pageNumber
                                                        ? 'bg-[#8B1D34] text-white'
                                                        : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2.5 py-2 rounded-r-lg text-gray-400 hover:bg-gray-50 disabled:opacity-40 transition-colors"
                                    >
                                        &rarr;
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}