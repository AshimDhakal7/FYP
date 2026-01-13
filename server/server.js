import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbconfig.js";

import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

dotenv.config();
connectDB();

const app = express(); // ✅ REQUIRED: app must be created first

app.use("/api/bookings", bookingRoutes);

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => res.send("✅ CricBook API is running"));

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
