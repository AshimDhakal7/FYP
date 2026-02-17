// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import "../styles/UserProfile.css";

// export default function UserProfile() {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     try {
//       const u = JSON.parse(localStorage.getItem("user"));
//       if (u) setUser(u);
//     } catch {
//       setUser(null);
//     }
//   }, []);

//   return (
//     <div className="profile-page">
//       <div className="profile-container">
//         {/* Header */}
//         <div className="profile-header card">
//           <div>
//             <h1>My Profile</h1>
//             <p>Manage your CricBook account information</p>
//           </div>

//           <Link to="/home" className="btn-outline">
//             ← Back to Home
//           </Link>
//         </div>

//         {/* Main Grid */}
//         <div className="profile-grid">
//           {/* LEFT */}
//           <div className="profile-left">
//             <div className="card">
//               <h2>Personal Information</h2>

//               <div className="profile-row">
//                 <span>Name</span>
//                 <strong>{user?.name || "Ashim"}</strong>
//               </div>

//               <div className="profile-row">
//                 <span>Email</span>
//                 <strong>{user?.email || "ashimdhakal7899@gmail.com"}</strong>
//               </div>

//               <div className="profile-row">
//                 <span>Contact Number</span>
//                 <strong>{user?.contactnumber || "9841333848"}</strong>
//               </div>

//               <div className="profile-row">
//                 <span>Role</span>
//                 <strong>{user?.role || "user"}</strong>
//               </div>

//               {/* ✅ you don't have /profile/edit route yet, so point to /dashboard for now */}
//               <Link to="/profile/edit" className="btn-primary">
//                 Update Profile
//               </Link>

//             </div>

//             <div className="card">
//               <h2>Account Security</h2>
//               <p>Change your password to keep your account secure.</p>

//               {/* ✅ you don't have /reset-password route (only /reset-password/:token)
//                   so send user to forgot-password first */}
//               <Link to="/forgot-password" className="btn-outline">
//                 Change Password
//               </Link>
//             </div>
//           </div>

//           {/* RIGHT */}
//           <div className="profile-right">
//             <div className="card">
//               <h2>Booking Summary</h2>

//               <div className="stat">
//                 <span>Total Bookings</span>
//                 <strong>0</strong>
//               </div>

//               <div className="stat">
//                 <span>Loyalty Points</span>
//                 <strong>0</strong>
//               </div>

//               <div className="stat">
//                 <span>Last Login</span>
//                 <strong>Today</strong>
//               </div>
//             </div>

//             <div className="card">
//               <h2>Quick Actions</h2>

//               {/* ✅ your real route is /find-cricsal */}
//               <Link to="/find-cricsal" className="action-link">🏏 Find Cricsal</Link>
// <Link to="/bookings" className="action-link">📅 My Bookings</Link>
// <Link to="/support" className="action-link">💬 Support</Link>

//             </div>
//           </div>
//         </div>

//         {/* ✅ terms/privacy routes not in App.jsx, so remove links OR point to landing for now */}
//         <footer className="profile-footer">
//           © 2026 CricBook • <Link to="/">Terms</Link> • <Link to="/">Privacy</Link>
//         </footer>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      if (u) setUser(u);
    } catch {
      setUser(null);
    }
  }, []);

  const safeUser = useMemo(() => {
    return {
      name: user?.name || "User",
      email: user?.email || "user@email.com",
      contactnumber: user?.contactnumber || "—",
      role: user?.role || "user",
    };
  }, [user]);

  const firstName = useMemo(() => {
    const raw = safeUser?.name || safeUser?.email || "User";
    return String(raw).split(" ")[0].split("@")[0];
  }, [safeUser]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
                My Account
              </div>

              <h1 className="mt-3 text-2xl font-bold text-gray-900">
                My Profile
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your CricBook account information.
              </p>
            </div>

            <Link
              to="/home"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* LEFT (2 cols) */}
          <div className="space-y-5 lg:col-span-2">
            {/* Personal Info */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Hi {firstName}, here are your account details.
                  </p>
                </div>

                <Link
                  to="/profile/edit"
                  className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 transition"
                >
                  Update Profile
                </Link>
              </div>

              <div className="mt-5 divide-y divide-gray-100 rounded-xl border border-gray-100">
                <Row label="Name" value={safeUser.name} />
                <Row label="Email" value={safeUser.email} />
                <Row label="Contact Number" value={safeUser.contactnumber} />
                <Row label="Role" value={safeUser.role} />
              </div>
            </div>

            {/* Security */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <h2 className="text-lg font-semibold text-gray-900">
                Account Security
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Change your password to keep your account secure.
              </p>

              <Link
                to="/forgot-password"
                className="mt-4 inline-flex rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
              >
                Change Password
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-5">
            {/* Booking Summary */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <h2 className="text-lg font-semibold text-gray-900">
                Booking Summary
              </h2>

              <div className="mt-4 space-y-3">
                <Stat label="Total Bookings" value="0" />
                <Stat label="Loyalty Points" value="0" />
                <Stat label="Last Login" value="Today" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <h2 className="text-lg font-semibold text-gray-900">
                Quick Actions
              </h2>

              <div className="mt-4 space-y-2">
                <ActionLink to="/find-cricsal" text="🏏 Find Cricsal" />
                <ActionLink to="/bookings" text="📅 My Bookings" />
                <ActionLink to="/support" text="💬 Support" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 text-center text-xs text-gray-500">
          © 2026 CricBook •{" "}
          <Link className="font-semibold hover:underline" to="/">
            Terms
          </Link>{" "}
          •{" "}
          <Link className="font-semibold hover:underline" to="/">
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="text-sm text-gray-600">{label}</div>
      <div className="text-sm font-semibold text-gray-900 text-right">
        {value}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 ring-1 ring-black/5">
      <div className="text-sm text-gray-700">{label}</div>
      <div className="text-sm font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function ActionLink({ to, text }) {
  return (
    <Link
      to={to}
      className="block rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
    >
      {text}
    </Link>
  );
}
