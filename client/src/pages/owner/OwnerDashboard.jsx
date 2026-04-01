
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
// } from "recharts";

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

// export default function OwnerDashboard() {
//   const navigate = useNavigate();

//   const [stats, setStats] = useState({
//     courts: 0,
//     todayBookings: 0,
//     upcoming: 0,
//     earnings: 0,
//   });

//   const [bookings, setBookings] = useState([]);

//   const getToken = () =>
//     localStorage.getItem("token") ||
//     localStorage.getItem("accessToken") ||
//     "";

//   useEffect(() => {
//     fetchStats();
//     fetchBookings();
//   }, []);

//   const fetchStats = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/api/dashboard/owner`, {
//         headers: { Authorization: `Bearer ${getToken()}` },
//       });
//       const data = await res.json();
//       if (res.ok) setStats(data);
//     } catch {}
//   };

//   const fetchBookings = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/api/bookings/owner`, {
//         headers: { Authorization: `Bearer ${getToken()}` },
//       });
//       const data = await res.json();
//       if (res.ok) setBookings(data.bookings || []);
//     } catch {}
//   };

//   const user = JSON.parse(localStorage.getItem("user") || "null");
//   const name = user?.email?.split("@")[0] || "Owner";

//   const handleDownload = () => {
//     const doc = new jsPDF();

//     const generatedAt = new Date().toLocaleString();
//     const ownerEmail = user?.email || "N/A";

//     doc.setFontSize(20);
//     doc.setTextColor(22, 163, 74);
//     doc.text("CricBook Owner Dashboard Report", 14, 20);

//     doc.setFontSize(10);
//     doc.setTextColor(100);
//     doc.text(`Generated: ${generatedAt}`, 14, 28);
//     doc.text(`Owner: ${name}`, 14, 34);
//     doc.text(`Email: ${ownerEmail}`, 14, 40);

//     doc.setFontSize(13);
//     doc.setTextColor(0);
//     doc.text("Dashboard Summary", 14, 52);

//     autoTable(doc, {
//       startY: 56,
//       theme: "grid",
//       head: [["Courts", "Today", "Upcoming", "Earnings"]],
//       body: [[
//         stats.courts ?? 0,
//         stats.todayBookings ?? 0,
//         stats.upcoming ?? 0,
//         `NPR ${stats.earnings ?? 0}`,
//       ]],
//       styles: {
//         fontSize: 10,
//         cellPadding: 4,
//         halign: "center",
//         valign: "middle",
//       },
//       headStyles: {
//         fillColor: [22, 163, 74],
//       },
//     });

//     const bookingsStartY = doc.lastAutoTable.finalY + 12;
//     doc.setFontSize(13);
//     doc.text("Recent Bookings", 14, bookingsStartY);

//     const bookingRows =
//       bookings.length > 0
//         ? bookings.slice(0, 10).map((b, i) => [
//             i + 1,
//             b.user?.name || "N/A",
//             b.ground?.name || b.groundName || "N/A",
//             b.date || "N/A",
//             `${b.startTime || "--"} - ${b.endTime || "--"}`,
//             `NPR ${b.totalPrice || 0}`,
//           ])
//         : [["-", "No bookings found", "-", "-", "-", "-"]];

//     autoTable(doc, {
//       startY: bookingsStartY + 4,
//       head: [["S.N.", "Customer", "Ground", "Date", "Time", "Amount"]],
//       body: bookingRows,
//       theme: "striped",
//       styles: {
//         fontSize: 10,
//         cellPadding: 3,
//         overflow: "linebreak",
//       },
//       headStyles: {
//         fillColor: [22, 163, 74],
//       },
//       columnStyles: {
//         0: { cellWidth: 12, halign: "center" },
//         1: { cellWidth: 38 },
//         2: { cellWidth: 38 },
//         3: { cellWidth: 28 },
//         4: { cellWidth: 36 },
//         5: { cellWidth: 28, halign: "right" },
//       },
//     });

//     doc.save(`owner-dashboard-report-${new Date().toISOString().slice(0, 10)}.pdf`);
//   };

//   const chartData = [
//     { day: "Mon", value: 2000 },
//     { day: "Tue", value: 3500 },
//     { day: "Wed", value: 1500 },
//     { day: "Thu", value: 4000 },
//     { day: "Fri", value: 3000 },
//     { day: "Sat", value: 5000 },
//     { day: "Sun", value: 2500 },
//   ];

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-semibold text-gray-900">
//             Welcome back, {name}
//           </h1>
//           <p className="text-gray-500 text-sm mt-1">
//             Manage courts, bookings and earnings
//           </p>
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={handleDownload}
//             className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-100"
//           >
//             Download
//           </button>

//           <button
//             onClick={() =>
//               navigate("/owner-dashboard/courts", { state: { openAdd: true } })
//             }
//             className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 shadow"
//           >
//             + Add Court
//           </button>
//         </div>
//       </div>

//       <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
//         <StatCard title="Courts" value={stats.courts} color="bg-blue-500" />
//         <StatCard title="Today" value={stats.todayBookings} color="bg-yellow-500" />
//         <StatCard title="Upcoming" value={stats.upcoming} color="bg-purple-500" />
//         <StatCard title="Earnings" value={`NPR ${stats.earnings}`} color="bg-green-500" />
//       </div>

//       <div className="grid lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2 space-y-6">
//           <div className="bg-white rounded-2xl p-5 shadow-sm border">
//             <h2 className="text-lg font-semibold mb-4">Earnings Overview</h2>

//             <ResponsiveContainer width="100%" height={250}>
//               <LineChart data={chartData}>
//                 <XAxis dataKey="day" />
//                 <YAxis />
//                 <Tooltip />
//                 <Line
//                   type="monotone"
//                   dataKey="value"
//                   stroke="#16a34a"
//                   strokeWidth={3}
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>

//           <div className="bg-white rounded-2xl p-5 shadow-sm border">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-lg font-semibold">Recent Bookings</h2>
//               <button
//                 onClick={() => navigate("/owner-dashboard/bookings")}
//                 className="text-sm text-gray-500 hover:text-black"
//               >
//                 View all →
//               </button>
//             </div>

//             {bookings.length === 0 ? (
//               <div className="text-center text-gray-500 py-10">
//                 No bookings yet
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {bookings.slice(0, 5).map((b) => (
//                   <div
//                     key={b._id}
//                     className="flex justify-between items-center p-3 rounded-lg border hover:bg-gray-50"
//                   >
//                     <div>
//                       <p className="font-medium">{b.user?.name}</p>
//                       <p className="text-sm text-gray-500">
//                         {b.date} • {b.startTime}
//                       </p>
//                     </div>

//                     <div className="text-sm font-semibold">
//                       NPR {b.totalPrice}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="space-y-6">
//           <div className="bg-white rounded-2xl p-5 shadow-sm border space-y-3">
//             <h2 className="text-lg font-semibold">Quick Actions</h2>

//             <button
//               onClick={() => navigate("/owner-dashboard/courts")}
//               className="w-full text-left p-3 rounded-lg border hover:bg-gray-50"
//             >
//               ➕ Add New Court
//             </button>

//             <button
//               onClick={() => navigate("/owner-dashboard/bookings")}
//               className="w-full text-left p-3 rounded-lg border hover:bg-gray-50"
//             >
//               📅 Manage Bookings
//             </button>

//             <button
//               onClick={() => navigate("/owner-dashboard/settings")}
//               className="w-full text-left p-3 rounded-lg border hover:bg-gray-50"
//             >
//               ⚙️ Settings
//             </button>
//           </div>

//           <div className="bg-white rounded-2xl p-5 shadow-sm border">
//             <h2 className="text-lg font-semibold">Insights</h2>
//             <p className="text-sm text-gray-500 mt-2">
//               Peak bookings usually happen in the evening. Consider increasing prices during peak hours.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({ title, value, color }) {
//   return (
//     <div className="rounded-2xl p-5 bg-white shadow-sm border hover:shadow-md transition">
//       <div className="text-xs text-gray-500">{title}</div>
//       <div className="text-2xl font-bold mt-2">{value}</div>

//       <div className="mt-3 h-1 bg-gray-100 rounded-full">
//         <div className={`h-full ${color} w-1/2 rounded-full`} />
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const getAuth = () => {
  try {
    return JSON.parse(localStorage.getItem("auth") || "null");
  } catch {
    return null;
  }
};

const clearAuth = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authToken");
  localStorage.removeItem("userToken");
  localStorage.removeItem("user");
  localStorage.removeItem("profile");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
};

export default function OwnerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [authState, setAuthState] = useState(() => getAuth());
  const [checkingAuth, setCheckingAuth] = useState(true);

  const user = authState?.user || null;
  const role = authState?.role || authState?.user?.role || "";
  const token = authState?.token || "";

  const displayName = useMemo(() => {
    if (user?.name?.trim()) return user.name.trim();
    if (user?.email) return user.email.split("@")[0];
    return "Owner";
  }, [user]);

  const initials = useMemo(() => {
    const source = user?.name?.trim() || user?.email?.split("@")[0] || "O";
    return source
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  useEffect(() => {
    const syncAuth = () => {
      const nextAuth = getAuth();
      setAuthState(nextAuth);

      const nextToken = nextAuth?.token || "";
      const nextRole = nextAuth?.role || nextAuth?.user?.role || "";

      if (!nextToken) {
        navigate("/login?role=owner", { replace: true });
        return;
      }

      if (nextRole !== "owner") {
        navigate("/", { replace: true });
        return;
      }

      setCheckingAuth(false);
    };

    syncAuth();

    const handleStorage = () => syncAuth();
    const handleAuthChanged = () => syncAuth();
    const handleUserUpdated = () => syncAuth();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("authChanged", handleAuthChanged);
    window.addEventListener("userUpdated", handleUserUpdated);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("authChanged", handleAuthChanged);
      window.removeEventListener("userUpdated", handleUserUpdated);
    };
  }, [navigate]);

  const onLogout = () => {
    clearAuth();
    window.dispatchEvent(new Event("authChanged"));
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/login?role=owner", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
      isActive
        ? "bg-gradient-to-r from-green-700 to-green-600 text-white shadow-md"
        : "text-slate-700 hover:bg-slate-50"
    }`;

  const links = [
    { to: "/owner-dashboard", label: "Dashboard", end: true },
    { to: "/owner-dashboard/courts", label: "Manage Courts" },
    { to: "/owner-dashboard/bookings", label: "Bookings" },
    { to: "/owner-dashboard/settings", label: "Settings" },
  ];

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[linear-gradient(to_bottom,_#f8fafc,_#f1f5f9)]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-white/70 bg-white/92 p-8 text-center text-slate-500 shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
            Loading owner panel...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,_#f8fafc,_#f1f5f9)]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[290px_1fr]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">
              <div className="border-b border-slate-100 bg-gradient-to-br from-green-50 via-white to-emerald-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-700 to-emerald-500 text-sm font-bold text-white shadow-sm">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-base font-bold text-slate-900">
                      {displayName}
                    </div>
                    <div className="text-sm text-slate-500">Owner Panel</div>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
                  Navigation
                </div>

                <div className="space-y-2">
                  {links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.end}
                      className={linkClass}
                    >
                      <span>{link.label}</span>
                      <span
                        className={`text-xs ${
                          location.pathname === link.to
                            ? "text-white/80"
                            : "text-slate-400 transition group-hover:text-slate-600"
                        }`}
                      >
                        →
                      </span>
                    </NavLink>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Signed in as
                  </div>
                  <div className="mt-2 break-all text-sm font-medium text-slate-700">
                    {user?.email || "owner@cricbook.com"}
                  </div>

                  <button
                    onClick={onLogout}
                    className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <main className="rounded-[28px] border border-white/70 bg-white/92 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.05)] backdrop-blur sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}