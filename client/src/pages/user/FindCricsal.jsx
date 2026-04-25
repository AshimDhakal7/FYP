// import React, { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// const renderStars = (rating = 0) => {
//   const rounded = Math.round(Number(rating) || 0);

//   return [1, 2, 3, 4, 5].map((star) => (
//     <span
//       key={star}
//       className={`text-sm ${star <= rounded ? "text-yellow-500" : "text-gray-300"}`}
//     >
//       ★
//     </span>
//   ));
// };

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

//   const [reviewsByGround, setReviewsByGround] = useState({});

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

//         const groundsList = Array.isArray(data) ? data : [];
//         setGrounds(groundsList);

//         const reviewEntries = await Promise.all(
//           groundsList.map(async (ground) => {
//             try {
//               const reviewRes = await fetch(
//                 `${API_BASE}/api/reviews/ground/${ground._id}`,
//                 { signal: controller.signal }
//               );

//               const reviewData = await reviewRes.json().catch(() => ({}));

//               if (!reviewRes.ok) {
//                 return [
//                   ground._id,
//                   {
//                     averageRating: Number(ground.averageRating || 0),
//                     numReviews: Number(ground.numReviews || 0),
//                     latestReview: null,
//                   },
//                 ];
//               }

//               return [
//                 ground._id,
//                 {
//                   averageRating: Number(
//                     reviewData?.averageRating ?? ground.averageRating ?? 0
//                   ),
//                   numReviews: Number(
//                     reviewData?.numReviews ?? ground.numReviews ?? 0
//                   ),
//                   latestReview:
//                     Array.isArray(reviewData?.reviews) &&
//                     reviewData.reviews.length > 0
//                       ? reviewData.reviews[0]
//                       : null,
//                 },
//               ];
//             } catch {
//               return [
//                 ground._id,
//                 {
//                   averageRating: Number(ground.averageRating || 0),
//                   numReviews: Number(ground.numReviews || 0),
//                   latestReview: null,
//                 },
//               ];
//             }
//           })
//         );

//         setReviewsByGround(Object.fromEntries(reviewEntries));
//       } catch (e) {
//         if (e.name !== "AbortError") {
//           setError("Server error loading grounds");
//           setGrounds([]);
//           setReviewsByGround({});
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
//       const name = String(g.name || "").toLowerCase();
//       const area = String(g.area || "").toLowerCase();
//       const location = String(g.location || "").toLowerCase();
//       const phone = String(g.phone || "").toLowerCase();
//       const features = (g.features || []).map((f) => String(f).toLowerCase());
//       const price = Number(g.pricePerHour || 0);
//       const search = q.toLowerCase();

//       const matchesSearch =
//         !search ||
//         name.includes(search) ||
//         area.includes(search) ||
//         location.includes(search) ||
//         phone.includes(search) ||
//         features.some((feature) => feature.includes(search));

//       const matchesArea =
//         !selectedArea ||
//         area === selectedArea.toLowerCase() ||
//         location === selectedArea.toLowerCase();

//       const matchesMinPrice = minPrice === "" || price >= Number(minPrice);

//       const matchesMaxPrice = maxPrice === "" || price <= Number(maxPrice);

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
//         matchesSearch &&
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

//       const ratingA = Number(
//         reviewsByGround[a._id]?.averageRating ?? a.averageRating ?? 0
//       );
//       const ratingB = Number(
//         reviewsByGround[b._id]?.averageRating ?? b.averageRating ?? 0
//       );

//       switch (sortBy) {
//         case "priceLow":
//           return priceA - priceB;
//         case "priceHigh":
//           return priceB - priceA;
//         case "nameAsc":
//           return nameA.localeCompare(nameB);
//         case "nameDesc":
//           return nameB.localeCompare(nameA);
//         case "ratingHigh":
//           return ratingB - ratingA;
//         default:
//           return 0;
//       }
//     });

//     return result;
//   }, [
//     grounds,
//     q,
//     selectedArea,
//     minPrice,
//     maxPrice,
//     selectedFeatures,
//     availableOnly,
//     sortBy,
//     reviewsByGround,
//   ]);

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-10">
//       <div className="mx-auto w-full max-w-6xl">
//         <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
//           <div className="flex flex-col gap-6">
//             <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
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

//               <div className="flex flex-wrap gap-2">
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

//             <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
//               <input
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//                 placeholder="Search by name, area, features..."
//                 className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100 xl:col-span-2"
//               />

//               <select
//                 value={selectedArea}
//                 onChange={(e) => setSelectedArea(e.target.value)}
//                 className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
//               >
//                 <option value="">All Areas</option>
//                 {allAreas.map((area) => (
//                   <option key={area} value={area}>
//                     {area}
//                   </option>
//                 ))}
//               </select>

//               <select
//                 value={sortBy}
//                 onChange={(e) => setSortBy(e.target.value)}
//                 className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
//               >
//                 <option value="default">Sort: Default</option>
//                 <option value="priceLow">Price: Low to High</option>
//                 <option value="priceHigh">Price: High to Low</option>
//                 <option value="nameAsc">Name: A to Z</option>
//                 <option value="nameDesc">Name: Z to A</option>
//                 <option value="ratingHigh">Rating: High to Low</option>
//               </select>
//             </div>

//             <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
//               <input
//                 type="number"
//                 min="0"
//                 value={minPrice}
//                 onChange={(e) => setMinPrice(e.target.value)}
//                 placeholder="Min price"
//                 className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
//               />

//               <input
//                 type="number"
//                 min="0"
//                 value={maxPrice}
//                 onChange={(e) => setMaxPrice(e.target.value)}
//                 placeholder="Max price"
//                 className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
//               />

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

//             <div className="flex items-center rounded-2xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
//               {filteredGrounds.length} ground{filteredGrounds.length !== 1 ? "s" : ""} found
//             </div>
//           </div>
//         </div>

//         <div className="mt-6">
//           {loading ? (
//             <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {Array.from({ length: 6 }).map((_, i) => (
//                 <div
//                   key={i}
//                   className="h-72 animate-pulse rounded-3xl bg-gray-100"
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
//               {filteredGrounds.map((g) => {
//                 const reviewMeta = reviewsByGround[g._id] || {
//                   averageRating: Number(g.averageRating || 0),
//                   numReviews: Number(g.numReviews || 0),
//                   latestReview: null,
//                 };

//                 return (
//                   <div
//                     key={g._id}
//                     className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
//                   >
//                     <div className="h-40 w-full bg-gray-100">
//                       <img
//                         src={
//                           g.images?.[0] ||
//                           g.imageUrl ||
//                           g.image ||
//                           "https://via.placeholder.com/400x200"
//                         }
//                         alt={g.name || "ground"}
//                         className="h-full w-full object-cover"
//                       />
//                     </div>

//                     <div className="p-5">
//                       <div className="flex items-start justify-between gap-3">
//                         <div>
//                           <div className="text-base font-bold text-gray-900">
//                             {g.name}
//                           </div>

//                           <div className="mt-1 space-y-1 text-sm text-gray-600">
//                             <div>📍 {g.location || g.area || "Location not available"}</div>
//                             {g.phone && <div>📞 {g.phone}</div>}
//                           </div>
//                         </div>

//                         <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
//                           Rs {g.pricePerHour}/hr
//                         </div>
//                       </div>

//                       <div className="mt-4 rounded-2xl border border-yellow-100 bg-yellow-50 p-3">
//                         <div className="flex items-center justify-between gap-3">
//                           <div className="flex items-center gap-1">
//                             {renderStars(reviewMeta.averageRating)}
//                           </div>

//                           <div className="text-sm font-bold text-gray-900">
//                             {Number(reviewMeta.averageRating || 0).toFixed(1)}
//                           </div>
//                         </div>

//                         <div className="mt-1 text-xs font-medium text-gray-600">
//                           {reviewMeta.numReviews || 0} review
//                           {Number(reviewMeta.numReviews || 0) === 1 ? "" : "s"}
//                         </div>

//                         {reviewMeta.latestReview?.comment && (
//                           <p className="mt-2 line-clamp-2 text-xs text-gray-700">
//                             "{reviewMeta.latestReview.comment}"
//                           </p>
//                         )}
//                       </div>

//                       <div className="mt-3 flex flex-wrap gap-2">
//                         {(g.features || []).slice(0, 3).map((t) => (
//                           <span
//                             key={t}
//                             className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700"
//                           >
//                             {t}
//                           </span>
//                         ))}

//                         {(g.features || []).length > 3 && (
//                           <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
//                             +{(g.features || []).length - 3} more
//                           </span>
//                         )}
//                       </div>

//                       <div className="mt-4 flex gap-2">
//                         <Link
//                           to={`/book/${g._id}`}
//                           className="flex-1 rounded-xl bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-green-700"
//                         >
//                           Book
//                         </Link>

//                         <Link
//                           to={`/ground/${g._id}`}
//                           className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
//                         >
//                           Details
//                         </Link>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
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
import { showError, showSuccess } from "../../utils/toast";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

const renderStars = (rating = 0) => {
  const rounded = Math.round(Number(rating) || 0);

  return [1, 2, 3, 4, 5].map((star) => (
    <span
      key={star}
      className={`text-sm ${
        star <= rounded ? "text-amber-500" : "text-slate-300"
      }`}
    >
      ★
    </span>
  ));
};

export default function FindCricsal() {
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      "";

    if (!token) {
      showError("Please login to find and book grounds");
      navigate("/login", { replace: true });
    }
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

  const [reviewsByGround, setReviewsByGround] = useState({});

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
          setReviewsByGround({});
          setError(data?.message || "Failed to load grounds");
          showError(data?.message || "Failed to load grounds");
          return;
        }

        const groundsList = Array.isArray(data) ? data : [];
        setGrounds(groundsList);

        const reviewEntries = await Promise.all(
          groundsList.map(async (ground) => {
            try {
              const reviewRes = await fetch(
                `${API_BASE}/api/reviews/ground/${ground._id}`,
                { signal: controller.signal }
              );

              const reviewData = await reviewRes.json().catch(() => ({}));

              if (!reviewRes.ok) {
                return [
                  ground._id,
                  {
                    averageRating: Number(ground.averageRating || 0),
                    numReviews: Number(ground.numReviews || 0),
                    latestReview: null,
                  },
                ];
              }

              return [
                ground._id,
                {
                  averageRating: Number(
                    reviewData?.averageRating ?? ground.averageRating ?? 0
                  ),
                  numReviews: Number(
                    reviewData?.numReviews ?? ground.numReviews ?? 0
                  ),
                  latestReview:
                    Array.isArray(reviewData?.reviews) &&
                    reviewData.reviews.length > 0
                      ? reviewData.reviews[0]
                      : null,
                },
              ];
            } catch {
              return [
                ground._id,
                {
                  averageRating: Number(ground.averageRating || 0),
                  numReviews: Number(ground.numReviews || 0),
                  latestReview: null,
                },
              ];
            }
          })
        );

        setReviewsByGround(Object.fromEntries(reviewEntries));
      } catch (e) {
        if (e.name !== "AbortError") {
          setError("Server error loading grounds");
          setGrounds([]);
          setReviewsByGround({});
          showError("Server error loading grounds");
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
    setSelectedFeatures((prev) => {
      const next = prev.includes(feature)
        ? prev.filter((f) => f !== feature)
        : [...prev, feature];

      if (next.includes(feature) && !prev.includes(feature)) {
        showSuccess(`${feature} filter applied`);
      }

      return next;
    });
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
    showSuccess("Filters cleared");
  };

  const handleMinPriceChange = (value) => {
    if (value === "" || Number(value) >= 0) {
      setMinPrice(value);
      return;
    }

    showError("Minimum price cannot be negative");
  };

  const handleMaxPriceChange = (value) => {
    if (value === "" || Number(value) >= 0) {
      setMaxPrice(value);
      return;
    }

    showError("Maximum price cannot be negative");
  };

  useEffect(() => {
    if (
      minPrice !== "" &&
      maxPrice !== "" &&
      Number(minPrice) > Number(maxPrice)
    ) {
      showError("Minimum price cannot be greater than maximum price");
    }
  }, [minPrice, maxPrice]);

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

      const matchesMinPrice = minPrice === "" || price >= Number(minPrice);
      const matchesMaxPrice = maxPrice === "" || price <= Number(maxPrice);

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

      const ratingA = Number(
        reviewsByGround[a._id]?.averageRating ?? a.averageRating ?? 0
      );
      const ratingB = Number(
        reviewsByGround[b._id]?.averageRating ?? b.averageRating ?? 0
      );

      switch (sortBy) {
        case "priceLow":
          return priceA - priceB;
        case "priceHigh":
          return priceB - priceA;
        case "nameAsc":
          return nameA.localeCompare(nameB);
        case "nameDesc":
          return nameB.localeCompare(nameA);
        case "ratingHigh":
          return ratingB - ratingA;
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
    reviewsByGround,
  ]);

  const activeFilterCount = [
    q,
    selectedArea,
    minPrice,
    maxPrice,
    availableOnly,
    selectedFeatures.length > 0,
    sortBy !== "default",
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-slate-100 px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-4 py-5 sm:px-6 lg:px-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-green-700">
                  Find Cricsal
                </p>

                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
                  Choose a Ground
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Search, filter, compare, and book available cricket grounds
                  added by owners.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:items-center">
                <Link
                  to="/home"
                  className="inline-flex items-center justify-center rounded-2xl border border-green-200 bg-white px-5 py-3 text-sm font-semibold text-green-700 shadow-sm transition hover:border-green-300 hover:bg-green-50"
                >
                  ← Back to Home
                </Link>

                <Link
                  to="/bookings"
                  className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                >
                  My Bookings
                </Link>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-7">
            <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Search & Filters
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Use optional filters to narrow down available grounds.
                  </p>
                </div>

                <div className="w-fit rounded-full border border-green-200 bg-white px-4 py-2 text-xs font-semibold text-green-700">
                  {activeFilterCount} active filter
                  {activeFilterCount === 1 ? "" : "s"}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <FormField
                  label="Search"
                  helper="Optional"
                  className="sm:col-span-2"
                >
                  <input
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search by name, area, phone, or features"
                    className="field-input"
                  />
                </FormField>

                <FormField label="Area" helper="Optional">
                  <select
                    value={selectedArea}
                    onChange={(e) => {
                      setSelectedArea(e.target.value);
                      if (e.target.value) showSuccess("Area filter applied");
                    }}
                    className="field-input"
                  >
                    <option value="">All Areas</option>
                    {allAreas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Sort By" helper="Optional">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="field-input"
                  >
                    <option value="default">Default</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="nameAsc">Name: A to Z</option>
                    <option value="nameDesc">Name: Z to A</option>
                    <option value="ratingHigh">Rating: High to Low</option>
                  </select>
                </FormField>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <FormField label="Minimum Price" helper="Optional">
                  <input
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => handleMinPriceChange(e.target.value)}
                    placeholder="Min price"
                    className="field-input"
                  />
                </FormField>

                <FormField label="Maximum Price" helper="Optional">
                  <input
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => handleMaxPriceChange(e.target.value)}
                    placeholder="Max price"
                    className="field-input"
                  />
                </FormField>

                <div className="flex flex-col justify-end">
                  <label className="flex min-h-[48px] cursor-pointer items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={availableOnly}
                      onChange={(e) => {
                        setAvailableOnly(e.target.checked);
                        showSuccess(
                          e.target.checked
                            ? "Available only filter enabled"
                            : "Available only filter disabled"
                        );
                      }}
                      className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                    />
                    Available Only
                  </label>
                </div>

                <div className="flex flex-col justify-end">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="min-h-[48px] rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>

              {allFeatures.length > 0 && (
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-800">
                      Features
                    </p>

                    {selectedFeatures.length > 0 && (
                      <p className="text-xs font-medium text-slate-500">
                        {selectedFeatures.length} selected
                      </p>
                    )}
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
                              ? "border-green-500 bg-green-600 text-white"
                              : "border-slate-300 bg-white text-slate-700 hover:border-green-300 hover:bg-green-50"
                          }`}
                        >
                          {feature}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>

            <div className="mt-5 flex flex-col gap-3 rounded-xl border border-green-100 bg-green-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-semibold text-green-700">
                {filteredGrounds.length} ground
                {filteredGrounds.length !== 1 ? "s" : ""} found
              </p>

              <p className="text-xs font-medium text-green-700">
                Prices and availability may vary by owner approval.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          {loading ? (
            <GroundSkeletonGrid />
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
              {error}
            </div>
          ) : filteredGrounds.length === 0 ? (
            <EmptyState clearAllFilters={clearAllFilters} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredGrounds.map((g) => {
                const reviewMeta = reviewsByGround[g._id] || {
                  averageRating: Number(g.averageRating || 0),
                  numReviews: Number(g.numReviews || 0),
                  latestReview: null,
                };

                return (
                  <GroundCard
                    key={g._id}
                    ground={g}
                    reviewMeta={reviewMeta}
                  />
                );
              })}
            </div>
          )}
        </div>

        <footer className="mt-8 border-t border-slate-200 py-6 text-center text-xs text-slate-500">
          © 2026 CricBook. All rights reserved.
        </footer>
      </div>

      <style>{`
        .field-input {
          width: 100%;
          min-height: 48px;
          border-radius: 0.75rem;
          border: 1px solid rgb(203 213 225);
          background: white;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: rgb(15 23 42);
          outline: none;
          transition: all 150ms ease;
        }

        .field-input::placeholder {
          color: rgb(148 163 184);
        }

        .field-input:focus {
          border-color: rgb(34 197 94);
          box-shadow: 0 0 0 4px rgb(220 252 231);
        }

        @media (max-width: 480px) {
          .field-input {
            min-height: 46px;
            font-size: 0.8125rem;
          }
        }
      `}</style>
    </div>
  );
}

function FormField({ label, helper, required = false, className = "", children }) {
  return (
    <div className={className}>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="block text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>

        {helper && (
          <span className="text-xs font-medium text-slate-500">{helper}</span>
        )}
      </div>

      {children}
    </div>
  );
}

function GroundSkeletonGrid() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="h-44 animate-pulse bg-slate-200 sm:h-48" />
          <div className="space-y-4 p-5">
            <div className="h-5 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
            <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ clearAllFilters }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm sm:p-10">
      <p className="text-lg font-bold text-slate-950">No grounds found</p>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Try changing your search keyword, price range, area, or selected
        features.
      </p>

      <button
        type="button"
        onClick={clearAllFilters}
        className="mt-5 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
      >
        Clear Filters
      </button>
    </div>
  );
}

function GroundCard({ ground, reviewMeta }) {
  const imageSrc =
    ground.images?.[0] ||
    ground.imageUrl ||
    ground.image ||
    "https://via.placeholder.com/600x360?text=Cricsal+Ground";

  const averageRating = Number(reviewMeta.averageRating || 0);
  const totalReviews = Number(reviewMeta.numReviews || 0);
  const price = Number(ground.pricePerHour || 0);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative h-44 w-full bg-slate-100 sm:h-48">
        <img
          src={imageSrc}
          alt={ground.name || "Ground"}
          className="h-full w-full object-cover"
        />

        <div className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-slate-900 shadow-sm">
          Rs {price || "-"} / hr
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate text-base font-bold text-slate-950">
              {ground.name || "Unnamed Ground"}
            </h3>

            <p className="mt-1 line-clamp-1 text-sm text-slate-500">
              {ground.location || ground.area || "Location not available"}
            </p>

            {ground.phone && (
              <p className="mt-1 text-sm text-slate-500">{ground.phone}</p>
            )}
          </div>

          <AvailabilityBadge ground={ground} />
        </div>

        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1">
              {renderStars(averageRating)}
            </div>

            <div className="text-sm font-bold text-slate-950">
              {averageRating.toFixed(1)}
            </div>
          </div>

          <div className="mt-1 text-xs font-medium text-slate-500">
            {totalReviews} review{totalReviews === 1 ? "" : "s"}
          </div>

          {reviewMeta.latestReview?.comment && (
            <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-600">
              “{reviewMeta.latestReview.comment}”
            </p>
          )}
        </div>

        {(ground.features || []).length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {(ground.features || []).slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
              >
                {feature}
              </span>
            ))}

            {(ground.features || []).length > 3 && (
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                +{(ground.features || []).length - 3} more
              </span>
            )}
          </div>
        )}

        <div className="mt-5 grid grid-cols-1 gap-3 xs:grid-cols-2 sm:grid-cols-2">
          <Link
            to={`/book/${ground._id}`}
            className="rounded-xl bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Book
          </Link>

          <Link
            to={`/ground/${ground._id}`}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-center text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}

function AvailabilityBadge({ ground }) {
  const available =
    ground.available === true ||
    ground.isAvailable === true ||
    ground.status === "available";

  if (available) {
    return (
      <span className="shrink-0 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
        Available
      </span>
    );
  }

  return (
    <span className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-500">
      Check
    </span>
  );
}