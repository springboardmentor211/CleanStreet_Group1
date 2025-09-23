const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  complaint_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
  vote_type: { type: String, enum: ['upvote', 'downvote'], required: true }
});

module.exports = mongoose.model('Vote', voteSchema);
