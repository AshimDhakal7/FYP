import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
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

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    "";

  useEffect(() => {
    fetchStats();
    fetchBookings();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/dashboard/owner`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok) setStats(data);
    } catch {}
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/owner`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const data = await res.json();
      if (res.ok) setBookings(data.bookings || []);
    } catch {}
  };

  // PDF report
  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text("CricBook Booking Report", 14, 20);

    let y = 30;

    bookings.forEach((b, i) => {
      doc.text(
        `${i + 1}. ${b.user?.name} | ${b.date} | ${b.startTime}-${b.endTime} | NPR ${b.totalPrice}`,
        14,
        y
      );
      y += 8;
    });

    doc.save("report.pdf");
  };

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const name = user?.email?.split("@")[0] || "Owner";

  // fake chart data (can replace with backend later)
  const chartData = [
    { day: "Mon", value: 2000 },
    { day: "Tue", value: 3500 },
    { day: "Wed", value: 1500 },
    { day: "Thu", value: 4000 },
    { day: "Fri", value: 3000 },
    { day: "Sat", value: 5000 },
    { day: "Sun", value: 2500 },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Welcome back, {name}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage courts, bookings and earnings
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="px-4 py-2 text-sm rounded-lg border bg-white hover:bg-gray-100"
          >
            Download
          </button>

          <button
            onClick={() =>
              navigate("/owner-dashboard/courts", { state: { openAdd: true } })
            }
            className="px-4 py-2 text-sm rounded-lg bg-green-600 text-white hover:bg-green-700 shadow"
          >
            + Add Court
          </button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Courts" value={stats.courts} color="bg-blue-500" />
        <StatCard title="Today" value={stats.todayBookings} color="bg-yellow-500" />
        <StatCard title="Upcoming" value={stats.upcoming} color="bg-purple-500" />
        <StatCard title="Earnings" value={`NPR ${stats.earnings}`} color="bg-green-500" />
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">

          {/* CHART */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <h2 className="text-lg font-semibold mb-4">Earnings Overview</h2>

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

          {/* BOOKINGS */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Recent Bookings</h2>
              <button
                onClick={() => navigate("/owner-dashboard/bookings")}
                className="text-sm text-gray-500 hover:text-black"
              >
                View all →
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center text-gray-500 py-10">
                No bookings yet
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((b) => (
                  <div
                    key={b._id}
                    className="flex justify-between items-center p-3 rounded-lg border hover:bg-gray-50"
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

        {/* RIGHT SIDE */}
        <div className="space-y-6">

          {/* QUICK ACTIONS */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border space-y-3">
            <h2 className="text-lg font-semibold">Quick Actions</h2>

            <button
              onClick={() => navigate("/owner-dashboard/courts")}
              className="w-full text-left p-3 rounded-lg border hover:bg-gray-50"
            >
              ➕ Add New Court
            </button>

            <button
              onClick={() => navigate("/owner-dashboard/bookings")}
              className="w-full text-left p-3 rounded-lg border hover:bg-gray-50"
            >
              📅 Manage Bookings
            </button>

            <button
              onClick={() => navigate("/owner-dashboard/settings")}
              className="w-full text-left p-3 rounded-lg border hover:bg-gray-50"
            >
              ⚙️ Settings
            </button>
          </div>

          {/* INFO BOX */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border">
            <h2 className="text-lg font-semibold">Insights</h2>
            <p className="text-sm text-gray-500 mt-2">
              Peak bookings usually happen in the evening. Consider increasing prices during peak hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* CARD */
function StatCard({ title, value, color }) {
  return (
    <div className="rounded-2xl p-5 bg-white shadow-sm border hover:shadow-md transition">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>

      <div className="mt-3 h-1 bg-gray-100 rounded-full">
        <div className={`h-full ${color} w-1/2 rounded-full`} />
      </div>
    </div>
  );
}