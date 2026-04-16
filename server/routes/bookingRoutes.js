// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";

// import {
//   createBooking,
//   getMyBookings,
//   cancelBooking,
//   getBookedSlots,
//   getOwnerBookings,
//   approveBooking,
//   declineBooking,
// } from "../controllers/bookingController.js";

// const router = express.Router();

// // ==============================
// // PLAYER ROUTES
// // ==============================

// // Create booking
// router.post("/", protect, createBooking);

// // Get my bookings
// router.get("/my", protect, getMyBookings);
// router.get("/me", protect, getMyBookings);

// // Cancel booking
// router.patch("/:id/cancel", protect, cancelBooking);

// // ==============================
// // OWNER ROUTES
// // ==============================

// // Get owner bookings
// router.get("/owner", protect, getOwnerBookings);

// // Approve booking
// router.patch("/:id/approve", protect, approveBooking);

// // Decline booking
// router.patch("/:id/decline", protect, declineBooking);

// // ==============================
// // PUBLIC ROUTES
// // ==============================

// // Get booked slots (availability)
// router.get("/booked-slots", getBookedSlots);

// export default router;


import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getBookedSlots,
  getBookedSlotsStream,
  getOwnerBookings,
  approveBooking,
  declineBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// ==============================
// PLAYER ROUTES
// ==============================

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/me", protect, getMyBookings);
router.patch("/:id/cancel", protect, cancelBooking);

// ==============================
// OWNER ROUTES
// ==============================

router.get("/owner", protect, getOwnerBookings);
router.patch("/:id/approve", protect, approveBooking);
router.patch("/:id/decline", protect, declineBooking);

// ==============================
// PUBLIC ROUTES
// ==============================

router.get("/booked-slots", getBookedSlots);
router.get("/booked-slots/stream", getBookedSlotsStream);

export default router;