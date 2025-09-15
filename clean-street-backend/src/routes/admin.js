const express = require("express");
const { getMetrics, logAction } = require("../controllers/adminController");
const auth = require("../middleware/auth");
const checkRole = require("../middleware/roles");
const router = express.Router();

router.get("/metrics", auth, checkRole("admin"), getMetrics);
router.post("/log", auth, checkRole("admin"), logAction);

module.exports = router;
