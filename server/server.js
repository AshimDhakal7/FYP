
// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/dbconfig.js";

// import authRoutes from "./routes/authRoutes.js";
// import bookingRoutes from "./routes/bookingRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import groundRoutes from "./routes/groundRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";
// import dashboardRoutes from "./routes/dashboardRoutes.js";

// import reportRoutes from "./routes/reportRoutes.js";
// import adminRoutes from "./routes/adminRoutes.js";

// import notificationRoutes from "./routes/notificationRoutes.js";
// // 🔥 Load env FIRST
// dotenv.config();

// // 🔥 Connect DB
// await connectDB();

// const app = express();

// // ---- Middleware ----
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:3000"],
//     credentials: true,
//   })
// );

// app.use(express.json());

// //  Static 
// app.use("/uploads", express.static("uploads"));

// //  Health 
// app.get("/", (req, res) => {
//   res.send("✅ CricBook API is running");
// });

// //  Routes 
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/grounds", groundRoutes);
// app.use("/api/dashboard", dashboardRoutes);

// // PAYMENT ROUTE 
// app.use("/api/payment", paymentRoutes);

// //Download report|owner
// app.use("/api/reports", reportRoutes);

// // Admin routes
// app.use("/api/admin", adminRoutes);

// //Notification
// app.use("/api/notifications", notificationRoutes);

// // ---- Start ----
// const PORT = process.env.PORT || 5001;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running: http://localhost:${PORT}`);
// });


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbconfig.js";

import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import groundRoutes from "./routes/groundRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

await connectDB();

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URL_WWW,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/reviews", reviewRoutes);
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("✅ CricBook API is running");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    ok: true,
    service: "CricBook API",
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/grounds", groundRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((err, req, res, next) => {
  if (err?.message?.startsWith("CORS blocked")) {
    return res.status(403).json({ message: err.message });
  }

  console.error("SERVER ERROR:", err);
  return res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});