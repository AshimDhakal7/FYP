import React, { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  apiGet,
  buildOverviewFromBookings,
  formatDate,
  formatMoney,
  statusTone,
} from "./adminApi";

function StatCard({ title, value, subtitle, accent }) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5 shadow-xl shadow-black/10">
      <div
        className={`mb-4 inline-flex rounded-2xl px-3 py-1 text-xs font-semibold ${accent}`}
      >
        {title}
      </div>
      <h3 className="text-3xl font-semibold text-white">{value}</h3>
      <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState({
    stats: {
      totalBookings: 0,
      totalRevenue: 0,
      paidRevenue: 0,
      confirmed: 0,
      pending: 0,
      uniqueUsers: 0,
      uniqueOwners: 0,
    },
    monthlyData: [],
    topGrounds: [],
    recentBookings: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);

        let bookings = [];
        try {
          const data = await apiGet("/api/admin/bookings");
          bookings = data?.bookings || [];
        } catch {
          bookings = [];
        }

        setOverview(buildOverviewFromBookings(bookings));
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = overview.stats;

  const chartRevenue = useMemo(
    () =>
      overview.monthlyData.length
        ? overview.monthlyData
        : [
            { month: "Jan", revenue: 0, bookings: 0 },
            { month: "Feb", revenue: 0, bookings: 0 },
            { month: "Mar", revenue: 0, bookings: 0 },
          ],
    [overview.monthlyData]
  );

  const chartTopGrounds = useMemo(
    () =>
      overview.topGrounds.length
        ? overview.topGrounds
        : [
            { name: "Ground 1", revenue: 0 },
            { name: "Ground 2", revenue: 0 },
            { name: "Ground 3", revenue: 0 },
          ],
    [overview.topGrounds]
  );

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/50 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-emerald-300/80">
              Overview
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
              Clean, professional and premium admin dashboard
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
              Monitor bookings, revenue, owners, users, and operational flow from
              one elegant control panel.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs text-slate-400">Bookings</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {stats.totalBookings}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs text-slate-400">Revenue</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {formatMoney(stats.totalRevenue)}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs text-slate-400">Users</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {stats.uniqueUsers}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs text-slate-400">Owners</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {stats.uniqueOwners}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={loading ? "..." : formatMoney(stats.totalRevenue)}
          subtitle="Platform gross earnings"
          accent="bg-emerald-400/15 text-emerald-300"
        />
        <StatCard
          title="Paid Revenue"
          value={loading ? "..." : formatMoney(stats.paidRevenue)}
          subtitle="Successfully collected amount"
          accent="bg-cyan-400/15 text-cyan-300"
        />
        <StatCard
          title="Confirmed Bookings"
          value={loading ? "..." : stats.confirmed}
          subtitle="Approved and active reservations"
          accent="bg-violet-400/15 text-violet-300"
        />
        <StatCard
          title="Pending Bookings"
          value={loading ? "..." : stats.pending}
          subtitle="Requires admin attention"
          accent="bg-amber-400/15 text-amber-300"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.5fr,1fr]">
        <div className="rounded-[30px] border border-white/10 bg-slate-900/60 p-5">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Revenue Trend</h2>
            <p className="text-sm text-slate-400">
              Monthly booking revenue snapshot
            </p>
          </div>

          <div className="w-full h-[320px] min-h-[320px]">
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={chartRevenue}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.7} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 16,
                    color: "#fff",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#34d399"
                  fill="url(#colorRevenue)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[30px] border border-white/10 bg-slate-900/60 p-5">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white">Top Grounds</h2>
            <p className="text-sm text-slate-400">
              Best earning grounds on the platform
            </p>
          </div>

          <div className="w-full h-[320px] min-h-[320px]">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={chartTopGrounds}>
                <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" hide />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    background: "#0f172a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 16,
                    color: "#fff",
                  }}
                />
                <Bar dataKey="revenue" fill="#22c55e" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-3">
            {overview.topGrounds.length ? (
              overview.topGrounds.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span className="text-sm text-white">{item.name}</span>
                  <span className="text-sm font-semibold text-emerald-300">
                    {formatMoney(item.revenue)}
                  </span>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-slate-400">
                No ground analytics yet. Connect real admin endpoints to populate
                this chart.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-slate-900/60 p-5">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent Bookings</h2>
            <p className="text-sm text-slate-400">
              Latest platform activity at a glance
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-[24px] border border-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-4 py-4 font-medium">Ground</th>
                  <th className="px-4 py-4 font-medium">User</th>
                  <th className="px-4 py-4 font-medium">Owner</th>
                  <th className="px-4 py-4 font-medium">Date</th>
                  <th className="px-4 py-4 font-medium">Amount</th>
                  <th className="px-4 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {overview.recentBookings.length ? (
                  overview.recentBookings.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t border-white/10 text-slate-200"
                    >
                      <td className="px-4 py-4">{item?.cricsal?.name || "N/A"}</td>
                      <td className="px-4 py-4">{item?.user?.name || "N/A"}</td>
                      <td className="px-4 py-4">{item?.owner?.name || "N/A"}</td>
                      <td className="px-4 py-4">
                        {formatDate(item?.date || item?.createdAt)}
                      </td>
                      <td className="px-4 py-4">
                        {formatMoney(item?.totalPrice || 0)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(
                            item?.status
                          )}`}
                        >
                          {item?.status || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-4 py-10 text-center text-slate-400"
                    >
                      No recent bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}