
const express = require("express");
const router = express.Router();
const voteCtrl = require("../controllers/voteController");
const auth = require("../middleware/authMiddleware");

router.post("/:complaintId", auth, voteCtrl.voteComplaint);
router.get("/:complaintId", voteCtrl.getVotes);

module.exports = router;   // ✅ must export router

