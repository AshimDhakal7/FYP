
// import React, { useMemo, useState, useEffect } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";

// const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// // Fix Leaflet icons
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
//       ""
//     );
//   }, []);

//   // 🔥 Calculate End Time
//   const calculateEndTime = (start, hrs) => {
//     const [h, m] = start.split(":").map(Number);
//     const end = h + Number(hrs);
//     return `${String(end).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
//   };

//   // 🔥 Format Slot Display
//   const formatSlot = (slot) => {
//     const start = slot.split(" - ")[0];
//     const end = calculateEndTime(start, hours);
//     return `${start} - ${end}`;
//   };

//   // 📍 Location
//   useEffect(() => {
//     navigator.geolocation?.getCurrentPosition((pos) => {
//       setUserLocation([pos.coords.latitude, pos.coords.longitude]);
//     });
//   }, []);

//   const groundLocation = [27.7172, 85.3240];

//   useEffect(() => {
//     if (userLocation) {
//       const dist =
//         L.latLng(userLocation).distanceTo(L.latLng(groundLocation)) / 1000;
//       setDistance(dist.toFixed(2));
//     }
//   }, [userLocation]);

//   // Booking + Payment
//   const handleConfirm = async (e, payNow = false) => {
//     e.preventDefault();
//     setMsg("");

//     if (!date || !slot) {
//       setMsg("Select date & slot");
//       return;
//     }

//     try {
//       const start = slot.split(" - ")[0];
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
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setMsg(data.message || "Booking failed");
//         return;
//       }

//       if (payNow) {
//         const pay = await fetch(`${API_BASE}/api/payment/khalti/initiate`, {
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

//         const p = await pay.json();
//         if (p.url) window.location.href = p.url;
//         else setMsg("Payment failed");
//         return;
//       }

//       navigate("/bookings");
//     } catch {
//       setMsg("Server error");
//     }
//   };

//   const timeSlots = [
//     "06:00","07:00","08:00","09:00","10:00","11:00",
//     "12:00","13:00","14:00","15:00","16:00","17:00",
//     "18:00","19:00"
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-5xl mx-auto">

//         {/* 🔙 BACK BUTTON */}
//         <button
//           onClick={() => navigate(-1)}
//           className="mb-4 px-4 py-2 bg-gray-200 rounded"
//         >
//           ← Back
//         </button>

//         <div className="grid lg:grid-cols-3 gap-6">

//           {/* LEFT */}
//           <div className="lg:col-span-2 bg-white p-6 rounded shadow">

//             <input
//               type="date"
//               value={date}
//               onChange={(e) => setDate(e.target.value)}
//               className="w-full border p-3 rounded mb-4"
//             />

//             <div className="grid grid-cols-2 gap-2 mb-4">
//               {timeSlots.map((start) => {
//                 const display = `${start} - ${calculateEndTime(start, hours)}`;
//                 return (
//                   <button
//                     key={start}
//                     onClick={() => setSlot(`${start}`)}
//                     className={`p-2 border rounded ${
//                       slot === start ? "bg-green-600 text-white" : ""
//                     }`}
//                   >
//                     {display}
//                   </button>
//                 );
//               })}
//             </div>

//             <div className="flex gap-2 mb-4">
//               {[1, 2, 3].map((h) => (
//                 <button
//                   key={h}
//                   onClick={() => setHours(h)}
//                   className={`px-4 py-2 rounded ${
//                     hours === h ? "bg-green-700 text-white" : "bg-gray-200"
//                   }`}
//                 >
//                   {h}h
//                 </button>
//               ))}
//             </div>

//             {msg && <div className="text-red-500 mb-2">{msg}</div>}

//             <div className="flex gap-3">
//               <button
//                 onClick={handleConfirm}
//                 className="flex-1 bg-gray-800 text-white py-3 rounded"
//               >
//                 Confirm Booking
//               </button>

//               <button
//                 onClick={(e) => handleConfirm(e, true)}
//                 className="flex-1 bg-green-700 text-white py-3 rounded"
//               >
//                 Confirm & Pay
//               </button>
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="bg-white p-6 rounded shadow space-y-4">

//             <p><b>Date:</b> {date || "-"}</p>
//             <p>
//               <b>Slot:</b>{" "}
//               {slot
//                 ? `${slot} - ${calculateEndTime(slot, hours)}`
//                 : "-"}
//             </p>
//             <p><b>Duration:</b> {hours}h</p>

//             <div className="h-64 rounded overflow-hidden">
//               <MapContainer center={groundLocation} zoom={13} style={{ height: "100%" }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//                 <Marker position={groundLocation}>
//                   <Popup>Ground</Popup>
//                 </Marker>

//                 {userLocation && (
//                   <>
//                     <Marker position={userLocation}>
//                       <Popup>You</Popup>
//                     </Marker>
//                     <Polyline positions={[userLocation, groundLocation]} />
//                   </>
//                 )}
//               </MapContainer>
//             </div>

//             {distance && <p>Distance: {distance} km</p>}
//           </div>

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

  const calculateEndTime = (start, hrs) => {
    const [h, m] = start.split(":").map(Number);
    const end = h + Number(hrs);
    return `${String(end).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
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

  const handleConfirm = async (e, payNow = false) => {
    e.preventDefault();
    setMsg("");

    if (!date || !slot) {
      setMsg("Please select a date and time slot.");
      return;
    }

    try {
      setLoading(true);

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
        if (p.url) {
          window.location.href = p.url;
        } else {
          setMsg("Payment failed");
        }
        return;
      }

      navigate("/bookings");
    } catch {
      setMsg("Server error");
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
    "18:00", "19:00"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-100 px-4 py-6 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
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
                Select your preferred date, slot, and duration
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Section */}
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

            {msg && (
              <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {msg}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Processing..." : "Confirm Booking"}
              </button>

              <button
                onClick={(e) => handleConfirm(e, true)}
                disabled={loading}
                className="flex-1 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Processing..." : "Confirm & Pay"}
              </button>
            </div>
          </div>

          {/* Right Section */}
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
                <span className="text-sm font-semibold text-gray-800 text-right">
                  {slot ? `${slot} - ${calculateEndTime(slot, hours)}` : "-"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Duration</span>
                <span className="text-sm font-semibold text-gray-800">
                  {hours}h
                </span>
              </div>

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