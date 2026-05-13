import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

const toDateObj = (yyyyMMdd) => {
  if (!yyyyMMdd) return null;
  return new Date(`${yyyyMMdd}T00:00:00`);
};

const formatNiceDate = (yyyyMMdd) => {
  if (!yyyyMMdd) return "";
  const d = new Date(`${yyyyMMdd}T00:00:00`);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function Home() {
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [bookingErr, setBookingErr] = useState("");

  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [featuredErr, setFeaturedErr] = useState("");

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const displayName = user?.name || user?.username || "Ashim Dai";

  const token = useMemo(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("userToken") ||
      ""
    );
  }, []);

  useEffect(() => {
    loadBookings();
    loadFeatured();
  }, []);

  const loadBookings = async () => {
    setBookingErr("");
    setLoadingBookings(true);

    try {
      if (!token) {
        setUpcomingBookings([]);
        return;
      }

      const endpoints = [
        `${API_BASE}/api/bookings/me`,
        `${API_BASE}/api/bookings/my`,
      ];

      let list = null;

      for (const url of endpoints) {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json().catch(() => null);

        if (res.ok) {
          list = Array.isArray(data) ? data : data?.bookings || [];
          break;
        }
      }

      if (!list) {
        setUpcomingBookings([]);
        setBookingErr("Could not load bookings.");
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const upcomingConfirmed = list
        .filter((b) => String(b?.status || "").toLowerCase() === "confirmed")
        .map((b) => ({ ...b, _dateObj: toDateObj(b?.date) }))
        .filter((b) => b._dateObj && b._dateObj >= today)
        .sort((a, b) => {
          const d = a._dateObj - b._dateObj;
          if (d !== 0) return d;
          return String(a.startTime || "").localeCompare(
            String(b.startTime || "")
          );
        })
        .slice(0, 2)
        .map((b) => ({
          id: b._id,
          groundId: b.ground || b.cricsal,
          venue:
            b?.groundDetails?.name ||
            b?.cricsalDetails?.name ||
            b?.venue?.name ||
            b?.groundName ||
            b?.cricsalName ||
            "Booked Ground",
          date: formatNiceDate(b.date),
          time: `${b.startTime || "--"} - ${b.endTime || "--"}`,
          hours: b.durationHours || b.hours || 1,
        }));

      setUpcomingBookings(upcomingConfirmed);
    } catch {
      setUpcomingBookings([]);
      setBookingErr("Could not load bookings.");
    } finally {
      setLoadingBookings(false);
    }
  };

  const loadFeatured = async () => {
    setLoadingFeatured(true);
    setFeaturedErr("");

    try {
      const res = await fetch(`${API_BASE}/api/grounds`);
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setFeatured([]);
        setFeaturedErr("Could not load grounds.");
        return;
      }

      const list = Array.isArray(data)
        ? data
        : data?.grounds || data?.data || [];

      const normalized = list
        .filter(Boolean)
        .slice(0, 3)
        .map((item) => ({
          id: item._id || item.id,
          name: item.name || item.title || "Unnamed Ground",
          location:
            item.location ||
            item.address ||
            item.city ||
            item.area ||
            "Unknown location",
          price:
            item.pricePerHour != null
              ? `Rs ${item.pricePerHour}/hr`
              : item.price != null
              ? `Rs ${item.price}/hr`
              : "Contact for price",
          rating: item.rating ? String(item.rating) : "4.8",
          image:
            item.image ||
            item.thumbnail ||
            item.coverImage ||
            (Array.isArray(item.images) && item.images.length > 0
              ? item.images[0]
              : null),
          tags:
            item.tags && Array.isArray(item.tags) && item.tags.length > 0
              ? item.tags
              : [
                  item.indoor ? "Indoor" : null,
                  item.parking ? "Parking" : null,
                  item.lights ? "Lights" : null,
                  item.shower ? "Shower" : null,
                  item.cafe ? "Cafe" : null,
                  item.premium ? "Premium" : null,
                ].filter(Boolean),
        }));

      setFeatured(normalized);
    } catch {
      setFeatured([]);
      setFeaturedErr("Could not load grounds.");
    } finally {
      setLoadingFeatured(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.10),_transparent_35%),linear-gradient(to_bottom,_#f8fafc,_#f1f5f9)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-sm backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-green-700">
            User Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            Welcome back, {displayName}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage bookings, explore cricsals, and access your cricket sessions.
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/90 shadow-[0_20px_70px_rgba(15,23,42,0.07)] backdrop-blur-xl">
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-emerald-100/50 blur-3xl" />

          <div className="relative grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.35fr_0.85fr] lg:px-10 lg:py-10">
            <div>
              <div className="inline-flex rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-semibold text-green-700">
                Premium booking experience
              </div>

              <h2 className="mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Find and book your next{" "}
                <span className="bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
                  cricsal
                </span>{" "}
                with ease
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Discover quality indoor cricket grounds, compare availability,
                and secure your slot with a smoother booking experience.
              </p>

              <div className="mt-8 grid max-w-lg grid-cols-1 gap-3 sm:grid-cols-3">
                <MiniMetric
                  value={`${featured.length || 0}+`}
                  label="Available Grounds"
                />
                <MiniMetric
                  value={upcomingBookings.length}
                  label="Upcoming Bookings"
                />
                <MiniMetric value="24/7" label="Booking Access" />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/find-cricsal"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-200 transition hover:scale-[1.02] hover:shadow-xl"
                >
                  Find Cricsal
                </Link>

                <Link
                  to="/bookings"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  My Bookings
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6 shadow-[0_14px_40px_rgba(34,197,94,0.10)]">
              <div className="text-xs uppercase tracking-[0.2em] text-green-700">
                Booking highlights
              </div>
              <div className="mt-3 text-3xl font-bold text-slate-900">
                Smooth. Trusted. Modern.
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                A cleaner booking experience with better clarity, faster
                actions, and easy access to your sessions.
              </p>

              <div className="mt-6 grid gap-3">
                <Highlight
                  value={`${featured.length || 0}+`}
                  label="Listed grounds"
                />
                <Highlight value="24/7" label="Quick booking" />
                <Highlight value="Fast" label="Easy access" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-sm backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
                    Upcoming session
                  </div>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    Your next booking
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Quick access to your next confirmed session.
                  </p>
                </div>

                <Link
                  to="/bookings"
                  className="text-sm font-semibold text-green-700 hover:text-green-800"
                >
                  View all
                </Link>
              </div>

              <div className="mt-5">
                {loadingBookings ? (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
                    <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
                    <div className="mt-4 h-20 animate-pulse rounded-2xl bg-slate-100" />
                  </div>
                ) : bookingErr ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {bookingErr}
                  </div>
                ) : upcomingBookings.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                    <h3 className="text-lg font-bold text-slate-900">
                      No bookings yet
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Start with a great ground and reserve your first slot.
                    </p>
                    <Link
                      to="/find-cricsal"
                      className="mt-5 inline-flex rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white"
                    >
                      Book now
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((b, index) => (
                      <div
                        key={b.id}
                        className="rounded-3xl border border-slate-200 bg-gradient-to-r from-white to-green-50/40 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-lg font-bold text-white">
                              {index + 1}
                            </div>

                            <div>
                              <div className="text-base font-bold text-slate-900">
                                {b.venue}
                              </div>
                              <div className="mt-1 text-sm text-slate-600">
                                {b.date}
                              </div>
                              <div className="mt-1 text-sm text-slate-600">
                                {b.time} • {b.hours} hour(s)
                              </div>
                            </div>
                          </div>

                          <Link
                            to="/bookings"
                            className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white"
                          >
                            Manage
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-sm backdrop-blur">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
                    Recommended
                  </div>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    Featured cricsals
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Real grounds loaded from your backend.
                  </p>
                </div>

                <Link
                  to="/find-cricsal"
                  className="text-sm font-semibold text-green-700"
                >
                  See more
                </Link>
              </div>

              <div className="mt-6">
                {loadingFeatured ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-48 animate-pulse rounded-3xl bg-slate-100"
                      />
                    ))}
                  </div>
                ) : featuredErr ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {featuredErr}
                  </div>
                ) : featured.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
                    No grounds available right now.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {featured.map((f) => (
                      <div
                        key={f.id}
                        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                      >
                        {f.image ? (
                          <img
                            src={f.image}
                            alt={f.name}
                            className="h-36 w-full object-cover"
                          />
                        ) : (
                          <div className="h-28 bg-gradient-to-br from-green-700 to-emerald-500" />
                        )}

                        <div className="p-5">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-bold text-slate-900">
                              {f.name}
                            </h3>
                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                              {f.price}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            {f.location}
                          </p>

                          <div className="mt-4 flex gap-2">
                            <Link
                              to="/find-cricsal"
                              className="flex-1 rounded-xl bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white"
                            >
                              Book
                            </Link>
                            <Link
                              to={`/ground/${f.id}`}
                              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-900"
                            >
                              Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-sm backdrop-blur">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
                Quick access
              </div>
              <h3 className="mt-2 text-xl font-bold text-slate-900">
                Shortcuts
              </h3>

              <div className="mt-5 space-y-3">
                <Shortcut to="/profile" label="My profile" />
                <Shortcut to="/bookings" label="My bookings" />
                <Link
                  to="/find-cricsal"
                  className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-4 text-sm font-semibold text-white shadow-md"
                >
                  <span>Find cricsals</span>
                  <span>Open</span>
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 p-6 text-white shadow-[0_20px_60px_rgba(34,197,94,0.20)]">
              <h3 className="text-2xl font-bold">Book smarter, play better</h3>
              <p className="mt-3 text-sm leading-6 text-green-50">
                Book early for weekends, use off-peak slots, and save favorite
                grounds for faster booking.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({ value, label }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-center shadow-sm">
      <div className="text-lg font-bold text-green-700">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{label}</div>
    </div>
  );
}

function Highlight({ value, label }) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white px-4 py-3 shadow-sm">
      <div className="text-lg font-bold text-green-700">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function Shortcut({ to, label }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
    >
      <span>{label}</span>
      <span className="text-slate-400">Open</span>
    </Link>
  );
}
