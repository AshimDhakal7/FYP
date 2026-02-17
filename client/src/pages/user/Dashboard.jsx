// import React, { useEffect, useState } from "react";
// // import "../styles/dashboard.css";
// // import { getCurrentUser } from "../utils/auth";
// // import api from "../utils/api";

// export default function Dashboard() {
//   const user = getCurrentUser();
//   const [bookings, setBookings] = useState([]);

//   useEffect(() => {
//     loadBookings();
//   }, []);

//   const loadBookings = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await api.get("/api/bookings", {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       setBookings(res.data);
//     } catch (e) {
//       console.log("failed to load bookings");
//     }
//   };

//   return (
//     <div className="dashboard-page">
//       <h1>Hello {user?.name?.split(" ")[0]} 👋</h1>
//       <p>Here are your upcoming bookings:</p>

//       <div className="booking-list">
//         {bookings.length === 0 && (
//           <p>No bookings yet.</p>
//         )}

//         {bookings.map((b) => (
//           <div key={b._id} className="booking-item">
//             <h3>{b.groundName}</h3>
//             <p>Date: {b.date}</p>
//             <p>Time: {b.time}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function Dashboard() {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const firstName = useMemo(() => {
    const raw = user?.name || user?.email || "Player";
    return String(raw).split(" ")[0].split("@")[0];
  }, [user]);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadBookings = async () => {
    setMsg("");
    setLoading(true);

    try {
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken") ||
        "";

      const res = await fetch(`${API_BASE}/api/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => []);

      if (!res.ok) {
        setMsg(data?.message || "Failed to load bookings.");
        setBookings([]);
        return;
      }

      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      setMsg("Server error. Check backend is running.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
                Dashboard
              </div>
              <h1 className="mt-3 text-2xl font-bold text-gray-900">
                Hello {firstName} 👋
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Here are your upcoming bookings.
              </p>
            </div>

            <button
              type="button"
              onClick={loadBookings}
              className="mt-2 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Status */}
        {msg && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {msg}
          </div>
        )}

        {/* List */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-gray-900">Bookings</div>
            <div className="text-xs text-gray-600">
              {loading ? "Loading..." : `${bookings.length} total`}
            </div>
          </div>

          {loading ? (
            <div className="mt-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-xl bg-gray-100"
                />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-gray-200 p-6 text-sm text-gray-600">
              No bookings yet.
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bookings.map((b) => {
                const id = b._id || b.id || `${b.date}-${b.slot}-${Math.random()}`;
                const groundName = b.groundName || b.cricsalName || b.name || "Cricsal";
                const date = b.date || "—";
                const time = b.time || b.slot || "—";

                return (
                  <div
                    key={id}
                    className="rounded-2xl bg-gray-50 p-5 ring-1 ring-black/5"
                  >
                    <div className="text-base font-semibold text-gray-900">
                      {groundName}
                    </div>

                    <div className="mt-3 space-y-1 text-sm text-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Date</span>
                        <span className="font-semibold">{date}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Time</span>
                        <span className="font-semibold">{time}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        className="flex-1 rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 transition"
                      >
                        Details
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
                      >
                        Support
                      </button>
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
