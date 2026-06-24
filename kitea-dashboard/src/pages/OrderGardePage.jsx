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
    if (activeTab === 'mise_en_demeure') return order.statut_entrepot === 'mise_en_demeure';
    if (activeTab === 'force_majeure') return order.force_majeure || order.statut_entrepot === 'force_majeure';
    if (activeTab === 'annulée') return order.statut_entrepot === 'annulée';
    return true; 
  });
  const tabLabels = {
    all: 'Tout le Stock',
    gratuit: 'Phase Gratuite',
    notifie: 'Alerte J+30',
    mise_en_demeure: 'Mise en Demeure (J+60)',
    force_majeure: 'Force Majeure',
    annulée: 'Annulées'
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-4 border-[#8B1D34] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-[#8B1D34] font-extrabold tracking-widest uppercase">Chargement du registre logistique...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-100 pb-5 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#8B1D34]/10 rounded-lg text-[#8B1D34]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Commandes en Garde</h1>
            <p className="text-sm text-gray-500 mt-0.5">Supervision de l'occupation physique et du statut juridique des stocks.</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl w-max">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>Registre Actif: {orders.length} commandes</span>
        </div>
      </div>
      <div className="flex bg-gray-100/80 p-1 rounded-xl w-max max-w-full overflow-x-auto border border-gray-200/50 shadow-inner">
        {['all', 'gratuit', 'notifie', 'mise_en_demeure', 'force_majeure', 'annulée'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-150 whitespace-nowrap ${
              activeTab === tab 
                ? 'bg-[#8B1D34] text-white shadow-md' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            {tabLabels[tab]}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-[11px] font-bold text-gray-500 uppercase border-b border-gray-200 tracking-wider">
                <th className="py-4 px-6">ID Commande</th>
                <th className="py-4 px-6">Date de Dépôt</th>
                <th className="py-4 px-6">Délai Écoulé</th>
                <th className="py-4 px-6">Statut de Stockage</th>
                <th className="py-4 px-6 text-right">Valeur Marchandise</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-600 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-16 bg-gray-50/20">
                    <div className="flex flex-col items-center justify-center space-y-2 text-gray-400">
                      <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="font-semibold text-gray-500">Aucune commande trouvée dans cette catégorie.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const totalDays = calculateDaysInStorage(order.date_paiment);
                  
                  let statusStyles = "bg-emerald-50 text-emerald-700 border-emerald-100";
                  let dotColor = "bg-emerald-500";
                  let displayStatus = "Phase Gratuite";
                  
                  if (order.force_majeure || order.statut_entrepot === 'force_majeure') {
                    statusStyles = "bg-blue-50 text-blue-700 border-blue-100";
                    dotColor = "bg-blue-500";
                    displayStatus = "Gelé (Force Majeure)";
                  } else if (order.statut_entrepot === 'mise_en_demeure') {
                    statusStyles = "bg-red-50 text-[#8B1D34] border-red-100";
                    dotColor = "bg-[#8B1D34]";
                    displayStatus = "Mise en Demeure (J+60)";
                  } else if (order.statut_entrepot === 'notifie') {
                    statusStyles = "bg-amber-50 text-amber-800 border-amber-100";
                    dotColor = "bg-amber-500";
                    displayStatus = "Alerte Envoyée (J+30)";
                  } else if (order.statut_entrepot === 'annulee') {
                    statusStyles = "bg-gray-100 text-gray-600 border-gray-200";
                    dotColor = "bg-gray-400";
                    displayStatus = "Annulee";
                  }

                  return (
                    <tr key={order.id_commande} className="hover:bg-gray-50/50 transition-colors duration-150 group">
                      <td className="py-4 px-6 font-bold text-gray-900 group-hover:text-[#8B1D34] transition-colors">
                        #CMD-{order.id_commande}
                      </td>
                      <td className="py-4 px-6 text-gray-500 font-mono text-xs">
                        {order.date_paiment ? new Date(order.date_paiment).toLocaleDateString('fr-FR') : '---'}
                      </td>
                      <td className="py-4 px-6 font-semibold">
                        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md font-mono text-xs font-bold ${
                          totalDays >= 45 ? 'text-red-600 bg-red-50' : 'text-gray-700 bg-gray-50'
                        }`}>
                          <span>{totalDays} jours</span>
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-bold uppercase tracking-wide ${statusStyles}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                          {displayStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-gray-900 font-mono">
                        {Number(order.montant_ttc).toLocaleString('fr-MA', { minimumFractionDigits: 2 })} <span className="text-[10px] text-gray-400 font-sans">MAD</span>
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