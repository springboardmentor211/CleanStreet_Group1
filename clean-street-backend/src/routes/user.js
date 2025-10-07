const express = require("express");
const router = express.Router();
const multer = require("multer");
const { authMiddleware, isAdmin } = require("../middleware/authMiddleware"); // ✅ fix here
const {
  getUsers,
  getProfile,
  updateProfile,
  uploadProfilePhoto,
  getProfilePhoto,
  deleteUser
} = require("../controllers/userController");

// ✅ Use Multer memory storage (not disk)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG and PNG are allowed"));
    }
    cb(null, true);
  }
});

// 🔹 Routes
// Admin: Get all users
router.get("/all", authMiddleware, isAdmin, getUsers);  // ✅ Admin-only

// User profile
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

// Profile photo upload
router.post("/profile/photo", authMiddleware, upload.single("photo"), uploadProfilePhoto);

// Fetch profile photo
router.get("/profile/photo/:id", getProfilePhoto);

// Delete user (Admin only)
router.delete("/:id", authMiddleware, isAdmin, deleteUser);

module.exports = router;
