import React, {useEffect, useState } from 'react';
import API from '../api';

export default function Items(){
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const res = await API.get('/items');
    console.log('Items loaded:', res.data);
    
    setItems(res.data);
  }
  useEffect(()=>{ load(); },[]);

  const add = async () => {
    if(!title) return;
    await API.post('/items', { title });
    setTitle('');
    load();
  }
const titleN= { title: title };
  const startEdit = (it) => { setEditId(it.id); setTitle(it.title?.title); }
  const saveEdit = async () => { await API.put(`/items/${editId}`, { title:titleN }); setEditId(null); setTitle(''); load(); }
  const del = async (id) => { await API.delete(`/items/${id}`); load(); }

  return (
    <div>
      <h1>Items</h1>
      <div>
        <input data-cy="item-input" value={title} onChange={e=>setTitle(e.target.value)} />
        {!editId && <button data-cy="add-btn" onClick={add}>Adicionar</button>}
        {editId && <button data-cy="save-btn" onClick={saveEdit}>Salvar</button>}
      </div>
      <ul data-cy="items-list">
        {items.map(i=> (
          <li key={i.id} data-cy={`item-${i.id}`}>
          
            <span> {i.title?.title}</span>
            <button data-cy={`edit-${i.id}`} onClick={()=>startEdit(i)}>Editar</button>
            <button data-cy={`del-${i.id}`} onClick={()=>del(i.id)}>Apagar</button>
          </li>
        ))}
      </ul>
    </div>
  )
}
