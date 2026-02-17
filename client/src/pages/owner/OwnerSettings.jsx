import React, { useState } from "react";

export default function OwnerSettings() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [email] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [venueName, setVenueName] = useState("");

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <p className="mt-1 text-sm text-gray-600">
        Update your owner profile and venue info.
      </p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl bg-gray-50 p-5 ring-1 ring-black/5">
          <div className="text-sm font-semibold text-gray-900">Owner Profile</div>

          <label className="mt-4 block text-xs font-semibold text-gray-700">Email</label>
          <input
            value={email}
            disabled
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-500 outline-none"
          />

          <label className="mt-4 block text-xs font-semibold text-gray-700">Phone</label>
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="98XXXXXXXX"
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </div>

        <div className="rounded-2xl bg-gray-50 p-5 ring-1 ring-black/5">
          <div className="text-sm font-semibold text-gray-900">Venue Info</div>

          <label className="mt-4 block text-xs font-semibold text-gray-700">Venue Name</label>
          <input
            value={venueName}
            onChange={(e) => setVenueName(e.target.value)}
            placeholder="Your venue name"
            className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />

          <button
            type="button"
            className="mt-5 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
