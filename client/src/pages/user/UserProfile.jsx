import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const LOYALTY_RULES = {
  FULL_PAYMENT_REWARD: 100,
  NORMAL_CANCELLATION_PENALTY: 40,
  LATE_CANCELLATION_PENALTY: 120,
  REDEEM_POINTS_REQUIRED: 1000,
  REDEEM_DISCOUNT_PERCENT: 60,
};

export default function UserProfile() {
  const location = useLocation();
  const firstLoadRef = useRef(true);

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [loyaltySummary, setLoyaltySummary] = useState({
    loyaltyPoints: 0,
    totalEarned: 0,
    totalSpent: 0,
  });

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    "";

  const authHeaders = () => {
    const token = getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const loadUserFromStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? JSON.parse(raw) : null;
      setUser((prev) => {
        const next = parsed || null;
        if (JSON.stringify(prev) === JSON.stringify(next)) return prev;
        return next;
      });
    } catch {
      setUser(null);
    }
  }, []);

  const loadBookings = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setStatsLoading(true);

      const token = getToken();
      if (!token) {
        setBookings([]);
        return;
      }

      const res = await fetch(`${API_BASE}/api/bookings/me`, {
        headers: authHeaders(),
      });

      if (!res.ok) {
        setBookings([]);
        return;
      }

      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.bookings || [];

      setBookings((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(list)) return prev;
        return list;
      });
    } catch (err) {
      console.error("PROFILE BOOKINGS LOAD ERROR:", err);
      setBookings([]);
    } finally {
      if (!silent) setStatsLoading(false);
    }
  }, []);

  const loadLoyaltySummary = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setStatsLoading(true);

      const token = getToken();
      if (!token) {
        setLoyaltySummary({
          loyaltyPoints: 0,
          totalEarned: 0,
          totalSpent: 0,
        });
        return;
      }

      const res = await fetch(`${API_BASE}/api/loyalty/me`, {
        headers: authHeaders(),
      });

      if (!res.ok) return;

      const data = await res.json().catch(() => ({}));

      const nextSummary = {
        loyaltyPoints: Number(data?.loyaltyPoints || 0),
        totalEarned: Number(data?.totalEarned || 0),
        totalSpent: Number(data?.totalSpent || 0),
      };

      setLoyaltySummary((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(nextSummary)) return prev;
        return nextSummary;
      });
    } catch (err) {
      console.error("PROFILE LOYALTY LOAD ERROR:", err);
    } finally {
      if (!silent) setStatsLoading(false);
    }
  }, []);

  const refreshAll = useCallback(
    async ({ silent = false } = {}) => {
      loadUserFromStorage();
      await Promise.all([
        loadBookings({ silent }),
        loadLoyaltySummary({ silent }),
      ]);
    },
    [loadUserFromStorage, loadBookings, loadLoyaltySummary]
  );

  useEffect(() => {
    const run = async () => {
      await refreshAll({ silent: false });
      firstLoadRef.current = false;
    };
    run();
  }, [refreshAll, location.pathname]);

  useEffect(() => {
    const handleFocus = () => {
      refreshAll({ silent: true });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshAll({ silent: true });
      }
    };

    const handleProfileUpdated = () => {
      refreshAll({ silent: true });
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("user-profile-updated", handleProfileUpdated);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("user-profile-updated", handleProfileUpdated);
    };
  }, [refreshAll]);

  const computedStats = useMemo(() => {
    const totalBookings = bookings.length;
    const paidBookings = bookings.filter((b) => b?.isPaid).length;
    const totalPointsRedeemedFromBookings = bookings.reduce(
      (sum, b) => sum + Number(b?.pointsRedeemed || 0),
      0
    );
    const totalDiscountUsed = bookings.reduce(
      (sum, b) => sum + Number(b?.discountFromPoints || 0),
      0
    );

    return {
      totalBookings,
      paidBookings,
      totalPointsRedeemedFromBookings,
      totalDiscountUsed,
    };
  }, [bookings]);

  const safeUser = useMemo(() => {
    return {
      name: user?.name || "User",
      email: user?.email || "user@email.com",
      contact: user?.contactnumber || user?.phone || "Not added",
      role: user?.role || "user",
      profilePicture: user?.profilePicture || "",
      loyaltyPoints: Number(
        loyaltySummary?.loyaltyPoints || user?.loyaltyPoints || 0
      ),
    };
  }, [user, loyaltySummary]);

  const firstName = useMemo(() => {
    const raw = safeUser?.name || safeUser?.email || "User";
    return String(raw).split(" ")[0].split("@")[0];
  }, [safeUser]);

  const initials = useMemo(() => {
    const raw = String(safeUser?.name || safeUser?.email || "User").trim();
    const parts = raw.split(" ").filter(Boolean);
    const a = parts[0]?.[0] || raw[0] || "U";
    const b = parts[1]?.[0] || "";
    return (a + b).toUpperCase();
  }, [safeUser]);

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "Recently joined";
    const d = new Date(user.createdAt);
    if (Number.isNaN(d.getTime())) return "Recently joined";
    return d.toLocaleDateString();
  }, [user]);

  const canRedeem = useMemo(() => {
    return (
      Number(safeUser?.loyaltyPoints || 0) >=
      LOYALTY_RULES.REDEEM_POINTS_REQUIRED
    );
  }, [safeUser]);

  const pointsRemaining = useMemo(() => {
    return Math.max(
      0,
      LOYALTY_RULES.REDEEM_POINTS_REQUIRED -
        Number(safeUser?.loyaltyPoints || 0)
    );
  }, [safeUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 px-4 py-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-green-700">
              My Account
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900">
              Profile Overview
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Manage your account details, bookings, and loyalty rewards in one place.
            </p>
          </div>

          <Link
            to="/home"
            className="rounded-2xl border border-green-200 bg-white px-5 py-3 text-sm font-semibold text-green-700 shadow-sm transition hover:bg-green-50"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-12">
          <aside className="xl:col-span-4">
            <div className="overflow-hidden rounded-[30px] border border-green-100 bg-white shadow-[0_18px_50px_rgba(22,101,52,0.08)]">
              <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 px-6 py-7 text-white">
                <div className="flex items-start gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-white/15 text-2xl font-bold">
                    {safeUser.profilePicture ? (
                      <img
                        src={
                          safeUser.profilePicture?.startsWith("http")
                            ? safeUser.profilePicture
                            : `http://localhost:5001${safeUser.profilePicture}`
                        }
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-2xl font-black">{safeUser.name}</p>
                    <p className="mt-1 truncate text-sm text-green-50">
                      {safeUser.email}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                        {safeUser.role}
                      </span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                        Joined {memberSince}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-100">
                    Contact Number
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">
                    {safeUser.contact}
                  </p>
                  <p className="mt-1 text-xs text-green-50/90">
                    Permanently visible for quick access.
                  </p>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-3">
                  <Link
                    to="/profile/edit"
                    className="flex items-center justify-center rounded-2xl bg-green-700 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-800"
                  >
                    ✏️ Update Profile
                  </Link>

                  <Link
                    to="/bookings"
                    className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-semibold text-gray-800 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                  >
                    📅 My Bookings
                  </Link>

                  <Link
                    to="/find-cricsal"
                    className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-semibold text-gray-800 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                  >
                    🏏 Find Cricsal
                  </Link>

                  <Link
                    to="/loyalty"
                    className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-semibold text-gray-800 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                  >
                    ⭐ Loyalty History
                  </Link>

                  <Link
                    to="/support"
                    className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-semibold text-gray-800 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                  >
                    💬 Support
                  </Link>
                </div>

                <div className="mt-6 rounded-3xl border border-green-100 bg-green-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-green-700">
                    Loyalty Balance
                  </p>
                  <p className="mt-2 text-4xl font-black text-green-900">
                    {safeUser.loyaltyPoints}
                  </p>
                  <p className="mt-2 text-sm text-green-700">
                    Reward points available now.
                  </p>
                </div>

                <div className="mt-4 rounded-3xl border border-emerald-100 bg-emerald-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
                    Redemption Status
                  </p>
                  {canRedeem ? (
                    <p className="mt-2 text-sm font-semibold text-emerald-800">
                      Reward unlocked. You can redeem 1000 points for 60% off.
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-emerald-800">
                      {pointsRemaining} more points needed to unlock 60% off.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-6 xl:col-span-8">
            <div className="grid gap-4 md:grid-cols-4">
              <ThemeStatCard
                title="Bookings"
                value={statsLoading ? "..." : computedStats.totalBookings}
                subtitle="Total bookings"
              />
              <ThemeStatCard
                title="Points"
                value={statsLoading ? "..." : safeUser.loyaltyPoints}
                subtitle="Available balance"
                accent="green"
              />
              <ThemeStatCard
                title="Paid"
                value={statsLoading ? "..." : computedStats.paidBookings}
                subtitle="Completed payments"
              />
              <ThemeStatCard
                title="Saved"
                value={statsLoading ? "..." : `Rs ${computedStats.totalDiscountUsed}`}
                subtitle="Discount used"
              />
            </div>

            <div className="rounded-[30px] border border-green-100 bg-white p-6 shadow-[0_18px_50px_rgba(22,101,52,0.08)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-gray-900">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Hi {firstName}, here are your profile details.
                  </p>
                </div>

                <Link
                  to="/profile/edit"
                  className="rounded-2xl bg-green-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-800"
                >
                  Manage
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <ThemeInfoCard label="Full Name" value={safeUser.name} />
                <ThemeInfoCard label="Email Address" value={safeUser.email} />
                <ThemeInfoCard label="Role" value={safeUser.role} />
                <ThemeInfoCard
                  label="Contact Number"
                  value={safeUser.contact}
                  highlight
                />
              </div>
            </div>

            <div className="rounded-[30px] border border-green-100 bg-white p-6 shadow-[0_18px_50px_rgba(22,101,52,0.08)]">
              <h3 className="text-2xl font-black tracking-tight text-gray-900">
                Loyalty Rules
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Your loyalty balance changes based on payments, cancellations, and redemption.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <ThemeRuleCard
                  title="Full Payment Reward"
                  value={`+${LOYALTY_RULES.FULL_PAYMENT_REWARD} points`}
                  tone="green"
                />
                <ThemeRuleCard
                  title="Redeem"
                  value={`${LOYALTY_RULES.REDEEM_POINTS_REQUIRED} points = ${LOYALTY_RULES.REDEEM_DISCOUNT_PERCENT}% off`}
                  tone="emerald"
                />
                <ThemeRuleCard
                  title="Normal Cancellation"
                  value={`-${LOYALTY_RULES.NORMAL_CANCELLATION_PENALTY} points`}
                  tone="amber"
                />
                <ThemeRuleCard
                  title="Late Cancellation"
                  value={`-${LOYALTY_RULES.LATE_CANCELLATION_PENALTY} points`}
                  tone="red"
                />
              </div>
            </div>

            <div className="rounded-[30px] border border-green-100 bg-white p-6 shadow-[0_18px_50px_rgba(22,101,52,0.08)]">
              <h3 className="text-2xl font-black tracking-tight text-gray-900">
                Loyalty Snapshot
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                A quick summary of your rewards activity.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <ThemeInfoCard
                  label="Total Earned"
                  value={statsLoading ? "..." : loyaltySummary.totalEarned}
                />
                <ThemeInfoCard
                  label="Total Spent / Lost"
                  value={statsLoading ? "..." : loyaltySummary.totalSpent}
                />
                <ThemeInfoCard
                  label="Redeemed on Bookings"
                  value={
                    statsLoading ? "..." : computedStats.totalPointsRedeemedFromBookings
                  }
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ThemeStatCard({ title, value, subtitle, accent = "default" }) {
  const style =
    accent === "green"
      ? "border-green-100 bg-green-50"
      : "border-green-100 bg-white";

  return (
    <div className={`rounded-3xl border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${style}`}>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
        {title}
      </p>
      <p className="mt-3 text-4xl font-black tracking-tight text-gray-900">
        {value}
      </p>
      <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
    </div>
  );
}

function ThemeInfoCard({ label, value, highlight = false }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        highlight
          ? "border-green-100 bg-green-50"
          : "border-green-100 bg-emerald-50/40"
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-500">
        {label}
      </p>
      <p className="mt-2 break-words text-lg font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}

function ThemeRuleCard({ title, value, tone = "green" }) {
  const tones = {
    green: "border-green-100 bg-green-50 text-green-900",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-900",
    amber: "border-amber-100 bg-amber-50 text-amber-900",
    red: "border-red-100 bg-red-50 text-red-900",
  };

  return (
    <div className={`rounded-2xl border p-5 ${tones[tone]}`}>
      <p className="text-xs font-bold uppercase tracking-[0.18em] opacity-80">
        {title}
      </p>
      <p className="mt-2 text-lg font-black">{value}</p>
    </div>
  );
}