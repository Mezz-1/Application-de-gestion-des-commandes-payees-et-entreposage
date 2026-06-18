import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import OrderManagementPage from './pages/OrderManagementPage';
import AlertsHistoryPage from './pages/AlertHistoryPage';
import OrdersGardePage from './pages/OrderGardePage';
import Login from './components/Login';

export default function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auth_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [loading, setLoading] = useState(true); // Commencer à true pour valider la session au démarrage

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user'); // Correction de la faute de frappe 'auht_user'
      setUser(null);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData)); // Correction: setItem au lieu de getItem
    if (token) {
      localStorage.setItem('auth_token', token); // Correction: setItem au lieu de getItem
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-4 border-[#E30613] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest animate-pulse">
            Vérification de session...
          </p>
        </div>
      </div>
    );
  }

  const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('auth_token');
    if (!user || !token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            user && localStorage.getItem('auth_token') ? (
              <Navigate to="/dashboard" replace />
            ) : (
              // On s'assure de bien intercepter le token renvoyé par l'API lors du login
              <Login onLoginSuccess={(u, t) => handleLoginSuccess(u, t)} />
            )
          } 
        />
        
        <Route
          element={
            <ProtectedRoute>
              <Layout user={user} onLogout={handleLogout} />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/commande/:id_commande" element={<OrderManagementPage user={user} />} />
          <Route path="/historique-alertes" element={<AlertsHistoryPage />} />
          <Route path="/commandes-en-garde" element={<OrdersGardePage />} />
        </Route>
        
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}