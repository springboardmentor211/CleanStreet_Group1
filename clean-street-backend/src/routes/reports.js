const express = require("express");
const router = express.Router();
const { generateAdminPDF } = require("../controllers/adminReportController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// Admin PDF report
router.get("/export/pdf", authMiddleware, isAdmin, generateAdminPDF);

module.exports = router;
