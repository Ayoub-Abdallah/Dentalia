import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { ProtectedRoute } from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import TreatmentPlans from './pages/TreatmentPlans';
import Appointments from './pages/Appointments';
import Invoices from './pages/Invoices';
import Treatments from './pages/Treatments';
import Finances from './pages/Finances';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Employees from './pages/Employees';
import PatientStatistics from './pages/PatientStatistics';
import AppointmentAnalytics from './pages/AppointmentAnalytics';
import RevenueReports from './pages/RevenueReports';
import TreatmentInsights from './pages/TreatmentInsights';
import Layout from './components/Layout';

function App() {
  const { isAuthenticated, initialize, checkAuth } = useAuthStore();

  useEffect(() => {
    initialize();
    // Check auth periodically
    const interval = setInterval(checkAuth, 5 * 60 * 1000); // Check every 5 minutes
    return () => clearInterval(interval);
  }, [initialize, checkAuth]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
        
        <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
          <Route index element={<Dashboard />} />
          
          {/* Only admin and receptionists */}
          <Route path="patients" element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
              <Patients />
            </ProtectedRoute>
          } />
          <Route path="appointments" element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
              <Appointments />
            </ProtectedRoute>
          } />
          
          {/* Only admin */}
          <Route path="finances" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Finances />
            </ProtectedRoute>
          } />
          <Route path="reports" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="employees" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Employees />
            </ProtectedRoute>
          } />
          
          {/* All roles can access */}
          <Route path="treatment-plans" element={<TreatmentPlans />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="treatments" element={<Treatments />} />
          <Route path="settings" element={<Settings />} />
          
          {/* Report sub-routes - only admin */}
          <Route path="reports">
            <Route index element={<Reports />} />
            <Route path="patient-statistics" element={<PatientStatistics />} />
            <Route path="appointment-analytics" element={<AppointmentAnalytics />} />
            <Route path="revenue-reports" element={<RevenueReports />} />
            <Route path="treatment-insights" element={<TreatmentInsights />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;