const User = require("../models/User");

// ✅ Get logged-in user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update logged-in user profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    // Prevent updating email to duplicate
    if (updates.email) {
      const existing = await User.findOne({ email: updates.email });
      if (existing && existing._id.toString() !== req.user.id) {
        return res.status(400).json({ error: "Email already in use" });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          name: updates.name, // ✅ match your schema
          phone: updates.phone,
          bio: updates.bio,
          addressLine1: updates.addressLine1,
          addressLine2: updates.addressLine2,
          state: updates.state,
          district: updates.district,
          pincode: updates.pincode
        }
      },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Upload profile photo directly into MongoDB
exports.uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        profilePhoto: {
          data: req.file.buffer,           // store binary
          contentType: req.file.mimetype   // store type
        }
      },
      { new: true }
    ).select("-password");

    res.json({ msg: "Profile photo saved in DB", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Serve profile photo
exports.getProfilePhoto = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("profilePhoto");
    if (!user || !user.profilePhoto || !user.profilePhoto.data) {
      return res.status(404).json({ error: "No profile photo found" });
    }

    res.contentType(user.profilePhoto.contentType);
    res.send(user.profilePhoto.data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
