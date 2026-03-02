import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookedSlots,
  getOwnerBookings,
} from "../controllers/bookingController.js";

const router = express.Router();

// Create booking (player)
router.post("/", protect, createBooking);

// My bookings (player)
router.get("/my", protect, getMyBookings);
router.get("/me", protect, getMyBookings);

// Owner bookings (owner dashboard)
router.get("/owner", protect, getOwnerBookings);

// Cancel booking (player)
router.patch("/:id/cancel", protect, cancelBooking);

// Availability
router.get("/booked-slots", getBookedSlots);

export default router;