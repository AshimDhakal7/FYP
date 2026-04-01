
// import React, { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";

// const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// const toDateObj = (yyyyMMdd) => {
//   if (!yyyyMMdd) return null;
//   return new Date(`${yyyyMMdd}T00:00:00`);
// };

// const formatNiceDate = (yyyyMMdd) => {
//   if (!yyyyMMdd) return "";
//   const d = new Date(`${yyyyMMdd}T00:00:00`);
//   return d.toLocaleDateString(undefined, {
//     weekday: "short",
//     month: "short",
//     day: "numeric",
//     year: "numeric",
//   });
// };

// export default function Home() {
//   const [loadingBookings, setLoadingBookings] = useState(true);
//   const [upcomingBookings, setUpcomingBookings] = useState([]);
//   const [bookingErr, setBookingErr] = useState("");

//   const token = useMemo(() => {
//     return (
//       localStorage.getItem("token") ||
//       localStorage.getItem("accessToken") ||
//       localStorage.getItem("authToken") ||
//       localStorage.getItem("userToken") ||
//       ""
//     );
//   }, []);

//   useEffect(() => {
//     const loadBookings = async () => {
//       setBookingErr("");
//       setLoadingBookings(true);

//       try {
//         if (!token) {
//           setUpcomingBookings([]);
//           return;
//         }

//         // try both endpoints (use whichever exists)
//         const endpoints = [`${API_BASE}/api/bookings/me`, `${API_BASE}/api/bookings/my`];
//         let list = null;

//         for (const url of endpoints) {
//           const res = await fetch(url, {
//             headers: { Authorization: `Bearer ${token}` },
//           });

//           const data = await res.json().catch(() => null);
//           if (res.ok) {
//             list = Array.isArray(data) ? data : data?.bookings || [];
//             break;
//           }
//         }

//         if (!list) {
//           setUpcomingBookings([]);
//           setBookingErr("Could not load bookings (API route mismatch).");
//           return;
//         }

//         const today = new Date();
//         today.setHours(0, 0, 0, 0);

//         // ✅ get next 2 upcoming confirmed bookings
//         const upcomingConfirmed = list
//           .filter((b) => String(b?.status || "").toLowerCase() === "confirmed")
//           .map((b) => ({ ...b, _dateObj: toDateObj(b?.date) }))
//           .filter((b) => b._dateObj && b._dateObj >= today)
//           .sort((a, b) => {
//             // sort by date first, then by startTime
//             const d = a._dateObj - b._dateObj;
//             if (d !== 0) return d;
//             return String(a.startTime || "").localeCompare(String(b.startTime || ""));
//           })
//           .slice(0, 2)
//           .map((b) => ({
//             id: b._id,
//             cricsalId: b.cricsal,
//             venue: `Cricsal Booking (${b.cricsal})`,
//             date: formatNiceDate(b.date),
//             time: `${b.startTime} - ${b.endTime}`,
//             hours: b.durationHours,
//             _raw: b,
//           }));

//         setUpcomingBookings(upcomingConfirmed);
//       } catch (e) {
//         setUpcomingBookings([]);
//         setBookingErr("Could not load bookings.");
//       } finally {
//         setLoadingBookings(false);
//       }
//     };

//     loadBookings();
//   }, [token]);

//   const featured = [
//     {
//       id: "1",
//       name: "KTM Indoor Arena",
//       location: "Bhaktapur",
//       price: "Rs 1,500/hr",
//       tags: ["Indoor", "Parking", "Lights"],
//     },
//     {
//       id: "2",
//       name: "Green Turf Center",
//       location: "Lalitpur",
//       price: "Rs 1,200/hr",
//       tags: ["Indoor", "Beginner Friendly"],
//     },
//     {
//       id: "3",
//       name: "Pro Cricsal Hub",
//       location: "Kathmandu",
//       price: "Rs 1,800/hr",
//       tags: ["Premium", "Shower", "Cafe"],
//     },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
//         {/* Top hero */}
//         <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
//           <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
//                 ⚡ Book in seconds
//               </div>

//               <h1 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl">
//                 Find and book your next cricsal
//               </h1>

//               <p className="mt-2 max-w-xl text-sm text-gray-600">
//                 Search nearby indoor cricket venues, pick a slot, and get instant
//                 confirmation.
//               </p>
//             </div>

//             <div className="flex flex-col gap-2 sm:flex-row">
//               <Link
//                 to="/find-cricsal"
//                 className="rounded-full bg-green-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition"
//               >
//                 Find Cricsal
//               </Link>
//               <Link
//                 to="/bookings"
//                 className="rounded-full border border-gray-200 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
//               >
//                 My Bookings
//               </Link>
//             </div>
//           </div>

//           {/* search-like bar (UI only) */}
//           <div className="mt-6 grid gap-3 sm:grid-cols-3">
//             <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
//               📍 Location
//               <div className="mt-1 font-semibold text-gray-900">
//                 Near me (soon)
//               </div>
//             </div>
//             <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
//               🗓 Date
//               <div className="mt-1 font-semibold text-gray-900">Choose (soon)</div>
//             </div>
//             <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
//               ⏰ Time
//               <div className="mt-1 font-semibold text-gray-900">Select (soon)</div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-8 grid gap-6 lg:grid-cols-3">
//           <div className="lg:col-span-2">
//             {/* Upcoming booking */}
//             <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <h2 className="text-lg font-bold text-gray-900">
//                     Your next booking
//                   </h2>
//                   <p className="mt-1 text-sm text-gray-600">
//                     Quick access to your upcoming session.
//                   </p>
//                 </div>
//                 <Link
//                   to="/bookings"
//                   className="text-sm font-semibold text-green-700 hover:underline"
//                 >
//                   View all
//                 </Link>
//               </div>

//               <div className="mt-5">
//                 {loadingBookings ? (
//                   <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
//                     <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-gray-200" />
//                     <div className="mt-4 h-5 animate-pulse rounded bg-gray-200" />
//                     <div className="mt-2 h-4 animate-pulse rounded bg-gray-100" />
//                     <div className="mt-4 text-sm text-gray-500">
//                       Loading bookings...
//                     </div>
//                   </div>
//                 ) : bookingErr ? (
//                   <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
//                     {bookingErr}
//                   </div>
//                 ) : upcomingBookings.length === 0 ? (
//                   <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
//                     <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
//                       📅
//                     </div>
//                     <h3 className="mt-4 text-base font-bold text-gray-900">
//                       No bookings yet
//                     </h3>
//                     <p className="mt-1 text-sm text-gray-600">
//                       Let’s book your first cricsal — it’s super easy.
//                     </p>
//                     <div className="mt-4">
//                       <Link
//                         to="/find-cricsal"
//                         className="inline-flex rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
//                       >
//                         Book now
//                       </Link>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     {upcomingBookings.map((b) => (
//                       <div
//                         key={b.id}
//                         className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between"
//                       >
//                         <div>
//                           <div className="text-sm font-semibold text-gray-900">
//                             {b.venue}
//                           </div>
//                           <div className="mt-1 text-sm text-gray-600">
//                             {b.date} • {b.time} • {b.hours} hour(s)
//                           </div>
//                         </div>

//                         <div className="flex gap-2">
//                           <Link
//                             to="/bookings"
//                             className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
//                           >
//                             Details
//                           </Link>
//                           <Link
//                             to="/bookings"
//                             className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
//                           >
//                             Cancel
//                           </Link>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Featured cricsals */}
//             <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
//               <div className="flex items-end justify-between">
//                 <div>
//                   <h2 className="text-lg font-bold text-gray-900">
//                     Featured cricsals
//                   </h2>
//                   <p className="mt-1 text-sm text-gray-600">
//                     Popular venues users love right now.
//                   </p>
//                 </div>
//                 <Link
//                   to="/find-cricsal"
//                   className="text-sm font-semibold text-green-700 hover:underline"
//                 >
//                   See more
//                 </Link>
//               </div>

//               <div className="mt-5 grid gap-4 sm:grid-cols-2">
//                 {featured.map((f) => (
//                   <div
//                     key={f.id}
//                     className="rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition bg-white"
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div>
//                         <div className="text-base font-bold text-gray-900">
//                           {f.name}
//                         </div>
//                         <div className="mt-1 text-sm text-gray-600">
//                           📍 {f.location}
//                         </div>
//                       </div>
//                       <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
//                         {f.price}
//                       </div>
//                     </div>

//                     <div className="mt-3 flex flex-wrap gap-2">
//                       {f.tags.map((t) => (
//                         <span
//                           key={t}
//                           className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700"
//                         >
//                           {t}
//                         </span>
//                       ))}
//                     </div>

//                     <div className="mt-4 flex gap-2">
//                       <Link
//                         to="/find-cricsal"
//                         className="flex-1 rounded-xl bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-green-700"
//                       >
//                         Book
//                       </Link>
//                       <Link
//                         to="/find-cricsal"
//                         className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
//                       >
//                         Details
//                       </Link>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Right column */}
//           <div className="space-y-6">
//             <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
//               <h3 className="text-base font-bold text-gray-900">Shortcuts</h3>
//               <div className="mt-4 space-y-2">
//                 <Link
//                   to="/profile"
//                   className="block rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
//                 >
//                   My profile
//                 </Link>
//                 <Link
//                   to="/bookings"
//                   className="block rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
//                 >
//                   My bookings
//                 </Link>
//                 <Link
//                   to="/find-cricsal"
//                   className="block rounded-xl bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-700"
//                 >
//                   Find cricsals
//                 </Link>
//               </div>
//             </div>

//             <div className="rounded-3xl bg-gradient-to-br from-green-900 via-green-800 to-green-700 p-6 text-white shadow-sm">
//               <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
//                 🎁 Tips & offers
//               </div>
//               <h3 className="mt-3 text-base font-bold">Get better slots</h3>
//               <ul className="mt-3 space-y-2 text-sm text-green-100">
//                 <li>✓ Book early for weekends</li>
//                 <li>✓ Try off-peak hours for discounts</li>
//                 <li>✓ Save your favorite venues</li>
//               </ul>
//               <div className="mt-4 text-xs text-green-200">
//                 CricBook • Indoor cricket booking platform
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

const toDateObj = (yyyyMMdd) => {
  if (!yyyyMMdd) return null;
  return new Date(`${yyyyMMdd}T00:00:00`);
};

const formatNiceDate = (yyyyMMdd) => {
  if (!yyyyMMdd) return "";
  const d = new Date(`${yyyyMMdd}T00:00:00`);
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function Home() {
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [bookingErr, setBookingErr] = useState("");

  const [featured, setFeatured] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [featuredErr, setFeaturedErr] = useState("");

  const token = useMemo(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("userToken") ||
      ""
    );
  }, []);

  useEffect(() => {
    const loadBookings = async () => {
      setBookingErr("");
      setLoadingBookings(true);

      try {
        if (!token) {
          setUpcomingBookings([]);
          return;
        }

        const endpoints = [
          `${API_BASE}/api/bookings/me`,
          `${API_BASE}/api/bookings/my`,
        ];

        let list = null;

        for (const url of endpoints) {
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await res.json().catch(() => null);

          if (res.ok) {
            list = Array.isArray(data) ? data : data?.bookings || [];
            break;
          }
        }

        if (!list) {
          setUpcomingBookings([]);
          setBookingErr("Could not load bookings.");
          return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcomingConfirmed = list
          .filter((b) => String(b?.status || "").toLowerCase() === "confirmed")
          .map((b) => ({ ...b, _dateObj: toDateObj(b?.date) }))
          .filter((b) => b._dateObj && b._dateObj >= today)
          .sort((a, b) => {
            const d = a._dateObj - b._dateObj;
            if (d !== 0) return d;
            return String(a.startTime || "").localeCompare(String(b.startTime || ""));
          })
          .slice(0, 2)
          .map((b) => ({
            id: b._id,
            groundId: b.ground || b.cricsal,
            venue:
              b?.groundDetails?.name ||
              b?.cricsalDetails?.name ||
              b?.venue?.name ||
              b?.groundName ||
              b?.cricsalName ||
              "Booked Ground",
            date: formatNiceDate(b.date),
            time: `${b.startTime} - ${b.endTime}`,
            hours: b.durationHours || b.hours || 1,
            _raw: b,
          }));

        setUpcomingBookings(upcomingConfirmed);
      } catch (e) {
        setUpcomingBookings([]);
        setBookingErr("Could not load bookings.");
      } finally {
        setLoadingBookings(false);
      }
    };

    loadBookings();
  }, [token]);

  useEffect(() => {
    const loadFeatured = async () => {
      setLoadingFeatured(true);
      setFeaturedErr("");

      try {
        const res = await fetch(`${API_BASE}/api/grounds`);
        const data = await res.json().catch(() => null);

        if (!res.ok) {
          setFeatured([]);
          setFeaturedErr("Could not load grounds.");
          return;
        }

        const list = Array.isArray(data) ? data : data?.grounds || data?.data || [];

        const normalized = list
          .filter(Boolean)
          .slice(0, 3)
          .map((item) => ({
            id: item._id || item.id,
            name: item.name || item.title || "Unnamed Ground",
            location:
              item.location ||
              item.address ||
              item.city ||
              item.area ||
              "Unknown location",
            price:
              item.pricePerHour != null
                ? `Rs ${item.pricePerHour}/hr`
                : item.price != null
                ? `Rs ${item.price}/hr`
                : "Contact for price",
            rating: item.rating ? String(item.rating) : "4.8",
            image:
              item.image ||
              item.thumbnail ||
              item.coverImage ||
              (Array.isArray(item.images) && item.images.length > 0
                ? item.images[0]
                : null),
            tags:
              item.tags && Array.isArray(item.tags) && item.tags.length > 0
                ? item.tags
                : [
                    item.indoor ? "Indoor" : null,
                    item.parking ? "Parking" : null,
                    item.lights ? "Lights" : null,
                    item.shower ? "Shower" : null,
                    item.cafe ? "Cafe" : null,
                    item.beginnerFriendly ? "Beginner Friendly" : null,
                    item.premium ? "Premium" : null,
                  ].filter(Boolean),
          }));

        setFeatured(normalized);
      } catch (error) {
        setFeatured([]);
        setFeaturedErr("Could not load grounds.");
      } finally {
        setLoadingFeatured(false);
      }
    };

    loadFeatured();
  }, []);

  const stats = [
    { label: "Listed grounds", value: `${featured.length || 0}+` },
    { label: "Quick booking", value: "24/7" },
    { label: "Easy access", value: "Fast" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.10),_transparent_35%),linear-gradient(to_bottom,_#f8fafc,_#f1f5f9)]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/85 shadow-[0_20px_70px_rgba(15,23,42,0.06)] backdrop-blur-xl">
          <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-green-200/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-56 w-56 rounded-full bg-emerald-100/50 blur-3xl" />

          <div className="relative grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.35fr_0.85fr] lg:px-10 lg:py-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-xs font-semibold text-green-700 shadow-sm">
                ⚡ Premium booking experience
              </div>

              <h1 className="mt-5 max-w-2xl text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                Find and book your next{" "}
                <span className="bg-gradient-to-r from-green-700 to-emerald-500 bg-clip-text text-transparent">
                  cricsal
                </span>{" "}
                with ease
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Discover quality indoor cricket grounds, compare availability,
                and secure your slot in a cleaner and more professional booking experience.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="text-xs font-medium text-slate-500">📍 Location</div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Near me
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Find grounds nearby
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="text-xs font-medium text-slate-500">🗓 Date</div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Pick a date
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Flexible scheduling
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <div className="text-xs font-medium text-slate-500">⏰ Time</div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">
                    Select time
                  </div>
                  <div className="mt-1 text-xs text-slate-500">
                    Instant availability
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/find-cricsal"
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-green-200 transition hover:scale-[1.02] hover:shadow-xl"
                >
                  Find Cricsal
                </Link>

                <Link
                  to="/bookings"
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  My Bookings
                </Link>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 via-white to-emerald-50 p-6 shadow-[0_14px_40px_rgba(34,197,94,0.10)]">
                <div className="text-xs uppercase tracking-[0.2em] text-green-700">
                  Booking highlights
                </div>
                <div className="mt-3 text-3xl font-bold text-slate-900">
                  Smooth. Trusted. Modern.
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  A cleaner booking experience with better clarity, faster actions,
                  and a fully brand-consistent interface.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {stats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-green-100 bg-white px-4 py-3 shadow-sm"
                    >
                      <div className="text-lg font-bold text-green-700">{item.value}</div>
                      <div className="text-xs text-slate-500">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] backdrop-blur">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
                    Upcoming session
                  </div>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    Your next booking
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Quick access to your next confirmed session.
                  </p>
                </div>

                <Link
                  to="/bookings"
                  className="text-sm font-semibold text-green-700 hover:text-green-800"
                >
                  View all →
                </Link>
              </div>

              <div className="mt-5">
                {loadingBookings ? (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
                    <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
                    <div className="mt-4 h-20 animate-pulse rounded-2xl bg-slate-100" />
                    <div className="mt-3 h-20 animate-pulse rounded-2xl bg-slate-100" />
                  </div>
                ) : bookingErr ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {bookingErr}
                  </div>
                ) : upcomingBookings.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white p-10 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 text-2xl text-green-700 shadow-sm">
                      📅
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-slate-900">
                      No bookings yet
                    </h3>
                    <p className="mt-2 text-sm text-slate-600">
                      Start with a great ground and reserve your first slot.
                    </p>
                    <div className="mt-5">
                      <Link
                        to="/find-cricsal"
                        className="inline-flex rounded-full bg-gradient-to-r from-green-600 to-emerald-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.02]"
                      >
                        Book now
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((b, index) => (
                      <div
                        key={b.id}
                        className="rounded-3xl border border-slate-200 bg-gradient-to-r from-white to-green-50/40 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="flex items-start gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 text-lg font-bold text-white shadow-md">
                              {index + 1}
                            </div>

                            <div>
                              <div className="text-base font-bold text-slate-900">
                                {b.venue}
                              </div>
                              <div className="mt-1 text-sm text-slate-600">
                                {b.date}
                              </div>
                              <div className="mt-1 text-sm text-slate-600">
                                {b.time} • {b.hours} hour(s)
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Link
                              to="/bookings"
                              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                            >
                              Details
                            </Link>
                            <Link
                              to="/bookings"
                              className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                            >
                              Manage
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] backdrop-blur">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
                    Recommended
                  </div>
                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    Featured cricsals
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Real grounds loaded from your backend.
                  </p>
                </div>

                <Link
                  to="/find-cricsal"
                  className="text-sm font-semibold text-green-700 hover:text-green-800"
                >
                  See more →
                </Link>
              </div>

              <div className="mt-6">
                {loadingFeatured ? (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                      >
                        <div className="h-28 animate-pulse bg-slate-200" />
                        <div className="p-5">
                          <div className="h-5 animate-pulse rounded bg-slate-200" />
                          <div className="mt-3 h-4 animate-pulse rounded bg-slate-100" />
                          <div className="mt-4 h-10 animate-pulse rounded bg-slate-100" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : featuredErr ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {featuredErr}
                  </div>
                ) : featured.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-600">
                    No grounds available right now.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {featured.map((f) => (
                      <div
                        key={f.id}
                        className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                      >
                        {f.image ? (
                          <div className="h-36 overflow-hidden bg-slate-100">
                            <img
                              src={f.image}
                              alt={f.name}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="h-28 bg-gradient-to-br from-green-700 via-emerald-600 to-green-400 p-4 text-white">
                            <div className="flex items-start justify-between">
                              <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                                ★ {f.rating}
                              </div>
                              <div className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                                {f.price}
                              </div>
                            </div>
                          </div>
                        )}

                        <div className={`${f.image ? "p-5" : "-mt-5 rounded-t-3xl bg-white p-5"}`}>
                          {f.image && (
                            <div className="mb-3 flex items-center justify-between">
                              <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                ★ {f.rating}
                              </div>
                              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                {f.price}
                              </div>
                            </div>
                          )}

                          <div className="text-lg font-bold text-slate-900">
                            {f.name}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            📍 {f.location}
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            {(f.tags || []).length > 0 ? (
                              f.tags.map((t) => (
                                <span
                                  key={t}
                                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700"
                                >
                                  {t}
                                </span>
                              ))
                            ) : (
                              <span className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                Available
                              </span>
                            )}
                          </div>

                          <div className="mt-5 flex gap-2">
                            <Link
                              to="/find-cricsal"
                              className="flex-1 rounded-xl bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
                            >
                              Book
                            </Link>
                            <Link
                              to={`/grounds/${f.id}`}
                              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
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
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/70 bg-white/90 p-6 shadow-[0_16px_50px_rgba(15,23,42,0.05)] backdrop-blur">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-green-700">
                Quick access
              </div>
              <h3 className="mt-2 text-xl font-bold text-slate-900">Shortcuts</h3>

              <div className="mt-5 space-y-3">
                <Link
                  to="/profile"
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  <span>My profile</span>
                  <span className="text-slate-400">→</span>
                </Link>

                <Link
                  to="/bookings"
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                >
                  <span>My bookings</span>
                  <span className="text-slate-400">→</span>
                </Link>

                <Link
                  to="/find-cricsal"
                  className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-green-600 to-emerald-500 px-4 py-4 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01]"
                >
                  <span>Find cricsals</span>
                  <span>↗</span>
                </Link>
              </div>
            </div>

            <div className="rounded-[28px] border border-green-100 bg-gradient-to-br from-green-600 via-green-500 to-emerald-500 p-6 text-white shadow-[0_20px_60px_rgba(34,197,94,0.20)]">
              <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                🎁 Tips & offers
              </div>

              <h3 className="mt-4 text-2xl font-bold">Book smarter, play better</h3>
              <p className="mt-3 text-sm leading-6 text-green-50">
                Save more and get better availability with a few simple booking habits.
              </p>

              <div className="mt-6 space-y-3">
                {[
                  "Book early for weekends",
                  "Use off-peak slots for better rates",
                  "Save favorite grounds for faster booking",
                ].map((tip) => (
                  <div
                    key={tip}
                    className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white"
                  >
                    ✓ {tip}
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-white/10 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.15em] text-green-100">
                  CricBook
                </div>
                <div className="mt-1 text-sm font-semibold text-white">
                  Indoor cricket booking platform
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}