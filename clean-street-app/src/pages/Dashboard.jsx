import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getComplaints } from "../api/complaints";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [metrics, setMetrics] = useState({ total: 0, pending: 0, inReview: 0, resolved: 0 });
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    getComplaints().then((data) => {
      setMetrics({
        total: data.length,
        pending: data.filter(c => c.status === "received").length,
        inReview: data.filter(c => c.status === "in_review").length,
        resolved: data.filter(c => c.status === "resolved").length
      });
      setComplaints(data);
    });
  }, []);

  return (
    <div className="container">
      <h2>User Dashboard</h2>

      {/* Metrics Section */}
      <div className="metrics">
        <div className="metric-card">
          <p>Total Issues</p>
          <h3>{metrics.total}</h3>
        </div>
        <div className="metric-card">
          <p>Pending</p>
          <h3>{metrics.pending}</h3>
        </div>
        <div className="metric-card">
          <p>In Progress</p>
          <h3>{metrics.inReview}</h3>
        </div>
        <div className="metric-card">
          <p>Resolved</p>
          <h3>{metrics.resolved}</h3>
        </div>
      </div>

      {/* Complaints List */}
      <div className="dashboard-content">
        <div className="recent">
          <h3>Recent Complaints</h3>
          {complaints.slice(-5).reverse().map((c) => (
            <div key={c._id} className="complaint-card">
              <h4>{c.title}</h4>
              <p>{c.description.substring(0, 80)}...</p>
              <p className="status">Status: {c.status}</p>
              <Link to={`/complaints/${c._id}`} className="view-btn">View Details</Link>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <Link to="/new-complaint"><button>+ Report New Issue</button></Link>
          <Link to="/complaints"><button>View All Complaints</button></Link>
          <button>Issue Map</button>
        </div>
      </div>
    </div>
  );
}
