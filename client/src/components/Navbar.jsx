import React, { useEffect, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "../styles/navbar.css";


export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);


  const [mobileOpen, setMobileOpen] = useState(false);


  const ROUTES = {
    HOME: "/home",
    LANDING: "/",
    FIND: "/find-cricsal",
    BOOKINGS: "/bookings",
    PROFILE: "/profile",
    LOGIN: "/login",
    SIGNUP: "/signup",
  };

  useEffect(() => {
    setOpen(false);
    setMobileOpen(false);
  }, [location.pathname, location.search]);

  // Pages
  const isLanding = location.pathname === "/";
  const isAuthPage =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/verify-otp") ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/reset-password");

  // Robust login detection
  const isLoggedIn = useMemo(() => {
    const hasToken =
      !!localStorage.getItem("token") ||
      !!localStorage.getItem("accessToken") ||
      !!localStorage.getItem("authToken") ||
      !!localStorage.getItem("userToken");

    let hasUser = false;
    try {
      const u = localStorage.getItem("user");
      hasUser = !!u && u !== "null" && u !== "undefined";
    } catch {
      hasUser = false;
    }
    return hasToken || hasUser;
  }, [location.pathname]);

  // Hide navbar on auth pages
  if (isAuthPage) return null;

  const goSignupUser = () => {
    setOpen(false);
    setMobileOpen(false);
    navigate("/signup?role=user");
  };

  const goSignupOwner = () => {
    setOpen(false);
    setMobileOpen(false);
    navigate("/signup?role=owner");
  };

  const handleLogout = () => {
    ["token", "accessToken", "authToken", "userToken", "user"].forEach((k) =>
      localStorage.removeItem(k)
    );
    setOpen(false);
    setMobileOpen(false);
    navigate("/", { replace: true });
  };

  // ✅ Active class helper (works even if your CSS only styles ".nav-link.active")
  const linkClass = ({ isActive }) => `nav-link ${isActive ? "active" : ""}`;

  return (
    <header className="nav" onMouseLeave={() => setOpen(false)}>
      <div className="nav-inner">
        {/* Brand */}
        <Link
          to={isLoggedIn ? ROUTES.HOME : ROUTES.LANDING}
          className="nav-brand"
          onClick={() => {
            setOpen(false);
            setMobileOpen(false);
          }}
        >
          <span className="nav-logo">CB</span>
          <span className="nav-name">CricBook</span>
        </Link>

        {/* ✅ ESSENTIAL: Mobile hamburger (adds usability, does not modify existing links) */}
        <button
          type="button"
          className="nav-hamburger"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          ☰
        </button>

        {/* LINKS */}
        <nav className={`nav-links ${mobileOpen ? "open" : ""}`}>
          {/* ✅ Landing links */}
          {isLanding && (
            <>
              <NavLink to={ROUTES.LANDING} className={linkClass}>
                Home
              </NavLink>

              {/* ✅ FIXED to match your App.jsx route */}
              <NavLink to={ROUTES.FIND} className={linkClass}>
                Find Cricsal
              </NavLink>

              <a className="nav-link" href="#why">
                Why CricBook
              </a>
              <a className="nav-link" href="#featured">
                Featured
              </a>
              <a className="nav-link" href="#about">
                About
              </a>
              <a className="nav-link" href="#contact">
                Contact
              </a>
            </>
          )}

          {/* ✅ Logged-in app links (NO landing anchors, NO login/create) */}
          {!isLanding && isLoggedIn && (
            <>
              <NavLink to={ROUTES.HOME} className={linkClass}>
                Home
              </NavLink>

              {/* ✅ FIXED to match your App.jsx route */}
              <NavLink to={ROUTES.FIND} className={linkClass}>
                Find Cricsal
              </NavLink>

              <NavLink to={ROUTES.BOOKINGS} className={linkClass}>
                My Bookings
              </NavLink>

              <NavLink to={ROUTES.PROFILE} className={linkClass}>
                Profile
              </NavLink>
            </>
          )}

          {/* ✅ Not logged-in but on other pages (rare) */}
          {!isLanding && !isLoggedIn && (
            <>
              <NavLink to={ROUTES.LANDING} className={linkClass}>
                Home
              </NavLink>

              <NavLink to={ROUTES.FIND} className={linkClass}>
                Find Cricsal
              </NavLink>
            </>
          )}
        </nav>

        {/* ACTIONS */}
        <div className="nav-actions">
          {/* ✅ Landing page ALWAYS shows Login/Create */}
          {isLanding ? (
            <>
              <button
                className="btn ghost"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Login
              </button>

              <div className="dropdown">
                <button
                  className="btn white"
                  type="button"
                  onClick={() => setOpen((v) => !v)}
                >
                  Create Account <span className="caret">▾</span>
                </button>

                {open && (
                  <div className="menu">
                    <button className="menu-item" onClick={goSignupUser}>
                      Sign up as User
                      <span className="menu-sub">
                        Book courts & manage bookings
                      </span>
                    </button>

                    <button className="menu-item" onClick={goSignupOwner}>
                      Sign up as Ground Owner
                      <span className="menu-sub">
                        Manage grounds & time slots
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* ✅ Non-landing pages: Logout only if logged in */}
              {isLoggedIn ? (
                <button className="btn ghost" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <>
                  <button
                    className="btn ghost"
                    onClick={() => navigate(ROUTES.LOGIN)}
                  >
                    Login
                  </button>

                  <div className="dropdown">
                    <button
                      className="btn white"
                      type="button"
                      onClick={() => setOpen((v) => !v)}
                    >
                      Create Account <span className="caret">▾</span>
                    </button>

                    {open && (
                      <div className="menu">
                        <button className="menu-item" onClick={goSignupUser}>
                          Sign up as User
                          <span className="menu-sub">
                            Book courts & manage bookings
                          </span>
                        </button>

                        <button className="menu-item" onClick={goSignupOwner}>
                          Sign up as Ground Owner
                          <span className="menu-sub">
                            Manage grounds & time slots
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
