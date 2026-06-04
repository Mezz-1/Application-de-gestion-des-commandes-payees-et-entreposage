import React, { useState, useEffect } from 'react';
import api from '../api/axios';

export default function OrdersGardePage() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/commandes')
      .then(res => {
        setOrders(res.data.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const calculateDaysInStorage = (paymentDate) => {
    if (!paymentDate) return 0;
    const diffTime = Math.abs(new Date() - new Date(paymentDate));
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'gratuit') return order.statut_entrepot === 'gratuit';
    if (activeTab === 'notifie') return order.statut_entrepot === 'notifie';
    if (activeTab === 'litige') return order.statut_entrepot === 'mise_en_demeure' || order.force_majeure;
    if (activeTab === 'annulée') return order.statut_entrepot === 'annulée';
    return true; 
  });

  // Explicit label mapper to fix structural inline string comparison bugs
  const tabLabels = {
    all: 'Tout le Stock',
    gratuit: 'Phase Gratuite',
    notifie: 'Alerte J+30',
    litige: 'Litiges / J+60',
    annulée: 'Annulées'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase">Chargement du registre logistique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-1">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-5 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            📦 Commandes en Garde
          </h1>
          <p className="text-xs text-gray-500 mt-1 font-medium">
            Supervision en temps réel de l'occupation physique des zones de stockage centralisées.
          </p>
        </div>
        
        {/* KPI Pills summary */}
        <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-gray-50 border border-gray-100 px-3 py-2 rounded-xl">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>Registre Actif: {orders.length} commandes</span>
        </div>
      </div>

      {/* Modern Tab Navigation switcher */}
      <div className="flex bg-gray-100 p-1 rounded-xl w-max max-w-full overflow-x-auto border border-gray-200/40 shadow-xs">
        {['all', 'gratuit', 'notifie', 'litige', 'annulée'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/50'
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>

      {/* Main Table Interface Wrapper */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase border-b border-gray-200 tracking-wider">
                <th className="p-4 pl-6">ID Commande</th>
                <th className="p-4">Date de Dépôt</th>
                <th className="p-4">Délai Écoulé</th>
                <th className="p-4">Statut de Stockage</th>
                <th className="p-4 text-right">Valeur Marchandise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-600 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-400 font-medium text-sm bg-gray-50/30">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <span className="text-2xl">📋</span>
                      <p>Aucune commande trouvée pour cette catégorie de garde.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const totalDays = calculateDaysInStorage(order.date_paiment);
                  
                  // Clean status styling engine mapping logic
                  let statusStyles = "bg-emerald-50 text-emerald-700 border-emerald-200/60";
                  let dotColor = "bg-emerald-500";
                  
                  if (order.force_majeure) {
                    statusStyles = "bg-purple-50 text-purple-700 border-purple-200/60";
                    dotColor = "bg-purple-500";
                  } else if (totalDays > 60 || order.statut_entrepot === 'mise_en_demeure') {
                    statusStyles = "bg-red-50 text-red-700 border-red-200/60";
                    dotColor = "bg-red-500";
                  } else if (totalDays > 30 || order.statut_entrepot === 'notifie') {
                    statusStyles = "bg-amber-50 text-amber-700 border-amber-200/60";
                    dotColor = "bg-amber-500";
                  } else if (order.statut_entrepot === 'annulée') {
                    statusStyles = "bg-gray-100 text-gray-600 border-gray-300/60";
                    dotColor = "bg-gray-400";
                  }

                  return (
                    <tr key={order.id_commande} className="hover:bg-gray-50/50 transition-colors group">
                      {/* ID Commande */}
                      <td className="p-4 pl-6 font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                        #CMD-{order.id_commande}
                      </td>
                      
                      {/* Date de dépôt */}
                      <td className="p-4 text-gray-500 font-mono">
                        {order.date_paiment || '---'}
                      </td>
                      
                      {/* Temps de garde relative values */}
                      <td className="p-4 font-semibold text-gray-800">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-mono font-bold ${
                          totalDays > 45 ? 'text-red-600 bg-red-50/50' : 'text-gray-700'
                        }`}>
                          ⏳ {totalDays} jours
                        </span>
                      </td>
                      
                      {/* Status Badges with indicators */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${statusStyles}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                          {order.force_majeure ? 'Gelé (Force Majeure)' : order.statut_entrepot}
                        </span>
                      </td>
                      
                      {/* Price conversions */}
                      <td className="p-4 text-right font-bold text-gray-900 font-mono">
                        {Number(order.montant_ttc).toLocaleString('fr-MA')} <span className="text-[10px] text-gray-400 font-sans">MAD</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}