import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { DocumentArrowDownIcon } from "@heroicons/react/24/outline";
import ReviewModal from "../../components/ReviewModal";
import LoyaltyCard from "../../components/LoyaltyCard";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const LOYALTY_RULES = {
  REDEEM_POINTS_REQUIRED: 1000,
  REDEEM_DISCOUNT_PERCENT: 60,
};

export default function Bookings() {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [paymentMessage, setPaymentMessage] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewBooking, setReviewBooking] = useState(null);
  const [reviewedBookingIds, setReviewedBookingIds] = useState([]);

  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [useLoyaltyForBooking, setUseLoyaltyForBooking] = useState({});

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

  const getStoredPaymentPreference = (bookingId) => {
    if (!bookingId) return null;
    const v = localStorage.getItem(`booking_payment_pref_${bookingId}`);
    return v === "advance_30" || v === "full" ? v : null;
  };

  const clearStoredPaymentPreference = (bookingId) => {
    if (!bookingId) return;
    localStorage.removeItem(`booking_payment_pref_${bookingId}`);
  };

  const getPaymentPreference = (booking) => {
    if (booking?.paymentPreference === "advance_30") return "advance_30";
    if (booking?.paymentPreference === "full") return "full";

    if (Number(booking?.advancePercent) === 30) return "advance_30";
    if (Number(booking?.advancePercent) === 100) return "full";

    const localPref = getStoredPaymentPreference(booking?._id);
    if (localPref) return localPref;

    return "full";
  };

  const getPaymentLabel = (booking) => {
    return getPaymentPreference(booking) === "advance_30"
      ? "30% Advance"
      : "Full Payment";
  };

  const canRedeemForBooking = (booking) => {
    return (
      getPaymentPreference(booking) === "full" &&
      Number(loyaltyPoints || 0) >= LOYALTY_RULES.REDEEM_POINTS_REQUIRED &&
      !booking?.isPaid
    );
  };

  const getProjectedLoyaltyDiscount = (booking) => {
    const totalPrice = Number(booking?.totalPrice || 0);

    if (
      getPaymentPreference(booking) === "full" &&
      useLoyaltyForBooking[booking?._id] === true &&
      Number(loyaltyPoints || 0) >= LOYALTY_RULES.REDEEM_POINTS_REQUIRED
    ) {
      return Math.round(
        (totalPrice * LOYALTY_RULES.REDEEM_DISCOUNT_PERCENT) / 100
      );
    }

    return 0;
  };

  const getPayableAmount = (booking) => {
    const totalPrice = Number(booking?.totalPrice || 0);

    if (getPaymentPreference(booking) === "advance_30") {
      return Math.round(totalPrice * 0.3);
    }

    const savedDiscount = Number(booking?.discountFromPoints || 0);
    const liveDiscount = getProjectedLoyaltyDiscount(booking);
    const discount = savedDiscount > 0 ? savedDiscount : liveDiscount;

    return Math.max(0, totalPrice - discount);
  };

  const getPaidLabel = (booking) => {
    if (booking?.paymentStatusLabel) return booking.paymentStatusLabel;
    return getPaymentPreference(booking) === "advance_30"
      ? "30% paid"
      : "Full amount paid";
  };

  const getPaidAmount = (booking) => {
    if (Number(booking?.amountPaid) > 0) return Number(booking.amountPaid);
    return getPayableAmount(booking);
  };

  const updateStoredUserLoyaltyPoints = (nextBalance = null) => {
    try {
      const rawUser = localStorage.getItem("user");
      if (!rawUser) return;

      const parsedUser = JSON.parse(rawUser);

      if (nextBalance !== null) {
        parsedUser.loyaltyPoints = Number(nextBalance || 0);
      }

      localStorage.setItem("user", JSON.stringify(parsedUser));

      window.dispatchEvent(
        new CustomEvent("user-profile-updated", {
          detail: { loyaltyPoints: parsedUser.loyaltyPoints },
        })
      );
    } catch (err) {
      console.error("Failed to update local user loyalty points:", err);
    }
  };

  const loadLoyaltySummary = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/loyalty/me`, {
        headers: authHeaders(),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setLoyaltyPoints(Number(data?.loyaltyPoints || 0));
        updateStoredUserLoyaltyPoints(Number(data?.loyaltyPoints || 0));
      }
    } catch (err) {
      console.error("LOYALTY SUMMARY LOAD ERROR:", err);
    }
  };

  const loadReviewFlags = async (list) => {
    try {
      const checks = await Promise.all(
        list.map(async (booking) => {
          try {
            const res = await fetch(
              `${API_BASE}/api/reviews/can-review/${booking._id}`,
              {
                headers: authHeaders(),
              }
            );

            const data = await res.json().catch(() => ({}));

            return {
              bookingId: booking._id,
              alreadyReviewed: !!data?.alreadyReviewed,
            };
          } catch {
            return {
              bookingId: booking._id,
              alreadyReviewed: false,
            };
          }
        })
      );

      setReviewedBookingIds(
        checks
          .filter((item) => item.alreadyReviewed)
          .map((item) => item.bookingId)
      );
    } catch (err) {
      console.error("LOAD REVIEW FLAGS ERROR:", err);
    }
  };

  const loadBookings = async (showLoader = true) => {
    try {
      if (showLoader) setLoading(true);
      setError("");

      const token = getToken();
      if (!token) {
        setError("Please login first");
        if (showLoader) setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/api/bookings/me`, {
        headers: authHeaders(),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("API ERROR:", res.status, text);

        if (res.status === 401) {
          setError("Session expired. Please login again.");
        } else {
          setError("Failed to load bookings");
        }
        return;
      }

      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.bookings || [];

      setBookings(list);
      await loadReviewFlags(list);
      await loadLoyaltySummary();
    } catch (err) {
      console.error("LOAD ERROR:", err);
      setError("Failed to load bookings");
    } finally {
      if (showLoader) setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings(true);

    const interval = setInterval(() => {
      loadBookings(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const downloadInvoicePdf = async (bookingId) => {
    try {
      const token = getToken();

      const res = await fetch(`${API_BASE}/api/payment/invoice/${bookingId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        alert(data?.message || "Failed to download invoice");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("INVOICE DOWNLOAD ERROR:", err);
      alert("Failed to download invoice");
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pidx = params.get("pidx");
    const status = params.get("status");
    const bookingId = params.get("purchase_order_id") || params.get("bookingId");

    if (!pidx) return;

    if (status && status.toLowerCase() !== "completed") {
      if (status.toLowerCase() === "user canceled") {
        setPaymentMessage("Payment was cancelled.");
      } else {
        setPaymentMessage(`Payment status: ${status}`);
      }
      navigate("/bookings", { replace: true });
      return;
    }

    verifyPayment(pidx, bookingId);
  }, [location.search]);

  const verifyPayment = async (pidx, bookingId = null) => {
    try {
      const res = await fetch(`${API_BASE}/api/payment/khalti/verify`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ pidx, bookingId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPaymentMessage(data?.message || "Payment verification failed.");
        navigate("/bookings", { replace: true });
        return;
      }

      const earnedPoints = Number(data?.loyalty?.pointsEarned || 0);
      const pointsRedeemed = Number(data?.loyalty?.pointsRedeemed || 0);
      const discountFromPoints = Number(data?.loyalty?.discountFromPoints || 0);
      const currentBalance = Number(data?.loyalty?.currentBalance || 0);

      setLoyaltyPoints(currentBalance);
      updateStoredUserLoyaltyPoints(currentBalance);

      if (pointsRedeemed > 0 && earnedPoints > 0) {
        setPaymentMessage(
          `Payment completed successfully. You redeemed ${pointsRedeemed} points for Rs. ${discountFromPoints} discount and earned ${earnedPoints} new loyalty points. Professional invoice downloaded.`
        );
      } else if (pointsRedeemed > 0) {
        setPaymentMessage(
          `Payment completed successfully. You redeemed ${pointsRedeemed} points for Rs. ${discountFromPoints} discount. Professional invoice downloaded.`
        );
      } else if (earnedPoints > 0) {
        setPaymentMessage(
          `Payment completed successfully. You earned ${earnedPoints} loyalty points. Professional invoice downloaded.`
        );
      } else {
        setPaymentMessage(
          "Payment completed successfully. Professional invoice downloaded."
        );
      }

      const resolvedBookingId = data?.booking?._id || bookingId;
      if (resolvedBookingId) {
        await downloadInvoicePdf(resolvedBookingId);
      }

      await loadBookings(false);
      navigate("/bookings", { replace: true });
    } catch (err) {
      console.error("VERIFY ERROR:", err);
      setPaymentMessage("Payment verification failed.");
      navigate("/bookings", { replace: true });
    }
  };

  const handlePay = async (booking) => {
    try {
      const paymentPreference = getPaymentPreference(booking);
      const amountToPay = getPayableAmount(booking);

      const res = await fetch(`${API_BASE}/api/payment/khalti/initiate`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          amount: amountToPay,
          bookingId: booking._id,
          paymentType: paymentPreference,
          useLoyaltyPoints: !!useLoyaltyForBooking[booking._id],
        }),
      });

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert(data?.message || "Payment failed");
      }
    } catch (err) {
      console.error("PAY ERROR:", err);
      alert("Payment error");
    }
  };

  const cancelBooking = async (id) => {
    setActionLoadingId(id);

    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}/cancel`, {
        method: "PATCH",
        headers: authHeaders(),
      });

      if (!res.ok) {
        throw new Error("Cancel failed");
      }

      const data = await res.json();

      setBookings((prev) => prev.map((b) => (b._id === id ? data : b)));
      setConfirmOpen(false);
      setSelectedBooking(null);
      clearStoredPaymentPreference(id);
      await loadLoyaltySummary();
    } catch (err) {
      console.error(err);
      setError("Cancel failed");
    } finally {
      setActionLoadingId("");
    }
  };

  const formatSlot = (b) => `${b.startTime || ""} - ${b.endTime || ""}`;

  const cricsalLabel = (c) =>
    typeof c === "string" ? c : c?.name || "Cricsal";

  const getStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const isReviewed = (bookingId) => reviewedBookingIds.includes(bookingId);

  const loyaltyHint = useMemo(() => {
    const remaining = Math.max(
      0,
      LOYALTY_RULES.REDEEM_POINTS_REQUIRED - Number(loyaltyPoints || 0)
    );
    return remaining === 0
      ? "You can redeem 1000 points for 60% off on a full-payment booking."
      : `Earn ${remaining} more points to unlock 60% off.`;
  }, [loyaltyPoints]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-100 p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl font-medium hover:bg-green-100 transition"
            >
              ← Back
            </button>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
              <p className="text-sm text-gray-500">
                Manage your bookings, payments, reviews, and loyalty rewards
              </p>
            </div>
          </div>

          <Link
            to="/find-cricsal"
            className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition shadow-sm text-center"
          >
            + Book Now
          </Link>
        </div>

        <div className="mb-6">
          <LoyaltyCard loyaltyPoints={loyaltyPoints} />
          <p className="mt-3 text-sm text-gray-600">{loyaltyHint}</p>
        </div>

        {paymentMessage && (
          <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl mb-4">
            {paymentMessage}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-gray-100">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-14 text-gray-500">
              <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-3" />
              <p className="font-medium">Loading bookings...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-14">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No bookings yet
              </h3>
              <p className="text-sm text-gray-500 mb-5">
                You haven’t made any bookings yet.
              </p>
              <Link
                to="/find-cricsal"
                className="inline-block bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition"
              >
                Book a Cricsal
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => {
                const status = (b.status || "").toLowerCase();
                const paymentPreference = getPaymentPreference(b);
                const payableAmount = getPayableAmount(b);
                const canRedeem = canRedeemForBooking(b);
                const projectedDiscount = getProjectedLoyaltyDiscount(b);

                return (
                  <div
                    key={b._id}
                    className="border border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 hover:shadow-sm transition"
                  >
                    <div className="flex-1">
                      <p className="text-lg font-semibold text-gray-800">
                        {cricsalLabel(b.cricsal)}
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {b.date} • {formatSlot(b)}
                      </p>

                      {b.totalPrice != null && (
                        <p className="text-sm text-gray-600 mt-1">
                          Total:{" "}
                          <span className="font-semibold">
                            Rs. {Number(b.totalPrice || 0)}
                          </span>
                        </p>
                      )}

                      <p className="text-sm text-gray-600 mt-1">
                        Payment Option:{" "}
                        <span className="font-semibold">
                          {getPaymentLabel(b)}
                        </span>
                      </p>

                      {b.isPaid && (
                        <p className="text-sm text-green-700 mt-2 font-medium">
                          {getPaidLabel(b)} • Paid Rs. {getPaidAmount(b)}
                        </p>
                      )}

                      {Number(b.discountFromPoints || 0) > 0 && (
                        <p className="text-sm text-purple-700 mt-1 font-medium">
                          Loyalty Discount Used: Rs. {Number(b.discountFromPoints || 0)}
                        </p>
                      )}

                      {Number(b.pointsRedeemed || 0) > 0 && (
                        <p className="text-sm text-red-700 mt-1 font-medium">
                          Points Redeemed: {Number(b.pointsRedeemed || 0)}
                        </p>
                      )}

                      {Number(b.pointsEarned || 0) > 0 && (
                        <p className="text-sm text-amber-700 mt-1 font-medium">
                          Loyalty Points Earned: {Number(b.pointsEarned || 0)}
                        </p>
                      )}

                      {paymentPreference === "advance_30" && !b.isPaid && (
                        <p className="text-xs text-amber-700 mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 inline-block">
                          30% advance selected for this booking.
                        </p>
                      )}

                      {paymentPreference === "full" && !b.isPaid && (
                        <p className="text-xs text-blue-700 mt-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 inline-block">
                          Full payment selected for this booking.
                        </p>
                      )}

                      {status === "confirmed" &&
                        !b.isPaid &&
                        paymentPreference === "full" && (
                          <div className="mt-3">
                            <label
                              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs ${
                                canRedeem
                                  ? "border-yellow-200 bg-yellow-50 text-yellow-800"
                                  : "border-gray-200 bg-gray-50 text-gray-500"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={!!useLoyaltyForBooking[b._id]}
                                disabled={!canRedeem}
                                onChange={(e) =>
                                  setUseLoyaltyForBooking((prev) => ({
                                    ...prev,
                                    [b._id]: e.target.checked,
                                  }))
                                }
                              />
                              Use 1000 points for 60% off
                            </label>

                            {!!useLoyaltyForBooking[b._id] &&
                              projectedDiscount > 0 && (
                                <p className="mt-2 text-xs text-green-700 font-medium">
                                  Discount Preview: Rs. {projectedDiscount}
                                </p>
                              )}
                          </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 md:justify-end">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${getStatusBadge(
                          status
                        )}`}
                      >
                        {status || "unknown"}
                      </span>

                      {b.isPaid && (
                        <>
                          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                            Paid
                          </span>
                          <button
                            onClick={() => downloadInvoicePdf(b._id)}
                            title="Download Invoice"
                            aria-label="Download Invoice"
                            className="inline-flex items-center justify-center rounded-xl bg-emerald-600 p-2.5 text-white shadow-sm transition hover:bg-emerald-700"
                          >
                            <DocumentArrowDownIcon className="h-5 w-5" />
                          </button>
                        </>
                      )}

                      {status === "pending" && (
                        <span className="text-xs bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full font-medium border border-yellow-200">
                          Waiting for owner approval
                        </span>
                      )}

                      {status === "confirmed" && !b.isPaid && (
                        <button
                          onClick={() => handlePay(b)}
                          className="px-4 py-2 text-sm text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition font-medium"
                        >
                          Pay Rs. {payableAmount}
                        </button>
                      )}

                      {status === "confirmed" && !isReviewed(b._id) && (
                        <button
                          onClick={() => {
                            setReviewBooking(b);
                            setReviewModalOpen(true);
                          }}
                          className="px-4 py-2 text-sm text-white bg-yellow-500 rounded-xl hover:bg-yellow-600 transition font-medium"
                        >
                          Rate & Review
                        </button>
                      )}

                      {status === "confirmed" && isReviewed(b._id) && (
                        <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200">
                          Reviewed
                        </span>
                      )}

                      {(status === "pending" || status === "confirmed") && (
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setConfirmOpen(true);
                          }}
                          className="px-4 py-2 text-sm text-white bg-red-500 rounded-xl hover:bg-red-600 transition font-medium"
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

      {confirmOpen && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Cancel booking?
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              This action cannot be undone.
            </p>

            {getPaymentPreference(selectedBooking) === "advance_30" && (
              <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                If cancelled within 2 hours before game time, the 30% advance is
                non-refundable.
              </div>
            )}

            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              Cancelling a booking affects loyalty points:
              <div className="mt-2">
                • Normal cancellation: -40 points
              </div>
              <div>
                • Within 2 hours of game time: -120 points
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmOpen(false);
                  setSelectedBooking(null);
                }}
                className="flex-1 border border-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition"
              >
                No
              </button>

              <button
                onClick={() => cancelBooking(selectedBooking._id)}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-medium hover:bg-red-700 transition"
              >
                {actionLoadingId === selectedBooking._id
                  ? "Cancelling..."
                  : "Yes, Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ReviewModal
        isOpen={reviewModalOpen}
        booking={reviewBooking}
        onClose={() => {
          setReviewModalOpen(false);
          setReviewBooking(null);
        }}
        onSuccess={() => {
          setReviewModalOpen(false);
          setReviewBooking(null);
          loadBookings(false);
        }}
      />
    </div>
  );
}