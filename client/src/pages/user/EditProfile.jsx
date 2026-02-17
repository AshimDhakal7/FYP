// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../styles/EditProfile.css";

// export default function EditProfile() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ name: "", email: "" , contactnumber: ""});
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");
//   const [msg, setMsg] = useState("");

//   useEffect(() => {
//     try {
//       const u = JSON.parse(localStorage.getItem("user")) || {};
//       setForm({ name: u.name || "", email: u.email || "", contactnumber: u.contactnumber || "",});
//     } catch {
//       setForm({ name: "", email: "", contactnumber: "" });
//     }
//   }, []);

//   const onChange = (e) => {
//     setErr("");
//     setMsg("");
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErr("");
//     setMsg("");

//     try {
//       const token = localStorage.getItem("token");
//       const res = await fetch("http://localhost:5001/api/users/me", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data?.message || "Update failed");

//       localStorage.setItem("user", JSON.stringify(data));
//       setMsg("✅ Profile updated!");
//       setTimeout(() => navigate("/profile"), 600);
//     } catch (e2) {
//       setErr(e2.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="edit-page">
//       <div className="edit-wrap">
//         <div className="edit-head">
//           <div>
//             <h1>Update Profile</h1>
//             <p className="muted">Update your name and email.</p>
//           </div>
//           <Link to="/profile" className="btn-outline">← Back</Link>
//         </div>

//         <form className="card edit-card" onSubmit={onSubmit}>
//           <label className="label">
//             Full Name
//             <input
//               className="input"
//               name="name"
//               value={form.name}
//               onChange={onChange}
//               required
//             />
//           </label>

//           <label className="label">
//             Email
//             <input
//               className="input"
//               name="email"
//               value={form.email}
//               onChange={onChange}
//               required
//             />
//           </label>

//           <label className="label">
//             Contact Number
//             <input
//               className="input"
//               name="contactnumber"
//               value={form.contactnumber}
//               onChange={onChange}
//               required
//             />
//           </label>

//           {err && <div className="alert error">{err}</div>}
//           {msg && <div className="alert success">{msg}</div>}

//           <button className="btn-primary" type="submit" disabled={loading}>
//             {loading ? "Saving..." : "Save Changes"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

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

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
                Account
              </div>
              <h1 className="mt-3 text-2xl font-bold text-gray-900">
                Update Profile
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Update your personal information.
              </p>
            </div>

            <Link
              to="/profile"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="mt-5 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 space-y-4"
        >
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={onChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Contact Number
            </label>
            <input
              name="contactnumber"
              value={form.contactnumber}
              onChange={onChange}
              required
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* Alerts */}
          {err && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          )}

          {msg && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {msg}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-800 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
