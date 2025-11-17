// server/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/dbconfig.js");

// Route files
const authRoutes = require("./routes/authRoutes");
const groundRoutes = require("./routes/groundRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ---------- Middleware ----------
app.use(
  cors({
    origin: "*",          // later: change this to your React URL
    credentials: false,
  })
);

app.use(express.json()); // parse JSON body
app.use(express.urlencoded({ extended: true })); // parse form data

// ---------- Test route ----------
app.get("/", (req, res) => {
  res.send("CricBook API is running...");
});

// ---------- API routes ----------
app.use("/api/auth", authRoutes);        // /api/auth/register, /api/auth/login, /api/auth/me
app.use("/api/grounds", groundRoutes);   // /api/grounds/...
app.use("/api/bookings", bookingRoutes); // /api/bookings/...

// ---------- 404 handler ----------
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// ---------- Global error handler ----------
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
