import React, { useState } from 'react';
import API from '../api';
import { saveAuth } from '../auth';
import { useNavigate } from 'react-router-dom';
export default function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const nav = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await API('/api/login', { method: 'POST', body: JSON.stringify({ username, password }) });
      saveAuth(data);
      nav('/');
    } catch (e) {
      setErr(e.error || 'login failed');
    }
  };
  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <form onSubmit={submit} className="space-y-3">
          <div><label className="block text-sm">Username<input value={username} onChange={e=>setUsername(e.target.value)} className="w-full border p-2 rounded" /></label></div>
          <div><label className="block text-sm">Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full border p-2 rounded" /></label></div>
          <div className="flex items-center justify-between">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
            {/* <div className="text-xs text-gray-500">Try admin/adminpass or user/userpass</div> */}
          </div>
          {err && <div className="text-red-600">{err}</div>}
        </form>
      </div>
    </div>
  );
}
