import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function BookCricsal() {
  const { cricsalId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [hours, setHours] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const token = useMemo(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("userToken") ||
      ""
    );
  }, []);

  const timeSlots = [
    "06:00 - 07:00",
    "07:00 - 08:00",
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
  ];

  const handleConfirm = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!date || !slot) {
      setMsg("Please select date and time slot.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cricsalId,
          date,
          slot,
          hours: Number(hours),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data?.message || "Booking failed. (Backend route missing?)");
        return;
      }

      navigate("/bookings");
    } catch (err) {
      setMsg("Server error. Check backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const niceDate = date
    ? new Date(date + "T00:00:00").toLocaleDateString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Not selected";

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl">
        {/* Top header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
              Booking
              <span className="h-1 w-1 rounded-full bg-green-600" />
              Cricsal ID: <span className="font-bold">{cricsalId}</span>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl">
              Confirm your slot
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Pick a date, choose a time slot, and confirm your booking.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/find-cricsal"
              className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
            >
              ← Back
            </Link>
            <Link
              to="/home"
              className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
            >
              Home
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left: Form */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
              <form onSubmit={handleConfirm} className="space-y-5">
                {/* Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                {/* Slot grid */}
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-semibold text-gray-800">
                      Time Slot
                    </label>
                    <span className="text-xs text-gray-500">
                      Tap to select
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {timeSlots.map((s) => {
                      const active = slot === s;
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSlot(s)}
                          className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                            active
                              ? "border-green-600 bg-green-600 text-white shadow-sm"
                              : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>

                  {/* Hidden select kept for accessibility (same state/logic) */}
                  <select
                    value={slot}
                    onChange={(e) => setSlot(e.target.value)}
                    className="sr-only"
                  >
                    <option value="">Select slot</option>
                    {timeSlots.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800">
                    Duration (hours)
                  </label>
                  <div className="mt-2 inline-flex rounded-full border border-gray-200 bg-gray-50 p-1">
                    {[1, 2, 3].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setHours(h)}
                        className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                          Number(hours) === h
                            ? "bg-green-700 text-white shadow-sm"
                            : "text-gray-700 hover:text-gray-900"
                        }`}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                {msg && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {msg}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-green-700 px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-green-800 active:scale-[0.99] transition disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Confirming..." : "Confirm Booking"}
                </button>

                {/* Tiny hint */}
                <div className="rounded-2xl bg-gray-50 px-4 py-3 text-xs text-gray-600 ring-1 ring-black/5">
                  Tip: If you don’t get navigated, check your route path is
                  correct: <span className="font-semibold">/book/:cricsalId</span>
                </div>
              </form>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-base font-bold text-gray-900">
                Booking summary
              </h2>

              <div className="mt-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Cricsal</span>
                  <span className="font-semibold text-gray-900">{cricsalId}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold text-gray-900">{niceDate}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Time slot</span>
                  <span className="font-semibold text-gray-900">
                    {slot || "Not selected"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">
                    {hours} hour{Number(hours) > 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {!token && (
                <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-xs text-yellow-800">
                  You’re not logged in (token missing). Booking may fail.
                  Please login first.
                </div>
              )}
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-green-900 via-green-800 to-green-700 p-6 text-white shadow-sm">
              <h3 className="text-base font-bold">Pro tips</h3>
              <ul className="mt-3 space-y-2 text-sm text-green-100">
                <li>✓ Weekends fill fast — book early</li>
                <li>✓ Pick longer durations for uninterrupted practice</li>
                <li>✓ If payment is later, confirm details carefully</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          © 2026 CricBook •{" "}
          <Link className="font-semibold text-gray-700 hover:underline" to="/">
            Terms
          </Link>{" "}
          •{" "}
          <Link className="font-semibold text-gray-700 hover:underline" to="/">
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}
