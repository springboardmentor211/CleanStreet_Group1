const PDFDocument = require("pdfkit");
const Complaint = require("../models/Complaint");
const User = require("../models/User");
const Vote = require("../models/Vote");
const Comment = require("../models/Comment");

// Generate Admin Report PDF
exports.generateAdminReport = async (req, res) => {
  try {
    // Fetch data
    const totalComplaints = await Complaint.countDocuments();
    const pendingReview = await Complaint.countDocuments({ status: "received" });
    const inProgress = await Complaint.countDocuments({ status: "in_progress" });
    const resolved = await Complaint.countDocuments({ status: "resolved" });
    const activeUsers = await User.countDocuments();

    const complaints = await Complaint.find().lean();

    // PDF setup
    const doc = new PDFDocument({ margin: 30, size: "A4" });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=admin_report.pdf");
    doc.pipe(res);

    // Title
    doc.fontSize(20).text("Admin Report", { align: "center" });
    doc.moveDown();

    // Overview Section
    doc.fontSize(14).text("📊 System Overview", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12).list([
      `Total Complaints: ${totalComplaints}`,
      `Pending Review: ${pendingReview}`,
      `In Progress: ${inProgress}`,
      `Resolved: ${resolved}`,
      `Active Users: ${activeUsers}`,
    ]);
    doc.moveDown();

    // Complaints Table
    doc.fontSize(14).text("📑 Complaints Summary", { underline: true });
    doc.moveDown(0.5);

    complaints.slice(0, 20).forEach((c, i) => {
      doc.fontSize(11).text(
        `${i + 1}. ${c.title} | Status: ${c.status} | Description: ${c.description || "N/A"}`,
        { align: "left" }
      );
      doc.moveDown(0.3);
    });

    if (complaints.length > 20) {
      doc.text(`...and ${complaints.length - 20} more complaints`, {
        italic: true,
        align: "left",
      });
    }

    // Footer
    doc.moveDown(2);
    doc.fontSize(10).text(`Generated on ${new Date().toLocaleString()}`, {
      align: "right",
      opacity: 0.6,
    });

    // Finalize
    doc.end();
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ error: "Failed to generate report" });
  }
};
