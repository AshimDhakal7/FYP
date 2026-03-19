import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  // ✅ user state (reactive)
  const [userState, setUserState] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  // ✅ auth token
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    "";

  const isLoggedIn = Boolean(token);

  const isLanding = location.pathname === "/";
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/verify-otp";

  const showAuthedControls = isLoggedIn && !isLanding && !isAuthPage;

  const navLinks = useMemo(
    () => [
      { label: "Home", href: "#top" },
      { label: "About Us", href: "#about" },
      { label: "Featured", href: "#featured" },
      { label: "Contact", href: "#contact" },
    ],
    []
  );

  // ✅ initials fallback
  const initials = useMemo(() => {
    const raw = userState?.name || userState?.email || "U";
    const parts = String(raw).trim().split(" ");
    const a = parts[0]?.[0] || "U";
    const b = parts[1]?.[0] || "";
    return (a + b).toUpperCase();
  }, [userState]);

  // profile pic
  const profilePic = userState?.profilePicture
  ? userState.profilePicture.startsWith("http")
    ? userState.profilePicture
    : `http://localhost:5001${userState.profilePicture}`
  : null;

  // ✅ logout
  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/login", { replace: true });
  };

  // ✅ hash navigation fix
  const goToHash = (hash) => {
    const id = hash.replace("#", "");

    if (!isLanding) {
      navigate(`/${hash}`);
      return;
    }

    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // ✅ close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setSignupOpen(false);
  }, [location.pathname]);

  // ✅ close dropdown outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest("[data-signup-dropdown]")) {
        setSignupOpen(false);
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // ✅ sync navbar when profile updates
  useEffect(() => {
    const syncUser = () => {
      try {
        const updated = JSON.parse(localStorage.getItem("user") || "null");
        setUserState(updated);
      } catch {
        setUserState(null);
      }
    };

    window.addEventListener("storage", syncUser);
    window.addEventListener("userUpdated", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("userUpdated", syncUser);
    };
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/20 bg-white/40 backdrop-blur-xl h-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">

          {/* Logo (UNCHANGED) */}
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 group"
            aria-label="Go to home"
            type="button"
          >
            <div className="relative w-4 h-4 rounded-full bg-red-600 shadow-sm overflow-hidden group-hover:scale-110 transition">
              <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-[2px] bg-white opacity-90"></div>
              <div className="absolute left-1/2 top-[2px] -translate-x-1/2 w-[6px] h-[2px] bg-white rounded"></div>
              <div className="absolute left-1/2 top-[6px] -translate-x-1/2 w-[6px] h-[2px] bg-white rounded"></div>
              <div className="absolute left-1/2 top-[10px] -translate-x-1/2 w-[6px] h-[2px] bg-white rounded"></div>
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight">
              <span className="text-green-700">Cric</span>
              <span className="text-orange-500">Book</span>
            </h1>
          </button>

          {/* Desktop links */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((l) => (
              <button
                key={l.href}
                onClick={() => goToHash(l.href)}
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
                type="button"
              >
                {l.label}
              </button>
            ))}
          </div>

          {/* Desktop right */}
          <div className="hidden items-center gap-3 md:flex">
            {showAuthedControls ? (
              <>
                {/* ✅ Profile (IMAGE or initials) */}
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white text-sm font-extrabold shadow-sm hover:bg-green-800 transition overflow-hidden"
                  title="Profile"
                >
                  {profilePic ? (
                  <img
                  src={profilePic}
                  alt="profile"
                  className="h-full w-full object-cover"
                />
                  ) : (
                    initials
                  )}
                </button>

                {/* ✅ GREEN LOGOUT */}
                <button
                  onClick={onLogout}
                  className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition"
                  type="button"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {!isAuthPage && (
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900"
                  >
                    Login
                  </Link>
                )}

                <div className="relative" data-signup-dropdown>
                  <button
                    type="button"
                    onClick={() => setSignupOpen((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
                  >
                    Sign up
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>

                  {signupOpen && (
                    <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
                      <button
                        type="button"
                        onClick={() => navigate("/signup?role=user")}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
                      >
                        Sign up as User
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate("/signup?role=owner")}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
                      >
                        Sign up as Ground Owner
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile button */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3">
            <div className="flex flex-col gap-2">

              {navLinks.map((l) => (
                <button
                  key={l.href}
                  onClick={() => {
                    setMenuOpen(false);
                    goToHash(l.href);
                  }}
                  className="rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
                >
                  {l.label}
                </button>
              ))}

              <div className="h-px bg-gray-200 my-2" />

              {showAuthedControls ? (
                <>
                  <button
                    onClick={() => navigate("/profile")}
                    className="rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    Profile
                  </button>

                  <button
                    onClick={onLogout}
                    className="rounded-xl bg-green-600 px-3 py-2 text-left text-sm font-semibold text-white hover:bg-green-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}