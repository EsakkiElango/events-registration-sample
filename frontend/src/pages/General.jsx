import React, { useEffect, useState } from 'react';
import API from '../api';
export default function General(){
  const [data, setData] = useState({ current:null, next:null });
  useEffect(()=>{ API('/api/events/current-next').then(setData).catch(console.error); },[]);
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">General — Events Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Current Event</h3>
          {data.current ? (
            <>
              <h4 className="text-lg">{data.current.title}</h4>
              <p className="text-sm">{data.current.eventDetails}</p>
              <p className="text-xs text-gray-500">Token No: {data.current.mobileNo}</p>
            </>
          ) : <p>No current event</p>}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Next Event</h3>
          {data.next ? (
            <>
              <h4 className="text-lg">{data.next.title}</h4>
              <p className="text-sm">{data.next.eventDetails}</p>
              <p className="text-xs text-gray-500">Token No: {data.next.mobileNo}</p>
            </>
          ) : <p>No next event</p>}
        </div>
      </div>
    </div>
  );
}
