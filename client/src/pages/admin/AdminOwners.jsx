import React, { useEffect, useMemo, useState } from "react";
import { safeApiGet, statusTone } from "./adminApi";

export default function AdminOwners() {
  const [search, setSearch] = useState("");
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await safeApiGet("/api/admin/owners", {
        owners: [
          { _id: "1", name: "Himal Sports Group", email: "himal@example.com", grounds: 3, status: "active" },
          { _id: "2", name: "Metro Turf Pvt Ltd", email: "metro@example.com", grounds: 2, status: "active" },
          { _id: "3", name: "Valley Arena", email: "valley@example.com", grounds: 1, status: "pending" },
        ],
      });

      setOwners(data?.owners || []);
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    return owners.filter((owner) =>
      `${owner.name} ${owner.email}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [owners, search]);

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-slate-900/60 p-6">
        <h1 className="text-3xl font-semibold text-white">Owners Management</h1>
        <p className="mt-2 text-sm text-slate-400">
          Track partner owners, venue count, and onboarding status.
        </p>
        <input
          type="text"
          placeholder="Search owner by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Total Owners</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{owners.length}</h2>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Active Owners</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            {owners.filter((x) => x.status === "active").length}
          </h2>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Total Grounds</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            {owners.reduce((sum, owner) => sum + Number(owner.grounds || 0), 0)}
          </h2>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-5 py-4 font-medium">Owner</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Grounds</th>
                <th className="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((owner) => (
                <tr
                  key={owner._id}
                  className="border-t border-white/10 text-slate-200"
                >
                  <td className="px-5 py-4 font-medium text-white">{owner.name}</td>
                  <td className="px-5 py-4">{owner.email}</td>
                  <td className="px-5 py-4">{owner.grounds || 0}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(
                        owner.status
                      )}`}
                    >
                      {owner.status}
                    </span>
                  </td>
                </tr>
              ))}

              {!filtered.length && (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center text-slate-400">
                    No owners found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}