const PDFDocument = require("pdfkit");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Vote = require("../models/Vote");

// Helper to fetch data
const fetchReportData = async () => {
  const totalComplaints = await Complaint.countDocuments();
  const pending = await Complaint.countDocuments({ status: "received" });
  const inProgress = await Complaint.countDocuments({ status: "in_progress" });
  const resolved = await Complaint.countDocuments({ status: "resolved" });
  const users = await User.find().lean();
  const topContributors = await Complaint.aggregate([
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
    { $project: { _id: 0, name: "$user.name", complaints: 1 } }
  ]);
  const votes = await Vote.find().lean();
  const complaints = await Complaint.find().lean();
  return { totalComplaints, pending, inProgress, resolved, users, topContributors, votes, complaints };
};

// Generate PDF
exports.generateAdminPDF = async (req, res) => {
  try {
    const data = await fetchReportData();
    const doc = new PDFDocument({ margin: 30 });
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));

    // Title
    doc.fontSize(22).text("Admin Full Report", { align: "center" });
    doc.moveDown();

    // Summary Metrics
    doc.fontSize(14).text("📊 Summary Metrics:");
    doc.fontSize(12)
       .text(`Total Complaints: ${data.totalComplaints}`)
       .text(`Pending: ${data.pending}`)
       .text(`In Progress: ${data.inProgress}`)
       .text(`Resolved: ${data.resolved}`)
       .text(`Total Users: ${data.users.length}`)
       .text(`Total Votes: ${data.votes.length}`);
    doc.moveDown();

    // Top Contributors
    doc.fontSize(14).text("🏆 Top Contributors:");
    data.topContributors.forEach((u, i) => {
      doc.fontSize(12).text(`${i + 1}. ${u.name} — ${u.complaints} complaints`);
    });
    doc.moveDown();

    // Top 10 Complaints
    doc.fontSize(14).text("📄 Top 10 Complaints (by created date):");
    data.complaints
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 10)
      .forEach((c, i) => {
        doc.fontSize(10).text(`${i + 1}. ${c.title} [${c.status}] - ${c.category} - ${c.ward}`);
      });

    // Footer
    doc.moveDown();
    doc.fontSize(10).text(`Report generated on: ${new Date().toLocaleString()}`, { align: "right" });

    doc.end();

    // Send PDF
    const pdfBuffer = await new Promise((resolve) => {
      doc.on("end", () => resolve(Buffer.concat(buffers)));
    });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=Admin_Full_Report.pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
