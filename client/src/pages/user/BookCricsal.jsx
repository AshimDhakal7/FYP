
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Polyline,
//   Popup,
//   useMap,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// });

// const groundIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const userIcon = new L.Icon({
//   iconUrl:
//     "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// const TIME_SLOTS = [
//   "06:00",
//   "07:00",
//   "08:00",
//   "09:00",
//   "10:00",
//   "11:00",
//   "12:00",
//   "13:00",
//   "14:00",
//   "15:00",
//   "16:00",
//   "17:00",
//   "18:00",
//   "19:00",
// ];

// function FitMapToMarkers({ userLocation, groundLocation }) {
//   const map = useMap();

//   useEffect(() => {
//     if (userLocation && groundLocation) {
//       map.fitBounds([userLocation, groundLocation], { padding: [40, 40] });
//     } else if (groundLocation) {
//       map.setView(groundLocation, 15);
//     }
//   }, [map, userLocation, groundLocation]);

//   return null;
// }

// const toMinutes = (t) => {
//   const [h, m] = String(t).split(":").map(Number);
//   return h * 60 + m;
// };

// const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && aEnd > bStart;

// const isToday = (dateString) => {
//   return dateString === new Date().toISOString().split("T")[0];
// };

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
//   const [ground, setGround] = useState(null);
//   const [groundLoading, setGroundLoading] = useState(true);
//   const [locating, setLocating] = useState(false);
//   const [usingTestLocation, setUsingTestLocation] = useState(false);

//   const [paymentPreference, setPaymentPreference] = useState("advance_30");
//   const [policyAccepted, setPolicyAccepted] = useState(false);

//   const [bookedSlots, setBookedSlots] = useState([]);
//   const [availabilityLoading, setAvailabilityLoading] = useState(false);
//   const [liveStatus, setLiveStatus] = useState("offline");

//   const token = useMemo(() => {
//     return (
//       localStorage.getItem("token") ||
//       localStorage.getItem("accessToken") ||
//       ""
//     );
//   }, []);

//   const calculateEndTime = useCallback((start, hrs) => {
//     const [h, m] = start.split(":").map(Number);
//     const end = h + Number(hrs);
//     return `${String(end).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
//   }, []);

//   const formatSlotRange = () => {
//     if (!slot) return "-";
//     return `${slot} - ${calculateEndTime(slot, hours)}`;
//   };

//   const getSelectedPaymentLabel = () => {
//     return paymentPreference === "advance_30" ? "30% Advance" : "Full Payment";
//   };

//   const enableLocation = () => {
//     if (!navigator.geolocation) {
//       setMsg("Geolocation is not supported in this browser.");
//       setMsgType("error");
//       return;
//     }

//     setLocating(true);

//     navigator.geolocation.getCurrentPosition(
//       (pos) => {
//         setUserLocation([pos.coords.latitude, pos.coords.longitude]);
//         setUsingTestLocation(false);
//         setMsg("");
//         setMsgType("");
//         setLocating(false);
//       },
//       (err) => {
//         console.error("Location error:", err);

//         let message = "Unable to get your current location.";
//         if (err.code === 1) {
//           message = "Location permission denied.";
//         } else if (err.code === 2) {
//           message =
//             "Location unavailable. You can use the test location button for now.";
//         } else if (err.code === 3) {
//           message =
//             "Location request timed out. You can retry or use the test location button.";
//         }

//         setMsg(message);
//         setMsgType("error");
//         setLocating(false);
//       },
//       {
//         enableHighAccuracy: false,
//         timeout: 20000,
//         maximumAge: 60000,
//       }
//     );
//   };

//   const useTestLocation = () => {
//     setUserLocation([27.705, 85.33]);
//     setUsingTestLocation(true);
//     setMsg("Using test location for map preview.");
//     setMsgType("success");
//   };

//   useEffect(() => {
//     const loadGround = async () => {
//       try {
//         setGroundLoading(true);
//         const res = await fetch(`${API_BASE}/api/grounds/${cricsalId}`);
//         const data = await res.json();

//         if (!res.ok) {
//           setMsg(data?.message || "Failed to load court");
//           setMsgType("error");
//           return;
//         }

//         setGround(data?.data || data);
//       } catch (error) {
//         console.error(error);
//         setMsg("Failed to load court");
//         setMsgType("error");
//       } finally {
//         setGroundLoading(false);
//       }
//     };

//     if (cricsalId) {
//       loadGround();
//     }
//   }, [cricsalId]);

//   const groundLocation =
//     ground?.latitude != null && ground?.longitude != null
//       ? [ground.latitude, ground.longitude]
//       : [27.7172, 85.324];

//   useEffect(() => {
//     if (userLocation && groundLocation) {
//       const dist =
//         L.latLng(userLocation).distanceTo(L.latLng(groundLocation)) / 1000;
//       setDistance(dist.toFixed(2));
//     }
//   }, [userLocation, groundLocation]);

//   const saveLocalPaymentPreference = (bookingId, preference) => {
//     if (!bookingId || !preference) return;
//     localStorage.setItem(`booking_payment_pref_${bookingId}`, preference);
//   };

//   const loadBookedSlots = useCallback(async () => {
//     if (!cricsalId || !date) {
//       setBookedSlots([]);
//       return;
//     }

//     try {
//       setAvailabilityLoading(true);

//       const params = new URLSearchParams({
//         cricsal: cricsalId,
//         date,
//       });

//       const res = await fetch(
//         `${API_BASE}/api/bookings/booked-slots?${params.toString()}`
//       );
//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data?.message || "Failed to load booked slots");
//       }

//       setBookedSlots(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("BOOKED SLOTS ERROR:", error);
//       setBookedSlots([]);
//     } finally {
//       setAvailabilityLoading(false);
//     }
//   }, [cricsalId, date]);

//   useEffect(() => {
//     void loadBookedSlots();
//   }, [loadBookedSlots]);

//   useEffect(() => {
//     if (!cricsalId || !date) {
//       setLiveStatus("offline");
//       return;
//     }

//     const params = new URLSearchParams({
//       cricsal: cricsalId,
//       date,
//     });

//     const eventSource = new EventSource(
//       `${API_BASE}/api/bookings/booked-slots/stream?${params.toString()}`
//     );

//     setLiveStatus("connecting");

//     const handleSlots = (event) => {
//       try {
//         const nextSlots = JSON.parse(event.data);
//         setBookedSlots(Array.isArray(nextSlots) ? nextSlots : []);
//         setLiveStatus("live");
//       } catch (error) {
//         console.error("SSE PARSE ERROR:", error);
//       }
//     };

//     eventSource.addEventListener("connected", () => {
//       setLiveStatus("live");
//     });

//     eventSource.addEventListener("slots", handleSlots);

//     eventSource.onerror = () => {
//       setLiveStatus("reconnecting");
//     };

//     return () => {
//       eventSource.removeEventListener("slots", handleSlots);
//       eventSource.close();
//       setLiveStatus("offline");
//     };
//   }, [cricsalId, date]);

//   const getSlotStatus = useCallback(
//     (start) => {
//       if (!date || bookedSlots.length === 0) return null;

//       const selectedStart = toMinutes(start);
//       const selectedEnd = toMinutes(calculateEndTime(start, hours));

//       for (const booked of bookedSlots) {
//         const bookedStart = toMinutes(booked.startTime);
//         const bookedEnd = toMinutes(booked.endTime);

//         if (overlaps(selectedStart, selectedEnd, bookedStart, bookedEnd)) {
//           return booked.status;
//         }
//       }

//       return null;
//     },
//     [bookedSlots, calculateEndTime, date, hours]
//   );

//   const isPastSlot = useCallback(
//     (start) => {
//       if (!date || !isToday(date)) return false;
//       const now = new Date();
//       const currentMinutes = now.getHours() * 60 + now.getMinutes();
//       return toMinutes(start) <= currentMinutes;
//     },
//     [date]
//   );

//   useEffect(() => {
//     if (!slot) return;
//     const status = getSlotStatus(slot);

//     if (status === "pending" || status === "confirmed" || isPastSlot(slot)) {
//       setSlot("");
//     }
//   }, [slot, getSlotStatus, isPastSlot]);

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

//     if (isPastSlot(slot)) {
//       setMsg("Past time slots cannot be booked.");
//       setMsgType("error");
//       return;
//     }

//     const currentStatus = getSlotStatus(slot);
//     if (currentStatus === "pending") {
//       setMsg("This slot is pending approval.");
//       setMsgType("error");
//       return;
//     }

//     if (currentStatus === "confirmed") {
//       setMsg("This slot is already booked.");
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
//           paymentPreference,
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

//       const createdBookingId = data?._id || data?.booking?._id || null;
//       if (createdBookingId) {
//         saveLocalPaymentPreference(createdBookingId, paymentPreference);
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

//   const getLiveIndicatorClasses = () => {
//     if (liveStatus === "live") return "bg-green-100 text-green-700";
//     if (liveStatus === "connecting" || liveStatus === "reconnecting") {
//       return "bg-yellow-100 text-yellow-700";
//     }
//     return "bg-gray-100 text-gray-600";
//   };

//   const getLiveIndicatorLabel = () => {
//     if (liveStatus === "live") return "Live updates on";
//     if (liveStatus === "connecting") return "Connecting...";
//     if (liveStatus === "reconnecting") return "Reconnecting...";
//     return "Live updates off";
//   };

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
//               {ground?.name && (
//                 <p className="mt-1 text-sm font-medium text-green-700">
//                   {ground.name}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div
//             className={`rounded-full px-3 py-2 text-xs font-semibold ${getLiveIndicatorClasses()}`}
//           >
//             {getLiveIndicatorLabel()}
//           </div>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-3">
//           <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
//             <div className="mb-6">
//               <label className="mb-2 block text-sm font-semibold text-gray-700">
//                 Booking Date
//               </label>
//               <input
//                 type="date"
//                 min={new Date().toISOString().split("T")[0]}
//                 value={date}
//                 onChange={(e) => {
//                   setDate(e.target.value);
//                   setSlot("");
//                 }}
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
//               <div className="mb-3 flex items-center justify-between gap-3">
//                 <label className="block text-sm font-semibold text-gray-700">
//                   Select Time Slot
//                 </label>
//                 <span className="text-xs font-medium text-gray-500">
//                   {availabilityLoading
//                     ? "Checking availability..."
//                     : date
//                     ? "Yellow = pending, Red = booked"
//                     : "Pick a date to load availability"}
//                 </span>
//               </div>

//               <div className="mb-3 flex flex-wrap gap-3 text-xs font-semibold">
//                 <span className="rounded-full bg-white px-3 py-1 text-gray-600 ring-1 ring-gray-200">
//                   Available
//                 </span>
//                 <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700 ring-1 ring-yellow-200">
//                   Pending
//                 </span>
//                 <span className="rounded-full bg-red-100 px-3 py-1 text-red-700 ring-1 ring-red-200">
//                   Booked
//                 </span>
//                 <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 ring-1 ring-gray-200">
//                   Past time
//                 </span>
//               </div>

//               <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
//                 {TIME_SLOTS.map((start) => {
//                   const display = `${start} - ${calculateEndTime(start, hours)}`;
//                   const status = getSlotStatus(start);
//                   const past = isPastSlot(start);
//                   const isPending = status === "pending";
//                   const isConfirmed = status === "confirmed";
//                   const selected = slot === start;
//                   const disabled = !date || past || isPending || isConfirmed;

//                   return (
//                     <button
//                       key={start}
//                       type="button"
//                       onClick={() => {
//                         if (!disabled) setSlot(start);
//                       }}
//                       disabled={disabled}
//                       className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
//                         past
//                           ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
//                           : isConfirmed
//                           ? "cursor-not-allowed border-red-200 bg-red-500 text-white"
//                           : isPending
//                           ? "cursor-not-allowed border-yellow-200 bg-yellow-300 text-gray-900"
//                           : selected
//                           ? "border-green-700 bg-green-700 text-white shadow-sm"
//                           : "border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50"
//                       } ${!date ? "cursor-not-allowed opacity-60" : ""}`}
//                     >
//                       <div>{display}</div>
//                       {past && <div className="mt-1 text-xs font-semibold">Closed</div>}
//                       {isPending && (
//                         <div className="mt-1 text-xs font-semibold">Pending</div>
//                       )}
//                       {isConfirmed && (
//                         <div className="mt-1 text-xs font-semibold">Booked</div>
//                       )}
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
//                     Pay the complete amount after owner approval.
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
//                 disabled={loading || !date || !slot}
//                 className="flex-1 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
//               >
//                 {loading ? "Submitting..." : "Submit Booking Request"}
//               </button>
//             </div>
//           </div>

//           <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
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

//               {ground?.location && (
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm text-gray-500">Court</span>
//                   <span className="text-right text-sm font-semibold text-gray-800">
//                     {ground.location}
//                   </span>
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
//               <div className="mb-3 flex items-center justify-between">
//                 <h3 className="text-sm font-semibold text-gray-700">
//                   Ground Location
//                 </h3>

//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     onClick={enableLocation}
//                     disabled={locating}
//                     className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
//                   >
//                     {locating ? "Locating..." : "Enable Location"}
//                   </button>

//                   <button
//                     type="button"
//                     onClick={useTestLocation}
//                     className="rounded-lg bg-gray-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
//                   >
//                     Use Test Location
//                   </button>
//                 </div>
//               </div>

//               <div className="h-72 overflow-hidden rounded-2xl border border-gray-200">
//                 {!groundLoading && (
//                   <MapContainer
//                     center={groundLocation}
//                     zoom={13}
//                     style={{ height: "100%", width: "100%" }}
//                   >
//                     <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//                     <FitMapToMarkers
//                       userLocation={userLocation}
//                       groundLocation={groundLocation}
//                     />

//                     <Marker position={groundLocation} icon={groundIcon}>
//                       <Popup>CricSal Location</Popup>
//                     </Marker>

//                     {userLocation && (
//                       <>
//                         <Marker position={userLocation} icon={userIcon}>
//                           <Popup>
//                             {usingTestLocation ? "Test Location" : "My Location"}
//                           </Popup>
//                         </Marker>

//                         <Polyline
//                           positions={[userLocation, groundLocation]}
//                           pathOptions={{ color: "blue", weight: 4 }}
//                         />
//                       </>
//                     )}
//                   </MapContainer>
//                 )}
//               </div>
//             </div>

//             <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3">
//               <p className="text-sm text-green-800">
//                 {distance
//                   ? `You are approximately ${distance} km away from the ground.`
//                   : "Tap 'Enable Location' or use 'Use Test Location' to show the route to the ground."}
//               </p>
//             </div>

//             <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600">
//               <div className="flex items-center gap-2">
//                 <span className="inline-block h-3 w-3 rounded-full bg-green-600" />
//                 CricSal
//               </div>
//               <div className="flex items-center gap-2">
//                 <span className="inline-block h-3 w-3 rounded-full bg-blue-600" />
//                 My Location
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { showError, showSuccess } from "../../utils/toast";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const groundIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const TIME_SLOTS = [
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

function FitMapToMarkers({ userLocation, groundLocation }) {
  const map = useMap();

  useEffect(() => {
    if (userLocation && groundLocation) {
      map.fitBounds([userLocation, groundLocation], { padding: [42, 42] });
    } else if (groundLocation) {
      map.setView(groundLocation, 15);
    }
  }, [map, userLocation, groundLocation]);

  return null;
}

const toMinutes = (t) => {
  const [h, m] = String(t).split(":").map(Number);
  return h * 60 + m;
};

const overlaps = (aStart, aEnd, bStart, bEnd) => aStart < bEnd && aEnd > bStart;

const isToday = (dateString) => {
  return dateString === new Date().toISOString().split("T")[0];
};

export default function BookCricsal() {
  const { cricsalId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [hours, setHours] = useState(1);
  const [loading, setLoading] = useState(false);

  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [ground, setGround] = useState(null);
  const [groundLoading, setGroundLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [usingTestLocation, setUsingTestLocation] = useState(false);

  const [paymentPreference, setPaymentPreference] = useState("advance_30");
  const [policyAccepted, setPolicyAccepted] = useState(false);

  const [bookedSlots, setBookedSlots] = useState([]);
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [liveStatus, setLiveStatus] = useState("offline");

  const token = useMemo(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      ""
    );
  }, []);

  const calculateEndTime = useCallback((start, hrs) => {
    const [h, m] = start.split(":").map(Number);
    const end = h + Number(hrs);
    return `${String(end).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }, []);

  const formatSlotRange = () => {
    if (!slot) return "-";
    return `${slot} - ${calculateEndTime(slot, hours)}`;
  };

  const getSelectedPaymentLabel = () => {
    return paymentPreference === "advance_30" ? "30% Advance" : "Full Payment";
  };

  const getSelectedPaymentDescription = () => {
    return paymentPreference === "advance_30"
      ? "Pay 30% after owner approval"
      : "Pay complete amount after owner approval";
  };

  const handleDateChange = (value) => {
    setDate(value);
    setSlot("");
  };

  const handleDurationChange = (h) => {
    setHours(h);
    setSlot("");
  };

  const handlePaymentChange = (preference) => {
    setPaymentPreference(preference);
  };

  const enableLocation = () => {
    if (!navigator.geolocation) {
      showError("Geolocation is not supported in this browser");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setUsingTestLocation(false);
        setLocating(false);
        showSuccess("Location enabled successfully");
      },
      (err) => {
        console.error("Location error:", err);

        let message = "Unable to get your current location";
        if (err.code === 1) {
          message = "Location permission denied";
        } else if (err.code === 2) {
          message = "Location unavailable. You can use test location";
        } else if (err.code === 3) {
          message = "Location request timed out";
        }

        showError(message);
        setLocating(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 60000,
      }
    );
  };

  const useTestLocation = () => {
    setUserLocation([27.705, 85.33]);
    setUsingTestLocation(true);
    showSuccess("Using test location for map preview");
  };

  useEffect(() => {
    const loadGround = async () => {
      try {
        setGroundLoading(true);
        const res = await fetch(`${API_BASE}/api/grounds/${cricsalId}`);
        const data = await res.json();

        if (!res.ok) {
          showError(data?.message || "Failed to load court");
          return;
        }

        setGround(data?.data || data);
      } catch (error) {
        console.error(error);
        showError("Failed to load court");
      } finally {
        setGroundLoading(false);
      }
    };

    if (cricsalId) {
      loadGround();
    }
  }, [cricsalId]);

  const groundLocation =
    ground?.latitude != null && ground?.longitude != null
      ? [ground.latitude, ground.longitude]
      : [27.7172, 85.324];

  useEffect(() => {
    if (userLocation && groundLocation) {
      const dist =
        L.latLng(userLocation).distanceTo(L.latLng(groundLocation)) / 1000;
      setDistance(dist.toFixed(2));
    }
  }, [userLocation, groundLocation]);

  const saveLocalPaymentPreference = (bookingId, preference) => {
    if (!bookingId || !preference) return;
    localStorage.setItem(`booking_payment_pref_${bookingId}`, preference);
  };

  const loadBookedSlots = useCallback(async () => {
    if (!cricsalId || !date) {
      setBookedSlots([]);
      return;
    }

    try {
      setAvailabilityLoading(true);

      const params = new URLSearchParams({
        cricsal: cricsalId,
        date,
      });

      const res = await fetch(
        `${API_BASE}/api/bookings/booked-slots?${params.toString()}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load booked slots");
      }

      setBookedSlots(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("BOOKED SLOTS ERROR:", error);
      setBookedSlots([]);
      showError("Failed to load slot availability");
    } finally {
      setAvailabilityLoading(false);
    }
  }, [cricsalId, date]);

  useEffect(() => {
    void loadBookedSlots();
  }, [loadBookedSlots]);

  useEffect(() => {
    if (!cricsalId || !date) {
      setLiveStatus("offline");
      return;
    }

    const params = new URLSearchParams({
      cricsal: cricsalId,
      date,
    });

    const eventSource = new EventSource(
      `${API_BASE}/api/bookings/booked-slots/stream?${params.toString()}`
    );

    setLiveStatus("connecting");

    const handleSlots = (event) => {
      try {
        const nextSlots = JSON.parse(event.data);
        setBookedSlots(Array.isArray(nextSlots) ? nextSlots : []);
        setLiveStatus("live");
      } catch (error) {
        console.error("SSE PARSE ERROR:", error);
      }
    };

    eventSource.addEventListener("connected", () => {
      setLiveStatus("live");
    });

    eventSource.addEventListener("slots", handleSlots);

    eventSource.onerror = () => {
      setLiveStatus("reconnecting");
    };

    return () => {
      eventSource.removeEventListener("slots", handleSlots);
      eventSource.close();
      setLiveStatus("offline");
    };
  }, [cricsalId, date]);

  const getSlotStatus = useCallback(
    (start) => {
      if (!date || bookedSlots.length === 0) return null;

      const selectedStart = toMinutes(start);
      const selectedEnd = toMinutes(calculateEndTime(start, hours));

      for (const booked of bookedSlots) {
        const bookedStart = toMinutes(booked.startTime);
        const bookedEnd = toMinutes(booked.endTime);

        if (overlaps(selectedStart, selectedEnd, bookedStart, bookedEnd)) {
          return booked.status;
        }
      }

      return null;
    },
    [bookedSlots, calculateEndTime, date, hours]
  );

  const isPastSlot = useCallback(
    (start) => {
      if (!date || !isToday(date)) return false;
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      return toMinutes(start) <= currentMinutes;
    },
    [date]
  );

  useEffect(() => {
    if (!slot) return;

    const status = getSlotStatus(slot);

    if (status === "pending" || status === "confirmed" || isPastSlot(slot)) {
      setSlot("");
      showError("Selected slot is no longer available");
    }
  }, [slot, getSlotStatus, isPastSlot]);

  const handleConfirm = async (e) => {
    e.preventDefault();

    if (!token) {
      showError("Please login first");
      return;
    }

    if (!date) {
      showError("Booking date is required");
      return;
    }

    if (!slot) {
      showError("Time slot is required");
      return;
    }

    if (isPastSlot(slot)) {
      showError("Past time slots cannot be booked");
      return;
    }

    const currentStatus = getSlotStatus(slot);

    if (currentStatus === "pending") {
      showError("This slot is pending approval");
      return;
    }

    if (currentStatus === "confirmed") {
      showError("This slot is already booked");
      return;
    }

    if (!paymentPreference) {
      showError("Payment option is required");
      return;
    }

    if (!policyAccepted) {
      showError("Please accept the booking and cancellation policy");
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
          paymentPreference,
          advancePercent: paymentPreference === "advance_30" ? 30 : 100,
          nonRefundableHours: 2,
          requiresOwnerApproval: true,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data?.message || "Booking failed");
        return;
      }

      const createdBookingId = data?._id || data?.booking?._id || null;
      if (createdBookingId) {
        saveLocalPaymentPreference(createdBookingId, paymentPreference);
      }

      showSuccess("Booking request submitted. Waiting for owner approval");

      setTimeout(() => {
        navigate("/bookings");
      }, 1200);
    } catch (error) {
      console.error(error);
      showError("Server error. Please try again");
    } finally {
      setLoading(false);
    }
  };

  const getLiveIndicatorClasses = () => {
    if (liveStatus === "live") {
      return "border-green-200 bg-green-50 text-green-700";
    }

    if (liveStatus === "connecting" || liveStatus === "reconnecting") {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border-slate-200 bg-slate-50 text-slate-600";
  };

  const getLiveIndicatorLabel = () => {
    if (liveStatus === "live") return "Live updates on";
    if (liveStatus === "connecting") return "Connecting...";
    if (liveStatus === "reconnecting") return "Reconnecting...";
    return "Live updates off";
  };

  return (
    <div className="min-h-screen bg-slate-100 px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-5 sm:px-6 lg:px-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex w-fit items-center justify-center rounded-2xl border border-green-200 bg-white px-5 py-3 text-sm font-semibold text-green-700 shadow-sm transition hover:border-green-300 hover:bg-green-50"
                >
                  ← Back to Home
                </button>

                <div>
                  <p className="text-sm font-semibold text-green-700">
                    Booking request
                  </p>
                  <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                    Book Cricsal
                  </h1>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Select your preferred date, slot, and payment option before
                    submitting for owner approval.
                  </p>

                  {ground?.name && (
                    <p className="mt-2 text-sm font-semibold text-slate-900">
                      {ground.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div
                  className={`inline-flex w-fit items-center rounded-full border px-4 py-2 text-xs font-semibold ${getLiveIndicatorClasses()}`}
                >
                  <span className="mr-2 h-2 w-2 rounded-full bg-current" />
                  {getLiveIndicatorLabel()}
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                  <p className="text-xs text-slate-500">Booking flow</p>
                  <p className="text-sm font-semibold text-slate-900">
                    Request → Approval → Payment
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:p-7">
            <main className="space-y-6">
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <SectionHeader
                  title="Booking Details"
                  description="Choose the date and duration for your booking."
                />

                <div className="grid gap-5 lg:grid-cols-2">
                  <FormField label="Booking Date" required>
                    <input
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={date}
                      onChange={(e) => handleDateChange(e.target.value)}
                      className="field-input"
                    />
                  </FormField>

                  <FormField label="Select Duration" required>
                    <div className="grid grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
                      {[1, 2, 3].map((h) => (
                        <button
                          key={h}
                          type="button"
                          onClick={() => handleDurationChange(h)}
                          className={`rounded-lg px-3 py-3 text-sm font-semibold transition ${
                            hours === h
                              ? "bg-white text-green-700 shadow-sm ring-1 ring-slate-200"
                              : "text-slate-600 hover:bg-white"
                          }`}
                        >
                          {h} Hour{h > 1 ? "s" : ""}
                        </button>
                      ))}
                    </div>
                  </FormField>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <SectionHeader
                    title="Select Time Slot"
                    description="Available slots can be selected based on current booking status."
                    noMargin
                  />

                  <div className="w-fit rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
                    {availabilityLoading
                      ? "Checking availability..."
                      : date
                      ? "Availability loaded"
                      : "Select date first"}
                  </div>
                </div>

                <div className="mb-5 flex flex-wrap gap-2 text-xs font-semibold">
                  <StatusBadge label="Available" className="bg-white text-slate-600 ring-slate-200" />
                  <StatusBadge label="Pending" className="bg-amber-50 text-amber-700 ring-amber-200" />
                  <StatusBadge label="Booked" className="bg-red-50 text-red-700 ring-red-200" />
                  <StatusBadge label="Past time" className="bg-slate-100 text-slate-600 ring-slate-200" />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                  {TIME_SLOTS.map((start) => {
                    const display = `${start} - ${calculateEndTime(
                      start,
                      hours
                    )}`;
                    const status = getSlotStatus(start);
                    const past = isPastSlot(start);
                    const isPending = status === "pending";
                    const isConfirmed = status === "confirmed";
                    const selected = slot === start;
                    const disabled = !date || past || isPending || isConfirmed;

                    return (
                      <button
                        key={start}
                        type="button"
                        onClick={() => {
                          if (!disabled) setSlot(start);
                        }}
                        disabled={disabled}
                        className={`rounded-xl border px-4 py-3 text-left transition ${
                          past
                            ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                            : isConfirmed
                            ? "cursor-not-allowed border-red-200 bg-red-600 text-white"
                            : isPending
                            ? "cursor-not-allowed border-amber-200 bg-amber-100 text-amber-800"
                            : selected
                            ? "border-green-600 bg-green-600 text-white shadow-sm"
                            : "border-slate-200 bg-white text-slate-800 hover:border-green-300 hover:bg-green-50"
                        } ${!date ? "cursor-not-allowed opacity-60" : ""}`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-semibold">{display}</span>
                          {selected && (
                            <span className="rounded-full bg-white/15 px-2 py-1 text-[11px] font-semibold text-white">
                              Selected
                            </span>
                          )}
                        </div>

                        <div className="mt-1 text-xs font-medium opacity-80">
                          {past
                            ? "Closed"
                            : isPending
                            ? "Pending approval"
                            : isConfirmed
                            ? "Booked"
                            : date
                            ? "Available"
                            : "Date required"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
                <SectionHeader
                  title="Payment Option"
                  description="Choose how you want to pay after the owner approves your booking."
                />

                <div className="grid items-stretch gap-4 md:grid-cols-2">
                  <PaymentOptionCard
                    selected={paymentPreference === "advance_30"}
                    title="Pay 30% Advance"
                    amount="30%"
                    description="Pay only 30% after owner approval. This amount is non-refundable if cancelled within 2 hours before game time."
                    onClick={() => handlePaymentChange("advance_30")}
                  />

                  <PaymentOptionCard
                    selected={paymentPreference === "full"}
                    title="Pay Full Amount"
                    amount="100%"
                    description="Pay the complete amount after owner approval and keep the payment process straightforward."
                    onClick={() => handlePaymentChange("full")}
                  />
                </div>
              </section>

              <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm sm:p-6">
                <SectionHeader
                  title="Booking & Cancellation Policy"
                  description="Please review and accept the policy before submitting your booking request."
                  titleClassName="text-amber-950"
                  descriptionClassName="text-amber-800"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <PolicyPoint text="Booking is first submitted as a pending request." />
                  <PolicyPoint text="Owner must approve before payment." />
                  <PolicyPoint text="Payment is made only after approval." />
                  <PolicyPoint text="You may choose 30% advance or full payment." />
                </div>

                <div className="mt-3 rounded-xl border border-amber-200 bg-white px-4 py-3">
                  <p className="text-sm leading-6 text-amber-900">
                    30% advance is non-refundable if cancelled within 2 hours
                    before game time.
                  </p>
                </div>

                <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-white px-4 py-4 transition hover:bg-amber-50">
                  <input
                    type="checkbox"
                    checked={policyAccepted}
                    onChange={(e) => setPolicyAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm font-medium leading-6 text-slate-700">
                    I understand and accept the booking, approval, payment, and
                    cancellation policy. <span className="text-red-600">*</span>
                  </span>
                </label>
              </section>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading || !date || !slot}
                className="w-full rounded-xl bg-green-600 px-5 py-4 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Submitting Request..." : "Request Booking"}
              </button>
            </main>

            <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
              <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                  <p className="text-sm font-semibold text-green-700">
                    Summary
                  </p>
                  <h2 className="mt-1 text-xl font-bold text-slate-950">
                    Booking Overview
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Review your selected booking information.
                  </p>
                </div>

                <div className="space-y-4 p-5 sm:p-6">
                  <SummaryCard label="Date" value={date || "-"} />
                  <SummaryCard label="Slot" value={formatSlotRange()} />
                  <SummaryCard
                    label="Duration"
                    value={`${hours} hour${hours > 1 ? "s" : ""}`}
                  />
                  <SummaryCard
                    label="Payment Choice"
                    value={getSelectedPaymentLabel()}
                    helper={getSelectedPaymentDescription()}
                  />

                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="text-sm font-semibold text-amber-900">
                      Booking Flow
                    </p>
                    <p className="mt-1 text-sm leading-6 text-amber-800">
                      Pending request → Owner approval → Payment
                    </p>
                  </div>

                  {paymentPreference === "advance_30" && (
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                      <p className="text-sm font-semibold text-green-900">
                        Advance Payment Notice
                      </p>
                      <p className="mt-1 text-sm leading-6 text-green-800">
                        30% advance is non-refundable if cancelled within 2 hours
                        before game time.
                      </p>
                    </div>
                  )}

                  {ground?.location && (
                    <SummaryCard label="Court" value={ground.location} />
                  )}

                  {distance && (
                    <SummaryCard label="Distance" value={`${distance} km`} />
                  )}
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <SectionHeader
                  title="Ground Location"
                  description="Enable location to preview distance and route."
                />

                <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={enableLocation}
                    disabled={locating}
                    className="rounded-xl bg-blue-600 px-3 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:opacity-70"
                  >
                    {locating ? "Locating..." : "Enable Location"}
                  </button>

                  <button
                    type="button"
                    onClick={useTestLocation}
                    className="rounded-xl bg-slate-800 px-3 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-950"
                  >
                    Use Test Location
                  </button>
                </div>

                <div className="h-72 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  {!groundLoading ? (
                    <MapContainer
                      center={groundLocation}
                      zoom={13}
                      style={{ height: "100%", width: "100%" }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                      <FitMapToMarkers
                        userLocation={userLocation}
                        groundLocation={groundLocation}
                      />

                      <Marker position={groundLocation} icon={groundIcon}>
                        <Popup>CricSal Location</Popup>
                      </Marker>

                      {userLocation && (
                        <>
                          <Marker position={userLocation} icon={userIcon}>
                            <Popup>
                              {usingTestLocation ? "Test Location" : "My Location"}
                            </Popup>
                          </Marker>

                          <Polyline
                            positions={[userLocation, groundLocation]}
                            pathOptions={{
                              color: "#2563eb",
                              weight: 4,
                              opacity: 0.85,
                            }}
                          />
                        </>
                      )}
                    </MapContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-500">
                      Loading map...
                    </div>
                  )}
                </div>

                <div className="mt-4 rounded-xl border border-green-100 bg-green-50 px-4 py-3">
                  <p className="text-sm leading-6 text-green-800">
                    {distance
                      ? `You are approximately ${distance} km away from the ground.`
                      : "Enable location or use test location to preview the route."}
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-green-600" />
                    CricSal
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full bg-blue-600" />
                    My Location
                  </div>
                </div>
              </section>
            </aside>
          </div>
        </div>
      </div>

      <style>{`
        .field-input {
          width: 100%;
          min-height: 48px;
          border-radius: 0.75rem;
          border: 1px solid rgb(203 213 225);
          background: white;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgb(15 23 42);
          outline: none;
          transition: all 150ms ease;
        }

        .field-input:focus {
          border-color: rgb(34 197 94);
          box-shadow: 0 0 0 4px rgb(220 252 231);
        }
      `}</style>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  noMargin = false,
  titleClassName = "text-slate-950",
  descriptionClassName = "text-slate-500",
}) {
  return (
    <div className={noMargin ? "" : "mb-5"}>
      <h2 className={`text-lg font-bold ${titleClassName}`}>{title}</h2>
      {description && (
        <p className={`mt-1 text-sm leading-6 ${descriptionClassName}`}>
          {description}
        </p>
      )}
    </div>
  );
}

function FormField({ label, required = false, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
}

function StatusBadge({ label, className }) {
  return (
    <span className={`rounded-full px-3 py-1.5 ring-1 ${className}`}>
      {label}
    </span>
  );
}

function PaymentOptionCard({ selected, title, amount, description, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-full min-h-[172px] flex-col rounded-2xl border p-5 text-left transition ${
        selected
          ? "border-green-600 bg-green-50 shadow-sm ring-1 ring-green-600"
          : "border-slate-200 bg-white hover:border-green-300 hover:bg-slate-50"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-slate-950">{title}</h3>
          <p className="mt-1 text-sm font-medium text-slate-500">
            {amount} payment option
          </p>
        </div>

        <span
          className={`inline-flex h-7 min-w-[84px] items-center justify-center rounded-full px-3 text-xs font-semibold ${
            selected
              ? "bg-green-600 text-white"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {selected ? "Selected" : "Select"}
        </span>
      </div>

      <p className="flex-1 text-sm leading-6 text-slate-600">{description}</p>

      <div
        className={`mt-5 h-1.5 rounded-full ${
          selected ? "bg-green-600" : "bg-slate-200"
        }`}
      />
    </button>
  );
}

function SummaryCard({ label, value, helper }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="max-w-[60%] break-words text-right text-sm font-semibold text-slate-950">
          {value}
        </p>
      </div>

      {helper && (
        <p className="mt-2 text-right text-xs leading-5 text-slate-500">
          {helper}
        </p>
      )}
    </div>
  );
}

function PolicyPoint({ text }) {
  return (
    <div className="rounded-xl border border-amber-200 bg-white px-4 py-3">
      <p className="text-sm leading-6 text-amber-900">{text}</p>
    </div>
  );
}