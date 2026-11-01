import { lazy, Suspense } from 'react';
import { Routes, Route, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Events from './pages/Events.jsx';
import Auth from './pages/Auth.jsx';
import Feedback from './pages/Feedback.jsx';
import MyEvents from './pages/MyEvents.jsx';

const Gallery = lazy(() => import('./pages/Gallery.jsx')); // loaded only when /gallery is opened

export default function App() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <>
      <header className="bar">
        <Link to="/" className="brand">TechFest <b>2026</b></Link>
        <nav>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/feedback">Feedback</NavLink>
          {user ? (
            <>
              <NavLink to="/my-events">My events</NavLink>
              <button className="link" onClick={async () => { await logout(); nav('/'); }}>Log out ({user.name.split(' ')[0]})</button>
            </>
          ) : (
            <>
              <NavLink to="/login">Log in</NavLink>
              <NavLink to="/register" className="pill">Register</NavLink>
            </>
          )}
        </nav>
      </header>
      <main>
        <Suspense fallback={<p className="note">Loading gallery…</p>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="/login" element={<Auth mode="login" />} />
            <Route path="/register" element={<Auth mode="register" />} />
            <Route path="*" element={<p className="note">Page not found. <Link to="/">Back to home</Link></p>} />
          </Routes>
        </Suspense>
      </main>
      <footer className="foot">TechFest 2026 Portal · Web Technology Laboratory project</footer>
    </>
  );
}
