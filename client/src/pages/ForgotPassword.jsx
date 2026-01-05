import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/signup.css";
import api from "../utils/api";

export default function ForgotPasswordOtp() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=email, 2=otp+newpass
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/password/send-otp", { email });
      setSuccess("OTP sent. Please check your email.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetWithOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/password/reset-otp", {
        email,
        otp,
        password,
      });

      setSuccess("Password updated! Redirecting to login...");
      setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-side">
          <h2>CricBook</h2>
          <p>Reset your password using OTP verification.</p>
          <ul>
            <li>✔ Secure OTP reset</li>
            <li>✔ Valid for 10 minutes</li>
            <li>✔ Get back to booking fast</li>
          </ul>
        </div>

        <div className="auth-form-wrap">
          <h1>Forgot Password</h1>

          <p className="auth-subtitle">
            {step === 1
              ? "Enter your email to receive an OTP."
              : "Enter OTP and set your new password."}
          </p>

          {error && <div className="auth-error">{error}</div>}
          {success && <div className="auth-success">{success}</div>}

          {step === 1 ? (
            <form className="auth-form" onSubmit={sendOtp}>
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

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={resetWithOtp}>
              <label>
                OTP Code
                <input
                  type="text"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter 6-digit OTP"
                  required
                />
              </label>

              <label>
                New Password
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  minLength={6}
                  required
                />
              </label>

              <label>
                Confirm Password
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  minLength={6}
                  required
                />
              </label>

              <button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Reset Password"}
              </button>
            </form>
          )}

          <p className="auth-switch">
            Back to <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
