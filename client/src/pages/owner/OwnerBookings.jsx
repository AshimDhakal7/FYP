import React from "react";

export default function OwnerBookings() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
      <p className="mt-1 text-sm text-gray-600">
        View and manage bookings made by players.
      </p>

      <div className="mt-6 rounded-2xl border border-dashed border-gray-200 p-6 text-sm text-gray-600">
        No bookings yet. (Later you’ll connect this to your backend.)
      </div>
    </div>
  );
}
