import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/EditProfile.css";

export default function EditProfile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user")) || {};
      setForm({ name: u.name || "", email: u.email || "" });
    } catch {
      setForm({ name: "", email: "" });
    }
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
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5001/api/users/me", {
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
      setMsg("✅ Profile updated!");
      setTimeout(() => navigate("/profile"), 600);
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-page">
      <div className="edit-wrap">
        <div className="edit-head">
          <div>
            <h1>Update Profile</h1>
            <p className="muted">Update your name and email.</p>
          </div>
          <Link to="/profile" className="btn-outline">← Back</Link>
        </div>

        <form className="card edit-card" onSubmit={onSubmit}>
          <label className="label">
            Full Name
            <input
              className="input"
              name="name"
              value={form.name}
              onChange={onChange}
              required
            />
          </label>

          <label className="label">
            Email
            <input
              className="input"
              name="email"
              value={form.email}
              onChange={onChange}
              required
            />
          </label>

          {err && <div className="alert error">{err}</div>}
          {msg && <div className="alert success">{msg}</div>}

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
