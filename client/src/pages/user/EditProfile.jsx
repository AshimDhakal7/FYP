import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function EditProfile() {
  const navigate = useNavigate();

  // ---------- state ----------
  const [form, setForm] = useState({
    name: "",
    email: "",
    contactnumber: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // ---------- load user ----------
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user")) || {};
      setForm({
        name: u.name || "",
        email: u.email || "",
        contactnumber: u.contactnumber || u.phone || "",
      });
    } catch {
      setForm({ name: "", email: "", contactnumber: "" });
    }
  }, []);

  // ---------- token ----------
  const token = useMemo(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      ""
    );
  }, []);

  // ---------- input ----------
  const onChange = (e) => {
    setErr("");
    setMsg("");
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  // ---------- submit ----------
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    setMsg("");

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("email", form.email);

      // send both (backend compatibility)
      formData.append("contactnumber", form.contactnumber);
      formData.append("phone", form.contactnumber);

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) throw new Error(data?.message || "Update failed");

      localStorage.setItem("user", JSON.stringify(data));

      setMsg("Profile updated successfully!");
      setTimeout(() => navigate("/profile"), 800);
    } catch (e2) {
      setErr(e2.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ---------- initials ----------
  const initials = useMemo(() => {
    const raw = String(form?.name || form?.email || "User").trim();
    const parts = raw.split(" ").filter(Boolean);
    return ((parts[0]?.[0] || "U") + (parts[1]?.[0] || "")).toUpperCase();
  }, [form]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">

        {/* header */}
        <div className="mb-6 flex justify-between">
          <div>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p className="text-sm text-gray-600">Update your info</p>
          </div>

          <Link to="/profile" className="border px-4 py-2 rounded">
            ← Back
          </Link>
        </div>

        {/* form */}
        <form onSubmit={onSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">

          {/* image */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])}
          />

          {/* name */}
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Name"
            className="w-full border p-3 rounded"
          />

          {/* email */}
          <input
            name="email"
            value={form.email}
            onChange={onChange}
            placeholder="Email"
            className="w-full border p-3 rounded"
          />

          {/* phone */}
          <input
            name="contactnumber"
            value={form.contactnumber}
            onChange={onChange}
            placeholder="Phone Number"
            className="w-full border p-3 rounded"
          />

          {/* messages */}
          {err && <p className="text-red-500">{err}</p>}
          {msg && <p className="text-green-600">{msg}</p>}

          {/* button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-5 py-2 rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}