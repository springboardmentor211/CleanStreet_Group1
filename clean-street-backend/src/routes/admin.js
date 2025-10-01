const express = require("express");
const router = express.Router();
const { adminOverview, getUsers, getAllComplaints, getReports, generateAdminReport } = require("../controllers/adminController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
// const { generateAdminReport } = require("../controllers/adminController");
// Users
router.get("/users", authMiddleware, isAdmin, getUsers);

// Complaints
router.get("/complaints", authMiddleware, isAdmin, getAllComplaints);

// Reports (logs)
router.get("/reports", authMiddleware, isAdmin, getReports);

// Admin dashboard stats
router.get("/overview", authMiddleware, isAdmin, adminOverview);
router.get("/generate-report", authMiddleware, isAdmin, generateAdminReport);

module.exports = router;
