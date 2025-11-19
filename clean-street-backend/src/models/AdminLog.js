const mongoose = require("mongoose");

const AdminLogSchema = new mongoose.Schema({
  action: String,
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AdminLog", AdminLogSchema);
