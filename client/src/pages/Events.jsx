import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState(null);
  const [msg, setMsg] = useState('');
  const load = () => api('/events').then(setEvents).catch((e) => setMsg(e.message));
  useEffect(() => { load(); }, []);
  const join = async (id) => {
    try { setMsg((await api(`/events/${id}/register`, { method: 'POST' })).message); load(); }
    catch (e) { setMsg(e.message); }
  };
  if (!events) return <p className="note">{msg || 'Loading events…'}</p>;
  return (
    <>
      <h2>Events</h2>
      {msg && <p className="note" role="status">{msg}</p>}
      <div className="grid">
        {events.map((e) => (
          <article key={e._id} className="card">
            <span className="tag">{e.category}</span>
            <h3>{e.title}</h3>
            <p>{e.description}</p>
            <p className="meta">{new Date(e.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} at {e.venue}</p>
            <p className="meta">{e.registered} of {e.capacity} places taken</p>
            {user ? <button className="btn" onClick={() => join(e._id)}>Register</button> : <Link className="btn ghost" to="/login">Log in to register</Link>}
          </article>
        ))}
      </div>
    </>
  );
}
