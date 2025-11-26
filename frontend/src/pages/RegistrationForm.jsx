import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate, useParams } from 'react-router-dom';
export default function RegistrationForm(){
  const { id } = useParams();
  const [form, setForm] = useState({ title:'', details:'', startTime:'', endTime:'' });
  const nav = useNavigate();
  useEffect(()=>{
    if(id) API('/api/events').then(list=>{ const e = list.find(x=>String(x.id)===String(id)); if(e) setForm(e); });
  },[id]);
  const submit = async (e) => {
    e.preventDefault();
    if(id) await API('/api/events/'+id, { method: 'PUT', body: JSON.stringify(form) });
    else await API('/api/events', { method: 'POST', body: JSON.stringify(form) });
    nav('/registers');
  };
  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-3">{id ? 'Edit' : 'New'} Register</h2>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3">
        <div><label className="block text-sm">Title<input required value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="w-full border p-2 rounded" /></label></div>
        <div><label className="block text-sm">Details<textarea value={form.details} onChange={e=>setForm({...form, details:e.target.value})} className="w-full border p-2 rounded" /></label></div>
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="Start ISO datetime" value={form.startTime} onChange={e=>setForm({...form, startTime:e.target.value})} className="border p-2 rounded" />
          <input placeholder="End ISO datetime" value={form.endTime} onChange={e=>setForm({...form, endTime:e.target.value})} className="border p-2 rounded" />
        </div>
        <div><button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button></div>
      </form>
    </div>
  );
}
