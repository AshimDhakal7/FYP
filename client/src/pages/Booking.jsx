import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Booking.css";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function Bookings() {
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("accessToken") ||
          localStorage.getItem("authToken") ||
          localStorage.getItem("userToken");

        // If your API isn’t ready yet, page still works with empty list.
        if (!token) {
          setBookings([]);
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/api/bookings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          // fallback to empty if endpoint not implemented yet
          setBookings([]);
          setLoading(false);
          return;
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.bookings || [];
        setBookings(list);
      } catch (e) {
        setError("Could not load bookings.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <div className="bk-page">
      <div className="bk-container">
        <div className="bk-header card">
          <div>
            <h1>My Bookings</h1>
            <p>View your upcoming and past cricsal bookings.</p>
          </div>

          <div className="bk-actions">
            <Link to="/find-cricsal" className="bk-btn bk-btn-primary">
              Book New Slot
            </Link>
            <Link to="/home" className="bk-btn bk-btn-outline">
              ← Back to Home
            </Link>
          </div>
        </div>

        <div className="card bk-card">
          <div className="bk-card-head">
            <h2>Bookings List</h2>
            <Link to="/profile" className="bk-link">
              Go to Profile →
            </Link>
          </div>

          {loading ? (
            <div className="bk-muted">Loading bookings...</div>
          ) : error ? (
            <div className="bk-error">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="bk-empty">
              <div>
                <div className="bk-empty-title">No bookings yet</div>
                <div className="bk-muted">Book your first slot to see it here.</div>
              </div>
              <Link to="/find-cricsal" className="bk-btn bk-btn-primary">
                Find Cricsal
              </Link>
            </div>
          ) : (
            <div className="bk-list">
              {bookings.map((b) => (
                <div key={b._id || `${b.date}-${b.slot}`} className="bk-row">
                  <div className="bk-main">
                    <div className="bk-title">
                      {b?.ground?.name || b?.groundName || "Cricsal Booking"}
                    </div>
                    <div className="bk-sub">
                      {b?.date || b?.startTime || "Date"} • {b?.slot || b?.time || "Time"}
                    </div>
                  </div>

                  <span className={`bk-badge ${String(b?.status || "pending").toLowerCase()}`}>
                    {b?.status || "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <footer className="bk-footer">
          © 2026 CricBook • <Link to="/">Terms</Link> • <Link to="/">Privacy</Link>
        </footer>
      </div>
    </div>
  );
}
