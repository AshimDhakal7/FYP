import React from "react";
import { Link } from "react-router-dom";
import "../styles/header.css";

export default function Header() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <Link to="/">CricBook</Link>
        </div>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/find">Find Cricsal</Link>
          {!user ? (
            <>
              <Link to="/login" className="btn-small">Login</Link>
              <Link to="/signup" className="btn-small outline">Sign Up</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <button className="btn-small" onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
