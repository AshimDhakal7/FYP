
// import React, { useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";

// // ✅ Stadium image (Landing.jsx is in src/pages/user/)
// import stadiumImg from "../../assets/images/stadium.jpg";

// // ✅ Map (Leaflet)
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";

// // ✅ Fix marker icons in Vite
// import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
// import markerIcon from "leaflet/dist/images/marker-icon.png";
// import markerShadow from "leaflet/dist/images/marker-shadow.png";
// import cricketIconImg from "../../assets/images/cricket-marker.png";
// const cricketIcon = new L.Icon({
//   iconUrl: cricketIconImg,
//   iconSize: [42, 42],
//   iconAnchor: [21, 42],
//   popupAnchor: [0, -40],
// });

// const selectedIcon = new L.Icon({
//   iconUrl: cricketIconImg,
//   iconSize: [55, 55],   // bigger when selected
//   iconAnchor: [27, 55],
//   popupAnchor: [0, -50],
// });

// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// export default function Landing() {
//   const navigate = useNavigate();

//   const [location, setLocation] = useState("");
//   const [date, setDate] = useState("");
//   const [timeSlot, setTimeSlot] = useState("");
//   const [hours, setHours] = useState("1");

//   const featured = useMemo(
//     () => [
//       {
//         name: "Great Himalaya Cricket Academy",
//         city: "Hattiban, Lalitpur",
//         price: "NPR 1,500/hr",
//         rating: "4.8",
//         reviews: "120",
//       },
//       {
//         name: "Velocity Arena",
//         city: "Battisputali, Kathmandu",
//         price: "NPR 1,800/hr",
//         rating: "4.7",
//         reviews: "98",
//       },
//     ],
//     []
//   );

//   const onSearch = (e) => {
//     e.preventDefault();
//     // Later: navigate to /venues with query params
//     // For now: go to login (or your search results page)
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* HERO */}
//       <section
//         className="relative py-28 bg-cover bg-center bg-fixed"
//         style={{ backgroundImage: `url(${stadiumImg})` }}
//       >
//         {/* overlay */}
//         <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-800/70 to-green-950/90" />

//         {/* subtle blobs */}
//         <div className="absolute inset-0 opacity-20">
//           <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/40 blur-3xl" />
//           <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
//         </div>

//         <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 sm:py-16 text-white">
//           <div className="w-full max-w-6xl">
//             <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">
//               Book Indoor Cricket in Seconds
//             </h1>

//             <p className="text-xl md:text-2xl text-green-100 drop-shadow-md">
//               Find nearby cricsals, compare availability, and confirm instantly — no calls, no
//               waiting.
//             </p>

//             {/* SEARCH CARD */}
//             <form
//               onSubmit={onSearch}
//               className="mt-8 w-full max-w-6xl rounded-2xl bg-white/95 p-6 shadow-2xl ring-1 ring-black/5 backdrop-blur-md"
//             >
//               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
//                 {/* Location */}
//                 <div className="lg:col-span-2">
//                   <label className="block text-xs font-semibold text-gray-700">Location</label>
//                   <input
//                     value={location}
//                     onChange={(e) => setLocation(e.target.value)}
//                     placeholder="Kathmandu, Lalitpur..."
//                     className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//                   />
//                 </div>

//                 {/* Date */}
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700">Date</label>
//                   <input
//                     value={date}
//                     onChange={(e) => setDate(e.target.value)}
//                     type="date"
//                     className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//                   />
//                 </div>

//                 {/* Time */}
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700">Time</label>
//                   <select
//                     value={timeSlot}
//                     onChange={(e) => setTimeSlot(e.target.value)}
//                     className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//                   >
//                     <option value="">Select</option>
//                     <option value="06:00">06:00</option>
//                     <option value="08:00">08:00</option>
//                     <option value="10:00">10:00</option>
//                     <option value="12:00">12:00</option>
//                     <option value="14:00">14:00</option>
//                     <option value="16:00">16:00</option>
//                     <option value="18:00">18:00</option>
//                     <option value="20:00">20:00</option>
//                   </select>
//                 </div>

//                 {/* Hours */}
//                 <div>
//                   <label className="block text-xs font-semibold text-gray-700">Hours</label>
//                   <select
//                     value={hours}
//                     onChange={(e) => setHours(e.target.value)}
//                     className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//                   >
//                     <option value="1">1 hr</option>
//                     <option value="2">2 hrs</option>
//                     <option value="3">3 hrs</option>
//                   </select>
//                 </div>

//                 {/* Search Button */}
//                 <div className="flex items-end">
//                   <button
//                     type="submit"
//                     className="w-full rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-800 active:scale-[0.98] transition"
//                   >
//                     Search
//                   </button>
//                 </div>
//               </div>

//               {/* Badges + Actions */}
//               <div className="mt-5 flex flex-wrap items-center gap-2">
//                 <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
//                   Instant confirmation
//                 </span>
//                 <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
//                   Verified venues
//                 </span>
//                 <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
//                   Easy reschedule
//                 </span>

//                 <div className="ml-auto flex gap-3">
//                   <button
//                     type="button"
//                     onClick={() => navigate("/login")}
//                     className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
//                   >
//                     Book Now
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => navigate("/signup")}
//                     className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 transition"
//                   >
//                     Create Account
//                   </button>
//                 </div>
//               </div>
//             </form>

//             {/* TRUST STATS */}
//             <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
//               <Stat title="15+" desc="Courts listed" />
//               <Stat title="0" desc="Bookings" />
//               <Stat title="4.5★" desc="Avg rating" />
//               <Stat title="24/7" desc="Availability" />
//             </div>

//             {/* MAP */}
//             <div className="mt-10">
//               <div className="mb-2 flex items-end justify-between">
//                 <h3 className="text-lg font-semibold text-white drop-shadow">
//                   Nearby Venues Map
//                 </h3>
//                 <span className="text-xs text-green-100/90">(Map loaded)</span>
//               </div>

//               <LandingMap />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* FEATURES */}
//       <section className="mx-auto max-w-6xl px-4 py-12">
//         <h2 className="text-xl font-semibold text-gray-900">Why CricBook</h2>
//         <p className="mt-2 max-w-2xl text-sm text-gray-600">
//           Everything you need to find, compare, and book indoor cricket — fast.
//         </p>

//         <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           <Feature
//             title="Quick bookings"
//             desc="Book your favourite court in under a minute with real-time availability."
//           />
//           <Feature
//             title="Nearby venues"
//             desc="Discover the best cricsals around you and compare prices & ratings."
//           />
//           <Feature
//             title="Reminders & history"
//             desc="Track bookings, get reminders, and manage reschedules easily."
//           />
//           <Feature
//             title="For ground owners"
//             desc="Manage schedules, pricing, and bookings from one dashboard."
//           />
//           <Feature
//             title="Verified listings"
//             desc="Quality venues with clear details, photos, and reviews."
//           />
//           <Feature
//             title="Secure access"
//             desc="Login safely and manage your account with confidence."
//           />
//         </div>
//       </section>

//       {/* FEATURED VENUES */}
//       <section className="mx-auto max-w-6xl px-4 pb-12">
//         <div className="flex items-end justify-between gap-3">
//           <div>
//             <h2 className="text-xl font-semibold text-gray-900">Featured Cricsals</h2>
//             <p className="mt-2 text-sm text-gray-600">
//               Popular courts people book the most.
//             </p>
//           </div>
//           <button
//             onClick={() => navigate("/login")}
//             className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
//           >
//             View all
//           </button>
//         </div>

//         <div className="mt-6 grid gap-4 sm:grid-cols-2">
//           {featured.map((v) => (
//             <div
//               key={v.name}
//               className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
//             >
//               <div className="h-40 bg-green-100" />
//               <div className="p-4">
//                 <div className="flex items-start justify-between gap-4">
//                   <div>
//                     <h3 className="text-base font-semibold text-gray-900">{v.name}</h3>
//                     <p className="mt-1 text-sm text-gray-600">{v.city}</p>
//                   </div>
//                   <div className="text-right">
//                     <div className="text-sm font-semibold text-gray-900">{v.price}</div>
//                     <div className="mt-1 text-xs text-gray-600">
//                       {v.rating} ({v.reviews})
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-4 flex items-center gap-2">
//                   <button
//                     onClick={() => navigate("/login")}
//                     className="flex-1 rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 transition"
//                   >
//                     Check availability
//                   </button>
//                   <button
//                     onClick={() => navigate("/login")}
//                     className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
//                   >
//                     Details
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* HOW IT WORKS */}
//       <section className="bg-white">
//         <div className="mx-auto max-w-6xl px-4 py-12">
//           <h2 className="text-xl font-semibold text-gray-900">How it works</h2>
//           <div className="mt-6 grid gap-4 sm:grid-cols-3">
//             <Step num="1" title="Search" desc="Choose location, date, time and hours." />
//             <Step num="2" title="Compare" desc="See price, ratings, and availability instantly." />
//             <Step num="3" title="Book" desc="Confirm your slot and get reminders." />
//           </div>
//         </div>
//       </section>

//       {/* TESTIMONIALS */}
//       <section className="mx-auto max-w-6xl px-4 py-12">
//         <h2 className="text-xl font-semibold text-gray-900">What players say</h2>
//         <div className="mt-6 grid gap-4 sm:grid-cols-3">
//           <Testimonial
//             name="Aashish"
//             text="Booked a court in 30 seconds. No calling, no waiting. Love it."
//           />
//           <Testimonial
//             name="Sanjana"
//             text="Found a venue near me with good ratings. The reminders are super helpful."
//           />
//           <Testimonial
//             name="Rohan"
//             text="As a ground owner, the schedule management is a lifesaver."
//           />
//         </div>
//       </section>

//       {/* FAQ */}
//       <section className="bg-white">
//         <div className="mx-auto max-w-6xl px-4 py-12">
//           <h2 className="text-xl font-semibold text-gray-900">FAQ</h2>
//           <div className="mt-6 grid gap-4 sm:grid-cols-2">
//             <Faq
//               q="Do I need to create an account?"
//               a="Yes, to book and manage your slots you’ll need an account."
//             />
//             <Faq
//               q="Can I reschedule a booking?"
//               a="Yes. You can reschedule based on the venue’s policy and availability."
//             />
//             <Faq
//               q="Do you verify venues?"
//               a="You can mark venues as verified in admin/owner flow (recommended for trust)."
//             />
//             <Faq
//               q="Is payment online?"
//               a="You can start with pay-at-venue, then add Khalti/eSewa later."
//             />
//           </div>
//         </div>
//       </section>

//       {/* CTA */}
//       <section className="mx-auto max-w-6xl px-4 py-12">
//         <div className="rounded-2xl bg-green-700 px-6 py-10 text-white shadow-sm">
//           <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
//             <div>
//               <h3 className="text-2xl font-bold">Ready to book your next session?</h3>
//               <p className="mt-2 text-green-100">
//                 Create an account and get instant access to availability & booking history.
//               </p>
//             </div>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => navigate("/login")}
//                 className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-green-700 hover:bg-gray-100 transition"
//               >
//                 Book Now
//               </button>
//               <button
//                 onClick={() => navigate("/signup")}
//                 className="rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition"
//               >
//                 Create Account
//               </button>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// /* ---------------- Map Component (same file) ---------------- */

// function LandingMap() {
//   const center = [27.7172, 85.324]; // Kathmandu

//   const [selectedVenue, setSelectedVenue] = useState(null);

//   const venues = [
//     {
//       id: 1,
//       name: "Great Himalaya Cricket Academy",
//       city: "Hattiban, Lalitpur",
//       price: "NPR 1500/hr",
//       position: [27.6406, 85.321],
//     },
//     {
//       id: 2,
//       name: "Velocity Arena",
//       city: "Battisputali, Kathmandu",
//       price: "NPR 1800/hr",
//       position: [27.706, 85.349],
//     },
//   ];

//   return (
//     <div className="w-full h-[360px] rounded-2xl overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg">
//       <MapContainer
//         center={center}
//         zoom={12}
//         scrollWheelZoom={true}
//         className="h-full w-full"
//       >
//         <TileLayer
//           attribution='&copy; OpenStreetMap contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />

//         {venues.map((v) => (
//           <Marker
//             key={v.id}
//             position={v.position}
//             icon={selectedVenue === v.id ? selectedIcon : cricketIcon}
//             eventHandlers={{
//               click: () => setSelectedVenue(v.id),
//             }}
//           >
//             <Popup>
//               <div className="text-sm">
//                 <div className="font-bold text-base">{v.name}</div>
//                 <div className="text-gray-600">{v.city}</div>

//                 <div className="mt-2 font-semibold text-green-700">
//                   {v.price}
//                 </div>

//                 <button
//                   className="mt-3 w-full rounded-lg bg-green-700 px-3 py-2 text-white text-sm hover:bg-green-800"
//                   onClick={() => alert("Later connect to booking page")}
//                 >
//                   Check Availability
//                 </button>
//               </div>
//             </Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// }
// /* ---------- small components (same file, paste-ready) ---------- */

// function Stat({ title, desc }) {
//   return (
//     <div className="rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 p-4 text-white shadow-lg">
//       <div className="text-lg font-bold drop-shadow">{title}</div>
//       <div className="mt-1 text-xs text-green-100/90">{desc}</div>
//     </div>
//   );
// }

// function Feature({ title, desc }) {
//   return (
//     <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
//       <div className="text-sm font-semibold text-gray-900">{title}</div>
//       <div className="mt-2 text-sm text-gray-600">{desc}</div>
//     </div>
//   );
// }

// function Step({ num, title, desc }) {
//   return (
//     <div className="rounded-2xl bg-gray-50 p-5 ring-1 ring-black/5">
//       <div className="flex items-center gap-3">
//         <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-white text-sm font-bold">
//           {num}
//         </div>
//         <div className="text-sm font-semibold text-gray-900">{title}</div>
//       </div>
//       <div className="mt-3 text-sm text-gray-600">{desc}</div>
//     </div>
//   );
// }

// function Testimonial({ name, text }) {
//   return (
//     <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
//       <div className="text-sm text-gray-700">“{text}”</div>
//       <div className="mt-4 text-sm font-semibold text-gray-900">{name}</div>
//       <div className="text-xs text-gray-600">CricBook user</div>
//     </div>
//   );
// }

// function Faq({ q, a }) {
//   return (
//     <div className="rounded-2xl bg-gray-50 p-5 ring-1 ring-black/5">
//       <div className="text-sm font-semibold text-gray-900">{q}</div>
//       <div className="mt-2 text-sm text-gray-600">{a}</div>
//     </div>
//   );
// }




import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// Stadium image
import stadiumImg from "../../assets/images/stadium.jpg";

// Map (Leaflet)
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Fix marker icons in Vite
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import cricketIconImg from "../../assets/images/cricket-marker.png";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

const cricketIcon = new L.Icon({
  iconUrl: cricketIconImg,
  iconSize: [42, 42],
  iconAnchor: [21, 42],
  popupAnchor: [0, -40],
});

const selectedIcon = new L.Icon({
  iconUrl: cricketIconImg,
  iconSize: [55, 55],
  iconAnchor: [27, 55],
  popupAnchor: [0, -50],
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Keep map static, as requested
const STATIC_MAP_VENUES = [
  {
    id: 1,
    name: "Great Himalaya Cricket Academy",
    city: "Hattiban, Lalitpur",
    priceNumber: 1500,
    position: [27.6406, 85.321],
  },
  {
    id: 2,
    name: "Velocity Arena",
    city: "Battisputali, Kathmandu",
    priceNumber: 1800,
    position: [27.706, 85.349],
  },
];

function formatPrice(value) {
  const amount = Number(value ?? 0);
  return `Rs ${amount}/hr`;
}

function normalizeGround(raw, fallbackId) {
  return {
    id: raw?._id ?? raw?.id ?? fallbackId,
    name: raw?.name || raw?.title || "Unnamed Ground",
    city:
      raw?.location ||
      raw?.address ||
      raw?.city ||
      raw?.area ||
      "Unknown location",
    priceNumber: Number(raw?.pricePerHour ?? raw?.price ?? 0),
    image:
      raw?.image ||
      raw?.thumbnail ||
      raw?.coverImage ||
      (Array.isArray(raw?.images) && raw.images.length > 0
        ? raw.images[0]
        : stadiumImg),
  };
}

async function fetchFeaturedGrounds(signal) {
  try {
    const response = await fetch(`${API_BASE}/api/grounds`, { signal });
    const payload = await response.json().catch(() => null);

    if (!response.ok) return [];

    const rawItems = Array.isArray(payload)
      ? payload
      : payload?.grounds || payload?.data || [];

    return rawItems
      .filter(Boolean)
      .map((item, index) => normalizeGround(item, index + 1))
      .filter((item) => item.id && item.name)
      .slice(0, 3);
  } catch (error) {
    if (error.name === "AbortError") throw error;
    console.error("Failed to load grounds:", error);
    return [];
  }
}

export default function Landing() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [hours, setHours] = useState("1");
  const [featured, setFeatured] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const loadFeatured = async () => {
      try {
        setFeaturedLoading(true);
        const data = await fetchFeaturedGrounds(controller.signal);
        setFeatured(Array.isArray(data) ? data : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load featured cricsals:", error);
          setFeatured([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setFeaturedLoading(false);
        }
      }
    };

    loadFeatured();
    return () => controller.abort();
  }, []);

  const stats = useMemo(() => {
    return {
      courtsListed: `${featured.length || 0}+`,
      bookings: "0",
      avgRating: "24/7",
    };
  }, [featured]);

  const onSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (date) params.set("date", date);
    if (timeSlot) params.set("time", timeSlot);
    if (hours) params.set("hours", hours);

    navigate(`/venues${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section
        className="relative bg-cover bg-center py-20 sm:py-24 lg:py-28"
        style={{ backgroundImage: `url(${stadiumImg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/80 via-green-800/70 to-green-950/90" />

        <div className="absolute inset-0 opacity-20">
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/40 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-white/30 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl text-white">
            <h1 className="mb-4 text-4xl font-extrabold leading-tight drop-shadow-lg sm:text-5xl lg:text-6xl">
              Book Indoor Cricket in Seconds
            </h1>

            <p className="max-w-3xl text-base text-green-100 drop-shadow-md sm:text-xl lg:text-2xl">
              Find nearby cricsals, compare availability, and confirm instantly
              — no calls, no waiting.
            </p>

            <form
              onSubmit={onSearch}
              className="mt-8 w-full rounded-2xl bg-white/95 p-4 shadow-2xl ring-1 ring-black/5 backdrop-blur-md sm:p-6"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
                <div className="xl:col-span-2">
                  <label
                    htmlFor="location"
                    className="block text-xs font-semibold text-gray-700"
                  >
                    Location
                  </label>
                  <input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Kathmandu, Lalitpur..."
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="date"
                    className="block text-xs font-semibold text-gray-700"
                  >
                    Date
                  </label>
                  <input
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    type="date"
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="time"
                    className="block text-xs font-semibold text-gray-700"
                  >
                    Time
                  </label>
                  <select
                    id="time"
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  >
                    <option value="">Select</option>
                    <option value="06:00">06:00</option>
                    <option value="08:00">08:00</option>
                    <option value="10:00">10:00</option>
                    <option value="12:00">12:00</option>
                    <option value="14:00">14:00</option>
                    <option value="16:00">16:00</option>
                    <option value="18:00">18:00</option>
                    <option value="20:00">20:00</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="hours"
                    className="block text-xs font-semibold text-gray-700"
                  >
                    Hours
                  </label>
                  <select
                    id="hours"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  >
                    <option value="1">1 hr</option>
                    <option value="2">2 hrs</option>
                    <option value="3">3 hrs</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 active:scale-[0.98]"
                  >
                    Search
                  </button>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    Instant confirmation
                  </span>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    Verified venues
                  </span>
                  <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                    Easy reschedule
                  </span>
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:ml-auto">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                  >
                    Book Now
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/signup")}
                    className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
                  >
                    Create Account
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Stat title={stats.courtsListed} desc="Courts listed" />
              <Stat title={stats.bookings} desc="Bookings" />
              <Stat title={stats.avgRating} desc="Availability" />
              <Stat title="Fast" desc="Easy access" />
            </div>

            <div className="mt-10">
              <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <h3 className="text-lg font-semibold text-white drop-shadow">
                  Nearby Venues Map
                </h3>
                <span className="text-xs text-green-100/90">(Map loaded)</span>
              </div>

              <LandingMap venues={STATIC_MAP_VENUES} />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-900">Why CricBook</h2>
        <p className="mt-2 max-w-2xl text-sm text-gray-600">
          Everything you need to find, compare, and book indoor cricket — fast.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            title="Quick bookings"
            desc="Book your favourite court in under a minute with real-time availability."
          />
          <Feature
            title="Nearby venues"
            desc="Discover the best cricsals around you and compare prices."
          />
          <Feature
            title="Reminders & history"
            desc="Track bookings, get reminders, and manage reschedules easily."
          />
          <Feature
            title="For ground owners"
            desc="Manage schedules, pricing, and bookings from one dashboard."
          />
          <Feature
            title="Verified listings"
            desc="Quality venues with clear details and photos."
          />
          <Feature
            title="Secure access"
            desc="Login safely and manage your account with confidence."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Featured Cricsals
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Cricsal
            </p>
          </div>

          <button
            onClick={() => navigate("/grounds")}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
          >
            View all
          </button>
        </div>

        {featuredLoading ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
              >
                <div className="h-40 animate-pulse bg-green-100" />
                <div className="space-y-3 p-4">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100" />
                  <div className="h-10 animate-pulse rounded-xl bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        ) : featured.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((v) => (
              <div
                key={v.id}
                className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5"
              >
                <img
                  src={v.image || stadiumImg}
                  alt={v.name}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = stadiumImg;
                  }}
                />

                <div className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-semibold text-gray-900">
                        {v.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">{v.city}</p>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatPrice(v.priceNumber)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                    <button
                      onClick={() => navigate(`/grounds/${v.id}`)}
                      className="flex-1 rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
                    >
                      Check availability
                    </button>
                    <button
                      onClick={() => navigate(`/grounds/${v.id}`)}
                      className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white p-8 text-center shadow-sm">
            <h3 className="text-base font-semibold text-gray-900">
              No cricsal added yet
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              
            </p>
          </div>
        )}
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-gray-900">How it works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Step
              num="1"
              title="Search"
              desc="Choose location, date, time and hours."
            />
            <Step
              num="2"
              title="Compare"
              desc="See price and availability instantly."
            />
            <Step
              num="3"
              title="Book"
              desc="Confirm your slot and get reminders."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-xl font-semibold text-gray-900">
          What players say
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Testimonial
            name="Aashish"
            text="Booked a court in 30 seconds. No calling, no waiting. Love it."
          />
          <Testimonial
            name="Sanjana"
            text="Found a venue near me very quickly. The reminders are super helpful."
          />
          <Testimonial
            name="Rohan"
            text="As a ground owner, the schedule management is a lifesaver."
          />
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold text-gray-900">FAQ</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Faq
              q="Do I need to create an account?"
              a="Yes, to book and manage your slots you’ll need an account."
            />
            <Faq
              q="Can I reschedule a booking?"
              a="Yes. You can reschedule based on the venue’s policy and availability."
            />
            <Faq
              q="Do you verify venues?"
              a="You can mark venues as verified in admin/owner flow if needed."
            />
            <Faq
              q="Is payment online?"
              a="You can start with pay-at-venue, then add Khalti/eSewa later."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-green-700 px-6 py-10 text-white shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold">
                Ready to book your next session?
              </h3>
              <p className="mt-2 text-green-100">
                Create an account and get instant access to availability &
                booking history.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/grounds")}
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-gray-100"
              >
                Book Now
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="rounded-xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function LandingMap({ venues }) {
  const [selectedVenue, setSelectedVenue] = useState(null);

  const validVenues = useMemo(() => {
    if (!Array.isArray(venues) || !venues.length) return [];
    return venues.filter(
      (v) => Array.isArray(v.position) && v.position.length === 2
    );
  }, [venues]);

  const center = useMemo(() => {
    const first = validVenues[0]?.position;
    return first || [27.7172, 85.324];
  }, [validVenues]);

  return (
    <div className="h-[320px] w-full overflow-hidden rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur-lg sm:h-[360px]">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {validVenues.map((v) => (
          <Marker
            key={v.id}
            position={v.position}
            icon={selectedVenue === v.id ? selectedIcon : cricketIcon}
            eventHandlers={{
              click: () => setSelectedVenue(v.id),
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="text-base font-bold">{v.name}</div>
                <div className="text-gray-600">{v.city}</div>
                <div className="mt-2 font-semibold text-green-700">
                  {formatPrice(v.priceNumber)}
                </div>

                <button
                  type="button"
                  className="mt-3 w-full rounded-lg bg-green-700 px-3 py-2 text-sm text-white hover:bg-green-800"
                  onClick={() => {
                    window.location.href = "/login";
                  }}
                >
                  Check Availability
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

function Stat({ title, desc }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-4 text-white shadow-lg backdrop-blur-lg">
      <div className="text-lg font-bold drop-shadow">{title}</div>
      <div className="mt-1 text-xs text-green-100/90">{desc}</div>
    </div>
  );
}

function Feature({ title, desc }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <div className="mt-2 text-sm text-gray-600">{desc}</div>
    </div>
  );
}

function Step({ num, title, desc }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-5 ring-1 ring-black/5">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-sm font-bold text-white">
          {num}
        </div>
        <div className="text-sm font-semibold text-gray-900">{title}</div>
      </div>
      <div className="mt-3 text-sm text-gray-600">{desc}</div>
    </div>
  );
}

function Testimonial({ name, text }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="text-sm text-gray-700">“{text}”</div>
      <div className="mt-4 text-sm font-semibold text-gray-900">{name}</div>
      <div className="text-xs text-gray-600">CricBook user</div>
    </div>
  );
}

function Faq({ q, a }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-5 ring-1 ring-black/5">
      <div className="text-sm font-semibold text-gray-900">{q}</div>
      <div className="mt-2 text-sm text-gray-600">{a}</div>
    </div>
  );
}