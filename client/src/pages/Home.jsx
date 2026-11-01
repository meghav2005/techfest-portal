import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <section className="hero">
      <h1>Three days.<br />Eight events.<br />One festival.</h1>
      <p>Hackathons, robot races, design duels and a cloud workshop. Pick your events, register in a click, and tell us how it went.</p>
      <div className="row">
        <Link className="btn" to="/events">See the events</Link>
        <Link className="btn ghost" to="/register">Create an account</Link>
      </div>
      <div className="dates"><span>Dec 10</span><span>Dec 11</span><span>Dec 12</span><span>Dec 13</span></div>
    </section>
  );
}
