const AdminLog = require("../models/AdminLog");
const Complaint = require("../models/Complaint");

exports.adminOverview = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingReview = await Complaint.countDocuments({ status: "in_review" });
    const resolvedToday = await Complaint.countDocuments({
      status: "resolved",
      updated_at: { $gte: new Date().setHours(0, 0, 0, 0) },
    });
    const activeUsers = await Complaint.distinct("user_id").then((u) => u.length);

    res.json({
      totalComplaints,
      pendingReview,
      activeUsers,
      resolvedToday,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
