// import React, { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [menuOpen, setMenuOpen] = useState(false);

//   // Safe user parse
//   let user = null;
//   try {
//     user = JSON.parse(localStorage.getItem("user") || "null");
//   } catch {
//     user = null;
//   }

//   const isAuthPage =
//     location.pathname === "/login" ||
//     location.pathname === "/signup" ||
//     location.pathname.startsWith("/reset-password") ||
//     location.pathname === "/forgot-password" ||
//     location.pathname === "/verify-otp";

//   const onLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setMenuOpen(false);
//     navigate("/login");
//   };

//   useEffect(() => {
//     setMenuOpen(false);
//   }, [location.pathname]);

//   return (
// <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-gray-200 bg-white/90 backdrop-blur">
// {/* ✅ IMPORTANT: same max-w as your landing page */}
//       <div className="mx-auto max-w-6xl px-4 sm:px-6">
//         <div className="flex h-16 items-center justify-between">
//           {/* Left */}
//           <Link to="/" className="flex items-center gap-3">
//             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold">
//               CB
//             </div>
//             <span className="text-base font-semibold text-gray-900">CricBook</span>
//           </Link>

//           {/* Desktop Right */}
//           <div className="hidden items-center gap-3 md:flex">
//             {user ? (
//               <>
//                 <Link
//                   to={user?.role === "owner" ? "/owner/dashboard" : "/dashboard"}
//                   className="text-sm font-medium text-gray-700 hover:text-gray-900"
//                 >
//                   Dashboard
//                 </Link>

//                 <Link
//                   to="/profile"
//                   className="text-sm font-medium text-gray-700 hover:text-gray-900"
//                 >
//                   Profile
//                 </Link>

//                 <button
//                   onClick={onLogout}
//                   className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 {!isAuthPage && (
//                   <Link
//                     to="/login"
//                     className="text-sm font-medium text-gray-700 hover:text-gray-900"
//                   >
//                     Login
//                   </Link>
//                 )}

//                 <Link
//                   to="/signup"
//                   className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
//                 >
//                   Create Account
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Mobile button */}
//           <button
//             type="button"
//             onClick={() => setMenuOpen((v) => !v)}
//             className="md:hidden inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
//             aria-label="Toggle menu"
//             aria-expanded={menuOpen}
//           >
//             {menuOpen ? (
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                 <path
//                   d="M6 6L18 18M18 6L6 18"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                 />
//               </svg>
//             ) : (
//               <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                 <path
//                   d="M4 6H20M4 12H20M4 18H20"
//                   stroke="currentColor"
//                   strokeWidth="2"
//                   strokeLinecap="round"
//                 />
//               </svg>
//             )}
//           </button>
//         </div>
//       </div>

//       {/* Mobile dropdown */}
//       {menuOpen && (
//         <div className="md:hidden border-t border-gray-200 bg-white">
//           <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3">
//             <div className="flex flex-col gap-2">
//               {user ? (
//                 <>
//                   <Link
//                     to={user?.role === "owner" ? "/owner/dashboard" : "/dashboard"}
//                     className="rounded-xl px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
//                   >
//                     Dashboard
//                   </Link>
//                   <Link
//                     to="/profile"
//                     className="rounded-xl px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
//                   >
//                     Profile
//                   </Link>
//                   <button
//                     onClick={onLogout}
//                     className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50"
//                   >
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   {!isAuthPage && (
//                     <Link
//                       to="/login"
//                       className="rounded-xl px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
//                     >
//                       Login
//                     </Link>
//                   )}
//                   <Link
//                     to="/signup"
//                     className="rounded-xl bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-green-700"
//                   >
//                     Create Account
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }
import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

import logo from "../assets/images/cricbooklogo.png"

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);

  // Safe user parse
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  const isLanding = location.pathname === "/";

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/verify-otp";

  const navLinks = useMemo(
    () => [
      { label: "Home", href: "#top" },
      { label: "About Us", href: "#about" },
      { label: "Featured", href: "#featured" },
      { label: "Contact", href: "#contact" },
    ],
    []
  );

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/login");
  };

  const goToHash = (hash) => {
    // If not on landing, go to landing first then scroll
    if (!isLanding) {
      navigate(`/${hash}`);
      return;
    }
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setSignupOpen(false);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const onDocClick = (e) => {
      if (!e.target.closest("[data-signup-dropdown]")) setSignupOpen(false);
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
<header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/20 bg-white/40 backdrop-blur-xl h-16">
<div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo -> always back to landing */}
          <button
  onClick={() => navigate("/")}
  className="flex items-center gap-2 group"
  aria-label="Go to home"
>
  {/* Cricket Ball */}
  <div className="relative w-4 h-4 rounded-full bg-red-600 shadow-sm overflow-hidden group-hover:scale-110 transition">

    {/* seam line */}
    <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-[2px] bg-white opacity-90"></div>

    {/* seam stitches */}
    <div className="absolute left-1/2 top-[2px] -translate-x-1/2 w-[6px] h-[2px] bg-white rounded"></div>
    <div className="absolute left-1/2 top-[6px] -translate-x-1/2 w-[6px] h-[2px] bg-white rounded"></div>
    <div className="absolute left-1/2 top-[10px] -translate-x-1/2 w-[6px] h-[2px] bg-white rounded"></div>

  </div>

  {/* Brand Name */}
  <h1 className="text-2xl font-extrabold tracking-tight">
    <span className="text-green-700">Cric</span>
    <span className="text-orange-500">Book</span>
  </h1>
</button>



          {/* Desktop links */}
          <div className="hidden items-center gap-6 md:flex">
            {/* Only show landing section links when user is not logged in (or even if logged in) */}
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
            {user ? (
              <>
                <Link
                  to={user?.role === "owner" ? "/owner/dashboard" : "/home"}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Dashboard
                </Link>

                <Link
                  to="/profile"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Profile
                </Link>

                <button
                  onClick={onLogout}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
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

                {/* Signup dropdown */}
                <div className="relative" data-signup-dropdown>
                  <button
                    type="button"
                    onClick={() => setSignupOpen((v) => !v)}
                    className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
                  >
                    Sign up
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
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

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M4 6H20M4 12H20M4 18H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
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
                  type="button"
                >
                  {l.label}
                </button>
              ))}

              <div className="h-px bg-gray-200 my-2" />

              {user ? (
                <>
                  <Link
                    to={user?.role === "owner" ? "/owner/dashboard" : "/dashboard"}
                    className="rounded-xl px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    className="rounded-xl px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={onLogout}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-left text-sm font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {!isAuthPage && (
                    <Link
                      to="/login"
                      className="rounded-xl px-3 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50"
                    >
                      Login
                    </Link>
                  )}

                  <Link
                    to="/signup?role=user"
                    className="rounded-xl bg-green-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-green-700"
                  >
                    Sign up as User
                  </Link>

                  <Link
                    to="/signup?role=owner"
                    className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-center text-sm font-semibold text-gray-900 hover:bg-gray-50"
                  >
                    Sign up as Ground Owner
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
