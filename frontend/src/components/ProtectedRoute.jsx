import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth } from '../auth';
import General from '../pages/General';
export default function ProtectedRoute({ children }){
  const auth = getAuth();
  if (!auth.token) return <General />;
  return children;
}
