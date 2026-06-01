import React from 'react';

export default function Sidebar({ user }) {
  return (
    <aside className="w-64 bg-white text-gray-700 flex flex-col shadow-xl shrink-0 border-r border-gray-200">
      {/* Sidebar Header Brand Square */}
      <div className="p-6 border-b border-gray-100 flex flex-col items-center">
        <div className="bg-[#E30613] text-white font-black text-2xl px-5 py-2 rounded-xl tracking-tighter shadow-sm mb-2">
          KITEA
        </div>
        <span className="text-[10px] tracking-widest uppercase font-extrabold text-gray-400 block">
          Centrale Logistique
        </span>
      </div>
      <nav className="flex-1 p-4 space-y-1.5 mt-2">
        <button className="w-full flex items-center px-4 py-2.5 bg-red-50 text-[#B12024] rounded-xl font-bold text-left text-xs transition-all">
           Tableau de Bord
        </button>
        <button className="w-full flex items-center px-4 py-2.5 text-gray-500 hover:bg-gray-50 rounded-xl font-semibold text-left text-xs opacity-60 cursor-not-allowed transition-all">
           Commandes en Garde
        </button>
        <button className="w-full flex items-center px-4 py-2.5 text-gray-500 hover:bg-gray-50 rounded-xl font-semibold text-left text-xs opacity-60 cursor-not-allowed transition-all">
           Historique Alertes
        </button>
      </nav>
      <div className="p-4 border-t border-gray-100 bg-gray-50 text-xs">
        <p className="font-bold text-gray-800 truncate">{user?.nom_complet || "EZZOUKHRY Mouhssine"}</p>
        <p className="text-gray-400 text-[10px] font-medium mt-0.5 truncate">{user?.role || "Agent Administratif"}</p>
      </div>
    </aside>
  );
}