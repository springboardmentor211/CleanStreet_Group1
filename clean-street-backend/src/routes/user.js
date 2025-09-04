const express = require("express");
const router = express.Router();
const multer = require("multer");
const auth = require("../middleware/auth");
const { getProfile, updateProfile, uploadProfilePhoto, getProfilePhoto } = require("../controllers/userController");

// ✅ Use Multer memory storage (not disk)
const storage = multer.memoryStorage();
const upload = multer({ storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPG and PNG are allowed"));
    }
    cb(null, true);
  } });

router.get("/profile", auth, getProfile);
router.put("/profile", auth, updateProfile);
router.post("/profile/photo", auth, upload.single("photo"), uploadProfilePhoto);
router.get("/profile/photo/:id", getProfilePhoto);

module.exports = router;
