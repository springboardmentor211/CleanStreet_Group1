const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Vote = require("../models/Vote");
const Comment = require("../models/Comment");
const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");
const PDFDocument = require('pdfkit-table');

// Helper function to create table data for complaints
function formatComplaintsTable(complaints) {
  return {
    title: 'Complaints Report',
    headers: [
      { label: 'Title', property: 'title', width: 150 },
      { label: 'Status', property: 'status', width: 80 },
      { label: 'Upvotes', property: 'upvotes', width: 60 },
      { label: 'Downvotes', property: 'downvotes', width: 70 },
      { label: 'Comments', property: 'comments', width: 70 }
    ],
    rows: complaints.map(c => [
      c.title,
      c.status,
      c.upvotes || 0,
      c.downvotes || 0,
      c.comments || 0,
    ]),
  };
}
// ✅ 1. Summary
exports.getSummary = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: "received" });
    const inProgress = await Complaint.countDocuments({ status: "in-progress" });
    const resolved = await Complaint.countDocuments({ status: "resolved" });
    const totalUsers = await User.countDocuments();

    res.json({ totalComplaints, pending, inProgress, resolved, totalUsers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 2. Complaint Categories
exports.getCategoryDistribution = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      { $group: { _id: "$category", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 3. Top Areas
exports.getTopAreas = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      { $group: { _id: "$ward", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 4. Trends (daily)
exports.getTrends = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    res.json(data.map(d => ({ date: d._id, count: d.count })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 5. Top Upvoted
exports.getTopUpvoted = async (req, res) => {
  try {
    const data = await Vote.aggregate([
      { $match: { vote_type: "upvote" } },
      { $group: { _id: "$complaint_id", upvotes: { $sum: 1 } } },
      { $sort: { upvotes: -1 } },
      { $limit: 5 },
    ]);
    const withComplaints = await Complaint.populate(data, { path: "_id", select: "title" });
    res.json(withComplaints.map(d => ({ _id: d._id._id, complaint: d._id, upvotes: d.upvotes })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 6. Top Downvoted
exports.getTopDownvoted = async (req, res) => {
  try {
    const data = await Vote.aggregate([
      { $match: { vote_type: "downvote" } },
      { $group: { _id: "$complaint_id", downvotes: { $sum: 1 } } },
      { $sort: { downvotes: -1 } },
      { $limit: 5 },
    ]);
    const withComplaints = await Complaint.populate(data, { path: "_id", select: "title" });
    res.json(withComplaints.map(d => ({ _id: d._id._id, complaint: d._id, downvotes: d.downvotes })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 7. Top Contributors
exports.getTopContributors = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      { $group: { _id: "$user_id", complaints: { $sum: 1 } } },
      { $sort: { complaints: -1 } },
      { $limit: 5 },
    ]);
    const withUsers = await User.populate(data, { path: "_id", select: "name" });
    res.json(withUsers.map(d => ({ userId: d._id._id, name: d._id.name, complaints: d.complaints })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 8. Resolution Stats
exports.getResolutionStats = async (req, res) => {
  try {
    const now = new Date();
    const backlog = await Complaint.countDocuments({
      status: { $ne: "resolved" },
      createdAt: { $lt: new Date(now.setDate(now.getDate() - 30)) },
    });

    const resolved = await Complaint.find({ status: "resolved" });
    let totalDays = 0;
    resolved.forEach((c) => {
      if (c.updatedAt && c.createdAt) {
        totalDays += (c.updatedAt - c.createdAt) / (1000 * 60 * 60 * 24);
      }
    });
    const avgDays = resolved.length ? (totalDays / resolved.length).toFixed(1) : 0;

    const slaCount = resolved.filter((c) => {
      if (c.updatedAt && c.createdAt) {
        return (c.updatedAt - c.createdAt) / (1000 * 60 * 60 * 24) <= 7;
      }
      return false;
    }).length;

    const slaPercent = resolved.length ? ((slaCount / resolved.length) * 100).toFixed(1) : 0;

    res.json({ backlog, avgDays, slaPercent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 9. Map Points
exports.getMapPoints = async (req, res) => {
  try {
    const data = await Complaint.find({}, "location.lat location.lng");
    res.json(data.map(c => ({ lat: c.location.lat, lng: c.location.lng })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ 10. Export (PDF, Excel, CSV)
exports.exportReport = async (req, res) => {
  try {
    const complaints = await Complaint.find().lean();
    // Fetch votes and comments counts if needed to enrich complaints
    // Example: join vote and comment counts per complaint here or aggregate separately

    if (req.params.format === "csv") {
      const parser = new Parser();
      const csv = parser.parse(complaints);
      res.header("Content-Type", "text/csv");
      res.attachment("report.csv");
      return res.send(csv);
    }

    if (req.params.format === "excel") {
      // Existing excel export logic here...
    }

    if (req.params.format === "pdf") {
      const doc = new PDFDocument({ margin: 30, size: 'A4' });
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
      
      doc.pipe(res);

      doc.fontSize(20).text("Clean Street - Complaints Report", { align: "center" });
      doc.moveDown();

      // Add a summary paragraph (optional)
      doc.fontSize(12).text(`Total Complaints: ${complaints.length}`, { align: "left" });
      doc.moveDown();

      // Add complaints table using pdfkit-table
      const complaintsTable = formatComplaintsTable(complaints);

      await doc.table(complaintsTable, {
        prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
        prepareRow: (row, i) => doc.font("Helvetica").fontSize(10),
        columnSpacing: 5,
        width: 540,
      });

      doc.end();
      return;
    }

    res.status(400).json({ error: "Invalid export format" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};