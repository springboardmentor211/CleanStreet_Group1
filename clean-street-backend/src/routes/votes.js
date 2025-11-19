const express = require("express");
const { voteComplaint } = require("../controllers/voteController");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

// Cast or update a vote
router.post("/", authMiddleware, voteComplaint);

module.exports = router;
