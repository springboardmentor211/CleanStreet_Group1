const AdminLog = require("../models/AdminLog");
const Complaint = require("../models/Complaint");

exports.getMetrics = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const resolved = await Complaint.countDocuments({ status: "resolved" });
    const inReview = await Complaint.countDocuments({ status: "in_review" });
    const received = await Complaint.countDocuments({ status: "received" });

    res.json({ total, resolved, inReview, received });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.logAction = async (req, res) => {
  try {
    const log = await AdminLog.create({
      action: req.body.action,
      user_id: req.user.id,
    });
    res.json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
