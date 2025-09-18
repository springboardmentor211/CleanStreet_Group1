const express = require("express");
const { voteComplaint } = require("../controllers/voteController");
const auth = require("../middleware/auth");

const router = express.Router();

// Cast or update a vote
router.post("/", auth, voteComplaint);

module.exports = router;
