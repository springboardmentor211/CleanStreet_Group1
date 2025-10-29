import { useEffect, useState, useCallback } from "react";
import api from "../api/client";
import AdminReports from "./AdminReports";
import "../styles/adminDashboard.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [complaints, setComplaints] = useState([]);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [stats, setStats] = useState({
    totalComplaints: null,
    pendingReview: null,
    inProgress: null,
    resolved: null,
    activeUsers: null,
    topComplaints: [],
    complaintTrends: [],
  });

  const [loadingStats, setLoadingStats] = useState(true);

  // ✅ useCallback prevents re-creation & fixes ESLint dependency warning
  const fetchReports = useCallback(async () => {
    try {
      setLoadingReports(true);
      const res = await api.get("/complaints");
      setReports(res.data);
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoadingReports(false);
    }
  }, []);

  const loadComplaints = useCallback(() => {
    setLoadingComplaints(true);
    api
      .get("/complaints")
      .then((res) => setComplaints(res.data || []))
      .catch(() => setComplaints([]))
      .finally(() => setLoadingComplaints(false));
  }, []);

  // ✅ useEffect safely depends on stable callbacks
  useEffect(() => {
    if (activeSection === "overview") {
      setLoadingStats(true);
      api
        .get("/admin/overview")
        .then((res) => setStats(res.data || {}))
        .catch(() => setStats({}))
        .finally(() => setLoadingStats(false));
    }
    if (activeSection === "complaints") loadComplaints();
    if (activeSection === "users") {
      setLoadingUsers(true);
      api
        .get("/admin/users")
        .then((res) => setUsers(res.data || []))
        .catch(() => setUsers([]))
        .finally(() => setLoadingUsers(false));
    }
    if (activeSection === "reports") fetchReports();
  }, [activeSection, fetchReports, loadComplaints]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?"))
      return;
    await api.delete(`/complaints/${id}`);
    loadComplaints();
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/complaints/${id}/status`, { status: newStatus });
      loadComplaints();
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update complaint status");
    }
  };

  const handleViewComplaint = (id) => {
    console.log("Clicked complaint:", id);
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <button
            className={activeSection === "overview" ? "active" : ""}
            onClick={() => setActiveSection("overview")}
          >
            📊 Overview
          </button>
          <button
            className={activeSection === "complaints" ? "active" : ""}
            onClick={() => setActiveSection("complaints")}
          >
            📝 Manage Complaints
          </button>
          <button
            className={activeSection === "users" ? "active" : ""}
            onClick={() => setActiveSection("users")}
          >
            👥 Users
          </button>
          <button
            className={activeSection === "reports" ? "active" : ""}
            onClick={() => setActiveSection("reports")}
          >
            📄 Reports
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* 🔹 Overview */}
        {activeSection === "overview" && (
          <div>
            <h1>System Overview</h1>

            <div className="cards">
              <div className="card">
                📋{" "}
                <p>{loadingStats ? "..." : stats.totalComplaints ?? "N/A"}</p>
                <span>Total Complaints</span>
              </div>
              <div className="card">
                🕒 <p>{loadingStats ? "..." : stats.pendingReview ?? "N/A"}</p>
                <span>Pending Review</span>
              </div>
              <div className="card">
                🔄 <p>{loadingStats ? "..." : stats.inProgress ?? "N/A"}</p>
                <span>In Progress</span>
              </div>
              <div className="card">
                ✔️ <p>{loadingStats ? "..." : stats.resolved ?? "N/A"}</p>
                <span>Resolved </span>
              </div>
              <div className="card">
                👥 <p>{loadingStats ? "..." : stats.activeUsers ?? "N/A"}</p>
                <span>Active Users</span>
              </div>
            </div>

            {/* 📈 Complaint Trend Graph */}
            <div className="chart-section">
              <h3>📈 Complaint Trends (Last 7 Days)</h3>
              <LineChart
                width={600}
                height={250}
                data={stats.complaintTrends}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="complaints" stroke="#4caf50" />
              </LineChart>
            </div>

            {/* 🏆 Top Complaints by Upvotes */}
            <div className="chart-section">
              <h3>🏆 Top 5 Complaints (By Upvotes)</h3>
              <BarChart
                width={600}
                height={250}
                data={stats.topComplaints}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="upvotes" fill="#2196f3" />
              </BarChart>
            </div>
          </div>
        )}

        {/* 🔹 Complaints */}
        {activeSection === "complaints" && (
          <div>
            <h1>All Complaints</h1>
            {loadingComplaints ? (
              <p>Loading complaints...</p>
            ) : complaints.length === 0 ? (
              <p>No complaints found.</p>
            ) : (
              complaints.map((c) => (
                <div key={c._id} className="complaint-card">
                  <h3>{c.title}</h3>
                  <p>{c.description}</p>
                  <p>
                    <b>Status:</b> {c.status}
                  </p>
                  {c.photos?.length > 0 && (
                    <div className="complaint-photos">
                      {c.photos.map((_, idx) => (
                        <img
                          key={idx}
                          src={`http://localhost:5000/api/complaints/${c._id}/photo/${idx}`}
                          alt={`Complaint ${idx}`}
                        />
                      ))}
                    </div>
                  )}
                  <div className="actions">
                    <button onClick={() => handleViewComplaint(c._id)}>
                      👁 View
                    </button>
                    <button
                      onClick={() => handleStatusChange(c._id, "in_progress")}
                    >
                      🔄 In Progress
                    </button>
                    <button
                      onClick={() => handleStatusChange(c._id, "resolved")}
                    >
                      ✔️ Resolved
                    </button>
                    <button
                      className="danger"
                      onClick={() => handleDelete(c._id)}
                    >
                      ❌ Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 🔹 Users */}
        {activeSection === "users" && (
          <div>
            <h1>All Users</h1>
            {loadingUsers ? (
              <p>Loading users...</p>
            ) : users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              users.map((u) => (
                <div key={u._id} className="user-card">
                  <p>
                    <b>Name:</b> {u.name}
                  </p>
                  <p>
                    <b>Email:</b> {u.email}
                  </p>
                  <p>
                    <b>Phone:</b> {u.phone || "N/A"}
                  </p>
                </div>
              ))
            )}
          </div>
        )}

        {/* 🔹 Reports */}
        {activeSection === "reports" && (
          <AdminReports reports={reports} loadingReports={loadingReports} />
        )}
      </main>
    </div>
  );
}
