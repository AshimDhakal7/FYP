import React, { useEffect, useState } from "react";
import "../styles/dashboard.css";
import { getCurrentUser } from "../utils/auth";
import api from "../utils/api";

export default function Dashboard() {
  const user = getCurrentUser();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.get("/api/bookings", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBookings(res.data);
    } catch (e) {
      console.log("failed to load bookings");
    }
  };

  return (
    <div className="dashboard-page">
      <h1>Hello {user?.name?.split(" ")[0]} 👋</h1>
      <p>Here are your upcoming bookings:</p>

      <div className="booking-list">
        {bookings.length === 0 && (
          <p>No bookings yet.</p>
        )}

        {bookings.map((b) => (
          <div key={b._id} className="booking-item">
            <h3>{b.groundName}</h3>
            <p>Date: {b.date}</p>
            <p>Time: {b.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
