import React from 'react';

export default function OrderTable({ orders }) {
  // Utility tool to safely read the Laravel client JSON text string
  const getClientName = (jsonString) => {
    try {
      return JSON.parse(jsonString).nom_complet;
    } catch (e) {
      return "Client Inconnu";
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
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
              <td colSpan="6" className="p-10 text-center text-gray-400 font-bold">
                Aucun dossier ne correspond à vos critères de filtrage actuels.
              </td>
            </tr>
          ) : (
            orders.map(order => (
              <tr key={order.id_commande} className={`transition-all border-l-4 ${
                order.force_majeure ? 'bg-purple-50/20 border-purple-500 hover:bg-purple-50/40' :
                order.statut_entrepot === 'mise_en_demeure' ? 'bg-red-50/20 border-[#B12024] hover:bg-red-50/40' :
                order.statut_entrepot === 'notifie' ? 'bg-amber-50/20 border-amber-500 hover:bg-amber-50/40' : 
                'bg-white border-emerald-500 hover:bg-gray-50'
              }`}>
                <td className="p-4 font-bold text-gray-900">#{order.id_commande}</td>
                <td className="p-4 text-gray-900">{getClientName(order.client)}</td>
                <td className="p-4 text-gray-400">{order.date_paiement}</td>
                <td className="p-4 font-black text-gray-900">{order.montant_ttc.toLocaleString()} MAD</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${
                    order.force_majeure ? 'bg-purple-100 text-purple-800' :
                    order.statut_entrepot === 'mise_en_demeure' ? 'bg-red-100 text-red-800' :
                    order.statut_entrepot === 'notifie' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {order.force_majeure ? "Force Majeure" : order.statut_entrepot}
                  </span>
                </td>
                <td className="p-4 text-center">
                    
                  <button className="bg-gray-900 hover:bg-[#B12024] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors shadow-xs" id='{order.id_commande}'>
                    Gérer
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}