import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api from "../api/client";
import "../styles/dashboard.css";

export default function AdminDashboard() {

  const [activeSection, setActiveSection] = useState('overview');
  const [complaints, setComplaints] = useState([]);
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
        .then((res) => setComplaints(res.data || []))
        .catch(() => setComplaints([]))
        .finally(() => setLoadingComplaints(false));
    }
    if (activeSection === 'users') {
      setLoadingUsers(true);
      api.get('/users')
        .then((res) => setUsers(res.data || []))
        .catch(() => setUsers([]))
        .finally(() => setLoadingUsers(false));
    }
    if (activeSection === 'reports') {
      setLoadingReports(true);
      api.get('/reports')
        .then((res) => setReports(res.data || []))
        .catch(() => setReports([]))
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {complaints.length === 0 ? (
                    <div>No complaints found.</div>
                  ) : (
                    complaints.map((c) => (
                      <div key={c._id} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #e5e7eb', padding: '24px' }}>
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
                      </div>
                    ))
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
              <div style={{ fontWeight: 700, fontSize: 32, marginBottom: 16 }}>All Reports</div>
              {loadingReports ? (
                <div>Loading reports...</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {reports.length === 0 ? (
                    <div>No reports found.</div>
                  ) : (
                    reports.map((r, idx) => (
                      <div key={r._id || idx} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px #e5e7eb', padding: '24px' }}>
                        {Object.entries(r).map(([key, value]) => {
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
        </main>
      </div>
    </div>
  );
}
