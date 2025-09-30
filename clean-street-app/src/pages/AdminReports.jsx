import { useEffect, useState, useRef } from "react";
import api from "../api/client";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line
} from "recharts";
import "../styles/adminReports.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function AdminReports() {
  const [overview, setOverview] = useState({});
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef();

  useEffect(() => {
    Promise.all([
      api.get("/admin/overview"),
      api.get("/admin/reports")
    ])
      .then(([ovRes, repRes]) => {
        setOverview(ovRes.data || {});
        setReports(repRes.data || []);
      })
      .catch(err => console.error("Error loading reports:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading reports...</p>;

  // Pie chart data (complaint status distribution)
  const statusData = [
    { name: "Pending", value: overview.pendingReview || 0 },
    { name: "In Progress", value: overview.inProgress || 0 },
    { name: "Resolved", value: overview.resolvedToday || 0 },
  ];
  const COLORS = ["#f39c12", "#3498db", "#2ecc71"];

  // Bar chart data (top complaints by upvotes)
  const topComplaints = reports
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5)
    .map(r => ({ title: r.title, upvotes: r.upvotes }));

  // Line chart data (fake sample trend – ideally backend should provide per-day counts)
  const complaintTrends = [
    { day: "Mon", complaints: 3 },
    { day: "Tue", complaints: 5 },
    { day: "Wed", complaints: 2 },
    { day: "Thu", complaints: 8 },
    { day: "Fri", complaints: 6 },
  ];

  // 🔹 Export visible section as PDF
  const handleExportPDF = async () => {
    const input = reportRef.current;
    const canvas = await html2canvas(input, { scale: 2 }); // HD quality
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("admin_report.pdf");
  };

  return (
    <div className="reports-page">
      <h1>📊 Admin Reports</h1>

      

      {/* Report Content to Capture */}
      <div ref={reportRef}>
        {/* Overview Cards */}
        <div className="cards">
          <div className="card">📋 Total Complaints: {overview.totalComplaints}</div>
          <div className="card">🕒 Pending: {overview.pendingReview}</div>
          <div className="card">🔄 In Progress: {overview.inProgress}</div>
          <div className="card">✔️ Resolved: {overview.resolvedToday}</div>
          <div className="card">👥 Active Users: {overview.activeUsers}</div>
        </div>

        {/* Charts */}
        <div className="charts">
          <div className="chart">
            <h3>Complaints by Status</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={statusData}
                cx="50%" cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ReTooltip />
            </PieChart>
          </div>

          <div className="chart">
            <h3>Top Complaints (by Upvotes)</h3>
            <BarChart width={400} height={300} data={topComplaints}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Bar dataKey="upvotes" fill="#3498db" />
              <ReTooltip />
            </BarChart>
          </div>

          <div className="chart">
            <h3>Complaints (Weekly)</h3>
            <LineChart width={400} height={300} data={complaintTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Line type="monotone" dataKey="complaints" stroke="#e74c3c" />
              <ReTooltip />
            </LineChart>
          </div>
        </div>

        {/* Reports Table */}
        <h2>📑 Complaints Summary</h2>
        <table className="reports-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Status</th>
              <th>Upvotes</th>
              <th>Downvotes</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r._id}>
                <td>{r.title}</td>
                <td>{r.status}</td>
                <td>{r.upvotes}</td>
                <td>{r.downvotes}</td>
                <td>{r.comments?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Export Buttons */}
      <div className="report-actions">
        <button className="download-btn" onClick={handleExportPDF}>
          📄 Export Visible Report (PDF)
        </button>
        <button
  className="download-btn"
  onClick={() => {
    window.open("http://localhost:5000/api/admin/generate-report");
  }}
>
  🗂 Download Full Report (Server PDF)
</button>

      </div>
      </div>
    </div>
  );
}
