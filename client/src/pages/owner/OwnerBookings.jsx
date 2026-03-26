
import React, { useEffect, useState } from "react";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function OwnerBookings() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    "";

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setError("");

      const res = await fetch(`${API_BASE}/api/bookings/owner`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load bookings");

      setBookings(data.bookings || []);
    } catch (e) {
      setError(e.message || "Load failed");
    } finally {
      setLoading(false);
    }
  };

  // Initial load + auto refresh
  useEffect(() => {
    fetchBookings();

    const interval = setInterval(() => {
      fetchBookings();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Approve booking
  const handleApprove = async (id) => {
    if (!window.confirm("Approve this booking?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) throw new Error();

      alert("✅ Booking approved successfully");
      fetchBookings();
    } catch (err) {
      alert("❌ Failed to approve");
    }
  };

  // Decline booking
  const handleDecline = async (id) => {
    if (!window.confirm("Decline this booking?")) return;

    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}/decline`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!res.ok) throw new Error();

      alert("❌ Booking declined");
      fetchBookings();
    } catch (err) {
      alert("❌ Failed to decline");
    }
  };

  const getStatusLabel = (status) => {
    if (status === "pending") return "Pending";
    if (status === "confirmed") return "Confirmed";
    return "Cancelled";
  };

  const getStatusClasses = (status) => {
    if (status === "confirmed") {
      return "bg-green-50 border-green-200 text-green-700";
    }
    if (status === "pending") {
      return "bg-yellow-50 border-yellow-200 text-yellow-700";
    }
    return "bg-red-50 border-red-200 text-red-700";
  };

  const getStatusIcon = (status) => {
    if (status === "pending") return "⏳";
    if (status === "confirmed") return "✅";
    return "❌";
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const cancelledCount = bookings.filter(
    (b) => b.status !== "pending" && b.status !== "confirmed"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-100 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Owner Bookings
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View and manage bookings made by players in a clean and organized dashboard.
              </p>
            </div>

            <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-700">
              Auto-refreshing every 5 seconds
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        {!loading && !error && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{bookings.length}</p>
            </div>

            <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
              <p className="text-sm font-medium text-yellow-700">Pending</p>
              <p className="mt-2 text-3xl font-bold text-yellow-800">{pendingCount}</p>
            </div>

            <div className="rounded-3xl border border-green-200 bg-green-50 p-5 shadow-sm">
              <p className="text-sm font-medium text-green-700">Confirmed</p>
              <p className="mt-2 text-3xl font-bold text-green-800">{confirmedCount}</p>
            </div>

            <div className="rounded-3xl border border-red-200 bg-red-50 p-5 shadow-sm">
              <p className="text-sm font-medium text-red-700">Cancelled</p>
              <p className="mt-2 text-3xl font-bold text-red-800">{cancelledCount}</p>
            </div>
          </div>
        )}

        {/* Main Panel */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Bookings List</h2>
            <p className="mt-1 text-sm text-gray-500">
              Approve or decline incoming requests and monitor booking status.
            </p>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
                <p className="text-sm text-gray-500">Loading bookings...</p>
              </div>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">
              {error}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && bookings.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center text-gray-500">
              No bookings yet.
            </div>
          )}

          {/* Booking Cards */}
          {!loading && !error && bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map((b) => {
                const status = (b.status || "").toLowerCase();

                return (
                  <div
                    key={b._id}
                    className="rounded-3xl border border-gray-200 bg-white p-5 transition hover:shadow-md"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                      {/* Left Section */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-xl font-bold text-gray-900">
                            {b.cricsal?.name || "Cricsal"}
                          </h3>

                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                              status
                            )}`}
                          >
                            <span>{getStatusIcon(status)}</span>
                            <span>{getStatusLabel(status)}</span>
                          </span>
                        </div>

                        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                          <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Date
                            </p>
                            <p className="mt-2 text-sm font-semibold text-gray-800">
                              {b.date || "N/A"}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Time Slot
                            </p>
                            <p className="mt-2 text-sm font-semibold text-gray-800">
                              {b.startTime} - {b.endTime}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {b.durationHours} hr
                            </p>
                          </div>

                          <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Player
                            </p>
                            <p className="mt-2 text-sm font-semibold text-gray-800">
                              {b.user?.name || "N/A"}
                            </p>
                            <p className="mt-1 break-all text-xs text-gray-500">
                              {b.user?.email || "N/A"}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {b.user?.phone || "N/A"}
                            </p>
                          </div>

                          <div className="rounded-2xl bg-gray-50 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Price
                            </p>
                            <p className="mt-2 text-lg font-bold text-gray-900">
                              NPR {b.totalPrice || 0}
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              {b.paymentPreference === "full"
                                ? "Full Payment"
                                : "30% Advance"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right Section */}
                      <div className="flex w-full flex-col gap-3 xl:w-auto xl:min-w-[230px] xl:items-end">
                        {status === "pending" && (
                          <>
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() => handleApprove(b._id)}
                                className="rounded-2xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                              >
                                Approve
                              </button>

                              <button
                                onClick={() => handleDecline(b._id)}
                                className="rounded-2xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                              >
                                Decline
                              </button>
                            </div>

                            <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-xs text-yellow-700 xl:text-right">
                              Approving this booking allows the player to proceed with payment.
                            </div>
                          </>
                        )}

                        {status === "confirmed" && (
                          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 xl:text-right">
                            Player can now proceed to payment.
                          </div>
                        )}

                        {status !== "pending" && status !== "confirmed" && (
                          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 xl:text-right">
                            This booking is no longer active.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}