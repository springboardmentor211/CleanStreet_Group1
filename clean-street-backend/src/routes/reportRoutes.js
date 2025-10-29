const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");

// 🔹 Complaint-related reports
router.get("/complaints/trends", reportController.getComplaintTrends);
router.get("/complaints/categories", reportController.getCategoryDistribution);
router.get("/complaints/top-areas", reportController.getTopAreas);
router.get("/complaints/map-points", reportController.getComplaintLocations);

// 🔹 Votes & Feedback
router.get("/votes/top-upvoted", reportController.getTopUpvoted);
router.get("/votes/top-downvoted", reportController.getTopDownvoted);

// 🔹 User Activity
router.get("/users/top-contributors", reportController.getTopContributors);

// 🔹 Resolution Metrics
router.get("/resolution/stats", reportController.getResolutionStats);

// 🔹 Summary endpoint
router.get("/summary", reportController.getSummary);

module.exports = router;
