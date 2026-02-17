import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function Bookings() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken") ||
          localStorage.getItem("authToken") ||
          localStorage.getItem("userToken");

        // If your API isn’t ready yet, page still works with empty list.
        if (!token) {
          setBookings([]);
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/api/bookings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // fallback to empty if endpoint not implemented yet
          setBookings([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.bookings || [];
        setBookings(list);
      } catch (e) {
        setError("Could not load bookings.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

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

            <Link
              to="/profile"
              className="text-sm font-semibold text-green-700 hover:underline"
            >
              Go to Profile →
            </Link>
          </div>

          {/* States */}
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
                    : status.includes("reject")
                    ? "border-red-200 bg-red-50 text-red-700"
                    : "border-yellow-200 bg-yellow-50 text-yellow-700";

                return (
                  <div
                    key={b._id || `${b.date}-${b.slot}`}
                    className="rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="text-base font-bold text-gray-900">
                          {b?.ground?.name || b?.groundName || "Cricsal Booking"}
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          {b?.date || b?.startTime || "Date"} •{" "}
                          {b?.slot || b?.time || "Time"}
                        </div>
                      </div>

                      <span
                        className={`inline-flex w-fit items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeClass}`}
                      >
                        {b?.status || "Pending"}
                      </span>
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
    </div>
  );
}
