
const User = require("../models/User");
const Complaint = require("../models/Complaint");
const Comment = require("../models/Comment");
const Vote = require("../models/Vote");
const PDFDocument = require("pdfkit");

// ✅ Admin Overview (stats + analytics for dashboard)
exports.adminOverview = async (req, res) => {
  try {
    const activeUsers = await User.countDocuments();
    const totalComplaints = await Complaint.countDocuments();
    const resolved= await Complaint.countDocuments({ status: "resolved" });
    const inProgress = await Complaint.countDocuments({ status: "in_progress" });
    const pendingReview = await Complaint.countDocuments({ status: "received" });

    // 🔹 Top 5 complaints by upvotes
    const topComplaints = await Complaint.find()
      .sort({ upvotes: -1 })
      .limit(5)
      .select("title upvotes")
      .lean();

    // 🔹 Complaint trend (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const start = new Date(day.setHours(0, 0, 0, 0));
      const end = new Date(day.setHours(23, 59, 59, 999));

      const count = await Complaint.countDocuments({
        createdAt: { $gte: start, $lte: end },
      });

      last7Days.push({
        day: start.toLocaleDateString("en-US", { weekday: "short" }),
        complaints: count,
      });
    }

    res.json({
      activeUsers,
      totalComplaints,
      resolved,
      inProgress,
      pendingReview,
      topComplaints,
      complaintTrends: last7Days,
    });
  } catch (err) {
    console.error("Error in adminOverview:", err);
    res.status(500).json({ error: "Failed to fetch overview" });
  }
};

// ✅ Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error("Error in getUsers:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// ✅ Get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user_id", "name email")
      .populate("comments")
      .lean();

    res.json(complaints);
  } catch (err) {
    console.error("Error in getAllComplaints:", err);
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
};

// ✅ Get reports/logs
exports.getReports = async (req, res) => {
  try {
    const reports = await Complaint.find()
      .populate("user_id", "name email")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    // Fetch comments for these complaints
    const complaintIds = reports.map(r => r._id);
    const comments = await Comment.find({ complaint_id: { $in: complaintIds } })
      .populate("user_id", "name email")
      .lean();

    // Attach comments to each complaint
    const reportsWithComments = reports.map(r => {
      return {
        ...r,
        comments: comments.filter(c => String(c.complaint_id) === String(r._id)),
      };
    });

    res.json(reportsWithComments);
  } catch (err) {
    console.error("Error in getReports:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

// ✅ Generate Admin PDF Report
exports.generateAdminReport = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingReview = await Complaint.countDocuments({ status: "received" });
    const inProgress = await Complaint.countDocuments({ status: "in_progress" });
    const resolved = await Complaint.countDocuments({ status: "resolved" });
    const activeUsers = await User.countDocuments();
    const complaints = await Complaint.find().lean();

    const doc = new PDFDocument({ margin: 30, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=admin_report.pdf");
    doc.pipe(res);

    doc.fontSize(20).text("Admin Report", { align: "center" }).moveDown();

    doc.fontSize(14).text("📊 System Overview", { underline: true }).moveDown(0.5);
    doc.fontSize(12).list([
      `Total Complaints: ${totalComplaints}`,
      `Pending Review: ${pendingReview}`,
      `In Progress: ${inProgress}`,
      `Resolved: ${resolved}`,
      `Active Users: ${activeUsers}`,
    ]);
    doc.moveDown();

    doc.fontSize(14).text("📑 Complaints Summary", { underline: true }).moveDown(0.5);
    complaints.slice(0, 20).forEach((c, i) => {
      doc.fontSize(11).text(
        `${i + 1}. ${c.title} | Status: ${c.status} | Description: ${c.description || "N/A"}`
      );
      doc.moveDown(0.3);
    });

    if (complaints.length > 20) {
      doc.text(`...and ${complaints.length - 20} more complaints`, { italic: true });
    }

    doc.moveDown(2);
    doc.fontSize(10).text(`Generated on ${new Date().toLocaleString()}`, {
      align: "right",
      opacity: 0.6,
    });

    doc.end();
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
};
