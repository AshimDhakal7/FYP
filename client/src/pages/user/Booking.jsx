
// import React, { useEffect, useMemo, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

// export default function Bookings() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [loading, setLoading] = useState(true);
//   const [bookings, setBookings] = useState([]);
//   const [error, setError] = useState("");
//   const [actionLoadingId, setActionLoadingId] = useState("");
//   const [paymentMessage, setPaymentMessage] = useState("");

//   const [confirmOpen, setConfirmOpen] = useState(false);
//   const [selectedBooking, setSelectedBooking] = useState(null);

//   const getToken = () =>
//     localStorage.getItem("token") ||
//     localStorage.getItem("accessToken") ||
//     "";

//   const authHeaders = () => {
//     const token = getToken();
//     return {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     };
//   };

//   const getStoredPaymentPreference = (bookingId) => {
//     if (!bookingId) return null;
//     return localStorage.getItem(`booking_payment_pref_${bookingId}`);
//   };

//   const setStoredPaymentPreference = (bookingId, value) => {
//     if (!bookingId || !value) return;
//     localStorage.setItem(`booking_payment_pref_${bookingId}`, value);
//   };

//   const clearStoredPaymentPreference = (bookingId) => {
//     if (!bookingId) return;
//     localStorage.removeItem(`booking_payment_pref_${bookingId}`);
//   };

//   const getPaymentPreference = (booking) => {
//     const directPref = booking?.paymentPreference;

//     if (directPref === "full" || directPref === "advance_30") {
//       return directPref;
//     }

//     if (Number(booking?.advancePercent) === 30) {
//       return "advance_30";
//     }

//     if (Number(booking?.advancePercent) === 100) {
//       return "full";
//     }

//     const storedPref = getStoredPaymentPreference(booking?._id);
//     if (storedPref === "full" || storedPref === "advance_30") {
//       return storedPref;
//     }

//     return "full";
//   };

//   const getPaymentLabel = (booking) => {
//     const pref = getPaymentPreference(booking);
//     return pref === "advance_30" ? "30% Advance" : "Full Payment";
//   };

//   const getPayableAmount = (booking) => {
//     const totalPrice = Number(booking?.totalPrice || 0);
//     const pref = getPaymentPreference(booking);

//     if (pref === "advance_30") {
//       return Math.round(totalPrice * 0.3);
//     }

//     return totalPrice;
//   };

//   const loadBookings = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const token = getToken();
//       if (!token) {
//         setError("Please login first");
//         setLoading(false);
//         return;
//       }

//       const res = await fetch(`${API_BASE}/api/bookings/me`, {
//         headers: authHeaders(),
//       });

//       if (!res.ok) {
//         const text = await res.text();
//         console.error("API ERROR:", res.status, text);

//         if (res.status === 401) {
//           setError("Session expired. Please login again.");
//         } else {
//           setError("Failed to load bookings");
//         }
//         return;
//       }

//       const data = await res.json();
//       const list = Array.isArray(data) ? data : data?.bookings || [];

//       const enrichedList = list.map((booking) => {
//         const pref = getPaymentPreference(booking);
//         return {
//           ...booking,
//           paymentPreferenceResolved: pref,
//         };
//       });

//       setBookings(enrichedList);
//     } catch (err) {
//       console.error("LOAD ERROR:", err);
//       setError("Failed to load bookings");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadBookings();
//   }, []);

//   useEffect(() => {
//     const params = new URLSearchParams(location.search);
//     const pidx = params.get("pidx");
//     const status = params.get("status");
//     const bookingId = params.get("purchase_order_id") || params.get("bookingId");

//     if (!pidx) return;

//     if (status && status.toLowerCase() !== "completed") {
//       if (status.toLowerCase() === "user canceled") {
//         setPaymentMessage("Payment was cancelled.");
//       } else {
//         setPaymentMessage(`Payment status: ${status}`);
//       }

//       navigate("/bookings", { replace: true });
//       return;
//     }

//     verifyPayment(pidx, bookingId);
//   }, [location.search]);

//   const verifyPayment = async (pidx, bookingIdFromCallback = null) => {
//     try {
//       const res = await fetch(`${API_BASE}/api/payment/khalti/verify`, {
//         method: "POST",
//         headers: authHeaders(),
//         body: JSON.stringify({ pidx }),
//       });

//       if (!res.ok) {
//         console.error("Verification failed");
//         setPaymentMessage("Payment verification failed.");
//         navigate("/bookings", { replace: true });
//         return;
//       }

//       const data = await res.json();

//       const verifiedBookingId =
//         data?.booking?._id ||
//         data?._id ||
//         data?.bookingId ||
//         bookingIdFromCallback ||
//         null;

//       if (verifiedBookingId) {
//         clearStoredPaymentPreference(verifiedBookingId);
//       }

//       setPaymentMessage("Payment completed successfully.");
//       await loadBookings();
//       navigate("/bookings", { replace: true });
//     } catch (err) {
//       console.error("VERIFY ERROR:", err);
//       setPaymentMessage("Payment verification failed.");
//       navigate("/bookings", { replace: true });
//     }
//   };

//   const handlePay = async (booking) => {
//     try {
//       const paymentPreference = getPaymentPreference(booking);
//       const amountToPay = getPayableAmount(booking);

//       setStoredPaymentPreference(booking._id, paymentPreference);

//       console.log("BOOKING OBJECT:", booking);
//       console.log("paymentPreference:", paymentPreference);
//       console.log("totalPrice:", Number(booking.totalPrice || 0));
//       console.log("amountToPay:", amountToPay);

//       const res = await fetch(`${API_BASE}/api/payment/khalti/initiate`, {
//         method: "POST",
//         headers: authHeaders(),
//         body: JSON.stringify({
//           amount: amountToPay,
//           bookingId: booking._id,
//           paymentType: paymentPreference,
//         }),
//       });

//       const data = await res.json();
//       console.log("PAYMENT INIT RESPONSE:", data);

//       if (data?.url) {
//         window.location.href = data.url;
//       } else {
//         alert(data?.message || "Payment failed");
//       }
//     } catch (err) {
//       console.error("PAY ERROR:", err);
//       alert("Payment error");
//     }
//   };

//   const cancelBooking = async (id) => {
//     setActionLoadingId(id);

//     try {
//       const res = await fetch(`${API_BASE}/api/bookings/${id}/cancel`, {
//         method: "PATCH",
//         headers: authHeaders(),
//       });

//       if (!res.ok) {
//         throw new Error("Cancel failed");
//       }

//       const data = await res.json();

//       setBookings((prev) => prev.map((b) => (b._id === id ? data : b)));
//       setConfirmOpen(false);
//       setSelectedBooking(null);
//       clearStoredPaymentPreference(id);
//     } catch (err) {
//       console.error(err);
//       setError("Cancel failed");
//     } finally {
//       setActionLoadingId("");
//     }
//   };

//   const formatSlot = (b) => `${b.startTime || ""} - ${b.endTime || ""}`;

//   const cricsalLabel = (c) =>
//     typeof c === "string" ? c : c?.name || "Cricsal";

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "confirmed":
//         return "bg-green-100 text-green-700";
//       case "pending":
//         return "bg-yellow-100 text-yellow-700";
//       case "cancelled":
//         return "bg-red-100 text-red-700";
//       case "completed":
//         return "bg-blue-100 text-blue-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-100 p-4 sm:p-6">
//       <div className="max-w-5xl mx-auto">
//         <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate(-1)}
//               className="inline-flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-xl font-medium hover:bg-green-100 transition"
//             >
//               ← Back
//             </button>

//             <div>
//               <h1 className="text-2xl font-bold text-gray-800">My Bookings</h1>
//               <p className="text-sm text-gray-500">
//                 Manage your bookings and payments
//               </p>
//             </div>
//           </div>

//           <Link
//             to="/find-cricsal"
//             className="bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition shadow-sm text-center"
//           >
//             + Book Now
//           </Link>
//         </div>

//         {paymentMessage && (
//           <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl mb-4">
//             {paymentMessage}
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-4">
//             {error}
//           </div>
//         )}

//         <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-md border border-gray-100">
//           {loading ? (
//             <div className="flex flex-col items-center justify-center py-14 text-gray-500">
//               <div className="w-10 h-10 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-3" />
//               <p className="font-medium">Loading bookings...</p>
//             </div>
//           ) : bookings.length === 0 ? (
//             <div className="text-center py-14">
//               <h3 className="text-lg font-semibold text-gray-700 mb-2">
//                 No bookings yet
//               </h3>
//               <p className="text-sm text-gray-500 mb-5">
//                 You haven’t made any bookings yet.
//               </p>
//               <Link
//                 to="/find-cricsal"
//                 className="inline-block bg-green-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition"
//               >
//                 Book a Cricsal
//               </Link>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {bookings.map((b) => {
//                 const status = (b.status || "").toLowerCase();
//                 const paymentPreference = getPaymentPreference(b);
//                 const payableAmount = getPayableAmount(b);

//                 return (
//                   <div
//                     key={b._id}
//                     className="border border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 hover:shadow-sm transition"
//                   >
//                     <div>
//                       <p className="text-lg font-semibold text-gray-800">
//                         {cricsalLabel(b.cricsal)}
//                       </p>

//                       <p className="text-sm text-gray-500 mt-1">
//                         {b.date} • {formatSlot(b)}
//                       </p>

//                       {b.totalPrice != null && (
//                         <p className="text-sm text-gray-600 mt-1">
//                           Total:{" "}
//                           <span className="font-semibold">
//                             Rs. {Number(b.totalPrice || 0)}
//                           </span>
//                         </p>
//                       )}

//                       <p className="text-sm text-gray-600 mt-1">
//                         Payment Option:{" "}
//                         <span className="font-semibold">
//                           {getPaymentLabel(b)}
//                         </span>
//                       </p>

//                       {paymentPreference === "advance_30" && (
//                         <p className="text-xs text-amber-700 mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 inline-block">
//                           30% advance is non-refundable within 2 hours before game time.
//                         </p>
//                       )}

//                       {paymentPreference === "full" && (
//                         <p className="text-xs text-blue-700 mt-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 inline-block">
//                           Full payment selected for this booking.
//                         </p>
//                       )}
//                     </div>

//                     <div className="flex flex-wrap items-center gap-2">
//                       <span
//                         className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${getStatusBadge(
//                           status
//                         )}`}
//                       >
//                         {status || "unknown"}
//                       </span>

//                       {b.isPaid && (
//                         <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
//                           Paid
//                         </span>
//                       )}

//                       {status === "pending" && (
//                         <span className="text-xs bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full font-medium border border-yellow-200">
//                           Waiting for owner approval
//                         </span>
//                       )}

//                       {status === "confirmed" && !b.isPaid && (
//                         <button
//                           onClick={() => handlePay(b)}
//                           className="px-4 py-2 text-sm text-white bg-purple-600 rounded-xl hover:bg-purple-700 transition font-medium"
//                         >
//                           Pay Rs. {payableAmount}
//                         </button>
//                       )}

//                       {(status === "pending" || status === "confirmed") && (
//                         <button
//                           onClick={() => {
//                             setSelectedBooking(b);
//                             setConfirmOpen(true);
//                           }}
//                           className="px-4 py-2 text-sm text-white bg-red-500 rounded-xl hover:bg-red-600 transition font-medium"
//                         >
//                           Cancel
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       </div>

//       {confirmOpen && selectedBooking && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
//           <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl">
//             <h3 className="text-lg font-bold text-gray-800 mb-2">
//               Cancel booking?
//             </h3>
//             <p className="text-sm text-gray-500 mb-5">
//               This action cannot be undone.
//             </p>

//             {getPaymentPreference(selectedBooking) === "advance_30" && (
//               <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
//                 If cancelled within 2 hours before game time, the 30% advance is non-refundable.
//               </div>
//             )}

//             <div className="flex gap-3">
//               <button
//                 onClick={() => {
//                   setConfirmOpen(false);
//                   setSelectedBooking(null);
//                 }}
//                 className="flex-1 border border-gray-300 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition"
//               >
//                 No
//               </button>

//               <button
//                 onClick={() => cancelBooking(selectedBooking._id)}
//                 className="flex-1 bg-red-600 text-white py-2.5 rounded-xl font-medium hover:bg-red-700 transition"
//               >
//                 {actionLoadingId === selectedBooking._id
//                   ? "Cancelling..."
//                   : "Yes, Cancel"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

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
    // 1. Trust backend if present
    if (booking?.paymentPreference === "advance_30") return "advance_30";
    if (booking?.paymentPreference === "full") return "full";

    // 2. Try advancePercent from backend
    if (Number(booking?.advancePercent) === 30) return "advance_30";
    if (Number(booking?.advancePercent) === 100) return "full";

    // 3. Fallback to local saved preference by booking id
    const localPref = getStoredPaymentPreference(booking?._id);
    if (localPref) return localPref;

    // 4. Safe default
    return "full";
  };

  const getPaymentLabel = (booking) => {
    return getPaymentPreference(booking) === "advance_30"
      ? "30% Advance"
      : "Full Payment";
  };

  const getPayableAmount = (booking) => {
    const totalPrice = Number(booking?.totalPrice || 0);
    return getPaymentPreference(booking) === "advance_30"
      ? Math.round(totalPrice * 0.3)
      : totalPrice;
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();
      if (!token) {
        setError("Please login first");
        setLoading(false);
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
    } catch (err) {
      console.error("LOAD ERROR:", err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

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

  const verifyPayment = async (pidx, bookingIdFromCallback = null) => {
    try {
      const res = await fetch(`${API_BASE}/api/payment/khalti/verify`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ pidx }),
      });

      if (!res.ok) {
        console.error("Verification failed");
        setPaymentMessage("Payment verification failed.");
        navigate("/bookings", { replace: true });
        return;
      }

      const data = await res.json();

      const verifiedBookingId =
        data?.booking?._id ||
        data?._id ||
        data?.bookingId ||
        bookingIdFromCallback ||
        null;

      if (verifiedBookingId) {
        clearStoredPaymentPreference(verifiedBookingId);
      }

      setPaymentMessage("Payment completed successfully.");
      await loadBookings();
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

      console.log("BOOKING:", booking);
      console.log("RESOLVED PAYMENT PREF:", paymentPreference);
      console.log("AMOUNT TO PAY:", amountToPay);

      const res = await fetch(`${API_BASE}/api/payment/khalti/initiate`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          amount: amountToPay,
          bookingId: booking._id,
          paymentType: paymentPreference,
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
                Manage your bookings and payments
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

                return (
                  <div
                    key={b._id}
                    className="border border-gray-200 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 hover:shadow-sm transition"
                  >
                    <div>
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

                      {paymentPreference === "advance_30" && (
                        <p className="text-xs text-amber-700 mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 inline-block">
                          30% advance selected for this booking.
                        </p>
                      )}

                      {paymentPreference === "full" && (
                        <p className="text-xs text-blue-700 mt-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 inline-block">
                          Full payment selected for this booking.
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${getStatusBadge(
                          status
                        )}`}
                      >
                        {status || "unknown"}
                      </span>

                      {b.isPaid && (
                        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                          Paid
                        </span>
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
                If cancelled within 2 hours before game time, the 30% advance is non-refundable.
              </div>
            )}

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
    </div>
  );
}