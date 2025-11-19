
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
import TermsPage from './pages/TermsPage';
import BusinessPage from './pages/BusinessPage';
import ProductPage from './pages/ProductPage';
import ApiPage from './pages/ApiPage';
import AboutUsPage from './pages/AboutUsPage';
import OurServicesPage from './pages/OurServicesPage';
import ContactUsPage from './pages/ContactUsPage';
import ResourcesPage from './pages/ResourcesPage';
import CrossBorderPage from './pages/CrossBorderPage';
import PayrollInfoPage from './pages/PayrollInfoPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AffiliatePage from './pages/AffiliatePage';

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
            
            {/* Separate Login Routes */}
            <Route path="/login" element={<LoginPage specificRole={UserRole.USER} />} />
            <Route path="/admin/login" element={<LoginPage specificRole={UserRole.ADMIN} />} />
            <Route path="/partner/login" element={<LoginPage specificRole={UserRole.PARTNER} />} />
            <Route path="/merchant/login" element={<LoginPage specificRole={UserRole.MERCHANT} />} />

            <Route path="/onboarding" element={<OnboardingPage />} />
            <Route path="/2fa" element={<TwoFactorAuthPage />} />
            <Route path="/confirm-email" element={<ConfirmEmailPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/business" element={<BusinessPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/api" element={<ApiPage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/services" element={<OurServicesPage />} />
            <Route path="/contact-us" element={<ContactUsPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/cross-border" element={<CrossBorderPage />} />
            <Route path="/payroll-info" element={<PayrollInfoPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/affiliate" element={<AffiliatePage />} />
            
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
