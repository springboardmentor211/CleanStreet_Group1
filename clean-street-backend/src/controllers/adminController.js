const Complaint = require("../models/Complaint");
const User = require("../models/User");
const AdminLog = require("../models/AdminLog");
const Vote = require("../models/Vote");
const Comment = require("../models/Comment");
// Overview stats
exports.adminOverview = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingReview = await Complaint.countDocuments({ status: "received" });
    const inProgress = await Complaint.countDocuments({ status: "in_progress" });
    const resolvedToday = await Complaint.countDocuments({ status: "resolved" });
    const activeUsers = await User.countDocuments();

    res.json({ totalComplaints, pendingReview, inProgress, activeUsers, resolvedToday });
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

// Get reports (votes + complaints)
exports.getReports = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user_id", "name email")
      .lean();

    for (let c of complaints) {
      c.upvotes = await Vote.countDocuments({ complaint_id: c._id, vote_type: "upvote" });
      c.downvotes = await Vote.countDocuments({ complaint_id: c._id, vote_type: "downvote" });

      // Include comment text + user
      c.comments = await Comment.find({ complaint_id: c._id })
        .populate("user_id", "name email")
        .select("text createdAt user_id");
    }

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};