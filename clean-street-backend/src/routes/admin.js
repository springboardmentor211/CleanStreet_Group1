const express = require("express");
const router = express.Router();
const { adminOverview, getUsers, getAllComplaints, getReports, generateAdminReport } = require("../controllers/adminController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");
const { generateAdminPDF } = require("../controllers/adminReportController");
// const { generateAdminReport } = require("../controllers/adminController");
// Users
router.get("/users", authMiddleware, isAdmin, getUsers);

// Complaints
router.get("/complaints", authMiddleware, isAdmin, getAllComplaints);

// Reports (logs)
router.get("/reports", authMiddleware, isAdmin, getReports);

// Admin dashboard stats
router.get("/overview", authMiddleware, isAdmin, adminOverview);
router.get("/reports/pdf", authMiddleware, isAdmin, generateAdminReport);


router.get("/reports/full-pdf", authMiddleware, isAdmin, generateAdminPDF);
module.exports = router;
