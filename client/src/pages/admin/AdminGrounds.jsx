import React, { useEffect, useMemo, useState } from "react";
import { apiGet, formatMoney, statusTone } from "./adminApi";

export default function AdminGrounds() {
  const [search, setSearch] = useState("");
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await apiGet("/api/admin/grounds");
        setGrounds(data?.grounds || []);
      } catch {
        setGrounds([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    return grounds.filter((ground) =>
      `${ground.name} ${ground.location} ${ground.ownerName}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [grounds, search]);

  const avgPrice =
    grounds.length
      ? grounds.reduce((sum, x) => sum + Number(x.pricePerHour || 0), 0) / grounds.length
      : 0;

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-slate-900/60 p-6">
        <h1 className="text-3xl font-semibold text-white">Grounds Management</h1>
        <p className="mt-2 text-sm text-slate-400">
          Monitor venue listing quality, owner coverage, and pricing.
        </p>
        <input
          type="text"
          placeholder="Search ground by name, location or owner"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Total Grounds</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{grounds.length}</h2>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Listed Today</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            {
              grounds.filter((g) => {
                const d = new Date(g.createdAt);
                const now = new Date();
                return (
                  d.getDate() === now.getDate() &&
                  d.getMonth() === now.getMonth() &&
                  d.getFullYear() === now.getFullYear()
                );
              }).length
            }
          </h2>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Average Price / Hr</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{formatMoney(avgPrice)}</h2>
        </div>
      </section>

      {loading ? (
        <div className="rounded-[30px] border border-white/10 bg-slate-900/60 px-5 py-12 text-center text-slate-400">
          Loading grounds…
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {filtered.map((ground) => (
            <div
              key={ground._id}
              className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-white">{ground.name}</h3>
                  <p className="mt-1 text-sm text-slate-400">{ground.location}</p>
                </div>
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(
                    ground.status || "active"
                  )}`}
                >
                  {ground.status || "Active"}
                </span>
              </div>

              <div className="mt-5 space-y-3 text-sm text-slate-300">
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span>Owner</span>
                  <span className="font-medium text-white">{ground.ownerName || "Unknown"}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span>Owner Email</span>
                  <span className="font-medium text-slate-300">{ground.ownerEmail || "—"}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                  <span>Price / Hour</span>
                  <span className="font-medium text-emerald-300">
                    {formatMoney(ground.pricePerHour)}
                  </span>
                </div>
                {ground.phone && (
                  <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                    <span>Phone</span>
                    <span className="font-medium text-white">{ground.phone}</span>
                  </div>
                )}
              </div>
            </div>
          ))}

          {!filtered.length && (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-slate-900/60 p-10 text-center text-slate-400 xl:col-span-3">
              No grounds found.
            </div>
          )}
        </section>
      )}
    </div>
  );
}