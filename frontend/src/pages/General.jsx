import React, { useEffect, useState } from 'react';
import API from '../api';
export default function General(){
  const [data, setData] = useState({ current: null, next: [] });
  useEffect(() => {
    let timerId;
  
    const poll = async () => {
      try {
        const res = await API('/api/events/current-next');
        setData({
          current: res.current,
          next: Array.isArray(res.next) ? res.next : [res.next].filter(Boolean)
        });
      } catch (err) {
        console.error(err);
      } finally {
        // Only schedule the next call AFTER the current one finishes
        timerId = setTimeout(poll, 3000);
      }
    };
  
    poll();
  
    return () => clearTimeout(timerId); // Cleanup
  }, []);// Empty dependency array means this only sets up once
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4" style={{ color: 'yellow', textAlign: 'center', WebkitTextStroke: '1px red', 
        fontFamily: `'InaiMathi', 'Tamil Sangam MN', 'Nirmala UI`, fontSize: '3rem', lineHeight: 1.1 }}>"4 வது மாபெரும் களியல் மற்றும் கோலாட்ட போட்டிகள்" - 2025</h2>
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4" style={{ textAlign: 'center' }}>
        <div className="px-4 rounded shadow" style={{ backgroundColor: '#8ce77c' }}>
          <h2 className="font-bold" style={{ fontSize: '25px', textAlign: 'left' }}>Current Event</h2>
          {data.current ? (
            <>
              <h4 
              class="text-4xl md:text-[3.125rem] p-1" 
              style={{ 
                // fontSize: '3.125rem', 
                marginTop: '-10px', 
                fontFamily: 'poppins', 
                lineHeight: 1,
                fontWeight: 700 }}
                >{data.current.tokenNo} / {data.current.title} / {data.current.eventDetails}</h4>
            </>
          ) : <p>No current event</p>}
        </div>
        {/* --- Next Events (Mapping through the array) --- */}
        {data.next && data.next.length > 0 ? (
          data.next.slice(0, 3).map((event, index) => (
            <div 
              key={event.id || index} 
              className="px-4 rounded shadow" 
              style={{ 
                backgroundColor: '#FFFF5C', 
                opacity: index === 0 ? 1 : 0.85 - (index * 0.1) // Slight fade for upcoming ones
              }}
            >
              <h3 className="font-semibold" style={{ fontSize: '25px', textAlign: 'left' }}>
                {index === 0 ? "Next Event" : `Upcoming Event`}
              </h3>
              <h4 class="text-4xl md:text-[3rem] p-1" 
              style={{ 
                // fontSize: '3.125rem', 
                marginTop: '-10px', 
                fontFamily: 'poppins', 
                lineHeight: 1,
                fontWeight: 700 }}>
                {event.tokenNo} / {event.title} / {event.eventDetails}
              </h4>
            </div>
          ))
        ) : (
          <div className="p-4 rounded shadow" style={{ backgroundColor: '#FFFF5C' }}>
            <p>No upcoming events</p>
          </div>
        )}
        {/* <div className="px-4 rounded shadow" style={{ backgroundColor: '#FFFF5C' }}>
          <h3 className="font-semibold" style={{ fontSize: '25px', textAlign: 'left' }}>Next Event</h3>
          {data.next ? (
            <>
            <h4 style={{ fontSize: '3.125rem', marginTop: '-10px' }}>{data.next.tokenNo} / {data.next.title} / {data.next.eventDetails}</h4>
            </>
          ) : <p>No next event</p>}
        </div> */}
      </div>
    </div>
  );
}
