import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    contactnumber: "",
  });

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // Load user from localStorage
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user")) || {};
      setForm({
        name: u.name || "",
        email: u.email || "",
        contactnumber: u.contactnumber || "",
      });
    } catch {
      setForm({ name: "", email: "", contactnumber: "" });
    }
  }, []);

  const token = useMemo(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      ""
    );
  }, []);

  const onChange = (e) => {
    setErr("");
    setMsg("");
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setMsg("");

    try {
      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.message || "Update failed");

      localStorage.setItem("user", JSON.stringify(data));
      setMsg("Profile updated successfully!");

      setTimeout(() => navigate("/profile"), 900);
    } catch (e2) {
      setErr(e2.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const initials = useMemo(() => {
    const raw = String(form?.name || form?.email || "User").trim();
    const parts = raw.split(" ").filter(Boolean);
    const a = parts[0]?.[0] || "U";
    const b = parts[1]?.[0] || "";
    return (a + b).toUpperCase();
  }, [form?.name, form?.email]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        {/* Top Row */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
              Account Settings
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-gray-900">
              Edit Profile
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Update your personal info and keep your account up to date.
            </p>
          </div>

          <Link
            to="/profile"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
          >
            ← Back to Profile
          </Link>
        </div>

        {/* Layout */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left: Profile Card */}
          <aside className="lg:col-span-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
              <div className="flex items-center gap-4">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-green-100 text-green-800 text-lg font-extrabold ring-1 ring-green-200">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-lg font-extrabold text-gray-900">
                    {form.name || "Your Name"}
                  </p>
                  <p className="truncate text-sm text-gray-600">
                    {form.email || "you@email.com"}
                  </p>
                  <p className="mt-2 inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-700">
                    Profile Editor
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-gray-50 p-4 ring-1 ring-black/5">
                <p className="text-xs font-semibold text-gray-700">Tip</p>
                <p className="mt-1 text-sm text-gray-600">
                  Use a valid phone number so ground owners can contact you easily.
                </p>
              </div>
            </div>
          </aside>

          {/* Right: Form */}
          <section className="lg:col-span-8">
            <form
              onSubmit={onSubmit}
              className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="text-lg font-extrabold text-gray-900">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Make changes below and click save.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    {loading ? "Saving..." : "Ready"}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4">
                {/* Name */}
                <Field label="Full Name">
                  <input
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    required
                    placeholder="Enter your full name"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
                  />
                </Field>

                {/* Email */}
                <Field label="Email">
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={onChange}
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
                  />
                </Field>

                {/* Contact */}
                <Field label="Contact Number">
                  <input
                    name="contactnumber"
                    value={form.contactnumber}
                    onChange={onChange}
                    required
                    placeholder="98XXXXXXXX"
                    className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
                  />
                </Field>

                {/* Alerts */}
                {err && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {err}
                  </div>
                )}

                {msg && (
                  <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                    {msg}
                  </div>
                )}

                {/* Buttons */}
                <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Link
                    to="/profile"
                    className="w-full sm:w-auto rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition text-center"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto rounded-2xl bg-green-700 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-green-800 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>

            {/* small footer note */}
            <p className="mt-4 text-xs text-gray-500 text-center">
              Changes are saved to your account and updated in your profile page.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

/* UI helper */
function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700">
        {label}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
