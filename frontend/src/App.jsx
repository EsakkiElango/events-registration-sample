import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import General from './pages/General';
import RegisterList from './pages/RegisterList';
import RegistrationForm from './pages/RegistrationForm';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
export default function App(){
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-4">
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/" element={<ProtectedRoute><General/></ProtectedRoute>} />
          <Route path="/registers" element={<ProtectedRoute><RegisterList/></ProtectedRoute>} />
          <Route path="/registers/new" element={<ProtectedRoute><RegistrationForm/></ProtectedRoute>} />
          <Route path="/registers/:id/edit" element={<ProtectedRoute><RegistrationForm/></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
