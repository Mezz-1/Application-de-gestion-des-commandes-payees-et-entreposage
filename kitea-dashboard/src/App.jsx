import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
//import OrderManagementPage from './pages/OrderManagementPage'; // Make sure the path matches your structure

export default function App() {
  // Authentication state manager
  const [user, setUser] = useState(null);

  // 🔒 Professional Auth Guard Layout Wrapper
  // If a user isn't logged in, it forcefully redirects them to /login
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route 
          path="/login" 
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLoginSuccess={(userData) => setUser(userData)} />
            )
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard user={user} />
            </ProtectedRoute>
          } 
        />

        {/* <Route 
          path="/orders/manage/:id_commande" 
          element={
            <ProtectedRoute>
              <OrderManagementPage user={user} />
            </ProtectedRoute>
          } 
        /> */}

        {/* Global Catch-all Fallback Redirect */}
        <Route 
          path="*" 
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>
    </Router>
  );
}