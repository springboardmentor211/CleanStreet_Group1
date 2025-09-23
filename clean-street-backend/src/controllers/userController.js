const User = require("../models/User");

// Helper to convert photo to Base64
const formatUser = (user) => {
  if (!user) return null;
  const obj = user.toObject();
  delete obj.password;

  if (obj.profilePhoto && obj.profilePhoto.data) {
    obj.profilePhoto = {
      contentType: obj.profilePhoto.contentType,
      base64: obj.profilePhoto.data.toString("base64")
    };
  } else {
    obj.profilePhoto = null;
  }
  return obj;
};

// Get all users (for admin)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    const formatted = users.map((u) => formatUser(u));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get logged-in user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(formatUser(user));
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update logged-in user profile
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;

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
          name: updates.name,
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
    );

    res.json(formatUser(user));
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
          data: req.file.buffer,
          contentType: req.file.mimetype
        }
      },
      { new: true }
    );

    res.json({ msg: "Profile photo saved in DB", user: formatUser(user) });
  } catch (err) {
    if (err.message.includes("File too large")) {
      return res.status(400).json({ error: "File size must be under 2MB" });
    }
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Serve profile photo (legacy fallback)
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

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
