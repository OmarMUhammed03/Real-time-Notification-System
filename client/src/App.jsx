import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Compose from './pages/Compose';
import ViewEmail from './pages/ViewEmail';
import NotFound from './pages/NotFound';
import Settings from './pages/Settings';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const [search, setSearch] = useState("");
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard search={search} onSearch={setSearch} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/compose" 
            element={
              <ProtectedRoute>
                <Compose />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/email/:id" 
            element={
              <ProtectedRoute>
                <ViewEmail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/starred" 
            element={
              <ProtectedRoute>
                <Dashboard search={search} onSearch={setSearch} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/sent" 
            element={
              <ProtectedRoute>
                <Dashboard search={search} onSearch={setSearch} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;