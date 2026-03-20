
// // // import React, { useMemo, useState } from "react";
// // // import { Link, useNavigate, useParams } from "react-router-dom";

// // // const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// // // export default function BookCricsal() {
// // //   const { cricsalId } = useParams();
// // //   const navigate = useNavigate();

// // //   const [date, setDate] = useState("");
// // //   const [slot, setSlot] = useState("");
// // //   const [hours, setHours] = useState(1);
// // //   const [loading, setLoading] = useState(false);
// // //   const [msg, setMsg] = useState("");

// // //   const token = useMemo(() => {
// // //     return (
// // //       localStorage.getItem("token") ||
// // //       localStorage.getItem("accessToken") ||
// // //       localStorage.getItem("authToken") ||
// // //       localStorage.getItem("userToken") ||
// // //       ""
// // //     );
// // //   }, []);

// // //   const timeSlots = [
// // //     "06:00 - 07:00",
// // //     "07:00 - 08:00",
// // //     "08:00 - 09:00",
// // //     "09:00 - 10:00",
// // //     "10:00 - 11:00",
// // //     "11:00 - 12:00",
// // //     "12:00 - 13:00",
// // //     "13:00 - 14:00",
// // //     "14:00 - 15:00",
// // //     "15:00 - 16:00",
// // //     "16:00 - 17:00",
// // //     "17:00 - 18:00",
// // //     "18:00 - 19:00",
// // //     "19:00 - 20:00",
// // //   ];

// // //   const handleConfirm = async (e) => {
// // //     e.preventDefault();
// // //     setMsg("");

// // //     if (!date || !slot) {
// // //       setMsg("Please select date and time slot.");
// // //       return;
// // //     }

// // //     setLoading(true);
// // //     try {
// // //       const startTime = String(slot).includes(" - ")
// // //         ? String(slot).split(" - ")[0]
// // //         : String(slot);

// // //       const res = await fetch(`${API_BASE}/api/bookings`, {
// // //         method: "POST",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //         body: JSON.stringify({
// // //           // REQUIRED for current Booking schema/controller
// // //           ground: cricsalId, // <-- fixes: "Path `ground` is required"

        
// // //           cricsalId,
// // //           date,
// // //           slot,
// // //           hours: Number(hours),

// // //           // ✅ Extra fields (safe): helps backend compute endTime etc.
// // //           startTime,
// // //           durationHours: Number(hours),
// // //         }),
// // //       });

// // //       const data = await res.json().catch(() => ({}));

// // //       if (!res.ok) {
// // //         setMsg(data?.message || "Booking failed. (Backend route missing?)");
// // //         return;
// // //       }

// // //       navigate("/bookings");
// // //     } catch (err) {
// // //       setMsg("Server error. Check backend is running.");
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const niceDate = date
// // //     ? new Date(date + "T00:00:00").toLocaleDateString(undefined, {
// // //         weekday: "short",
// // //         month: "short",
// // //         day: "numeric",
// // //         year: "numeric",
// // //       })
// // //     : "Not selected";

// // //   return (
// // //     <div className="min-h-screen bg-gray-50 px-4 py-10">
// // //       <div className="mx-auto w-full max-w-5xl">
// // //         {/* Top header */}
// // //         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// // //           <div>
// // //             <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
// // //               Booking
// // //               <span className="h-1 w-1 rounded-full bg-green-600" />
// // //               Cricsal ID: <span className="font-bold">{cricsalId}</span>
// // //             </div>
// // //             <h1 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl">
// // //               Confirm your slot
// // //             </h1>
// // //             <p className="mt-1 text-sm text-gray-600">
// // //               Pick a date, choose a time slot, and confirm your booking.
// // //             </p>
// // //           </div>

// // //           <div className="flex flex-wrap gap-2">
// // //             <Link
// // //               to="/find-cricsal"
// // //               className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
// // //             >
// // //               ← Back
// // //             </Link>
// // //             <Link
// // //               to="/home"
// // //               className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
// // //             >
// // //               Home
// // //             </Link>
// // //           </div>
// // //         </div>

// // //         <div className="mt-6 grid gap-6 lg:grid-cols-3">
// // //           {/* Left: Form */}
// // //           <div className="lg:col-span-2">
// // //             <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
// // //               <form onSubmit={handleConfirm} className="space-y-5">
// // //                 {/* Date */}
// // //                 <div>
// // //                   <label className="block text-sm font-semibold text-gray-800">
// // //                     Date
// // //                   </label>
// // //                   <input
// // //                     type="date"
// // //                     value={date}
// // //                     onChange={(e) => setDate(e.target.value)}
// // //                     className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
// // //                   />
// // //                 </div>

// // //                 {/* Slot grid */}
// // //                 <div>
// // //                   <div className="flex items-center justify-between">
// // //                     <label className="block text-sm font-semibold text-gray-800">
// // //                       Time Slot
// // //                     </label>
// // //                     <span className="text-xs text-gray-500">Tap to select</span>
// // //                   </div>

// // //                   <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
// // //                     {timeSlots.map((s) => {
// // //                       const active = slot === s;
// // //                       return (
// // //                         <button
// // //                           key={s}
// // //                           type="button"
// // //                           onClick={() => setSlot(s)}
// // //                           className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
// // //                             active
// // //                               ? "border-green-600 bg-green-600 text-white shadow-sm"
// // //                               : "border-gray-200 bg-white text-gray-900 hover:bg-gray-50"
// // //                           }`}
// // //                         >
// // //                           {s}
// // //                         </button>
// // //                       );
// // //                     })}
// // //                   </div>

// // //                   {/* Hidden select kept for accessibility (same state/logic) */}
// // //                   <select
// // //                     value={slot}
// // //                     onChange={(e) => setSlot(e.target.value)}
// // //                     className="sr-only"
// // //                   >
// // //                     <option value="">Select slot</option>
// // //                     {timeSlots.map((s) => (
// // //                       <option key={s} value={s}>
// // //                         {s}
// // //                       </option>
// // //                     ))}
// // //                   </select>
// // //                 </div>

// // //                 {/* Duration */}
// // //                 <div>
// // //                   <label className="block text-sm font-semibold text-gray-800">
// // //                     Duration (hours)
// // //                   </label>
// // //                   <div className="mt-2 inline-flex rounded-full border border-gray-200 bg-gray-50 p-1">
// // //                     {[1, 2, 3].map((h) => (
// // //                       <button
// // //                         key={h}
// // //                         type="button"
// // //                         onClick={() => setHours(h)}
// // //                         className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
// // //                           Number(hours) === h
// // //                             ? "bg-green-700 text-white shadow-sm"
// // //                             : "text-gray-700 hover:text-gray-900"
// // //                         }`}
// // //                       >
// // //                         {h}h
// // //                       </button>
// // //                     ))}
// // //                   </div>
// // //                 </div>

// // //                 {/* Message */}
// // //                 {msg && (
// // //                   <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
// // //                     {msg}
// // //                   </div>
// // //                 )}

// // //                 {/* Submit */}
// // //                 <button
// // //                   type="submit"
// // //                   disabled={loading}
// // //                   className="w-full rounded-2xl bg-green-700 px-4 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-green-800 active:scale-[0.99] transition disabled:cursor-not-allowed disabled:opacity-60"
// // //                 >
// // //                   {loading ? "Confirming..." : "Confirm Booking"}
// // //                 </button>

// // //                 {/* Tiny hint */}
// // //                 <div className="rounded-2xl bg-gray-50 px-4 py-3 text-xs text-gray-600 ring-1 ring-black/5">
// // //                   Tip: If you don’t get navigated, check your route path is
// // //                   correct:{" "}
// // //                   <span className="font-semibold">/book/:cricsalId</span>
// // //                 </div>
// // //               </form>
// // //             </div>
// // //           </div>

// // //           {/* Right: Summary */}
// // //           <div className="space-y-6">
// // //             <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
// // //               <h2 className="text-base font-bold text-gray-900">
// // //                 Booking summary
// // //               </h2>

// // //               <div className="mt-4 space-y-3 text-sm">
// // //                 <div className="flex items-center justify-between">
// // //                   <span className="text-gray-600">Cricsal</span>
// // //                   <span className="font-semibold text-gray-900">{cricsalId}</span>
// // //                 </div>

// // //                 <div className="flex items-center justify-between">
// // //                   <span className="text-gray-600">Date</span>
// // //                   <span className="font-semibold text-gray-900">{niceDate}</span>
// // //                 </div>

// // //                 <div className="flex items-center justify-between">
// // //                   <span className="text-gray-600">Time slot</span>
// // //                   <span className="font-semibold text-gray-900">
// // //                     {slot || "Not selected"}
// // //                   </span>
// // //                 </div>

// // //                 <div className="flex items-center justify-between">
// // //                   <span className="text-gray-600">Duration</span>
// // //                   <span className="font-semibold text-gray-900">
// // //                     {hours} hour{Number(hours) > 1 ? "s" : ""}
// // //                   </span>
// // //                 </div>
// // //               </div>

// // //               {!token && (
// // //                 <div className="mt-4 rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-xs text-yellow-800">
// // //                   You’re not logged in (token missing). Booking may fail. Please
// // //                   login first.
// // //                 </div>
// // //               )}
// // //             </div>

// // //             <div className="rounded-3xl bg-gradient-to-br from-green-900 via-green-800 to-green-700 p-6 text-white shadow-sm">
// // //               <h3 className="text-base font-bold">Pro tips</h3>
// // //               <ul className="mt-3 space-y-2 text-sm text-green-100">
// // //                 <li>✓ Weekends fill fast — book early</li>
// // //                 <li>✓ Pick longer durations for uninterrupted practice</li>
// // //                 <li>✓ If payment is later, confirm details carefully</li>
// // //               </ul>
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <div className="mt-8 text-center text-xs text-gray-500">
// // //           © 2026 CricBook •{" "}
// // //           <Link className="font-semibold text-gray-700 hover:underline" to="/">
// // //             Terms
// // //           </Link>{" "}
// // //           •{" "}
// // //           <Link className="font-semibold text-gray-700 hover:underline" to="/">
// // //             Privacy
// // //           </Link>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import React, { useMemo, useState } from "react";
// // import { Link, useNavigate, useParams } from "react-router-dom";

// // const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// // export default function BookCricsal() {
// //   const { cricsalId } = useParams();
// //   const navigate = useNavigate();

// //   const [date, setDate] = useState("");
// //   const [slot, setSlot] = useState("");
// //   const [hours, setHours] = useState(1);
// //   const [loading, setLoading] = useState(false);
// //   const [msg, setMsg] = useState("");

// //   const token = useMemo(() => {
// //     return (
// //       localStorage.getItem("token") ||
// //       localStorage.getItem("accessToken") ||
// //       localStorage.getItem("authToken") ||
// //       localStorage.getItem("userToken") ||
// //       ""
// //     );
// //   }, []);

// //   const timeSlots = [
// //     "06:00 - 07:00",
// //     "07:00 - 08:00",
// //     "08:00 - 09:00",
// //     "09:00 - 10:00",
// //     "10:00 - 11:00",
// //     "11:00 - 12:00",
// //     "12:00 - 13:00",
// //     "13:00 - 14:00",
// //     "14:00 - 15:00",
// //     "15:00 - 16:00",
// //     "16:00 - 17:00",
// //     "17:00 - 18:00",
// //     "18:00 - 19:00",
// //     "19:00 - 20:00",
// //   ];

// //   // ================= MAIN FUNCTION =================
// //   const handleConfirm = async (e, payNow = false) => {
// //     e.preventDefault();
// //     setMsg("");

// //     if (!date || !slot) {
// //       setMsg("Please select date and time slot.");
// //       return;
// //     }

// //     if (!token) {
// //       setMsg("Please login first.");
// //       return;
// //     }

// //     setLoading(true);

// //     try {
// //       const startTime = slot.includes(" - ")
// //         ? slot.split(" - ")[0]
// //         : slot;

// //       // 🔹 CREATE BOOKING
// //       const res = await fetch(`${API_BASE}/api/bookings`, {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //         body: JSON.stringify({
// //           ground: cricsalId,
// //           cricsalId,
// //           date,
// //           slot,
// //           hours: Number(hours),
// //           startTime,
// //           durationHours: Number(hours),
// //         }),
// //       });

// //       const data = await res.json().catch(() => ({}));

// //       if (!res.ok) {
// //         setMsg(data?.message || "Booking failed.");
// //         return;
// //       }

// //       // 🔥 PAY NOW FLOW
// //       if (payNow) {
// //         if (!data?._id || !data?.totalPrice) {
// //           setMsg("Payment data missing from backend.");
// //           return;
// //         }

// //         const payRes = await fetch(`${API_BASE}/api/payment/khalti/initiate`, {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${token}`,
// //           },
// //           body: JSON.stringify({
// //             amount: data.totalPrice,
// //             bookingId: data._id,
// //           }),
// //         });

// //         const payData = await payRes.json().catch(() => ({}));

// //         if (!payRes.ok || !payData?.url) {
// //           setMsg("Payment initiation failed.");
// //           return;
// //         }

// //         // 🚀 Redirect to Khalti
// //         window.location.href = payData.url;
// //         return;
// //       }

// //       // 🔹 NORMAL FLOW
// //       navigate("/bookings?success=true");

// //     } catch (err) {
// //       console.error(err);
// //       setMsg("Server error. Check backend.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const niceDate = date
// //     ? new Date(date + "T00:00:00").toLocaleDateString(undefined, {
// //         weekday: "short",
// //         month: "short",
// //         day: "numeric",
// //         year: "numeric",
// //       })
// //     : "Not selected";

// //   return (
// //     <div className="min-h-screen bg-gray-50 px-4 py-10">
// //       <div className="mx-auto w-full max-w-5xl">

// //         {/* HEADER */}
// //         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
// //           <div>
// //             <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
// //               Booking • Cricsal ID: <span className="font-bold">{cricsalId}</span>
// //             </div>
// //             <h1 className="mt-3 text-2xl font-extrabold text-gray-900">
// //               Confirm your slot
// //             </h1>
// //           </div>
// //         </div>

// //         <div className="mt-6 grid gap-6 lg:grid-cols-3">

// //           {/* FORM */}
// //           <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">

// //             <form onSubmit={handleConfirm} className="space-y-5">

// //               {/* DATE */}
// //               <input
// //                 type="date"
// //                 value={date}
// //                 onChange={(e) => setDate(e.target.value)}
// //                 className="w-full border p-3 rounded"
// //               />

// //               {/* SLOT */}
// //               <div className="grid grid-cols-2 gap-2">
// //                 {timeSlots.map((s) => (
// //                   <button
// //                     key={s}
// //                     type="button"
// //                     onClick={() => setSlot(s)}
// //                     className={`p-2 border rounded ${
// //                       slot === s ? "bg-green-600 text-white" : ""
// //                     }`}
// //                   >
// //                     {s}
// //                   </button>
// //                 ))}
// //               </div>

// //               {/* HOURS */}
// //               <div className="flex gap-2">
// //                 {[1, 2, 3].map((h) => (
// //                   <button
// //                     key={h}
// //                     type="button"
// //                     onClick={() => setHours(h)}
// //                     className={`px-4 py-2 rounded ${
// //                       hours === h ? "bg-green-700 text-white" : "bg-gray-200"
// //                     }`}
// //                   >
// //                     {h}h
// //                   </button>
// //                 ))}
// //               </div>

// //               {/* ERROR */}
// //               {msg && <div className="text-red-500">{msg}</div>}

// //               {/* 🔥 BUTTONS */}
// //               <div className="flex gap-3">

// //                 {/* NORMAL */}
// //                 <button
// //                   type="submit"
// //                   disabled={loading}
// //                   className="flex-1 bg-gray-800 text-white py-3 rounded"
// //                 >
// //                   {loading ? "Confirming..." : "Confirm Booking"}
// //                 </button>

// //                 {/* PAY */}
// //                 <button
// //                   type="button"
// //                   disabled={loading}
// //                   onClick={(e) => handleConfirm(e, true)}
// //                   className="flex-1 bg-green-700 text-white py-3 rounded"
// //                 >
// //                   Confirm & Pay
// //                 </button>

// //               </div>

// //             </form>
// //           </div>

// //           {/* SUMMARY */}
// //           <div className="bg-white p-6 rounded-2xl shadow">
// //             <p><b>Date:</b> {niceDate}</p>
// //             <p><b>Slot:</b> {slot || "-"}</p>
// //             <p><b>Duration:</b> {hours}h</p>
// //           </div>

// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// import React, { useMemo, useState, useEffect } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// // Fix Leaflet marker icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
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

//   const [userLocation, setUserLocation] = useState(null);
//   const [distance, setDistance] = useState(null);

//   const token = useMemo(() => {
//     return (
//       localStorage.getItem("token") ||
//       localStorage.getItem("accessToken") ||
//       localStorage.getItem("authToken") ||
//       localStorage.getItem("userToken") ||
//       ""
//     );
//   }, []);

//   // 🔥 TIME CALCULATION
//   const calculateEndTime = (slot, hours) => {
//     if (!slot) return "";

//     const start = slot.split(" - ")[0];
//     const [h, m] = start.split(":").map(Number);
//     const endHour = h + Number(hours);

//     return `${String(endHour).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
//   };

//   // 🌍 USER LOCATION
//   useEffect(() => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (pos) => {
//           setUserLocation([
//             pos.coords.latitude,
//             pos.coords.longitude,
//           ]);
//         },
//         () => console.log("Location denied")
//       );
//     }
//   }, []);

//   // 📍 Ground location (replace later with DB)
//   const groundLocation = [27.7172, 85.3240];

//   // 📏 Distance
//   useEffect(() => {
//     if (userLocation) {
//       const from = L.latLng(userLocation);
//       const to = L.latLng(groundLocation);
//       const dist = from.distanceTo(to) / 1000;
//       setDistance(dist.toFixed(2));
//     }
//   }, [userLocation]);

//   // 🚀 MAIN FUNCTION
//   const handleConfirm = async (e, payNow = false) => {
//     e.preventDefault();
//     setMsg("");

//     if (!date || !slot) {
//       setMsg("Please select date and time slot.");
//       return;
//     }

//     if (!token) {
//       setMsg("Please login first.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const startTime = slot.split(" - ")[0];
//       const endTime = calculateEndTime(slot, hours);

//       const res = await fetch(`${API_BASE}/api/bookings`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           ground: cricsalId,
//           cricsalId,
//           date,
//           slot,
//           hours: Number(hours),
//           startTime,
//           endTime,
//           durationHours: Number(hours),
//         }),
//       });

//       const data = await res.json().catch(() => ({}));

//       if (!res.ok) {
//         setMsg(data?.message || "Booking failed.");
//         return;
//       }

//       // 💳 PAY NOW
//       if (payNow) {
//         const payRes = await fetch(`${API_BASE}/api/payment/khalti/initiate`, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             amount: data.totalPrice,
//             bookingId: data._id,
//           }),
//         });

//         const payData = await payRes.json().catch(() => ({}));

//         if (!payData?.url) {
//           setMsg("Payment failed.");
//           return;
//         }

//         window.location.href = payData.url;
//         return;
//       }

//       navigate("/bookings?success=true");

//     } catch (err) {
//       console.error(err);
//       setMsg("Server error.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const niceDate = date
//     ? new Date(date + "T00:00:00").toLocaleDateString()
//     : "Not selected";

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-6">

//         {/* LEFT */}
//         <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">

//           <input
//             type="date"
//             value={date}
//             onChange={(e) => setDate(e.target.value)}
//             className="w-full border p-3 rounded mb-4"
//           />

//           <div className="grid grid-cols-2 gap-2 mb-4">
//             {[
//               "06:00 - 07:00","07:00 - 08:00","08:00 - 09:00",
//               "09:00 - 10:00","10:00 - 11:00","11:00 - 12:00",
//               "12:00 - 13:00","13:00 - 14:00","14:00 - 15:00",
//               "15:00 - 16:00","16:00 - 17:00","17:00 - 18:00",
//               "18:00 - 19:00","19:00 - 20:00",
//             ].map((s) => (
//               <button
//                 key={s}
//                 onClick={() => setSlot(s)}
//                 className={`p-2 border rounded ${
//                   slot === s ? "bg-green-600 text-white" : ""
//                 }`}
//               >
//                 {s}
//               </button>
//             ))}
//           </div>

//           <div className="flex gap-2 mb-4">
//             {[1, 2, 3].map((h) => (
//               <button
//                 key={h}
//                 onClick={() => setHours(h)}
//                 className={`px-4 py-2 rounded ${
//                   hours === h ? "bg-green-700 text-white" : "bg-gray-200"
//                 }`}
//               >
//                 {h}h
//               </button>
//             ))}
//           </div>

//           {msg && <div className="text-red-500 mb-2">{msg}</div>}

//           <div className="flex gap-3">
//             <button
//               onClick={handleConfirm}
//               className="flex-1 bg-gray-800 text-white py-3 rounded"
//             >
//               Confirm Booking
//             </button>

//             <button
//               onClick={(e) => handleConfirm(e, true)}
//               className="flex-1 bg-green-700 text-white py-3 rounded"
//             >
//               Confirm & Pay
//             </button>
//           </div>
//         </div>

//         {/* RIGHT */}
//         <div className="bg-white p-6 rounded-xl shadow space-y-4">

//           <div>
//             <p><b>Date:</b> {niceDate}</p>
//             <p>
//               <b>Slot:</b>{" "}
//               {slot
//                 ? `${slot.split(" - ")[0]} - ${calculateEndTime(slot, hours)}`
//                 : "-"}
//             </p>
//             <p><b>Duration:</b> {hours}h</p>
//           </div>

//           {/* 🗺️ MAP */}
//           <div className="h-64 rounded overflow-hidden">
//             <MapContainer
//               center={groundLocation}
//               zoom={13}
//               style={{ height: "100%", width: "100%" }}
//             >
//               <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//               <Marker position={groundLocation}>
//                 <Popup>Ground</Popup>
//               </Marker>

//               {userLocation && (
//                 <>
//                   <Marker position={userLocation}>
//                     <Popup>You</Popup>
//                   </Marker>

//                   <Polyline
//                     positions={[userLocation, groundLocation]}
//                     color="green"
//                   />
//                 </>
//               )}
//             </MapContainer>
//           </div>

//           {distance && (
//             <p className="text-sm text-gray-600">
//               Distance: <b>{distance} km</b>
//             </p>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
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

  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  const token = useMemo(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      ""
    );
  }, []);

  // 🔥 Calculate End Time
  const calculateEndTime = (start, hrs) => {
    const [h, m] = start.split(":").map(Number);
    const end = h + Number(hrs);
    return `${String(end).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  };

  // 🔥 Format Slot Display
  const formatSlot = (slot) => {
    const start = slot.split(" - ")[0];
    const end = calculateEndTime(start, hours);
    return `${start} - ${end}`;
  };

  // 📍 Location
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((pos) => {
      setUserLocation([pos.coords.latitude, pos.coords.longitude]);
    });
  }, []);

  const groundLocation = [27.7172, 85.3240];

  useEffect(() => {
    if (userLocation) {
      const dist =
        L.latLng(userLocation).distanceTo(L.latLng(groundLocation)) / 1000;
      setDistance(dist.toFixed(2));
    }
  }, [userLocation]);

  // 🚀 Booking + Payment
  const handleConfirm = async (e, payNow = false) => {
    e.preventDefault();
    setMsg("");

    if (!date || !slot) {
      setMsg("Select date & slot");
      return;
    }

    try {
      const start = slot.split(" - ")[0];
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
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.message || "Booking failed");
        return;
      }

      if (payNow) {
        const pay = await fetch(`${API_BASE}/api/payment/khalti/initiate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: data.totalPrice,
            bookingId: data._id,
          }),
        });

        const p = await pay.json();
        if (p.url) window.location.href = p.url;
        else setMsg("Payment failed");
        return;
      }

      navigate("/bookings");
    } catch {
      setMsg("Server error");
    }
  };

  const timeSlots = [
    "06:00","07:00","08:00","09:00","10:00","11:00",
    "12:00","13:00","14:00","15:00","16:00","17:00",
    "18:00","19:00"
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">

        {/* 🔙 BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 px-4 py-2 bg-gray-200 rounded"
        >
          ← Back
        </button>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 bg-white p-6 rounded shadow">

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border p-3 rounded mb-4"
            />

            <div className="grid grid-cols-2 gap-2 mb-4">
              {timeSlots.map((start) => {
                const display = `${start} - ${calculateEndTime(start, hours)}`;
                return (
                  <button
                    key={start}
                    onClick={() => setSlot(`${start}`)}
                    className={`p-2 border rounded ${
                      slot === start ? "bg-green-600 text-white" : ""
                    }`}
                  >
                    {display}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2 mb-4">
              {[1, 2, 3].map((h) => (
                <button
                  key={h}
                  onClick={() => setHours(h)}
                  className={`px-4 py-2 rounded ${
                    hours === h ? "bg-green-700 text-white" : "bg-gray-200"
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>

            {msg && <div className="text-red-500 mb-2">{msg}</div>}

            <div className="flex gap-3">
              <button
                onClick={handleConfirm}
                className="flex-1 bg-gray-800 text-white py-3 rounded"
              >
                Confirm Booking
              </button>

              <button
                onClick={(e) => handleConfirm(e, true)}
                className="flex-1 bg-green-700 text-white py-3 rounded"
              >
                Confirm & Pay
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white p-6 rounded shadow space-y-4">

            <p><b>Date:</b> {date || "-"}</p>
            <p>
              <b>Slot:</b>{" "}
              {slot
                ? `${slot} - ${calculateEndTime(slot, hours)}`
                : "-"}
            </p>
            <p><b>Duration:</b> {hours}h</p>

            <div className="h-64 rounded overflow-hidden">
              <MapContainer center={groundLocation} zoom={13} style={{ height: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                <Marker position={groundLocation}>
                  <Popup>Ground</Popup>
                </Marker>

                {userLocation && (
                  <>
                    <Marker position={userLocation}>
                      <Popup>You</Popup>
                    </Marker>
                    <Polyline positions={[userLocation, groundLocation]} />
                  </>
                )}
              </MapContainer>
            </div>

            {distance && <p>Distance: {distance} km</p>}
          </div>

        </div>
      </div>
    </div>
  );
}