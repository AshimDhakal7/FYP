import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import "../styles/BookCricsal.css";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";

export default function BookCricsal() {
  const { cricsalId } = useParams();
  const navigate = useNavigate();

  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [hours, setHours] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const token = useMemo(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      localStorage.getItem("userToken") ||
      ""
    );
  }, []);

  const timeSlots = [
    "06:00 - 07:00",
    "07:00 - 08:00",
    "08:00 - 09:00",
    "09:00 - 10:00",
    "10:00 - 11:00",
    "11:00 - 12:00",
    "12:00 - 13:00",
    "13:00 - 14:00",
    "14:00 - 15:00",
    "15:00 - 16:00",
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
  ];

  const handleConfirm = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!date || !slot) {
      setMsg("Please select date and time slot.");
      return;
    }

    setLoading(true);
    try {
      // ✅ Backend endpoint (recommended):
      // POST /api/bookings
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cricsalId,
          date,
          slot,
          hours: Number(hours),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMsg(data?.message || "Booking failed. (Backend route missing?)");
        setLoading(false);
        return;
      }

      // ✅ success
      navigate("/bookings");
    } catch (err) {
      setMsg("Server error. Check backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bc-page">
      <div className="bc-container">
        <div className="bc-header card">
          <div>
            <h1>Book Cricsal</h1>
            <p>Select date & time to confirm your booking.</p>
          </div>

          <div className="bc-actions">
            <Link className="bc-btn bc-outline" to="/find-cricsal">
              ← Back to Browse
            </Link>
            <Link className="bc-btn bc-outline" to="/home">
              Home
            </Link>
          </div>
        </div>

        <div className="card">
          <form className="bc-form" onSubmit={handleConfirm}>
            <label>
              Date
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>

            <label>
              Time Slot
              <select value={slot} onChange={(e) => setSlot(e.target.value)}>
                <option value="">Select slot</option>
                {timeSlots.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Duration (hours)
              <select value={hours} onChange={(e) => setHours(e.target.value)}>
                {[1, 2, 3].map((h) => (
                  <option key={h} value={h}>
                    {h} hour{h > 1 ? "s" : ""}
                  </option>
                ))}
              </select>
            </label>

            {msg && <div className="bc-msg">{msg}</div>}

            <button className="bc-btn bc-primary" disabled={loading}>
              {loading ? "Confirming..." : "Confirm Booking"}
            </button>

            <div className="bc-note">
              Tip: If backend isn’t implemented yet, you can still demo this page and then connect the API later.
            </div>
          </form>
        </div>

        <footer className="bc-footer">
          © 2026 CricBook • <Link to="/">Terms</Link> • <Link to="/">Privacy</Link>
        </footer>
      </div>
    </div>
  );
}
