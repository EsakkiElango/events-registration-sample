import React, { useEffect, useState } from 'react';
import API from '../api';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Link } from 'react-router-dom';
export default function RegisterList(){
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
  return (
    <div>
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
                        <button onClick={()=>remove(it.id)} className="text-sm text-red-600">Delete</button>
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
