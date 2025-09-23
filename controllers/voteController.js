const Vote = require('../models/Vote');

// Add or update a vote
exports.voteComplaint = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { vote_type } = req.body;
    const userId = req.user._id;

    let vote = await Vote.findOne({ user_id: userId, complaint_id: complaintId });

    if (vote) {
      vote.vote_type = vote_type; // update
    } else {
      vote = new Vote({ user_id: userId, complaint_id: complaintId, vote_type });
    }
    await vote.save();

    res.json({ message: 'Vote recorded', vote });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get total votes for complaint
exports.getVotes = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const votes = await Vote.find({ complaint_id: complaintId });

    const counts = {
      upvotes: votes.filter(v => v.vote_type === 'upvote').length,
      downvotes: votes.filter(v => v.vote_type === 'downvote').length
    };

    res.json(counts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
