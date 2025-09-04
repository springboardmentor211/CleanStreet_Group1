const express = require("express");
const {
  createComplaint,
  getComplaints,
  getComplaint,
  updateComplaintStatus,
} = require("../controllers/complaintController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, createComplaint);
router.get("/", getComplaints);
router.get("/:id", getComplaint);
router.patch("/:id/status", auth, updateComplaintStatus);

module.exports = router;
