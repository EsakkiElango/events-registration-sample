import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, logout } from '../auth';
export default function Navbar(){
  const nav = useNavigate();
  const auth = getAuth();
  const handleLogout = () => { logout(); nav('/login'); };
  return (
    <nav className="bg-white shadow p-4">
      <div className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="space-x-4">
          <Link to="/" className="font-semibold">General</Link>
          <Link to="/registers">Registers</Link>
        </div>
        <div>
          {auth.username ? (
            <>
              <span className="mr-3 text-sm">{auth.username} ({auth.role})</span>
              <button className="bg-red-500 text-white px-3 py-1 rounded" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="text-sm">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
