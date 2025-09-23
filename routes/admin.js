const express = require("express");
const router = express.Router();
const adminCtrl = require("../controllers/adminController");
const adminMiddleware = require("../middleware/adminMiddleware");

// Complaints
router.get("/complaints", adminMiddleware, adminCtrl.getAllComplaints);

// Reports
router.get("/reports/csv", adminMiddleware, adminCtrl.generateCSV);
router.get("/reports/pdf", adminMiddleware, adminCtrl.generatePDF);

// Users
router.get("/users", adminMiddleware, adminCtrl.getAllUsers);
router.post("/users/:id/role", adminMiddleware, adminCtrl.updateUserRole);

module.exports = router;
