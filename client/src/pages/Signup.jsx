// client/src/pages/Signup.jsx
import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/signup.css";
import api from "../utils/api";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ read role from query: /signup?role=user or /signup?role=owner
  const roleFromQuery = useMemo(() => {
    const role = new URLSearchParams(location.search).get("role");
    return role === "owner" ? "owner" : "user";
  }, [location.search]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: roleFromQuery, // ✅ include role in state
  });

  // keep role in sync if user changes URL
  React.useEffect(() => {
    setForm((prev) => ({ ...prev, role: roleFromQuery }));
  }, [roleFromQuery]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // ✅ STEP 1: Send OTP (no account created yet)
      const res = await api.post("/api/auth/signup/send-otp", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      // ✅ DO NOT SAVE TOKEN/USER HERE
      // ✅ Go to OTP verify page with pendingId
      navigate("/verify-otp", {
        state: {
          pendingId: res.data.pendingId,
          email: form.email,
          name: form.name,
          role: form.role,
        },
        replace: true,
      });
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = form.role === "owner" ? "Ground Owner" : "User";

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-side">
          <h2>CricBook</h2>
          <p>Book your favorite indoor cricket slot in a few taps.</p>
          <ul>
            <li>✔ Live availability</li>
            <li>✔ Instant confirmation</li>
            <li>✔ Manage all bookings in one place</li>
          </ul>
        </div>

        <div className="auth-form-wrap">
          <h1>Create Account</h1>

          {/* ✅ Role badge */}
          <div className="role-pill">
            Creating account as: <b>{roleLabel}</b>
          </div>

          <p className="auth-subtitle">
            Join CricBook and start booking your favorite cricsal.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Full Name
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Ashim Dhakal"
                required
              />
            </label>

            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                minLength={6}
              />
            </label>

            <label>
              Confirm Password
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                required
                minLength={6}
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
