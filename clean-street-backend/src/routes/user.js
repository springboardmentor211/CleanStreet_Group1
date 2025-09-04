const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const { getProfile, updateProfile, uploadProfilePhoto, getProfilePhoto } = require("../controllers/userController");

// ✅ Use Multer memory storage (not disk)
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.post("/profile/photo", auth, upload.single("photo"), uploadProfilePhoto);
router.get("/profile/photo/:id", getProfilePhoto);

module.exports = router;
