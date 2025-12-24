import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    const loadMe = async () => {
      try {
        // If /me exists, this keeps user fresh + fixes name always
        const res = await api.get("/api/auth/me");
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
      } catch (e) {
        // fallback: stay with localStorage user
        // if you want strict auth, uncomment below:
        // localStorage.removeItem("token");
        // localStorage.removeItem("user");
        // navigate("/login", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadMe();
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  const username = user?.name || "User";
  const email = user?.email || "—";
  const role = user?.role || "user";

  if (loading) {
    return (
      <div className="home-page">
        <div className="home-shell">
          <p className="home-muted">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home-page">
      {/* content starts UNDER your existing header */}
      <div className="home-shell">
        <div className="home-grid">
          {/* LEFT: Welcome + main content */}
          <section className="home-main">
            <div className="welcome">
              <h1 className="welcome-title">Welcome, {username} 👋</h1>
              <p className="welcome-sub">
                You’re logged in to <b>CricBook</b>. Manage your bookings and explore grounds.
              </p>

              <div className="welcome-meta">
                <div className="meta-row">
                  <span className="meta-k">Email</span>
                  <span className="meta-v">{email}</span>
                </div>
                <div className="meta-row">
                  <span className="meta-k">Role</span>
                  <span className="meta-v">{role}</span>
                </div>
              </div>
            </div>

            <div className="section">
              <div className="section-head">
                <h2 className="section-title">Your Dashboard</h2>
                <button className="btn outline" onClick={logout}>
                  Logout
                </button>
              </div>

              <div className="cards">
                <div className="card">
                  <h3>Upcoming Bookings</h3>
                  <p className="muted">
                    Show the next 3 bookings here (date, time, ground, status).
                  </p>
                  <div className="empty">No bookings yet.</div>
                  <button className="btn primary" onClick={() => navigate("/find")}>
                    Book a Ground
                  </button>
                </div>

                <div className="card">
                  <h3>Notifications</h3>
                  <p className="muted">
                    Payment updates, cancellations, reminders, and announcements.
                  </p>
                  <div className="empty">Nothing new.</div>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: standard website “sidebar” */}
          <aside className="home-side">
            <div className="card">
              <h3>Quick Actions</h3>
              <div className="actions">
                <button className="btn primary" onClick={() => navigate("/find")}>
                  Find Cricsal
                </button>
                <button className="btn ghost" onClick={() => navigate("/my-bookings")}>
                  My Bookings
                </button>
                <button className="btn ghost" onClick={() => navigate("/profile")}>
                  Profile
                </button>
              </div>
            </div>

            <div className="card">
              <h3>Stats</h3>
              <div className="stats">
                <div className="stat">
                  <span className="stat-k">Total bookings</span>
                  <span className="stat-v">0</span>
                </div>
                <div className="stat">
                  <span className="stat-k">Loyalty points</span>
                  <span className="stat-v">0</span>
                </div>
                <div className="stat">
                  <span className="stat-k">Last login</span>
                  <span className="stat-v">Today</span>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Help</h3>
              <p className="muted">
                Add FAQs, contact, or “How booking works” here for a professional look.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
