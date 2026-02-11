import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

function getAuth() {
  const token = localStorage.getItem("token");
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  return { token, user };
}

function authHeaders() {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
}

export default function OwnerDashboard() {
  const navigate = useNavigate();
  const { user } = useMemo(() => getAuth(), []);

  // ✅ role guard (simple)
  useEffect(() => {
    if (!user) navigate("/login", { replace: true });
    if (user?.role !== "groundOwner") navigate("/user/dashboard", { replace: true });
  }, [user, navigate]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    monthRevenue: 0,
    totalGrounds: 0,
    upcomingBookings: 0,
  });

  const [grounds, setGrounds] = useState([]);
  const [bookings, setBookings] = useState([]);

  // Create ground form
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sportType: "Cricket",
    pricePerHour: "",
    contactPhone: "",
    addressLine: "",
    city: "",
    state: "",
    zip: "",
    openTime: "06:00",
    closeTime: "22:00",
    amenities: "",
    rules: "",
    images: "",
  });

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const validate = () => {
    const required = [
      ["name", "Ground name"],
      ["pricePerHour", "Price per hour"],
      ["contactPhone", "Contact phone"],
      ["addressLine", "Address"],
      ["city", "City"],
      ["state", "State"],
      ["zip", "Zip"],
      ["openTime", "Open time"],
      ["closeTime", "Close time"],
    ];
    for (const [k, label] of required) if (!String(form[k] || "").trim()) return `${label} is required`;
    const p = Number(form.pricePerHour);
    if (Number.isNaN(p) || p <= 0) return "Price per hour must be a positive number";
    return "";
  };

  // ✅ Replace these endpoints with your real ones if different
  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      // You can keep it as separate endpoints OR combine into one later
      const [gRes, bRes] = await Promise.all([
        fetch(`${API_BASE}/api/grounds/mine`, { headers: { ...authHeaders() } }),
        fetch(`${API_BASE}/api/bookings/owner/upcoming`, { headers: { ...authHeaders() } }),
      ]);

      const gJson = await gRes.json().catch(() => ({}));
      const bJson = await bRes.json().catch(() => ({}));

      if (!gRes.ok) throw new Error(gJson?.message || "Failed to load grounds");
      if (!bRes.ok) throw new Error(bJson?.message || "Failed to load bookings");

      const groundList = gJson?.grounds || gJson || [];
      const bookingList = bJson?.bookings || bJson || [];

      setGrounds(groundList);
      setBookings(bookingList);

      // basic stats (you can replace with backend stats endpoint later)
      const monthRevenue = bookingList
        .filter((x) => (x.status || "").toLowerCase() === "completed")
        .reduce((sum, x) => sum + Number(x.totalPrice || 0), 0);

      setStats({
        monthRevenue,
        totalGrounds: groundList.length,
        upcomingBookings: bookingList.length,
      });
    } catch (e) {
      setError(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const createGround = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);

    setCreating(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      sportType: form.sportType,
      pricePerHour: Number(form.pricePerHour),
      contactPhone: form.contactPhone.trim(),
      location: {
        addressLine: form.addressLine.trim(),
        city: form.city.trim(),
        state: form.state.trim(),
        zip: form.zip.trim(),
      },
      hours: { openTime: form.openTime, closeTime: form.closeTime },
      amenities: form.amenities
        ? form.amenities.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      rules: form.rules.trim(),
      images: form.images
        ? form.images.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };

    try {
      const res = await fetch(`${API_BASE}/api/grounds`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to create ground");

      // reset some fields
      setForm((p) => ({
        ...p,
        name: "",
        pricePerHour: "",
        amenities: "",
        rules: "",
        images: "",
      }));

      await fetchAll();
    } catch (e2) {
      setError(e2?.message || "Create failed");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      {/* top spacing if you have fixed navbar */}
      <div className="pt-24 px-4 pb-10">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-green-900">
                Ground Owner Dashboard
              </h1>
              <p className="text-green-700 mt-2">
                Welcome back, <span className="font-semibold">{user?.name || "Owner"}</span>
                <span className="ml-2 inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border border-green-200 bg-green-100 text-green-800">
                  {user?.role || "groundOwner"}
                </span>
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={fetchAll}
                disabled={loading}
                className="px-4 py-2 rounded-xl font-bold border border-green-200 bg-white text-green-800 hover:bg-green-50 transition disabled:opacity-60"
              >
                Refresh
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl font-bold bg-green-700 text-white hover:bg-green-800 transition"
              >
                Logout
              </button>
            </div>
          </div>

          {error ? (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 font-semibold">
              {error}
            </div>
          ) : null}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              title="This Month Revenue"
              value={`$${Number(stats.monthRevenue || 0).toFixed(2)}`}
              hint="Based on completed bookings (if available)."
            />
            <StatCard
              title="Total Grounds"
              value={`${stats.totalGrounds || 0}`}
              hint="Number of grounds you manage."
            />
            <StatCard
              title="Upcoming Bookings"
              value={`${stats.upcomingBookings || 0}`}
              hint="Bookings waiting / scheduled."
            />
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* My Grounds */}
            <div className="rounded-2xl border border-green-100 bg-white shadow-sm">
              <div className="p-5 flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-green-900">My Grounds</h2>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">
                  {grounds.length} total
                </span>
              </div>

              <div className="px-5 pb-5">
                {loading ? (
                  <p className="text-green-700/70 font-medium">Loading...</p>
                ) : grounds.length === 0 ? (
                  <p className="text-green-700/70 font-medium">
                    No grounds yet. Create your first ground using the form.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {grounds.map((g) => (
                      <div
                        key={g._id || g.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-green-100 bg-green-50/40 px-4 py-3"
                      >
                        <div>
                          <p className="font-extrabold text-green-900">{g.name}</p>
                          <p className="text-sm text-green-800/70">
                            {(g.location?.city && g.location?.state)
                              ? `${g.location.city}, ${g.location.state}`
                              : "Location not set"}
                            {" • "}
                            ${g.pricePerHour}/hr
                            {" • "}
                            {g.sportType || "Cricket"}
                          </p>
                        </div>

                        <button
                          onClick={() => navigate(`/owner/grounds/${g._id || g.id}`)}
                          className="shrink-0 px-3 py-2 rounded-xl text-sm font-extrabold border border-green-200 bg-white text-green-800 hover:bg-green-50 transition"
                        >
                          Manage
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Create Ground */}
            <div className="rounded-2xl border border-green-100 bg-white shadow-sm">
              <div className="p-5">
                <h2 className="text-lg font-extrabold text-green-900">Create New Ground</h2>
                <p className="text-sm text-green-800/70 mt-1">
                  Fill required fields (*) and create your ground.
                </p>
              </div>

              <form onSubmit={createGround} className="px-5 pb-6 space-y-4">
                <Input label="Ground Name *" name="name" value={form.name} onChange={onChange} placeholder="e.g., CricBook Arena" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Select
                    label="Sport Type"
                    name="sportType"
                    value={form.sportType}
                    onChange={onChange}
                    options={["Cricket", "Futsal", "Badminton", "Basketball"]}
                  />
                  <Input label="Price per Hour *" name="pricePerHour" value={form.pricePerHour} onChange={onChange} placeholder="e.g., 60" />
                </div>

                <Input label="Contact Phone *" name="contactPhone" value={form.contactPhone} onChange={onChange} placeholder="+1 469..." />

                <Input label="Address *" name="addressLine" value={form.addressLine} onChange={onChange} placeholder="Street / building" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Input label="City *" name="city" value={form.city} onChange={onChange} placeholder="Dallas" />
                  <Input label="State *" name="state" value={form.state} onChange={onChange} placeholder="TX" />
                  <Input label="Zip *" name="zip" value={form.zip} onChange={onChange} placeholder="750xx" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <TimeInput label="Open Time *" name="openTime" value={form.openTime} onChange={onChange} />
                  <TimeInput label="Close Time *" name="closeTime" value={form.closeTime} onChange={onChange} />
                </div>

                <Input
                  label="Amenities (comma separated)"
                  name="amenities"
                  value={form.amenities}
                  onChange={onChange}
                  placeholder="Parking, Washroom, Lights"
                />

                <Textarea
                  label="Rules (optional)"
                  name="rules"
                  value={form.rules}
                  onChange={onChange}
                  placeholder="No outside food, arrive 10 mins early..."
                />

                <Input
                  label="Image URLs (comma separated)"
                  name="images"
                  value={form.images}
                  onChange={onChange}
                  placeholder="https://... , https://..."
                />

                <button
                  type="submit"
                  disabled={creating}
                  className="w-full rounded-2xl py-3 font-extrabold text-white bg-green-700 hover:bg-green-800 transition disabled:opacity-60"
                >
                  {creating ? "Creating..." : "Create Ground"}
                </button>

                <p className="text-xs text-green-800/70">
                  Tip: Later you can replace image URLs with Cloudinary upload.
                </p>
              </form>
            </div>
          </div>

          {/* Bookings */}
          <div className="rounded-2xl border border-green-100 bg-white shadow-sm mt-6">
            <div className="p-5 flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-green-900">Upcoming Bookings</h2>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">
                {bookings.length}
              </span>
            </div>

            <div className="px-5 pb-6">
              {loading ? (
                <p className="text-green-700/70 font-medium">Loading...</p>
              ) : bookings.length === 0 ? (
                <p className="text-green-700/70 font-medium">No upcoming bookings yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs uppercase text-green-800/60">
                        <th className="py-2 pr-4">Ground</th>
                        <th className="py-2 pr-4">Customer</th>
                        <th className="py-2 pr-4">Date</th>
                        <th className="py-2 pr-4">Time</th>
                        <th className="py-2 pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {bookings.map((b) => (
                        <tr key={b._id || b.id} className="border-t border-green-100">
                          <td className="py-3 pr-4 font-bold text-green-900">
                            {b.ground?.name || b.groundName || "-"}
                          </td>
                          <td className="py-3 pr-4 text-green-900">
                            {b.user?.name || b.customerName || "-"}
                          </td>
                          <td className="py-3 pr-4 text-green-800/80">{b.date || "-"}</td>
                          <td className="py-3 pr-4 text-green-800/80">
                            {b.startTime ? `${b.startTime} - ${b.endTime}` : "-"}
                          </td>
                          <td className="py-3 pr-4">
                            <StatusPill status={b.status || "pending"} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => navigate("/owner/bookings")}
                  className="px-4 py-2 rounded-xl font-extrabold border border-green-200 bg-white text-green-800 hover:bg-green-50 transition"
                >
                  Manage All Bookings
                </button>
                <button
                  onClick={() => navigate("/owner/availability")}
                  className="px-4 py-2 rounded-xl font-extrabold bg-green-700 text-white hover:bg-green-800 transition"
                >
                  Set Availability
                </button>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="max-w-7xl mx-auto mt-6 text-xs text-green-800/60">
            Owner tools: create/manage grounds, control availability, and manage bookings.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- components ---------------- */

function StatCard({ title, value, hint }) {
  return (
    <div className="rounded-2xl border border-green-100 bg-white shadow-sm p-5">
      <p className="text-sm font-extrabold text-green-700">{title}</p>
      <p className="text-3xl font-extrabold text-green-900 mt-2">{value}</p>
      <p className="text-xs text-green-800/60 mt-2">{hint}</p>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-extrabold text-green-800">{label}</label>
      <input
        {...props}
        className="mt-1 w-full rounded-2xl border border-green-200 bg-white px-4 py-3 font-semibold text-green-900
                   outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-extrabold text-green-800">{label}</label>
      <textarea
        {...props}
        className="mt-1 w-full min-h-[96px] rounded-2xl border border-green-200 bg-white px-4 py-3 font-semibold text-green-900
                   outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-sm font-extrabold text-green-800">{label}</label>
      <select
        {...props}
        className="mt-1 w-full rounded-2xl border border-green-200 bg-white px-4 py-3 font-semibold text-green-900
                   outline-none focus:ring-2 focus:ring-green-500"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

function TimeInput({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-extrabold text-green-800">{label}</label>
      <input
        type="time"
        {...props}
        className="mt-1 w-full rounded-2xl border border-green-200 bg-white px-4 py-3 font-semibold text-green-900
                   outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

function StatusPill({ status }) {
  const s = String(status).toLowerCase();
  const map = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-green-100 text-green-800 border-green-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };
  const cls = map[s] || "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold border ${cls}`}>
      {status}
    </span>
  );
}
