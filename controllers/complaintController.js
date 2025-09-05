const Complaint = require("../models/Complaint");
const User = require("../models/User");

/* ============================
    Create Complaint
============================ */
exports.createComplaint = async (req, res) => {
  try {
    const { title, description, latitude, longitude, address } = req.body;

    if (!title || !description) {
      return res.status(400).json({ msg: "Title and description required" });
    }

    // Handle photo upload (multer saves file path)
    let photo = null;
    if (req.file) {
      photo = req.file.path;
    }

    // Auto-assign complaint to first volunteer (basic logic — can improve later)
    const volunteer = await User.findOne({ role: "volunteer" });

    const complaint = await Complaint.create({
      user: req.user.id,
      title,
      description,
      photo,
      location: { latitude, longitude, address },
      assignedTo: volunteer ? volunteer._id : null,
    });

    res.status(201).json({ msg: "Complaint submitted", complaint });
  } catch (err) {
    console.error(" Create complaint error:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ============================
   ✅ Get Complaints
============================ */
// Logged-in user's complaints
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id })
      .populate("assignedTo", "name email");
    res.json(complaints);
  } catch (err) {
    console.error(" Get my complaints error:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// All complaints with optional filters
exports.getComplaints = async (req, res) => {
  try {
    const { status, address } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (address) filter["location.address"] = { $regex: address, $options: "i" };

    const complaints = await Complaint.find(filter)
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    res.json(complaints);
  } catch (err) {
    console.error(" Get complaints error:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Single complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    res.json(complaint);
  } catch (err) {
    console.error(" Get complaint by ID error:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ============================
    Update Complaint
============================ */
// User updates their own complaint
exports.updateOwnComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });
    if (complaint.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    // Update fields
    complaint.title = req.body.title || complaint.title;
    complaint.description = req.body.description || complaint.description;
    complaint.location = req.body.location || complaint.location;

    const updatedComplaint = await complaint.save();
    res.json(updatedComplaint);
  } catch (err) {
    console.error(" Update own complaint error:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

// Admin/Volunteer updates status
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });

    if (status) complaint.status = status;
    if (assignedTo) complaint.assignedTo = assignedTo;

    await complaint.save();
    res.json({ msg: "Complaint updated", complaint });
  } catch (err) {
    console.error(" Update complaint status error:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ============================
    Admin Delete Complaint
============================ */
exports.deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ msg: "Complaint not found" });

    await complaint.deleteOne();
    res.json({ msg: "Complaint deleted" });
  } catch (err) {
    console.error(" Delete complaint error:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

/* ============================
    Admin Get All Complaints
============================ */
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate("user", "name email")
      .populate("assignedTo", "name email");

    res.json(complaints);
  } catch (err) {
    console.error(" Get all complaints error:", err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};
