// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import connectDB from "./config/dbconfig.js";
// import path from "path";

// import authRoutes from "./routes/authRoutes.js";
// import bookingRoutes from "./routes/bookingRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import groundRoutes from "./routes/groundRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";

// import dashboardRoutes from "./routes/dashboardRoutes.js";

// dotenv.config();

// // Connect DB (your dbconfig.js should handle mongoose.connect)
// await connectDB();

// const app = express();
// app.use("/uploads", express.static("uploads"));

// // ---- Middleware ----
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:3000"],
//     credentials: true,
//   })
// );
// app.use(express.json());

// // ---- Health check ----
// app.get("/", (req, res) => res.send("✅ CricBook API is running"));

// // ---- Routes ----
// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/bookings", bookingRoutes);
// app.use("/api/grounds", groundRoutes);
// app.use("/api/dashboard", dashboardRoutes);


// app.use("/api/payment", paymentRoutes);
// // ---- Start server ----
// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`🚀 Server running: http://localhost:${PORT}`));


import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbconfig.js";

import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import groundRoutes from "./routes/groundRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

import reportRoutes from "./routes/reportRoutes.js";

// 🔥 Load env FIRST
dotenv.config();

// 🔥 Connect DB
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

//  Static 
app.use("/uploads", express.static("uploads"));

//  Health 
app.get("/", (req, res) => {
  res.send("✅ CricBook API is running");
});

//  Routes 
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/grounds", groundRoutes);
app.use("/api/dashboard", dashboardRoutes);

// PAYMENT ROUTE 
app.use("/api/payment", paymentRoutes);

//Download report|owner
app.use("/api/reports", reportRoutes);

// ---- Start ----
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
});