
// import React, { useMemo, useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   Popup,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// // Fix Leaflet icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// });

// export default function BookCricsal() {
//   const { cricsalId } = useParams();
//   const navigate = useNavigate();

//   const [date, setDate] = useState("");
//   const [slot, setSlot] = useState("");
//   const [hours, setHours] = useState(1);
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [msgType, setMsgType] = useState("");

//   const [userLocation, setUserLocation] = useState(null);
//   const [distance, setDistance] = useState(null);

//   const [paymentPreference, setPaymentPreference] = useState("advance_30");
//   const [policyAccepted, setPolicyAccepted] = useState(false);

//   const token = useMemo(() => {
//     return (
//       localStorage.getItem("token") ||
//       localStorage.getItem("accessToken") ||
//       ""
//     );
//   }, []);

//   const calculateEndTime = (start, hrs) => {
//     const [h, m] = start.split(":").map(Number);
//     const end = h + Number(hrs);
//     return `${String(end).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
//   };

//   const formatSlotRange = () => {
//     if (!slot) return "-";
//     return `${slot} - ${calculateEndTime(slot, hours)}`;
//   };

//   const getSelectedPaymentLabel = () => {
//     return paymentPreference === "advance_30" ? "30% Advance" : "Full Payment";
//   };

//   useEffect(() => {
//     navigator.geolocation?.getCurrentPosition((pos) => {
//       setUserLocation([pos.coords.latitude, pos.coords.longitude]);
//     });
//   }, []);

//   const groundLocation = [27.7172, 85.324];

//   useEffect(() => {
//     if (userLocation) {
//       const dist =
//         L.latLng(userLocation).distanceTo(L.latLng(groundLocation)) / 1000;
//       setDistance(dist.toFixed(2));
//     }
//   }, [userLocation]);

//   const handleConfirm = async (e) => {
//     e.preventDefault();
//     setMsg("");
//     setMsgType("");

//     if (!token) {
//       setMsg("Please login first.");
//       setMsgType("error");
//       return;
//     }

//     if (!date || !slot) {
//       setMsg("Please select a date and time slot.");
//       setMsgType("error");
//       return;
//     }

//     if (!policyAccepted) {
//       setMsg("Please accept the booking and cancellation policy.");
//       setMsgType("error");
//       return;
//     }

//     try {
//       setLoading(true);

//       const start = slot;
//       const end = calculateEndTime(start, hours);

//       const res = await fetch(`${API_BASE}/api/bookings`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           ground: cricsalId,
//           date,
//           startTime: start,
//           endTime: end,
//           durationHours: hours,

//           // payment choice is saved now,
//           // actual payment happens only after owner approval on Bookings page
//           paymentPreference, // "advance_30" or "full"
//           advancePercent: paymentPreference === "advance_30" ? 30 : 100,
//           nonRefundableHours: 2,
//           requiresOwnerApproval: true,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setMsg(data?.message || "Booking failed");
//         setMsgType("error");
//         return;
//       }

//       setMsg(
//         "Booking request submitted successfully. Please wait for owner approval before making payment."
//       );
//       setMsgType("success");

//       setTimeout(() => {
//         navigate("/bookings");
//       }, 1200);
//     } catch (error) {
//       console.error(error);
//       setMsg("Server error");
//       setMsgType("error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const timeSlots = [
//     "06:00",
//     "07:00",
//     "08:00",
//     "09:00",
//     "10:00",
//     "11:00",
//     "12:00",
//     "13:00",
//     "14:00",
//     "15:00",
//     "16:00",
//     "17:00",
//     "18:00",
//     "19:00",
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-100 px-4 py-6 sm:px-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => navigate(-1)}
//               className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100"
//             >
//               ← Back
//             </button>

//             <div>
//               <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
//                 Book Cricsal
//               </h1>
//               <p className="text-sm text-gray-500">
//                 Submit your booking request and pay after owner approval
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-3">
//           <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
//             <div className="mb-6">
//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 Booking Date
//               </label>
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
//               />
//             </div>

//             <div className="mb-6">
//               <label className="mb-3 block text-sm font-semibold text-gray-700">
//                 Select Duration
//               </label>
//               <div className="flex flex-wrap gap-3">
//                 {[1, 2, 3].map((h) => (
//                   <button
//                     key={h}
//                     type="button"
//                     onClick={() => setHours(h)}
//                     className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
//                       hours === h
//                         ? "bg-green-700 text-white shadow-sm"
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     }`}
//                   >
//                     {h} Hour{h > 1 ? "s" : ""}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             <div className="mb-6">
//               <label className="mb-3 block text-sm font-semibold text-gray-700">
//                 Select Time Slot
//               </label>
//               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
//                 {timeSlots.map((start) => {
//                   const display = `${start} - ${calculateEndTime(start, hours)}`;
//                   return (
//                     <button
//                       key={start}
//                       type="button"
//                       onClick={() => setSlot(start)}
//                       className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
//                         slot === start
//                           ? "border-green-700 bg-green-700 text-white shadow-sm"
//                           : "border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50"
//                       }`}
//                     >
//                       {display}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             <div className="mb-6">
//               <label className="mb-3 block text-sm font-semibold text-gray-700">
//                 Choose Payment Option
//               </label>

//               <div className="grid gap-3 sm:grid-cols-2">
//                 <button
//                   type="button"
//                   onClick={() => setPaymentPreference("advance_30")}
//                   className={`rounded-2xl border p-4 text-left transition ${
//                     paymentPreference === "advance_30"
//                       ? "border-green-700 bg-green-50 ring-2 ring-green-100"
//                       : "border-gray-200 bg-white hover:border-green-300"
//                   }`}
//                 >
//                   <div className="mb-1 flex items-center justify-between">
//                     <h3 className="text-sm font-bold text-gray-800">
//                       Pay 30% Advance
//                     </h3>
//                     {paymentPreference === "advance_30" && (
//                       <span className="rounded-full bg-green-700 px-2 py-1 text-xs font-semibold text-white">
//                         Selected
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-600">
//                     Pay only 30% after owner approval. This 30% is non-refundable
//                     if you cancel within 2 hours before game time.
//                   </p>
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => setPaymentPreference("full")}
//                   className={`rounded-2xl border p-4 text-left transition ${
//                     paymentPreference === "full"
//                       ? "border-green-700 bg-green-50 ring-2 ring-green-100"
//                       : "border-gray-200 bg-white hover:border-green-300"
//                   }`}
//                 >
//                   <div className="mb-1 flex items-center justify-between">
//                     <h3 className="text-sm font-bold text-gray-800">
//                       Pay Full Amount
//                     </h3>
//                     {paymentPreference === "full" && (
//                       <span className="rounded-full bg-green-700 px-2 py-1 text-xs font-semibold text-white">
//                         Selected
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-600">
//                     Pay the complete amount after owner approval for a smoother
//                     check-in process.
//                   </p>
//                 </button>
//               </div>
//             </div>

//             <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
//               <h3 className="mb-2 text-sm font-bold text-amber-900">
//                 Booking & Cancellation Policy
//               </h3>
//               <ul className="space-y-2 text-sm text-amber-800">
//                 <li>• Your booking is first submitted as a <b>pending request</b>.</li>
//                 <li>• Owner must approve the booking first.</li>
//                 <li>• Payment is made only <b>after owner approval</b>.</li>
//                 <li>• You may choose <b>30% advance</b> or <b>full payment</b>.</li>
//                 <li>
//                   • If you choose 30% advance, that <b>30% is non-refundable</b>{" "}
//                   when cancelling within <b>2 hours before game time</b>.
//                 </li>
//               </ul>

//               <label className="mt-4 flex items-start gap-3">
//                 <input
//                   type="checkbox"
//                   checked={policyAccepted}
//                   onChange={(e) => setPolicyAccepted(e.target.checked)}
//                   className="mt-1 h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-600"
//                 />
//                 <span className="text-sm text-gray-700">
//                   I understand and accept the booking, approval, payment, and
//                   cancellation policy.
//                 </span>
//               </label>
//             </div>

//             {msg && (
//               <div
//                 className={`mb-5 rounded-xl px-4 py-3 text-sm ${
//                   msgType === "success"
//                     ? "border border-green-100 bg-green-50 text-green-700"
//                     : "border border-red-100 bg-red-50 text-red-600"
//                 }`}
//               >
//                 {msg}
//               </div>
//             )}

//             <div className="flex flex-col gap-3 sm:flex-row">
//               <button
//                 onClick={handleConfirm}
//                 disabled={loading}
//                 className="flex-1 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
//               >
//                 {loading ? "Submitting..." : "Submit Booking Request"}
//               </button>
//             </div>
//           </div>

//           <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm space-y-5">
//             <div>
//               <h2 className="text-lg font-bold text-gray-800">Booking Summary</h2>
//               <p className="text-sm text-gray-500">
//                 Review your selected booking details
//               </p>
//             </div>

//             <div className="space-y-3 rounded-2xl bg-gray-50 p-4">
//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-500">Date</span>
//                 <span className="text-sm font-semibold text-gray-800">
//                   {date || "-"}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-500">Slot</span>
//                 <span className="text-right text-sm font-semibold text-gray-800">
//                   {formatSlotRange()}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-500">Duration</span>
//                 <span className="text-sm font-semibold text-gray-800">
//                   {hours}h
//                 </span>
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-500">Payment Choice</span>
//                 <span className="text-right text-sm font-semibold text-gray-800">
//                   {getSelectedPaymentLabel()}
//                 </span>
//               </div>

//               <div className="flex items-center justify-between">
//                 <span className="text-sm text-gray-500">Booking Flow</span>
//                 <span className="text-right text-sm font-semibold text-amber-700">
//                   Pending → Owner Approval → Payment
//                 </span>
//               </div>

//               {paymentPreference === "advance_30" && (
//                 <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
//                   <p className="text-xs text-amber-800">
//                     30% advance is non-refundable if cancelled within 2 hours
//                     before game time.
//                   </p>
//                 </div>
//               )}

//               {distance && (
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-500">Distance</span>
//                   <span className="text-sm font-semibold text-gray-800">
//                     {distance} km
//                   </span>
//                 </div>
//               )}
//             </div>

//             <div>
//               <h3 className="mb-3 text-sm font-semibold text-gray-700">
//                 Ground Location
//               </h3>
//               <div className="h-72 overflow-hidden rounded-2xl border border-gray-200">
//                 <MapContainer
//                   center={groundLocation}
//                   zoom={13}
//                   style={{ height: "100%", width: "100%" }}
//                 >
//                   <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//                   <Marker position={groundLocation}>
//                     <Popup>Ground Location</Popup>
//                   </Marker>

//                   {userLocation && (
//                     <>
//                       <Marker position={userLocation}>
//                         <Popup>Your Location</Popup>
//                       </Marker>
//                       <Polyline positions={[userLocation, groundLocation]} />
//                     </>
//                   )}
//                 </MapContainer>
//               </div>
//             </div>

//             <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3">
//               <p className="text-sm text-green-800">
//                 {distance
//                   ? `You are approximately ${distance} km away from the ground.`
//                   : "Allow location access to see your distance from the ground."}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

export default function BookCricsal() {
  const { cricsalId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [hours, setHours] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  const [paymentPreference, setPaymentPreference] = useState("advance_30");
  const [policyAccepted, setPolicyAccepted] = useState(false);

  const token = useMemo(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      ""
    );
  }, []);

  const calculateEndTime = (start, hrs) => {
    const [h, m] = start.split(":").map(Number);
    const end = h + Number(hrs);
    return `${String(end).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  const formatSlotRange = () => {
    if (!slot) return "-";
    return `${slot} - ${calculateEndTime(slot, hours)}`;
  };

  const getSelectedPaymentLabel = () => {
    return paymentPreference === "advance_30" ? "30% Advance" : "Full Payment";
  };

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      setUserLocation([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  const groundLocation = [27.7172, 85.324];

  useEffect(() => {
    if (userLocation) {
      const dist =
        L.latLng(userLocation).distanceTo(L.latLng(groundLocation)) / 1000;
      setDistance(dist.toFixed(2));
    }
  }, [userLocation]);

  const saveLocalPaymentPreference = (bookingId, preference) => {
    if (!bookingId || !preference) return;
    localStorage.setItem(`booking_payment_pref_${bookingId}`, preference);
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setMsg("");
    setMsgType("");

    if (!token) {
      setMsg("Please login first.");
      setMsgType("error");
      return;
    }

    if (!date || !slot) {
      setMsg("Please select a date and time slot.");
      setMsgType("error");
      return;
    }

    if (!policyAccepted) {
      setMsg("Please accept the booking and cancellation policy.");
      setMsgType("error");
      return;
    }

    try {
      setLoading(true);

      const start = slot;
      const end = calculateEndTime(start, hours);

      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ground: cricsalId,
          date,
          startTime: start,
          endTime: end,
          durationHours: hours,
          paymentPreference, // "advance_30" | "full"
          advancePercent: paymentPreference === "advance_30" ? 30 : 100,
          nonRefundableHours: 2,
          requiresOwnerApproval: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data?.message || "Booking failed");
        setMsgType("error");
        return;
      }

      // Save the user's exact choice locally by booking ID
      const createdBookingId = data?._id || data?.booking?._id || null;
      if (createdBookingId) {
        saveLocalPaymentPreference(createdBookingId, paymentPreference);
      }

      setMsg(
        "Booking request submitted successfully. Please wait for owner approval before making payment."
      );
      setMsgType("success");

      setTimeout(() => {
        navigate("/bookings");
      }, 1200);
    } catch (error) {
      console.error(error);
      setMsg("Server error");
      setMsgType("error");
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-100 px-4 py-6 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100"
            >
              ← Back
            </button>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Book Cricsal
              </h1>
              <p className="text-sm text-gray-500">
                Submit your booking request and pay after owner approval
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm">
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Booking Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Select Duration
              </label>
              <div className="flex flex-wrap gap-3">
                {[1, 2, 3].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHours(h)}
                    className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                      hours === h
                        ? "bg-green-700 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {h} Hour{h > 1 ? "s" : ""}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Select Time Slot
              </label>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {timeSlots.map((start) => {
                  const display = `${start} - ${calculateEndTime(start, hours)}`;
                  return (
                    <button
                      key={start}
                      type="button"
                      onClick={() => setSlot(start)}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                        slot === start
                          ? "border-green-700 bg-green-700 text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50"
                      }`}
                    >
                      {display}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-3 block text-sm font-semibold text-gray-700">
                Choose Payment Option
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setPaymentPreference("advance_30")}
                  className={`rounded-2xl border p-4 text-left transition ${
                    paymentPreference === "advance_30"
                      ? "border-green-700 bg-green-50 ring-2 ring-green-100"
                      : "border-gray-200 bg-white hover:border-green-300"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800">
                      Pay 30% Advance
                    </h3>
                    {paymentPreference === "advance_30" && (
                      <span className="rounded-full bg-green-700 px-2 py-1 text-xs font-semibold text-white">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Pay only 30% after owner approval. This 30% is non-refundable
                    if you cancel within 2 hours before game time.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentPreference("full")}
                  className={`rounded-2xl border p-4 text-left transition ${
                    paymentPreference === "full"
                      ? "border-green-700 bg-green-50 ring-2 ring-green-100"
                      : "border-gray-200 bg-white hover:border-green-300"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800">
                      Pay Full Amount
                    </h3>
                    {paymentPreference === "full" && (
                      <span className="rounded-full bg-green-700 px-2 py-1 text-xs font-semibold text-white">
                        Selected
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    Pay the complete amount after owner approval.
                  </p>
                </button>
              </div>
            </div>

            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <h3 className="mb-2 text-sm font-bold text-amber-900">
                Booking & Cancellation Policy
              </h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li>• Your booking is first submitted as a <b>pending request</b>.</li>
                <li>• Owner must approve the booking first.</li>
                <li>• Payment is made only <b>after owner approval</b>.</li>
                <li>• You may choose <b>30% advance</b> or <b>full payment</b>.</li>
                <li>
                  • If you choose 30% advance, that <b>30% is non-refundable</b>{" "}
                  when cancelling within <b>2 hours before game time</b>.
                </li>
              </ul>

              <label className="mt-4 flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={policyAccepted}
                  onChange={(e) => setPolicyAccepted(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-green-700 focus:ring-green-600"
                />
                <span className="text-sm text-gray-700">
                  I understand and accept the booking, approval, payment, and
                  cancellation policy.
                </span>
              </label>
            </div>

            {msg && (
              <div
                className={`mb-5 rounded-xl px-4 py-3 text-sm ${
                  msgType === "success"
                    ? "border border-green-100 bg-green-50 text-green-700"
                    : "border border-red-100 bg-red-50 text-red-600"
                }`}
              >
                {msg}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Submit Booking Request"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 sm:p-6 shadow-sm space-y-5">
            <div>
              <h2 className="text-lg font-bold text-gray-800">Booking Summary</h2>
              <p className="text-sm text-gray-500">
                Review your selected booking details
              </p>
            </div>

            <div className="space-y-3 rounded-2xl bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Date</span>
                <span className="text-sm font-semibold text-gray-800">
                  {date || "-"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Slot</span>
                <span className="text-right text-sm font-semibold text-gray-800">
                  {formatSlotRange()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Duration</span>
                <span className="text-sm font-semibold text-gray-800">
                  {hours}h
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Payment Choice</span>
                <span className="text-right text-sm font-semibold text-gray-800">
                  {getSelectedPaymentLabel()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Booking Flow</span>
                <span className="text-right text-sm font-semibold text-amber-700">
                  Pending → Owner Approval → Payment
                </span>
              </div>

              {paymentPreference === "advance_30" && (
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                  <p className="text-xs text-amber-800">
                    30% advance is non-refundable if cancelled within 2 hours
                    before game time.
                  </p>
                </div>
              )}

              {distance && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Distance</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {distance} km
                  </span>
                </div>
              )}
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-700">
                Ground Location
              </h3>
              <div className="h-72 overflow-hidden rounded-2xl border border-gray-200">
                <MapContainer
                  center={groundLocation}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  <Marker position={groundLocation}>
                    <Popup>Ground Location</Popup>
                  </Marker>

                  {userLocation && (
                    <>
                      <Marker position={userLocation}>
                        <Popup>Your Location</Popup>
                      </Marker>
                      <Polyline positions={[userLocation, groundLocation]} />
                    </>
                  )}
                </MapContainer>
              </div>
            </div>

            <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3">
              <p className="text-sm text-green-800">
                {distance
                  ? `You are approximately ${distance} km away from the ground.`
                  : "Allow location access to see your distance from the ground."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}