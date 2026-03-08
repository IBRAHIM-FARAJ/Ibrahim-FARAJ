import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Samples from './pages/Samples';
import Assignments from './pages/Assignments';
import History from './pages/History';
import Reports from './pages/Reports';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Secure Routes Wrapped in MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="samples" element={<Samples />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="history" element={<History />} />
          <Route path="reports" element={<Reports />} />
        </Route>
        
        {/* Catch all to redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
