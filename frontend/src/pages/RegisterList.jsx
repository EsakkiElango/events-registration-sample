import React, { useEffect, useState }
 from 'react';
 import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import API from '../api';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import { getAuth } from '../auth';

export default function RegisterList(){
  const auth = getAuth();
  const [items, setItems] = useState([]);
  useEffect(()=>{ load(); },[]);
  const load = ()=> API('/api/events').then(setItems).catch(console.error);
  const onDragEnd = async (result) => {
    if(!result.destination) return;
    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index,1);
    reordered.splice(result.destination.index,0,moved);
    const withIndex = reordered.map((it, idx) => ({ ...it, orderIndex: idx+1 }));
    setItems(withIndex);
    await API('/api/events/reorder', { method: 'POST', body: JSON.stringify(withIndex) });
  };
  const remove = async (id) => { await API('/api/events/'+id, { method: 'DELETE' }); load(); };
  const markComplete = async (id) => { await API('/api/events/'+id+'/complete', { method: 'POST' }); load(); };
  const exportToExcel = () => {
    // 1. Prepare the data (Combining current and next events into one list)
    // const allEvents = [];
    // if (data.current) allEvents.push({ Status: 'Current', ...data.current });
    // data.next.forEach(event => allEvents.push({ Status: 'Upcoming', ...event }));

    // 2. Create a worksheet from the JSON data
    const worksheet = XLSX.utils.json_to_sheet(items);
    
    // 3. Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Events");

    // 4. Generate the Excel file buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
    // 5. Save the file using file-saver
    const finalData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(finalData, `Events_List_2025.xlsx`);
  };
  return (
    <div>
      <div style={{ textAlign: 'right', marginBottom: '10px' }}>
        <button 
          onClick={exportToExcel}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold"
        >
          Export to Excel 📊
        </button>
      </div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Registers</h2>
        <Link to="/registers/new" className="bg-green-600 text-white px-3 py-1 rounded">New Register</Link>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {(provided)=>(
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
              {items.map((it, index)=>(
                <Draggable key={it.id} draggableId={String(it.id)} index={index}>
                  {(prov)=>(
                    <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="bg-white p-3 rounded shadow flex justify-between">
                      <div>
                        <h4 className="font-semibold">{it.title} / {it.eventDetails} {it.status==='current' && '(current)'}</h4>
                        <p className="text-sm">{it.details}</p>
                        <small className="text-xs text-gray-500">Order: {it.orderIndex}</small>
                      </div>
                      <div className="space-x-2">
                        <Link to={`/registers/${it.id}/edit`} className="text-sm underline">Edit</Link>
                        {auth.role === 'admin' && <button onClick={()=>remove(it.id)} className="text-sm text-red-600">Delete</button>}
                        {it.status==='current' && <button onClick={()=>markComplete(it.id)} className="text-sm text-indigo-600">Mark Completed</button>}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
