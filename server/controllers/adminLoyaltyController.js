import LoyaltySettings from "../models/LoyaltySettings.js";

const DEFAULT_SETTINGS = {
  enabled: true,
  fullPaymentRewardPoints: 100,
  normalCancellationPenalty: 40,
  lateCancellationPenalty: 120,
  lateCancellationWindowHours: 2,
  redeemThresholdPoints: 1000,
  redeemDiscountPercent: 60,
  fullPaymentOnlyRedemption: true,
  preventNegativeBalance: true,
  awardOnlyOncePerBooking: true,
  penaltyOnlyOncePerBooking: true,
  userFacingDescription:
    "Earn loyalty points on full payment bookings and redeem rewards on eligible future bookings.",
  cancellationPolicyNote:
    "Normal cancellation deducts points. Late cancellation within the configured time window deducts more points.",
  redemptionNote:
    "Redeem points on full-payment bookings to unlock a discount.",
};

const getOrCreateSettings = async () => {
  let settings = await LoyaltySettings.findOne();

  if (!settings) {
    settings = await LoyaltySettings.create(DEFAULT_SETTINGS);
  }

  return settings;
};

export const getAdminLoyaltySettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    return res.json(settings);
  } catch (err) {
    console.error("GET ADMIN LOYALTY SETTINGS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateAdminLoyaltySettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings();

    const payload = {
      enabled:
        typeof req.body.enabled === "boolean"
          ? req.body.enabled
          : settings.enabled,

      fullPaymentRewardPoints: Number(
        req.body.fullPaymentRewardPoints ?? settings.fullPaymentRewardPoints
      ),

      normalCancellationPenalty: Number(
        req.body.normalCancellationPenalty ?? settings.normalCancellationPenalty
      ),

      lateCancellationPenalty: Number(
        req.body.lateCancellationPenalty ?? settings.lateCancellationPenalty
      ),

      lateCancellationWindowHours: Number(
        req.body.lateCancellationWindowHours ??
          settings.lateCancellationWindowHours
      ),

      redeemThresholdPoints: Number(
        req.body.redeemThresholdPoints ?? settings.redeemThresholdPoints
      ),

      redeemDiscountPercent: Number(
        req.body.redeemDiscountPercent ?? settings.redeemDiscountPercent
      ),

      fullPaymentOnlyRedemption:
        typeof req.body.fullPaymentOnlyRedemption === "boolean"
          ? req.body.fullPaymentOnlyRedemption
          : settings.fullPaymentOnlyRedemption,

      preventNegativeBalance:
        typeof req.body.preventNegativeBalance === "boolean"
          ? req.body.preventNegativeBalance
          : settings.preventNegativeBalance,

      awardOnlyOncePerBooking:
        typeof req.body.awardOnlyOncePerBooking === "boolean"
          ? req.body.awardOnlyOncePerBooking
          : settings.awardOnlyOncePerBooking,

      penaltyOnlyOncePerBooking:
        typeof req.body.penaltyOnlyOncePerBooking === "boolean"
          ? req.body.penaltyOnlyOncePerBooking
          : settings.penaltyOnlyOncePerBooking,

      userFacingDescription:
        String(
          req.body.userFacingDescription ?? settings.userFacingDescription
        ).trim(),

      cancellationPolicyNote:
        String(
          req.body.cancellationPolicyNote ?? settings.cancellationPolicyNote
        ).trim(),

      redemptionNote: String(
        req.body.redemptionNote ?? settings.redemptionNote
      ).trim(),
    };

    if (payload.fullPaymentRewardPoints < 0) {
      return res
        .status(400)
        .json({ message: "Full payment reward points cannot be negative" });
    }

    if (payload.normalCancellationPenalty < 0) {
      return res
        .status(400)
        .json({ message: "Normal cancellation penalty cannot be negative" });
    }

    if (payload.lateCancellationPenalty < 0) {
      return res
        .status(400)
        .json({ message: "Late cancellation penalty cannot be negative" });
    }

    if (payload.lateCancellationWindowHours < 0) {
      return res
        .status(400)
        .json({ message: "Late cancellation window cannot be negative" });
    }

    if (payload.redeemThresholdPoints <= 0) {
      return res
        .status(400)
        .json({ message: "Redeem threshold must be greater than 0" });
    }

    if (
      payload.redeemDiscountPercent < 0 ||
      payload.redeemDiscountPercent > 100
    ) {
      return res
        .status(400)
        .json({ message: "Redeem discount percent must be between 0 and 100" });
    }

    Object.assign(settings, payload);
    await settings.save();

    return res.json(settings);
  } catch (err) {
    console.error("UPDATE ADMIN LOYALTY SETTINGS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetAdminLoyaltySettings = async (req, res) => {
  try {
    let settings = await LoyaltySettings.findOne();

    if (!settings) {
      settings = await LoyaltySettings.create(DEFAULT_SETTINGS);
    } else {
      Object.assign(settings, DEFAULT_SETTINGS);
      await settings.save();
    }

    return res.json(settings);
  } catch (err) {
    console.error("RESET ADMIN LOYALTY SETTINGS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};