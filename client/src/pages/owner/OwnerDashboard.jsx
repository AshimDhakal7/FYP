import React, { useEffect, useMemo, useState } from "react";
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
const COMMISSION_RATE = 0.1;

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

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const name = user?.name || user?.username || user?.email?.split("@")[0] || "Owner";
  // 🔥 Commission Logic
  const grossRevenue = useMemo(
    () => bookings.reduce((sum, b) => sum + Number(b.totalPrice || 0), 0),
    [bookings]
  );

  const adminCommission = grossRevenue * COMMISSION_RATE;
  const myEarning = grossRevenue * 0.9;

  // ✅ ORIGINAL CHART (UNCHANGED STYLE)
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
    <div className="min-h-screen space-y-6 bg-gray-50 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900">
            Welcome back, {name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage courts, bookings and earnings
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Courts" value={stats.courts} color="bg-blue-500" />
        <StatCard title="Today" value={stats.todayBookings} color="bg-yellow-500" />
        <StatCard title="Upcoming" value={stats.upcoming} color="bg-purple-500" />
        <StatCard title="Gross Revenue" value={`NPR ${grossRevenue}`} color="bg-gray-500" />
        <StatCard title="My Earnings" value={`NPR ${myEarning}`} color="bg-green-500" />
      </div>

      {/* Earnings Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <Card title="Total Booking Amount" value={`NPR ${grossRevenue}`} />
        <Card title="Admin Commission (10%)" value={`NPR ${adminCommission}`} red />
        <Card title="My Earnings (90%)" value={`NPR ${myEarning}`} green />
      </div>

      {/* Chart */}
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

      {/* Recent Bookings */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Recent Bookings</h2>

        {bookings.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            No bookings yet
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((b) => {
              const amount = Number(b.totalPrice || 0);

              return (
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

                  <div className="text-right text-sm">
                    <p className="font-semibold">NPR {amount}</p>
                    <p className="text-xs text-red-500">
                      Commission: NPR {(amount * 0.1).toFixed(0)}
                    </p>
                    <p className="text-xs text-green-600">
                      My earning: NPR {(amount * 0.9).toFixed(0)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="rounded-2xl p-5 bg-white shadow-sm border">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      <div className="mt-3 h-1 bg-gray-100 rounded-full">
        <div className={`h-full ${color} w-1/2 rounded-full`} />
      </div>
    </div>
  );
}

function Card({ title, value, red, green }) {
  return (
    <div className="bg-white border rounded-2xl p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <h2
        className={`text-2xl font-bold mt-2 ${
          red ? "text-red-500" : green ? "text-green-600" : ""
        }`}
      >
        {value}
      </h2>
    </div>
  );
}