import React, { useEffect, useMemo, useRef, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const chartRef = useRef(null);

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
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await res.json().catch(() => ({}));
      setBookings(res.ok ? data.bookings || [] : []);
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

  const filteredBookings = useMemo(() => {
    return paidBookings.filter((booking) => {
      const bookingDate = new Date(booking.date || booking.createdAt);
      if (Number.isNaN(bookingDate.getTime())) return false;

      if (startDate) {
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        if (bookingDate < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (bookingDate > end) return false;
      }

      return true;
    });
  }, [paidBookings, startDate, endDate]);

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

  const buildData = (type) => {
    const grouped = {};

    filteredBookings.forEach((booking) => {
      const key = getDateKey(booking.date || booking.createdAt, type);
      const total = Number(booking.totalPrice || 0);
      const commission = total * COMMISSION_RATE;
      const netProfit = total - commission;

      if (!grouped[key]) {
        grouped[key] = {
          period: key,
          bookings: 0,
          totalEarning: 0,
          commission: 0,
          netProfit: 0,
        };
      }

      grouped[key].bookings += 1;
      grouped[key].totalEarning += total;
      grouped[key].commission += commission;
      grouped[key].netProfit += netProfit;
    });

    return Object.values(grouped);
  };

  const chartData = useMemo(() => buildData(filter), [filteredBookings, filter]);

  const totalEarning = chartData.reduce((sum, item) => sum + item.totalEarning, 0);
  const totalCommission = chartData.reduce((sum, item) => sum + item.commission, 0);
  const netProfit = chartData.reduce((sum, item) => sum + item.netProfit, 0);

  const formatMoney = (value) => `NPR ${Number(value || 0).toFixed(0)}`;

  const resetDateFilter = () => {
    setStartDate("");
    setEndDate("");
  };

  const downloadPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");

    doc.setFontSize(18);
    doc.text("Owner Earning Report", 14, 18);

    doc.setFontSize(10);
    doc.text(`Report Type: ${filter.toUpperCase()}`, 14, 26);
    doc.text(`Date Range: ${startDate || "All"} to ${endDate || "All"}`, 14, 32);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 38);

    autoTable(doc, {
      startY: 46,
      head: [["Total Earning", "Commission Given", "Net Profit"]],
      body: [[
        formatMoney(totalEarning),
        formatMoney(totalCommission),
        formatMoney(netProfit),
      ]],
      theme: "grid",
      headStyles: { fillColor: [22, 163, 74] },
    });

    let nextY = doc.lastAutoTable.finalY + 10;

    if (chartRef.current && chartData.length > 0) {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: "#ffffff",
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 180;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      doc.setFontSize(13);
      doc.text("Earnings Comparison Chart", 14, nextY);

      doc.addImage(imgData, "PNG", 14, nextY + 5, imgWidth, Math.min(imgHeight, 85));
      nextY += Math.min(imgHeight, 85) + 15;
    }

    autoTable(doc, {
      startY: nextY,
      head: [["Period", "Bookings", "Total Earning", "Commission Given", "Net Profit"]],
      body: chartData.map((item) => [
        item.period,
        item.bookings,
        formatMoney(item.totalEarning),
        formatMoney(item.commission),
        formatMoney(item.netProfit),
      ]),
      theme: "striped",
      headStyles: { fillColor: [22, 163, 74] },
    });

    doc.save(`owner-earnings-${filter}-report.pdf`);
  };

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

            <button
              onClick={downloadPDF}
              disabled={loading || chartData.length === 0}
              className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Download {filter.charAt(0).toUpperCase() + filter.slice(1)} PDF
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              <p className="mt-1 text-sm text-slate-500">
                Select report type and date range.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
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

              <div>
                <label className="text-xs font-semibold text-slate-500">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 block rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 block rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
                />
              </div>

              <button
                onClick={resetDateFilter}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <SummaryCard title="Total Earning" value={formatMoney(totalEarning)} color="blue" />
          <SummaryCard title="Commission Given" value={formatMoney(totalCommission)} color="red" />
          <SummaryCard title="Net Profit" value={formatMoney(netProfit)} color="green" />
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
            <div ref={chartRef} className="h-[360px] w-full bg-white p-2">
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
                  <th className="px-4 py-3">Bookings</th>
                  <th className="px-4 py-3">Total Earning</th>
                  <th className="px-4 py-3">Commission Given</th>
                  <th className="px-4 py-3">Net Profit</th>
                </tr>
              </thead>

              <tbody>
                {chartData.map((item) => (
                  <tr key={item.period} className="border-t">
                    <td className="px-4 py-3 font-semibold">{item.period}</td>
                    <td className="px-4 py-3">{item.bookings}</td>
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
                    <td colSpan="5" className="px-4 py-10 text-center text-slate-500">
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