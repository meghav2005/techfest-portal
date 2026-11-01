import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function MyEvents() {
  const { user, ready } = useAuth();
  const [regs, setRegs] = useState([]);
  useEffect(() => { if (user) api('/events/mine').then(setRegs).catch(() => {}); }, [user]);
  if (!ready) return <p className="note">Loading…</p>;
  if (!user) return <p className="note"><Link to="/login">Log in</Link> to see your events.</p>;
  return (
    <>
      <h2>My events</h2>
      {regs.length === 0 && <p className="note">You have not registered yet. <Link to="/events">Browse events</Link></p>}
      <div className="grid">
        {regs.filter((r) => r.event).map((r) => (
          <article key={r._id} className="card">
            <span className="tag">{r.event.category}</span>
            <h3>{r.event.title}</h3>
            <p className="meta">{new Date(r.event.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })} at {r.event.venue}</p>
          </article>
        ))}
      </div>
    </>
  );
}
