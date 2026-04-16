// import React, { useEffect, useMemo, useState } from "react";
// import { apiGet, formatMoney, statusTone } from "./adminApi";

// export default function AdminGrounds() {
//   const [search, setSearch] = useState("");
//   const [grounds, setGrounds] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const load = async () => {
//       try {
//         setLoading(true);
//         const data = await apiGet("/api/admin/grounds");
//         setGrounds(data?.grounds || []);
//       } catch {
//         setGrounds([]);
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   const filtered = useMemo(() => {
//     return grounds.filter((ground) =>
//       `${ground.name} ${ground.location} ${ground.ownerName}`
//         .toLowerCase()
//         .includes(search.toLowerCase())
//     );
//   }, [grounds, search]);

//   const avgPrice =
//     grounds.length
//       ? grounds.reduce((sum, x) => sum + Number(x.pricePerHour || 0), 0) / grounds.length
//       : 0;

//   return (
//     <div className="space-y-6">
//       <section className="rounded-[30px] border border-white/10 bg-slate-900/60 p-6">
//         <h1 className="text-3xl font-semibold text-white">Grounds Management</h1>
//         <p className="mt-2 text-sm text-slate-400">
//           Monitor venue listing quality, owner coverage, and pricing.
//         </p>
//         <input
//           type="text"
//           placeholder="Search ground by name, location or owner"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="mt-5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
//         />
//       </section>

//       <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
//         <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
//           <p className="text-sm text-slate-400">Total Grounds</p>
//           <h2 className="mt-2 text-3xl font-semibold text-white">{grounds.length}</h2>
//         </div>
//         <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
//           <p className="text-sm text-slate-400">Listed Today</p>
//           <h2 className="mt-2 text-3xl font-semibold text-white">
//             {
//               grounds.filter((g) => {
//                 const d = new Date(g.createdAt);
//                 const now = new Date();
//                 return (
//                   d.getDate() === now.getDate() &&
//                   d.getMonth() === now.getMonth() &&
//                   d.getFullYear() === now.getFullYear()
//                 );
//               }).length
//             }
//           </h2>
//         </div>
//         <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
//           <p className="text-sm text-slate-400">Average Price / Hr</p>
//           <h2 className="mt-2 text-3xl font-semibold text-white">{formatMoney(avgPrice)}</h2>
//         </div>
//       </section>

//       {loading ? (
//         <div className="rounded-[30px] border border-white/10 bg-slate-900/60 px-5 py-12 text-center text-slate-400">
//           Loading grounds…
//         </div>
//       ) : (
//         <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
//           {filtered.map((ground) => (
//             <div
//               key={ground._id}
//               className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5"
//             >
//               <div className="flex items-start justify-between gap-3">
//                 <div>
//                   <h3 className="text-lg font-semibold text-white">{ground.name}</h3>
//                   <p className="mt-1 text-sm text-slate-400">{ground.location}</p>
//                 </div>
//                 <span
//                   className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusTone(
//                     ground.status || "active"
//                   )}`}
//                 >
//                   {ground.status || "Active"}
//                 </span>
//               </div>

//               <div className="mt-5 space-y-3 text-sm text-slate-300">
//                 <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
//                   <span>Owner</span>
//                   <span className="font-medium text-white">{ground.ownerName || "Unknown"}</span>
//                 </div>
//                 <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
//                   <span>Owner Email</span>
//                   <span className="font-medium text-slate-300">{ground.ownerEmail || "—"}</span>
//                 </div>
//                 <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
//                   <span>Price / Hour</span>
//                   <span className="font-medium text-emerald-300">
//                     {formatMoney(ground.pricePerHour)}
//                   </span>
//                 </div>
//                 {ground.phone && (
//                   <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
//                     <span>Phone</span>
//                     <span className="font-medium text-white">{ground.phone}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}

//           {!filtered.length && (
//             <div className="rounded-[28px] border border-dashed border-white/10 bg-slate-900/60 p-10 text-center text-slate-400 xl:col-span-3">
//               No grounds found.
//             </div>
//           )}
//         </section>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import { apiGet, apiPatch, formatMoney, statusTone } from "./adminApi";

const TABS = ["pending", "approved", "rejected"];

export default function AdminGrounds() {
  const [search, setSearch] = useState("");
  const [grounds, setGrounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [actionId, setActionId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadGrounds = async () => {
    try {
      setLoading(true);
      setMessage("");
      setError("");

      const [pendingData, approvedData, rejectedData] = await Promise.all([
        apiGet("/api/grounds/admin?status=pending"),
        apiGet("/api/grounds/admin?status=approved"),
        apiGet("/api/grounds/admin?status=rejected"),
      ]);

      const pendingGrounds = Array.isArray(pendingData?.grounds)
        ? pendingData.grounds
        : [];
      const approvedGrounds = Array.isArray(approvedData?.grounds)
        ? approvedData.grounds
        : [];
      const rejectedGrounds = Array.isArray(rejectedData?.grounds)
        ? rejectedData.grounds
        : [];

      setGrounds([...pendingGrounds, ...approvedGrounds, ...rejectedGrounds]);
    } catch (err) {
      console.error("LOAD ADMIN GROUNDS ERROR:", err);
      setGrounds([]);
      setError(err?.message || "Failed to load grounds");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrounds();
  }, []);

  const tabCounts = useMemo(() => {
    return {
      pending: grounds.filter((g) => (g.status || "pending") === "pending").length,
      approved: grounds.filter((g) => (g.status || "").toLowerCase() === "approved")
        .length,
      rejected: grounds.filter((g) => (g.status || "").toLowerCase() === "rejected")
        .length,
    };
  }, [grounds]);

  const filtered = useMemo(() => {
    return grounds
      .filter((ground) => (ground.status || "pending").toLowerCase() === activeTab)
      .filter((ground) =>
        `${ground.name || ""} ${ground.location || ""} ${
          ground.ownerName || ground.ownerId?.name || ""
        } ${ground.ownerEmail || ground.ownerId?.email || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      );
  }, [grounds, search, activeTab]);

  const avgPrice = filtered.length
    ? filtered.reduce((sum, x) => sum + Number(x.pricePerHour || 0), 0) /
      filtered.length
    : 0;

  const listedToday = filtered.filter((g) => {
    const d = new Date(g.createdAt);
    const now = new Date();
    return (
      d.getDate() === now.getDate() &&
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear()
    );
  }).length;

  const handleApprove = async (groundId) => {
    try {
      setActionId(groundId);
      setMessage("");
      setError("");

      await apiPatch(`/api/grounds/admin/${groundId}/approve`);

      setGrounds((prev) =>
        prev.map((ground) =>
          ground._id === groundId
            ? {
                ...ground,
                status: "approved",
                approvedAt: new Date().toISOString(),
              }
            : ground
        )
      );

      setMessage("Ground approved successfully.");
    } catch (err) {
      console.error("APPROVE GROUND ERROR:", err);
      setError(err?.message || "Failed to approve ground");
    } finally {
      setActionId("");
    }
  };

  const handleReject = async (groundId) => {
    try {
      setActionId(groundId);
      setMessage("");
      setError("");

      await apiPatch(`/api/grounds/admin/${groundId}/reject`);

      setGrounds((prev) =>
        prev.map((ground) =>
          ground._id === groundId
            ? {
                ...ground,
                status: "rejected",
                rejectedAt: new Date().toISOString(),
              }
            : ground
        )
      );

      setMessage("Ground rejected successfully.");
    } catch (err) {
      console.error("REJECT GROUND ERROR:", err);
      setError(err?.message || "Failed to reject ground");
    } finally {
      setActionId("");
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[30px] border border-white/10 bg-slate-900/60 p-6">
        <h1 className="text-3xl font-semibold text-white">Grounds Management</h1>
        <p className="mt-2 text-sm text-slate-400">
          Monitor venue listing quality, owner coverage, and pricing.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            const count = tabCounts[tab];

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-2xl border px-4 py-2 text-sm font-semibold capitalize transition ${
                  isActive
                    ? "border-emerald-400 bg-emerald-500/15 text-emerald-300"
                    : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        <input
          type="text"
          placeholder="Search ground by name, location or owner"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mt-5 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
        />

        {message && (
          <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Total {activeTab}</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            {filtered.length}
          </h2>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Listed Today</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">{listedToday}</h2>
        </div>

        <div className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5">
          <p className="text-sm text-slate-400">Average Price / Hr</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            {formatMoney(avgPrice)}
          </h2>
        </div>
      </section>

      {loading ? (
        <div className="rounded-[30px] border border-white/10 bg-slate-900/60 px-5 py-12 text-center text-slate-400">
          Loading grounds...
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          {filtered.map((ground) => {
            const currentStatus = (ground.status || "pending").toLowerCase();

            return (
              <div
                key={ground._id}
                className="rounded-[28px] border border-white/10 bg-slate-900/60 p-5"
              >
                {Array.isArray(ground.images) && ground.images.length > 0 && (
                  <img
                    src={ground.images[0]}
                    alt={ground.name}
                    className="mb-4 h-44 w-full rounded-2xl object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/800x500?text=Image+Unavailable";
                    }}
                  />
                )}

                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{ground.name}</h3>
                    <p className="mt-1 text-sm text-slate-400">{ground.location}</p>
                  </div>
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold capitalize ${statusTone(
                      currentStatus
                    )}`}
                  >
                    {currentStatus}
                  </span>
                </div>

                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                    <span>Owner</span>
                    <span className="font-medium text-white">
                      {ground.ownerName || ground.ownerId?.name || "Unknown"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                    <span>Owner Email</span>
                    <span className="font-medium text-slate-300 break-all text-right">
                      {ground.ownerEmail || ground.ownerId?.email || "—"}
                    </span>
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

                  {ground.latitude != null && ground.longitude != null && (
                    <div className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                      <span>Coordinates</span>
                      <span className="font-medium text-slate-300 text-right">
                        {ground.latitude}, {ground.longitude}
                      </span>
                    </div>
                  )}
                </div>

                {currentStatus === "pending" && (
                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleApprove(ground._id)}
                      disabled={actionId === ground._id}
                      className="flex-1 rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-70"
                    >
                      {actionId === ground._id ? "Working..." : "Approve"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleReject(ground._id)}
                      disabled={actionId === ground._id}
                      className="flex-1 rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:opacity-70"
                    >
                      {actionId === ground._id ? "Working..." : "Reject"}
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {!filtered.length && (
            <div className="rounded-[28px] border border-dashed border-white/10 bg-slate-900/60 p-10 text-center text-slate-400 xl:col-span-3">
              No {activeTab} grounds found.
            </div>
          )}
        </section>
      )}
    </div>
  );
}