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

  // ✅ unified user (fix phone/contact mismatch)
  const safeUser = useMemo(() => {
    return {
      name: user?.name || "User",
      email: user?.email || "user@email.com",
      contact:
        user?.contactnumber ||
        user?.phone ||
        "—",
      role: user?.role || "user",
      profilePicture: user?.profilePicture || "",
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

        {/* HEADER */}
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
            className="rounded-xl border px-4 py-2 text-sm font-semibold hover:bg-gray-50"
          >
            ← Back to Home
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">

          {/* SIDEBAR */}
          <aside className="lg:col-span-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm">

              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl overflow-hidden bg-green-100 flex items-center justify-center text-green-800 font-bold">

                  {safeUser.profilePicture ? (
                    <img
                    src={
                      safeUser.profilePicture?.startsWith("http")
                        ? safeUser.profilePicture
                        : `http://localhost:5001${safeUser.profilePicture}`
                    }
                    />
                  ) : (
                    initials
                  )}

                </div>

                <div>
                  <p className="font-bold text-gray-900">{safeUser.name}</p>
                  <p className="text-sm text-gray-600">{safeUser.email}</p>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {safeUser.role}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <Link
                  to="/profile/edit"
                  className="block bg-green-700 text-white text-center py-3 rounded-xl font-bold"
                >
                  ✏️ Update Profile
                </Link>

                <Link to="/bookings" className="block border p-3 rounded-xl">
                  📅 My Bookings
                </Link>

                <Link to="/find-cricsal" className="block border p-3 rounded-xl">
                  🏏 Find Cricsal
                </Link>

                <Link to="/support" className="block border p-3 rounded-xl">
                  💬 Support
                </Link>
              </div>

              <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-xl">
                Keep your contact number updated so owners can reach you.
              </div>

            </div>
          </aside>

          {/* MAIN */}
          <section className="lg:col-span-8 space-y-6">

            {/* STATS */}
            <div className="grid gap-4 sm:grid-cols-3">
              <MiniStat title="Total Bookings" value="0" />
              <MiniStat title="Loyalty Points" value="0" />
              <MiniStat title="Last Login" value="Today" />
            </div>

            {/* PERSONAL INFO */}
            <div className="bg-white p-6 rounded-3xl shadow-sm">
              <div className="flex justify-between">
                <div>
                  <h2 className="font-bold text-lg">Personal Information</h2>
                  <p className="text-sm text-gray-600">
                    Hi {firstName}, here are your details.
                  </p>
                </div>

                <Link
                  to="/profile/edit"
                  className="bg-black text-white px-4 py-2 rounded-xl"
                >
                  Manage
                </Link>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Info label="Name" value={safeUser.name} />
                <Info label="Role" value={safeUser.role} />
                <Info label="Email" value={safeUser.email} />
                <Info label="Contact" value={safeUser.contact} />
              </div>
            </div>

            {/* FOOTER */}
            <div className="text-center text-xs text-gray-500">
            </div>

          </section>
        </div>
      </div>
    </div>
  );
}

/* UI components */

function MiniStat({ title, value }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm">
      <p className="text-xs text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="border p-3 rounded-xl bg-gray-50">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-bold">{value}</p>
    </div>
  );
}