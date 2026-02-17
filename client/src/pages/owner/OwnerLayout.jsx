import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function OwnerLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition ${
      isActive
        ? "bg-green-700 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white font-bold">
                CB
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">CricBook</div>
                <div className="text-xs text-gray-600">Owner Panel</div>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <NavLink to="/owner-dashboard" end className={linkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/owner-dashboard/courts" className={linkClass}>
                Manage Courts
              </NavLink>
              <NavLink to="/owner-dashboard/bookings" className={linkClass}>
                Bookings
              </NavLink>
              <NavLink to="/owner-dashboard/settings" className={linkClass}>
                Settings
              </NavLink>
            </div>

            <div className="mt-6 rounded-xl bg-gray-50 p-3">
              <div className="text-xs font-semibold text-gray-900">Signed in as</div>
              <div className="mt-1 text-xs text-gray-600">{user?.email || "Owner"}</div>
              <button
                onClick={onLogout}
                className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-100 transition"
              >
                Logout
              </button>
            </div>
          </aside>

          {/* Main */}
          <main className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
