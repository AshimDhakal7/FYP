// import Booking from "../models/Booking.js";

// const toMinutes = (t) => {
//   const [h, m] = String(t).split(":").map(Number);
//   return h * 60 + m;
// };

// const overlaps = (aStart, aEnd, bStart, bEnd) => {
//   // overlap if start < otherEnd AND end > otherStart
//   return aStart < bEnd && aEnd > bStart;
// };

// const getUserId = (req) => {
//   // protect middleware sets req.user as a mongoose user doc
//   return req?.user?._id?.toString() || req?.user?.id || null;
// };

// export const createBooking = async (req, res) => {
//   try {
//     const userId = getUserId(req);
//     const { cricsal, date, startTime, endTime, durationHours } = req.body;

//     if (!userId) {
//       return res.status(401).json({ message: "Not authorized (user missing)" });
//     }

//     if (!cricsal || !date || !startTime || !endTime || !durationHours) {
//       return res.status(400).json({ message: "Missing booking fields" });
//     }

//     if (![1, 2, 3].includes(Number(durationHours))) {
//       return res.status(400).json({ message: "Invalid duration" });
//     }

//     // Basic sanity check
//     const s = toMinutes(startTime);
//     const e = toMinutes(endTime);
//     if (e <= s) return res.status(400).json({ message: "Invalid time range" });

//     // ✅ Prevent overlaps with existing confirmed bookings (same cricsal + date)
//     const existing = await Booking.find({
//       cricsal,
//       date,
//       status: "confirmed",
//     });

//     const hasOverlap = existing.some((b) =>
//       overlaps(s, e, toMinutes(b.startTime), toMinutes(b.endTime))
//     );

//     if (hasOverlap) {
//       return res.status(409).json({ message: "This slot is already booked" });
//     }

//     const booking = await Booking.create({
//       user: userId,
//       cricsal,
//       date,
//       startTime,
//       endTime,
//       durationHours: Number(durationHours),
//       status: "confirmed",
//     });

//     return res.status(201).json(booking);
//   } catch (err) {
//     if (err?.code === 11000) {
//       return res.status(409).json({ message: "This slot is already booked" });
//     }
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// export const getMyBookings = async (req, res) => {
//   try {
//     const userId = getUserId(req);

//     if (!userId) {
//       return res.status(401).json({ message: "Not authorized (user missing)" });
//     }

//     const bookings = await Booking.find({ user: userId }).sort({ createdAt: -1 });
//     return res.json(bookings);
//   } catch {
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// export const cancelBooking = async (req, res) => {
//   try {
//     const userId = getUserId(req);
//     const { id } = req.params;

//     if (!userId) {
//       return res.status(401).json({ message: "Not authorized (user missing)" });
//     }

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
//   } catch {
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // Optional: show availability for a day (so you can disable buttons)
// export const getBookedSlots = async (req, res) => {
//   try {
//     const { cricsal, date } = req.query;

//     if (!cricsal || !date) {
//       return res.status(400).json({ message: "Missing cricsal/date" });
//     }

//     const booked = await Booking.find({ cricsal, date, status: "confirmed" })
//       .select("startTime endTime -_id");

//     return res.json(booked);
//   } catch {
//     return res.status(500).json({ message: "Server error" });
//   }
// };
import Booking from "../models/Booking.js";

const toMinutes = (t) => {
  const [h, m] = String(t).split(":").map(Number);
  return h * 60 + m;
};

const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && aEnd > bStart;

const parseSlot = (slot) => {
  // supports "17:00 - 18:00" or "17:00-18:00"
  const parts = String(slot || "")
    .split("-")
    .map((s) => s.trim());
  if (parts.length !== 2) return { startTime: "", endTime: "" };
  return { startTime: parts[0], endTime: parts[1] };
};

export const createBooking = async (req, res) => {
  try {
    const userId = req.user?.id;

    // ✅ Accept BOTH frontend + backend field names
    const cricsal = req.body.cricsal || req.body.cricsalId;
    const date = req.body.date;

    // option A (your UI): slot + hours
    const slot = req.body.slot;
    const hours = req.body.hours;

    // option B (your backend): startTime + endTime + durationHours
    let startTime = req.body.startTime;
    let endTime = req.body.endTime;
    let durationHours = req.body.durationHours;

    // If UI sent slot, derive times
    if ((!startTime || !endTime) && slot) {
      const parsed = parseSlot(slot);
      startTime = startTime || parsed.startTime;
      endTime = endTime || parsed.endTime;
    }

    // If UI sent hours, map to durationHours
    if (!durationHours && hours !== undefined) {
      durationHours = Number(hours);
    }

    if (!userId) return res.status(401).json({ message: "Not authorized" });

    if (!cricsal || !date || !startTime || !endTime || !durationHours) {
      return res.status(400).json({
        message: "Missing booking fields",
        received: { cricsal, date, startTime, endTime, durationHours },
      });
    }

    if (![1, 2, 3].includes(Number(durationHours))) {
      return res.status(400).json({ message: "Invalid duration" });
    }

    const s = toMinutes(startTime);
    const e = toMinutes(endTime);
    if (e <= s) return res.status(400).json({ message: "Invalid time range" });

    const existing = await Booking.find({ cricsal, date, status: "confirmed" });

    const hasOverlap = existing.some((b) =>
      overlaps(s, e, toMinutes(b.startTime), toMinutes(b.endTime))
    );

    if (hasOverlap) {
      return res.status(409).json({ message: "This slot is already booked" });
    }

    const booking = await Booking.create({
      user: userId,
      cricsal,
      date,
      startTime,
      endTime,
      durationHours: Number(durationHours),
      status: "confirmed",
    });

    return res.status(201).json(booking);
  } catch (err) {
    if (err?.code === 11000) {
      return res.status(409).json({ message: "This slot is already booked" });
    }
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Not authorized" });

    const bookings = await Booking.find({ user: userId }).sort({ createdAt: -1 });
    return res.json(bookings);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (String(booking.user) !== String(userId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (booking.status === "cancelled") return res.json(booking);

    booking.status = "cancelled";
    booking.cancelledAt = new Date();
    await booking.save();

    return res.json(booking);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getBookedSlots = async (req, res) => {
  try {
    const { cricsal, date } = req.query;
    if (!cricsal || !date) {
      return res.status(400).json({ message: "Missing cricsal/date" });
    }

    const booked = await Booking.find({ cricsal, date, status: "confirmed" })
      .select("startTime endTime -_id");

    return res.json(booked);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
