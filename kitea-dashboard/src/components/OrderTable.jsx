import React from 'react';
import { Link } from 'react-router-dom';

// 🏷️ Centralized design configurations for warehouse states
const STATUS_CONFIG = {
    force_majeure: {
        bg: 'bg-purple-50 hover:bg-purple-100/50',
        border: 'border-purple-500',
        badge: 'bg-purple-100 text-purple-800',
        label: 'Force Majeure'
    },
    mise_en_demeure: {
        bg: 'bg-red-50/40 hover:bg-red-50/70',
        border: 'border-[#B12024]',
        badge: 'bg-red-100 text-[#B12024]',
        label: 'Mise En Demeure'
    },
    notifie: {
        bg: 'bg-amber-50/40 hover:bg-amber-50/70',
        border: 'border-amber-500',
        badge: 'bg-amber-100 text-amber-800',
        label: 'Notifié (J+30)'
    },
    gratuit: {
        bg: 'bg-white hover:bg-gray-50',
        border: 'border-emerald-500',
        badge: 'bg-emerald-100 text-emerald-800',
        label: 'Phase Gratuite'
    },
    post_delai: {
        bg: 'bg-red-50/30 hover:bg-red-50/50 transition-colors',
        border: 'border-red-200',
        badge: 'bg-red-100 text-[#B12024] font-black uppercase tracking-wider',
        label: 'Délai Dépassé'
    },
    annulée: {
        bg: 'bg-gray-50 hover:bg-gray-100/70 opacity-75',
        border: 'border-gray-400',
        badge: 'bg-gray-200 text-gray-700 line-through font-bold',
        label: 'Commande Annulée'
    },
    default: {
        bg: 'bg-white hover:bg-gray-50',
        border: 'border-gray-200',
        badge: 'bg-gray-100 text-gray-600 font-medium',
        label: 'Statut Inconnu'
    }
};

export default function OrderTable({ orders = [] }) {
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

    return (
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
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="p-12 text-center text-gray-400 font-bold bg-gray-50/30">
                                    📦 Aucun dossier ne correspond à vos critères de filtrage actuels.
                                </td>
                            </tr>
                        ) : (
                            orders.map(order => {
                                const stateKey = order.force_majeure ? 'force_majeure' : (order.statut_entrepot);
                                const style = STATUS_CONFIG[stateKey] || STATUS_CONFIG.default;

                                return (
                                    <tr
                                        key={order.id_commande}
                                        className={`transition-all border-l-4 ${style.bg} ${style.border}`}
                                    >
                                        <td className="p-4 font-bold text-gray-900">
                                            #{order.id_commande}
                                        </td>
                                        <td className="p-4 font-semibold text-gray-800">
                                            {getClientName(order.client || order.nom_client)}
                                        </td>
                                        <td className="p-4 text-gray-400 font-normal">
                                            {order.date_paiment}
                                        </td>
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
                                                <button className="bg-gray-900 hover:bg-[#B12024] text-white text-[10px] font-extrabold px-3 py-1.5 rounded-lg transition-all shadow-xs active:scale-95">
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
        </div>
    );
}