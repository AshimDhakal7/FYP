import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Your frontend uses ids like "g1", so keep it as String
    groundId: {
      type: String,
      required: true,
      trim: true,
    },

    // optional (nice for UI)
    groundName: { type: String, default: "" },
    area: { type: String, default: "" },
    price: { type: Number, default: 0 },

    date: { type: String, required: true }, // "2026-01-22" or "22/01/2026"
    slot: { type: String, required: true }, // "08:00 - 09:00"
    duration: { type: Number, default: 1 },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "confirmed",
    },
  },
  { timestamps: true }
);

// prevent duplicate bookings for same user + groundId + date + slot
bookingSchema.index({ user: 1, groundId: 1, date: 1, slot: 1 }, { unique: true });

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
