const Comment = require('../models/Comment');

// Add comment
exports.addComment = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;

    const comment = new Comment({ user_id: userId, complaint_id: complaintId, content });
    await comment.save();

    res.json({ message: 'Comment added', comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get comments for complaint
exports.getComments = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const comments = await Comment.find({ complaint_id: complaintId })
      .populate('user_id', 'name');

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
