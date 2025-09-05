const Complaint = require("../models/Complaint");

// Update complaint
const updateComplaintByAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // Example: { status: "resolved", assignedTo: "volunteerId" }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      updates,
      { new: true }
    ).populate("user", "name email");

    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    res.json({ msg: "Complaint updated successfully", complaint });
  } catch (err) {
    res.status(500).json({ msg: "Error updating complaint", error: err.message });
  }
};

//  Delete complaint
const deleteComplaintByAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const complaint = await Complaint.findByIdAndDelete(id);

    if (!complaint) {
      return res.status(404).json({ msg: "Complaint not found" });
    }

    res.json({ msg: "Complaint deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting complaint", error: err.message });
  }
};

module.exports = {
  updateComplaintByAdmin,
  deleteComplaintByAdmin
};
