import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import img from '../images/download.png';

export default function Sidebar({ user, onLogout }) {
  const location = useLocation();
  const navigate= useNavigate();
  const navItems = [
    { path: '/dashboard', label: 'Tableau de Bord', icon: '📊' },
    { path: '/commandes-en-garde', label: 'Commandes en Garde', icon: '📦' },
    { path: '/historique-alertes', label: 'Historique Alertes', icon: '⏰' },
  ];
  const handleLogoutClick=(e)=>{
    e.preventDefault();
    if(onLogout){
      onLogout();
    }
    navigate('/Login',{replace:true})
  }

  return (
    <aside className="w-64 bg-white text-gray-700 flex flex-col shadow-2xl shrink-0 border-r border-gray-100 h-screen select-none font-sans relative z-20">
      
      {/* 🌟 BRAND LOGO HEADER OVERHAUL */}
      <div className="p-6 border-b border-gray-100 flex flex-col items-center bg-gradient-to-b from-gray-50/50 to-white">
        <div className="w-full max-w-[140px] h-14 flex items-center justify-center overflow-hidden rounded-xl bg-white p-2 border border-gray-100/80 shadow-xs transition-transform duration-300 hover:scale-102">
          <img 
            src={img}
            alt="KITEA Logo Officiel" 
            className="w-full h-full object-contain"
            onError={(e) => {
              // Graceful fallback to branded typography if image fails to load
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<span class="text-[#E30613] font-black text-xl tracking-tighter">KITEA</span>';
            }}
          />
        </div>
        
        {/* Logistics Subheader Badge */}
        <div className="mt-3 px-2.5 py-0.5 rounded-full bg-gray-100 border border-gray-200/40 text-center">
          <span className="text-[9px] tracking-widest uppercase font-black text-gray-400 block">
            Centrale Logistique
          </span>
        </div>
      </div>

      {/* INTERACTIVE NAVIGATION REGION */}
      <nav className="flex-1 p-4 space-y-1.5 mt-3">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`w-full flex items-center space-x-3.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 group/item ${
                isActive 
                  ? 'bg-red-50 text-[#B12024] shadow-xs shadow-red-100/50' 
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50/80'
              }`}
            >
              <span className={`text-sm shrink-0 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover/item:scale-110'}`}>
                {item.icon}
              </span>
              <span className="tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* OPERATOR SESSION FOOTER SECTION */}
      <div className="p-4 border-t border-gray-100 bg-linear-to-b from-white to-gray-50/80 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1 pl-1">
          <p className="font-extrabold text-gray-800 text-xs truncate tracking-wide">
            {user?.nom_complet || "EZZOUKHRY Mouhssine"}
          </p>
          <p className="text-gray-400 text-[9px] font-semibold mt-0.5 uppercase tracking-wider truncate">
            {user?.role || "Agent Administratif"}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogoutClick}
          title="Fermer la session"
          className="group relative flex items-center justify-center p-2.5 rounded-xl bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50/50 transition-all duration-200 text-gray-400 hover:text-[#E30613] shadow-xs shrink-0 transform active:scale-95 cursor-pointer"
        >

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.3} stroke="currentColor" className="w-4 h-4 transition-transform group-hover:translate-x-0.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>

          <span className="absolute -top-0.5 -right-0.5 flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#E30613]"></span>
          </span>
       </button>
      </div>

    </aside>
  );
}