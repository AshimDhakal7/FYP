import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function Dashboard() {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const displayName = user?.name || user?.username || "Ashim Dai";

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [locationLoading, setLocationLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    "";

  const loadBookings = async () => {
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await res.json().catch(() => []);

      if (!res.ok) {
        setMsg(data?.message || "Failed to load bookings.");
        setBookings([]);
        return;
      }

      setBookings(Array.isArray(data) ? data : data.bookings || []);
    } catch {
      setMsg("Server error. Check backend is running.");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNearMe = () => {
    if (!navigator.geolocation) {
      setMsg("Location is not supported by this browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(coords);
        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
        setMsg("Location permission denied. Please allow location access.");
      }
    );
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedDate) params.set("date", selectedDate);
    if (selectedTime) params.set("time", selectedTime);
    if (location?.lat && location?.lng) {
      params.set("lat", location.lat);
      params.set("lng", location.lng);
    }

    navigate(`/find-cricsal?${params.toString()}`);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-green-700">
                Dashboard
              </p>

              <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                Welcome back, {displayName}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Find nearby cricket grounds, choose a date, and select your preferred time.
              </p>
            </div>

            <button
              type="button"
              onClick={loadBookings}
              className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Quick Booking Search
            </h2>
            <p className="text-sm text-slate-500">
              Search available grounds using location, date, and time.
            </p>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-4">
            <button
              type="button"
              onClick={handleNearMe}
              disabled={locationLoading}
              className="rounded-2xl bg-green-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {locationLoading ? "Getting location..." : "Use My Location"}
            </button>

            <div>
              <label className="text-xs font-semibold text-slate-500">
                Pick a Date
              </label>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-500">
                Select Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
              />
            </div>

            <button
              type="button"
              onClick={handleSearch}
              className="self-end rounded-2xl border border-green-700 bg-white px-4 py-3 text-sm font-semibold text-green-700 transition hover:bg-green-50"
            >
              Search Grounds
            </button>
          </div>

          {location && (
            <div className="mt-4 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-xs font-medium text-green-700">
              Location selected successfully. Search will use your current location.
            </div>
          )}
        </div>

        {msg && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {msg}
          </div>
        )}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Your Bookings
              </h2>
              <p className="text-sm text-slate-500">
                Recent and upcoming booking activity.
              </p>
            </div>

            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {loading ? "Loading..." : `${bookings.length} total`}
            </div>
          </div>

          {loading ? (
            <div className="mt-5 space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
              No bookings yet.
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bookings.map((b) => {
                const id = b._id || b.id || `${b.date}-${b.slot}-${Math.random()}`;
                const groundName =
                  b.cricsal?.name ||
                  b.ground?.name ||
                  b.groundName ||
                  b.cricsalName ||
                  b.name ||
                  "Cricsal";

                const date = b.date || "N/A";
                const time =
                  b.time ||
                  b.slot ||
                  `${b.startTime || "--"} - ${b.endTime || "--"}`;

                return (
                  <div
                    key={id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-green-200 hover:shadow-md"
                  >
                    <div className="text-base font-bold text-slate-900">
                      {groundName}
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-slate-700">
                      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                        <span className="text-slate-500">Date</span>
                        <span className="font-semibold">{date}</span>
                      </div>

                      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2">
                        <span className="text-slate-500">Time</span>
                        <span className="font-semibold">{time}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => navigate("/bookings")}
                        className="flex-1 rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-green-800"
                      >
                        Details
                      </button>

                      <button
                        type="button"
                        onClick={() => navigate("/find-cricsal")}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        Book Again
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}