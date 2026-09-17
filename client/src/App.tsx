import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Loader2 } from 'lucide-react';

// Public Pages
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { SignupPage } from './pages/public/SignupPage';
import { VerifyEmailPage } from './pages/public/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/public/ResetPasswordPage';
import { CollectTestimonialPage } from './pages/public/CollectTestimonialPage';
import { WallOfLovePage } from './pages/public/WallOfLovePage';
import { EmbedWidgetPage } from './pages/public/EmbedWidgetPage';

// Dashboard Pages
import { OverviewPage } from './pages/dashboard/OverviewPage';
import { SpacesListPage } from './pages/dashboard/SpacesListPage';
import { SpaceEditPage } from './pages/dashboard/SpaceEditPage';
import { ModerationInboxPage } from './pages/dashboard/ModerationInboxPage';
import { AnalyticsPage } from './pages/dashboard/AnalyticsPage';
import { EmbedGeneratorPage } from './pages/dashboard/EmbedGeneratorPage';
import { SettingsPage } from './pages/dashboard/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-300 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-brand-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

export const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/submit/:slug" element={<CollectTestimonialPage />} />
      <Route path="/collect/:slug" element={<CollectTestimonialPage />} />
      <Route path="/wall/:slug" element={<WallOfLovePage />} />
      <Route path="/embed/:slug/:type" element={<EmbedWidgetPage />} />

      {/* Protected Dashboard Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <OverviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/spaces"
        element={
          <ProtectedRoute>
            <SpacesListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/spaces/new"
        element={
          <ProtectedRoute>
            <SpaceEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/spaces/:id/edit"
        element={
          <ProtectedRoute>
            <SpaceEditPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/spaces/:id/testimonials"
        element={
          <ProtectedRoute>
            <ModerationInboxPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/spaces/:id/analytics"
        element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/spaces/:id/embed"
        element={
          <ProtectedRoute>
            <EmbedGeneratorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
