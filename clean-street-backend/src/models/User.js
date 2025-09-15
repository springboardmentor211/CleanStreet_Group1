const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: String,
  location: String,
  role: { type: String, enum: ["user", "volunteer", "admin"], default: "user" },
  phone: String,
  bio: String,
  addressLine1: String,
  addressLine2: String,
  state: String,
  district: String,
  pincode: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  profilePhoto: {
    data: Buffer,      // binary image data
    contentType: String // "image/png" or "image/jpeg"
  }
  
});

module.exports = mongoose.model("User", UserSchema);
