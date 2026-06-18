import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const STATUS_CONFIG = {
    all: { badge: 'bg-gray-100 text-gray-800', label: 'Tous les dossiers' },
    force_majeure: { bg: 'bg-purple-50 hover:bg-purple-100/50', border: 'border-purple-500', badge: 'bg-purple-100 text-purple-800', label: 'Force Majeure' },
    mise_en_demeure: { bg: 'bg-red-50/40 hover:bg-red-50/70', border: 'border-[#B12024]', badge: 'bg-red-100 text-[#B12024]', label: 'Mise En Demeure' },
    notifie: { bg: 'bg-amber-50/40 hover:bg-amber-50/70', border: 'border-amber-500', badge: 'bg-amber-100 text-amber-800', label: 'Notifié (J+30)' },
    gratuit: { bg: 'bg-white hover:bg-gray-50', border: 'border-emerald-500', badge: 'bg-emerald-100 text-emerald-800', label: 'Phase Gratuite' },
    post_delai: { bg: 'bg-red-50/30 hover:bg-red-50/50 transition-colors', border: 'border-red-200', badge: 'bg-red-100 text-[#B12024] font-black uppercase tracking-wider', label: 'Délai Dépassé' },
    annulée: { bg: 'bg-gray-50 hover:bg-gray-100/70 opacity-75', border: 'border-gray-400', badge: 'bg-gray-200 text-gray-700 line-through font-bold', label: 'Commande Annulée' },
    default: { bg: 'bg-white hover:bg-gray-50', border: 'border-gray-200', badge: 'bg-gray-100 text-gray-600 font-medium', label: 'Statut Inconnu' }
};

export default function OrderTable({ orders = [] }) {
    // --- 🎛️ State pour le filtre de statut actif ---
    const [activeFilter, setActiveFilter] = useState('all');
    
    // --- Pagination State ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // --- Helper to parse Client Names ---
    const getClientName = (clientData) => {
        if (!clientData) return "Client Inconnu";
        if (typeof clientData === 'object') return clientData.nom_complet || "Client Inconnu";
        if (typeof clientData === 'string') {
            try {
                const parsed = JSON.parse(clientData);
                return parsed.nom_complet || clientData;
            } catch (e) {
                return clientData;
            }
        }
        return "Client Inconnu";
    };

    // --- 🔍 Logique de Filtrage par Bouton ---
    const filteredOrders = orders.filter(order => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'force_majeure') return order.force_majeure;
        return order.statut_entrepot === activeFilter;
    });

    // --- Pagination Math Logic basée sur les dossiers filtrés ---
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleFilterChange = (filterType) => {
        setActiveFilter(filterType);
        setCurrentPage(1); // Revenir à la page 1 lors d'un changement de filtre
    };

    return (
        <div className="space-y-4">
            {/* 🎛️ BARRE DE BOUTONS DE FILTRAGE (TABS) */}
            <div className="flex flex-wrap gap-2 bg-gray-50 p-2 rounded-xl border border-gray-200/60">
                {['all', 'gratuit', 'notifie', 'mise_en_demeure', 'force_majeure', 'annulée'].map((status) => {
                    const isActive = activeFilter === status;
                    // Compter le nombre d'éléments pour chaque statut
                    const count = orders.filter(o => {
                        if (status === 'all') return true;
                        if (status === 'force_majeure') return o.force_majeure;
                        return o.statut_entrepot === status;
                    }).length;

                    return (
                        <button
                            key={status}
                            onClick={() => handleFilterChange(status)}
                            className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all uppercase tracking-wide cursor-pointer ${
                                isActive 
                                    ? 'bg-gray-900 text-white shadow-xs' 
                                    : 'bg-white text-gray-500 hover:text-gray-900 border border-gray-200'
                            }`}
                        >
                            {STATUS_CONFIG[status]?.label || status}
                            <span className={`ml-1.5 px-1.5 py-0.2 rounded-md text-[9px] ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                {count}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* TABLEAU PRINCIPAL */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-[11px] font-bold text-gray-400 uppercase border-b border-gray-200 tracking-wider">
                                <th className="p-4">N° Commande</th>
                                <th className="p-4">Client</th>
                                <th className="p-4">Date Paiement</th>
                                <th className="p-4">Montant TTC</th>
                                <th className="p-4">Statut de Garde</th>
                                <th className="p-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xs text-gray-600 font-medium">
                            {currentOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-12 text-center text-gray-400 font-bold bg-gray-50/30">
                                        📦 Aucun dossier ne correspond à vos critères de filtrage actuels.
                                    </td>
                                </tr>
                            ) : (
                                currentOrders.map(order => {
                                    const stateKey = order.force_majeure ? 'force_majeure' : order.statut_entrepot;
                                    const style = STATUS_CONFIG[stateKey] || STATUS_CONFIG.default;

                                    return (
                                        <tr
                                            key={order.id_commande}
                                            className={`transition-all border-l-4 ${style.bg} ${style.border}`}
                                        >
                                            <td className="p-4 font-bold text-gray-900">#{order.id_commande}</td>
                                            <td className="p-4 font-semibold text-gray-800">{getClientName(order.client || order.nom_client)}</td>
                                            <td className="p-4 text-gray-400 font-normal">{order.date_paiment || order.date_paiement}</td>
                                            <td className="p-4 font-bold text-gray-900 tracking-tight">
                                                {Number(order.montant_ttc).toLocaleString('fr-MA')} <span className="text-[10px] text-gray-400 font-normal">MAD</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${style.badge}`}>
                                                    {style.label}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <Link to={`/commande/${order.id_commande}`}>
                                                    <button className="bg-gray-900 hover:bg-[#B12024] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all shadow-xs active:scale-95 cursor-pointer">
                                                        Gérer le dossier
                                                    </button>
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- Pagination Controls --- */}
                {filteredOrders.length > itemsPerPage && (
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs text-gray-500">
                                    Affichage de <span className="font-bold text-gray-900">{indexOfFirstItem + 1}</span> à{' '}
                                    <span className="font-bold text-gray-900">{Math.min(indexOfLastItem, filteredOrders.length)}</span> sur{' '}
                                    <span className="font-bold text-gray-900">{filteredOrders.length}</span> dossiers
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-1" aria-label="Pagination">
                                    <button
                                        onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                                        disabled={currentPage === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 select-none"
                                    >
                                        &larr;
                                    </button>
                                    {[...Array(totalPages)].map((_, index) => {
                                        const pageNumber = index + 1;
                                        return (
                                            <button
                                                key={pageNumber}
                                                onClick={() => handlePageChange(pageNumber)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-xs font-bold transition-colors ${
                                                    currentPage === pageNumber ? 'z-10 bg-gray-900 border-gray-900 text-white' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNumber}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                                        disabled={currentPage === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 select-none"
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