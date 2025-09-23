import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api from "../api/client";
import "../styles/dashboard.css";

export default function AdminDashboard() {
  // Sample users for UI testing
  const sampleUsers = [
    {
      _id: 'u1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      joined: '2025-01-10',
    },
    {
      _id: 'u2',
      name: 'Priya Singh',
      email: 'priya@example.com',
      role: 'user',
      joined: '2025-03-15',
    },
    {
      _id: 'u3',
      name: 'Ahmed Khan',
      email: 'ahmed@example.com',
      role: 'user',
      joined: '2025-05-22',
    },
  ];

  // Sample reports for UI testing
  const sampleReports = [
    {
      _id: 'r1',
      title: 'Monthly Cleanliness Report',
      summary: 'City cleanliness improved by 15% in September.',
      created: '2025-09-22',
    },
    {
      _id: 'r2',
      title: 'Garbage Collection Issues',
      summary: 'Overflowing bins reported in 3 sectors.',
      created: '2025-09-20',
    },
    {
      _id: 'r3',
      title: 'Streetlight Maintenance',
      summary: '10 streetlights fixed in Park Avenue.',
      created: '2025-09-18',
    },
  ];

  const [activeSection, setActiveSection] = useState('overview');
  const [complaints, setComplaints] = useState([]);
  const [expandedComplaintId, setExpandedComplaintId] = useState(null);
  const [loadingComplaints, setLoadingComplaints] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(false);
  const [stats, setStats] = useState({
    totalComplaints: null,
    pendingReview: null,
    activeUsers: null,
    resolvedToday: null,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Sample complaints for UI testing
  const sampleComplaints = [
    {
      _id: '1',
      user: { name: 'John Doe', email: 'john@example.com' },
      description: 'Overflowing garbage bin at Main Street',
      location: 'Main Street, Sector 5',
      status: 'Pending',
      date: '2025-09-20',
      photos: [],
    },
    {
      _id: '2',
      user: { name: 'Priya Singh', email: 'priya@example.com' },
      description: 'Broken streetlight near Park Avenue',
      location: 'Park Avenue, Sector 2',
      status: 'Resolved',
      date: '2025-09-18',
      photos: [],
    },
    {
      _id: '3',
      user: { name: 'Ahmed Khan', email: 'ahmed@example.com' },
      description: 'Open manhole at Market Road',
      location: 'Market Road, Sector 7',
      status: 'In Progress',
      date: '2025-09-21',
      photos: [],
    },
  ];

  useEffect(() => {
    if (activeSection === 'overview') {
      setLoadingStats(true);
      api.get('/admin/overview')
        .then((res) => {
          setStats({
            totalComplaints: res.data?.totalComplaints ?? null,
            pendingReview: res.data?.pendingReview ?? null,
            activeUsers: res.data?.activeUsers ?? null,
            resolvedToday: res.data?.resolvedToday ?? null,
          });
        })
        .catch(() => {
          setStats({
            totalComplaints: null,
            pendingReview: null,
            activeUsers: null,
            resolvedToday: null,
          });
        })
        .finally(() => setLoadingStats(false));
    }
    if (activeSection === 'complaints') {
      setLoadingComplaints(true);
      api.get('/complaints')
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setComplaints(res.data);
          } else {
            setComplaints(sampleComplaints);
          }
        })
        .catch(() => setComplaints(sampleComplaints))
        .finally(() => setLoadingComplaints(false));
    }
    if (activeSection === 'users') {
      setLoadingUsers(true);
      api.get('/users')
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setUsers(res.data);
          } else {
            setUsers(sampleUsers);
          }
        })
        .catch(() => setUsers(sampleUsers))
        .finally(() => setLoadingUsers(false));
    }
    if (activeSection === 'reports') {
      setLoadingReports(true);
      api.get('/reports')
        .then((res) => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setReports(res.data);
          } else {
            setReports(sampleReports);
          }
        })
        .catch(() => setReports(sampleReports))
        .finally(() => setLoadingReports(false));
    }
  }, [activeSection]);

  return (
    <div className="admin-dashboard-container" style={{ fontFamily: 'Segoe UI, Arial, sans-serif', background: '#f7f8fa', minHeight: '100vh' }}>
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
        {/* Sidebar */}
        <aside style={{ width: 220, background: '#fff', borderRight: '1px solid #e5e7eb', padding: '32px 0 0 0' }}>
          <div style={{ fontWeight: 700, fontSize: 22, marginLeft: 32, marginBottom: 32 }}>Admin Panel</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: 16 }}>
            <button
              style={{ background: activeSection === 'overview' ? '#2563eb' : 'none', color: activeSection === 'overview' ? '#fff' : '#222', border: 'none', borderRadius: 6, padding: '10px 18px', textAlign: 'left', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
              onClick={() => setActiveSection('overview')}
            >
              <span role="img" aria-label="overview">📊</span> Overview
            </button>
            <button
              style={{ background: activeSection === 'complaints' ? '#2563eb' : 'none', color: activeSection === 'complaints' ? '#fff' : '#222', border: 'none', borderRadius: 6, padding: '10px 18px', textAlign: 'left', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
              onClick={() => setActiveSection('complaints')}
            >
              <span role="img" aria-label="complaints">📝</span> Manage Complaints
            </button>
            <button
              style={{ background: activeSection === 'users' ? '#2563eb' : 'none', color: activeSection === 'users' ? '#fff' : '#222', border: 'none', borderRadius: 6, padding: '10px 18px', textAlign: 'left', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
              onClick={() => setActiveSection('users')}
            >
              <span role="img" aria-label="users">👥</span> Users
            </button>
            <button
              style={{ background: activeSection === 'reports' ? '#2563eb' : 'none', color: activeSection === 'reports' ? '#fff' : '#222', border: 'none', borderRadius: 6, padding: '10px 18px', textAlign: 'left', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10 }}
              onClick={() => setActiveSection('reports')}
            >
              <span role="img" aria-label="reports">📄</span> Reports
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '40px 48px' }}>
          {activeSection === 'overview' && (
            <>
              <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 16 }}>System Overview</div>
              <div style={{ display: 'flex', gap: '32px', marginBottom: 32 }}>
                {/* Card 1: Total Complaints */}
                <div style={{ flex: 1, background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #e5e7eb', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 32, marginBottom: 8 }} role="img" aria-label="complaints">📋</span>
                  <div style={{ fontWeight: 700, fontSize: 28 }}>
                    {loadingStats ? '...' : (stats.totalComplaints ?? 'N/A')}
                  </div>
                  <div style={{ color: '#666', fontWeight: 500, marginTop: 8 }}>Total Complaints</div>
                </div>
                {/* Card 2: Pending Review */}
                <div style={{ flex: 1, background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #e5e7eb', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 32, marginBottom: 8 }} role="img" aria-label="pending">🕒</span>
                  <div style={{ fontWeight: 700, fontSize: 28 }}>
                    {loadingStats ? '...' : (stats.pendingReview ?? 'N/A')}
                  </div>
                  <div style={{ color: '#666', fontWeight: 500, marginTop: 8 }}>Pending Review</div>
                </div>
                {/* Card 3: Active Users */}
                <div style={{ flex: 1, background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #e5e7eb', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 32, marginBottom: 8 }} role="img" aria-label="users">📈</span>
                  <div style={{ fontWeight: 700, fontSize: 28 }}>
                    {loadingStats ? '...' : (stats.activeUsers ?? 'N/A')}
                  </div>
                  <div style={{ color: '#666', fontWeight: 500, marginTop: 8 }}>Active Users</div>
                </div>
                {/* Card 4: Resolved Today */}
                <div style={{ flex: 1, background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #e5e7eb', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: 32, marginBottom: 8 }} role="img" aria-label="resolved">✔️</span>
                  <div style={{ fontWeight: 700, fontSize: 28 }}>
                    {loadingStats ? '...' : (stats.resolvedToday ?? 'N/A')}
                  </div>
                  <div style={{ color: '#666', fontWeight: 500, marginTop: 8 }}>Resolved Today</div>
                </div>
              </div>

              {/* Community Impact Section */}
              <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 2px 8px #e5e7eb', padding: '32px', marginTop: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 10 }}>Community Impact</div>
                <div style={{ color: '#444', fontSize: 16 }}>
                  Thanks to citizen reports and community engagement, we've resolved <span style={{ color: '#2563eb', fontWeight: 600 }}>{loadingStats ? '...' : (stats.resolvedToday ?? 'N/A')} issues</span> this month, making our city cleaner and safer for everyone.
                </div>
              </div>
            </>
          )}
          {activeSection === 'complaints' && (
            <>
              <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 16 }}>All Complaints</div>
              {loadingComplaints ? (
                <div>Loading complaints...</div>
              ) : (
                <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #e5e7eb', padding: '0', overflow: 'hidden' }}>
                  {complaints.length === 0 ? (
                    <div style={{ padding: '24px' }}>No complaints found.</div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ background: '#f3f4f6', fontWeight: 600 }}>
                          <th style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>User Name</th>
                          <th style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Complaint</th>
                          <th style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }}>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {complaints.map((c) => {
                          const userName = c.user?.name || c.user?.username || 'Unknown';
                          const complaintText = c.description || c.title || 'No description';
                          const location = c.location || c.address || 'N/A';
                          return (
                            <>
                              <tr
                                key={c._id}
                                style={{ cursor: 'pointer', background: expandedComplaintId === c._id ? '#e0e7ff' : '#fff', transition: 'background 0.2s' }}
                                onClick={() => setExpandedComplaintId(expandedComplaintId === c._id ? null : c._id)}
                              >
                                <td style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>{userName}</td>
                                <td style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>{complaintText}</td>
                                <td style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>{location}</td>
                              </tr>
                              {expandedComplaintId === c._id && (
                                <tr>
                                  <td colSpan={3} style={{ padding: '24px', background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                                    {/* Full complaint details */}
                                    {Object.entries(c).map(([key, value]) => {
                                      if (key === 'photos' && Array.isArray(value) && value.length > 0) {
                                        return (
                                          <div key={key} style={{ marginTop: 10 }}>
                                            <b>Photos:</b>
                                            <div style={{ display: 'flex', gap: 10 }}>
                                              {value.map((_, idx) => (
                                                <img
                                                  key={idx}
                                                  src={`http://localhost:5000/api/complaints/${c._id}/photo/${idx}`}
                                                  alt={`Complaint ${idx}`}
                                                  style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8 }}
                                                />
                                              ))}
                                            </div>
                                          </div>
                                        );
                                      }
                                      if (key === 'user' && typeof value === 'object' && value !== null) {
                                        return (
                                          <div key={key}><b>User:</b> {value.name || value.username || 'Unknown'} ({value.email || 'N/A'})</div>
                                        );
                                      }
                                      // Skip _id and __v fields
                                      if (key === '_id' || key === '__v') return null;
                                      return (
                                        <div key={key}><b>{key.charAt(0).toUpperCase() + key.slice(1)}:</b> {String(value)}</div>
                                      );
                                    })}
                                  </td>
                                </tr>
                              )}
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </>
          )}
          {activeSection === 'users' && (
            <>
              <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 16 }}>All Users</div>
              {loadingUsers ? (
                <div>Loading users...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {users.length === 0 ? (
                    <div>No users found.</div>
                  ) : (
                    users.map((u, idx) => (
                      <div key={u._id || idx} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #e5e7eb', padding: '24px' }}>
                        {Object.entries(u).map(([key, value]) => {
                          if (key === '_id' || key === '__v') return null;
                          return (
                            <div key={key}><b>{key.charAt(0).toUpperCase() + key.slice(1)}:</b> {String(value)}</div>
                          );
                        })}
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
          {activeSection === 'reports' && (
            <>
              <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 16 }}>Reports</div>
              <div style={{ fontSize: 22, color: '#888', marginTop: 32, textAlign: 'center' }}>Coming soon!</div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
