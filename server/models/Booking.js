
// import mongoose from "mongoose";

// const bookingSchema = new mongoose.Schema(
//   {
//     cricsal: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Ground",
//       required: true,
//     },

//     ground: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Ground",
//     },

//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

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

//     isPaid: {
//       type: Boolean,
//       default: false,
//     },

//     paymentPreference: {
//       type: String,
//       enum: ["advance_30", "full"],
//       default: "advance_30",
//     },

//     advancePercent: {
//       type: Number,
//       default: 30,
//     },

//     amountPaid: {
//       type: Number,
//       default: 0,
//     },

//     paymentStatusLabel: {
//       type: String,
//       default: "",
//     },

//     paymentMethod: {
//       type: String,
//       default: "",
//     },

//     khaltiPidx: {
//       type: String,
//       default: "",
//     },

//     paidAt: {
//       type: Date,
//       default: null,
//     },

//     status: {
//       type: String,
//       enum: ["pending", "confirmed", "cancelled"],
//       default: "pending",
//     },

//     cancelledAt: {
//       type: Date,
//     },

//     pointsEarned: {
//       type: Number,
//       default: 0,
//     },
//     pointsRedeemed: {
//       type: Number,
//       default: 0,
//     },
//     discountApplied: {
//       type: Number,
//       default: 0,
//     },
//     rewardStatus: {
//       type: String,
//       enum: ["none", "earned", "reversed"],
//       default: "none",
//     },

//   },
//   { timestamps: true }
// );

// export default mongoose.model("Booking", bookingSchema);


import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    cricsal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ground",
      required: true,
    },

    ground: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ground",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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

    paymentPreference: {
      type: String,
      enum: ["advance_30", "full"],
      default: "advance_30",
    },

    advancePercent: {
      type: Number,
      default: 30,
    },

    amountPaid: {
      type: Number,
      default: 0,
    },

    paymentStatusLabel: {
      type: String,
      default: "",
    },

    paymentMethod: {
      type: String,
      default: "",
    },

    khaltiPidx: {
      type: String,
      default: "",
    },

    paidAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },

    cancelledAt: {
      type: Date,
    },

    pointsEarned: {
      type: Number,
      default: 0,
      min: 0,
    },

    pointsRedeemed: {
      type: Number,
      default: 0,
      min: 0,
    },

    discountApplied: {
      type: Number,
      default: 0,
      min: 0,
    },

    rewardStatus: {
      type: String,
      enum: ["none", "earned", "reversed"],
      default: "none",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);