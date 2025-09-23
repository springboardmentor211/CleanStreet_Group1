const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  complaint_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Comment', commentSchema);
