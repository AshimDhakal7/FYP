// client/src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/login.css";
import api from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  // if user was redirected from a protected route, go back there; otherwise go to /home
  const from = location.state?.from?.pathname || "/home";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await api.post("/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      // Save token and user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      // go to previous protected page or home
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid credentials, please try again"
      );
    } finally {
      setLoading(false);
    }
    
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-side">
          <h2>Welcome back</h2>
          <p>Continue managing your cricket bookings with CricBook.</p>
          <ul>
            <li>✔ View upcoming bookings</li>
            <li>✔ Cancel or reschedule easily</li>
            <li>✔ Exclusive member offers</li>
          </ul>
        </div>

        <div className="auth-form-wrap">
          <h1>Log In</h1>
          <p className="auth-subtitle">
            Enter your credentials to access your dashboard.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                required
              />
            </label>
            <div className="auth-forgot">
  <button
    type="button"
    className="auth-link"
    onClick={() => navigate("/forgot-password")}
  >
    Forgot password?
  </button>
</div>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="auth-switch">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
