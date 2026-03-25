

// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// export default function FindCricsal() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token =
//       localStorage.getItem("token") ||
//       localStorage.getItem("accessToken") ||
//       localStorage.getItem("authToken") ||
//       "";
//     if (!token) navigate("/login", { replace: true });
//   }, [navigate]);

//   const [loading, setLoading] = useState(true);
//   const [grounds, setGrounds] = useState([]);
//   const [error, setError] = useState("");
//   const [q, setQ] = useState("");

//   useEffect(() => {
//     const load = async () => {
//       setError("");
//       setLoading(true);
//       try {
//         const res = await fetch(
//           `${API_BASE}/api/grounds?q=${encodeURIComponent(q)}`
//         );
//         const data = await res.json().catch(() => []);
//         if (!res.ok) {
//           setGrounds([]);
//           setError(data?.message || "Failed to load grounds");
//           return;
//         }
//         setGrounds(Array.isArray(data) ? data : []);
//       } catch (e) {
//         setError("Server error loading grounds");
//         setGrounds([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();
//   }, [q]);

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-10">
//       <div className="mx-auto w-full max-w-6xl">
//         {/* Header */}
//         <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
//                 🏏 Find Cricsal
//               </div>
//               <h1 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl">
//                 Choose a ground
//               </h1>
//               <p className="mt-1 text-sm text-gray-600">
//                 Grounds added by owners will show here automatically.
//               </p>

//               <div className="mt-4">
//                 <input
//                   value={q}
//                   onChange={(e) => setQ(e.target.value)}
//                   placeholder="Search by name, area, features..."
//                   className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//                 />
//               </div>
//             </div>

//             <div className="flex gap-2">
//               <Link
//                 to="/home"
//                 className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
//               >
//                 ← Home
//               </Link>
//               <Link
//                 to="/bookings"
//                 className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition"
//               >
//                 My Bookings
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* List */}
//         <div className="mt-6">
//           {loading ? (
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {Array.from({ length: 6 }).map((_, i) => (
//                 <div
//                   key={i}
//                   className="h-56 animate-pulse rounded-3xl bg-gray-100"
//                 />
//               ))}
//             </div>
//           ) : error ? (
//             <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//               {error}
//             </div>
//           ) : grounds.length === 0 ? (
//             <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
//               <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
//                 🏟️
//               </div>
//               <div className="mt-4 text-base font-bold text-gray-900">
//                 No grounds found
//               </div>
//               <div className="mt-1 text-sm text-gray-600">
//                 Ask an owner to add a new ground, or try another search.
//               </div>
//             </div>
//           ) : (
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {grounds.map((g) => (
//                 <div
//                   key={g._id}
//                   className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition"
//                 >
//                   {/* ✅ IMAGE FIX ONLY */}
//                   <div className="h-40 w-full bg-gray-100">
//                     <img
//                       src={g.images?.[0] || "https://via.placeholder.com/400x200"}
//                       alt="ground"
//                       className="h-full w-full object-cover"
//                     />
//                   </div>

//                   <div className="p-5">
//                     <div className="flex items-start justify-between gap-3">
//                       <div>
//                         <div className="text-base font-bold text-gray-900">
//                           {g.name}
//                         </div>
//                         <div className="mt-1 text-sm text-gray-600 space-y-1">
//   <div>📍 {g.location || g.area}</div>
//   {g.phone && <div>📞 {g.phone}</div>}
// </div>
// //                       </div>

// //                       <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
// //                         Rs {g.pricePerHour}/hr
// //                       </div>
// //                     </div>

// //                     <div className="mt-3 flex flex-wrap gap-2">
// //                       {(g.features || []).slice(0, 3).map((t) => (
// //                         <span
// //                           key={t}
// //                           className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700"
// //                         >
// //                           {t}
// //                         </span>
// //                       ))}
// //                       {(g.features || []).length > 3 && (
// //                         <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
// //                           +{(g.features || []).length - 3} more
// //                         </span>
// //                       )}
// //                     </div>

// //                     <div className="mt-4 flex gap-2">
// //                       <Link
// //                         to={`/book/${g._id}`}
// //                         className="flex-1 rounded-xl bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-green-700"
// //                       >
// //                         Book
// //                       </Link>

// //                       <Link
// //                         to={`/ground/${g._id}`}
// //                         className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
// //                       >
// //                         Details
// //                       </Link>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           )}
// //         </div>

// //         <div className="mt-8 text-center text-xs text-gray-500">
// //           © 2026 CricBook • Terms • Privacy
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// import React, { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// export default function FindCricsal() {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token =
//       localStorage.getItem("token") ||
//       localStorage.getItem("accessToken") ||
//       localStorage.getItem("authToken") ||
//       "";

//     if (!token) navigate("/login", { replace: true });
//   }, [navigate]);

//   const [loading, setLoading] = useState(true);
//   const [grounds, setGrounds] = useState([]);
//   const [error, setError] = useState("");

//   const [searchInput, setSearchInput] = useState("");
//   const [q, setQ] = useState("");
//   const [selectedArea, setSelectedArea] = useState("");
//   const [minPrice, setMinPrice] = useState("");
//   const [maxPrice, setMaxPrice] = useState("");
//   const [sortBy, setSortBy] = useState("default");
//   const [availableOnly, setAvailableOnly] = useState(false);
//   const [selectedFeatures, setSelectedFeatures] = useState([]);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setQ(searchInput.trim());
//     }, 350);

//     return () => clearTimeout(timer);
//   }, [searchInput]);

//   useEffect(() => {
//     const controller = new AbortController();

//     const load = async () => {
//       setError("");
//       setLoading(true);

//       try {
//         const res = await fetch(
//           `${API_BASE}/api/grounds?q=${encodeURIComponent(q)}`,
//           { signal: controller.signal }
//         );

//         const data = await res.json().catch(() => []);

//         if (!res.ok) {
//           setGrounds([]);
//           setError(data?.message || "Failed to load grounds");
//           return;
//         }

//         setGrounds(Array.isArray(data) ? data : []);
//       } catch (e) {
//         if (e.name !== "AbortError") {
//           setError("Server error loading grounds");
//           setGrounds([]);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     load();

//     return () => controller.abort();
//   }, [q]);

//   const allAreas = useMemo(() => {
//     const areaSet = new Set();

//     grounds.forEach((g) => {
//       const areaValue = (g.area || g.location || "").trim();
//       if (areaValue) areaSet.add(areaValue);
//     });

//     return Array.from(areaSet).sort((a, b) => a.localeCompare(b));
//   }, [grounds]);

//   const allFeatures = useMemo(() => {
//     const featureSet = new Set();

//     grounds.forEach((g) => {
//       (g.features || []).forEach((feature) => {
//         if (feature && String(feature).trim()) {
//           featureSet.add(String(feature).trim());
//         }
//       });
//     });

//     return Array.from(featureSet).sort((a, b) => a.localeCompare(b));
//   }, [grounds]);

//   const toggleFeature = (feature) => {
//     setSelectedFeatures((prev) =>
//       prev.includes(feature)
//         ? prev.filter((f) => f !== feature)
//         : [...prev, feature]
//     );
//   };

//   const clearAllFilters = () => {
//     setSearchInput("");
//     setQ("");
//     setSelectedArea("");
//     setMinPrice("");
//     setMaxPrice("");
//     setSortBy("default");
//     setAvailableOnly(false);
//     setSelectedFeatures([]);
//   };

//   const filteredGrounds = useMemo(() => {
//     let result = [...grounds];

//     result = result.filter((g) => {
//       const price = Number(g.pricePerHour || 0);
//       const areaValue = String(g.area || g.location || "").toLowerCase();
//       const features = (g.features || []).map((f) => String(f).toLowerCase());

//       const matchesArea =
//         !selectedArea || areaValue === selectedArea.toLowerCase();

//       const matchesMinPrice =
//         minPrice === "" || price >= Number(minPrice);

//       const matchesMaxPrice =
//         maxPrice === "" || price <= Number(maxPrice);

//       const matchesFeatures =
//         selectedFeatures.length === 0 ||
//         selectedFeatures.every((feature) =>
//           features.includes(feature.toLowerCase())
//         );

//       const matchesAvailable =
//         !availableOnly ||
//         g.available === true ||
//         g.isAvailable === true ||
//         g.status === "available";

//       return (
//         matchesArea &&
//         matchesMinPrice &&
//         matchesMaxPrice &&
//         matchesFeatures &&
//         matchesAvailable
//       );
//     });

//     result.sort((a, b) => {
//       const priceA = Number(a.pricePerHour || 0);
//       const priceB = Number(b.pricePerHour || 0);
//       const nameA = String(a.name || "");
//       const nameB = String(b.name || "");

//       switch (sortBy) {
//         case "priceLow":
//           return priceA - priceB;
//         case "priceHigh":
//           return priceB - priceA;
//         case "nameAsc":
//           return nameA.localeCompare(nameB);
//         case "nameDesc":
//           return nameB.localeCompare(nameA);
//         default:
//           return 0;
//       }
//     });

//     return result;
//   }, [
//     grounds,
//     selectedArea,
//     minPrice,
//     maxPrice,
//     selectedFeatures,
//     availableOnly,
//     sortBy,
//   ]);

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-10">
//       <div className="mx-auto w-full max-w-6xl">
//         <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
//           <div className="flex flex-col gap-6">
//             <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
//               <div>
//                 <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
//                   🏏 Find Cricsal
//                 </div>

//                 <h1 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl">
//                   Choose a ground
//                 </h1>

//                 <p className="mt-1 text-sm text-gray-600">
//                   Grounds added by owners will show here automatically.
//                 </p>
//               </div>

//               <div className="flex gap-2">
//                 <Link
//                   to="/home"
//                   className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
//                 >
//                   ← Home
//                 </Link>

//                 <Link
//                   to="/bookings"
//                   className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
//                 >
//                   My Bookings
//                 </Link>
//               </div>
//             </div>

//             <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
//               <input
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//                 placeholder="Search by name, area, features..."
//                 className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 xl:col-span-2"
//               />

//               <select
//                 value={selectedArea}
//                 onChange={(e) => setSelectedArea(e.target.value)}
//                 className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//               >
//                 <option value="">All Areas</option>
//                 {allAreas.map((area) => (
//                   <option key={area} value={area}>
//                     {area}
//                   </option>
//                 ))}
//               </select>

//               <input
//                 type="number"
//                 min="0"
//                 value={minPrice}
//                 onChange={(e) => setMinPrice(e.target.value)}
//                 placeholder="Min price"
//                 className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//               />

//               <input
//                 type="number"
//                 min="0"
//                 value={maxPrice}
//                 onChange={(e) => setMaxPrice(e.target.value)}
//                 placeholder="Max price"
//                 className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//               />
//             </div>

//             <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//               >
//                 <option value="default">Sort: Default</option>
//                 <option value="priceLow">Price: Low to High</option>
//                 <option value="priceHigh">Price: High to Low</option>
//                 <option value="nameAsc">Name: A to Z</option>
//                 <option value="nameDesc">Name: Z to A</option>
//               </select>

//               <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
//                 <input
//                   type="checkbox"
//                   checked={availableOnly}
//                   onChange={(e) => setAvailableOnly(e.target.checked)}
//                   className="h-4 w-4"
//                 />
//                 Available Only
//               </label>

//               <button
//                 type="button"
//                 onClick={clearAllFilters}
//                 className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
//               >
//                 Clear All Filters
//               </button>

//               <div className="flex items-center rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
//                 {filteredGrounds.length} ground{filteredGrounds.length !== 1 ? "s" : ""} found
//               </div>
//             </div>

//             {allFeatures.length > 0 && (
//               <div>
//                 <div className="mb-2 text-sm font-semibold text-gray-800">
//                   Filter by features
//                 </div>

//                 <div className="flex flex-wrap gap-2">
//                   {allFeatures.map((feature) => {
//                     const active = selectedFeatures.includes(feature);

//                     return (
//                       <button
//                         key={feature}
//                         type="button"
//                         onClick={() => toggleFeature(feature)}
//                         className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
//                           active
//                             ? "border-green-600 bg-green-600 text-white"
//                             : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
//                         }`}
//                       >
//                         {feature}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="mt-6">
//           {loading ? (
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {Array.from({ length: 6 }).map((_, i) => (
//                 <div
//                   key={i}
//                   className="h-56 animate-pulse rounded-3xl bg-gray-100"
//                 />
//               ))}
//             </div>
//           ) : error ? (
//             <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//               {error}
//             </div>
//           ) : filteredGrounds.length === 0 ? (
//             <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
//               <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
//                 🏟️
//               </div>

//               <div className="mt-4 text-base font-bold text-gray-900">
//                 No grounds found
//               </div>

//               <div className="mt-1 text-sm text-gray-600">
//                 Try changing filters or search with another keyword.
//               </div>
//             </div>
//           ) : (
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {filteredGrounds.map((g) => (
//                 <div
//                   key={g._id}
//                   className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
//                 >
//                   <div className="h-40 w-full bg-gray-100">
//                     <img
//                       src={g.images?.[0] || "https://via.placeholder.com/400x200"}
//                       alt={g.name || "ground"}
//                       className="h-full w-full object-cover"
//                     />
//                   </div>

//                   <div className="p-5">
//                     <div className="flex items-start justify-between gap-3">
//                       <div>
//                         <div className="text-base font-bold text-gray-900">
//                           {g.name}
//                         </div>

//                         <div className="mt-1 space-y-1 text-sm text-gray-600">
//                           <div>📍 {g.location || g.area || "Location not available"}</div>
//                           {g.phone && <div>📞 {g.phone}</div>}
//                         </div>
//                       </div>

//                       <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
//                         Rs {g.pricePerHour}/hr
//                       </div>
//                     </div>

//                     <div className="mt-3 flex flex-wrap gap-2">
//                       {(g.features || []).slice(0, 3).map((t) => (
//                         <span
//                           key={t}
//                           className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700"
//                         >
//                           {t}
//                         </span>
//                       ))}

//                       {(g.features || []).length > 3 && (
//                         <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
//                           +{(g.features || []).length - 3} more
//                         </span>
//                       )}
//                     </div>

//                     <div className="mt-4 flex gap-2">
//                       <Link
//                         to={`/book/${g._id}`}
//                         className="flex-1 rounded-xl bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-green-700"
//                       >
//                         Book
//                       </Link>

//                       <Link
//                         to={`/ground/${g._id}`}
//                         className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
//                       >
//                         Details
//                       </Link>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         <div className="mt-8 text-center text-xs text-gray-500">
//           © 2026 CricBook • Terms • Privacy
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function FindCricsal() {
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      "";

    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  const [loading, setLoading] = useState(true);
  const [grounds, setGrounds] = useState([]);
  const [error, setError] = useState("");

  const [searchInput, setSearchInput] = useState("");
  const [q, setQ] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setQ(searchInput.trim());
    }, 350);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setError("");
      setLoading(true);

      try {
        const res = await fetch(
          `${API_BASE}/api/grounds?q=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        );

        const data = await res.json().catch(() => []);

        if (!res.ok) {
          setGrounds([]);
          setError(data?.message || "Failed to load grounds");
          return;
        }

        setGrounds(Array.isArray(data) ? data : []);
      } catch (e) {
        if (e.name !== "AbortError") {
          setError("Server error loading grounds");
          setGrounds([]);
        }
      } finally {
        setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, [q]);

  const allAreas = useMemo(() => {
    const areaSet = new Set();

    grounds.forEach((g) => {
      const areaValue = (g.area || g.location || "").trim();
      if (areaValue) areaSet.add(areaValue);
    });

    return Array.from(areaSet).sort((a, b) => a.localeCompare(b));
  }, [grounds]);

  const allFeatures = useMemo(() => {
    const featureSet = new Set();

    grounds.forEach((g) => {
      (g.features || []).forEach((feature) => {
        if (feature && String(feature).trim()) {
          featureSet.add(String(feature).trim());
        }
      });
    });

    return Array.from(featureSet).sort((a, b) => a.localeCompare(b));
  }, [grounds]);

  const toggleFeature = (feature) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature]
    );
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setQ("");
    setSelectedArea("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("default");
    setAvailableOnly(false);
    setSelectedFeatures([]);
  };

  const filteredGrounds = useMemo(() => {
    let result = [...grounds];

    result = result.filter((g) => {
      const name = String(g.name || "").toLowerCase();
      const area = String(g.area || "").toLowerCase();
      const location = String(g.location || "").toLowerCase();
      const phone = String(g.phone || "").toLowerCase();
      const features = (g.features || []).map((f) => String(f).toLowerCase());
      const price = Number(g.pricePerHour || 0);
      const search = q.toLowerCase();

      const matchesSearch =
        !search ||
        name.includes(search) ||
        area.includes(search) ||
        location.includes(search) ||
        phone.includes(search) ||
        features.some((feature) => feature.includes(search));

      const matchesArea =
        !selectedArea ||
        area === selectedArea.toLowerCase() ||
        location === selectedArea.toLowerCase();

      const matchesMinPrice =
        minPrice === "" || price >= Number(minPrice);

      const matchesMaxPrice =
        maxPrice === "" || price <= Number(maxPrice);

      const matchesFeatures =
        selectedFeatures.length === 0 ||
        selectedFeatures.every((feature) =>
          features.includes(feature.toLowerCase())
        );

      const matchesAvailable =
        !availableOnly ||
        g.available === true ||
        g.isAvailable === true ||
        g.status === "available";

      return (
        matchesSearch &&
        matchesArea &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesFeatures &&
        matchesAvailable
      );
    });

    result.sort((a, b) => {
      const priceA = Number(a.pricePerHour || 0);
      const priceB = Number(b.pricePerHour || 0);
      const nameA = String(a.name || "");
      const nameB = String(b.name || "");

      switch (sortBy) {
        case "priceLow":
          return priceA - priceB;
        case "priceHigh":
          return priceB - priceA;
        case "nameAsc":
          return nameA.localeCompare(nameB);
        case "nameDesc":
          return nameB.localeCompare(nameA);
        default:
          return 0;
      }
    });

    return result;
  }, [
    grounds,
    q,
    selectedArea,
    minPrice,
    maxPrice,
    selectedFeatures,
    availableOnly,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-6xl">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  🏏 Find Cricsal
                </div>

                <h1 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                  Choose a ground
                </h1>

                <p className="mt-1 text-sm text-gray-600">
                  Grounds added by owners will show here automatically.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  to="/home"
                  className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                >
                  ← Home
                </Link>

                <Link
                  to="/bookings"
                  className="rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  My Bookings
                </Link>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by name, area, features..."
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 xl:col-span-2"
              />

              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              >
                <option value="">All Areas</option>
                {allAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              >
                <option value="default">Sort: Default</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
                <option value="nameAsc">Name: A to Z</option>
                <option value="nameDesc">Name: Z to A</option>
              </select>
            </div>

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min price"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max price"
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />

              <label className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={availableOnly}
                  onChange={(e) => setAvailableOnly(e.target.checked)}
                  className="h-4 w-4"
                />
                Available Only
              </label>

              <button
                type="button"
                onClick={clearAllFilters}
                className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
              >
                Clear All Filters
              </button>
            </div>

            {allFeatures.length > 0 && (
              <div>
                <div className="mb-2 text-sm font-semibold text-gray-800">
                  Filter by features
                </div>

                <div className="flex flex-wrap gap-2">
                  {allFeatures.map((feature) => {
                    const active = selectedFeatures.includes(feature);

                    return (
                      <button
                        key={feature}
                        type="button"
                        onClick={() => toggleFeature(feature)}
                        className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                          active
                            ? "border-green-600 bg-green-600 text-white"
                            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {feature}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex items-center rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              {filteredGrounds.length} ground{filteredGrounds.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 animate-pulse rounded-3xl bg-gray-100"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : filteredGrounds.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
                🏟️
              </div>

              <div className="mt-4 text-base font-bold text-gray-900">
                No grounds found
              </div>

              <div className="mt-1 text-sm text-gray-600">
                Try changing filters or search with another keyword.
              </div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredGrounds.map((g) => (
                <div
                  key={g._id}
                  className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="h-40 w-full bg-gray-100">
                    <img
                      src={g.images?.[0] || "https://via.placeholder.com/400x200"}
                      alt={g.name || "ground"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-bold text-gray-900">
                          {g.name}
                        </div>

                        <div className="mt-1 space-y-1 text-sm text-gray-600">
                          <div>📍 {g.location || g.area || "Location not available"}</div>
                          {g.phone && <div>📞 {g.phone}</div>}
                        </div>
                      </div>

                      <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                        Rs {g.pricePerHour}/hr
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {(g.features || []).slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700"
                        >
                          {t}
                        </span>
                      ))}

                      {(g.features || []).length > 3 && (
                        <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
                          +{(g.features || []).length - 3} more
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        to={`/book/${g._id}`}
                        className="flex-1 rounded-xl bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-green-700"
                      >
                        Book
                      </Link>

                      <Link
                        to={`/ground/${g._id}`}
                        className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          © 2026 CricBook • Terms • Privacy
        </div>
      </div>
    </div>
  );
}