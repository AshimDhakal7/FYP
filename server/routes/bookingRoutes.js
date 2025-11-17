// server/routes/bookingRoutes.js
const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
} = require("../controllers/bookingController");

const { protect, admin } = require("../middleware/authMiddleware");

// User
router.post("/", protect, createBooking);
router.get("/me", protect, getMyBookings);
router.patch("/:id/cancel", protect, cancelBooking);

// Admin
router.get("/", protect, admin, getAllBookings);

module.exports = router;
