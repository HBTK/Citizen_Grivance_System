// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSession } from './hooks/useSession.tsx';
import LandingPage from './pages/citizen/LandingPage';
import GrievanceSubmission from './pages/citizen/GrievanceSubmission';
import GrievanceTracking from './pages/citizen/GrievanceTracking';
import CitizenLogin from './pages/citizen/CitizenLogin';
import CitizenDashboard from './pages/citizen/Dashboard';
import OfficerLogin from './pages/officer/OfficerLogin';
import OfficerDashboard from './pages/officer/Dashboard';
import OfficerAnalytics from './pages/officer/Analytics';
import OfficerGrievanceDetails from './pages/officer/officerGrivanceDetails';
import AdminDashboard from './pages/admin/Dashboard';
import AdminAnalytics from './pages/admin/Analytics';
import GrievanceReopen from './pages/citizen/GrievanceReopen';

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, loading } = useSession(role);

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/citizen/login" element={<CitizenLogin />} />
        <Route path="/officer/login" element={<OfficerLogin />} />
        <Route path="/submit" element={<GrievanceSubmission />} />
        <Route path="/track/:trackingId" element={<GrievanceTracking />} />

        {/* Citizen Protected Routes */}
        <Route path="/citizen/dashboard" element={
          <ProtectedRoute role="citizen">
            <CitizenDashboard />
          </ProtectedRoute>
        } />
        <Route path="/citizen/reopen/:grievanceId" element={
          <ProtectedRoute role="citizen">
            <GrievanceReopen />
          </ProtectedRoute>
        } />

        {/* Officer Protected Routes */}
        <Route path="/officer/dashboard" element={
          <ProtectedRoute role="officer">
            <OfficerDashboard />
          </ProtectedRoute>
        } />
        <Route path="/officer/analytics" element={
          <ProtectedRoute role="officer">
            <OfficerAnalytics />
          </ProtectedRoute>
        } />
        <Route path="/officer/grievance/:grievanceId" element={
          <ProtectedRoute role="officer">
            <OfficerGrievanceDetails />
          </ProtectedRoute>
        } />

        {/* Admin Protected Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/analytics" element={
          <ProtectedRoute role="admin">
            <AdminAnalytics />
          </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
