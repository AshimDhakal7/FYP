import React, { useEffect, useState } from "react";
import { showError, showSuccess } from "../../utils/toast";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function OwnerBookings() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: "",
    bookingId: null,
    bookingName: "",
  });

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    "";

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

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load bookings");
      }

      setBookings(data.bookings || []);
    } catch (e) {
      const message = e.message || "Load failed";
      setError(message);
      showError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();

    const interval = setInterval(() => {
      fetchBookings();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleApprove = async (booking) => {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${booking._id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
  
      const data = await res.json().catch(() => null);
  
      if (!res.ok) {
        throw new Error(data?.message || "Failed to approve booking");
      }
  
      showSuccess(data?.message || "Booking approved successfully");
      fetchBookings();
    } catch (err) {
      showError(err.message || "Failed to approve booking");
    }
  };

  const handleDecline = async (booking) => {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${booking._id}/decline`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });
  
      const data = await res.json().catch(() => null);
  
      if (!res.ok) {
        throw new Error(data?.message || "Failed to decline booking");
      }
  
      showSuccess(data?.message || "Booking declined successfully");
      fetchBookings();
    } catch (err) {
      showError(err.message || "Failed to decline booking");
    }
  };
  const closeConfirmModal = () => {
    setConfirmModal({
      open: false,
      type: "",
      bookingId: null,
      bookingName: "",
    });
  };

  const handleConfirmAction = async () => {
    const { type, bookingId } = confirmModal;

    try {
      const endpoint =
        type === "approve"
          ? `${API_BASE}/api/bookings/${bookingId}/approve`
          : `${API_BASE}/api/bookings/${bookingId}/decline`;

      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(
          data?.message ||
            (type === "approve"
              ? "Failed to approve booking"
              : "Failed to decline booking")
        );
      }

      showSuccess(
        data?.message ||
          (type === "approve"
            ? "Booking approved successfully"
            : "Booking declined successfully")
      );

      closeConfirmModal();
      fetchBookings();
    } catch (err) {
      showError(err.message || "Action failed");
    }
  };

  const getStatusLabel = (status) => {
    if (status === "pending") return "Pending";
    if (status === "confirmed") return "Confirmed";
    return "Cancelled";
  };

  const getStatusClasses = (status) => {
    if (status === "confirmed") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    if (status === "pending") {
      return "border-yellow-200 bg-yellow-50 text-yellow-700";
    }

    return "border-red-200 bg-red-50 text-red-700";
  };

  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const cancelledCount = bookings.filter(
    (b) => b.status !== "pending" && b.status !== "confirmed"
  ).length;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Owner Bookings
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Manage player booking requests and monitor booking status.
              </p>
            </div>

            <div className="w-fit rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">
              Auto refresh: 5s
            </div>
          </div>
        </div>

        {!loading && !error && (
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard title="Total Bookings" value={bookings.length} />
            <SummaryCard title="Pending" value={pendingCount} color="yellow" />
            <SummaryCard title="Confirmed" value={confirmedCount} color="green" />
            <SummaryCard title="Cancelled" value={cancelledCount} color="red" />
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Bookings List</h2>
            <p className="mt-1 text-sm text-slate-500">
              Approve or decline incoming booking requests.
            </p>
          </div>

          {loading && (
            <div className="flex justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
                <p className="text-sm text-slate-500">Loading bookings...</p>
              </div>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && bookings.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <p className="text-lg font-bold text-slate-700">No bookings yet</p>
              <p className="mt-1 text-sm text-slate-500">
                New booking requests will appear here automatically.
              </p>
            </div>
          )}

          {!loading && !error && bookings.length > 0 && (
            <div className="space-y-4">
              {bookings.map((b) => {
                const status = (b.status || "").toLowerCase();

                return (
                  <div
                    key={b._id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-green-200 hover:shadow-md"
                  >
                    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900">
                          {b.cricsal?.name || "Cricsal"}
                        </h3>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusClasses(
                            status
                          )}`}
                        >
                          {getStatusLabel(status)}
                        </span>
                      </div>

                      {status === "pending" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(b)}
                            className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 active:scale-95"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() => handleDecline(b)}
                            className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-700 active:scale-95"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                      <InfoItem label="Date" value={b.date || "N/A"} />

                      <InfoItem
                        label="Time Slot"
                        value={`${b.startTime || "N/A"} - ${b.endTime || "N/A"}`}
                        sub={`${b.durationHours || 0} hr`}
                      />

                      <InfoItem
                        label="Player"
                        value={b.user?.name || "N/A"}
                        sub={b.user?.email || "N/A"}
                      />

                      <InfoItem
                        label="Price"
                        value={`NPR ${b.totalPrice || 0}`}
                        sub={
                          b.paymentPreference === "full"
                            ? "Full Payment"
                            : "30% Advance"
                        }
                      />
                    </div>

                    {status === "confirmed" && (
                      <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                        Player can now proceed to payment.
                      </div>
                    )}

                    {status !== "pending" && status !== "confirmed" && (
                      <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                        This booking is no longer active.
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {confirmModal.open && (
        <div className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-32px)] rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-xl font-bold ${
                confirmModal.type === "approve"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {confirmModal.type === "approve" ? "✓" : "!"}
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-slate-900">
                {confirmModal.type === "approve"
                  ? "Approve booking?"
                  : "Decline booking?"}
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-500">
                {confirmModal.type === "approve"
                  ? `Approve ${confirmModal.bookingName} and allow payment.`
                  : `Decline ${confirmModal.bookingName} booking request.`}
              </p>
            </div>

            <button
              onClick={closeConfirmModal}
              className="rounded-full px-2 text-xl leading-none text-slate-400 transition hover:text-slate-700"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={closeConfirmModal}
              className="rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 active:scale-95"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmAction}
              className={`rounded-xl py-2.5 text-sm font-bold text-white shadow-sm transition active:scale-95 ${
                confirmModal.type === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {confirmModal.type === "approve" ? "Approve" : "Decline"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  const styles = {
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-800",
    green: "border-green-200 bg-green-50 text-green-800",
    red: "border-red-200 bg-red-50 text-red-800",
  };

  return (
    <div
      className={`rounded-3xl border p-5 shadow-sm ${
        styles[color] || "border-slate-200 bg-white text-slate-900"
      }`}
    >
      <p className="text-sm font-semibold opacity-80">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function InfoItem({ label, value, sub }) {
  return (
    <div className="min-w-0 rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 truncate text-sm font-bold text-slate-900">{value}</p>
      {sub && <p className="mt-1 truncate text-xs text-slate-500">{sub}</p>}
    </div>
  );
}