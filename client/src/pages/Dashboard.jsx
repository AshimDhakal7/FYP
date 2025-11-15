import React from "react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  return (
    <div className="container" style={{ padding:40 }}>
      <h2>Welcome {user?.name || user?.email || "Player"}</h2>
      <p>This is a minimal Dashboard. Build booking flows, user profile, or admin pages from here.</p>
    </div>
  );
}
