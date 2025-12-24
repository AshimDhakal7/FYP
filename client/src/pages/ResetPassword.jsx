import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../utils/api";
import "../styles/forgotPassword.css";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (password !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(`/api/auth/reset-password/${token}`, { password });
      setMsg(res.data.message || "Password updated!");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Reset failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-page">
      <div className="fp-card">
        <h1>Reset Password</h1>
        <p className="fp-muted">Set a new password for your account.</p>

        <form onSubmit={submit} className="fp-form">
          <label>
            New Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>

          <label>
            Confirm Password
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>

        {msg && <div className="fp-msg">{msg}</div>}
      </div>
    </div>
  );
}
