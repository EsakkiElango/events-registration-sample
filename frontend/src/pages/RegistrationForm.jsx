import React, { useState, useEffect } from 'react';
import API from '../api';
import { useNavigate, useParams } from 'react-router-dom';
export default function RegistrationForm(){
  const { id } = useParams();
  const [form, setForm] = useState({ tokenNo: null, title:'', eventDetails:'',mobileNo: null, status: 'upcoming', organiser: '' });
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
        <div><label className="block text-sm">Token No<input required value={form.tokenNo} onChange={e=>setForm({...form, tokenNo:e.target.value})} className="w-full border p-2 rounded" /></label></div>
        <div><label className="block text-sm">Name<input required value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="w-full border p-2 rounded" /></label></div>
        <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select 
          required 
          value={form.status} 
          onChange={e => setForm({...form, status: e.target.value})} 
          className="w-full border p-2 rounded bg-white"
        >
          <option value="" disabled>Select Status</option>
          <option value="current">Current</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>
      </div>
        {/* <div><label className="block text-sm">Event Details<textarea required value={form.eventDetails} onChange={e=>setForm({...form, eventDetails:e.target.value})} className="w-full border p-2 rounded" /></label></div> */}
        <div>
        <label className="block text-sm font-medium mb-1">Event Details</label>
        <select 
          required 
          value={form.eventDetails} 
          onChange={e => setForm({...form, eventDetails: e.target.value})} 
          className="w-full border p-2 rounded bg-white"
        >
          <option value="" disabled>Select Event Details</option>
          <option value="KALIYAL">Kaliyal</option>
          <option value="KOLATTAM">Kolattam</option>
          <option value="BHARATHANATYAM">Bharatanatyam</option>
          <option value="LORRY BHAVANI">Lorry Bhavani</option>
        </select>
      </div>
        <div><label className="block text-sm">Asaan Name<textarea required value={form.organiser} onChange={e=>setForm({...form, organiser:e.target.value})} className="w-full border p-2 rounded" /></label></div>
        <div><label className="block text-sm">Mobile No<textarea required value={form.mobileNo} onChange={e=>setForm({...form, mobileNo:e.target.value})} className="w-full border p-2 rounded" /></label></div>
        {/* <div className="grid grid-cols-2 gap-2">
          <input placeholder="Start ISO datetime" value={form.startTime} onChange={e=>setForm({...form, startTime:e.target.value})} className="border p-2 rounded" />
          <input placeholder="End ISO datetime" value={form.endTime} onChange={e=>setForm({...form, endTime:e.target.value})} className="border p-2 rounded" />
        </div> */}
        <div><button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button></div>
      </form>
    </div>
  );
}
