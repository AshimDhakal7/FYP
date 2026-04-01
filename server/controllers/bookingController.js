
// import Booking from "../models/Booking.js";
// import Ground from "../models/Ground.js";

// // ---------- helpers ----------
// const toMinutes = (t) => {
//   const [h, m] = String(t).split(":").map(Number);
//   return h * 60 + m;
// };

// const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && aEnd > bStart;

// const parseSlot = (slot) => {
//   // supports "17:00 - 18:00" or "17:00-18:00"
//   const parts = String(slot || "")
//     .split("-")
//     .map((s) => s.trim());
//   if (parts.length !== 2) return { startTime: "", endTime: "" };
//   return { startTime: parts[0], endTime: parts[1] };
// };

// const getUserId = (req) => req.user?._id || req.user?.id;

// // ---------- controllers ----------

// // CREATE BOOKING (player)
// export const createBooking = async (req, res) => {
//   try {
//     const userId = getUserId(req);

//     const cricsal = req.body.cricsal || req.body.cricsalId || req.body.ground;
//     const date = req.body.date;

//     const slot = req.body.slot;
//     const hours = req.body.hours;

//     let startTime = req.body.startTime;
//     let endTime = req.body.endTime;
//     let durationHours = req.body.durationHours;

//     if ((!startTime || !endTime) && slot) {
//       const parsed = parseSlot(slot);
//       startTime = startTime || parsed.startTime;
//       endTime = endTime || parsed.endTime;
//     }

//     if (!durationHours && hours !== undefined) {
//       durationHours = Number(hours);
//     }

//     if (!userId) return res.status(401).json({ message: "Not authorized" });

//     if (!cricsal || !date || !startTime || !endTime || !durationHours) {
//       return res.status(400).json({
//         message: "Missing booking fields",
//         received: { cricsal, date, startTime, endTime, durationHours },
//       });
//     }

//     durationHours = Number(durationHours);
//     if (![1, 2, 3].includes(durationHours)) {
//       return res.status(400).json({ message: "Invalid duration" });
//     }

//     const s = toMinutes(startTime);
//     const e = toMinutes(endTime);
//     if (e <= s) return res.status(400).json({ message: "Invalid time range" });

//     const groundDoc = await Ground.findById(cricsal).select(
//       "ownerId pricePerHour name location"
//     );
//     if (!groundDoc) {
//       return res.status(404).json({ message: "Cricsal/Ground not found" });
//     }

//     const existing = await Booking.find({ cricsal, date, status: "confirmed" }).select(
//       "startTime endTime"
//     );

//     const hasOverlap = existing.some((b) =>
//       overlaps(s, e, toMinutes(b.startTime), toMinutes(b.endTime))
//     );

//     if (hasOverlap) {
//       return res.status(409).json({ message: "This slot is already booked" });
//     }

//     const totalPrice = Number(groundDoc.pricePerHour || 0) * durationHours;

//     const booking = await Booking.create({
//       cricsal,
//       ground: cricsal,
//       ownerId: groundDoc.ownerId,
//       user: req.user._id,
//       date,
//       startTime,
//       endTime,
//       durationHours,
//       totalPrice,
//       status: "pending",
//     });

//     return res.status(201).json(booking);
//   } catch (err) {
//     if (err?.code === 11000) {
//       return res.status(409).json({ message: "This slot is already booked" });
//     }
//     console.error("CREATE BOOKING ERROR:", err);
//     return res.status(500).json({ message: err.message || "Server error" });
//   }
// };

// // GET MY BOOKINGS (player)
// export const getMyBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.user._id })
//       .sort({ createdAt: -1 })
//       .populate("cricsal");
//     return res.json(bookings);
//   } catch (err) {
//     console.log("GET MY BOOKINGS ERROR:", err);
//     return res.status(500).json({ message: "Server error fetching bookings." });
//   }
// };

// // GET OWNER BOOKINGS (owner dashboard)
// export const getOwnerBookings = async (req, res) => {
//   try {
//     const ownerId = req.user?._id || req.user?.id;

//     const bookings = await Booking.find({ ownerId })
//       .sort({ createdAt: -1 })
//       .populate("cricsal", "name location pricePerHour")
//       .populate("user", "name email phone");
//     return res.json({ bookings });
//   } catch (err) {
//     console.log("GET OWNER BOOKINGS ERROR:", err);
//     return res.status(500).json({ message: "Server error fetching owner bookings." });
//   }
// };

// // CANCEL BOOKING (player)
// export const cancelBooking = async (req, res) => {
//   try {
//     const userId = req.user?._id || req.user?.id;
//     const { id } = req.params;

//     const booking = await Booking.findById(id);
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     if (String(booking.user) !== String(userId)) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     if (booking.status === "cancelled") return res.json(booking);

//     booking.status = "cancelled";
//     booking.cancelledAt = new Date();
//     await booking.save();

//     return res.json(booking);
//   } catch (err) {
//     console.error("CANCEL BOOKING ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // GET BOOKED SLOTS (availability)
// export const getBookedSlots = async (req, res) => {
//   try {
//     const { cricsal, date } = req.query;
//     if (!cricsal || !date) {
//       return res.status(400).json({ message: "Missing cricsal/date" });
//     }

//     const booked = await Booking.find({ cricsal, date, status: "confirmed" }).select(
//       "startTime endTime -_id"
//     );

//     return res.json(booked);
//   } catch (err) {
//     console.error("GET BOOKED SLOTS ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // ==============================
// // ✅ ADDED (DO NOT MODIFY ABOVE)
// // ==============================

// // APPROVE BOOKING (owner)
// export const approveBooking = async (req, res) => {
//   try {
//     const ownerId = req.user?._id || req.user?.id;
//     const { id } = req.params;

//     const booking = await Booking.findById(id);
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     if (String(booking.ownerId) !== String(ownerId)) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     booking.status = "confirmed";
//     await booking.save();

//     return res.json(booking);
//   } catch (err) {
//     console.error("APPROVE BOOKING ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // DECLINE BOOKING (owner)
// export const declineBooking = async (req, res) => {
//   try {
//     const ownerId = req.user?._id || req.user?.id;
//     const { id } = req.params;

//     const booking = await Booking.findById(id);
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     if (String(booking.ownerId) !== String(ownerId)) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     booking.status = "cancelled";
//     await booking.save();

//     return res.json(booking);
//   } catch (err) {
//     console.error("DECLINE BOOKING ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


// import Booking from "../models/Booking.js";
// import Ground from "../models/Ground.js";
// import { createNotification } from "../utils/createNotification.js";

// // ---------- helpers ----------
// const toMinutes = (t) => {
//   const [h, m] = String(t).split(":").map(Number);
//   return h * 60 + m;
// };

// const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && aEnd > bStart;

// const parseSlot = (slot) => {
//   const parts = String(slot || "")
//     .split("-")
//     .map((s) => s.trim());

//   if (parts.length !== 2) return { startTime: "", endTime: "" };

//   return { startTime: parts[0], endTime: parts[1] };
// };

// const getUserId = (req) => req.user?._id || req.user?.id;

// // ---------- controllers ----------

// // CREATE BOOKING (player)
// export const createBooking = async (req, res) => {
//   try {
//     const userId = getUserId(req);

//     const cricsal = req.body.cricsal || req.body.cricsalId || req.body.ground;
//     const date = req.body.date;

//     const slot = req.body.slot;
//     const hours = req.body.hours;

//     let startTime = req.body.startTime;
//     let endTime = req.body.endTime;
//     let durationHours = req.body.durationHours;

//     if ((!startTime || !endTime) && slot) {
//       const parsed = parseSlot(slot);
//       startTime = startTime || parsed.startTime;
//       endTime = endTime || parsed.endTime;
//     }

//     if (!durationHours && hours !== undefined) {
//       durationHours = Number(hours);
//     }

//     if (!userId) {
//       return res.status(401).json({ message: "Not authorized" });
//     }

//     if (!cricsal || !date || !startTime || !endTime || !durationHours) {
//       return res.status(400).json({
//         message: "Missing booking fields",
//         received: { cricsal, date, startTime, endTime, durationHours },
//       });
//     }

//     durationHours = Number(durationHours);

//     if (![1, 2, 3].includes(durationHours)) {
//       return res.status(400).json({ message: "Invalid duration" });
//     }

//     const s = toMinutes(startTime);
//     const e = toMinutes(endTime);

//     if (e <= s) {
//       return res.status(400).json({ message: "Invalid time range" });
//     }

//     const groundDoc = await Ground.findById(cricsal).select(
//       "ownerId pricePerHour name location"
//     );

//     if (!groundDoc) {
//       return res.status(404).json({ message: "Cricsal/Ground not found" });
//     }

//     const existing = await Booking.find({
//       cricsal,
//       date,
//       status: "confirmed",
//     }).select("startTime endTime");

//     const hasOverlap = existing.some((b) =>
//       overlaps(s, e, toMinutes(b.startTime), toMinutes(b.endTime))
//     );

//     if (hasOverlap) {
//       return res.status(409).json({ message: "This slot is already booked" });
//     }

//     const totalPrice = Number(groundDoc.pricePerHour || 0) * durationHours;

//     const booking = await Booking.create({
//       cricsal,
//       ground: cricsal,
//       ownerId: groundDoc.ownerId,
//       user: userId,
//       date,
//       startTime,
//       endTime,
//       durationHours,
//       totalPrice,
//       status: "pending",
//     });

//     // 🔔 Notify owner about new booking request
//     await createNotification({
//       recipient: groundDoc.ownerId,
//       recipientRole: "owner",
//       type: "booking_request",
//       title: "New booking request",
//       message: `${req.user?.name || "A user"} requested ${groundDoc.name} on ${date} from ${startTime} to ${endTime}.`,
//       link: "/owner-bookings",
//       data: {
//         bookingId: booking._id,
//         cricsalId: groundDoc._id,
//         userId,
//         date,
//         startTime,
//         endTime,
//       },
//     });

//     return res.status(201).json(booking);
//   } catch (err) {
//     if (err?.code === 11000) {
//       return res.status(409).json({ message: "This slot is already booked" });
//     }

//     console.error("CREATE BOOKING ERROR:", err);
//     return res.status(500).json({ message: err.message || "Server error" });
//   }
// };

// // GET MY BOOKINGS (player)
// export const getMyBookings = async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.user._id })
//       .sort({ createdAt: -1 })
//       .populate("cricsal");

//     return res.json(bookings);
//   } catch (err) {
//     console.log("GET MY BOOKINGS ERROR:", err);
//     return res.status(500).json({ message: "Server error fetching bookings." });
//   }
// };

// // GET OWNER BOOKINGS (owner dashboard)
// export const getOwnerBookings = async (req, res) => {
//   try {
//     const ownerId = req.user?._id || req.user?.id;

//     const bookings = await Booking.find({ ownerId })
//       .sort({ createdAt: -1 })
//       .populate("cricsal", "name location pricePerHour")
//       .populate("user", "name email phone");

//     return res.json({ bookings });
//   } catch (err) {
//     console.log("GET OWNER BOOKINGS ERROR:", err);
//     return res.status(500).json({ message: "Server error fetching owner bookings." });
//   }
// };

// // CANCEL BOOKING (player)
// export const cancelBooking = async (req, res) => {
//   try {
//     const userId = req.user?._id || req.user?.id;
//     const { id } = req.params;

//     const booking = await Booking.findById(id).populate("cricsal", "name");
//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     if (String(booking.user) !== String(userId)) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     if (booking.status === "cancelled") {
//       return res.json(booking);
//     }

//     booking.status = "cancelled";
//     booking.cancelledAt = new Date();
//     await booking.save();

//     // Optional: notify owner when player cancels
//     await createNotification({
//       recipient: booking.ownerId,
//       recipientRole: "owner",
//       type: "booking_cancelled",
//       title: "Booking cancelled",
//       message: `${req.user?.name || "A user"} cancelled booking for ${booking.cricsal?.name || "your ground"} on ${booking.date}.`,
//       link: "/owner-bookings",
//       data: {
//         bookingId: booking._id,
//       },
//     });

//     return res.json(booking);
//   } catch (err) {
//     console.error("CANCEL BOOKING ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // GET BOOKED SLOTS (availability)
// export const getBookedSlots = async (req, res) => {
//   try {
//     const { cricsal, date } = req.query;

//     if (!cricsal || !date) {
//       return res.status(400).json({ message: "Missing cricsal/date" });
//     }

//     const booked = await Booking.find({
//       cricsal,
//       date,
//       status: "confirmed",
//     }).select("startTime endTime -_id");

//     return res.json(booked);
//   } catch (err) {
//     console.error("GET BOOKED SLOTS ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // APPROVE BOOKING (owner)
// export const approveBooking = async (req, res) => {
//   try {
//     const ownerId = req.user?._id || req.user?.id;
//     const { id } = req.params;

//     const booking = await Booking.findById(id)
//       .populate("cricsal", "name location")
//       .populate("user", "name");

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     if (String(booking.ownerId) !== String(ownerId)) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     booking.status = "confirmed";
//     await booking.save();

//     // 🔔 Notify user after approval
//     await createNotification({
//       recipient: booking.user._id,
//       recipientRole: "user",
//       type: "booking_approved",
//       title: "Booking approved",
//       message: `Your booking for ${booking.cricsal?.name || "the ground"} on ${booking.date} from ${booking.startTime} to ${booking.endTime} has been approved.`,
//       link: "/my-bookings",
//       data: {
//         bookingId: booking._id,
//         cricsalId: booking.cricsal?._id,
//       },
//     });

//     return res.json(booking);
//   } catch (err) {
//     console.error("APPROVE BOOKING ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // DECLINE BOOKING (owner)
// export const declineBooking = async (req, res) => {
//   try {
//     const ownerId = req.user?._id || req.user?.id;
//     const { id } = req.params;

//     const booking = await Booking.findById(id)
//       .populate("cricsal", "name location")
//       .populate("user", "name");

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     if (String(booking.ownerId) !== String(ownerId)) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     booking.status = "cancelled";
//     await booking.save();

//     // 🔔 Notify user after decline
//     await createNotification({
//       recipient: booking.user._id,
//       recipientRole: "user",
//       type: "booking_declined",
//       title: "Booking declined",
//       message: `Your booking for ${booking.cricsal?.name || "the ground"} on ${booking.date} from ${booking.startTime} to ${booking.endTime} was declined.`,
//       link: "/my-bookings",
//       data: {
//         bookingId: booking._id,
//         cricsalId: booking.cricsal?._id,
//       },
//     });

//     return res.json(booking);
//   } catch (err) {
//     console.error("DECLINE BOOKING ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };


import Booking from "../models/Booking.js";
import Ground from "../models/Ground.js";
import { createNotification } from "../utils/createNotification.js";

// ---------- helpers ----------
const toMinutes = (t) => {
  const [h, m] = String(t).split(":").map(Number);
  return h * 60 + m;
};

const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && aEnd > bStart;

const parseSlot = (slot) => {
  const parts = String(slot || "")
    .split("-")
    .map((s) => s.trim());

  if (parts.length !== 2) return { startTime: "", endTime: "" };

  return { startTime: parts[0], endTime: parts[1] };
};

const getUserId = (req) => req.user?._id || req.user?.id;

// ---------- controllers ----------

// CREATE BOOKING (player)
export const createBooking = async (req, res) => {
  try {
    const userId = getUserId(req);

    const cricsal = req.body.cricsal || req.body.cricsalId || req.body.ground;
    const date = req.body.date;

    const slot = req.body.slot;
    const hours = req.body.hours;

    let startTime = req.body.startTime;
    let endTime = req.body.endTime;
    let durationHours = req.body.durationHours;

    if ((!startTime || !endTime) && slot) {
      const parsed = parseSlot(slot);
      startTime = startTime || parsed.startTime;
      endTime = endTime || parsed.endTime;
    }

    if (!durationHours && hours !== undefined) {
      durationHours = Number(hours);
    }

    if (!userId) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!cricsal || !date || !startTime || !endTime || !durationHours) {
      return res.status(400).json({
        message: "Missing booking fields",
        received: { cricsal, date, startTime, endTime, durationHours },
      });
    }

    durationHours = Number(durationHours);

    if (![1, 2, 3].includes(durationHours)) {
      return res.status(400).json({ message: "Invalid duration" });
    }

    const s = toMinutes(startTime);
    const e = toMinutes(endTime);

    if (e <= s) {
      return res.status(400).json({ message: "Invalid time range" });
    }

    const groundDoc = await Ground.findById(cricsal).select(
      "ownerId pricePerHour name location"
    );

    if (!groundDoc) {
      return res.status(404).json({ message: "Cricsal/Ground not found" });
    }

    const existing = await Booking.find({
      cricsal,
      date,
      status: "confirmed",
    }).select("startTime endTime");

    const hasOverlap = existing.some((b) =>
      overlaps(s, e, toMinutes(b.startTime), toMinutes(b.endTime))
    );

    if (hasOverlap) {
      return res.status(409).json({ message: "This slot is already booked" });
    }

    const totalPrice = Number(groundDoc.pricePerHour || 0) * durationHours;

    const paymentPreference =
      req.body.paymentPreference === "full" ? "full" : "advance_30";

    const advancePercent = paymentPreference === "advance_30" ? 30 : 100;

    const booking = await Booking.create({
      cricsal,
      ground: cricsal,
      ownerId: groundDoc.ownerId,
      user: userId,
      date,
      startTime,
      endTime,
      durationHours,
      totalPrice,
      paymentPreference,
      advancePercent,
      amountPaid: 0,
      paymentStatusLabel: "",
      paymentMethod: "",
      khaltiPidx: "",
      paidAt: null,
      status: "pending",
    });

    // 🔔 Notify owner about new booking request
    await createNotification({
      recipient: groundDoc.ownerId,
      recipientRole: "owner",
      type: "booking_request",
      title: "New booking request",
      message: `${
        req.user?.name || "A user"
      } requested ${groundDoc.name} on ${date} from ${startTime} to ${endTime}.`,
      link: "/owner-bookings",
      data: {
        bookingId: booking._id,
        cricsalId: groundDoc._id,
        userId,
        date,
        startTime,
        endTime,
      },
    });

    return res.status(201).json(booking);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "This slot is already booked" });
    }

    console.error("CREATE BOOKING ERROR:", err);
    return res.status(500).json({ message: err.message || "Server error" });
  }
};

// GET MY BOOKINGS (player)
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("cricsal");

    return res.json(bookings);
  } catch (err) {
    console.log("GET MY BOOKINGS ERROR:", err);
    return res.status(500).json({ message: "Server error fetching bookings." });
  }
};

// GET OWNER BOOKINGS (owner dashboard)
export const getOwnerBookings = async (req, res) => {
  try {
    const ownerId = req.user?._id || req.user?.id;

    const bookings = await Booking.find({ ownerId })
      .sort({ createdAt: -1 })
      .populate("cricsal", "name location pricePerHour")
      .populate("user", "name email phone");

    return res.json({ bookings });
  } catch (err) {
    console.log("GET OWNER BOOKINGS ERROR:", err);
    return res
      .status(500)
      .json({ message: "Server error fetching owner bookings." });
  }
};

// CANCEL BOOKING (player)
export const cancelBooking = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    const { id } = req.params;

    const booking = await Booking.findById(id).populate("cricsal", "name");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (String(booking.user) !== String(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (booking.status === "cancelled") {
      return res.json(booking);
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    await booking.save();

    // Optional: notify owner when player cancels
    await createNotification({
      recipient: booking.ownerId,
      recipientRole: "owner",
      type: "booking_cancelled",
      title: "Booking cancelled",
      message: `${
        req.user?.name || "A user"
      } cancelled booking for ${
        booking.cricsal?.name || "your ground"
      } on ${booking.date}.`,
      link: "/owner-bookings",
      data: {
        bookingId: booking._id,
      },
    });

    return res.json(booking);
  } catch (err) {
    console.error("CANCEL BOOKING ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// GET BOOKED SLOTS (availability)
export const getBookedSlots = async (req, res) => {
  try {
    const { cricsal, date } = req.query;

    if (!cricsal || !date) {
      return res.status(400).json({ message: "Missing cricsal/date" });
    }

    const booked = await Booking.find({
      cricsal,
      date,
      status: "confirmed",
    }).select("startTime endTime -_id");

    return res.json(booked);
  } catch (err) {
    console.error("GET BOOKED SLOTS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// APPROVE BOOKING (owner)
export const approveBooking = async (req, res) => {
  try {
    const ownerId = req.user?._id || req.user?.id;
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("cricsal", "name location")
      .populate("user", "name");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (String(booking.ownerId) !== String(ownerId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    booking.status = "confirmed";
    await booking.save();

    // 🔔 Notify user after approval
    await createNotification({
      recipient: booking.user._id,
      recipientRole: "user",
      type: "booking_approved",
      title: "Booking approved",
      message: `Your booking for ${
        booking.cricsal?.name || "the ground"
      } on ${booking.date} from ${booking.startTime} to ${
        booking.endTime
      } has been approved.`,
      link: "/my-bookings",
      data: {
        bookingId: booking._id,
        cricsalId: booking.cricsal?._id,
      },
    });

    return res.json(booking);
  } catch (err) {
    console.error("APPROVE BOOKING ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// DECLINE BOOKING (owner)
export const declineBooking = async (req, res) => {
  try {
    const ownerId = req.user?._id || req.user?.id;
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("cricsal", "name location")
      .populate("user", "name");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (String(booking.ownerId) !== String(ownerId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    booking.status = "cancelled";
    await booking.save();

    // 🔔 Notify user after decline
    await createNotification({
      recipient: booking.user._id,
      recipientRole: "user",
      type: "booking_declined",
      title: "Booking declined",
      message: `Your booking for ${
        booking.cricsal?.name || "the ground"
      } on ${booking.date} from ${booking.startTime} to ${
        booking.endTime
      } was declined.`,
      link: "/my-bookings",
      data: {
        bookingId: booking._id,
        cricsalId: booking.cricsal?._id,
      },
    });

    return res.json(booking);
  } catch (err) {
    console.error("DECLINE BOOKING ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};