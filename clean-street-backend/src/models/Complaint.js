const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  description: String,
  photo: String,
  location_coords: {
    lat: Number,
    lng: Number
  },
  address: String,
  assigned_to: String,
  status: { type: String, enum: ["received", "in_review", "resolved"], default: "received" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Complaint", ComplaintSchema);
