
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import LoginPage from './pages/LoginPage';
import OnboardingPage from './pages/OnboardingPage';
import UserDashboard from './pages/user/UserDashboard';
import PartnerDashboard from './pages/partner/PartnerDashboard';
import MerchantDashboard from './pages/merchant/MerchantDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import { UserRole } from './types';
import LandingPage from './pages/LandingPage';
import TwoFactorAuthPage from './pages/TwoFactorAuthPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to a default dashboard or an unauthorized page
    // For simplicity, we redirect to login here.
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    const getHomeRoute = () => {
        if (!user) return "/";
        switch (user.role) {
            case UserRole.USER: return "/dashboard";
            case UserRole.PARTNER: return "/partner";
            case UserRole.MERCHANT: return "/merchant";
            case UserRole.ADMIN: return "/admin";
            default: return "/";
        }
    }

    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/2fa" element={<TwoFactorAuthPage />} />
            <Route path="/confirm-email" element={<ConfirmEmailPage />} />
            
            <Route path="/dashboard" element={<ProtectedRoute allowedRoles={[UserRole.USER]}><UserDashboard /></ProtectedRoute>} />
            <Route path="/partner" element={<ProtectedRoute allowedRoles={[UserRole.PARTNER]}><PartnerDashboard /></ProtectedRoute>} />
            <Route path="/merchant" element={<ProtectedRoute allowedRoles={[UserRole.MERCHANT]}><MerchantDashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]}><AdminDashboard /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to={getHomeRoute()} replace />} />
        </Routes>
    );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <div className="min-h-screen">
            <AppRoutes />
          </div>
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;