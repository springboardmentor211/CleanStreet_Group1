const express = require("express");
const router = express.Router();
const {
  getSummary,
  getCategoryDistribution,
  getTopAreas,
  getTrends,
  getTopUpvoted,
  getTopDownvoted,
  getTopContributors,
  getResolutionStats,
  getMapPoints,
  exportReport,
} = require("../controllers/reportController");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware");

// Protect all report routes (only admin)
router.use(authMiddleware, isAdmin);

// 🔹 Reports Overview
router.get("/summary", getSummary);

// 🔹 Complaint Analytics
router.get("/complaints/categories", getCategoryDistribution);
router.get("/complaints/top-areas", getTopAreas);
router.get("/complaints/trends", getTrends);
router.get("/complaints/map-points", getMapPoints);

// 🔹 Votes & Feedback
router.get("/votes/top-upvoted", getTopUpvoted);
router.get("/votes/top-downvoted", getTopDownvoted);

// 🔹 User Engagement
router.get("/users/top-contributors", getTopContributors);

// 🔹 Resolution
router.get("/resolution/stats", getResolutionStats);

// 🔹 Export (PDF, Excel, CSV)
router.get("/export/:format", exportReport);

module.exports = router;
