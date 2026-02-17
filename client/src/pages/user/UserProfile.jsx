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

  const initials = useMemo(() => {
    const raw = String(safeUser?.name || safeUser?.email || "User").trim();
    const parts = raw.split(" ").filter(Boolean);
    const a = parts[0]?.[0] || raw[0] || "U";
    const b = parts[1]?.[0] || "";
    return (a + b).toUpperCase();
  }, [safeUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Top line (NO NAVBAR) */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-green-700">MY ACCOUNT</p>
            <h1 className="text-2xl font-extrabold text-gray-900">Profile</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your account details and bookings.
            </p>
          </div>

          <Link
            to="/home"
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
          >
            ← Back to Home
          </Link>
        </div>

        {/* New Layout: Sidebar + Content */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-green-100 text-green-800 text-lg font-extrabold ring-1 ring-green-200">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-extrabold text-gray-900">
                    {safeUser.name}
                  </p>
                  <p className="truncate text-sm text-gray-600">{safeUser.email}</p>
                  <p className="mt-1 inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
                    {safeUser.role}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <Link
                  to="/profile/edit"
                  className="rounded-2xl bg-green-700 px-4 py-3 text-sm font-bold text-white hover:bg-green-800 transition text-center"
                >
                  ✏️ Update Profile
                </Link>

                <Link
                  to="/bookings"
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition flex items-center justify-between"
                >
                  <span>📅 My Bookings</span>
                  <span className="text-gray-400">›</span>
                </Link>

                <Link
                  to="/find-cricsal"
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition flex items-center justify-between"
                >
                  <span>🏏 Find Cricsal</span>
                  <span className="text-gray-400">›</span>
                </Link>

                <Link
                  to="/support"
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition flex items-center justify-between"
                >
                  <span>💬 Support</span>
                  <span className="text-gray-400">›</span>
                </Link>
              </div>

              <div className="mt-6 rounded-2xl bg-gray-50 p-4 ring-1 ring-black/5">
                <p className="text-xs font-semibold text-gray-700">Tip</p>
                <p className="mt-1 text-sm text-gray-600">
                  Keep your contact number updated so ground owners can reach you quickly.
                </p>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <section className="lg:col-span-8 space-y-6">
            {/* Stats row */}
            <div className="grid gap-4 sm:grid-cols-3">
              <MiniStat title="Total Bookings" value="0" icon="✅" />
              <MiniStat title="Loyalty Points" value="0" icon="⭐" />
              <MiniStat title="Last Login" value="Today" icon="⏱️" />
            </div>

            {/* Personal Info Card */}
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Hi <span className="font-semibold">{firstName}</span>, here are your details.
                  </p>
                </div>

                <Link
                  to="/profile/edit"
                  className="rounded-2xl bg-gray-900 px-4 py-2.5 text-sm font-bold text-white hover:bg-black transition"
                >
                  Manage
                </Link>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <InfoPill label="Name" value={safeUser.name} />
                <InfoPill label="Role" value={safeUser.role} />
                <InfoPill label="Email" value={safeUser.email} />
                <InfoPill label="Contact" value={safeUser.contactnumber} />
              </div>
            </div>

            {/* Security + Actions */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <h2 className="text-lg font-extrabold text-gray-900">
                  Account Security
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Change your password to keep your account secure.
                </p>

                <Link
                  to="/forgot-password"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold text-gray-900 hover:bg-gray-50 transition"
                >
                  🔒 Change Password
                </Link>

                <div className="mt-4 text-xs text-gray-500">
                  Use a strong password (8+ chars, mix letters & numbers).
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
                <h2 className="text-lg font-extrabold text-gray-900">
                  Shortcuts
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  Quick access to frequently used pages.
                </p>

                <div className="mt-5 grid gap-3">
                  <Shortcut to="/find-cricsal" title="Find Grounds" desc="Search nearby cricsals" />
                  <Shortcut to="/bookings" title="Bookings" desc="View your bookings history" />
                  <Shortcut to="/support" title="Support" desc="Get help & report issues" />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-2 text-center text-xs text-gray-500">
              © 2026 CricBook •{" "}
              <Link className="font-semibold hover:underline" to="/">
                Terms
              </Link>{" "}
              •{" "}
              <Link className="font-semibold hover:underline" to="/">
                Privacy
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ---------- UI Components (UI only) ---------- */

function MiniStat({ title, value, icon }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-600">{title}</p>
          <p className="mt-1 text-xl font-extrabold text-gray-900">{value}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gray-50 ring-1 ring-black/5">
          <span className="text-lg">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function InfoPill({ label, value }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="text-xs font-semibold text-gray-600">{label}</p>
      <p className="mt-1 text-sm font-bold text-gray-900 break-all">{value}</p>
    </div>
  );
}

function Shortcut({ to, title, desc }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-gray-200 bg-white p-4 hover:bg-gray-50 transition"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-extrabold text-gray-900">{title}</p>
          <p className="mt-1 text-xs text-gray-600">{desc}</p>
        </div>
        <span className="text-gray-400">›</span>
      </div>
    </Link>
  );
}
