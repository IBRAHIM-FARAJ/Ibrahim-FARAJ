import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Reception from './pages/Reception';
import Assignations from './pages/Assignations';
import Consultation from './pages/Consultation';
import History from './pages/History';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Secure Routes Wrapped in MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="reception" element={<ProtectedRoute allowedRoles={[1, 2]}><Reception /></ProtectedRoute>} />
          <Route path="assignations" element={<ProtectedRoute allowedRoles={[1, 3]}><Assignations /></ProtectedRoute>} />
          <Route path="consultation" element={<ProtectedRoute allowedRoles={[1, 4]}><Consultation /></ProtectedRoute>} />
          <Route path="history" element={<ProtectedRoute allowedRoles={[1]}><History /></ProtectedRoute>} />
        </Route>
        
        {/* Catch all to redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
