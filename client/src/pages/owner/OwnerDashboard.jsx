
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





import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function OwnerDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    courts: 0,
    todayBookings: 0,
    upcoming: 0,
    earnings: 0,
  });

  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [replyLoadingId, setReplyLoadingId] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewLoading, setReviewLoading] = useState(true);

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    "";

  useEffect(() => {
    fetchStats();
    fetchBookings();
    fetchReviews();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/owner`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setStats(data);
    } catch (err) {
      console.error("FETCH STATS ERROR:", err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/owner`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setBookings(data.bookings || []);
    } catch (err) {
      console.error("FETCH BOOKINGS ERROR:", err);
    }
  };

  const fetchReviews = async () => {
    try {
      setReviewLoading(true);
      setReviewError("");

      const res = await fetch(`${API_BASE}/api/reviews/owner`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || `Failed to load reviews (${res.status})`);
      }

      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH REVIEWS ERROR:", err);
      setReviewError(err.message || "Failed to load reviews");
      setReviews([]);
    } finally {
      setReviewLoading(false);
    }
  };

  const handleReply = async (reviewId) => {
    const reply = (replyText[reviewId] || "").trim();

    if (!reply) {
      alert("Please write a reply first.");
      return;
    }

    try {
      setReplyLoadingId(reviewId);

      const res = await fetch(`${API_BASE}/api/reviews/${reviewId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ reply }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save reply");
      }

      setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
      fetchReviews();
    } catch (err) {
      console.error("REPLY ERROR:", err);
      alert(err.message || "Failed to save reply");
    } finally {
      setReplyLoadingId("");
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const name = user?.email?.split("@")[0] || "Owner";

  const handleDownload = () => {
    const doc = new jsPDF();

    const generatedAt = new Date().toLocaleString();
    const ownerEmail = user?.email || "N/A";

    doc.setFontSize(20);
    doc.setTextColor(22, 163, 74);
    doc.text("CricBook Owner Dashboard Report", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${generatedAt}`, 14, 28);
    doc.text(`Owner: ${name}`, 14, 34);
    doc.text(`Email: ${ownerEmail}`, 14, 40);

    doc.setFontSize(13);
    doc.setTextColor(0);
    doc.text("Dashboard Summary", 14, 52);

    autoTable(doc, {
      startY: 56,
      theme: "grid",
      head: [["Courts", "Today", "Upcoming", "Earnings"]],
      body: [[
        stats.courts ?? 0,
        stats.todayBookings ?? 0,
        stats.upcoming ?? 0,
        `NPR ${stats.earnings ?? 0}`,
      ]],
      styles: {
        fontSize: 10,
        cellPadding: 4,
        halign: "center",
        valign: "middle",
      },
      headStyles: {
        fillColor: [22, 163, 74],
      },
    });

    const bookingsStartY = doc.lastAutoTable.finalY + 12;
    doc.setFontSize(13);
    doc.text("Recent Bookings", 14, bookingsStartY);

    const bookingRows =
      bookings.length > 0
        ? bookings.slice(0, 10).map((b, i) => [
            i + 1,
            b.user?.name || "N/A",
            b.cricsal?.name || b.ground?.name || b.groundName || "N/A",
            b.date || "N/A",
            `${b.startTime || "--"} - ${b.endTime || "--"}`,
            `NPR ${b.totalPrice || 0}`,
          ])
        : [["-", "No bookings found", "-", "-", "-", "-"]];

    autoTable(doc, {
      startY: bookingsStartY + 4,
      head: [["S.N.", "Customer", "Ground", "Date", "Time", "Amount"]],
      body: bookingRows,
      theme: "striped",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [22, 163, 74],
      },
      columnStyles: {
        0: { cellWidth: 12, halign: "center" },
        1: { cellWidth: 38 },
        2: { cellWidth: 38 },
        3: { cellWidth: 28 },
        4: { cellWidth: 36 },
        5: { cellWidth: 28, halign: "right" },
      },
    });

    doc.save(`owner-dashboard-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const chartData = [
    { day: "Mon", value: 2000 },
    { day: "Tue", value: 3500 },
    { day: "Wed", value: 1500 },
    { day: "Thu", value: 4000 },
    { day: "Fri", value: 3000 },
    { day: "Sat", value: 5000 },
    { day: "Sun", value: 2500 },
  ];

  const renderStars = (rating = 0) => {
    const rounded = Math.round(Number(rating) || 0);
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={star <= rounded ? "text-yellow-500" : "text-gray-300"}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen space-y-6 bg-gray-50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Welcome back, {name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage courts, bookings, earnings, and customer feedback
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-gray-100"
          >
            Download
          </button>

          <button
            onClick={() =>
              navigate("/owner-dashboard/courts", { state: { openAdd: true } })
            }
            className="rounded-lg bg-green-600 px-4 py-2 text-sm text-white shadow hover:bg-green-700"
          >
            + Add Court
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Courts" value={stats.courts} color="bg-blue-500" />
        <StatCard title="Today" value={stats.todayBookings} color="bg-yellow-500" />
        <StatCard title="Upcoming" value={stats.upcoming} color="bg-purple-500" />
        <StatCard title="Earnings" value={`NPR ${stats.earnings}`} color="bg-green-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Earnings Overview</h2>

            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#16a34a"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* REVIEWS ABOVE BOOKINGS */}
          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Reviews</h2>
              <button
                onClick={fetchReviews}
                className="text-sm text-gray-500 hover:text-black"
              >
                Refresh
              </button>
            </div>

            {reviewError && (
              <div className="mb-4 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {reviewError}
              </div>
            )}

            {reviewLoading ? (
              <div className="py-10 text-center text-gray-500">
                Loading reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-10 text-center text-gray-500">
                No reviews found for your grounds yet.
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.slice(0, 5).map((r) => (
                  <div key={r._id} className="rounded-2xl border bg-gray-50 p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {r.user?.name || "Anonymous User"}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {r.cricsal?.name || "Ground"}
                        </p>
                        <div className="mt-2 flex items-center gap-1 text-lg">
                          {renderStars(r.rating)}
                        </div>
                      </div>

                      <p className="text-xs text-gray-400">
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString()
                          : ""}
                      </p>
                    </div>

                    <p className="mt-3 text-sm leading-6 text-gray-700">
                      {r.comment || "No comment provided."}
                    </p>

                    {r.ownerReply ? (
                      <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        <strong>Your reply:</strong> {r.ownerReply}
                      </div>
                    ) : (
                      <div className="mt-4">
                        <textarea
                          value={replyText[r._id] || ""}
                          onChange={(e) =>
                            setReplyText((prev) => ({
                              ...prev,
                              [r._id]: e.target.value,
                            }))
                          }
                          placeholder="Write a reply..."
                          rows={3}
                          className="w-full rounded-xl border border-gray-200 p-3 text-sm outline-none focus:border-green-500"
                        />

                        <button
                          onClick={() => handleReply(r._id)}
                          disabled={replyLoadingId === r._id}
                          className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {replyLoadingId === r._id ? "Saving..." : "Reply"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Bookings</h2>
              <button
                onClick={() => navigate("/owner-dashboard/bookings")}
                className="text-sm text-gray-500 hover:text-black"
              >
                View all →
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="py-10 text-center text-gray-500">
                No bookings yet
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((b) => (
                  <div
                    key={b._id}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium">{b.user?.name}</p>
                      <p className="text-sm text-gray-500">
                        {b.date} • {b.startTime}
                      </p>
                    </div>

                    <div className="text-sm font-semibold">
                      NPR {b.totalPrice}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3 rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Quick Actions</h2>

            <button
              onClick={() => navigate("/owner-dashboard/courts")}
              className="w-full rounded-lg border p-3 text-left hover:bg-gray-50"
            >
              ➕ Add New Court
            </button>

            <button
              onClick={() => navigate("/owner-dashboard/bookings")}
              className="w-full rounded-lg border p-3 text-left hover:bg-gray-50"
            >
              📅 Manage Bookings
            </button>

            <button
              onClick={() => navigate("/owner-dashboard/settings")}
              className="w-full rounded-lg border p-3 text-left hover:bg-gray-50"
            >
              ⚙️ Settings
            </button>
          </div>

          <div className="rounded-2xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Insights</h2>
            <p className="mt-2 text-sm text-gray-500">
              Peak bookings usually happen in the evening. Consider increasing prices during peak hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>

      <div className="mt-3 h-1 rounded-full bg-gray-100">
        <div className={`h-full w-1/2 rounded-full ${color}`} />
      </div>
    </div>
  );
}