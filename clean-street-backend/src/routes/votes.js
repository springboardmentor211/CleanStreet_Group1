const express = require("express");
const { voteComplaint } = require("../controllers/voteController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, voteComplaint);

module.exports = router;
