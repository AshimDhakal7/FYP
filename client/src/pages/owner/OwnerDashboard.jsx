// import React from "react";

// function StatCard({ title, value, hint }) {
//   return (
//     <div className="rounded-2xl bg-gray-50 p-5 ring-1 ring-black/5">
//       <div className="text-sm font-semibold text-gray-900">{title}</div>
//       <div className="mt-2 text-3xl font-bold text-green-700">{value}</div>
//       <div className="mt-1 text-xs text-gray-600">{hint}</div>
//     </div>
//   );
// }

// export default function OwnerDashboard() {
//   return (
//     <div>
//       <div className="flex flex-col gap-1">
//         <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
//         <p className="text-sm text-gray-600">
//           Manage courts, view bookings, and track earnings.
//         </p>
//       </div>

//       <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <StatCard title="Courts Listed" value="0" hint="Add your first court" />
//         <StatCard title="Today’s Bookings" value="0" hint="No bookings yet" />
//         <StatCard title="Upcoming" value="0" hint="Next 7 days" />
//         <StatCard title="Earnings" value="NPR 0" hint="This month" />
//       </div>

//       <div className="mt-8 grid gap-4 lg:grid-cols-2">
//         <div className="rounded-2xl bg-white ring-1 ring-black/5 p-5">
//           <div className="text-sm font-semibold text-gray-900">Recent Bookings</div>
//           <div className="mt-3 rounded-xl border border-dashed border-gray-200 p-6 text-sm text-gray-600">
//             No bookings yet. Once users book your court, they’ll appear here.
//           </div>
//         </div>

//         <div className="rounded-2xl bg-white ring-1 ring-black/5 p-5">
//           <div className="text-sm font-semibold text-gray-900">Quick Actions</div>
//           <div className="mt-3 grid gap-3 sm:grid-cols-2">
//             <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-black/5">
//               <div className="text-sm font-semibold">Add a court</div>
//               <div className="mt-1 text-xs text-gray-600">List a new venue/court.</div>
//             </div>
//             <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-black/5">
//               <div className="text-sm font-semibold">Set prices</div>
//               <div className="mt-1 text-xs text-gray-600">Update hourly rates.</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { useNavigate } from "react-router-dom";

function StatCard({ title, value, hint, icon }) {
  return (
    <div className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            {title}
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-900">{value}</div>
          <div className="mt-1 text-xs text-gray-600">{hint}</div>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-700 ring-1 ring-green-100">
          {icon}
        </div>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div className="h-full w-1/3 rounded-full bg-green-600/70 group-hover:w-1/2 transition-all" />
      </div>
    </div>
  );
}

function ActionCard({ title, desc, buttonText, onClick }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-5 ring-1 ring-black/5">
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      <div className="mt-1 text-sm text-gray-600">{desc}</div>
      <button
        onClick={onClick}
        type="button"
        className="mt-4 inline-flex items-center justify-center rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 transition"
      >
        {buttonText}
      </button>
    </div>
  );
}

function EmptyTable({ title, desc }) {
  const navigate = useNavigate();
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-900">{title}</div>
          <div className="mt-1 text-sm text-gray-600">{desc}</div>
        </div>
        <button
          type="button"
          onClick={() => navigate("/owner-dashboard/bookings")}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
        >
          View all
        </button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gray-200">
        <div className="grid grid-cols-5 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600">
          <div className="col-span-2">Customer</div>
          <div>Date</div>
          <div>Time</div>
          <div className="text-right">Amount</div>
        </div>

        <div className="px-4 py-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-700 ring-1 ring-green-100">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="opacity-90">
              <path
                d="M8 2v3M16 2v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="mt-3 text-sm font-semibold text-gray-900">No bookings yet</div>
          <div className="mt-1 text-sm text-gray-600">
            Once users book your court, you’ll see them here.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const name = user?.email ? user.email.split("@")[0] : "Owner";

  const today = new Date();
  const prettyDate = today.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
            Owner Panel
            <span className="h-1 w-1 rounded-full bg-green-600" />
            {prettyDate}
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">
            Welcome back, {name}
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Manage courts, view bookings, and track your earnings in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate("/owner-dashboard/bookings")}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
          >
            Download report
          </button>

          <button
            type="button"
            onClick={() =>
              navigate("/owner-dashboard/courts", { state: { openAdd: true } })
            }
            className="rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition"
          >
            + Add Court
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Courts listed"
          value="0"
          hint="Add your first court"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 20V4h16v16H4Z" stroke="currentColor" strokeWidth="2" />
              <path d="M8 4v16M16 4v16M4 12h16" stroke="currentColor" strokeWidth="2" />
            </svg>
          }
        />
        <StatCard
          title="Today’s bookings"
          value="0"
          hint="No bookings yet"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M8 2v3M16 2v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          }
        />
        <StatCard
          title="Upcoming"
          value="0"
          hint="Next 7 days"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 8v5l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" />
            </svg>
          }
        />
        <StatCard
          title="Earnings"
          value="NPR 0"
          hint="This month"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 1v22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path
                d="M17 5.5c0-2-2-3.5-5-3.5S7 3.5 7 5.5 9 9 12 9s5 1.5 5 3.5S15 16 12 16s-5-1.5-5-3.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          }
        />
      </div>

      {/* Main grid */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EmptyTable title="Recent bookings" desc="A quick look at your latest reservations." />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="text-sm font-semibold text-gray-900">Court performance</div>
            <div className="mt-1 text-sm text-gray-600">
              Track views, bookings and revenue per court.
            </div>

            <div className="mt-4 rounded-xl bg-gray-50 p-4 ring-1 ring-black/5">
              <div className="text-xs font-semibold text-gray-700">Coming next</div>
              <div className="mt-1 text-sm text-gray-600">
                Hook this up to your backend to show real analytics.
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="text-sm font-semibold text-gray-900">Quick actions</div>
            <div className="mt-4 space-y-3">
              <ActionCard
                title="Add a court"
                desc="List a new venue/court with pricing."
                buttonText="Add court"
                onClick={() => navigate("/owner-dashboard/courts", { state: { openAdd: true } })}
              />
              <ActionCard
                title="Set prices"
                desc="Update hourly rates and peak hours."
                buttonText="Update prices"
                onClick={() => navigate("/owner-dashboard/courts", { state: { openAdd: true } })}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
