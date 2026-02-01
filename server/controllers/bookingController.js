import Booking from "../models/Booking.js";

// ✅ Create booking
export const createBooking = async (req, res) => {
  try {
    const { cricsalId, date, timeSlot, duration } = req.body;

    if (!cricsalId || !date || !timeSlot || !duration) {
      return res.status(400).json({ message: "Missing booking fields" });
    }

    const booking = await Booking.create({
      user: req.user._id,
      cricsalId,
      date,
      timeSlot,
      duration,
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
};

// ✅ Load logged-in user's bookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(bookings); // ⚠️ MUST return ARRAY
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load bookings" });
  }
};
