import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Auth({ mode }) {
  const isReg = mode === 'register';
  const { login, register } = useAuth();
  const nav = useNavigate();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      if (isReg) await register(f.name, f.email, f.password); else await login(f.email, f.password);
      nav('/events');
    } catch (x) { setErr(x.message); }
  };
  return (
    <form className="panel" onSubmit={submit}>
      <h2>{isReg ? 'Create your account' : 'Log in'}</h2>
      {isReg && <label>Full name<input value={f.name} onChange={set('name')} required minLength={2} maxLength={60} autoComplete="name" /></label>}
      <label>Email<input type="email" value={f.email} onChange={set('email')} required autoComplete="email" /></label>
      <label>Password<input type="password" value={f.password} onChange={set('password')} required minLength={isReg ? 8 : 1} autoComplete={isReg ? 'new-password' : 'current-password'} /></label>
      {isReg && <small>At least 8 characters.</small>}
      {err && <p className="err" role="alert">{err}</p>}
      <button className="btn">{isReg ? 'Create account' : 'Log in'}</button>
      <p className="meta">{isReg ? <>Already registered? <Link to="/login">Log in</Link></> : <>New here? <Link to="/register">Create an account</Link></>}</p>
    </form>
  );
}
