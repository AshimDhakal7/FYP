import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function Bookings() {
  // ---------- state ----------
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState("");

  // ---------- modal ----------
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // ---------- auth ----------
  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("userToken") ||
    "";

  const authHeaders = () => {
    const token = getToken();
    return {
      Authorization: `Bearer ${token}`,
      "x-auth-token": token,
    };
  };

  // ---------- load bookings ----------
  const loadBookings = async () => {
    setError("");

    try {
      const token = getToken();

      if (!token) {
        setBookings([]);
        setError("Token missing. Please login again.");
        return;
      }

      const res = await fetch(`${API_BASE}/api/bookings/me`, {
        headers: authHeaders(),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setBookings([]);
        setError(data?.message || "Failed to load bookings");
        return;
      }

      const list = Array.isArray(data) ? data : data?.bookings || [];

      // ✅ prevent unnecessary re-render
      setBookings((prev) => {
        const prevStr = JSON.stringify(prev);
        const newStr = JSON.stringify(list);
        return prevStr !== newStr ? list : prev;
      });
    } catch {
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  };

  // ---------- initial load only ----------
  useEffect(() => {
    loadBookings();
  }, []);

  // ---------- modal ----------
  const openConfirm = (booking) => {
    setSelectedBooking(booking);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    if (actionLoadingId) return;
    setConfirmOpen(false);
    setSelectedBooking(null);
  };

  // ---------- cancel ----------
  const cancelBooking = async (bookingId) => {
    if (!bookingId) return;

    setActionLoadingId(bookingId);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        headers: authHeaders(),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.message || "Cancel failed");
        return;
      }

      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? data : b))
      );

      closeConfirm();
    } catch {
      setError("Cancel failed.");
    } finally {
      setActionLoadingId("");
    }
  };

  // ---------- helpers ----------
  const formatSlot = (b) =>
    b?.startTime && b?.endTime
      ? `${b.startTime} - ${b.endTime}`
      : "Time";

  const cricsalLabel = (c) => {
    if (!c) return "Cricsal";
    if (typeof c === "string") return c;
    return c.name || c._id;
  };

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* header */}
        <div className="bg-white p-6 rounded-2xl shadow flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">My Bookings</h1>
            <p className="text-sm text-gray-500">
              Manage your bookings easily
            </p>
          </div>

          <Link
            to="/find-cricsal"
            className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700"
          >
            Book
          </Link>
        </div>

        {/* error */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* list */}
        <div className="bg-white p-6 rounded-2xl shadow">
          {loading ? (
            <p className="text-gray-500">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <p className="text-gray-500">No bookings yet</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => {
                const status = (b.status || "pending").toLowerCase();

                const statusStyle =
                  status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : status === "cancelled"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700";

                const canCancel =
                  status === "pending" || status === "confirmed";

                return (
                  <div
                    key={b._id}
                    className="border rounded-xl p-4 flex justify-between items-center hover:shadow-sm transition"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {cricsalLabel(b.cricsal)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {b.date} • {formatSlot(b)} • {b.durationHours}h
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${statusStyle}`}
                      >
                        {status === "pending"
                          ? "⏳ Pending"
                          : status === "confirmed"
                          ? "✅ Confirmed"
                          : "❌ Cancelled"}
                      </span>

                      {canCancel && (
                        <button
                          onClick={() => openConfirm(b)}
                          className="px-3 py-1 text-xs font-semibold text-white bg-red-500 rounded-md hover:bg-red-600"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* modal */}
      {confirmOpen && selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl w-full max-w-sm shadow-lg">
            <h3 className="text-lg font-bold mb-2">
              Cancel booking?
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={closeConfirm}
                className="flex-1 border py-2 rounded-lg hover:bg-gray-50"
              >
                No
              </button>
              <button
                onClick={() => cancelBooking(selectedBooking._id)}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
              >
                {actionLoadingId === selectedBooking._id
                  ? "Cancelling..."
                  : "Yes, cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}