import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { FileUpload } from './pages/FileUpload';
import { LeadDetails } from './pages/LeadDetails';
import { Insights } from './pages/Insights';
import { Features } from './pages/Features';
import { Homepage } from './pages/Homepage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/features" element={<Features />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <FileUpload />
              </ProtectedRoute>
            }
          />
          <Route path="/leads/:id" element={<ProtectedRoute><LeadDetails /></ProtectedRoute>} />
          <Route
            path="/insights"
            element={
              <ProtectedRoute>
                <Insights />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
