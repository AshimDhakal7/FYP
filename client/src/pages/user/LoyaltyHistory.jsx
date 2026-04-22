import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

const LOYALTY_RULES = {
  FULL_PAYMENT_REWARD: 100,
  NORMAL_CANCELLATION_PENALTY: 40,
  LATE_CANCELLATION_PENALTY: 120,
  REDEEM_POINTS_REQUIRED: 1000,
  REDEEM_DISCOUNT_PERCENT: 60,
};

export default function LoyaltyHistory() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    loyaltyPoints: 0,
    totalEarned: 0,
    totalSpent: 0,
  });
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    "";

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [summaryRes, historyRes] = await Promise.all([
          fetch(`${API_BASE}/api/loyalty/me`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
          fetch(`${API_BASE}/api/loyalty/history`, {
            headers: { Authorization: `Bearer ${getToken()}` },
          }),
        ]);

        const summaryData = await summaryRes.json().catch(() => ({}));
        const historyData = await historyRes.json().catch(() => []);

        if (!summaryRes.ok) {
          throw new Error(
            summaryData?.message || "Failed to load loyalty summary"
          );
        }

        if (!historyRes.ok) {
          throw new Error("Failed to load loyalty history");
        }

        setSummary({
          loyaltyPoints: Number(summaryData?.loyaltyPoints || 0),
          totalEarned: Number(summaryData?.totalEarned || 0),
          totalSpent: Number(summaryData?.totalSpent || 0),
        });

        setHistory(Array.isArray(historyData) ? historyData : []);
      } catch (err) {
        console.error("LOYALTY HISTORY LOAD ERROR:", err);
        setError(err.message || "Failed to load loyalty history");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const pointsRemaining = useMemo(() => {
    return Math.max(
      0,
      LOYALTY_RULES.REDEEM_POINTS_REQUIRED - Number(summary?.loyaltyPoints || 0)
    );
  }, [summary]);

  const canRedeem = useMemo(() => {
    return Number(summary?.loyaltyPoints || 0) >= LOYALTY_RULES.REDEEM_POINTS_REQUIRED;
  }, [summary]);

  const visibleStats = useMemo(() => {
    const items = [
      {
        label: "Balance",
        value: Number(summary?.loyaltyPoints || 0),
      },
    ];

    if (Number(summary?.totalEarned || 0) > 0) {
      items.push({
        label: "Earned",
        value: Number(summary?.totalEarned || 0),
      });
    }

    if (Number(summary?.totalSpent || 0) > 0) {
      items.push({
        label: "Spent / Lost",
        value: Number(summary?.totalSpent || 0),
      });
    }

    return items;
  }, [summary]);

  const typeLabel = (item) => {
    if (item.type === "earn") return "Earned";
    if (item.type === "redeem") return "Redeemed";
    if (item.type === "penalty") return "Penalty";
    if (item.type === "refund") return "Refund";
    return "Bonus";
  };

  const typeTone = (item) => {
    if (item.type === "earn") {
      return {
        badge: "bg-green-50 text-green-700 border-green-100",
        amount: "text-green-700",
      };
    }
    if (item.type === "redeem") {
      return {
        badge: "bg-purple-50 text-purple-700 border-purple-100",
        amount: "text-red-700",
      };
    }
    if (item.type === "penalty") {
      return {
        badge: "bg-red-50 text-red-700 border-red-100",
        amount: "text-red-700",
      };
    }
    if (item.type === "refund") {
      return {
        badge: "bg-blue-50 text-blue-700 border-blue-100",
        amount: "text-green-700",
      };
    }
    return {
      badge: "bg-amber-50 text-amber-700 border-amber-100",
      amount: "text-green-700",
    };
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
              Rewards
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900">
              Loyalty History
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              A clean overview of your points balance, rewards, penalties, and redemptions.
            </p>
          </div>

          <Link
            to="/profile"
            className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Back to Profile
          </Link>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
            <p className="text-sm font-medium text-gray-700">
              Loading loyalty history...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
            <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                    Current Wallet
                  </p>
                  <p className="mt-3 text-5xl font-semibold tracking-tight text-gray-900">
                    {summary.loyaltyPoints}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Available loyalty points
                  </p>

                  <div className="mt-6 h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gray-900 transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (Number(summary?.loyaltyPoints || 0) /
                            LOYALTY_RULES.REDEEM_POINTS_REQUIRED) *
                            100
                        )}%`,
                      }}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <span>0</span>
                    <span>{LOYALTY_RULES.REDEEM_POINTS_REQUIRED} points</span>
                  </div>
                </div>

                <div className="rounded-3xl border border-gray-200 bg-[#fafafa] p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                    Redemption
                  </p>

                  {canRedeem ? (
                    <>
                      <p className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
                        Reward unlocked
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        You can redeem {LOYALTY_RULES.REDEEM_POINTS_REQUIRED} points
                        for {LOYALTY_RULES.REDEEM_DISCOUNT_PERCENT}% off on a full-payment booking.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="mt-3 text-2xl font-semibold tracking-tight text-gray-900">
                        {pointsRemaining} points left
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-500">
                        Full payment earns {LOYALTY_RULES.FULL_PAYMENT_REWARD} points.
                      </p>
                    </>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <RulePill text={`+${LOYALTY_RULES.FULL_PAYMENT_REWARD} full payment`} />
                    <RulePill text={`-${LOYALTY_RULES.NORMAL_CANCELLATION_PENALTY} cancel`} />
                    <RulePill text={`-${LOYALTY_RULES.LATE_CANCELLATION_PENALTY} late cancel`} />
                  </div>
                </div>
              </div>
            </div>

            <div className={`mb-6 grid gap-4 ${visibleStats.length === 1 ? "md:grid-cols-1" : visibleStats.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
              {visibleStats.map((item) => (
                <MinimalStatCard
                  key={item.label}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </div>

            <div className="rounded-[28px] border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                    Transactions
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    A record of all meaningful loyalty activity.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-[#fafafa] px-4 py-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
                    Records
                  </p>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {history.length}
                  </p>
                </div>
              </div>

              {history.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-gray-300 bg-[#fafafa] p-14 text-center">
                  <p className="text-lg font-medium text-gray-900">
                    No loyalty activity yet
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Your rewards, redemptions, and penalties will appear here.
                  </p>
                  <Link
                    to="/find-cricsal"
                    className="mt-6 inline-flex rounded-2xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-black"
                  >
                    Start Booking
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {history.map((item) => {
                    const tone = typeTone(item);

                    return (
                      <div
                        key={item._id}
                        className="rounded-3xl border border-gray-200 bg-[#fcfcfc] p-5 transition hover:bg-white"
                      >
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-semibold ${tone.badge}`}
                              >
                                {typeLabel(item)}
                              </span>
                            </div>

                            <p className="mt-4 text-base font-medium text-gray-900">
                              {item.description || "No description"}
                            </p>

                            {item.booking && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600">
                                  {item.booking.date || "N/A"}
                                </span>
                                <span className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600">
                                  {item.booking.startTime || "--"} - {item.booking.endTime || "--"}
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="md:min-w-[160px] md:text-right">
                            <p className={`text-2xl font-semibold ${tone.amount}`}>
                              {item.direction === "credit" ? (
                                <span className="text-green-700">+{item.points}</span>
                              ) : (
                                <span className="text-red-700">-{item.points}</span>
                              )}
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                              {item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString()
                                : ""}
                            </p>

                            {item.balanceAfter != null && (
                              <p className="mt-3 text-xs text-gray-500">
                                Balance after:{" "}
                                <span className="font-semibold text-gray-900">
                                  {item.balanceAfter}
                                </span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function MinimalStatCard({ label, value }) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
        {label}
      </p>
      <p className="mt-3 text-4xl font-semibold tracking-tight text-gray-900">
        {value}
      </p>
    </div>
  );
}

function RulePill({ text }) {
  return (
    <span className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700">
      {text}
    </span>
  );
}