const express = require("express");
const cors = require("cors");
const cronJob = require("./cronJob");
const dotenv = require("dotenv");
dotenv.config();
const PORT = 8080;

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html"); // Path to your HTML file
});

// Route registration
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/lesson", lessonRoutes);
app.use('/api/feedback', feedbackRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
