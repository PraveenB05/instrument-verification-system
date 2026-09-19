import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OwnerDashboard from './pages/OwnerDashboard';
import RegisterInstrument from './pages/RegisterInstrument';
import OfficerDashboard from './pages/OfficerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CertificateView from './pages/CertificateView';
import PublicVerify from './pages/PublicVerify';
import './App.css';

const HomeRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user.role === 'INSTRUMENT_OWNER') return <Navigate to="/owner" replace />;
  if (user.role === 'OFFICER') return <Navigate to="/officer" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Home Redirection */}
              <Route path="/" element={<HomeRedirect />} />

              {/* Public Authentication Pages */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Public Certificate QR Verification Page */}
              <Route path="/verify" element={<PublicVerify />} />
              <Route path="/verify/:certificateNumber" element={<PublicVerify />} />

              {/* Protected Owner Routes */}
              <Route
                path="/owner"
                element={
                  <ProtectedRoute allowedRoles={['INSTRUMENT_OWNER']}>
                    <OwnerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/owner/register-instrument"
                element={
                  <ProtectedRoute allowedRoles={['INSTRUMENT_OWNER']}>
                    <RegisterInstrument />
                  </ProtectedRoute>
                }
              />

              {/* Protected Officer Routes */}
              <Route
                path="/officer"
                element={
                  <ProtectedRoute allowedRoles={['OFFICER']}>
                    <OfficerDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['ADMIN']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Certificate View (Accessible when logged in) */}
              <Route
                path="/certificate/:id"
                element={
                  <ProtectedRoute allowedRoles={['INSTRUMENT_OWNER', 'OFFICER', 'ADMIN']}>
                    <CertificateView />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
