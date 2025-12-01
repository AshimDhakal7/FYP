// server/routes/bookingRoutes.js
const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
} = require("../controllers/bookingController");

const { protect } = require("../middleware/authMiddleware");

// Create a booking (logged-in user)
router.post("/", protect, createBooking);          // POST /api/bookings

// Get my bookings (logged-in user)
router.get("/me", protect, getMyBookings);         // GET /api/bookings/me

// Cancel my booking (logged-in user)
router.patch("/:id/cancel", protect, cancelBooking); // PATCH /api/bookings/:id/cancel

// Get all bookings (for now: any logged-in user, no admin restriction)
router.get("/", protect, getAllBookings);          // GET /api/bookings

module.exports = router;
