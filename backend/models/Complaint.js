const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  photo: { type: String },
  locationCoords: { type: String },
  address: { type: String },
  assignedTo: { type: String },
  status: { type: String, enum: ["received", "in_review", "resolved"], default: "received" }
}, { timestamps: true });

module.exports = mongoose.model("Complaint", ComplaintSchema);
