import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
const COMMISSION_RATE = 0.1;

export default function OwnerEarnings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("daily");

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    "";

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/bookings/owner`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setBookings(data.bookings || []);
      } else {
        setBookings([]);
      }
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const paidBookings = useMemo(() => {
    return bookings.filter((b) => {
      const status = String(b.status || "").toLowerCase();
      return status === "confirmed" || status === "completed" || status === "paid";
    });
  }, [bookings]);

  const getDateKey = (dateValue, type) => {
    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) return "Unknown";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    if (type === "daily") return `${year}-${month}-${day}`;

    if (type === "weekly") {
      const firstDay = new Date(year, 0, 1);
      const days = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000));
      const week = Math.ceil((days + firstDay.getDay() + 1) / 7);
      return `${year} Week ${week}`;
    }

    return `${year}-${month}`;
  };

  const chartData = useMemo(() => {
    const grouped = {};

    paidBookings.forEach((booking) => {
      const key = getDateKey(booking.date || booking.createdAt, filter);
      const total = Number(booking.totalPrice || 0);
      const commission = total * COMMISSION_RATE;
      const netProfit = total - commission;

      if (!grouped[key]) {
        grouped[key] = {
          period: key,
          totalEarning: 0,
          commission: 0,
          netProfit: 0,
        };
      }

      grouped[key].totalEarning += total;
      grouped[key].commission += commission;
      grouped[key].netProfit += netProfit;
    });

    return Object.values(grouped);
  }, [paidBookings, filter]);

  const totalEarning = chartData.reduce((sum, item) => sum + item.totalEarning, 0);
  const totalCommission = chartData.reduce((sum, item) => sum + item.commission, 0);
  const netProfit = chartData.reduce((sum, item) => sum + item.netProfit, 0);

  const formatMoney = (value) => `NPR ${Number(value || 0).toFixed(0)}`;

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Earning History
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Track daily, weekly, and monthly earnings with commission and net profit.
              </p>
            </div>

            <div className="flex gap-2 rounded-2xl bg-slate-100 p-1">
              {["daily", "weekly", "monthly"].map((item) => (
                <button
                  key={item}
                  onClick={() => setFilter(item)}
                  className={`rounded-xl px-4 py-2 text-sm font-bold capitalize transition ${
                    filter === item
                      ? "bg-green-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <SummaryCard
            title="Total Earning"
            value={formatMoney(totalEarning)}
            color="blue"
          />
          <SummaryCard
            title="Commission Given"
            value={formatMoney(totalCommission)}
            color="red"
          />
          <SummaryCard
            title="Net Profit"
            value={formatMoney(netProfit)}
            color="green"
          />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Earnings Comparison
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Compare total earning, admin commission, and net profit.
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
              No earning data found.
            </div>
          ) : (
            <div className="h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="period" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatMoney(value)} />
                  <Legend />
                  <Bar dataKey="totalEarning" name="Total Earning" fill="#3b82f6" />
                  <Bar dataKey="commission" name="Commission Given" fill="#ef4444" />
                  <Bar dataKey="netProfit" name="Net Profit" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            Earning Breakdown
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Period</th>
                  <th className="px-4 py-3">Total Earning</th>
                  <th className="px-4 py-3">Commission Given</th>
                  <th className="px-4 py-3">Net Profit</th>
                </tr>
              </thead>

              <tbody>
                {chartData.map((item) => (
                  <tr key={item.period} className="border-t">
                    <td className="px-4 py-3 font-semibold">{item.period}</td>
                    <td className="px-4 py-3">{formatMoney(item.totalEarning)}</td>
                    <td className="px-4 py-3 text-red-500">
                      {formatMoney(item.commission)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-600">
                      {formatMoney(item.netProfit)}
                    </td>
                  </tr>
                ))}

                {!loading && chartData.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-4 py-10 text-center text-slate-500">
                      No records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  const colors = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    red: "bg-red-50 border-red-200 text-red-700",
    green: "bg-green-50 border-green-200 text-green-700",
  };

  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${colors[color]}`}>
      <p className="text-sm font-semibold opacity-80">{title}</p>
      <h2 className="mt-2 text-3xl font-bold">{value}</h2>
    </div>
  );
}