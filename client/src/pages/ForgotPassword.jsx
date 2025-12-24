import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/forgotPassword.css";
import api from "../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [devToken, setDevToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setDevToken("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Request reset token
      const forgotRes = await api.post("/api/auth/forgot-password", { email });
      const token = forgotRes.data?.resetToken;

      if (!token) {
        setMsg("If this email exists, reset instructions were sent.");
        return;
      }

      // 2️⃣ Reset password using DEV token
      await api.post(`/api/auth/reset-password/${token}`, {
        password,
      });

      setMsg("Password updated successfully. You can now log in.");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-page">
      <div className="fp-card">
        {/* LEFT SIDE */}
        <div className="fp-side">
          <h2>Reset your password</h2>
          <p>Securely update your CricBook password.</p>
          <ul>
            <li>✔ Secure reset flow</li>
            <li>✔ Password encrypted</li>
            <li>✔ Takes less than a minute</li>
          </ul>
        </div>

        {/* RIGHT SIDE */}
        <div className="fp-form-wrap">
          <h1>Forgot Password</h1>
          <p className="fp-subtitle">
            Enter your email and choose a new password.
          </p>

          {error && <div className="fp-alert error">{error}</div>}
          {msg && <div className="fp-alert success">{msg}</div>}

          <form className="fp-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>

            <label>
              New Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            <label>
              Confirm New Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>

          <p className="fp-switch">
            Remembered your password?{" "}
            <Link to="/login">Back to Log In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
