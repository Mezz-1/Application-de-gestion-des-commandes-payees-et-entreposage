import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import OrderTable from './OrderTable';
import api from '../api/axios';

function Dashboard({ user }) {
    const [orders, setOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [Loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [metrics, setMetrics] = useState({
        total_commandes_entrepot: 0,
        phase_gratuit_count: 0,
        phase_notifie_count: 0,
        phase_mise_demeure_count: 0,
        total_penalites_mad: 0,
        retards_livraison_kitea: 0,
        cas_force_majeure_actifs: 0,
    });
    useEffect(() => {
  const getDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, ordersResponse] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/commandes')
      ]);
      // 2. Safe parsing for metrics
      if (statsResponse.data && statsResponse.data.success && statsResponse.data.metrics) {
        setMetrics(statsResponse.data.metrics);
      } else if (statsResponse.data && !statsResponse.data.metrics) {
        setMetrics(statsResponse.data);
      }

      // 3. Safe parsing for orders list
      const incomingOrders = ordersResponse.data.data || ordersResponse.data;
      setOrders(Array.isArray(incomingOrders) ? incomingOrders : []);
      setError(null);
    } catch (err) {
      console.error("API Connection Error:", err);
      setError("Erreur de synchronisation avec l'API Laravel MySQL.");
    } finally {
      setLoading(false);
    }
  };

  getDashboardData();
}, []);
    const ordersArray = Array.isArray(orders) ? orders : [];
    const filteredOrders = ordersArray.filter(order => {
        const idMatches = order.id_commande.toString().includes(searchTerm);
        let nameMatches = false;
        if (order.client) {
            if (typeof order.client === 'object') {
                nameMatches = order.client.nom_complet?.toLowerCase().includes(searchTerm.toLowerCase());
            }
            else if (typeof order.client === 'string') {
                try {
                    nameMatches = JSON.parse(order.client).nom_complet.toLowerCase().includes(searchTerm.toLowerCase());
                } catch (e) {
                    nameMatches = order.client.toLowerCase().includes(searchTerm.toLowerCase());
                }
            }
        }
        return idMatches || nameMatches;
    });

    
    return (
    <div className="min-h-screen bg-gray-100 flex overflow-hidden font-sans">
    
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Header Top Bar Banner */}
        <div className="bg-[#B12024] relative p-8 text-white shrink-0 shadow-md overflow-hidden m-6 mb-2 rounded-2xl">
          <div className="absolute w-48 h-48 bg-white/5 rounded-full -top-12 -left-12 pointer-events-none" />
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
                placeholder="Rechercher une commande ou un client..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2.5 bg-white text-gray-800 placeholder-gray-400 rounded-xl text-xs w-72 focus:outline-none focus:ring-2 focus:ring-red-400 transition-all font-medium shadow-lg border-none"
              />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-w-6xl w-full">
          {metrics.retards_livraison_kitea > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between text-xs text-amber-800 shadow-xs">
              <div className="flex items-center space-x-2">
                <span className="text-base">⚠️</span>
                <span>
                  Attention : Il y a <strong>{metrics.retards_livraison_kitea} commande(s)</strong> avec un retard de livraison KITEA supérieur à 7 jours. Les clients ont un droit d'annulation immédiat.
                </span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total en Stock</p>
              <p className="text-2xl font-black text-gray-900 mt-1">{metrics.total_commandes_entrepot}</p>
              <span className="text-[10px] text-gray-400 block mt-1">Enregistrements actifs</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs border-b-4 border-amber-500">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Relances (J+30)</p>
              <p className="text-2xl font-black text-amber-500 mt-1">{metrics.phase_notifie_count}</p>
              <span className="text-[10px] text-amber-600/80 font-medium block mt-1">Notifications prêtes</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs border-b-4 border-b-[#B12024]">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mises en Demeure (J+60)</p>
              <p className="text-2xl font-black text-[#B12024] mt-1">{metrics.phase_mise_demeure_count}</p>
              <span className="text-[10px] text-red-500 font-bold block animate-pulse mt-1">⚠️ Pénalités actives</span>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs border-b-4 border-b-emerald-600">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Frais Générés</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">{Number(metrics.total_penalites_mad).toLocaleString()} MAD</p>
              <span className="text-[10px] text-emerald-600 font-medium block mt-1">Sum from Frais Table</span>
            </div>
          </div>

          {/* Main Layout Rendering Engine */}
          {Loading ? (
            <div className="p-12 text-center text-xs font-bold text-gray-400 bg-white rounded-xl border border-gray-200 shadow-xs">
              <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-gray-400 rounded-full mb-2" role="status"></div>
              <p>Chargement en cours des flux de stockage MySQL...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-xs font-bold text-red-600 bg-red-50 rounded-xl border border-red-200">
              {error}
            </div>
          ) : (
            <OrderTable orders={filteredOrders} />
          )}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;