import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbconfig.js";

import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import groundRoutes from "./routes/groundRoutes.js";

dotenv.config();

// Connect DB (your dbconfig.js should handle mongoose.connect)
await connectDB();

const app = express();

// ---- Middleware ----
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

// ---- Health check ----
app.get("/", (req, res) => res.send("✅ CricBook API is running"));

// ---- Routes ----
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/grounds", groundRoutes);

// ---- Start server ----
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Server running: http://localhost:${PORT}`));