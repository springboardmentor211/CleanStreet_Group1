const Complaint = require("../models/Complaint");
const Vote = require("../models/Vote");

// Create complaint
exports.createComplaint = async (req, res) => {
  try {
    let location_coords = null;
    if (req.body.location_coords) {
      try {
        location_coords = JSON.parse(req.body.location_coords);
      } catch (err) {
        console.error("Invalid location_coords format", err);
      }
    }
    const photos = req.files ? req.files.map((f) => f.buffer) : [];

    const complaint = await Complaint.create({
      user_id: req.user.id,
      title: req.body.title,
      description: req.body.description,
      photos,
      location_coords,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      priority: req.body.priority,
      phone: req.body.phone,
      landmark: req.body.landmark,
      assigned_to: req.body.assigned_to,
    });

    res.json(complaint);
  } catch (err) {
    console.error("Complaint creation error:", err);
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

    if (!complaint) {
      return res.status(404).json({ error: "Complaint not found" });
    }

    // Count votes
    const upvotes = await Vote.countDocuments({ complaint_id: complaint._id, vote_type: "upvote" });
    const downvotes = await Vote.countDocuments({ complaint_id: complaint._id, vote_type: "downvote" });

    res.json({
      ...complaint.toObject(),
      votes: { upvotes, downvotes }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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

// Get a specific photo by complaint ID and index
exports.getComplaintPhoto = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint || !complaint.photos || complaint.photos.length === 0) {
      return res.status(404).send("Photo not found");
    }

    const index = req.params.index || 0;
    const photo = complaint.photos[index];
    if (!photo) return res.status(404).send("Photo not found");

    res.set("Content-Type", "image/png");
    res.send(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete complaint (admin only)
// Delete complaint (Admin only for safety)
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    // Optional: check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Only admins can delete complaints" });
    }

    await complaint.deleteOne();
    res.json({ msg: "Complaint deleted successfully" });
  } catch (err) {
    console.error("Delete complaint error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
