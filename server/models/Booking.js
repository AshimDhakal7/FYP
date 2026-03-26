// // // import mongoose from "mongoose";
// // // // import mongoose from "mongoose";

// // // const bookingSchema = new mongoose.Schema(
// // //   {
// // //     courtId: { type: mongoose.Schema.Types.ObjectId, ref: "Court", required: true },

// // //     // IMPORTANT: set ownerId when booking is created (from court.ownerId)
// // //     ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

// // //     userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

// // //     date: { type: String, required: true },      // e.g. "2026-03-02"
// // //     startTime: { type: String, required: true }, // e.g. "18:00"
// // //     endTime: { type: String, required: true },   // e.g. "19:00"
// // //     hours: { type: Number, default: 1 },

// // //     totalPrice: { type: Number, default: 0 },

// // //     status: {
// // //       type: String,
// // //       enum: ["confirmed", "cancelled"],
// // //       default: "confirmed",
// // //     },
// // //   },
// // //   { timestamps: true }
// // // );

// // // // Prevent duplicate booking for same court/date/time (basic)
// // // bookingSchema.index({ courtId: 1, date: 1, startTime: 1, endTime: 1 }, { unique: true });

// // // // export default mongoose.model("Booking", bookingSchema);

// // // const BookingSchema = new mongoose.Schema(
// // //   {
// // //     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

// // //     // ✅ link booking to a real Cricsal document
// // //     cricsal: {
// // //       type: mongoose.Schema.Types.ObjectId,
// // //       ref: "Ground",
// // //       required: true,
// // //     },

// // //     date: { type: String, required: true },      // YYYY-MM-DD
// // //     startTime: { type: String, required: true }, // 07:00
// // //     endTime: { type: String, required: true },   // 08:00

// // //     durationHours: { type: Number, required: true, enum: [1, 2, 3] },

// // //     status: {
// // //       type: String,
// // //       default: "confirmed",
// // //       enum: ["confirmed", "cancelled"],
// // //     },
// // //     cancelledAt: { type: Date, default: null },
// // //   },
// // //   { timestamps: true }
// // // );

// // // // ✅ Prevent double-booking for same cricsal+date+slot (confirmed only)
// // // BookingSchema.index(
// // //   { cricsal: 1, date: 1, startTime: 1, endTime: 1, status: 1 },
// // //   { unique: true, partialFilterExpression: { status: "confirmed" } }
// // // );

// // // export default mongoose.model("Booking", BookingSchema);

// // import mongoose from "mongoose";

// // const bookingSchema = new mongoose.Schema(
// //   {
// //     groundId: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "Ground",
// //       required: true,
// //     },

// //     // owner of the ground (VERY IMPORTANT for dashboard)
// //     ownerId: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "User",
// //       required: true,
// //     },

// //     userId: {
// //       type: mongoose.Schema.Types.ObjectId,
// //       ref: "User",
// //       required: true,
// //     },

// //     date: { type: String, required: true },
// //     startTime: { type: String, required: true },
// //     endTime: { type: String, required: true },

// //     hours: { type: Number, default: 1 },
// //     totalPrice: { type: Number, default: 0 },

// //     status: {
// //       type: String,
// //       enum: ["confirmed", "cancelled"],
// //       default: "confirmed",
// //     },
// //   },
// //   { timestamps: true }
// // );

// // export default mongoose.model("Booking", bookingSchema);

// import mongoose from "mongoose";

// const bookingSchema = new mongoose.Schema(
//   {
//     // which ground was booked
//     cricsal: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Ground",
//       required: true,
//     },

//     // (optional alias — safe to keep)
//     ground: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Ground",
//     },

//     // player who booked
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // ⭐⭐⭐ MOST IMPORTANT FIELD (OWNER DASHBOARD USES THIS)
//     ownerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },

//     date: {
//       type: String,
//       required: true,
//     },

//     startTime: {
//       type: String,
//       required: true,
//     },

//     endTime: {
//       type: String,
//       required: true,
//     },

//     durationHours: {
//       type: Number,
//       required: true,
//     },

//     totalPrice: {
//       type: Number,
//       default: 0,
//     },

//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "cancelled"],
//       default: "pending",
//     }

//     cancelledAt: Date,
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Booking", bookingSchema);


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