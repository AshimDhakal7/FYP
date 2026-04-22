// import Booking from "../models/Booking.js";
// import Ground from "../models/Ground.js";
// import { createNotification } from "../utils/createNotification.js";
// import sendEmail from "../utils/sendEmail.js";
// import { bookingConfirmedEmail, bookingDeclinedEmail} from "../utils/emailTemplate.js";

// // ---------- helpers ----------
// const ACTIVE_BOOKING_STATUSES = ["pending", "confirmed"];
// const availabilityClients = new Map();
// const bookingLocks = new Map();

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

// const makeAvailabilityKey = (cricsal, date) => `${cricsal}__${date}`;

// const createSseMessage = (eventName, payload) =>
//   `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;

// const getAvailabilityPayload = async (cricsal, date) => {
//   return Booking.find({
//     cricsal,
//     date,
//     status: { $in: ACTIVE_BOOKING_STATUSES },
//   })
//     .select("startTime endTime status -_id")
//     .sort({ startTime: 1 });
// };

// const broadcastAvailabilityUpdate = async (cricsal, date) => {
//   const key = makeAvailabilityKey(cricsal, date);
//   const clients = availabilityClients.get(key);

//   if (!clients || clients.size === 0) return;

//   const payload = await getAvailabilityPayload(cricsal, date);
//   const message = createSseMessage("slots", payload);

//   for (const client of clients) {
//     client.write(message);
//   }
// };

// const withBookingLock = async (lockKey, work) => {
//   while (bookingLocks.has(lockKey)) {
//     await bookingLocks.get(lockKey);
//   }

//   let releaseLock;
//   const lockPromise = new Promise((resolve) => {
//     releaseLock = resolve;
//   });

//   bookingLocks.set(lockKey, lockPromise);

//   try {
//     return await work();
//   } finally {
//     bookingLocks.delete(lockKey);
//     releaseLock();
//   }
// };

// const isPastDate = (dateString) => {
//   const todayString = new Date().toISOString().split("T")[0];
//   return dateString < todayString;
// };

// const isPastTimeToday = (dateString, startTime) => {
//   const todayString = new Date().toISOString().split("T")[0];
//   if (dateString !== todayString) return false;

//   const now = new Date();
//   const currentMinutes = now.getHours() * 60 + now.getMinutes();
//   return toMinutes(startTime) <= currentMinutes;
// };

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

//     if (isPastDate(date)) {
//       return res.status(400).json({ message: "Past dates cannot be booked" });
//     }

//     if (isPastTimeToday(date, startTime)) {
//       return res.status(400).json({ message: "Past time slots cannot be booked" });
//     }

//     const s = toMinutes(startTime);
//     const e = toMinutes(endTime);

//     if (Number.isNaN(s) || Number.isNaN(e) || e <= s) {
//       return res.status(400).json({ message: "Invalid time range" });
//     }

//     const groundDoc = await Ground.findById(cricsal).select(
//       "ownerId pricePerHour name location"
//     );

//     if (!groundDoc) {
//       return res.status(404).json({ message: "Cricsal/Ground not found" });
//     }

//     const paymentPreference =
//       req.body.paymentPreference === "full" ? "full" : "advance_30";

//     const advancePercent = paymentPreference === "advance_30" ? 30 : 100;

//     const lockKey = makeAvailabilityKey(cricsal, date);

//     const booking = await withBookingLock(lockKey, async () => {
//       const existing = await Booking.find({
//         cricsal,
//         date,
//         status: { $in: ACTIVE_BOOKING_STATUSES },
//       }).select("startTime endTime status");

//       const conflict = existing.find((b) =>
//         overlaps(s, e, toMinutes(b.startTime), toMinutes(b.endTime))
//       );

//       if (conflict) {
//         return res.status(409).json({
//           message:
//             conflict.status === "pending"
//               ? "This slot is pending approval"
//               : "This slot is already booked",
//         });
//       }

//       const totalPrice = Number(groundDoc.pricePerHour || 0) * durationHours;

//       return Booking.create({
//         cricsal,
//         ground: cricsal,
//         ownerId: groundDoc.ownerId,
//         user: userId,
//         date,
//         startTime,
//         endTime,
//         durationHours,
//         totalPrice,
//         paymentPreference,
//         advancePercent,
//         amountPaid: 0,
//         paymentStatusLabel: "",
//         paymentMethod: "",
//         khaltiPidx: "",
//         paidAt: null,
//         status: "pending",
//       });
//     });

//     if (booking?.statusCode) {
//       return booking;
//     }

//     await createNotification({
//       recipient: groundDoc.ownerId,
//       recipientRole: "owner",
//       type: "booking_request",
//       title: "New booking request",
//       message: `${
//         req.user?.name || "A user"
//       } requested ${groundDoc.name} on ${date} from ${startTime} to ${endTime}.`,
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

//     await broadcastAvailabilityUpdate(cricsal, date);

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
//     return res
//       .status(500)
//       .json({ message: "Server error fetching owner bookings." });
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

//     await createNotification({
//       recipient: booking.ownerId,
//       recipientRole: "owner",
//       type: "booking_cancelled",
//       title: "Booking cancelled",
//       message: `${
//         req.user?.name || "A user"
//       } cancelled booking for ${
//         booking.cricsal?.name || "your ground"
//       } on ${booking.date}.`,
//       link: "/owner-bookings",
//       data: {
//         bookingId: booking._id,
//       },
//     });

//     await broadcastAvailabilityUpdate(
//       booking.cricsal?._id || booking.cricsal,
//       booking.date
//     );

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

//     const booked = await getAvailabilityPayload(cricsal, date);
//     return res.json(booked);
//   } catch (err) {
//     console.error("GET BOOKED SLOTS ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// // LIVE SLOT STREAM
// export const getBookedSlotsStream = async (req, res) => {
//   const { cricsal, date } = req.query;

//   if (!cricsal || !date) {
//     return res.status(400).json({ message: "Missing cricsal/date" });
//   }

//   const key = makeAvailabilityKey(cricsal, date);
//   const origin = req.headers.origin || "*";

//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache, no-transform");
//   res.setHeader("Connection", "keep-alive");
//   res.setHeader("Access-Control-Allow-Origin", origin);
//   res.setHeader("X-Accel-Buffering", "no");
//   res.flushHeaders?.();

//   if (!availabilityClients.has(key)) {
//     availabilityClients.set(key, new Set());
//   }

//   availabilityClients.get(key).add(res);

//   res.write(createSseMessage("connected", { ok: true }));

//   try {
//     const initialPayload = await getAvailabilityPayload(cricsal, date);
//     res.write(createSseMessage("slots", initialPayload));
//   } catch (error) {
//     res.write(createSseMessage("error", { message: "Failed to load slots" }));
//   }

//   const heartbeat = setInterval(() => {
//     res.write(": keep-alive\n\n");
//   }, 25000);

//   req.on("close", () => {
//     clearInterval(heartbeat);

//     const clients = availabilityClients.get(key);
//     if (clients) {
//       clients.delete(res);
//       if (clients.size === 0) {
//         availabilityClients.delete(key);
//       }
//     }

//     res.end();
//   });
// };

// // APPROVE BOOKING (owner)
// export const approveBooking = async (req, res) => {
//   try {
//     const ownerId = req.user?._id || req.user?.id;
//     const { id } = req.params;

//     const booking = await Booking.findById(id)
//       .populate("cricsal", "name location")
//       .populate("user", "name email");

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     if (String(booking.ownerId) !== String(ownerId)) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     const lockKey = makeAvailabilityKey(
//       booking.cricsal?._id || booking.cricsal,
//       booking.date
//     );

//     const result = await withBookingLock(lockKey, async () => {
//       const freshBooking = await Booking.findById(id)
//         .populate("cricsal", "name location")
//         .populate("user", "name email");

//       if (!freshBooking) {
//         return res.status(404).json({ message: "Booking not found" });
//       }

//       if (freshBooking.status === "cancelled") {
//         return res
//           .status(400)
//           .json({ message: "Cancelled booking cannot be approved" });
//       }

//       const others = await Booking.find({
//         _id: { $ne: freshBooking._id },
//         cricsal: freshBooking.cricsal?._id || freshBooking.cricsal,
//         date: freshBooking.date,
//         status: "confirmed",
//       }).select("startTime endTime");

//       const hasConflict = others.some((b) =>
//         overlaps(
//           toMinutes(freshBooking.startTime),
//           toMinutes(freshBooking.endTime),
//           toMinutes(b.startTime),
//           toMinutes(b.endTime)
//         )
//       );

//       if (hasConflict) {
//         return res.status(409).json({
//           message: "This slot has already been confirmed for another booking",
//         });
//       }

//       freshBooking.status = "confirmed";
//       await freshBooking.save();
//       return freshBooking;
//     });

//     if (result?.statusCode) {
//       return result;
//     }

//     await createNotification({
//       recipient: result.user._id,
//       recipientRole: "user",
//       type: "booking_approved",
//       title: "Booking approved",
//       message: `Your booking for ${
//         result.cricsal?.name || "the ground"
//       } on ${result.date} from ${result.startTime} to ${
//         result.endTime
//       } has been approved.`,
//       link: "/my-bookings",
//       data: {
//         bookingId: result._id,
//         cricsalId: result.cricsal?._id,
//       },
//     });

//     if (result.user?.email) {
//       await sendEmail({
//         to: result.user.email,
//         subject: `CricBook Booking Confirmed - ${
//           result.cricsal?.name || "Ground"
//         }`,
//         html: bookingConfirmedEmail({
//           userName: result.user?.name,
//           groundName: result.cricsal?.name,
//           groundLocation: result.cricsal?.location,
//           date: result.date,
//           startTime: result.startTime,
//           endTime: result.endTime,
//           totalPrice: result.totalPrice,
//           paymentStatusLabel: result.paymentStatusLabel,
//         }),
//       });
//     }

//     await broadcastAvailabilityUpdate(
//       result.cricsal?._id || result.cricsal,
//       result.date
//     );

//     return res.json(result);
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
//       // ✅ FIX: include email
//       .populate("user", "name email");

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     if (String(booking.ownerId) !== String(ownerId)) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

  
//     booking.status = "cancelled";
//     await booking.save();

//     // Notification
//     await createNotification({
//       recipient: booking.user._id,
//       recipientRole: "user",
//       type: "booking_declined",
//       title: "Booking declined",
//       message: `Your booking for ${
//         booking.cricsal?.name || "the ground"
//       } on ${booking.date} from ${booking.startTime} to ${
//         booking.endTime
//       } was declined.`,
//       link: "/my-bookings",
//       data: {
//         bookingId: booking._id,
//         cricsalId: booking.cricsal?._id,
//       },
//     });

//     // ADD EMAIL HERE
//     if (booking.user?.email) {
//       await sendEmail({
//         to: booking.user.email,
//         subject: `CricBook Booking Declined - ${booking.cricsal?.name || "Ground"}`,
//         html: bookingDeclinedEmail({
//           userName: booking.user?.name,
//           groundName: booking.cricsal?.name,
//           groundLocation: booking.cricsal?.location,
//           date: booking.date,
//           startTime: booking.startTime,
//           endTime: booking.endTime,
//           totalPrice: booking.totalPrice,
//           paymentStatusLabel: booking.paymentStatusLabel,
//         }),
//       });
//     }

//     await broadcastAvailabilityUpdate(
//       booking.cricsal?._id || booking.cricsal,
//       booking.date
//     );

//     return res.json(booking);
//   } catch (err) {
//     console.error("DECLINE BOOKING ERROR:", err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };



import Booking from "../models/Booking.js";
import Ground from "../models/Ground.js";
import User from "../models/User.js";
import LoyaltyTransaction from "../models/LoyaltyTransaction.js";
import { createNotification } from "../utils/createNotification.js";
import sendEmail from "../utils/sendEmail.js";
import {
  bookingConfirmedEmail,
  bookingDeclinedEmail,
} from "../utils/emailTemplate.js";

// ---------- helpers ----------
const ACTIVE_BOOKING_STATUSES = ["pending", "confirmed"];
const availabilityClients = new Map();
const bookingLocks = new Map();

const LOYALTY_RULES = {
  NORMAL_CANCELLATION_PENALTY: 40,
  LATE_CANCELLATION_PENALTY: 120,
  LATE_CANCELLATION_WINDOW_HOURS: 2,
};

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

const makeAvailabilityKey = (cricsal, date) => `${cricsal}__${date}`;

const createSseMessage = (eventName, payload) =>
  `event: ${eventName}\ndata: ${JSON.stringify(payload)}\n\n`;

const getAvailabilityPayload = async (cricsal, date) => {
  return Booking.find({
    cricsal,
    date,
    status: { $in: ACTIVE_BOOKING_STATUSES },
  })
    .select("startTime endTime status -_id")
    .sort({ startTime: 1 });
};

const broadcastAvailabilityUpdate = async (cricsal, date) => {
  const key = makeAvailabilityKey(cricsal, date);
  const clients = availabilityClients.get(key);

  if (!clients || clients.size === 0) return;

  const payload = await getAvailabilityPayload(cricsal, date);
  const message = createSseMessage("slots", payload);

  for (const client of clients) {
    client.write(message);
  }
};

const withBookingLock = async (lockKey, work) => {
  while (bookingLocks.has(lockKey)) {
    await bookingLocks.get(lockKey);
  }

  let releaseLock;
  const lockPromise = new Promise((resolve) => {
    releaseLock = resolve;
  });

  bookingLocks.set(lockKey, lockPromise);

  try {
    return await work();
  } finally {
    bookingLocks.delete(lockKey);
    releaseLock();
  }
};

const isPastDate = (dateString) => {
  const todayString = new Date().toISOString().split("T")[0];
  return dateString < todayString;
};

const isPastTimeToday = (dateString, startTime) => {
  const todayString = new Date().toISOString().split("T")[0];
  if (dateString !== todayString) return false;

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return toMinutes(startTime) <= currentMinutes;
};

const isLateCancellation = (bookingDate, startTime) => {
  if (!bookingDate || !startTime) return false;

  const [hours, minutes] = String(startTime).split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return false;

  const gameStart = new Date(
    `${bookingDate}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:00`
  );

  const now = new Date();
  const diffMs = gameStart.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours <= LOYALTY_RULES.LATE_CANCELLATION_WINDOW_HOURS;
};

const applyLoyaltyPenalty = async ({ user, booking, points, description }) => {
  const currentBalance = Math.max(0, Number(user?.loyaltyPoints || 0));
  const nextBalance = Math.max(0, currentBalance - Number(points || 0));

  user.loyaltyPoints = nextBalance;
  await user.save();

  await LoyaltyTransaction.create({
    user: user._id,
    booking: booking._id,
    type: "penalty",
    points: Number(points || 0),
    direction: "debit",
    balanceAfter: nextBalance,
    amountValue: 0,
    description,
  });

  return nextBalance;
};

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

    if (isPastDate(date)) {
      return res.status(400).json({ message: "Past dates cannot be booked" });
    }

    if (isPastTimeToday(date, startTime)) {
      return res.status(400).json({ message: "Past time slots cannot be booked" });
    }

    const s = toMinutes(startTime);
    const e = toMinutes(endTime);

    if (Number.isNaN(s) || Number.isNaN(e) || e <= s) {
      return res.status(400).json({ message: "Invalid time range" });
    }

    const groundDoc = await Ground.findById(cricsal).select(
      "ownerId pricePerHour name location"
    );

    if (!groundDoc) {
      return res.status(404).json({ message: "Cricsal/Ground not found" });
    }

    const paymentPreference =
      req.body.paymentPreference === "full" ? "full" : "advance_30";

    const advancePercent = paymentPreference === "advance_30" ? 30 : 100;

    const lockKey = makeAvailabilityKey(cricsal, date);

    const booking = await withBookingLock(lockKey, async () => {
      const existing = await Booking.find({
        cricsal,
        date,
        status: { $in: ACTIVE_BOOKING_STATUSES },
      }).select("startTime endTime status");

      const conflict = existing.find((b) =>
        overlaps(s, e, toMinutes(b.startTime), toMinutes(b.endTime))
      );

      if (conflict) {
        return res.status(409).json({
          message:
            conflict.status === "pending"
              ? "This slot is pending approval"
              : "This slot is already booked",
        });
      }

      const totalPrice = Number(groundDoc.pricePerHour || 0) * durationHours;

      return Booking.create({
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
        pointsEarned: 0,
        pointsRedeemed: 0,
        discountFromPoints: 0,
        loyaltyAwarded: false,
        loyaltyRedeemed: false,
        loyaltyPenaltyApplied: false,
        status: "pending",
      });
    });

    if (booking?.statusCode) {
      return booking;
    }

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

    await broadcastAvailabilityUpdate(cricsal, date);

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

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    booking.status = "cancelled";
    booking.cancelledAt = new Date();

    if (booking.loyaltyPenaltyApplied !== true) {
      const late = isLateCancellation(booking.date, booking.startTime);
      const penalty = late
        ? LOYALTY_RULES.LATE_CANCELLATION_PENALTY
        : LOYALTY_RULES.NORMAL_CANCELLATION_PENALTY;

      await applyLoyaltyPenalty({
        user,
        booking,
        points: penalty,
        description: late
          ? "Late cancellation penalty applied"
          : "Normal cancellation penalty applied",
      });

      booking.loyaltyPenaltyApplied = true;
    }

    await booking.save();

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

    await broadcastAvailabilityUpdate(
      booking.cricsal?._id || booking.cricsal,
      booking.date
    );

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

    const booked = await getAvailabilityPayload(cricsal, date);
    return res.json(booked);
  } catch (err) {
    console.error("GET BOOKED SLOTS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// LIVE SLOT STREAM
export const getBookedSlotsStream = async (req, res) => {
  const { cricsal, date } = req.query;

  if (!cricsal || !date) {
    return res.status(400).json({ message: "Missing cricsal/date" });
  }

  const key = makeAvailabilityKey(cricsal, date);
  const origin = req.headers.origin || "*";

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();

  if (!availabilityClients.has(key)) {
    availabilityClients.set(key, new Set());
  }

  availabilityClients.get(key).add(res);

  res.write(createSseMessage("connected", { ok: true }));

  try {
    const initialPayload = await getAvailabilityPayload(cricsal, date);
    res.write(createSseMessage("slots", initialPayload));
  } catch (error) {
    res.write(createSseMessage("error", { message: "Failed to load slots" }));
  }

  const heartbeat = setInterval(() => {
    res.write(": keep-alive\n\n");
  }, 25000);

  req.on("close", () => {
    clearInterval(heartbeat);

    const clients = availabilityClients.get(key);
    if (clients) {
      clients.delete(res);
      if (clients.size === 0) {
        availabilityClients.delete(key);
      }
    }

    res.end();
  });
};

// APPROVE BOOKING (owner)
export const approveBooking = async (req, res) => {
  try {
    const ownerId = req.user?._id || req.user?.id;
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("cricsal", "name location")
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (String(booking.ownerId) !== String(ownerId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const lockKey = makeAvailabilityKey(
      booking.cricsal?._id || booking.cricsal,
      booking.date
    );

    const result = await withBookingLock(lockKey, async () => {
      const freshBooking = await Booking.findById(id)
        .populate("cricsal", "name location")
        .populate("user", "name email");

      if (!freshBooking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      if (freshBooking.status === "cancelled") {
        return res
          .status(400)
          .json({ message: "Cancelled booking cannot be approved" });
      }

      const others = await Booking.find({
        _id: { $ne: freshBooking._id },
        cricsal: freshBooking.cricsal?._id || freshBooking.cricsal,
        date: freshBooking.date,
        status: "confirmed",
      }).select("startTime endTime");

      const hasConflict = others.some((b) =>
        overlaps(
          toMinutes(freshBooking.startTime),
          toMinutes(freshBooking.endTime),
          toMinutes(b.startTime),
          toMinutes(b.endTime)
        )
      );

      if (hasConflict) {
        return res.status(409).json({
          message: "This slot has already been confirmed for another booking",
        });
      }

      freshBooking.status = "confirmed";
      await freshBooking.save();
      return freshBooking;
    });

    if (result?.statusCode) {
      return result;
    }

    await createNotification({
      recipient: result.user._id,
      recipientRole: "user",
      type: "booking_approved",
      title: "Booking approved",
      message: `Your booking for ${
        result.cricsal?.name || "the ground"
      } on ${result.date} from ${result.startTime} to ${
        result.endTime
      } has been approved.`,
      link: "/my-bookings",
      data: {
        bookingId: result._id,
        cricsalId: result.cricsal?._id,
      },
    });

    if (result.user?.email) {
      await sendEmail({
        to: result.user.email,
        subject: `CricBook Booking Confirmed - ${
          result.cricsal?.name || "Ground"
        }`,
        html: bookingConfirmedEmail({
          userName: result.user?.name,
          groundName: result.cricsal?.name,
          groundLocation: result.cricsal?.location,
          date: result.date,
          startTime: result.startTime,
          endTime: result.endTime,
          totalPrice: result.totalPrice,
          paymentStatusLabel: result.paymentStatusLabel,
        }),
      });
    }

    await broadcastAvailabilityUpdate(
      result.cricsal?._id || result.cricsal,
      result.date
    );

    return res.json(result);
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
      .populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (String(booking.ownerId) !== String(ownerId)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    booking.status = "cancelled";
    await booking.save();

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

    if (booking.user?.email) {
      await sendEmail({
        to: booking.user.email,
        subject: `CricBook Booking Declined - ${booking.cricsal?.name || "Ground"}`,
        html: bookingDeclinedEmail({
          userName: booking.user?.name,
          groundName: booking.cricsal?.name,
          groundLocation: booking.cricsal?.location,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime,
          totalPrice: booking.totalPrice,
          paymentStatusLabel: booking.paymentStatusLabel,
        }),
      });
    }

    await broadcastAvailabilityUpdate(
      booking.cricsal?._id || booking.cricsal,
      booking.date
    );

    return res.json(booking);
  } catch (err) {
    console.error("DECLINE BOOKING ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};