const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Vote = require("../models/Vote");
const Comment = require("../models/Comment");
const { Parser } = require("json2csv");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

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
    const { start, end } = req.query;
    const match = {};
    if (start && end) {
      match.createdAt = { $gte: new Date(start), $lte: new Date(end) };
    }

    const data = await Complaint.aggregate([
      { $match: match },
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
    const points = data
      .filter(c => c.location && c.location.lat && c.location.lng)
      .map(c => ({ lat: c.location.lat, lng: c.location.lng }));
    res.json(points);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// ✅ 10. Export (PDF, Excel, CSV)
exports.exportReport = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user_id", "name email");

    if (req.params.format === "csv") {
      const parser = new Parser();
      const csv = parser.parse(complaints);
      res.header("Content-Type", "text/csv");
      res.attachment("report.csv");
      return res.send(csv);
    }

    if (req.params.format === "excel") {
      const workbook = new ExcelJS.Workbook();
      const sheet = workbook.addWorksheet("Complaints");
      sheet.addRow(Object.keys(complaints[0].toObject()));
      complaints.forEach((c) => sheet.addRow(Object.values(c.toObject())));
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
      res.setHeader("Content-Disposition", "attachment; filename=report.xlsx");
      return workbook.xlsx.write(res).then(() => res.end());
    }

    if (req.params.format === "pdf") {
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=report.pdf");
      doc.pipe(res);
      doc.fontSize(16).text("Clean Street - Complaints Report", { align: "center" });
      complaints.forEach((c) => {
        doc.moveDown().fontSize(12).text(`${c.title} - ${c.status} (by ${c.user_id?.name})`);
      });
      doc.end();
      return;
    }

    res.status(400).json({ error: "Invalid export format" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
