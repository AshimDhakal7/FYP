// server/controllers/bookingController.js
const Booking = require("../models/Booking");
const Ground = require("../models/Ground");

const createBooking = async (req, res) => {
  try {
    const { groundId, date, startTime, endTime } = req.body;

    const ground = await Ground.findById(groundId);
    if (!ground)
      return res.status(404).json({ message: "Ground not found" });

    const startHour = parseInt(startTime.split(":")[0], 10);
    const endHour = parseInt(endTime.split(":")[0], 10);
    const hours = endHour - startHour;

    if (isNaN(hours) || hours <= 0) {
      return res.status(400).json({ message: "Invalid time range" });
    }

    const totalPrice = hours * ground.hourlyRate;

    const booking = await Booking.create({
      user: req.user._id,
      ground: groundId,
      date,
      startTime,
      endTime,
      totalPrice,
    });

    return res.status(201).json(booking);
  } catch (err) {
    console.error("Create booking error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("ground", "name location")
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (err) {
    console.error("Get my bookings error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("ground", "name location")
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (err) {
    console.error("Get all bookings error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    booking.status = "cancelled";
    await booking.save();

    return res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    console.error("Cancel booking error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
};
