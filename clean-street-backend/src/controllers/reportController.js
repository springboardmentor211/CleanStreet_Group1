const Complaint = require("../models/Complaint");
const Vote = require("../models/Vote");
const User = require("../models/User");

// Helper: build filters
const buildFilters = (query) => {
  const filters = {};

  // Date range
  if (query.start || query.end) {
    filters.createdAt = {};
    if (query.start) filters.createdAt.$gte = new Date(query.start);
    if (query.end) {
      const end = new Date(query.end);
      end.setHours(23, 59, 59, 999);
      filters.createdAt.$lte = end;
    }
  }

  // Ward
  if (query.ward) {
    filters.ward = query.ward;
  }

  // Category
  if (query.category) {
    filters.category = query.category;
  }

  return filters;
};

// 📊 Summary
exports.getSummary = async (req, res) => {
  try {
    const filters = buildFilters(req.query);
    const total = await Complaint.countDocuments(filters);
    const received = await Complaint.countDocuments({ ...filters, status: "received" });
    const inProgress = await Complaint.countDocuments({ ...filters, status: "in_progress" });
    const resolved = await Complaint.countDocuments({ ...filters, status: "resolved" });
    res.json({ total, received, inProgress, resolved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Categories
exports.getCategoryStats = async (req, res) => {
  try {
    const filters = buildFilters(req.query);
    const stats = await Complaint.aggregate([
      { $match: filters },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Top Areas
exports.getTopAreas = async (req, res) => {
  try {
    const filters = buildFilters(req.query);
    const stats = await Complaint.aggregate([
      { $match: filters },
      { $group: { _id: "$ward", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📈 Trends (daily, weekly, monthly)
exports.getTrends = async (req, res) => {
  try {
    const filters = buildFilters(req.query);
    const period = req.query.period || "daily";

    let groupId;
    if (period === "weekly") groupId = { $isoWeek: "$createdAt" };
    else if (period === "monthly") groupId = { $month: "$createdAt" };
    else groupId = { $dayOfMonth: "$createdAt" };

    const stats = await Complaint.aggregate([
      { $match: filters },
      { $group: { _id: groupId, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👍 Top Upvoted Complaints
exports.getTopUpvoted = async (req, res) => {
  try {
    const filters = buildFilters(req.query);
    const complaints = await Complaint.aggregate([
      { $match: filters },
      {
        $lookup: {
          from: "votes",
          localField: "_id",
          foreignField: "complaint_id",
          as: "votes"
        }
      },
      {
        $project: {
          description: 1,
          upvotes: {
            $size: {
              $filter: { input: "$votes", as: "v", cond: { $eq: ["$$v.vote_type", "upvote"] } }
            }
          }
        }
      },
      { $sort: { upvotes: -1 } },
      { $limit: 5 }
    ]);
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👎 Top Downvoted Complaints
exports.getTopDownvoted = async (req, res) => {
  try {
    const filters = buildFilters(req.query);
    const complaints = await Complaint.aggregate([
      { $match: filters },
      {
        $lookup: {
          from: "votes",
          localField: "_id",
          foreignField: "complaint_id",
          as: "votes"
        }
      },
      {
        $project: {
          description: 1,
          downvotes: {
            $size: {
              $filter: { input: "$votes", as: "v", cond: { $eq: ["$$v.vote_type", "downvote"] } }
            }
          }
        }
      },
      { $sort: { downvotes: -1 } },
      { $limit: 5 }
    ]);
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 👥 Top Contributors
exports.getTopContributors = async (req, res) => {
  try {
    const stats = await Complaint.aggregate([
      { $group: { _id: "$user_id", complaints: { $sum: 1 } } },
      { $sort: { complaints: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      { $project: { _id: 0, name: "$user.name", email: "$user.email", complaints: 1 } }
    ]);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ⏱ Resolution Stats
exports.getResolutionStats = async (req, res) => {
  try {
    const filters = buildFilters(req.query);
    const resolved = await Complaint.countDocuments({ ...filters, status: "resolved" });
    const pending = await Complaint.countDocuments({ ...filters, status: { $ne: "resolved" } });

    res.json({ resolved, pending });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
