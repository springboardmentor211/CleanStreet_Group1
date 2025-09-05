const express = require("express");
const router = express.Router();

const complaintController = require("../controllers/complaintController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/uploadMiddleware");

//  Debug logs (moved AFTER imports)
console.log("authMiddleware:", typeof authMiddleware);
console.log("upload:", typeof upload);
console.log("createComplaint:", typeof complaintController.createComplaint);

/* ============================
   User Routes
============================ */

// Create new complaint (with photo + auto-assign volunteer)
router.post(
  "/",
  authMiddleware,
  upload.single("photo"), // handles image upload
  complaintController.createComplaint
);

// Get all complaints for logged-in user
router.get("/my-complaints", authMiddleware, complaintController.getMyComplaints);

// Update complaint by ID (only owner can update their own complaint)
router.put("/:id", authMiddleware, complaintController.updateOwnComplaint);

/* ============================
   Public / General Routes
============================ */

// Get all complaints (filter by status/location)
router.get("/", authMiddleware, complaintController.getComplaints);

// Get single complaint by ID
router.get("/:id", authMiddleware, complaintController.getComplaintById);

/* ============================
   Admin / Volunteer Routes
============================ */

// Get all complaints (admin only, includes user details)
router.get(
  "/admin/all",
  authMiddleware,
  adminMiddleware,
  complaintController.getAllComplaints
);

// Update complaint (admin/volunteer can update status or reassign)
router.put(
  "/admin/:id",
  authMiddleware,
  adminMiddleware,
  complaintController.updateComplaintStatus
);

// Delete complaint (admin only)
router.delete(
  "/admin/:id",
  authMiddleware,
  adminMiddleware,
  complaintController.deleteComplaint
);

module.exports = router;
