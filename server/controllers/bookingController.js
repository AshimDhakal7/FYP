import Booking from "../models/Booking.js";

// POST /api/bookings  (Protected)
export const createBooking = async (req, res) => {
  try {
    const { cricsalId, date, slot, hours } = req.body;

    if (!cricsalId || !date || !slot) {
      return res.status(400).json({ message: "Missing booking data" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      cricsal: cricsalId,
      date,
      slot,
      hours: Number(hours) || 1,
    });

    return res.status(201).json(booking);
  } catch (err) {
    console.error("createBooking error:", err.message);
    return res.status(500).json({ message: "Booking failed" });
  }
};

// GET /api/bookings/my  (Protected)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    return res.json(bookings);
  } catch (err) {
    console.error("getMyBookings error:", err.message);
    return res.status(500).json({ message: "Could not load bookings" });
  }
};
