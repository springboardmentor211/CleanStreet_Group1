const express = require("express");
const router = express.Router();
const commentCtrl = require("../controllers/commentController");
const auth = require("../middleware/authMiddleware");

router.post("/:complaintId", auth, commentCtrl.addComment);
router.get("/:complaintId", commentCtrl.getComments);

module.exports = router;   // ✅ must export router
