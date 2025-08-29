const express = require("express");
const Complaint = require("../models/Complaint");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

/* ============================
✅ User Routes
============================ */

// Create new complaint
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, location } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ msg: "Please provide all fields" });
    }

    const newComplaint = new Complaint({
      title,
      description,
      location,
      user: req.user.id,
    });

    const complaint = await newComplaint.save();
    res.json(complaint);
  } catch (err) {
    console.error("❌ Create complaint error:", err.message);
    res.status(500).send("Server Error");
  }
});

// Get all complaints for logged-in user
router.get("/my-complaints", authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user.id });
    res.json(complaints);
  } catch (err) {
    console.error("❌ Fetch complaints error:", err.message);
    res.status(500).send("Server Error");
  }
});

// Update complaint by ID (user can only update their own complaint)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    // Ensure only the complaint owner can update
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
    console.error("❌ Update complaint error:", err.message);
    res.status(500).send("Server Error");
  }
});

/* ============================
   ✅ Admin Routes
============================ */

// Get all complaints (admin only)
router.get("/admin", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user", "name email");
    res.json(complaints);
  } catch (err) {
    console.error("❌ Admin fetch complaints error:", err.message);
    res.status(500).send("Server Error");
  }
});

// Update complaint (admin can update status or reassign)
router.put("/admin/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, assignedTo } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    if (status) complaint.status = status;
    if (assignedTo) complaint.assignedTo = assignedTo;

    await complaint.save();
    res.json({ msg: "Complaint updated by admin", complaint });
  } catch (err) {
    console.error("❌ Admin update complaint error:", err.message);
    res.status(500).send("Server Error");
  }
});

// Delete complaint (admin only)
router.delete("/admin/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    await complaint.deleteOne();
    res.json({ msg: "Complaint deleted by admin" });
  } catch (err) {
    console.error("❌ Admin delete complaint error:", err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
