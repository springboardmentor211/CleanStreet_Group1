const Vote = require("../models/Vote");

exports.voteComplaint = async (req, res) => {
  try {
    const { complaint_id, vote_type } = req.body;

    // Check if user already voted
    let vote = await Vote.findOne({ user_id: req.user.id, complaint_id });

    if (vote) {
      vote.vote_type = vote_type;
      await vote.save();
    } else {
      vote = await Vote.create({
        user_id: req.user.id,
        complaint_id,
        vote_type,
      });
    }

    res.json(vote);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
