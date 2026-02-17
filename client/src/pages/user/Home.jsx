// // client/src/pages/Home.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../styles/home.css";
// import "../components/Navbar"

// export default function Home() {
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";
//   const [loadingBookings, setLoadingBookings] = useState(true);

//   // Get user from localStorage
//   const user = useMemo(() => {
//     try {
//       return JSON.parse(localStorage.getItem("user") || "null");
//     } catch {
//       return null;
//     }
//   }, []);
  

//   // If not logged in -> go landing/login
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) navigate("/login", { replace: true });
//   }, [navigate]);
  

//   // ===== Demo placeholders (replace with API later) =====
//   const [search, setSearch] = useState("");
//   const [upcomingBookings] = useState([]); // replace with API results
//   const [favorites] = useState([
//     { id: "g1", name: "Green Turf Cricsal", area: "Kathmandu", price: 1200 },
//     { id: "g2", name: "Royal Indoor Arena", area: "Lalitpur", price: 1500 },
//   ]);
//   const [notifications] = useState([
//     { id: "n1", text: "Welcome to CricBook 🎉 Your account is ready.", type: "info" },
//   ]);

//   const loyaltyPoints = 0; // replace with user.points or API
//   const totalBookings = upcomingBookings.length;
//   const lastLogin = "Today";

//   const firstName = (user?.name || "User").split(" ")[0];

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/", { replace: true }); // landing page
//   };

//   const filteredFavorites = favorites.filter((g) =>
//     (g.name + " " + g.area).toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div className="home-page">
//       {/* ===== Header (Logout only here) ===== */}
//       <header className="home-topbar">
//         <div className="home-brand">
//           <div className="home-logo">CB</div>
//           <div className="home-brand-text">
//             <div className="home-brand-title">CricBook</div>
//             <div className="home-brand-sub">User Dashboard</div>
//           </div>
//         </div>

//         <nav className="home-nav">
//           <Link to="/home" className="home-nav-link">Home</Link>
//           <Link to="/find-cricsal" className="home-nav-link">Find Cricsal</Link>
//           <Link to="/bookings" className="home-nav-link">My Bookings</Link>
//           <Link to="/profile" className="home-nav-link">Profile</Link>
//         </nav>

//         <button className="home-btn-outline" onClick={handleLogout}>
//           Logout
//         </button>
//       </header>

//       {/* ===== Main ===== */}
//       <main className="home-wrap">
//         {/* ===== Left column ===== */}
//         <section className="home-col">
//           {/* Welcome / Hero Card (NO logout here) */}
//           <div className="card card-hero">
//             <div className="hero-left">
//               <h2 className="hero-title">Welcome back, {firstName} 👋</h2>
//               <p className="muted hero-sub">
//                 Quickly find cricsals, book slots, and manage your bookings from one place.
//               </p>

//               <div className="hero-actions">
//                 <Link className="home-btn" to="/find-cricsal">Find Cricsal</Link>
//                 <Link className="home-btn-ghost" to="/bookings">My Bookings</Link>
//               </div>

//               <div className="hero-meta">
//                 <div className="hero-meta-item">
//                   <span className="meta-label">Email</span>
//                   <span className="meta-value">{user?.email || "—"}</span>
//                 </div>
//                 <div className="hero-meta-item">
//                   <span className="meta-label">Role</span>
//                   <span className="meta-value">{user?.role || "user"}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="hero-right">
//               <div className="mini-stat">
//                 <span className="mini-stat-label">Total bookings</span>
//                 <b className="mini-stat-value">{totalBookings}</b>
//               </div>
//               <div className="mini-stat">
//                 <span className="mini-stat-label">Loyalty points</span>
//                 <b className="mini-stat-value">{loyaltyPoints}</b>
//               </div>
//               <div className="mini-stat">
//                 <span className="mini-stat-label">Last login</span>
//                 <b className="mini-stat-value">{lastLogin}</b>
//               </div>
//             </div>
//           </div>

//           {/* Search & Quick book */}
//           <div className="card">
//             <div className="card-head">
//               <h3>Find & Book</h3>
//               <p className="muted">Search by name, area, or features.</p>
//             </div>

//             <div className="search-row">
//               <input
//                 className="input"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search cricsals… (e.g. turf, Kathmandu, indoor)"
//               />
//               <Link className="home-btn" to="/find-cricsal">
//                 Search
//               </Link>
//             </div>

//             <div className="quick-actions">
//               <Link className="chip" to="/find-cricsal">🏏 Book a Slot</Link>
//               <Link className="chip" to="/bookings">📅 View Bookings</Link>
//               <Link className="chip" to="/profile">👤 Update Profile</Link>
//               <Link className="chip" to="/support">💬 Support</Link>
//             </div>
//           </div>

//           {/* Upcoming bookings */}
//           <div className="card">
//             <div className="card-head">
//               <h3>Upcoming Bookings</h3>
//               <p className="muted">Your next bookings appear here.</p>
//             </div>

//             {upcomingBookings.length === 0 ? (
//               <div className="empty">
//                 <div className="empty-box">
//                   <p className="empty-title">No bookings yet</p>
//                   <p className="muted">
//                     Book your first slot in under a minute.
//                   </p>
//                 </div>
//                 <Link className="home-btn" to="/find-cricsal">
//                   Book a Cricsal
//                 </Link>
//               </div>
//             ) : (
//               <div className="list">
//                 {upcomingBookings.map((b) => (
//                   <div key={b._id} className="list-item">
//                     <div>
//                       <div className="list-title">{b.groundName}</div>
//                       <div className="muted">
//                         {b.date} • {b.time} • {b.area}
//                       </div>
//                     </div>
//                     <div className="list-actions">
//                       <button className="mini-btn">View</button>
//                       <button className="mini-btn">Reschedule</button>
//                       <button className="mini-btn danger">Cancel</button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Recent activity */}
//           <div className="card">
//             <div className="card-head">
//               <h3>Recent Activity</h3>
//               <p className="muted">Payments, cancellations, reminders.</p>
//             </div>

//             <div className="empty-box">
//               <p className="muted">Nothing new.</p>
//             </div>
//           </div>
//         </section>

//         {/* ===== Right column ===== */}
//         <aside className="home-aside">
//           {/* Notifications */}
//           <div className="card">
//             <div className="card-head">
//               <h3>Notifications</h3>
//               <p className="muted">Important updates.</p>
//             </div>

//             {notifications.length === 0 ? (
//               <div className="empty-box">
//                 <p className="muted">No notifications.</p>
//               </div>
//             ) : (
//               <div className="notif-list">
//                 {notifications.map((n) => (
//                   <div key={n.id} className={`notif notif-${n.type || "info"}`}>
//                     {n.text}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Favorites / Saved cricsals */}
//           <div className="card">
//             <div className="card-head">
//               <h3>Saved Cricsals</h3>
//               <p className="muted">Your favorites for quick booking.</p>
//             </div>

//             {filteredFavorites.length === 0 ? (
//               <div className="empty-box">
//                 <p className="muted">No saved grounds found.</p>
//               </div>
//             ) : (
//               <div className="fav-grid">
//                 {filteredFavorites.slice(0, 4).map((g) => (
//                   <div key={g.id} className="fav-card">
//                     <div className="fav-title">{g.name}</div>
//                     <div className="muted">{g.area}</div>
//                     <div className="fav-price">From Rs. {g.price}</div>
//                     <Link className="mini-link" to="/find-cricsal">
//                       Book now →
//                     </Link>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Help / FAQ */}
//           <div className="card">
//             <div className="card-head">
//               <h3>Help</h3>
//               <p className="muted">Common questions.</p>
//             </div>

//             <div className="faq">
//               <details>
//                 <summary>How do I book a slot?</summary>
//                 <p className="muted">
//                   Go to <b>Find Cricsal</b>, select a ground, choose date/time, and confirm.
//                 </p>
//               </details>

//               <details>
//                 <summary>Can I cancel or reschedule?</summary>
//                 <p className="muted">
//                   Yes—open <b>My Bookings</b> and choose cancel/reschedule (policy may apply).
//                 </p>
//               </details>

//               <details>
//                 <summary>Where do I see my booking history?</summary>
//                 <p className="muted">
//                   Go to <b>My Bookings</b> to view upcoming and past bookings.
//                 </p>
//               </details>
//             </div>

//             <div className="support-links">
//               <Link to="/support" className="mini-link">Contact Support →</Link>
//             </div>
//           </div>
//         </aside>
//       </main>

//       <footer className="home-footer">
//         <span className="muted">© {new Date().getFullYear()} CricBook</span>
//         <span className="muted">•</span>
//         <Link className="mini-link" to="/terms">Terms</Link>
//         <span className="muted">•</span>
//         <Link className="mini-link" to="/privacy">Privacy</Link>
//       </footer>
//     </div>
//   );
// }

import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  // Later: replace with API
  const upcomingBookings = []; // keep your array
  const featured = [
    {
      id: "1",
      name: "KTM Indoor Arena",
      location: "Bhaktapur",
      price: "Rs 1,500/hr",
      tags: ["Indoor", "Parking", "Lights"],
    },
    {
      id: "2",
      name: "Green Turf Center",
      location: "Lalitpur",
      price: "Rs 1,200/hr",
      tags: ["Indoor", "Beginner Friendly"],
    },
    {
      id: "3",
      name: "Pro Cricsal Hub",
      location: "Kathmandu",
      price: "Rs 1,800/hr",
      tags: ["Premium", "Shower", "Cafe"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Top hero */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                ⚡ Book in seconds
              </div>

              <h1 className="mt-3 text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Find and book your next cricsal
              </h1>

              <p className="mt-2 max-w-xl text-sm text-gray-600">
                Search nearby indoor cricket venues, pick a slot, and get instant
                confirmation.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Link
                to="/find-cricsal"
                className="rounded-full bg-green-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition"
              >
                Find Cricsal
              </Link>
              <Link
                to="/bookings"
                className="rounded-full border border-gray-200 bg-white px-6 py-3 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
              >
                My Bookings
              </Link>
            </div>
          </div>

          {/* search-like bar (UI only) */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              📍 Location
              <div className="mt-1 font-semibold text-gray-900">
                Near me (soon)
              </div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              🗓 Date
              <div className="mt-1 font-semibold text-gray-900">Choose (soon)</div>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              ⏰ Time
              <div className="mt-1 font-semibold text-gray-900">Select (soon)</div>
            </div>
          </div>
        </div>

        {/* Upcoming booking (small + friendly) */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Your next booking
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Quick access to your upcoming session.
                  </p>
                </div>
                <Link
                  to="/bookings"
                  className="text-sm font-semibold text-green-700 hover:underline"
                >
                  View all
                </Link>
              </div>

              <div className="mt-5">
                {upcomingBookings.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-700">
                      📅
                    </div>
                    <h3 className="mt-4 text-base font-bold text-gray-900">
                      No bookings yet
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Let’s book your first cricsal — it’s super easy.
                    </p>
                    <div className="mt-4">
                      <Link
                        to="/find-cricsal"
                        className="inline-flex rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
                      >
                        Book now
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingBookings.slice(0, 1).map((b) => (
                      <div
                        key={b.id}
                        className="flex flex-col gap-3 rounded-2xl border border-gray-200 p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <div className="text-sm font-semibold text-gray-900">
                            {b.venue}
                          </div>
                          <div className="mt-1 text-sm text-gray-600">
                            {b.date} • {b.time} • {b.hours} hour(s)
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            to={`/book/${b.cricsalId}`}
                            className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
                          >
                            Details
                          </Link>
                          <button className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                            Cancel
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Featured cricsals */}
            <div className="mt-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-end justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Featured cricsals
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Popular venues users love right now.
                  </p>
                </div>
                <Link
                  to="/find-cricsal"
                  className="text-sm font-semibold text-green-700 hover:underline"
                >
                  See more
                </Link>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {featured.map((f) => (
                  <div
                    key={f.id}
                    className="rounded-2xl border border-gray-200 p-5 hover:shadow-sm transition bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-base font-bold text-gray-900">
                          {f.name}
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          📍 {f.location}
                        </div>
                      </div>
                      <div className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                        {f.price}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {f.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        to="/find-cricsal"
                        className="flex-1 rounded-xl bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-green-700"
                      >
                        Book
                      </Link>
                      <Link
                        to="/find-cricsal"
                        className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* User shortcuts */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">
                Shortcuts
              </h3>
              <div className="mt-4 space-y-2">
                <Link
                  to="/profile"
                  className="block rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  My profile
                </Link>
                <Link
                  to="/bookings"
                  className="block rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
                >
                  My bookings
                </Link>
                <Link
                  to="/find-cricsal"
                  className="block rounded-xl bg-green-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-green-700"
                >
                  Find cricsals
                </Link>
              </div>
            </div>

            {/* Offers / tips */}
            <div className="rounded-3xl bg-gradient-to-br from-green-900 via-green-800 to-green-700 p-6 text-white shadow-sm">
              <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
                🎁 Tips & offers
              </div>
              <h3 className="mt-3 text-base font-bold">
                Get better slots
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-green-100">
                <li>✓ Book early for weekends</li>
                <li>✓ Try off-peak hours for discounts</li>
                <li>✓ Save your favorite venues</li>
              </ul>
              <div className="mt-4 text-xs text-green-200">
                CricBook • Indoor cricket booking platform
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
