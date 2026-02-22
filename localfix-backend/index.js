const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* ================= MODELS ================= */
const User = require("./models/User");
const Issue = require("./models/Issue");

const app = express();

/* ================= MIDDLEWARE ================= */

// Allow all origins (important for deployment)
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= UPLOAD FOLDER SETUP ================= */
const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

app.use("/uploads", express.static(uploadPath));

/* ================= MONGODB CONNECTION ================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

/* ================= MULTER CONFIG ================= */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/* ======================================================
                        USER AUTH
====================================================== */

// SIGNUP
app.post("/auth/signup", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ message: "All fields required" });

  try {
    const existingUser = await User.findOne({ username });

    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const newUser = new User({ username, password });
    await newUser.save();

    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      message: "Login successful",
      user: {
        id: user._id.toString(),
        username: user.username,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ======================================================
                        ISSUE APIs
====================================================== */

// CREATE ISSUE
app.post("/issues", upload.single("image"), async (req, res) => {
  try {
    const newIssue = new Issue({
      title: req.body.title,
      description: req.body.description,
      location: req.body.location,
      latitude: req.body.latitude ? Number(req.body.latitude) : null,
      longitude: req.body.longitude ? Number(req.body.longitude) : null,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      userId: req.body.userId,
      username: req.body.username,
      status: "Pending",
    });

    const savedIssue = await newIssue.save();
    res.status(201).json(savedIssue);
  } catch (err) {
    console.error("❌ Error creating issue:", err);
    res.status(500).json({ message: "Failed to submit issue" });
  }
});

// GET ALL ISSUES (ADMIN)
app.get("/issues", async (req, res) => {
  try {
    const issues = await Issue.find().sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET ISSUES BY USER
app.get("/issues/user/:userId", async (req, res) => {
  try {
    const issues = await Issue.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE STATUS
app.put("/issues/:id/status", async (req, res) => {
  try {
    const updated = await Issue.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Status update failed" });
  }
});

// DELETE ISSUE
app.delete("/issues/:id", async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue)
      return res.status(404).json({ message: "Issue not found" });

    if (issue.image) {
      const imagePath = path.join(
        __dirname,
        issue.image.replace("/uploads/", "uploads/")
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
        console.log("🗑 Image deleted:", imagePath);
      }
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.json({ message: "Issue deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

/* ======================================================
                        SERVER
====================================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});