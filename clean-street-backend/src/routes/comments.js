const express = require("express");
const { addComment, getComments } = require("../controllers/commentController");
const auth = require("../middleware/auth");
const router = express.Router();

router.post("/", auth, addComment);
router.get("/:id", getComments);

module.exports = router;
