import React, { useState, useEffect } from 'react';
import api from '../api/axios'; // Your authenticated axios instance

export default function AlertsHistoryPage({ user }) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

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

    // --- Pagination Logic ---
    const totalPages = Math.ceil(logs.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLogs = logs.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

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
                        {currentLogs.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="p-10 text-center text-gray-400 font-bold">
                                    Aucune notification n'a été enregistrée pour le moment.
                                </td>
                            </tr>
                        ) : (
                            currentLogs.map((log) => (
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
                                        {(() => {
                                            const rawStatus = log.statut ? log.statut.toString().trim().toLowerCase() : '';
                                            const isDelivered = ['sent', 'succès', 'envoyé', 'success', 'delivered'].includes(rawStatus);

                                            return (
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold flex items-center w-max space-x-1 ${isDelivered
                                                        ? 'bg-emerald-100 text-emerald-800'
                                                        : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    <span>{isDelivered ? '● envoyé' : '▲ Échec'}</span>
                                                </span>
                                            );
                                        })()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* --- Pagination Controls Footer --- */}
                {logs.length > itemsPerPage && (
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-xs font-bold rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Précédent
                            </button>
                            <button
                                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-xs font-bold rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                Suivant
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Affichage de <span className="font-bold text-gray-900">{indexOfFirstItem + 1}</span> à{' '}
                                    <span className="font-bold text-gray-900">
                                        {Math.min(indexOfLastItem, logs.length)}
                                    </span>{' '}
                                    sur <span className="font-bold text-gray-900">{logs.length}</span> enregistrements
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-1" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Previous</span>
                                        &larr;
                                    </button>

                                    {/* Generate Page Numbers Buttons */}
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNumber = index + 1;
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-xs font-bold ${currentPage === pageNumber
                                                        ? 'z-10 bg-gray-900 border-gray-900 text-white'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}

                                    <button
                                        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <span className="sr-only">Next</span>
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