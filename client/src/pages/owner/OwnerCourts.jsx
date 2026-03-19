
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useLocation } from "react-router-dom";

// const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// export default function OwnerCourts() {
//   const location = useLocation();

//   const formRef = useRef(null);
//   const nameRef = useRef(null);

//   const [courts, setCourts] = useState([]);
//   const [name, setName] = useState("");
//   const [city, setCity] = useState("");
//   const [price, setPrice] = useState("");

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [err, setErr] = useState("");

//   const token = useMemo(() => {
//     return (
//       localStorage.getItem("token") ||
//       localStorage.getItem("accessToken") ||
//       localStorage.getItem("authToken") ||
//       ""
//     );
//   }, []);

//   const loadMyCourts = async () => {
//     setErr("");
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE}/api/grounds/mine`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json().catch(() => []);
//       if (!res.ok) {
//         setCourts([]);
//         setErr(data?.message || "Failed to load courts");
//         return;
//       }
//       setCourts(Array.isArray(data) ? data : []);
//     } catch (e) {
//       setErr("Server error loading courts");
//       setCourts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadMyCourts();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (location.state?.openAdd) {
//       setTimeout(() => {
//         formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//         nameRef.current?.focus();
//       }, 100);
//     }
//   }, [location.state]);

//   const addCourt = async (e) => {
//     e.preventDefault();
//     setErr("");

//     if (!name.trim() || !city.trim() || !String(price).trim()) {
//       setErr("Please fill name, city/area and price.");
//       return;
//     }

//     setSaving(true);
//     try {
//       const res = await fetch(`${API_BASE}/api/grounds`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           name: name.trim(),
//           location: city.trim(),          // ✅ FIX: city/area -> location
//           pricePerHour: Number(price),    // ✅ OK
//         }),
//       });

//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) {
//         setErr(data?.message || "Failed to save court");
//         return;
//       }

//       setCourts((prev) => [data, ...prev]);

//       setName("");
//       setCity("");
//       setPrice("");
//       nameRef.current?.focus();
//     } catch (e2) {
//       setErr("Server error saving court");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const removeCourt = async (id) => {
//     setErr("");
//     try {
//       const res = await fetch(`${API_BASE}/api/grounds/${id}`, {
//         method: "DELETE",
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json().catch(() => ({}));
//       if (!res.ok) {
//         setErr(data?.message || "Failed to remove court");
//         return;
//       }

//       setCourts((prev) => prev.filter((c) => c._id !== id));
//     } catch {
//       setErr("Server error removing court");
//     }
//   };

//   return (
//     <div>
//       <div className="flex items-end justify-between gap-3">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Manage Courts</h1>
//           <p className="mt-1 text-sm text-gray-600">
//             Add and manage your indoor cricket courts.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={() => {
//             formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//             setTimeout(() => nameRef.current?.focus(), 150);
//           }}
//           className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 transition"
//         >
//           + Add Court
//         </button>
//       </div>

//       {err && (
//         <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           {err}
//         </div>
//       )}

//       <form
//         ref={formRef}
//         onSubmit={addCourt}
//         className="mt-6 rounded-2xl bg-gray-50 p-5 ring-1 ring-black/5"
//       >
//         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//           <div className="lg:col-span-2">
//             <label className="block text-xs font-semibold text-gray-700">
//               Court / Venue Name
//             </label>
//             <input
//               ref={nameRef}
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Great Himalaya Cricket Academy"
//               className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-gray-700">
//               City / Area
//             </label>
//             <input
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//               placeholder="Lalitpur"
//               className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-gray-700">
//               Price (per hour)
//             </label>
//             <input
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               placeholder="1500"
//               className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           disabled={saving}
//           className="mt-4 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition disabled:opacity-60"
//         >
//           {saving ? "Saving..." : "Save Court"}
//         </button>
//       </form>

//       <div className="mt-6">
//         <div className="flex items-center justify-between">
//           <div className="text-sm font-semibold text-gray-900">Your Courts</div>
//           <div className="text-xs text-gray-600">{courts.length} total</div>
//         </div>

//         {loading ? (
//           <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
//             {Array.from({ length: 3 }).map((_, i) => (
//               <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
//             ))}
//           </div>
//         ) : courts.length === 0 ? (
//           <div className="mt-3 rounded-xl border border-dashed border-gray-200 p-6 text-sm text-gray-600">
//             No courts added yet. Click <span className="font-semibold">+ Add Court</span> to create your first listing.
//           </div>
//         ) : (
//           <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
//             {courts.map((c) => (
//               <div
//                 key={c._id}
//                 className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 hover:shadow-md transition"
//               >
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <div className="text-base font-semibold text-gray-900">{c.name}</div>
//                     <div className="mt-1 text-sm text-gray-600">
//                       {c.location || "—"} {/* ✅ FIX: show location */}
//                     </div>
//                   </div>

//                   <div className="flex gap-2">
//   <button
//     onClick={() => handleEdit(court)}
//     className="px-3 py-1 text-sm rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50"
//   >
//     Edit
//   </button>

//   <button
//     onClick={() => handleRemove(court._id)}
//     className="px-3 py-1 text-sm rounded-lg border border-red-300 text-red-700 hover:bg-red-50"
//   >
//     Remove
//   </button>
// </div>
//                 </div>

//                 <div className="mt-4 flex items-center justify-between">
//                   <div className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
//                     Rs {c.pricePerHour}/hr
//                   </div>
//                   <div className="text-xs text-gray-500">
//                     {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {!loading && (
//           <button
//             type="button"
//             onClick={loadMyCourts}
//             className="mt-5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
//           >
//             Refresh
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function OwnerCourts() {
  const location = useLocation();

  const formRef = useRef(null);
  const nameRef = useRef(null);

  const [courts, setCourts] = useState([]);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");

  // ✅ added for edit feature (minimal)
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const token = useMemo(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      ""
    );
  }, []);

  const loadMyCourts = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/grounds/mine`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => []);
      if (!res.ok) {
        setCourts([]);
        setErr(data?.message || "Failed to load courts");
        return;
      }
      setCourts(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr("Server error loading courts");
      setCourts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMyCourts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (location.state?.openAdd) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        nameRef.current?.focus();
      }, 100);
    }
  }, [location.state]);

  // ✅ edit handler (fills form, same inputs)
  const handleEdit = (court) => {
    setErr("");
    setEditingId(court._id);
    setName(court.name || "");
    setCity(court.location || "");
    setPrice(
      court.pricePerHour !== undefined && court.pricePerHour !== null
        ? String(court.pricePerHour)
        : ""
    );

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      nameRef.current?.focus();
    }, 80);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setCity("");
    setPrice("");
    setErr("");
    setTimeout(() => nameRef.current?.focus(), 50);
  };

  // ✅ SAME function name (addCourt) but supports edit using PUT when editingId exists
  const addCourt = async (e) => {
    e.preventDefault();
    setErr("");

    if (!name.trim() || !city.trim() || !String(price).trim()) {
      setErr("Please fill name, city/area and price.");
      return;
    }

    setSaving(true);
    try {
      const isEditing = Boolean(editingId);
      const url = isEditing
        ? `${API_BASE}/api/grounds/${editingId}`
        : `${API_BASE}/api/grounds`;

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          location: city.trim(), // keep your existing field usage
          pricePerHour: Number(price),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.message || "Failed to save court");
        return;
      }

      // keep same “update UI immediately” behavior
      if (isEditing) {
        setCourts((prev) =>
          prev.map((c) => (c._id === editingId ? data : c))
        );
      } else {
        setCourts((prev) => [data, ...prev]);
      }

      // reset form
      setName("");
      setCity("");
      setPrice("");
      setEditingId(null);
      nameRef.current?.focus();
    } catch (e2) {
      setErr("Server error saving court");
    } finally {
      setSaving(false);
    }
  };

  const removeCourt = async (id) => {
    setErr("");
    try {
      const res = await fetch(`${API_BASE}/api/grounds/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(data?.message || "Failed to remove court");
        return;
      }

      setCourts((prev) => prev.filter((c) => c._id !== id));

      // if you delete the one you're editing, reset form
      if (editingId === id) cancelEdit();
    } catch {
      setErr("Server error removing court");
    }
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Courts</h1>
          <p className="mt-1 text-sm text-gray-600">
            Add and manage your indoor cricket courts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            setTimeout(() => nameRef.current?.focus(), 150);
          }}
          className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 transition"
        >
          + Add Court
        </button>
      </div>

      {err && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {err}
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={addCourt}
        className="mt-6 rounded-2xl bg-gray-50 p-5 ring-1 ring-black/5"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-gray-700">
              Court / Venue Name
            </label>
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Great Himalaya Cricket Academy"
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              City / Area
            </label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Lalitpur"
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Price (per hour)
            </label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="1500"
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Update Court" : "Save Court"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">Your Courts</div>
          <div className="text-xs text-gray-600">{courts.length} total</div>
        </div>

        {loading ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : courts.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-gray-200 p-6 text-sm text-gray-600">
            No courts added yet. Click{" "}
            <span className="font-semibold">+ Add Court</span> to create your
            first listing.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courts.map((c) => (
              <div
                key={c._id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-gray-900">
                      {c.name}
                    </div>
                    <div className="mt-1 text-sm text-gray-600">
                      {c.location || "—"}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(c)}
                      className="px-3 py-1 text-sm rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => removeCourt(c._id)}
                      className="px-3 py-1 text-sm rounded-lg border border-red-300 text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
                    Rs {c.pricePerHour}/hr
                  </div>
                  <div className="text-xs text-gray-500">
                    {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <button
            type="button"
            onClick={loadMyCourts}
            className="mt-5 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            Refresh
          </button>
        )}
      </div>
    </div>
  );
}