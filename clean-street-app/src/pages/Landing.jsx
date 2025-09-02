import { Link } from "react-router-dom";
import "../styles/landing.css";

export default function LandingPage() {
  return (
    <div className="landing-page">
      <header className="hero">
        <h1>Make Your City Cleaner & Smarter</h1>
        <p className="tagline">Report civic issues, track progress, and help build a better community together.</p>
        <div className="cta-buttons">
          <Link to="/new-complaint" className="btn primary" >➕ Report an Issue</Link>
          <Link to="/complaints" className="btn secondary">👁️ View Complaints</Link>
        </div>
      </header> 
      <section className="features">
        <h2>How CleenStreet Works</h2>
        <p className="tagline">Simple steps to make a difference in your community</p>
        <div className="feature-cards">
          <div className="feature-card">
            <h3>📢 Easy Reporting</h3>
            <p>Easily report civic problems with photos and location details</p>
          </div>
          <div className="feature-card">
            <h3>🤝 Community Impact</h3>
            <p>Vote and comment on issues to help prioritize community needs</p>
          </div>
          <div className="feature-card">
            <h3>✅ Track Progress</h3>
            <p>Monitor the status of reported issues and see updates in real-time</p>
          </div>
        </div>
      </section>
    </div>
  );
}
