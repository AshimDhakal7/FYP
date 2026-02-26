import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function Bookings() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState("");

  // ✅ Modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ✅ Animation state (simple + clean)
  const [animateIn, setAnimateIn] = useState(false);

  // ✅ Always read latest token (important)
  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("userToken") ||
    "";

  // ✅ Always send token in both headers (backend may expect either)
  const authHeaders = () => {
    const token = getToken();
    return {
      Authorization: `Bearer ${token}`,
      "x-auth-token": token,
    };
  };

  const loadBookings = async () => {
    setError("");
    setLoading(true);

    try {
      const token = getToken();

      if (!token) {
        setBookings([]);
        setError("Token missing. Please login again.");
        return;
      }

      // ✅ backend route that exists: /api/bookings/me
      const res = await fetch(`${API_BASE}/api/bookings/me`, {
        headers: authHeaders(),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setBookings([]);
        setError(
          data?.message ||
            `Could not load bookings (${res.status}). Please login again.`
        );
        return;
      }

      const list = Array.isArray(data) ? data : data?.bookings || [];
      setBookings(list);
    } catch (e) {
      setError("Could not load bookings. (Network/CORS/backend issue)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Modal helpers
  const openConfirm = (booking) => {
    setSelectedBooking(booking);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    if (actionLoadingId) return; // don't close while cancelling
    setAnimateIn(false);
    setTimeout(() => {
      setConfirmOpen(false);
      setSelectedBooking(null);
    }, 160);
  };

  // ✅ Animate in when opened
  useEffect(() => {
    if (!confirmOpen) return;
    const t = setTimeout(() => setAnimateIn(true), 10);
    return () => clearTimeout(t);
  }, [confirmOpen]);

  // ✅ Close with ESC
  useEffect(() => {
    if (!confirmOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [confirmOpen, actionLoadingId]);

  // ✅ Cancel booking
  const cancelBooking = async (bookingId) => {
    if (!bookingId) return;

    setActionLoadingId(bookingId);
    setError("");

    try {
      const token = getToken();
      if (!token) {
        setError("Token missing. Please login again.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        headers: authHeaders(),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || `Cancel failed (${res.status})`);
        return;
      }

      // ✅ update UI instantly
      setBookings((prev) => prev.map((b) => (b._id === bookingId ? data : b)));

      closeConfirm();
    } catch (e) {
      setError("Cancel failed (server error).");
    } finally {
      setActionLoadingId("");
    }
  };

  const formatSlot = (b) => {
    if (b?.startTime && b?.endTime) return `${b.startTime} - ${b.endTime}`;
    if (b?.slot) return b.slot;
    return "Time";
  };

  // ✅ FIX: render cricsal safely (string id OR populated object)
  const cricsalLabel = (c) => {
    if (!c) return "Cricsal";
    if (typeof c === "string") return c; // not populated
    return c.name || c.title || c.area || c._id || "Cricsal"; // populated object
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                📌 My Bookings
              </div>
              <h1 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Your bookings
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                View your upcoming and past cricsal bookings.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                to="/find-cricsal"
                className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition"
              >
                Book New Slot
              </Link>
              <Link
                to="/home"
                className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* List Card */}
        <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-bold text-gray-900">Bookings List</h2>

            <div className="flex items-center gap-3">
              <button
                onClick={loadBookings}
                className="text-sm font-semibold text-gray-700 hover:underline"
              >
                Refresh
              </button>

              <Link
                to="/profile"
                className="text-sm font-semibold text-green-700 hover:underline"
              >
                Go to Profile →
              </Link>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 space-y-3">
              <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
              <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
              <div className="h-20 animate-pulse rounded-2xl bg-gray-100" />
              <p className="text-sm text-gray-500">Loading bookings...</p>
            </div>
          ) : error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : bookings.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-gray-300 p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
                📅
              </div>

              <div className="mt-4 text-base font-bold text-gray-900">
                No bookings yet
              </div>
              <div className="mt-1 text-sm text-gray-600">
                Book your first slot to see it here.
              </div>

              <div className="mt-5">
                <Link
                  to="/find-cricsal"
                  className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-green-700 transition"
                >
                  Find Cricsal
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {bookings.map((b) => {
                const status = String(b?.status || "pending").toLowerCase();

                const badgeClass =
                  status.includes("confirm")
                    ? "border-green-200 bg-green-50 text-green-700"
                    : status.includes("cancel")
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-yellow-200 bg-yellow-50 text-yellow-700";

                const canCancel = status === "confirmed";

                return (
                  <div
                    key={b._id}
                    className="rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="text-base font-bold text-gray-900">
                          Cricsal Booking{" "}
                          <span className="text-gray-500 font-semibold">
                            ({cricsalLabel(b?.cricsal)})
                          </span>
                        </div>

                        <div className="mt-1 text-sm text-gray-600">
                          {b?.date} • {formatSlot(b)} • {b?.durationHours}h
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex w-fit items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass}`}
                        >
                          {b?.status || "Pending"}
                        </span>

                        {canCancel && (
                          <button
                            onClick={() => openConfirm(b)}
                            className="rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-gray-500">
          © 2026 CricBook •{" "}
          <Link to="/" className="hover:underline">
            Terms
          </Link>{" "}
          •{" "}
          <Link to="/" className="hover:underline">
            Privacy
          </Link>
        </div>
      </div>

      {/* ✅ Custom Cancel Popup */}
      {confirmOpen && selectedBooking && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            onClick={closeConfirm}
            className={`absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity duration-200 ${
              animateIn ? "opacity-100" : "opacity-0"
            }`}
          />

          {/* Modal */}
          <div
            className={`relative w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-xl transition-all duration-200 ${
              animateIn
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-3 scale-[0.98]"
            }`}
          >
            <div className="flex items-start gap-3 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-50 text-red-700 ring-1 ring-red-100">
                🗑️
              </div>

              <div className="min-w-0">
                <h3 className="text-lg font-extrabold text-gray-900">
                  Cancel booking?
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  This will mark your booking as cancelled.
                </p>
              </div>

              <button
                onClick={closeConfirm}
                className="ml-auto rounded-xl px-3 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                aria-label="Close"
                disabled={actionLoadingId === selectedBooking._id}
              >
                ✕
              </button>
            </div>

            <div className="px-6 pb-6">
              <div className="rounded-2xl bg-gray-50 p-4 ring-1 ring-black/5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cricsal</span>
                  <span className="font-semibold text-gray-900">
                    {cricsalLabel(selectedBooking.cricsal)}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold text-gray-900">
                    {selectedBooking.date}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Time</span>
                  <span className="font-semibold text-gray-900">
                    {formatSlot(selectedBooking)}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">
                    {selectedBooking.durationHours}h
                  </span>
                </div>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={closeConfirm}
                  disabled={actionLoadingId === selectedBooking._id}
                  className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Keep booking
                </button>

                <button
                  type="button"
                  onClick={() => cancelBooking(selectedBooking._id)}
                  disabled={actionLoadingId === selectedBooking._id}
                  className="flex-1 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {actionLoadingId === selectedBooking._id
                    ? "Cancelling..."
                    : "Yes, cancel"}
                </button>
              </div>

              <p className="mt-3 text-xs text-gray-500">
                Tip: Press <span className="font-semibold">Esc</span> to close.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}