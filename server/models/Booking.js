// import mongoose from "mongoose";

// const BookingSchema = new mongoose.Schema(
//   {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

//     // if you have a Cricsal/Ground model, use ref:
//     cricsal: { type: String, required: true }, // e.g. "g2" (your UI shows g2)

//     date: { type: String, required: true }, // store "YYYY-MM-DD" (easy)
//     startTime: { type: String, required: true }, // "07:00"
//     endTime: { type: String, required: true },   // "08:00"

//     durationHours: { type: Number, required: true, enum: [1, 2, 3] },

//     status: { type: String, default: "confirmed", enum: ["confirmed", "cancelled"] },
//     cancelledAt: { type: Date, default: null },
//   },
//   { timestamps: true }
// );

// // Prevent double-booking for same cricsal + date + time slot (only if confirmed)
// BookingSchema.index(
//   { cricsal: 1, date: 1, startTime: 1, endTime: 1, status: 1 },
//   { unique: true, partialFilterExpression: { status: "confirmed" } }
// );

// export default mongoose.model("Booking", BookingSchema);

import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // ✅ link booking to a real Ground document
    ground: { type: mongoose.Schema.Types.ObjectId, ref: "Ground", required: true },

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

// Prevent double-booking for same ground+date+slot (confirmed only)
BookingSchema.index(
  { ground: 1, date: 1, startTime: 1, endTime: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "confirmed" } }
);

export default mongoose.model("Booking", BookingSchema);
