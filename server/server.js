import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbconfig.js";

import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express(); // ✅ MUST come before app.use

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => res.send("✅ CricBook API is running"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes); // ✅ mount after app created

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));
