// import React, { useEffect, useState, useMemo } from "react";
// import { Link, useNavigate } from "react-router-dom";

// const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// export default function EditProfile() {
//   const navigate = useNavigate();

//   // ---------- state ----------
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     contactnumber: "",
//   });

//   const [profilePicture, setProfilePicture] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [err, setErr] = useState("");
//   const [msg, setMsg] = useState("");

//   // ---------- load user ----------
//   useEffect(() => {
//     try {
//       const u = JSON.parse(localStorage.getItem("user")) || {};
//       setForm({
//         name: u.name || "",
//         email: u.email || "",
//         contactnumber: u.contactnumber || u.phone || "",
//       });
//     } catch {
//       setForm({ name: "", email: "", contactnumber: "" });
//     }
//   }, []);

//   // ---------- token ----------
//   const token = useMemo(() => {
//     return (
//       localStorage.getItem("token") ||
//       localStorage.getItem("accessToken") ||
//       localStorage.getItem("authToken") ||
//       ""
//     );
//   }, []);

//   // ---------- input ----------
//   const onChange = (e) => {
//     setErr("");
//     setMsg("");
//     setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
//   };

//   // ---------- submit ----------
//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setErr("");
//     setMsg("");

//     try {
//       const formData = new FormData();

//       formData.append("name", form.name);
//       formData.append("email", form.email);

//       // send both (backend compatibility)
//       formData.append("contactnumber", form.contactnumber);
//       formData.append("phone", form.contactnumber);

//       if (profilePicture) {
//         formData.append("profilePicture", profilePicture);
//       }

//       const res = await fetch(`${API_BASE}/api/users/me`, {
//         method: "PUT",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       const data = await res.json().catch(() => null);

//       if (!res.ok) throw new Error(data?.message || "Update failed");

//       const updatedUser = {
//         ...JSON.parse(localStorage.getItem("user") || "{}"),
//         ...data,
//       };
      
//       localStorage.setItem("user", JSON.stringify(updatedUser));
//       window.dispatchEvent(new Event("userUpdated"));

//       setMsg("Profile updated successfully!");
//       setTimeout(() => navigate("/profile"), 800);
//     } catch (e2) {
//       setErr(e2.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------- initials ----------
//   const initials = useMemo(() => {
//     const raw = String(form?.name || form?.email || "User").trim();
//     const parts = raw.split(" ").filter(Boolean);
//     return ((parts[0]?.[0] || "U") + (parts[1]?.[0] || "")).toUpperCase();
//   }, [form]);

//   return (
//     <div className="min-h-screen bg-gray-50 px-4 py-10">
//       <div className="max-w-4xl mx-auto">

//         {/* header */}
//         <div className="mb-6 flex justify-between">
//           <div>
//             <h1 className="text-2xl font-bold">Edit Profile</h1>
//             <p className="text-sm text-gray-600">Update your info</p>
//           </div>

//           <Link to="/profile" className="border px-4 py-2 rounded">
//             ← Back
//           </Link>
//         </div>

//         {/* form */}
//         <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">

//           {/* image */}
//           <input
//             type="file"
//             accept="image/*"
//             onChange={(e) => setProfilePicture(e.target.files[0])}
//           />

//           {/* name */}
//           <input
//             name="name"
//             value={form.name}
//             onChange={onChange}
//             placeholder="Name"
//             className="w-full border p-3 rounded"
//           />

//           {/* email */}
//           <input
//             name="email"
//             value={form.email}
//             onChange={onChange}
//             placeholder="Email"
//             className="w-full border p-3 rounded"
//           />

//           {/* phone */}
//           <input
//             name="contactnumber"
//             value={form.contactnumber}
//             onChange={onChange}
//             placeholder="Phone Number"
//             className="w-full border p-3 rounded"
//           />

//           {/* messages */}
//           {err && <p className="text-red-500">{err}</p>}
//           {msg && <p className="text-green-600">{msg}</p>}

//           {/* button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-green-600 text-white px-5 py-2 rounded"
//           >
//             {loading ? "Saving..." : "Save"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    contactnumber: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user")) || {};
      setForm({
        name: u.name || "",
        email: u.email || "",
        contactnumber: u.contactnumber || u.phone || "",
      });

      if (u.profilePicture) {
        setPreview(
          u.profilePicture.startsWith("http")
            ? u.profilePicture
            : `${API_BASE}${u.profilePicture}`
        );
      }
    } catch {}
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
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleImage = (file) => {
    if (!file) return;
    setProfilePicture(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setMsg("");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("contactnumber", form.contactnumber);
      formData.append("phone", form.contactnumber);

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Update failed");

      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user") || "{}"),
        ...data,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userUpdated"));
      window.dispatchEvent(new Event("user-profile-updated"));

      setMsg("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 900);
    } catch (e2) {
      setErr(e2.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const initials = useMemo(() => {
    const raw = String(form.name || form.email || "User").trim();
    const parts = raw.split(" ").filter(Boolean);
    return ((parts[0]?.[0] || "U") + (parts[1]?.[0] || "")).toUpperCase();
  }, [form]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-100 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-green-700">
              My Account
            </p>
            <h1 className="mt-1 text-3xl font-black tracking-tight text-gray-900">
              Edit Profile
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Update your personal details and profile picture to keep your CricBook account professional and up to date.
            </p>
          </div>

          <Link
            to="/profile"
            className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
          >
            ← Back to Profile
          </Link>
        </div>

        <form
          onSubmit={onSubmit}
          className="grid gap-6 xl:grid-cols-12"
        >
          <aside className="xl:col-span-4">
            <div className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-[0_20px_60px_rgba(16,24,40,0.08)]">
              <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-7 text-white">
                <p className="text-sm font-semibold text-green-50">
                  Profile Preview
                </p>
                <h2 className="mt-1 text-2xl font-black">Your Identity Card</h2>
              </div>

              <div className="p-6">
                <div className="flex flex-col items-center">
                  <div className="group relative">
                    <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[28px] border-4 border-green-100 bg-green-100 text-3xl font-black text-green-800 shadow-sm">
                      {preview ? (
                        <img
                          src={preview}
                          className="h-full w-full object-cover"
                          alt="Profile preview"
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-[28px] bg-black/45 opacity-0 transition group-hover:opacity-100">
                      <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-900">
                        Change Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImage(e.target.files?.[0])}
                      />
                    </label>
                  </div>

                  <p className="mt-4 text-xl font-black text-gray-900">
                    {form.name || "Your Name"}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {form.email || "your@email.com"}
                  </p>

                  <div className="mt-6 w-full rounded-2xl border border-green-100 bg-green-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-green-700">
                      Upload Tip
                    </p>
                    <p className="mt-2 text-sm leading-6 text-green-800">
                      Use a clear profile picture for a more trusted and polished account appearance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="xl:col-span-8">
            <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-[0_20px_60px_rgba(16,24,40,0.08)] sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black tracking-tight text-gray-900">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Edit your account details below and save changes when ready.
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  Secure profile update
                </div>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <Field
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Enter your full name"
                />

                <Field
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Enter your email"
                />

                <div className="md:col-span-2">
                  <Field
                    label="Phone Number"
                    name="contactnumber"
                    value={form.contactnumber}
                    onChange={onChange}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {(err || msg) && (
                <div className="mt-6 space-y-3">
                  {err && (
                    <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {err}
                    </div>
                  )}
                  {msg && (
                    <div className="rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                      {msg}
                    </div>
                  )}
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link
                  to="/profile"
                  className="rounded-2xl border border-gray-200 bg-white px-5 py-3 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-400 focus:bg-white focus:ring-4 focus:ring-green-100"
      />
    </div>
  );
}