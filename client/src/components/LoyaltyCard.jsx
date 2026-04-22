import React, { useMemo } from "react";
import { Link } from "react-router-dom";

const LOYALTY_RULES = {
  FULL_PAYMENT_REWARD: 100,
  NORMAL_CANCELLATION_PENALTY: 40,
  LATE_CANCELLATION_PENALTY: 120,
  REDEEM_POINTS_REQUIRED: 1000,
  REDEEM_DISCOUNT_PERCENT: 60,
};

export default function LoyaltyCard({ loyaltyPoints = 0 }) {
  const points = Number(loyaltyPoints || 0);

  const canRedeem = points >= LOYALTY_RULES.REDEEM_POINTS_REQUIRED;

  const remaining = Math.max(
    0,
    LOYALTY_RULES.REDEEM_POINTS_REQUIRED - points
  );

  const progress = Math.min(
    100,
    (points / LOYALTY_RULES.REDEEM_POINTS_REQUIRED) * 100
  );

  const statusText = useMemo(() => {
    if (canRedeem) {
      return `You can now redeem ${LOYALTY_RULES.REDEEM_POINTS_REQUIRED} points for ${LOYALTY_RULES.REDEEM_DISCOUNT_PERCENT}% off on a full-payment booking.`;
    }

    return `Earn ${remaining} more points to unlock your ${LOYALTY_RULES.REDEEM_DISCOUNT_PERCENT}% discount reward.`;
  }, [canRedeem, remaining]);

  return (
    <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(16,24,40,0.08)]">
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-green-900 px-6 py-6 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-green-300">
              CricBook Rewards
            </p>
            <h3 className="mt-2 text-2xl font-black tracking-tight">
              Loyalty Wallet
            </h3>
            <p className="mt-2 max-w-xl text-sm text-gray-300">
              Earn points on successful full payments and unlock premium discounts on future bookings.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 px-5 py-4 backdrop-blur">
            <p className="text-xs font-bold uppercase tracking-wider text-green-200">
              Available Balance
            </p>
            <p className="mt-2 text-4xl font-black">{points}</p>
            <p className="mt-1 text-xs text-gray-300">Active loyalty points</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <MiniInfoCard
            label="Full Payment Reward"
            value={`+${LOYALTY_RULES.FULL_PAYMENT_REWARD}`}
            tone="green"
          />
          <MiniInfoCard
            label="Normal Cancellation"
            value={`-${LOYALTY_RULES.NORMAL_CANCELLATION_PENALTY}`}
            tone="amber"
          />
          <MiniInfoCard
            label="Late Cancellation"
            value={`-${LOYALTY_RULES.LATE_CANCELLATION_PENALTY}`}
            tone="red"
          />
        </div>

        <div className="mt-6 rounded-[24px] border border-gray-100 bg-gradient-to-br from-green-50 to-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-green-700">
                Redemption Goal
              </p>
              <p className="mt-2 text-2xl font-black text-gray-900">
                {LOYALTY_RULES.REDEEM_POINTS_REQUIRED} points ={" "}
                {LOYALTY_RULES.REDEEM_DISCOUNT_PERCENT}% off
              </p>
              <p className="mt-2 text-sm text-gray-600">{statusText}</p>
            </div>

            <div
              className={`rounded-2xl px-4 py-3 text-sm font-bold ${
                canRedeem
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {canRedeem ? "Reward Unlocked" : `${remaining} pts left`}
            </div>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs font-semibold text-gray-500">
              <span>Progress</span>
              <span>
                {points}/{LOYALTY_RULES.REDEEM_POINTS_REQUIRED}
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-700 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/find-cricsal"
            className="rounded-2xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
          >
            Book & Earn More
          </Link>

          <Link
            to="/loyalty"
            className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
          >
            View Loyalty History
          </Link>
        </div>
      </div>
    </div>
  );
}

function MiniInfoCard({ label, value, tone = "green" }) {
  const tones = {
    green: "border-green-100 bg-green-50 text-green-800",
    amber: "border-amber-100 bg-amber-50 text-amber-800",
    red: "border-red-100 bg-red-50 text-red-800",
  };

  return (
    <div className={`rounded-2xl border p-4 ${tones[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-wider opacity-80">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
    </div>
  );
}