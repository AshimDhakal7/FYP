// import React, { useMemo, useState, useEffect } from "react";
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
//               {ground?.name && (
//                 <p className="mt-1 text-sm font-medium text-green-700">
//                   {ground.name}
//                 </p>
//               )}
//             </div>
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
//                 disabled={loading}
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
      map.fitBounds([userLocation, groundLocation], { padding: [40, 40] });
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
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("");

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

  const enableLocation = () => {
    if (!navigator.geolocation) {
      setMsg("Geolocation is not supported in this browser.");
      setMsgType("error");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setUsingTestLocation(false);
        setMsg("");
        setMsgType("");
        setLocating(false);
      },
      (err) => {
        console.error("Location error:", err);

        let message = "Unable to get your current location.";
        if (err.code === 1) {
          message = "Location permission denied.";
        } else if (err.code === 2) {
          message =
            "Location unavailable. You can use the test location button for now.";
        } else if (err.code === 3) {
          message =
            "Location request timed out. You can retry or use the test location button.";
        }

        setMsg(message);
        setMsgType("error");
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
    setMsg("Using test location for map preview.");
    setMsgType("success");
  };

  useEffect(() => {
    const loadGround = async () => {
      try {
        setGroundLoading(true);
        const res = await fetch(`${API_BASE}/api/grounds/${cricsalId}`);
        const data = await res.json();

        if (!res.ok) {
          setMsg(data?.message || "Failed to load court");
          setMsgType("error");
          return;
        }

        setGround(data?.data || data);
      } catch (error) {
        console.error(error);
        setMsg("Failed to load court");
        setMsgType("error");
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
    }
  }, [slot, getSlotStatus, isPastSlot]);

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

    if (isPastSlot(slot)) {
      setMsg("Past time slots cannot be booked.");
      setMsgType("error");
      return;
    }

    const currentStatus = getSlotStatus(slot);
    if (currentStatus === "pending") {
      setMsg("This slot is pending approval.");
      setMsgType("error");
      return;
    }

    if (currentStatus === "confirmed") {
      setMsg("This slot is already booked.");
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
          paymentPreference,
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

  const getLiveIndicatorClasses = () => {
    if (liveStatus === "live") return "bg-green-100 text-green-700";
    if (liveStatus === "connecting" || liveStatus === "reconnecting") {
      return "bg-yellow-100 text-yellow-700";
    }
    return "bg-gray-100 text-gray-600";
  };

  const getLiveIndicatorLabel = () => {
    if (liveStatus === "live") return "Live updates on";
    if (liveStatus === "connecting") return "Connecting...";
    if (liveStatus === "reconnecting") return "Reconnecting...";
    return "Live updates off";
  };

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
              {ground?.name && (
                <p className="mt-1 text-sm font-medium text-green-700">
                  {ground.name}
                </p>
              )}
            </div>
          </div>

          <div
            className={`rounded-full px-3 py-2 text-xs font-semibold ${getLiveIndicatorClasses()}`}
          >
            {getLiveIndicatorLabel()}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6">
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Booking Date
              </label>
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSlot("");
                }}
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
              <div className="mb-3 flex items-center justify-between gap-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Select Time Slot
                </label>
                <span className="text-xs font-medium text-gray-500">
                  {availabilityLoading
                    ? "Checking availability..."
                    : date
                    ? "Yellow = pending, Red = booked"
                    : "Pick a date to load availability"}
                </span>
              </div>

              <div className="mb-3 flex flex-wrap gap-3 text-xs font-semibold">
                <span className="rounded-full bg-white px-3 py-1 text-gray-600 ring-1 ring-gray-200">
                  Available
                </span>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-yellow-700 ring-1 ring-yellow-200">
                  Pending
                </span>
                <span className="rounded-full bg-red-100 px-3 py-1 text-red-700 ring-1 ring-red-200">
                  Booked
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600 ring-1 ring-gray-200">
                  Past time
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {TIME_SLOTS.map((start) => {
                  const display = `${start} - ${calculateEndTime(start, hours)}`;
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
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition ${
                        past
                          ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                          : isConfirmed
                          ? "cursor-not-allowed border-red-200 bg-red-500 text-white"
                          : isPending
                          ? "cursor-not-allowed border-yellow-200 bg-yellow-300 text-gray-900"
                          : selected
                          ? "border-green-700 bg-green-700 text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50"
                      } ${!date ? "cursor-not-allowed opacity-60" : ""}`}
                    >
                      <div>{display}</div>
                      {past && <div className="mt-1 text-xs font-semibold">Closed</div>}
                      {isPending && (
                        <div className="mt-1 text-xs font-semibold">Pending</div>
                      )}
                      {isConfirmed && (
                        <div className="mt-1 text-xs font-semibold">Booked</div>
                      )}
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
                disabled={loading || !date || !slot}
                className="flex-1 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Submit Booking Request"}
              </button>
            </div>
          </div>

          <div className="space-y-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
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

              {ground?.location && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Court</span>
                  <span className="text-right text-sm font-semibold text-gray-800">
                    {ground.location}
                  </span>
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
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-700">
                  Ground Location
                </h3>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={enableLocation}
                    disabled={locating}
                    className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-70"
                  >
                    {locating ? "Locating..." : "Enable Location"}
                  </button>

                  <button
                    type="button"
                    onClick={useTestLocation}
                    className="rounded-lg bg-gray-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-gray-800"
                  >
                    Use Test Location
                  </button>
                </div>
              </div>

              <div className="h-72 overflow-hidden rounded-2xl border border-gray-200">
                {!groundLoading && (
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
                          pathOptions={{ color: "blue", weight: 4 }}
                        />
                      </>
                    )}
                  </MapContainer>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-3">
              <p className="text-sm text-green-800">
                {distance
                  ? `You are approximately ${distance} km away from the ground.`
                  : "Tap 'Enable Location' or use 'Use Test Location' to show the route to the ground."}
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-green-600" />
                CricSal
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-full bg-blue-600" />
                My Location
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}