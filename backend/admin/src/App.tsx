import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Bookings } from './pages/Bookings';
import { Payments } from './pages/Payments';
import { LWA } from './pages/LWA';
import { Content } from './pages/Content';
import { PilgrimagesAdmin } from './pages/PilgrimagesAdmin';
import { ToursAdmin } from './pages/ToursAdmin';
import { HotelsAdmin } from './pages/HotelsAdmin';
import { VisaPackagesAdmin } from './pages/VisaPackagesAdmin';
import { AdminsPage } from './pages/AdminsPage';
import { Layout } from './components/Layout';
import { ToastProvider } from './components/Toast';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#111827]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm font-medium">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!admin) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  const { admin, isLoading, isSuperAdmin } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!admin) return <Navigate to="/login" replace />;
  if (!isSuperAdmin) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { admin } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={admin ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="payments" element={<Payments />} />
        <Route path="lwa" element={<LWA />} />

        {/* Super Admin only */}
        <Route path="pilgrimages" element={<SuperAdminRoute><PilgrimagesAdmin /></SuperAdminRoute>} />
        <Route path="tours" element={<SuperAdminRoute><ToursAdmin /></SuperAdminRoute>} />
        <Route path="hotels" element={<SuperAdminRoute><HotelsAdmin /></SuperAdminRoute>} />
        <Route path="visa-packages" element={<SuperAdminRoute><VisaPackagesAdmin /></SuperAdminRoute>} />
        <Route path="content" element={<SuperAdminRoute><Content /></SuperAdminRoute>} />
        <Route path="admins" element={<SuperAdminRoute><AdminsPage /></SuperAdminRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}
