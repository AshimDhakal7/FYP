import mongoose from "mongoose";

const loyaltyTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
      index: true,
    },

    type: {
      type: String,
      enum: ["earn", "redeem", "refund", "bonus"],
      required: true,
    },

    points: {
      type: Number,
      required: true,
      min: 0,
    },

    amountValue: {
      type: Number,
      default: 0,
      min: 0,
    },

    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("LoyaltyTransaction", loyaltyTransactionSchema);