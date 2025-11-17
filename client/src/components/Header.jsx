// src/components/Header.jsx
import React from "react";
import "../styles/header.css";

const Header = () => {
  return (
    <header className="header">
      <div className="header-inner">
        {/* Logo */}
        <div className="header-logo">
          CricBook
        </div>

        {/* Nav links */}
        <nav className="header-nav">
          <a href="/" className="header-link">
            Home
          </a>
          <a href="/find" className="header-link">
            Find Cricsal
          </a>
        </nav>

        {/* Right side buttons */}
        <div className="header-actions">
          <a href="/login" className="header-btn header-btn--outline">
            Login
          </a>
          <a href="/signup" className="header-btn header-btn--solid">
            Sign Up
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
