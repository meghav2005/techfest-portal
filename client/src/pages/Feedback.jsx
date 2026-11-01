import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';

// VITE_UNSAFE_DEMO=true renders raw HTML: the XSS hole used for the lab's "before" screenshot.
const UNSAFE = import.meta.env.VITE_UNSAFE_DEMO === 'true';

export default function Feedback() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(5);
  const [err, setErr] = useState('');
  const load = () => api('/feedback').then(setList).catch((e) => setErr(e.message));
  useEffect(() => { load(); }, []);
  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try { await api('/feedback', { method: 'POST', body: { message, rating: Number(rating) } }); setMessage(''); load(); }
    catch (x) { setErr(x.message); }
  };
  return (
    <>
      <h2>Feedback</h2>
      {user ? (
        <form className="panel" onSubmit={submit}>
          <label>Your message<textarea value={message} onChange={(e) => setMessage(e.target.value)} required maxLength={500} rows={3} /></label>
          <label>Rating<select value={rating} onChange={(e) => setRating(e.target.value)}>{[5, 4, 3, 2, 1].map((n) => <option key={n}>{n}</option>)}</select></label>
          {err && <p className="err" role="alert">{err}</p>}
          <button className="btn">Send feedback</button>
        </form>
      ) : <p className="note"><Link to="/login">Log in</Link> to leave feedback.</p>}
      <ul className="fb">
        {list.map((f) => (
          <li key={f._id}>
            <b>{f.user?.name || 'Guest'}</b> <span className="meta">rated {f.rating}/5</span>
            {UNSAFE ? <p dangerouslySetInnerHTML={{ __html: f.message }} /> : <p>{f.message}</p>}
          </li>
        ))}
        {list.length === 0 && <li className="meta">No feedback yet. Be the first.</li>}
      </ul>
    </>
  );
}
