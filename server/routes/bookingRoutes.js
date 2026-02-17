// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import {
//   createBooking,
//   getMyBookings,
//   cancelBooking,
//   getBookedSlots,
// } from "../controllers/bookingController.js";

// const router = express.Router();

// // POST /api/bookings
// router.post("/", protect, createBooking);

// // GET /api/bookings/me
// router.get("/me", protect, getMyBookings);

// // PATCH /api/bookings/:id/cancel
// router.patch("/:id/cancel", protect, cancelBooking);

// // GET /api/bookings/slots?cricsal=g2&date=2026-02-18  (optional)
// router.get("/slots", protect, getBookedSlots);

// export default router;

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookedSlots,
} from "../controllers/bookingController.js";

const router = express.Router();

// Create booking (protected)
router.post("/", protect, createBooking);

// My bookings (protected)
router.get("/my", protect, getMyBookings);

// Cancel booking (protected)
router.put("/:id/cancel", protect, cancelBooking);

// Availability (optional public)
router.get("/booked-slots", getBookedSlots);

export default router;
