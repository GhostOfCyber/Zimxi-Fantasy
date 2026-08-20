import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './hooks/useAuth';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register'; // <--- Added Import
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import Transfers from './pages/Transfers'; // Renamed
import MyTeam from './pages/MyTeam'; // New
import Fixtures from './pages/Fixtures';
import Leaderboard from './pages/Leaderboard';
import Comparison from './pages/Comparison';
import AdminPoints from './pages/AdminPoints';

const queryClient = new QueryClient();

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div>Loading...</div>;
    return (user && user.role === 'admin') ? children : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} /> {/* <--- Added Route */}
      <Route path="/transfers" element={<PrivateRoute><Transfers /></PrivateRoute>} />
      <Route path="/my-team" element={<PrivateRoute><MyTeam /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/fixtures" element={<PrivateRoute><Fixtures /></PrivateRoute>} />
      <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
      <Route path="/comparison" element={<PrivateRoute><Comparison /></PrivateRoute>} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/points" element={<AdminPoints />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-brand-dark text-gray-900 dark:text-white font-sans transition-colors duration-300">
                <AppRoutes />
                <Toaster 
                  position="bottom-right" 
                  toastOptions={{
                    style: {
                      background: '#1a1a1a',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    },
                    success: {
                      iconTheme: { primary: '#10B981', secondary: '#000' },
                      style: { borderBottom: '2px solid #10B981' }
                    },
                    error: {
                      iconTheme: { primary: '#EF4444', secondary: '#fff' },
                      style: { borderBottom: '2px solid #EF4444' }
                    }
                  }} 
                />
            </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}