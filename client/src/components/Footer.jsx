import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer() {
  const { pathname } = useLocation();
  const isLanding = pathname === "/";

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-left">
          <div className="footer-brand">
            <span className="footer-badge">CB</span>
            <span className="footer-title">CricBook</span>
          </div>
          <p className="footer-sub">
            Book indoor cricket courts faster. Simple for players, powerful for ground owners.
          </p>
          <p className="footer-copy">© {new Date().getFullYear()} CricBook. All rights reserved.</p>
        </div>

        <div className="footer-right">
          {isLanding ? (
            <div className="footer-links">
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="#featured">Featured</a>
              <a href="#why">Why CricBook</a>
            </div>
          ) : (
            <div className="footer-links">
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/find">Find Cricsal</Link>
              <Link to="/">Home</Link>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
