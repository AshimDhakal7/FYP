

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    // which ground was booked
    cricsal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ground",
      required: true,
    },

    // (optional alias — safe to keep)
    ground: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ground",
    },

    // player who booked
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ⭐⭐⭐ MOST IMPORTANT FIELD (OWNER DASHBOARD USES THIS)
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    date: {
      type: String,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    durationHours: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      default: 0,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    }, // ✅ FIXED (comma added)

    cancelledAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);