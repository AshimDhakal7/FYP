import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // ✅ link booking to a real Cricsal document
    cricsal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ground",
      required: true,
    },

    date: { type: String, required: true },      // YYYY-MM-DD
    startTime: { type: String, required: true }, // 07:00
    endTime: { type: String, required: true },   // 08:00

    durationHours: { type: Number, required: true, enum: [1, 2, 3] },

    status: {
      type: String,
      default: "confirmed",
      enum: ["confirmed", "cancelled"],
    },
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// ✅ Prevent double-booking for same cricsal+date+slot (confirmed only)
BookingSchema.index(
  { cricsal: 1, date: 1, startTime: 1, endTime: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "confirmed" } }
);

export default mongoose.model("Booking", BookingSchema);