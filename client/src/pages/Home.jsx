// client/src/pages/Home.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();

  // Get user from localStorage
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  // If not logged in -> go landing/login
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  // ===== Demo placeholders (replace with API later) =====
  const [search, setSearch] = useState("");
  const [upcomingBookings] = useState([]); // replace with API results
  const [favorites] = useState([
    { id: "g1", name: "Green Turf Cricsal", area: "Kathmandu", price: 1200 },
    { id: "g2", name: "Royal Indoor Arena", area: "Lalitpur", price: 1500 },
  ]);
  const [notifications] = useState([
    { id: "n1", text: "Welcome to CricBook 🎉 Your account is ready.", type: "info" },
  ]);

  const loyaltyPoints = 0; // replace with user.points or API
  const totalBookings = upcomingBookings.length;
  const lastLogin = "Today";

  const firstName = (user?.name || "User").split(" ")[0];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true }); // landing page
  };

  const filteredFavorites = favorites.filter((g) =>
    (g.name + " " + g.area).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-page">
      {/* ===== Header (Logout only here) ===== */}
      <header className="home-topbar">
        <div className="home-brand">
          <div className="home-logo">CB</div>
          <div className="home-brand-text">
            <div className="home-brand-title">CricBook</div>
            <div className="home-brand-sub">User Dashboard</div>
          </div>
        </div>

        <nav className="home-nav">
          <Link to="/home" className="home-nav-link">Home</Link>
          <Link to="/find-cricsal" className="home-nav-link">Find Cricsal</Link>
          <Link to="/bookings" className="home-nav-link">My Bookings</Link>
          <Link to="/profile" className="home-nav-link">Profile</Link>
        </nav>

        <button className="home-btn-outline" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* ===== Main ===== */}
      <main className="home-wrap">
        {/* ===== Left column ===== */}
        <section className="home-col">
          {/* Welcome / Hero Card (NO logout here) */}
          <div className="card card-hero">
            <div className="hero-left">
              <h2 className="hero-title">Welcome back, {firstName} 👋</h2>
              <p className="muted hero-sub">
                Quickly find cricsals, book slots, and manage your bookings from one place.
              </p>

              <div className="hero-actions">
                <Link className="home-btn" to="/find-cricsal">Find Cricsal</Link>
                <Link className="home-btn-ghost" to="/bookings">My Bookings</Link>
              </div>

              <div className="hero-meta">
                <div className="hero-meta-item">
                  <span className="meta-label">Email</span>
                  <span className="meta-value">{user?.email || "—"}</span>
                </div>
                <div className="hero-meta-item">
                  <span className="meta-label">Role</span>
                  <span className="meta-value">{user?.role || "user"}</span>
                </div>
              </div>
            </div>

            <div className="hero-right">
              <div className="mini-stat">
                <span className="mini-stat-label">Total bookings</span>
                <b className="mini-stat-value">{totalBookings}</b>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-label">Loyalty points</span>
                <b className="mini-stat-value">{loyaltyPoints}</b>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-label">Last login</span>
                <b className="mini-stat-value">{lastLogin}</b>
              </div>
            </div>
          </div>

          {/* Search & Quick book */}
          <div className="card">
            <div className="card-head">
              <h3>Find & Book</h3>
              <p className="muted">Search by name, area, or features.</p>
            </div>

            <div className="search-row">
              <input
                className="input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search cricsals… (e.g. turf, Kathmandu, indoor)"
              />
              <Link className="home-btn" to="/find-cricsal">
                Search
              </Link>
            </div>

            <div className="quick-actions">
              <Link className="chip" to="/find-cricsal">🏏 Book a Slot</Link>
              <Link className="chip" to="/bookings">📅 View Bookings</Link>
              <Link className="chip" to="/profile">👤 Update Profile</Link>
              <Link className="chip" to="/support">💬 Support</Link>
            </div>
          </div>

          {/* Upcoming bookings */}
          <div className="card">
            <div className="card-head">
              <h3>Upcoming Bookings</h3>
              <p className="muted">Your next bookings appear here.</p>
            </div>

            {upcomingBookings.length === 0 ? (
              <div className="empty">
                <div className="empty-box">
                  <p className="empty-title">No bookings yet</p>
                  <p className="muted">
                    Book your first slot in under a minute.
                  </p>
                </div>
                <Link className="home-btn" to="/find-cricsal">
                  Book a Cricsal
                </Link>
              </div>
            ) : (
              <div className="list">
                {upcomingBookings.map((b) => (
                  <div key={b._id} className="list-item">
                    <div>
                      <div className="list-title">{b.groundName}</div>
                      <div className="muted">
                        {b.date} • {b.time} • {b.area}
                      </div>
                    </div>
                    <div className="list-actions">
                      <button className="mini-btn">View</button>
                      <button className="mini-btn">Reschedule</button>
                      <button className="mini-btn danger">Cancel</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent activity */}
          <div className="card">
            <div className="card-head">
              <h3>Recent Activity</h3>
              <p className="muted">Payments, cancellations, reminders.</p>
            </div>

            <div className="empty-box">
              <p className="muted">Nothing new.</p>
            </div>
          </div>
        </section>

        {/* ===== Right column ===== */}
        <aside className="home-aside">
          {/* Notifications */}
          <div className="card">
            <div className="card-head">
              <h3>Notifications</h3>
              <p className="muted">Important updates.</p>
            </div>

            {notifications.length === 0 ? (
              <div className="empty-box">
                <p className="muted">No notifications.</p>
              </div>
            ) : (
              <div className="notif-list">
                {notifications.map((n) => (
                  <div key={n.id} className={`notif notif-${n.type || "info"}`}>
                    {n.text}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Favorites / Saved cricsals */}
          <div className="card">
            <div className="card-head">
              <h3>Saved Cricsals</h3>
              <p className="muted">Your favorites for quick booking.</p>
            </div>

            {filteredFavorites.length === 0 ? (
              <div className="empty-box">
                <p className="muted">No saved grounds found.</p>
              </div>
            ) : (
              <div className="fav-grid">
                {filteredFavorites.slice(0, 4).map((g) => (
                  <div key={g.id} className="fav-card">
                    <div className="fav-title">{g.name}</div>
                    <div className="muted">{g.area}</div>
                    <div className="fav-price">From Rs. {g.price}</div>
                    <Link className="mini-link" to="/find-cricsal">
                      Book now →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Help / FAQ */}
          <div className="card">
            <div className="card-head">
              <h3>Help</h3>
              <p className="muted">Common questions.</p>
            </div>

            <div className="faq">
              <details>
                <summary>How do I book a slot?</summary>
                <p className="muted">
                  Go to <b>Find Cricsal</b>, select a ground, choose date/time, and confirm.
                </p>
              </details>

              <details>
                <summary>Can I cancel or reschedule?</summary>
                <p className="muted">
                  Yes—open <b>My Bookings</b> and choose cancel/reschedule (policy may apply).
                </p>
              </details>

              <details>
                <summary>Where do I see my booking history?</summary>
                <p className="muted">
                  Go to <b>My Bookings</b> to view upcoming and past bookings.
                </p>
              </details>
            </div>

            <div className="support-links">
              <Link to="/support" className="mini-link">Contact Support →</Link>
            </div>
          </div>
        </aside>
      </main>

      <footer className="home-footer">
        <span className="muted">© {new Date().getFullYear()} CricBook</span>
        <span className="muted">•</span>
        <Link className="mini-link" to="/terms">Terms</Link>
        <span className="muted">•</span>
        <Link className="mini-link" to="/privacy">Privacy</Link>
      </footer>
    </div>
  );
}
