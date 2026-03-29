import React, { useEffect, useMemo, useState } from "react";
import { safeApiGet, statusTone } from "./adminApi";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await safeApiGet("/api/admin/users", {
        users: [
          { _id: "1", name: "Aarav Sharma", email: "aarav@example.com", status: "active", bookings: 14 },
          { _id: "2", name: "Sita Thapa", email: "sita@example.com", status: "active", bookings: 8 },
          { _id: "3", name: "Rohan KC", email: "rohan@example.com", status: "inactive", bookings: 2 },
        ],
      });

      setUsers(data?.users || []);
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((user) =>
      `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-slate-900/60 p-6">
        <h1 className="text-3xl font-semibold text-white">Users Management</h1>
        <p className="mt-2 text-sm text-slate-400">
          Review customers, activity level, and booking engagement.
        </p>
        <input
          type="text"
          placeholder="Search user by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Total Users</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{users.length}</h2>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Active Users</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            {users.filter((x) => x.status === "active").length}
          </h2>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Power Users</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            {users.filter((x) => Number(x.bookings || 0) >= 10).length}
          </h2>
        </div>
      </section>

      <section className="rounded-[30px] border border-white/10 bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-5 py-4 font-medium">User</th>
                <th className="px-5 py-4 font-medium">Email</th>
                <th className="px-5 py-4 font-medium">Bookings</th>
                <th className="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-white/10 text-slate-200"
                >
                  <td className="px-5 py-4 font-medium text-white">{user.name}</td>
                  <td className="px-5 py-4">{user.email}</td>
                  <td className="px-5 py-4">{user.bookings || 0}</td>
                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </td>
                </tr>
              ))}

              {!filtered.length && (
                <tr>
                  <td colSpan="4" className="px-5 py-10 text-center text-slate-400">
                    No users found.
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