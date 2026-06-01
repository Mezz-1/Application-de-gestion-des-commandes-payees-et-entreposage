import React, { useState } from 'react';
import Sidebar from './Sidebar';
import OrderTable from './OrderTable';

function Dashboard({ user }) {
  const [orders, setOrders] = useState([
    { id_commande: 1024, client: '{"nom_complet":"Mohamed Alami", "tel":"0611223344"}', date_paiement: '2026-05-15', montant_ttc: 4500, statut_entrepot: 'gratuit', force_majeure: 0 },
    { id_commande: 1025, client: '{"nom_complet":"Yassine Taghi", "tel":"0655667788"}', date_paiement: '2026-04-12', montant_ttc: 12300, statut_entrepot: 'notifie', force_majeure: 0 },
    { id_commande: 1026, client: '{"nom_complet":"Fatima Zohra", "tel":"0699001122"}', date_paiement: '2026-03-01', montant_ttc: 7800, statut_entrepot: 'mise_en_demeure', force_majeure: 0 },
    { id_commande: 1027, client: '{"nom_complet":"Sanaa Bensouda", "tel":"0644332211"}', date_paiement: '2026-05-20', montant_ttc: 3200, statut_entrepot: 'gratuit', force_majeure: 1 }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const filteredOrders = orders.filter(order => {
    const idMatches = order.id_commande.toString().includes(searchTerm);
    let nameMatches = false;
    try {
      nameMatches = JSON.parse(order.client).nom_complet.toLowerCase().includes(searchTerm.toLowerCase());
    } catch(e) {}
    return idMatches || nameMatches;
  });
  const totalInStock = orders.length;
  const totalWarnings = orders.filter(order => order.statut_entrepot === 'notifie').length;
  const totalCritical = orders.filter(order => order.statut_entrepot === 'mise_en_demeure').length;
  const totalFeesGenerated = 780; 

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-hidden font-sans">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        <div className="bg-[#B12024] relative p-8 text-white shrink-0 shadow-md overflow-hidden m-6 mb-2 rounded-2xl">
          <div className="absolute w-48 h-48 bg-white/5 rounded-full -top-12 -left-12 pointer-events-none" />
          <div className="absolute w-40 h-40 bg-white/5 rounded-full top-4 -left-16 pointer-events-none" />
          <div className="absolute w-36 h-36 bg-white/5 rounded-full -bottom-12 right-12 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="bg-white/20 text-white text-[9px] uppercase font-black px-2 py-0.5 rounded tracking-wider">
                Console d'Administration
              </span>
              <h1 className="text-2xl font-black tracking-tight mt-1">Bienvenue chez KITEA</h1>
              <p className="text-xs text-red-100 opacity-90 font-medium mt-0.5">
                Système fédéré de suivi des flux d'entreposage logistique
              </p>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="🔍 Rechercher une commande ou un client..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2.5 bg-white text-gray-800 placeholder-gray-400 rounded-xl text-xs w-72 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all font-medium shadow-lg border-none"
              />
            </div>
          </div>
        </div>
        <div className="p-6 space-y-6 max-w-6xl w-full">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total en Stock</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{totalInStock}</p>
              <span className="text-[10px] text-gray-400 block mt-1">Enregistrements actifs</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs border-b-4 border-amber-500">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Relances (J+30)</p>
              <p className="text-2xl font-black text-amber-500 mt-1">{totalWarnings}</p>
              <span className="text-[10px] text-amber-600/80 font-medium block mt-1">Notifications prêtes</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs border-b-4 border-[#B12024]">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mises en Demeure (J+60)</p>
              <p className="text-2xl font-black text-[#B12024] mt-1">{totalCritical}</p>
              <span className="text-[10px] text-red-500 font-bold block animate-pulse mt-1">⚠️ Pénalités actives</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs border-b-4 border-emerald-600">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Frais Générés</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{totalFeesGenerated} MAD</p>
              <span className="text-[10px] text-emerald-600 font-medium block mt-1">Frais d'entreposage</span>
            </div>
          </div>
          <OrderTable orders={filteredOrders} />

        </div>
      </div>
    </div>
  );
}

export default Dashboard;