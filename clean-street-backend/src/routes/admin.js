const express = require("express");
const router = express.Router();
const { adminOverview } = require("../controllers/adminController");
const authMiddleware = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const { getUsers } = require("../controllers/userController");
const { getReports } = require("../controllers/reportController");

router.get("/overview", authMiddleware, isAdmin, adminOverview);
router.get("/users", authMiddleware, isAdmin, getUsers);
router.get("/reports", authMiddleware, isAdmin, getReports);

module.exports = router;
