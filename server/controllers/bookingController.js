import Booking from "../models/Booking.js";

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
  } catch (error) {
    return res.status(500).json({ message: "Booking failed" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("cricsal")
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: "Could not load bookings" });
  }
};
