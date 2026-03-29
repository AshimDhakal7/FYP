import React, { useEffect, useMemo, useState } from "react";
import { apiGet, formatDate, formatMoney, statusTone } from "./adminApi";

export default function AdminBookings() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await apiGet("/api/admin/bookings");
        setBookings(data?.bookings || []);
      } catch (err) {
        setError(err.message || "Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      const fullText = [
        item?.cricsal?.name,
        item?.user?.name,
        item?.owner?.name,
        item?.status,
        item?.date,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch = fullText.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all"
          ? true
          : String(item?.status || "").toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, statusFilter]);

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 p-6">
        <h1 className="text-3xl font-semibold text-white">Bookings Management</h1>
        <p className="mt-2 text-sm text-slate-400">
          Review all reservations, payment state, and booking flow.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-[1fr,220px]">
          <input
            type="text"
            placeholder="Search by ground, user, owner or status"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400"
          >
            <option value="all" className="bg-slate-900">All Status</option>
            <option value="confirmed" className="bg-slate-900">Confirmed</option>
            <option value="pending" className="bg-slate-900">Pending</option>
            <option value="cancelled" className="bg-slate-900">Cancelled</option>
          </select>
        </div>
      </section>

      {loading && (
        <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-10 text-center text-slate-300">
          Loading bookings...
        </div>
      )}

      {error && (
        <div className="rounded-[28px] border border-rose-500/20 bg-rose-500/10 p-5 text-rose-200">
          {error}
        </div>
      )}

      {!loading && !error && (
        <section className="rounded-[30px] border border-white/10 bg-slate-900/60">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {filteredBookings.length} bookings found
              </h2>
              <p className="text-sm text-slate-400">
                Premium table layout with clean admin filtering
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-300">
                <tr>
                  <th className="px-5 py-4 font-medium">Ground</th>
                  <th className="px-5 py-4 font-medium">User</th>
                  <th className="px-5 py-4 font-medium">Owner</th>
                  <th className="px-5 py-4 font-medium">Schedule</th>
                  <th className="px-5 py-4 font-medium">Payment</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.length ? (
                  filteredBookings.map((b) => (
                    <tr
                      key={b._id}
                      className="border-t border-white/10 text-slate-200"
                    >
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-white">
                            {b?.cricsal?.name || "Unknown Ground"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {b?.cricsal?.location || "Location not available"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p>{b?.user?.name || "N/A"}</p>
                          <p className="text-xs text-slate-400">
                            {b?.user?.email || "No email"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p>{b?.owner?.name || "N/A"}</p>
                          <p className="text-xs text-slate-400">
                            {b?.owner?.email || "No email"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p>{formatDate(b?.date || b?.createdAt)}</p>
                          <p className="text-xs text-slate-400">
                            {b?.startTime || "--"} - {b?.endTime || "--"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p className="font-semibold text-emerald-300">
                            {formatMoney(b?.totalPrice || 0)}
                          </p>
                          <p className="text-xs text-slate-400">
                            {b?.isPaid ? "Paid" : "Unpaid"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(
                            b?.status
                          )}`}
                        >
                          {b?.status || "Unknown"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-12 text-center text-slate-400"
                    >
                      No bookings matched your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}