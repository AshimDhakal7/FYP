// import React, { useEffect, useState } from "react";

// const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// export default function OwnerBookings() {
//   const [loading, setLoading] = useState(true);
//   const [bookings, setBookings] = useState([]);
//   const [error, setError] = useState("");

//   const getToken = () =>
//     localStorage.getItem("token") ||
//     localStorage.getItem("accessToken") ||
//     localStorage.getItem("authToken") ||
//     "";

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         setLoading(true);
//         setError("");

//         const res = await fetch(`${API_BASE}/api/bookings/owner`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${getToken()}`,
//           },
//         });

//         const data = await res.json();
//         if (!res.ok) throw new Error(data?.message || "Failed to load bookings");

//         setBookings(data.bookings || []);
//       } catch (e) {
//         setError(e.message || "Load failed");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, []);

//   return (
//     <div className="bg-white rounded-2xl shadow-sm border p-6">
//       <h2 className="text-2xl font-semibold">Bookings</h2>
//       <p className="text-gray-500 mt-1">View and manage bookings made by players.</p>

//       {loading && <div className="mt-6 text-gray-600">Loading bookings...</div>}

//       {!loading && error && (
//         <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-100">
//           {error}
//         </div>
//       )}

//       {!loading && !error && bookings.length === 0 && (
//         <div className="mt-6 p-6 rounded-xl border border-dashed text-gray-500">
//           No bookings yet.
//         </div>
//       )}

//       {!loading && !error && bookings.length > 0 && (
//         <div className="mt-6 space-y-3">
//           {bookings.map((b) => (
//             <div
//               key={b._id}
//               className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center md:justify-between gap-3"
//             >
//               <div>
//                 <div className="font-semibold">
//                   {b.cricsal?.name || "Cricsal"}
//                 </div>

//                 <div className="text-sm text-gray-600">
//                   {b.date} • {b.startTime} - {b.endTime} • {b.durationHours} hr
//                 </div>

//                 <div className="text-sm text-gray-600">
//                   Player: {b.user?.name || "N/A"} ({b.user?.email || "N/A"})
//                 </div>
//               </div>

//               <div className="flex items-center gap-3">
//                 <div className="text-sm font-semibold">
//                   NPR {b.totalPrice || 0}
//                 </div>

//                 <span
//                   className={`text-xs px-3 py-1 rounded-full border ${
//                     b.status === "confirmed"
//                       ? "bg-green-50 border-green-100 text-green-700"
//                       : "bg-gray-50 border-gray-200 text-gray-700"
//                   }`}
//                 >
//                   {b.status || "confirmed"}
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

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

  // ✅ NEW: refresh function
  const fetchBookings = async () => {
    try {
      setLoading(true);
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

  useEffect(() => {
    fetchBookings();
  }, []);

  // ✅ NEW: approve booking
  const handleApprove = async (id) => {
    if (!window.confirm("Approve this booking?")) return;

    try {
      await fetch(`${API_BASE}/api/bookings/${id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      fetchBookings(); // refresh
    } catch (err) {
      alert("Failed to approve");
    }
  };

  // ✅ NEW: decline booking
  const handleDecline = async (id) => {
    if (!window.confirm("Decline this booking?")) return;

    try {
      await fetch(`${API_BASE}/api/bookings/${id}/decline`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      fetchBookings(); // refresh
    } catch (err) {
      alert("Failed to decline");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6">
      <h2 className="text-2xl font-semibold">Bookings</h2>
      <p className="text-gray-500 mt-1">View and manage bookings made by players.</p>

      {loading && <div className="mt-6 text-gray-600">Loading bookings...</div>}

      {!loading && error && (
        <div className="mt-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-100">
          {error}
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="mt-6 p-6 rounded-xl border border-dashed text-gray-500">
          No bookings yet.
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="mt-6 space-y-3">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="p-4 rounded-xl border flex flex-col md:flex-row md:items-center md:justify-between gap-3"
            >
              <div>
                <div className="font-semibold">
                  {b.cricsal?.name || "Cricsal"}
                </div>

                <div className="text-sm text-gray-600">
                  {b.date} • {b.startTime} - {b.endTime} • {b.durationHours} hr
                </div>

                <div className="text-sm text-gray-600">
                  Player: {b.user?.name || "N/A"} ({b.user?.email || "N/A"})
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm font-semibold">
                  NPR {b.totalPrice || 0}
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full border ${
                    b.status === "confirmed"
                      ? "bg-green-50 border-green-100 text-green-700"
                      : b.status === "pending"
                      ? "bg-yellow-50 border-yellow-100 text-yellow-700"
                      : "bg-red-50 border-red-100 text-red-700"
                  }`}
                >
                  {b.status || "pending"}
                </span>

                {/* ✅ NEW: buttons */}
                {b.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(b._id)}
                      className="text-xs px-3 py-1 rounded-lg bg-green-600 text-white hover:bg-green-700"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleDecline(b._id)}
                      className="text-xs px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700"
                    >
                      Decline
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}