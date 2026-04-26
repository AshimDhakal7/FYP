import React, { useMemo, useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import NotificationBell from "../../components/NotificationBell";

function SidebarIcon({ children }) {
  return (
    <span className="grid h-9 w-9 place-items-center rounded-2xl bg-white/10 text-base">
      {children}
    </span>
  );
}

function getPageTitle(pathname) {
  if (pathname === "/admin") return "Command Center";
  if (pathname.includes("/users")) return "Users Management";
  if (pathname.includes("/owners")) return "Owners Management";
  if (pathname.includes("/grounds")) return "Grounds Management";
  if (pathname.includes("/bookings")) return "Bookings Management";
  if (pathname.includes("/payments")) return "Payments Management";
  if (pathname.includes("/reviews")) return "Reviews Monitoring";
  if (pathname.includes("/earnings")) return "Admin Earnings"; // ✅ NEW
  return "Superadmin Panel";
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminInfo = useMemo(() => {
    try {
      const raw =
        localStorage.getItem("user") ||
        localStorage.getItem("authUser") ||
        localStorage.getItem("userData");

      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          name: parsed?.name || "Superadmin",
          email: parsed?.email || "",
        };
      }
    } catch {}

    return { name: "Superadmin", email: "" };
  }, []);

  // ✅ UPDATED LINKS (includes My Earnings)
  const links = useMemo(
    () => [
      { name: "Dashboard", to: "/admin", icon: "◈" },
      { name: "Users", to: "/admin/users", icon: "👤" },
      { name: "Owners", to: "/admin/owners", icon: "🧑‍💼" },
      { name: "Grounds", to: "/admin/grounds", icon: "🏟️" },
      { name: "Bookings", to: "/admin/bookings", icon: "📅" },
      { name: "Payments", to: "/admin/payments", icon: "💳" },

      // 🔥 NEW SECTION
      { name: "My Earnings", to: "/admin/earnings", icon: "💰" },

      { name: "Reviews", to: "/admin/reviews", icon: "⭐" },
    ],
    []
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("authUser");
    localStorage.removeItem("userData");
    navigate("/login");
  };

  const pageTitle = getPageTitle(location.pathname);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="flex min-h-screen">

        {/* Overlay for mobile */}
        {mobileOpen && (
          <button
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-[290px] transform border-r border-white/10 bg-slate-950/95 backdrop-blur-xl transition duration-300 lg:static lg:translate-x-0 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">

            {/* Logo */}
            <div className="border-b border-white/10 px-6 py-6">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 font-bold text-slate-950 shadow-lg shadow-emerald-500/20">
                  CB
                </div>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">
                    CricBook Superadmin
                  </h1>
                  <p className="text-sm text-slate-400">
                    CONTROL PANEL
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2 px-4 py-6">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/admin"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-2xl px-3 py-3 transition ${
                      isActive
                        ? "bg-white text-slate-900 shadow-lg shadow-white/10"
                        : "text-slate-300 hover:bg-white/5 hover:text-white"
                    }`
                  }
                >
                  <SidebarIcon>{link.icon}</SidebarIcon>
                  <div>
                    <p className="font-medium">{link.name}</p>
                    <p className="text-xs opacity-70">
                      {link.name === "My Earnings"
                        ? "View admin commission"
                        : `Manage ${link.name.toLowerCase()}`}
                    </p>
                  </div>
                </NavLink>
              ))}
            </nav>

            {/* User Info + Logout */}
            <div className="border-t border-white/10 p-4">
              <div className="mb-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Signed in as</p>
                <p className="mt-1 font-medium text-white">{adminInfo.name}</p>
                <p className="text-xs text-slate-500">
                  {adminInfo.email || "System access enabled"}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="w-full rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.12),_transparent_30%),radial-gradient(circle_at_top_left,_rgba(6,182,212,0.10),_transparent_25%),linear-gradient(to_bottom,_#020617,_#0f172a)]">

          {/* Header */}
          <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/60 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 lg:hidden"
                  onClick={() => setMobileOpen(true)}
                >
                  ☰
                </button>

                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-emerald-300/80">
                    Admin Dashboard
                  </p>
                  <h2 className="text-xl font-semibold text-white sm:text-2xl">
                    {pageTitle}
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 sm:block">
                  Live platform monitoring
                </div>
                <NotificationBell />
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 font-semibold text-slate-950">
                  S
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 px-4 py-4 sm:px-6 lg:px-8">
            <div className="min-h-[calc(100vh-120px)] rounded-[32px] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}