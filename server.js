const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

dotenv.config();
connectDB();

const app = express();

// ==================== MIDDLEWARE ==================== //
app.use(express.json());
app.use(cors());

// Ensure uploads/complaints directory exists
const uploadPath = path.join(__dirname, "uploads/complaints");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Serve uploaded images (complaint photos)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==================== ROUTES ==================== //
// Auth routes
app.use("/api/auth", require("./routes/auth"));

// Complaint routes
app.use("/api/complaints", require("./routes/complaints"));

// Votes (Milestone 3)
app.use("/api/votes", require("./routes/votes"));

// Comments (Milestone 3)
app.use("/api/comments", require("./routes/comments"));

// Admin routes (Milestone 4)
app.use("/api/admin", require("./routes/admin"));

// ==================== DEFAULT ==================== //
app.get("/", (req, res) => {
  res.send("CleanStreet API is running 🚀");
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ msg: "Route not found" });
});

// ==================== START SERVER ==================== //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
