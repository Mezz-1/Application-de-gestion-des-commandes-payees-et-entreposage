import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function OrderManagementPage({ user }) {
  const { id_commande } = useParams();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    fetchOrderDetails();
  }, [id_commande]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/commandes`);
      const allOrders = response.data.data || response.data;
      const currentOrder = allOrders.find(o => o.id_commande.toString() === id_commande.toString());
      
      if (currentOrder) {
        setOrder(currentOrder);
        if (currentOrder.date_livraison_prevue) {
          setSelectedDate(currentOrder.date_livraison_prevue.split(' ')[0]);
        }
        setError(null);
      } else {
        setError("Dossier introuvable dans le système central.");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur de communication avec l'API Laravel MySQL.");
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleDelivery = async (e) => {
    e.preventDefault();
    try {
      setActionLoading(true);
      const response = await api.put(`/commandes/${id_commande}/planifier-livraison`, {
        date_livraison_prevue: selectedDate
      });
      if (response.data.success) {
        alert(response.data.message);
        fetchOrderDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la planification.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleForceMajeure = async (currentState) => {
    try {
      setActionLoading(true);
      const response = await api.post(`/commandes/${id_commande}/toggle-force-majeure`, {
        force_majeure: !currentState
      });
      if (response.data.success) {
        alert(response.data.message);
        fetchOrderDetails();
      }
    } catch (err) {
      alert("Erreur lors de la mise à jour de la clause d'exception.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await api.get(`/commandes/${id_commande}/pdf-mise-en-demeure`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `KITEA_Mise_En_Demeure_Commande_${id_commande}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Ce dossier n'est pas encore admissible au stade légal de mise en demeure.");
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Confirmer la réception de la simulation LRAR client et valider le remboursement ?")) return;
    try {
      setActionLoading(true);
      const response = await api.post(`/commandes/${id_commande}/annuler`);
      if (response.data.success) {
        alert(response.data.message);
        fetchOrderDetails();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Annulation rejetée par les règles métier.");
    } finally {
      setActionLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-8 max-w-md w-full text-center shadow-xs">
          <div className="text-red-500 text-4xl mb-3">⚠️</div>
          <h2 className="text-gray-900 font-bold text-lg mb-2">Erreur Opérationnelle</h2>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">{error}</p>
          <Link to="/dashboard" className="inline-block bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-6 py-2 rounded-lg transition-colors">
            Retour au Tableau de Bord
          </Link>
        </div>
      </div>
    );
  }
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 animate-pulse">
        <div className="max-w-6xl mx-auto mb-6 h-5 bg-gray-200 rounded w-1/4" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 h-48" />
            <div className="bg-white rounded-xl p-6 border border-gray-200 h-36" />
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 h-24" />
            <div className="bg-white rounded-xl p-6 border border-gray-200 h-40" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;
  const datePaiement = new Date(order.date_paiment);
  const today = new Date();
  const daysInStorage = Math.floor((today - datePaiement) / (1000 * 60 * 60 * 24)) || 0;

  let isKiteaLateBy7Days = false;
  if (order.statut_livraison === 'planifiée' && order.date_livraison_prevue) {
    const targetDeliveryDate = new Date(order.date_livraison_prevue);
    const delayPeriod = Math.floor((today - targetDeliveryDate) / (1000 * 60 * 60 * 24));
    if (delayPeriod > 7) isKiteaLateBy7Days = true;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans antialiased">
      <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center space-x-2 text-xs font-medium text-gray-400">
          <Link to="/dashboard" className="hover:text-[#B12024] font-bold transition-colors">Tableau de bord</Link>
          <span>/</span>
          <span className="text-gray-900 font-bold">Dossier Commande #{order.id_commande}</span>
        </div>
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Opérateur central : <span className="text-gray-800 font-extrabold">{user?.nom || "Agent"}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 left-0 right-0 h-1.5 ${
              order.force_majeure ? 'bg-purple-500' :
              order.statut_entrepot === 'mise_en_demeure' ? 'bg-[#B12024]' : 'bg-amber-500'
            }`} />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">Commande #{order.id_commande}</h1>
                <p className="text-[11px] text-gray-400 font-bold uppercase mt-1">Acquisition ERP AX: {order.date_paiment}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-center w-max ${
                order.force_majeure ? 'bg-purple-100 text-purple-800' :
                order.statut_entrepot === 'mise_en_demeure' ? 'bg-red-100 text-[#B12024]' : 'bg-amber-100 text-amber-800'
              }`}>
                {order.force_majeure ? 'Clause d’Exception Active' : `Statut : ${order.statut_entrepot}`}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
              <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase font-black text-gray-400 block tracking-wider">Garde Entrepôt</span>
                <span className="text-xl font-black text-gray-900">{daysInStorage} Jours</span>
              </div>
              <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase font-black text-gray-400 block tracking-wider">Valeur Initiale</span>
                <span className="text-xl font-black text-gray-900">{Number(order.montant_ttc).toLocaleString('fr-MA')} MAD</span>
              </div>
              <div className="bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                <span className="text-[10px] uppercase font-black text-gray-400 block tracking-wider">Pénalité Cumulative</span>
                <span className={`text-xl font-black ${order.frais_appliqués && !order.force_majeure ? 'text-[#B12024]' : 'text-emerald-600'}`}>
                  {order.frais_appliqués && !order.force_majeure ? `+ ${(Number(order.montant_ttc) * 0.1).toLocaleString('fr-MA')} MAD` : '0 MAD'}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 border-b border-gray-100 pb-3">Profil Destinataire Client</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
              <div>
                <span className="text-gray-400 block font-medium mb-0.5">Nom Complet</span>
                <span className="text-gray-900 font-bold">{order.client?.nom_complet || "Information manquante"}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium mb-0.5">Adresse de Courriel</span>
                <span className="text-gray-900 font-bold">{order.client?.email || "Non renseignée"}</span>
              </div>
              <div className="sm:mt-2">
                <span className="text-gray-400 block font-medium mb-0.5">Ligne Téléphonique</span>
                <span className="text-gray-900 font-bold">{order.client?.telephone || "Non disponible"}</span>
              </div>
              <div className="sm:mt-2">
                <span className="text-gray-400 block font-medium mb-0.5">Planification Distribution</span>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 bg-gray-100 text-gray-700 rounded-md inline-block tracking-wide">
                  {order.statut_livraison}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-black text-gray-900">Planifier ou Modifier l'Expédition</h3>
            <form onSubmit={handleScheduleDelivery} className="mt-4 flex flex-col sm:flex-row items-end gap-4">
              <div className="w-full flex-1">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider block mb-1.5">Date Prévisionnelle de Sortie</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-xs rounded-lg p-2.5 font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900/5 focus:border-gray-900"
                  required 
                />
              </div>
              <button 
                type="submit" 
                disabled={actionLoading}
                className="w-full sm:w-auto bg-gray-900 hover:bg-gray-800 text-white text-xs font-extrabold py-2.5 px-6 rounded-lg transition-all shadow-xs active:scale-95 whitespace-nowrap"
              >
                {actionLoading ? "Traitement..." : "Mettre à jour la planification"}
              </button>
            </form>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Actions & Décisions Métier</h3>
            <button 
              onClick={handleDownloadPDF}
              disabled={order.statut_entrepot !== 'mise_en_demeure'}
              className={`w-full text-xs font-bold py-3 px-4 rounded-lg transition-all shadow-xs text-center flex items-center justify-center gap-2 ${
                order.statut_entrepot === 'mise_en_demeure'
                  ? 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 active:scale-95'
                  : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed font-medium'
              }`}
            >
              📄 Télécharger l'Acte PDF de Mise en Demeure
            </button>
          </div>
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h3 className="text-sm font-black text-gray-900 mb-1">Dispositifs de Protection Risques</h3>
            <p className="text-[11px] text-gray-400 font-medium mb-4 leading-relaxed">Clauses d'exceptions contractuelles de l'ordonnance logistique KITEA.</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3.5 bg-purple-50/40 border border-purple-100/60 rounded-xl">
                <div>
                  <span className="text-xs font-extrabold text-purple-950 block">Cas de Force Majeure</span>
                  <span className="text-[10px] text-purple-600 font-medium block mt-0.5">Geler l’accumulation des pénalités</span>
                </div>
                <input 
                  type="checkbox" 
                  disabled={actionLoading}
                  checked={!!order.force_majeure}
                  onChange={() => handleToggleForceMajeure(order.force_majeure)}
                  className="w-4 h-4 text-purple-600 bg-white border-gray-300 rounded-md focus:ring-purple-500 cursor-pointer transition-transform active:scale-95"
                />
              </div>
              {isKiteaLateBy7Days && !order.force_majeure ? (
                <div className="p-3.5 bg-red-50/60 border border-red-100 rounded-xl space-y-3.5">
                  <div>
                    <span className="text-xs font-extrabold text-red-950 block">⚠️ Retard Logistique Approuvé</span>
                    <span className="text-[10px] text-red-600 font-medium block mt-0.5">Dépassement du délai de livraison estimé &gt; 7 jours.</span>
                  </div>
                  <button 
                    onClick={handleCancelOrder}
                    disabled={actionLoading || order.statut_livraison === 'annulée'}
                    className={`w-full text-white text-[10px] font-black py-2.5 rounded-lg transition-all uppercase tracking-wider shadow-xs ${
                      order.statut_livraison === 'annulée' ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#B12024] hover:bg-red-700 active:scale-95'
                    }`}
                  >
                    {order.statut_livraison === 'annulée' ? 'Commande Annulée' : 'Annuler & Forcer le Remboursement'}
                  </button>
                </div>
              ) : (
                <div className="p-3.5 bg-gray-50/50 border border-gray-100 rounded-xl text-center text-[11px] text-gray-400 font-bold">
                  Aucune infraction logistique détectée pour cet envoi.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}