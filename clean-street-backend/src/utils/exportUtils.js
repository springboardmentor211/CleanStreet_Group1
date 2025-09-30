const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");
const { Parser } = require("json2csv");

exports.exportToExcel = async (data) => {
  const workbook = new ExcelJS.Workbook();
  const ws = workbook.addWorksheet("Summary");

  ws.addRow(["Section", "Count"]);
  ws.addRow(["Complaints", data.complaints.length]);
  ws.addRow(["Users", data.users.length]);
  ws.addRow(["Votes", data.votes.length]);
  ws.addRow(["Comments", data.comments.length]);

  // Add complaints sheet
  const sheet2 = workbook.addWorksheet("Complaints");
  sheet2.columns = [
    { header: "ID", key: "id", width: 24 },
    { header: "Title", key: "title", width: 30 },
    { header: "Status", key: "status", width: 12 },
    { header: "Category", key: "category", width: 15 },
    { header: "Ward", key: "ward", width: 15 },
    { header: "Created At", key: "created_at", width: 20 }
  ];
  data.complaints.forEach(c => {
    sheet2.addRow({
      id: c._id,
      title: c.title,
      status: c.status,
      category: c.category || "",
      ward: c.ward || "",
      created_at: c.created_at
    });
  });

  return await workbook.xlsx.writeBuffer();
};

exports.exportToPDF = async (data) => {
  const doc = new PDFDocument({ margin: 30 });
  let buffers = [];
  doc.on("data", buffers.push.bind(buffers));
  doc.fontSize(20).text("CleanStreet Report", { align: "center" });
  doc.moveDown();
  doc.fontSize(12).text(`Complaints: ${data.complaints.length}`);
  doc.text(`Users: ${data.users.length}`);
  doc.text(`Votes: ${data.votes.length}`);
  doc.text(`Comments: ${data.comments.length}`);
  doc.moveDown();
  doc.fontSize(14).text("Top 10 Complaints (titles):");
  data.complaints.slice(0, 10).forEach((c, i) => {
    doc.fontSize(10).text(`${i + 1}. ${c.title}`);
  });
  doc.end();

  return new Promise((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });
  });
};

exports.exportToCSV = async (data) => {
  const parser = new Parser({ fields: ["_id", "title", "status", "category", "ward", "created_at"] });
  return parser.parse(data.complaints);
};
