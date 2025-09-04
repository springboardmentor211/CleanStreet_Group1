const Comment = require("../models/Comment");

exports.addComment = async (req, res) => {
  try {
    const { complaint_id, content } = req.body;

    const comment = await Comment.create({
      user_id: req.user.id,
      complaint_id,
      content,
    });

    res.json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ complaint_id: req.params.id })
      .populate("user_id", "name email");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
