const express = require("express");
const multer = require("multer");
const {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaintStatus,
  getComplaintPhoto,
} = require("../controllers/complaintController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/", authMiddleware, upload.array("photos",5),createComplaint);
router.get("/", getComplaints);
router.get("/:id", getComplaint);
router.patch("/:id/status", authMiddleware, updateComplaintStatus);
router.get("/:id/photo/:index", getComplaintPhoto);
router.get("/:id/photo/:index", async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint || !complaint.photos || !complaint.photos[req.params.index]) {
      return res.status(404).send("Photo not found");
    }
    res.set("Content-Type", "image/png");
    res.send(complaint.photos[req.params.index]);
  } catch (err) {
    res.status(500).send("Error fetching photo");
  }
});



module.exports = router;
