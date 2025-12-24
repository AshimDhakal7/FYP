import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [location.pathname, location.search]);

  const isLanding = location.pathname === "/";
  const isAuthPage =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/signup");

  // robust login detection
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

  const isLoggedIn = hasToken || hasUser;

  const goSignupUser = () => {
    setOpen(false);
    navigate("/signup?role=user");
  };

  const goSignupOwner = () => {
    setOpen(false);
    navigate("/signup?role=owner");
  };

  const handleLogout = () => {
    ["token", "accessToken", "authToken", "userToken", "user"].forEach((k) =>
      localStorage.removeItem(k)
    );
    setOpen(false);
    navigate("/", { replace: true }); // go back to landing after logout
  };

  return (
    <header className="nav" onMouseLeave={() => setOpen(false)}>
      <div className="nav-inner">
        {/* Brand */}
        <Link to="/" className="nav-brand">
          <span className="nav-logo">CB</span>
          <span className="nav-name">CricBook</span>
        </Link>

        {/* Links (hide on login/signup pages) */}
        {!isAuthPage && (
          <nav className="nav-links">
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>

            <NavLink to="/find" className="nav-link">
              Find Cricsal
            </NavLink>

            {isLanding && (
              <>
                <a className="nav-link" href="#why">Why CricBook</a>
                <a className="nav-link" href="#featured">Featured</a>
                <a className="nav-link" href="#about">About</a>
                <a className="nav-link" href="#contact">Contact</a>
              </>
            )}
          </nav>
        )}

        {/* Actions */}
        <div className="nav-actions">
          {/* ✅ Landing page ALWAYS shows Login/Create */}
          {isLanding ? (
            <>
              <button className="btn ghost" onClick={() => navigate("/login")}>
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
            /* ✅ Non-landing pages: show Logout only if logged in, else Login/Create */
            <>
              {isLoggedIn ? (
                <button className="btn ghost" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <>
                  <button
                    className="btn ghost"
                    onClick={() => navigate("/login")}
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
