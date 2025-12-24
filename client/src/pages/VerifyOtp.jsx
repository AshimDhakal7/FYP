import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/signup.css"; // uses same CSS as login/signup
import api from "../utils/api";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const pendingId = location.state?.pendingId || "";
  const email = location.state?.email || "";
  const role = location.state?.role || "user";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleLabel = role === "owner" ? "Ground Owner" : "User";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!pendingId) {
      setError("Signup session expired. Please sign up again.");
      return;
    }

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      // ✅ OTP verification creates the actual account in backend
      await api.post("/api/auth/signup/verify-otp", { pendingId, otp });

      // ✅ Redirect to home after success
      navigate("/home", { replace: true });
    } catch (err) {
      console.error("OTP verify error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* LEFT SIDE (same as login/signup style) */}
        <div className="auth-side">
          <h2>CricBook</h2>
          <p>Verify your email to complete your CricBook account.</p>
          <ul>
            <li>✔ Secure signup with OTP</li>
            <li>✔ Protect your account access</li>
            <li>✔ Faster bookings after verification</li>
          </ul>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="auth-form-wrap">
          <h1>Verify OTP</h1>

          {/* Role badge (same style as your signup page) */}
          <div className="role-pill">
            Verifying as: <b>{roleLabel}</b>
          </div>

          <p className="auth-subtitle">
            Enter the 6-digit code sent to <b>{email || "your email"}</b>.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
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

            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>

          <p className="auth-switch">
            Wrong email? <Link to={`/signup?role=${role}`}>Go back</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
