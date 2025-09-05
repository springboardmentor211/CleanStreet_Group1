const mongoose = require("mongoose");

const ComplaintSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // who reported
    title: { type: String, required: true },
    description: { type: String, required: true },
    photo: { type: String }, // file path for uploaded photo
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String },
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // volunteer/admin assigned
    status: {
      type: String,
      enum: ["received", "in_review", "resolved"],
      default: "received",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", ComplaintSchema);
