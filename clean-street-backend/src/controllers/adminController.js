const Complaint = require("../models/Complaint");
const User = require("../models/User");
const AdminLog = require("../models/AdminLog");

// Overview stats
exports.adminOverview = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingReview = await Complaint.countDocuments({ status: "received" });
    const resolvedToday = await Complaint.countDocuments({
      status: "resolved",
      updated_at: { $gte: new Date().setHours(0, 0, 0, 0) }
    });
    const activeUsers = await User.countDocuments();

    res.json({ totalComplaints, pendingReview, activeUsers, resolvedToday });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all complaints (admins see all)
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user_id", "name email");
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get reports (logs for now)
exports.getReports = async (req, res) => {
  try {
    const logs = await AdminLog.find().populate("user_id", "name email");
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
