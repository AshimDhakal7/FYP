import React, { useMemo } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

const getAuth = () => {
  try {
    return JSON.parse(localStorage.getItem("auth") || "null");
  } catch {
    return null;
  }
};

const clearAuth = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authToken");
  localStorage.removeItem("userToken");
  localStorage.removeItem("user");
  localStorage.removeItem("profile");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
};

export default function OwnerLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const auth = getAuth();
  const user = auth?.user || null;

  const displayName = useMemo(() => {
    if (user?.name?.trim()) return user.name.trim();
    if (user?.email) return user.email.split("@")[0];
    return "Owner";
  }, [user]);

  const initials = useMemo(() => {
    const source = user?.name?.trim() || user?.email?.split("@")[0] || "O";
    return source
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [user]);

  const onLogout = () => {
    clearAuth();
    window.dispatchEvent(new Event("authChanged"));
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/login?role=owner", { replace: true });
  };

  const linkClass = ({ isActive }) =>
    `group flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
      isActive
        ? "bg-gradient-to-r from-green-700 to-green-600 text-white shadow-md"
        : "text-slate-700 hover:bg-slate-50"
    }`;

  const links = [
    { to: "/owner-dashboard", label: "Dashboard", end: true },
    { to: "/owner-dashboard/courts", label: "Manage Courts" },
    { to: "/owner-dashboard/bookings", label: "Bookings" },
    { to: "/owner-dashboard/earnings", label: "Earning History" },
    { to: "/owner-dashboard/reviews", label: "Reviews & Ratings" },
    { to: "/owner-dashboard/settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,_#f8fafc,_#f1f5f9)]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[290px_1fr]">

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-[0_18px_50px_rgba(15,23,42,0.06)] backdrop-blur">

              {/* Profile */}
              <div className="border-b border-slate-100 bg-gradient-to-br from-green-50 via-white to-emerald-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-700 to-emerald-500 text-sm font-bold text-white shadow-sm">
                    {initials}
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-base font-bold text-slate-900">
                      {displayName}
                    </div>
                    <div className="text-sm text-slate-500">Owner Panel</div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="p-4">
                <div className="mb-2 px-2 text-[11px] font-bold uppercase tracking-[0.18em] text-green-700">
                  Navigation
                </div>

                <div className="space-y-2">
                  {links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      end={link.end}
                      className={linkClass}
                    >
                      <span>{link.label}</span>
                      <span
                        className={`text-xs ${
                          location.pathname === link.to
                            ? "text-white/80"
                            : "text-slate-400 transition group-hover:text-slate-600"
                        }`}
                      >
                        →
                      </span>
                    </NavLink>
                  ))}
                </div>

                {/* User Info */}
                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/80 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Signed in as
                  </div>
                  <div className="mt-2 break-all text-sm font-medium text-slate-700">
                    {user?.email || "owner@cricbook.com"}
                  </div>

                  <button
                    onClick={onLogout}
                    className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="rounded-[28px] border border-white/70 bg-white/92 p-4 shadow-[0_18px_50px_rgba(15,23,42,0.05)] backdrop-blur sm:p-6 lg:p-8">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}