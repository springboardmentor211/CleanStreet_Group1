import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getComplaints } from "../api/complaints";
import "../styles/viewComplaints.css";

export default function ViewComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    getComplaints().then(setComplaints);
  }, []);

  const filteredComplaints =
    filter === "all" ? complaints : complaints.filter(c => c.status === filter);

  return (
    <div className="container view-complaints">
      <h2>All Complaints</h2>

      {/* Filter Buttons */}
      <div className="filters">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          className={filter === "received" ? "active" : ""}
          onClick={() => setFilter("received")}
        >
          Pending
        </button>
        <button
          className={filter === "in_review" ? "active" : ""}
          onClick={() => setFilter("in_review")}
        >
          In Progress
        </button>
        <button
          className={filter === "resolved" ? "active" : ""}
          onClick={() => setFilter("resolved")}
        >
          Resolved
        </button>
      </div>

      {/* Complaints List */}
      <div className="complaints-list">
        {filteredComplaints.length === 0 && (
          <p className="no-data">No complaints found.</p>
        )}
        {filteredComplaints.map((c) => (
          <div key={c._id} className="complaint-card">
            <h4>{c.title}</h4>
            <p>{c.description.substring(0, 100)}...</p>
            <p className="status">Status: {c.status}</p>
            <Link to={`/complaints/${c._id}`} className="view-btn">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
