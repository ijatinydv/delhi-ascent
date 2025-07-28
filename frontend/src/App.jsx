import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import './App.css';
// Using dynamic import to avoid potential issues
const Chatbot = React.lazy(() => import('./components/Chatbot.jsx'));

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ApplicationsPage from './pages/ApplicationsPage';
import SchemesPage from './pages/SchemesPage';
import KYAPage from './pages/KYAPage';
import AdvisoryPage from './pages/AdvisoryPage';
import NotFoundPage from './pages/NotFoundPage';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout.jsx';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="schemes" element={<SchemesPage />} />
            <Route path="kya" element={<KYAPage />} />
            <Route path="advisory" element={<AdvisoryPage />} />
          </Route>
          
          {/* 404 Route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        
        {/* Floating Chatbot Widget - available on all pages */}
        <Suspense fallback={<div>Loading chatbot...</div>}>
          <Chatbot />
        </Suspense>
      </AuthProvider>
    </Router>
  );
}


export default App
