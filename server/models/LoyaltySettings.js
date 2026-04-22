import mongoose from "mongoose";

const loyaltySettingsSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: true,
    },

    fullPaymentRewardPoints: {
      type: Number,
      default: 100,
      min: 0,
    },

    normalCancellationPenalty: {
      type: Number,
      default: 40,
      min: 0,
    },

    lateCancellationPenalty: {
      type: Number,
      default: 120,
      min: 0,
    },

    lateCancellationWindowHours: {
      type: Number,
      default: 2,
      min: 0,
    },

    redeemThresholdPoints: {
      type: Number,
      default: 1000,
      min: 1,
    },

    redeemDiscountPercent: {
      type: Number,
      default: 60,
      min: 0,
      max: 100,
    },

    fullPaymentOnlyRedemption: {
      type: Boolean,
      default: true,
    },

    preventNegativeBalance: {
      type: Boolean,
      default: true,
    },

    awardOnlyOncePerBooking: {
      type: Boolean,
      default: true,
    },

    penaltyOnlyOncePerBooking: {
      type: Boolean,
      default: true,
    },

    userFacingDescription: {
      type: String,
      default:
        "Earn loyalty points on full payment bookings and redeem rewards on eligible future bookings.",
      trim: true,
    },

    cancellationPolicyNote: {
      type: String,
      default:
        "Normal cancellation deducts points. Late cancellation within the configured time window deducts more points.",
      trim: true,
    },

    redemptionNote: {
      type: String,
      default:
        "Redeem points on full-payment bookings to unlock a discount.",
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("LoyaltySettings", loyaltySettingsSchema);