import LoyaltyTransaction from "../models/LoyaltyTransaction.js";

export const LOYALTY_RULES = {
  FULL_PAYMENT_REWARD: 100,
  ADVANCE_PAYMENT_REWARD: 0,
  NORMAL_CANCELLATION_PENALTY: 40,
  LATE_CANCELLATION_PENALTY: 120,
  REDEEM_POINTS_REQUIRED: 1000,
  REDEEM_DISCOUNT_PERCENT: 60,
  LATE_CANCELLATION_WINDOW_HOURS: 2,
};

export const applyLoyaltyPoints = async ({
  user,
  booking = null,
  type,
  points,
  direction,
  amountValue = 0,
  description = "",
}) => {
  const currentBalance = Number(user?.loyaltyPoints || 0);

  let nextBalance =
    direction === "credit"
      ? currentBalance + Number(points || 0)
      : currentBalance - Number(points || 0);

  nextBalance = Math.max(0, nextBalance);

  user.loyaltyPoints = nextBalance;
  await user.save();

  await LoyaltyTransaction.create({
    user: user._id,
    booking,
    type,
    points: Number(points || 0),
    direction,
    balanceAfter: nextBalance,
    amountValue: Number(amountValue || 0),
    description,
  });

  return nextBalance;
};

export const canRedeemLoyalty = (user) => {
  return Number(user?.loyaltyPoints || 0) >= LOYALTY_RULES.REDEEM_POINTS_REQUIRED;
};

export const getLoyaltyDiscountAmount = (totalPrice) => {
  const total = Number(totalPrice || 0);
  return Math.round((total * LOYALTY_RULES.REDEEM_DISCOUNT_PERCENT) / 100);
};

export const isLateCancellation = (bookingDate, startTime) => {
  if (!bookingDate || !startTime) return false;

  const [hours, minutes] = String(startTime).split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return false;

  const gameStart = new Date(`${bookingDate}T${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:00`);

  const now = new Date();
  const diffMs = gameStart.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours <= LOYALTY_RULES.LATE_CANCELLATION_WINDOW_HOURS;
};