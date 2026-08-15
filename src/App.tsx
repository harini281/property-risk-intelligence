import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PropertySearch from './pages/PropertySearch';
import PropertyDetails from './pages/PropertyDetails';
import WeatherCenter from './pages/WeatherCenter';
import HistoricalStorms from './pages/HistoricalStorms';
import FloodIntelligence from './pages/FloodIntelligence';
import HailIntelligence from './pages/HailIntelligence';
import HurricaneCenter from './pages/HurricaneCenter';
import AIPredictions from './pages/AIPredictions';
import ContractorIntelligence from './pages/ContractorIntelligence';
import ClimateAnalytics from './pages/ClimateAnalytics';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import { Loader2 } from 'lucide-react';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    );
  }

  if (session) {
    return <Navigate to="/app" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/app" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/app/search" element={<ProtectedRoute><PropertySearch /></ProtectedRoute>} />
          <Route path="/app/property/:id" element={<ProtectedRoute><PropertyDetails /></ProtectedRoute>} />
          <Route path="/app/weather" element={<ProtectedRoute><WeatherCenter /></ProtectedRoute>} />
          <Route path="/app/storms" element={<ProtectedRoute><HistoricalStorms /></ProtectedRoute>} />
          <Route path="/app/flood" element={<ProtectedRoute><FloodIntelligence /></ProtectedRoute>} />
          <Route path="/app/hail" element={<ProtectedRoute><HailIntelligence /></ProtectedRoute>} />
          <Route path="/app/hurricane" element={<ProtectedRoute><HurricaneCenter /></ProtectedRoute>} />
          <Route path="/app/ai" element={<ProtectedRoute><AIPredictions /></ProtectedRoute>} />
          <Route path="/app/contractor" element={<ProtectedRoute><ContractorIntelligence /></ProtectedRoute>} />
          <Route path="/app/climate" element={<ProtectedRoute><ClimateAnalytics /></ProtectedRoute>} />
          <Route path="/app/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/app/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
