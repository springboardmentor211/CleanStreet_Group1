const Complaint = require("../models/Complaint");

// Create complaint
exports.createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create({
      user_id: req.user.id,
      title: req.body.title,
      description: req.body.description,
      photo: req.body.photo,
      location_coords: req.body.location_coords,
      address: req.body.address,
      assigned_to: req.body.assigned_to,
    });
    res.json(complaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all complaints
exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user_id", "name email role");
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get complaint by ID
exports.getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user_id", "name email role");
    res.json(complaint);
  } catch (err) {
    res.status(404).json({ error: "Complaint not found" });
  }
};

// Update status (for admin/volunteer)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, updated_at: new Date() },
      { new: true }
    );
    res.json(complaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
