import React, { useEffect, useState } from "react";
import { apiGet, formatMoney } from "./adminApi";

const COMMISSION = 0.1;

export default function AdminEarnings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await apiGet("/api/admin/bookings");
      setBookings(data?.bookings || []);
    } catch {
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = bookings.reduce(
    (sum, b) => sum + Number(b.totalPrice || 0),
    0
  );

  const adminEarning = totalRevenue * COMMISSION;
  const ownerPayout = totalRevenue * 0.9;

  // Admin net profit is the platform commission.
  const netProfit = adminEarning;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Earnings</h1>
        <p className="mt-2 text-sm text-gray-400">
          View admin commission, net profit, and owner payout from all bookings.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-4">
        <Card title="Total Revenue" value={formatMoney(totalRevenue)} />

        <Card
          title="Admin Commission (10%)"
          value={formatMoney(adminEarning)}
        />

        <Card
          title="Net Profit"
          value={formatMoney(netProfit)}
          highlight="green"
        />

        <Card title="Owner Payout (90%)" value={formatMoney(ownerPayout)} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
        <h2 className="mb-4 text-lg font-semibold text-white">
          Booking Earnings Breakdown
        </h2>

        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : bookings.length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 bg-white/5 p-8 text-center text-gray-400">
            No bookings found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-white">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-4 py-3">Ground</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Commission</th>
                  <th className="px-4 py-3">Admin Net Profit</th>
                  <th className="px-4 py-3">Owner Earn</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => {
                  const amount = Number(b.totalPrice || 0);
                  const commission = amount * COMMISSION;
                  const adminNetProfit = commission;
                  const ownerEarn = amount * 0.9;

                  return (
                    <tr key={b._id} className="border-t border-white/10">
                      <td className="px-4 py-3">
                        {b.cricsal?.name || b.ground?.name || "N/A"}
                      </td>

                      <td className="px-4 py-3">{b.user?.name || "N/A"}</td>

                      <td className="px-4 py-3">
                        {b.owner?.name ||
                          b.cricsal?.owner?.name ||
                          b.ground?.owner?.name ||
                          "N/A"}
                      </td>

                      <td className="px-4 py-3">{formatMoney(amount)}</td>

                      <td className="px-4 py-3 font-semibold text-green-400">
                        {formatMoney(commission)}
                      </td>

                      <td className="px-4 py-3 font-semibold text-emerald-400">
                        {formatMoney(adminNetProfit)}
                      </td>

                      <td className="px-4 py-3 font-semibold text-blue-400">
                        {formatMoney(ownerEarn)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function Card({ title, value, highlight }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900 p-5">
      <p className="text-sm text-gray-400">{title}</p>
      <h2
        className={`mt-2 text-2xl font-bold ${
          highlight === "green"
            ? "text-green-400"
            : highlight === "red"
            ? "text-red-400"
            : "text-white"
        }`}
      >
        {value}
      </h2>
    </div>
  );
}