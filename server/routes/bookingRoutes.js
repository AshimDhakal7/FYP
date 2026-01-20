import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createBooking, getMyBookings } from "../controllers/bookingController.js";

const router = express.Router();

// IMPORTANT: /my must be BEFORE "/"
router.get("/my", protect, getMyBookings);
router.post("/", protect, createBooking);

export default router;
