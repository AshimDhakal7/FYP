import Booking from "../models/Booking.js";
import Ground from "../models/Ground.js";

export const getOwnerDashboard = async (req, res) => {
  try {
    const ownerId = req.user._id;

    // courts
    const courts = await Ground.countDocuments({ ownerId });

    // bookings
    const bookings = await Booking.find({ ownerId });

    const today = new Date().toISOString().split("T")[0];

    const todayBookings = bookings.filter(b => b.date === today);

    const upcoming = bookings.filter(b => b.date > today);

    const earnings = bookings
      .filter(b => b.status === "confirmed")
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    res.json({
      courts,
      todayBookings: todayBookings.length,
      upcoming: upcoming.length,
      earnings,
    });
  } catch (err) {
    res.status(500).json({ message: "Dashboard error" });
  }
};