import React, { useEffect, useState, useMemo } from 'react'; // Added useMemo
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import API from '../api';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
import { getAuth } from '../auth';

export default function RegisterList(){
  const auth = getAuth();
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all'); // New filter state

  useEffect(()=>{ load(); },[]);
  
  const load = ()=> API('/api/events').then(setItems).catch(console.error);

  // Filter logic: Only show items matching the selected status
  const filteredItems = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter(item => item.status === filter);
  }, [items, filter]);

  const onDragEnd = async (result) => {
    if(!result.destination) return;
    // Tip: Usually reordering should only be allowed when viewing "all"
    const reordered = Array.from(items);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    
    const withIndex = reordered.map((it, idx) => ({ ...it, orderIndex: idx+1 }));
    setItems(withIndex);
    await API('/api/events/reorder', { method: 'POST', body: JSON.stringify(withIndex) });
  };

  const remove = async (id) => { await API('/api/events/'+id, { method: 'DELETE' }); load(); };
  const markComplete = async (id) => { await API('/api/events/'+id+'/complete', { method: 'POST' }); load(); };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredItems); // Exports current filtered view
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Events");
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const finalData = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(finalData, `Events_List_${filter}_2025.xlsx`);
  };

  return (
    <div>
      <div className="flex justify-between items-end mb-4">
        {/* New Filter Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded p-2 bg-white shadow-sm"
          >
            <option value="all">All Items</option>
            <option value="current">Current</option>
            <option value="completed">Completed</option>
            <option value="upcoming">Upcoming</option>
          </select>
        </div>

        <div className="space-x-2">
          <button 
            onClick={exportToExcel}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 font-bold"
          >
            Export ({filter}) 📊
          </button>
          <Link to="/registers/new" className="bg-green-600 text-white px-4 py-2 rounded inline-block">New Register</Link>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4">Registers</h2>

      <DragDropContext onDragEnd={onDragEnd}>
        {/* Disable dropping if list is filtered to prevent index bugs */}
        <Droppable droppableId="list" isDropDisabled={filter !== 'all'}>
          {(provided)=>(
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
              {filteredItems.map((it, index)=>(
                <Draggable 
                  key={it.id} 
                  draggableId={String(it.id)} 
                  index={index}
                  isDragDisabled={filter !== 'all'} // Disable drag when filtered
                >
                  {(prov)=>(
                    <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} 
                         className={`bg-white p-3 rounded shadow flex justify-between ${filter !== 'all' ? 'border-l-4 border-blue-400' : ''}`}>
                      <div>
                        <h4 className="font-semibold">
                          {it.title} / {it.eventDetails} 
                          <span className="ml-2 text-xs uppercase px-2 py-1 bg-gray-100 rounded text-gray-600">
                            {it.status}
                          </span>
                        </h4>
                        <p className="text-sm">{it.details}</p>
                      </div>
                      <div className="space-x-2 flex items-center">
                        <Link to={`/registers/${it.id}/edit`} className="text-sm underline">Edit</Link>
                        {auth.role === 'admin' && <button onClick={()=>remove(it.id)} className="text-sm text-red-600">Delete</button>}
                        {it.status === 'current' && (
                          <button onClick={()=>markComplete(it.id)} className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded text-sm border border-indigo-200">
                            Mark Completed
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
              {filteredItems.length === 0 && <p className="text-center py-10 text-gray-500">No items found with status: {filter}</p>}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}