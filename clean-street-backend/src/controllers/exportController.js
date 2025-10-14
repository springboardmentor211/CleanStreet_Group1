const Complaint = require("../models/Complaint");
const User = require("../models/User");
const PDFDocument = require("pdfkit");
const ExcelJS = require("exceljs");
const { Parser } = require("json2csv");

// 📄 Export as PDF
exports.exportPDF = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user_id", "name email");

    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=complaints-report.pdf");
    doc.pipe(res);

    doc.fontSize(18).text("CleanStreet Complaints Report", { align: "center" });
    doc.moveDown();

    complaints.forEach((c, i) => {
      doc.fontSize(12).text(`${i + 1}. ${c.description}`);
      doc.text(`   Category: ${c.category || "N/A"}`);
      doc.text(`   Status: ${c.status}`);
      doc.text(`   User: ${c.user_id?.name || "N/A"} (${c.user_id?.email || "N/A"})`);
      doc.moveDown();
    });

    doc.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📊 Export as Excel
exports.exportExcel = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user_id", "name email");

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Complaints");

    sheet.columns = [
      { header: "Description", key: "description", width: 30 },
      { header: "Category", key: "category", width: 15 },
      { header: "Status", key: "status", width: 15 },
      { header: "User", key: "user", width: 20 },
      { header: "Email", key: "email", width: 25 },
      { header: "Created At", key: "createdAt", width: 20 },
    ];

    complaints.forEach(c => {
      sheet.addRow({
        description: c.description,
        category: c.category || "N/A",
        status: c.status,
        user: c.user_id?.name || "N/A",
        email: c.user_id?.email || "N/A",
        createdAt: c.createdAt?.toISOString().split("T")[0] || "N/A",
      });
    });

    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    res.setHeader("Content-Disposition", "attachment; filename=complaints-report.xlsx");

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📑 Export as CSV
exports.exportCSV = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate("user_id", "name email");

    const data = complaints.map(c => ({
      description: c.description,
      category: c.category || "N/A",
      status: c.status,
      user: c.user_id?.name || "N/A",
      email: c.user_id?.email || "N/A",
      createdAt: c.createdAt?.toISOString().split("T")[0] || "N/A",
    }));

    const parser = new Parser({ fields: ["description", "category", "status", "user", "email", "createdAt"] });
    const csv = parser.parse(data);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=complaints-report.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
