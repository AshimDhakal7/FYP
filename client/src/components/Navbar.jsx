// // import React, { useEffect, useMemo, useState } from "react";
// // import { Link, useLocation, useNavigate } from "react-router-dom";

// // export default function Navbar() {
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   const [menuOpen, setMenuOpen] = useState(false);
// //   const [signupOpen, setSignupOpen] = useState(false);

// //   // ✅ user state (reactive)
// //   const [userState, setUserState] = useState(() => {
// //     try {
// //       return JSON.parse(localStorage.getItem("user") || "null");
// //     } catch {
// //       return null;
// //     }
// //   });

// //   // ✅ auth token
// //   const token =
// //     localStorage.getItem("token") ||
// //     localStorage.getItem("accessToken") ||
// //     localStorage.getItem("authToken") ||
// //     "";

// //   const isLoggedIn = Boolean(token);

// //   const isLanding = location.pathname === "/";
// //   const isAuthPage =
// //     location.pathname === "/login" ||
// //     location.pathname.startsWith("/signup") ||
// //     location.pathname.startsWith("/reset-password") ||
// //     location.pathname === "/forgot-password" ||
// //     location.pathname === "/verify-otp";

// //   const showAuthedControls = isLoggedIn && !isLanding && !isAuthPage;

// //   const navLinks = useMemo(
// //     () => [
// //       { label: "Home", href: "#top" },
// //       { label: "About Us", href: "#about" },
// //       { label: "Featured", href: "#featured" },
// //       { label: "Contact", href: "#contact" },
// //     ],
// //     []
// //   );

// //   // ✅ initials fallback
// //   const initials = useMemo(() => {
// //     const raw = userState?.name || userState?.email || "U";
// //     const parts = String(raw).trim().split(" ");
// //     const a = parts[0]?.[0] || "U";
// //     const b = parts[1]?.[0] || "";
// //     return (a + b).toUpperCase();
// //   }, [userState]);

// //   // profile pic
// //   const profilePic = userState?.profilePicture
// //   ? userState.profilePicture.startsWith("http")
// //     ? userState.profilePicture
// //     : `http://localhost:5001${userState.profilePicture}`
// //   : null;

// //   // ✅ logout
// //   const onLogout = () => {
// //     localStorage.removeItem("token");
// //     localStorage.removeItem("accessToken");
// //     localStorage.removeItem("authToken");
// //     localStorage.removeItem("user");
// //     setMenuOpen(false);
// //     navigate("/login", { replace: true });
// //   };

// //   // ✅ hash navigation fix
// //   const goToHash = (hash) => {
// //     const id = hash.replace("#", "");

// //     if (!isLanding) {
// //       navigate(`/${hash}`);
// //       return;
// //     }

// //     const el = document.getElementById(id);
// //     if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
// //   };

// //   // ✅ close menus on route change
// //   useEffect(() => {
// //     setMenuOpen(false);
// //     setSignupOpen(false);
// //   }, [location.pathname]);

// //   // ✅ close dropdown outside
// //   useEffect(() => {
// //     const onDocClick = (e) => {
// //       if (!e.target.closest("[data-signup-dropdown]")) {
// //         setSignupOpen(false);
// //       }
// //     };
// //     document.addEventListener("click", onDocClick);
// //     return () => document.removeEventListener("click", onDocClick);
// //   }, []);

// //   // ✅ sync navbar when profile updates
// //   useEffect(() => {
// //     const syncUser = () => {
// //       try {
// //         const updated = JSON.parse(localStorage.getItem("user") || "null");
// //         setUserState(updated);
// //       } catch {
// //         setUserState(null);
// //       }
// //     };

// //     window.addEventListener("storage", syncUser);
// //     window.addEventListener("userUpdated", syncUser);

// //     return () => {
// //       window.removeEventListener("storage", syncUser);
// //       window.removeEventListener("userUpdated", syncUser);
// //     };
// //   }, []);

// //   return (
// //     <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-white/20 bg-white/40 backdrop-blur-xl h-16">
// //       <div className="mx-auto max-w-6xl px-4 sm:px-6">
// //         <div className="flex h-16 items-center justify-between">

// //           {/* Logo (UNCHANGED) */}
// //           <button
// //             onClick={() => navigate("/")}
// //             className="flex items-center gap-2 group"
// //             aria-label="Go to home"
// //             type="button"
// //           >
// //             <div className="relative w-4 h-4 rounded-full bg-red-600 shadow-sm overflow-hidden group-hover:scale-110 transition">
// //               <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-[2px] bg-white opacity-90"></div>
// //               <div className="absolute left-1/2 top-[2px] -translate-x-1/2 w-[6px] h-[2px] bg-white rounded"></div>
// //               <div className="absolute left-1/2 top-[6px] -translate-x-1/2 w-[6px] h-[2px] bg-white rounded"></div>
// //               <div className="absolute left-1/2 top-[10px] -translate-x-1/2 w-[6px] h-[2px] bg-white rounded"></div>
// //             </div>

// //             <h1 className="text-2xl font-extrabold tracking-tight">
// //               <span className="text-green-700">Cric</span>
// //               <span className="text-orange-500">Book</span>
// //             </h1>
// //           </button>

// //           {/* Desktop links */}
// //           <div className="hidden items-center gap-6 md:flex">
// //             {navLinks.map((l) => (
// //               <button
// //                 key={l.href}
// //                 onClick={() => goToHash(l.href)}
// //                 className="text-sm font-medium text-gray-700 hover:text-gray-900"
// //                 type="button"
// //               >
// //                 {l.label}
// //               </button>
// //             ))}
// //           </div>

// //           {/* Desktop right */}
// //           <div className="hidden items-center gap-3 md:flex">
// //             {showAuthedControls ? (
// //               <>
// //                 {/* ✅ Profile (IMAGE or initials) */}
// //                 <button
// //                   type="button"
// //                   onClick={() => navigate("/profile")}
// //                   className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white text-sm font-extrabold shadow-sm hover:bg-green-800 transition overflow-hidden"
// //                   title="Profile"
// //                 >
// //                   {profilePic ? (
// //                   <img
// //                   src={profilePic}
// //                   alt="profile"
// //                   className="h-full w-full object-cover"
// //                 />
// //                   ) : (
// //                     initials
// //                   )}
// //                 </button>

// //                 {/* ✅ GREEN LOGOUT */}
// //                 <button
// //                   onClick={onLogout}
// //                   className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition"
// //                   type="button"
// //                 >
// //                   Logout
// //                 </button>
// //               </>
// //             ) : (
// //               <>
// //                 {!isAuthPage && (
// //                   <Link
// //                     to="/login"
// //                     className="text-sm font-medium text-gray-700 hover:text-gray-900"
// //                   >
// //                     Login
// //                   </Link>
// //                 )}

// //                 <div className="relative" data-signup-dropdown>
// //                   <button
// //                     type="button"
// //                     onClick={() => setSignupOpen((v) => !v)}
// //                     className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 transition"
// //                   >
// //                     Sign up
// //                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
// //                       <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
// //                     </svg>
// //                   </button>

// //                   {signupOpen && (
// //                     <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
// //                       <button
// //                         type="button"
// //                         onClick={() => navigate("/signup?role=user")}
// //                         className="w-full px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
// //                       >
// //                         Sign up as User
// //                       </button>
// //                       <button
// //                         type="button"
// //                         onClick={() => navigate("/signup?role=owner")}
// //                         className="w-full px-4 py-3 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
// //                       >
// //                         Sign up as Ground Owner
// //                       </button>
// //                     </div>
// //                   )}
// //                 </div>
// //               </>
// //             )}
// //           </div>

// //           {/* Mobile button */}
// //           <button
// //             type="button"
// //             onClick={() => setMenuOpen((v) => !v)}
// //             className="md:hidden inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50"
// //           >
// //             ☰
// //           </button>
// //         </div>
// //       </div>

// //       {/* Mobile menu */}
// //       {menuOpen && (
// //         <div className="md:hidden border-t border-gray-200 bg-white">
// //           <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3">
// //             <div className="flex flex-col gap-2">

// //               {navLinks.map((l) => (
// //                 <button
// //                   key={l.href}
// //                   onClick={() => {
// //                     setMenuOpen(false);
// //                     goToHash(l.href);
// //                   }}
// //                   className="rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
// //                 >
// //                   {l.label}
// //                 </button>
// //               ))}

// //               <div className="h-px bg-gray-200 my-2" />

// //               {showAuthedControls ? (
// //                 <>
// //                   <button
// //                     onClick={() => navigate("/profile")}
// //                     className="rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-800 hover:bg-gray-50"
// //                   >
// //                     Profile
// //                   </button>

// //                   <button
// //                     onClick={onLogout}
// //                     className="rounded-xl bg-green-600 px-3 py-2 text-left text-sm font-semibold text-white hover:bg-green-700"
// //                   >
// //                     Logout
// //                   </button>
// //                 </>
// //               ) : (
// //                 <>
// //                   <Link to="/login" className="px-3 py-2">
// //                     Login
// //                   </Link>
// //                 </>
// //               )}
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </header>
// //   );
// // }
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import NotificationBell from "./NotificationBell";

// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL ||
//   process.env.REACT_APP_API_BASE_URL ||
//   "";

// const NAVBAR_HEIGHT = 64;

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const signupRef = useRef(null);
//   const mobileMenuRef = useRef(null);
//   const mobileToggleRef = useRef(null);

//   // const getStoredUser = () => {
//   //   try {
//   //     return JSON.parse(localStorage.getItem("user") || "null");
//   //   } catch {
//   //     return null;
//   //   }
//   // };

//   // const getStoredToken = () =>
//   //   localStorage.getItem("token") ||
//   //   localStorage.getItem("accessToken") ||
//   //   localStorage.getItem("authToken") ||
//   //   "";
//   const getStoredAuth = () => {
//     try {
//       return JSON.parse(localStorage.getItem("auth") || "null");
//     } catch {
//       return null;
//     }
//   };
  
//   const getStoredUser = () => getStoredAuth()?.user || null;
  
//   const getStoredToken = () => getStoredAuth()?.token || "";
  
//   const getStoredRole = () => getStoredAuth()?.role || getStoredAuth()?.user?.role || "";

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [signupOpen, setSignupOpen] = useState(false);
//   const [imgError, setImgError] = useState(false);
//   const [userState, setUserState] = useState(getStoredUser);
//   const [token, setToken] = useState(getStoredToken);

//   const isLoggedIn = Boolean(token);
//   const isLanding = location.pathname === "/";

//   const isAuthPage =
//     location.pathname === "/login" ||
//     location.pathname === "/forgot-password" ||
//     location.pathname === "/verify-otp" ||
//     location.pathname.startsWith("/signup") ||
//     location.pathname.startsWith("/reset-password");

//   // Landing page must always stay public
//   const showAuthedControls = isLoggedIn && !isAuthPage && !isLanding;
//   const showGuestControls = !isAuthPage && (!isLoggedIn || isLanding);

//   const navLinks = useMemo(
//     () => [
//       { label: "Home", href: "#top" },
//       { label: "About Us", href: "#about" },
//       { label: "Featured", href: "#featured" },
//       { label: "Contact", href: "#contact" },
//     ],
//     []
//   );

//   const initials = useMemo(() => {
//     const name = userState?.name?.trim();
//     const email = userState?.email?.trim();

//     if (name) {
//       const parts = name.split(/\s+/).filter(Boolean);
//       const first = parts[0]?.[0] || "U";
//       const second = parts[1]?.[0] || "";
//       return `${first}${second}`.toUpperCase();
//     }

//     if (email) {
//       const local = email.split("@")[0]?.replace(/[^a-zA-Z0-9]/g, "") || "U";
//       const first = local[0] || "U";
//       const second = local[1] || "";
//       return `${first}${second}`.toUpperCase();
//     }

//     return "U";
//   }, [userState]);

//   const profilePic = useMemo(() => {
//     const picture = userState?.profilePicture;
//     if (!picture) return null;
//     if (/^https?:\/\//i.test(picture)) return picture;
//     if (!API_BASE) return picture;
//     return `${API_BASE}${picture}`;
//   }, [userState]);

//   const syncAuthState = () => {
//     setUserState(getStoredUser());
//     setToken(getStoredToken());
//   };

//   const closeAllMenus = () => {
//     setMenuOpen(false);
//     setSignupOpen(false);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("authToken");
//     localStorage.removeItem("user");
//     syncAuthState();
//     closeAllMenus();
//     navigate("/login", { replace: true });
//   };

//   const scrollToId = (id, smooth = true) => {
//     const el = document.getElementById(id);
//     if (!el) return;

//     const y = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - 12;

//     window.scrollTo({
//       top: Math.max(y, 0),
//       behavior: smooth ? "smooth" : "auto",
//     });
//   };

//   const goHomeTop = () => {
//     closeAllMenus();

//     if (location.pathname !== "/") {
//       navigate("/");
//       return;
//     }

//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const goToHash = (hash) => {
//     const id = hash.replace("#", "");
//     closeAllMenus();

//     if (location.pathname !== "/") {
//       navigate(`/${hash}`);
//       return;
//     }

//     if (id === "top") {
//       window.scrollTo({ top: 0, behavior: "smooth" });
//       return;
//     }

//     scrollToId(id);
//   };

//   useEffect(() => {
//     setImgError(false);
//   }, [profilePic]);

//   useEffect(() => {
//     syncAuthState();

//     const handleStorage = () => syncAuthState();
//     const handleUserUpdated = () => syncAuthState();
//     const handleAuthChanged = () => syncAuthState();

//     window.addEventListener("storage", handleStorage);
//     window.addEventListener("userUpdated", handleUserUpdated);
//     window.addEventListener("authChanged", handleAuthChanged);

//     return () => {
//       window.removeEventListener("storage", handleStorage);
//       window.removeEventListener("userUpdated", handleUserUpdated);
//       window.removeEventListener("authChanged", handleAuthChanged);
//     };
//   }, []);

//   useEffect(() => {
//     closeAllMenus();
//   }, [location.pathname]);

//   useEffect(() => {
//     if (location.pathname !== "/") return;

//     const hash = location.hash;
//     if (!hash) return;

//     const id = hash.replace("#", "");
//     const timer = window.setTimeout(() => {
//       if (id === "top") {
//         window.scrollTo({ top: 0, behavior: "smooth" });
//       } else {
//         scrollToId(id);
//       }
//     }, 120);

//     return () => window.clearTimeout(timer);
//   }, [location.pathname, location.hash]);

//   useEffect(() => {
//     const handlePointerDown = (event) => {
//       const target = event.target;
//       if (!(target instanceof Element)) return;

//       if (signupRef.current && !signupRef.current.contains(target)) {
//         setSignupOpen(false);
//       }

//       const clickedToggle =
//         mobileToggleRef.current && mobileToggleRef.current.contains(target);

//       const clickedMenu =
//         mobileMenuRef.current && mobileMenuRef.current.contains(target);

//       if (!clickedToggle && !clickedMenu) {
//         setMenuOpen(false);
//       }
//     };

//     const handleKeyDown = (event) => {
//       if (event.key === "Escape") {
//         closeAllMenus();
//       }
//     };

//     document.addEventListener("mousedown", handlePointerDown);
//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("mousedown", handlePointerDown);
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   return (
//     <header className="fixed left-0 right-0 top-0 z-50 h-16 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
//       <div className="mx-auto max-w-6xl px-4 sm:px-6">
//         <div className="flex h-16 items-center justify-between">
//           <button
//             type="button"
//             onClick={goHomeTop}
//             className="group flex items-center gap-2"
//             aria-label="Go to home"
//           >
//             <div className="relative h-4 w-4 overflow-hidden rounded-full bg-red-600 shadow-sm transition group-hover:scale-110">
//               <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-white opacity-90" />
//               <div className="absolute left-1/2 top-[2px] h-[2px] w-[6px] -translate-x-1/2 rounded bg-white" />
//               <div className="absolute left-1/2 top-[6px] h-[2px] w-[6px] -translate-x-1/2 rounded bg-white" />
//               <div className="absolute left-1/2 top-[10px] h-[2px] w-[6px] -translate-x-1/2 rounded bg-white" />
//             </div>

//             <h1 className="text-2xl font-extrabold tracking-tight">
//               <span className="text-green-700">Cric</span>
//               <span className="text-orange-500">Book</span>
//             </h1>
//           </button>

//           <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
//             {navLinks.map((link) => (
//               <button
//                 key={link.href}
//                 type="button"
//                 onClick={() => goToHash(link.href)}
//                 className="text-sm font-medium text-gray-700 transition hover:text-gray-900"
//               >
//                 {link.label}
//               </button>
//             ))}
//           </nav>

//           <div className="hidden items-center gap-3 md:flex">
//             {showAuthedControls && (
//               <>
//                 <NotificationBell variant="light" />

//                 <button
//                   type="button"
//                   onClick={() => {
//                     closeAllMenus();
//                     navigate("/profile");
//                   }}
//                   className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-green-700 text-sm font-extrabold text-white shadow-sm transition hover:bg-green-800"
//                   aria-label="Open profile"
//                   title="Profile"
//                 >
//                   {profilePic && !imgError ? (
//                     <img
//                       src={profilePic}
//                       alt="Profile"
//                       className="h-full w-full object-cover"
//                       onError={() => setImgError(true)}
//                     />
//                   ) : (
//                     initials
//                   )}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={logout}
//                   className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
//                 >
//                   Logout
//                 </button>
//               </>
//             )}

//             {showGuestControls && (
//               <>
//                 <Link
//                   to="/login"
//                   className="text-sm font-medium text-gray-700 transition hover:text-gray-900"
//                 >
//                   Login
//                 </Link>

//                 <div ref={signupRef} className="relative">
//                   <button
//                     type="button"
//                     onClick={() => setSignupOpen((prev) => !prev)}
//                     aria-haspopup="menu"
//                     aria-expanded={signupOpen}
//                     className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
//                   >
//                     Sign up
//                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
//                       <path
//                         d="M6 9l6 6 6-6"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                   </button>

//                   {signupOpen && (
//                     <div
//                       role="menu"
//                       className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
//                     >
//                       <button
//                         type="button"
//                         role="menuitem"
//                         onClick={() => {
//                           closeAllMenus();
//                           navigate("/signup?role=user");
//                         }}
//                         className="w-full px-4 py-3 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
//                       >
//                         Sign up as User
//                       </button>

//                       <button
//                         type="button"
//                         role="menuitem"
//                         onClick={() => {
//                           closeAllMenus();
//                           navigate("/signup?role=owner");
//                         }}
//                         className="w-full px-4 py-3 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
//                       >
//                         Sign up as Ground Owner
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </>
//             )}
//           </div>

//           <button
//             ref={mobileToggleRef}
//             type="button"
//             onClick={() => setMenuOpen((prev) => !prev)}
//             className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 md:hidden"
//             aria-label="Toggle menu"
//             aria-expanded={menuOpen}
//             aria-controls="mobile-menu"
//           >
//             ☰
//           </button>
//         </div>
//       </div>

//       {menuOpen && (
//         <div
//           id="mobile-menu"
//           ref={mobileMenuRef}
//           className="border-t border-gray-200 bg-white md:hidden"
//         >
//           <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
//             <div className="flex flex-col gap-2">
//               {navLinks.map((link) => (
//                 <button
//                   key={link.href}
//                   type="button"
//                   onClick={() => goToHash(link.href)}
//                   className="rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
//                 >
//                   {link.label}
//                 </button>
//               ))}

//               <div className="my-2 h-px bg-gray-200" />

//               {showAuthedControls && (
//                 <>
//                   <div className="rounded-xl border border-gray-200 px-3 py-2">
//                     <NotificationBell variant="light" />
//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       closeAllMenus();
//                       navigate("/profile");
//                     }}
//                     className="rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
//                   >
//                     Profile
//                   </button>

//                   <button
//                     type="button"
//                     onClick={logout}
//                     className="rounded-xl bg-green-600 px-3 py-2 text-left text-sm font-semibold text-white transition hover:bg-green-700"
//                   >
//                     Logout
//                   </button>
//                 </>
//               )}

//               {showGuestControls && (
//                 <>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       closeAllMenus();
//                       navigate("/login");
//                     }}
//                     className="rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
//                   >
//                     Login
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       closeAllMenus();
//                       navigate("/signup?role=user");
//                     }}
//                     className="rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
//                   >
//                     Sign up as User
//                   </button>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       closeAllMenus();
//                       navigate("/signup?role=owner");
//                     }}
//                     className="rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
//                   >
//                     Sign up as Ground Owner
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </header>
//   );
// }


import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NotificationBell from "./NotificationBell";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  "";

const NAVBAR_HEIGHT = 64;

const getStoredAuth = () => {
  try {
    return JSON.parse(localStorage.getItem("auth") || "null");
  } catch {
    return null;
  }
};

const getStoredUser = () => getStoredAuth()?.user || null;
const getStoredToken = () => getStoredAuth()?.token || "";
const getStoredRole = () =>
  getStoredAuth()?.role || getStoredAuth()?.user?.role || "";

const clearAuth = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("token");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("authToken");
  localStorage.removeItem("userToken");
  localStorage.removeItem("user");
  localStorage.removeItem("profile");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const signupRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileToggleRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [userState, setUserState] = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);
  const [role, setRole] = useState(getStoredRole);

  const isLoggedIn = Boolean(token);
  const isLanding = location.pathname === "/";

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/verify-otp" ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/reset-password");

  const isOwnerArea = location.pathname.startsWith("/owner-dashboard");
  const isAdminArea = location.pathname.startsWith("/admin");

  // Keep landing page public
  const showAuthedControls = isLoggedIn && !isAuthPage && !isLanding;
  const showGuestControls = !isAuthPage && (!isLoggedIn || isLanding);

  const navLinks = useMemo(
    () => [
      { label: "Home", href: "#top" },
      { label: "About Us", href: "#about" },
      { label: "Featured", href: "#featured" },
      { label: "Contact", href: "#contact" },
    ],
    []
  );

  const initials = useMemo(() => {
    const name = userState?.name?.trim();
    const email = userState?.email?.trim();

    if (name) {
      const parts = name.split(/\s+/).filter(Boolean);
      const first = parts[0]?.[0] || "U";
      const second = parts[1]?.[0] || "";
      return `${first}${second}`.toUpperCase();
    }

    if (email) {
      const local = email.split("@")[0]?.replace(/[^a-zA-Z0-9]/g, "") || "U";
      const first = local[0] || "U";
      const second = local[1] || "";
      return `${first}${second}`.toUpperCase();
    }

    return "U";
  }, [userState]);

  const profilePic = useMemo(() => {
    const picture = userState?.profilePicture;
    if (!picture) return null;
    if (/^https?:\/\//i.test(picture)) return picture;
    if (!API_BASE) return picture;
    return `${API_BASE}${picture}`;
  }, [userState]);

  const syncAuthState = () => {
    setUserState(getStoredUser());
    setToken(getStoredToken());
    setRole(getStoredRole());
  };

  const closeAllMenus = () => {
    setMenuOpen(false);
    setSignupOpen(false);
  };

  const logout = () => {
    clearAuth();
    syncAuthState();
    closeAllMenus();
    window.dispatchEvent(new Event("authChanged"));
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/login", { replace: true });
  };

  const goToProfile = () => {
    closeAllMenus();

    if (role === "owner") {
      navigate("/owner-dashboard/settings");
      return;
    }

    if (role === "admin" || role === "superadmin") {
      navigate("/admin");
      return;
    }

    navigate("/profile");
  };

  const scrollToId = (id, smooth = true) => {
    const el = document.getElementById(id);
    if (!el) return;

    const y = el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - 12;

    window.scrollTo({
      top: Math.max(y, 0),
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const goHomeTop = () => {
    closeAllMenus();

    if (location.pathname !== "/") {
      navigate("/");
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goToHash = (hash) => {
    const id = hash.replace("#", "");
    closeAllMenus();

    if (location.pathname !== "/") {
      navigate(`/${hash}`);
      return;
    }

    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    scrollToId(id);
  };

  useEffect(() => {
    setImgError(false);
  }, [profilePic]);

  useEffect(() => {
    syncAuthState();

    const handleStorage = () => syncAuthState();
    const handleUserUpdated = () => syncAuthState();
    const handleAuthChanged = () => syncAuthState();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("userUpdated", handleUserUpdated);
    window.addEventListener("authChanged", handleAuthChanged);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("userUpdated", handleUserUpdated);
      window.removeEventListener("authChanged", handleAuthChanged);
    };
  }, []);

  useEffect(() => {
    closeAllMenus();
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const hash = location.hash;
    if (!hash) return;

    const id = hash.replace("#", "");
    const timer = window.setTimeout(() => {
      if (id === "top") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        scrollToId(id);
      }
    }, 120);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      if (signupRef.current && !signupRef.current.contains(target)) {
        setSignupOpen(false);
      }

      const clickedToggle =
        mobileToggleRef.current && mobileToggleRef.current.contains(target);

      const clickedMenu =
        mobileMenuRef.current && mobileMenuRef.current.contains(target);

      if (!clickedToggle && !clickedMenu) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeAllMenus();
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 h-16 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between">
          <button
            type="button"
            onClick={goHomeTop}
            className="group flex items-center gap-2"
            aria-label="Go to home"
          >
            <div className="relative h-4 w-4 overflow-hidden rounded-full bg-red-600 shadow-sm transition group-hover:scale-110">
              <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-white opacity-90" />
              <div className="absolute left-1/2 top-[2px] h-[2px] w-[6px] -translate-x-1/2 rounded bg-white" />
              <div className="absolute left-1/2 top-[6px] h-[2px] w-[6px] -translate-x-1/2 rounded bg-white" />
              <div className="absolute left-1/2 top-[10px] h-[2px] w-[6px] -translate-x-1/2 rounded bg-white" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight">
              <span className="text-green-700">Cric</span>
              <span className="text-orange-500">Book</span>
            </h1>
          </button>

          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <button
                key={link.href}
                type="button"
                onClick={() => goToHash(link.href)}
                className="text-sm font-medium text-gray-700 transition hover:text-gray-900"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {showAuthedControls && (
              <>
                {!isOwnerArea && !isAdminArea && <NotificationBell variant="light" />}

                <button
                  type="button"
                  onClick={goToProfile}
                  className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-green-700 text-sm font-extrabold text-white shadow-sm transition hover:bg-green-800"
                  aria-label="Open profile"
                  title="Profile"
                >
                  {profilePic && !imgError ? (
                    <img
                      src={profilePic}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    initials
                  )}
                </button>

                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                >
                  Logout
                </button>
              </>
            )}

            {showGuestControls && (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 transition hover:text-gray-900"
                >
                  Login
                </Link>

                <div ref={signupRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setSignupOpen((prev) => !prev)}
                    aria-haspopup="menu"
                    aria-expanded={signupOpen}
                    className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    Sign up
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg"
                    >
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          closeAllMenus();
                          navigate("/signup?role=user");
                        }}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                      >
                        Sign up as User
                      </button>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          closeAllMenus();
                          navigate("/signup?role=owner");
                        }}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                      >
                        Sign up as Ground Owner
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <button
            ref={mobileToggleRef}
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-900 transition hover:bg-gray-50 md:hidden"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            ☰
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className="border-t border-gray-200 bg-white md:hidden"
        >
          <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => goToHash(link.href)}
                  className="rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                >
                  {link.label}
                </button>
              ))}

              <div className="my-2 h-px bg-gray-200" />

              {showAuthedControls && (
                <>
                  {!isOwnerArea && !isAdminArea && (
                    <div className="rounded-xl border border-gray-200 px-3 py-2">
                      <NotificationBell variant="light" />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={goToProfile}
                    className="rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                  >
                    Profile
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-xl bg-green-600 px-3 py-2 text-left text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    Logout
                  </button>
                </>
              )}

              {showGuestControls && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      closeAllMenus();
                      navigate("/login");
                    }}
                    className="rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                  >
                    Login
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      closeAllMenus();
                      navigate("/signup?role=user");
                    }}
                    className="rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                  >
                    Sign up as User
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      closeAllMenus();
                      navigate("/signup?role=owner");
                    }}
                    className="rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                  >
                    Sign up as Ground Owner
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}