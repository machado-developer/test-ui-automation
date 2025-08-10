import React,  { useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try{
      const res = await API.post('/login', { username: u, password: p });
      localStorage.setItem('token', res.data.token);
      nav('/items');
    }catch(e){
      setErr(e.response?.data?.error || 'Erro');
    }
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <input placeholder="username" value={u} onChange={e=>setU(e.target.value)} />
        <input placeholder="password" value={p} type="password" onChange={e=>setP(e.target.value)} />
        <button type="submit">Entrar</button>
      </form>
      {err && <div data-cy="login-error">{err}</div>}
    </div>
  )
}
