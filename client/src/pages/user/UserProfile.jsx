
// import React, { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";

// export default function UserProfile() {
//   const [user, setUser] = useState(null);

//   const loadUserFromStorage = () => {
//     try {
//       const u = JSON.parse(localStorage.getItem("user"));
//       setUser(u || null);
//     } catch {
//       setUser(null);
//     }
//   };

//   useEffect(() => {
//     loadUserFromStorage();

//     const handleFocus = () => loadUserFromStorage();
//     const handleVisibilityChange = () => {
//       if (document.visibilityState === "visible") {
//         loadUserFromStorage();
//       }
//     };

//     window.addEventListener("focus", handleFocus);
//     document.addEventListener("visibilitychange", handleVisibilityChange);

//     return () => {
//       window.removeEventListener("focus", handleFocus);
//       document.removeEventListener("visibilitychange", handleVisibilityChange);
//     };
//   }, []);

//   const safeUser = useMemo(() => {
//     return {
//       name: user?.name || "User",
//       email: user?.email || "user@email.com",
//       contact: user?.contactnumber || user?.phone || "—",
//       role: user?.role || "user",
//       profilePicture: user?.profilePicture || "",
//       loyaltyPoints: Number(user?.loyaltyPoints || 0),
//     };
//   }, [user]);

//   const firstName = useMemo(() => {
//     const raw = safeUser?.name || safeUser?.email || "User";
//     return String(raw).split(" ")[0].split("@")[0];
//   }, [safeUser]);

//   const initials = useMemo(() => {
//     const raw = String(safeUser?.name || safeUser?.email || "User").trim();
//     const parts = raw.split(" ").filter(Boolean);
//     const a = parts[0]?.[0] || raw[0] || "U";
//     const b = parts[1]?.[0] || "";
//     return (a + b).toUpperCase();
//   }, [safeUser]);

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8">
//       <div className="mx-auto w-full max-w-6xl">
//         <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
//           <div>
//             <p className="text-xs font-semibold text-green-700">MY ACCOUNT</p>
//             <h1 className="text-2xl font-extrabold text-gray-900">Profile</h1>
//             <p className="mt-1 text-sm text-gray-600">
//               Manage your account details and bookings.
//             </p>
//           </div>

//           <Link
//             to="/home"
//             className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
//           >
//             ← Back to Home
//           </Link>
//         </div>

//         <div className="grid gap-6 lg:grid-cols-12">
//           <aside className="lg:col-span-4">
//             <div className="rounded-3xl bg-white p-6 shadow-sm">
//               <div className="flex items-center gap-4">
//                 <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-green-100 font-bold text-green-800">
//                   {safeUser.profilePicture ? (
//                     <img
//                       src={
//                         safeUser.profilePicture?.startsWith("http")
//                           ? safeUser.profilePicture
//                           : `http://localhost:5001${safeUser.profilePicture}`
//                       }
//                       alt="Profile"
//                       className="h-full w-full object-cover"
//                     />
//                   ) : (
//                     initials
//                   )}
//                 </div>

//                 <div>
//                   <p className="font-bold text-gray-900">{safeUser.name}</p>
//                   <p className="text-sm text-gray-600">{safeUser.email}</p>
//                   <span className="rounded bg-gray-100 px-2 py-1 text-xs">
//                     {safeUser.role}
//                   </span>
//                 </div>
//               </div>

//               <div className="mt-5 space-y-3">
//                 <Link
//                   to="/profile/edit"
//                   className="block rounded-xl bg-green-700 py-3 text-center font-bold text-white"
//                 >
//                   ✏️ Update Profile
//                 </Link>

//                 <Link to="/bookings" className="block rounded-xl border p-3">
//                   📅 My Bookings
//                 </Link>

//                 <Link to="/find-cricsal" className="block rounded-xl border p-3">
//                   🏏 Find Cricsal
//                 </Link>

//                 <Link to="/support" className="block rounded-xl border p-3">
//                   💬 Support
//                 </Link>
//               </div>

//               <div className="mt-6 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
//                 Keep your contact number updated so owners can reach you.
//               </div>
//             </div>
//           </aside>

//           <section className="space-y-6 lg:col-span-8">
//             <div className="grid gap-4 sm:grid-cols-3">
//               <MiniStat title="Total Bookings" value="0" />
//               <MiniStat title="Loyalty Points" value={safeUser.loyaltyPoints} />
//               <MiniStat title="Last Login" value="Today" />
//             </div>

//             <div className="rounded-3xl bg-white p-6 shadow-sm">
//               <div className="flex justify-between">
//                 <div>
//                   <h2 className="text-lg font-bold">Personal Information</h2>
//                   <p className="text-sm text-gray-600">
//                     Hi {firstName}, here are your details.
//                   </p>
//                 </div>

//                 <Link
//                   to="/profile/edit"
//                   className="rounded-xl bg-black px-4 py-2 text-white"
//                 >
//                   Manage
//                 </Link>
//               </div>

//               <div className="mt-5 grid gap-3 sm:grid-cols-2">
//                 <Info label="Name" value={safeUser.name} />
//                 <Info label="Role" value={safeUser.role} />
//                 <Info label="Email" value={safeUser.email} />
//                 <Info label="Contact" value={safeUser.contact} />
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }

// function MiniStat({ title, value }) {
//   return (
//     <div className="rounded-xl bg-white p-4 shadow-sm">
//       <p className="text-xs text-gray-500">{title}</p>
//       <p className="text-xl font-bold">{value}</p>
//     </div>
//   );
// }

// function Info({ label, value }) {
//   return (
//     <div className="rounded-xl border bg-gray-50 p-3">
//       <p className="text-xs text-gray-500">{label}</p>
//       <p className="font-bold">{value}</p>
//     </div>
//   );
// }


import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function UserProfile() {
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    "";

  const authHeaders = () => {
    const token = getToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const loadUserFromStorage = useCallback(() => {
    try {
      const raw = localStorage.getItem("user");
      const parsed = raw ? JSON.parse(raw) : null;
      setUser(parsed || null);
    } catch {
      setUser(null);
    }
  }, []);

  const loadBookings = useCallback(async () => {
    try {
      setStatsLoading(true);
      const token = getToken();
      if (!token) {
        setBookings([]);
        return;
      }

      const res = await fetch(`${API_BASE}/api/bookings/me`, {
        headers: authHeaders(),
      });

      if (!res.ok) {
        setBookings([]);
        return;
      }

      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.bookings || [];
      setBookings(list);
    } catch (err) {
      console.error("PROFILE BOOKINGS LOAD ERROR:", err);
      setBookings([]);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUserFromStorage();
    loadBookings();
  }, [loadUserFromStorage, loadBookings, location.pathname]);

  useEffect(() => {
    const handleFocus = () => {
      loadUserFromStorage();
      loadBookings();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        loadUserFromStorage();
        loadBookings();
      }
    };

    const handleProfileUpdated = () => {
      loadUserFromStorage();
      loadBookings();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("user-profile-updated", handleProfileUpdated);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("user-profile-updated", handleProfileUpdated);
    };
  }, [loadUserFromStorage, loadBookings]);

  const computedStats = useMemo(() => {
    const totalBookings = bookings.length;

    const earnedFromBookings = bookings.reduce(
      (sum, b) => sum + Number(b?.pointsEarned || 0),
      0
    );

    const paidBookings = bookings.filter((b) => b?.isPaid).length;

    const loyaltyPoints = Math.max(
      Number(user?.loyaltyPoints || 0),
      earnedFromBookings
    );

    return {
      totalBookings,
      paidBookings,
      loyaltyPoints,
    };
  }, [bookings, user]);

  const safeUser = useMemo(() => {
    return {
      name: user?.name || "User",
      email: user?.email || "user@email.com",
      contact: user?.contactnumber || user?.phone || "—",
      role: user?.role || "user",
      profilePicture: user?.profilePicture || "",
      loyaltyPoints: computedStats.loyaltyPoints,
    };
  }, [user, computedStats.loyaltyPoints]);

  const firstName = useMemo(() => {
    const raw = safeUser?.name || safeUser?.email || "User";
    return String(raw).split(" ")[0].split("@")[0];
  }, [safeUser]);

  const initials = useMemo(() => {
    const raw = String(safeUser?.name || safeUser?.email || "User").trim();
    const parts = raw.split(" ").filter(Boolean);
    const a = parts[0]?.[0] || raw[0] || "U";
    const b = parts[1]?.[0] || "";
    return (a + b).toUpperCase();
  }, [safeUser]);

  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "Recently joined";
    const d = new Date(user.createdAt);
    if (Number.isNaN(d.getTime())) return "Recently joined";
    return d.toLocaleDateString();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-100 px-4 py-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-green-700">
              My Account
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-900">
              Profile Overview
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Manage your account details, monitor bookings, and track your CricBook loyalty rewards.
            </p>
          </div>

          <Link
            to="/home"
            className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid gap-6 xl:grid-cols-12">
          <aside className="xl:col-span-4">
            <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(16,24,40,0.08)]">
              <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-7 text-white">
                <div className="flex items-center gap-4">
                  <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-3xl border border-white/20 bg-white/20 text-2xl font-extrabold backdrop-blur">
                    {safeUser.profilePicture ? (
                      <img
                        src={
                          safeUser.profilePicture?.startsWith("http")
                            ? safeUser.profilePicture
                            : `http://localhost:5001${safeUser.profilePicture}`
                        }
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-2xl font-black">{safeUser.name}</p>
                    <p className="mt-1 truncate text-sm text-green-50">{safeUser.email}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                        {safeUser.role}
                      </span>
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                        Member since {memberSince}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid gap-3">
                  <Link
                    to="/profile/edit"
                    className="flex items-center justify-center rounded-2xl bg-green-700 px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-800"
                  >
                    ✏️ Update Profile
                  </Link>

                  <Link
                    to="/bookings"
                    className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-semibold text-gray-800 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                  >
                    📅 My Bookings
                  </Link>

                  <Link
                    to="/find-cricsal"
                    className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-semibold text-gray-800 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                  >
                    🏏 Find Cricsal
                  </Link>

                  <Link
                    to="/support"
                    className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 font-semibold text-gray-800 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
                  >
                    💬 Support
                  </Link>
                </div>

                <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-green-700">
                    Loyalty Status
                  </p>
                  <p className="mt-2 text-3xl font-black text-green-800">
                    {statsLoading ? "..." : safeUser.loyaltyPoints}
                  </p>
                  <p className="mt-1 text-sm text-green-700">
                    Reward points available in your CricBook account.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          <section className="space-y-6 xl:col-span-8">
            <div className="grid gap-4 md:grid-cols-3">
              <PremiumStatCard
                title="Total Bookings"
                value={statsLoading ? "..." : computedStats.totalBookings}
                subtitle="All bookings made"
              />
              <PremiumStatCard
                title="Loyalty Points"
                value={statsLoading ? "..." : safeUser.loyaltyPoints}
                subtitle="Rewards earned"
                accent="green"
              />
              <PremiumStatCard
                title="Paid Bookings"
                value={statsLoading ? "..." : computedStats.paidBookings}
                subtitle="Completed payments"
              />
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(16,24,40,0.08)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-gray-900">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Hi {firstName}, here are your account details and contact information.
                  </p>
                </div>

                <Link
                  to="/profile/edit"
                  className="rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
                >
                  Manage
                </Link>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <PremiumInfoCard label="Full Name" value={safeUser.name} />
                <PremiumInfoCard label="Role" value={safeUser.role} />
                <PremiumInfoCard label="Email Address" value={safeUser.email} />
                <PremiumInfoCard label="Contact Number" value={safeUser.contact} />
              </div>
            </div>

            <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(16,24,40,0.08)]">
              <h3 className="text-xl font-black text-gray-900">Rewards Summary</h3>
              <p className="mt-1 text-sm text-gray-600">
                Your profile now refreshes loyalty points from stored account data and booking activity.
              </p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-amber-700">
                    Earn Logic
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-amber-900">
                    1 point per Rs. 10 paid
                  </p>
                  <p className="mt-1 text-sm text-amber-800">
                    Points are credited after successful payment verification.
                  </p>
                </div>

                <div className="rounded-2xl border border-green-100 bg-green-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-green-700">
                    Current Balance
                  </p>
                  <p className="mt-2 text-lg font-extrabold text-green-900">
                    {statsLoading ? "Loading..." : `${safeUser.loyaltyPoints} points`}
                  </p>
                  <p className="mt-1 text-sm text-green-800">
                    Displayed using the latest available profile and booking data.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function PremiumStatCard({ title, value, subtitle, accent = "default" }) {
  const accentClasses =
    accent === "green"
      ? "border-green-100 bg-green-50"
      : "border-gray-100 bg-white";

  return (
    <div
      className={`rounded-[24px] border p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${accentClasses}`}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
        {title}
      </p>
      <p className="mt-3 text-4xl font-black tracking-tight text-gray-900">
        {value}
      </p>
      <p className="mt-2 text-sm text-gray-600">{subtitle}</p>
    </div>
  );
}

function PremiumInfoCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <p className="mt-2 break-words text-lg font-extrabold text-gray-900">
        {value}
      </p>
    </div>
  );
}