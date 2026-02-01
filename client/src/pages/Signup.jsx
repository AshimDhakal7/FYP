import React, { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import "../styles/signup.css";
import api from "../utils/api";

export default function Signup() {
  const navigate = useNavigate();
  const location = useLocation();

  const roleFromQuery = useMemo(() => {
    const role = new URLSearchParams(location.search).get("role");
    return role === "owner" ? "owner" : "user";
  }, [location.search]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: roleFromQuery, 
  });
  

  //(show/hide password icon)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  
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

      // STEP 1: Send OTP (no account created yet)
      const res = await api.post("/api/auth/signup/send-otp", {
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      //  Go to OTP verify page with pendingId
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

  // ✅ ADDED (SVG icons - no emoji)
  const EyeIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 3L21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M10.58 10.58A2 2 0 0 0 13.42 13.42"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M9.88 5.09A10.55 10.55 0 0 1 12 4.8c6 0 10 7.2 10 7.2a18.6 18.6 0 0 1-4.24 5.12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M6.11 6.11C3.65 7.86 2 12 2 12s4 7.2 10 7.2c1.1 0 2.14-.19 3.1-.53"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

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
              <div className="auth-password-field">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </label>

            <label>
              Confirm Password
              <div className="auth-password-field">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowConfirmPassword((s) => !s)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
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
