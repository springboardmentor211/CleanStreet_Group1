const Complaint = require("../models/Complaint");
const User = require("../models/User");
const { Parser } = require("json2csv");
const PDFDocument = require("pdfkit");

// Get all complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user_id", "name email");
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Generate CSV Report
exports.generateCSV = async (req, res) => {
  try {
    const complaints = await Complaint.find().lean();
    const fields = ["title", "description", "status", "created_at"];
    const parser = new Parser({ fields });
    const csv = parser.parse(complaints);

    res.header("Content-Type", "text/csv");
    res.attachment("complaints_report.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Generate PDF Report
exports.generatePDF = async (req, res) => {
  try {
    const complaints = await Complaint.find().lean();
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=complaints_report.pdf");
    doc.pipe(res);

    doc.fontSize(18).text("Complaints Report", { align: "center" });
    complaints.forEach(c => {
      doc.fontSize(12).text(`Title: ${c.title}`);
      doc.text(`Status: ${c.status}`);
      doc.text(`Created: ${c.created_at}`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
