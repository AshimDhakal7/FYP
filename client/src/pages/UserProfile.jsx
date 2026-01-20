import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/UserProfile.css";

export default function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user"));
      if (u) setUser(u);
    } catch {
      setUser(null);
    }
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header card">
          <div>
            <h1>My Profile</h1>
            <p>Manage your CricBook account information</p>
          </div>

          <Link to="/home" className="btn-outline">
            ← Back to Home
          </Link>
        </div>

        {/* Main Grid */}
        <div className="profile-grid">
          {/* LEFT */}
          <div className="profile-left">
            <div className="card">
              <h2>Personal Information</h2>

              <div className="profile-row">
                <span>Name</span>
                <strong>{user?.name || "Ashim"}</strong>
              </div>

              <div className="profile-row">
                <span>Email</span>
                <strong>{user?.email || "ashimdhakal7899@gmail.com"}</strong>
              </div>

              <div className="profile-row">
                <span>Role</span>
                <strong>{user?.role || "user"}</strong>
              </div>

              {/* ✅ you don't have /profile/edit route yet, so point to /dashboard for now */}
              <Link to="/profile/edit" className="btn-primary">
                Update Profile
              </Link>

            </div>

            <div className="card">
              <h2>Account Security</h2>
              <p>Change your password to keep your account secure.</p>

              {/* ✅ you don't have /reset-password route (only /reset-password/:token)
                  so send user to forgot-password first */}
              <Link to="/forgot-password" className="btn-outline">
                Change Password
              </Link>
            </div>
          </div>

          {/* RIGHT */}
          <div className="profile-right">
            <div className="card">
              <h2>Booking Summary</h2>

              <div className="stat">
                <span>Total Bookings</span>
                <strong>0</strong>
              </div>

              <div className="stat">
                <span>Loyalty Points</span>
                <strong>0</strong>
              </div>

              <div className="stat">
                <span>Last Login</span>
                <strong>Today</strong>
              </div>
            </div>

            <div className="card">
              <h2>Quick Actions</h2>

              {/* ✅ your real route is /find-cricsal */}
              <Link to="/find-cricsal" className="action-link">🏏 Find Cricsal</Link>
<Link to="/bookings" className="action-link">📅 My Bookings</Link>
<Link to="/support" className="action-link">💬 Support</Link>

            </div>
          </div>
        </div>

        {/* ✅ terms/privacy routes not in App.jsx, so remove links OR point to landing for now */}
        <footer className="profile-footer">
          © 2026 CricBook • <Link to="/">Terms</Link> • <Link to="/">Privacy</Link>
        </footer>
      </div>
    </div>
  );
}
