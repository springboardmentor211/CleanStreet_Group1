const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  complaint_id: { type: mongoose.Schema.Types.ObjectId, ref: "Complaint" },
  content: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Comment", CommentSchema);
