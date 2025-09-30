const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  category: String,
  ward: String,
  location_coords: {
    lat: Number,
    lng: Number
  },
  photos:[Buffer],
  address: String,
  city: String,
  state: String,
  pincode: String,
  priority: String,
  phone: String,
  landmark: String,
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["received", "in_review", "resolved"], default: "received" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
