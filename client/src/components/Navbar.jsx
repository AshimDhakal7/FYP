
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import NotificationBell from "./NotificationBell";

// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL ||
//   process.env.REACT_APP_API_BASE_URL ||
//   "";

// const NAVBAR_HEIGHT = 64;

// const getStoredAuth = () => {
//   try {
//     return JSON.parse(localStorage.getItem("auth") || "null");
//   } catch {
//     return null;
//   }
// };

// const getStoredUser = () => getStoredAuth()?.user || null;
// const getStoredToken = () => getStoredAuth()?.token || "";
// const getStoredRole = () =>
//   getStoredAuth()?.role || getStoredAuth()?.user?.role || "";

// const clearAuth = () => {
//   localStorage.removeItem("auth");
//   localStorage.removeItem("token");
//   localStorage.removeItem("accessToken");
//   localStorage.removeItem("authToken");
//   localStorage.removeItem("userToken");
//   localStorage.removeItem("user");
//   localStorage.removeItem("profile");
//   localStorage.removeItem("role");
//   localStorage.removeItem("name");
// };

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const signupRef = useRef(null);
//   const mobileMenuRef = useRef(null);
//   const mobileToggleRef = useRef(null);

//   const [menuOpen, setMenuOpen] = useState(false);
//   const [signupOpen, setSignupOpen] = useState(false);
//   const [imgError, setImgError] = useState(false);
//   const [userState, setUserState] = useState(getStoredUser);
//   const [token, setToken] = useState(getStoredToken);
//   const [role, setRole] = useState(getStoredRole);
//   const [activeSection, setActiveSection] = useState("top");

//   const isLoggedIn = Boolean(token);
//   const isLanding = location.pathname === "/";

//   const isAuthPage =
//     location.pathname === "/login" ||
//     location.pathname === "/forgot-password" ||
//     location.pathname === "/verify-otp" ||
//     location.pathname.startsWith("/signup") ||
//     location.pathname.startsWith("/reset-password");

//   const isAdminArea = location.pathname.startsWith("/admin");

//   const showAuthedControls = isLoggedIn && !isAuthPage && !isLanding;
//   const showGuestControls = !isAuthPage && (!isLoggedIn || isLanding);

//   const navLinks = useMemo(
//     () => [
//       { label: "Home", href: "#top", sectionId: "top" },
//       { label: "About Us", href: "#about", sectionId: "about" },
//       { label: "Featured", href: "#featured", sectionId: "featured" },
//       { label: "Contact", href: "#contact", sectionId: "contact" },
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
//     const picture =
//       userState?.profilePicture ||
//       userState?.avatar ||
//       userState?.image ||
//       "";

//     if (!picture) return null;
//     if (/^https?:\/\//i.test(picture)) return picture;
//     if (!API_BASE) return picture;
//     if (picture.startsWith("/")) return `${API_BASE}${picture}`;
//     return `${API_BASE}/${picture}`;
//   }, [userState]);

//   const syncAuthState = () => {
//     setUserState(getStoredUser());
//     setToken(getStoredToken());
//     setRole(getStoredRole());
//   };

//   const closeAllMenus = () => {
//     setMenuOpen(false);
//     setSignupOpen(false);
//   };

//   const logout = () => {
//     clearAuth();
//     syncAuthState();
//     closeAllMenus();
//     window.dispatchEvent(new Event("authChanged"));
//     window.dispatchEvent(new Event("userUpdated"));
//     navigate("/login", { replace: true });
//   };

//   const goToProfile = () => {
//     closeAllMenus();

//     if (role === "owner") {
//       navigate("/owner-dashboard/settings");
//       return;
//     }

//     if (role === "admin" || role === "superadmin") {
//       navigate("/admin");
//       return;
//     }

//     navigate("/profile");
//   };

//   const scrollToId = (id, smooth = true) => {
//     const el = document.getElementById(id);
//     if (!el) return;

//     const y =
//       el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - 12;

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
//     if (location.pathname !== "/") {
//       setActiveSection("");
//       return;
//     }

//     const sectionIds = navLinks.map((link) => link.sectionId).filter(Boolean);

//     const updateActiveSection = () => {
//       const scrollPosition = window.scrollY + NAVBAR_HEIGHT + 120;

//       let currentSection = "top";

//       for (const id of sectionIds) {
//         if (id === "top") continue;

//         const element = document.getElementById(id);
//         if (!element) continue;

//         if (element.offsetTop <= scrollPosition) {
//           currentSection = id;
//         }
//       }

//       setActiveSection(currentSection);
//     };

//     updateActiveSection();
//     window.addEventListener("scroll", updateActiveSection, { passive: true });

//     return () => {
//       window.removeEventListener("scroll", updateActiveSection);
//     };
//   }, [location.pathname, navLinks]);

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

//           <nav
//             className="hidden items-center gap-6 md:flex"
//             aria-label="Main navigation"
//           >
//             {navLinks.map((link) => {
//               const isActive = isLanding && activeSection === link.sectionId;

//               return (
//                 <button
//                   key={link.href}
//                   type="button"
//                   onClick={() => goToHash(link.href)}
//                   className={`relative text-sm font-medium transition ${
//                     isActive
//                       ? "text-green-700"
//                       : "text-gray-700 hover:text-gray-900"
//                   }`}
//                 >
//                   {link.label}
//                   <span
//                     className={`absolute -bottom-1 left-0 h-0.5 bg-green-700 transition-all ${
//                       isActive ? "w-full" : "w-0"
//                     }`}
//                   />
//                 </button>
//               );
//             })}
//           </nav>

//           <div className="hidden items-center gap-3 md:flex">
//             {showAuthedControls && (
//               <>
//                 {!isAdminArea && <NotificationBell variant="light" role={role} />}

//                 <button
//                   type="button"
//                   onClick={goToProfile}
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
//                     <svg
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       aria-hidden="true"
//                     >
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
//               {navLinks.map((link) => {
//                 const isActive = isLanding && activeSection === link.sectionId;

//                 return (
//                   <button
//                     key={link.href}
//                     type="button"
//                     onClick={() => goToHash(link.href)}
//                     className={`rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
//                       isActive
//                         ? "bg-green-50 text-green-700"
//                         : "text-gray-800 hover:bg-gray-50"
//                     }`}
//                   >
//                     {link.label}
//                   </button>
//                 );
//               })}

//               <div className="my-2 h-px bg-gray-200" />

//               {showAuthedControls && (
//                 <>
//                   {!isAdminArea && (
//                     <div className="rounded-xl border border-gray-200 px-3 py-2">
//                       <NotificationBell variant="light" role={role} />
//                     </div>
//                   )}

//                   <button
//                     type="button"
//                     onClick={goToProfile}
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

const VALID_ROLES = ["user", "owner", "admin", "superadmin"];

const normalizeRole = (value) => {
  const role = String(value || "").trim().toLowerCase();
  return VALID_ROLES.includes(role) ? role : "user";
};

const safeJsonParse = (value, fallback = null) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getLegacyUser = () => {
  const user = safeJsonParse(localStorage.getItem("user"), null);
  const profile = safeJsonParse(localStorage.getItem("profile"), null);

  if (user && typeof user === "object") return user;
  if (profile && typeof profile === "object") return profile;

  const name = localStorage.getItem("name");
  const role = localStorage.getItem("role");

  if (name || role) {
    return {
      name: name || "",
      role: normalizeRole(role),
    };
  }

  return null;
};

const getAuthSnapshot = () => {
  const auth = safeJsonParse(localStorage.getItem("auth"), null);
  const legacyUser = getLegacyUser();

  const user =
    auth?.user && typeof auth.user === "object"
      ? auth.user
      : legacyUser && typeof legacyUser === "object"
      ? legacyUser
      : null;

  const token =
    auth?.token ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("userToken") ||
    "";

  const role = normalizeRole(
    auth?.role ||
      auth?.user?.role ||
      user?.role ||
      localStorage.getItem("role") ||
      "user"
  );

  return {
    user: user ? { ...user, role } : null,
    token,
    role,
  };
};

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

const getImageUrl = (picture) => {
  if (!picture) return "";

  const value = String(picture).trim();
  if (!value) return "";

  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("data:image")) return value;

  if (!API_BASE) return value;

  if (value.startsWith("/")) return `${API_BASE}${value}`;
  return `${API_BASE}/${value}`;
};

const getInitials = (user) => {
  const name = String(user?.name || user?.fullName || "").trim();
  const email = String(user?.email || "").trim();

  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || "A";
    const second = parts[1]?.[0] || "D";
    return `${first}${second}`.toUpperCase();
  }

  if (email) {
    const local = email.split("@")[0]?.replace(/[^a-zA-Z0-9]/g, "") || "AD";
    const first = local[0] || "A";
    const second = local[1] || "D";
    return `${first}${second}`.toUpperCase();
  }

  return "AD";
};

const getDisplayName = (user) => {
  return (
    user?.name ||
    user?.fullName ||
    user?.username ||
    user?.email?.split("@")?.[0] ||
    "CricBook User"
  );
};

const getFallbackAvatar = (initials) => {
  const text = String(initials || "AD").slice(0, 2).toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 96 96">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#15803d"/>
          <stop offset="100%" stop-color="#065f46"/>
        </linearGradient>
      </defs>
      <rect width="96" height="96" rx="48" fill="url(#g)"/>
      <text
        x="48"
        y="58"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="30"
        font-weight="800"
        fill="#ffffff"
      >
        ${text}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const signupRef = useRef(null);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const mobileToggleRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [authState, setAuthState] = useState(getAuthSnapshot);
  const [activeSection, setActiveSection] = useState("top");

  const userState = authState.user;
  const token = authState.token;
  const role = normalizeRole(authState.role);

  const isLoggedIn = Boolean(token);
  const isLanding = location.pathname === "/";

  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/verify-otp" ||
    location.pathname.startsWith("/signup") ||
    location.pathname.startsWith("/reset-password");

  const isAdminArea = location.pathname.startsWith("/admin");

  const showAuthedControls = isLoggedIn && !isAuthPage && !isLanding;
  const showGuestControls = !isAuthPage && (!isLoggedIn || isLanding);

  const navLinks = useMemo(
    () => [
      { label: "Home", href: "#top", sectionId: "top" },
      { label: "About Us", href: "#about", sectionId: "about" },
      { label: "Featured", href: "#featured", sectionId: "featured" },
      { label: "Contact", href: "#contact", sectionId: "contact" },
    ],
    []
  );

  const initials = useMemo(() => getInitials(userState), [userState]);

  const displayName = useMemo(() => getDisplayName(userState), [userState]);

  const profilePic = useMemo(() => {
    const picture =
      userState?.profilePicture ||
      userState?.profilePhoto ||
      userState?.photo ||
      userState?.avatar ||
      userState?.image ||
      userState?.picture ||
      "";

    return getImageUrl(picture) || getFallbackAvatar(initials);
  }, [userState, initials]);

  const syncAuthState = () => {
    setAuthState(getAuthSnapshot());
  };

  const closeAllMenus = () => {
    setMenuOpen(false);
    setSignupOpen(false);
    setProfileOpen(false);
  };

  const logout = () => {
    clearAuth();
    setAuthState({ user: null, token: "", role: "user" });
    closeAllMenus();
    window.dispatchEvent(new Event("authChanged"));
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/login", { replace: true });
  };

  const goToProfile = () => {
    closeAllMenus();

    const currentRole = normalizeRole(role);

    if (currentRole === "owner") {
      navigate("/owner-dashboard/settings");
      return;
    }

    if (currentRole === "admin" || currentRole === "superadmin") {
      navigate("/admin");
      return;
    }

    navigate("/profile");
  };

  const goToDashboard = () => {
    closeAllMenus();

    const currentRole = normalizeRole(role);

    if (currentRole === "owner") {
      navigate("/owner-dashboard");
      return;
    }

    if (currentRole === "admin" || currentRole === "superadmin") {
      navigate("/admin");
      return;
    }

    navigate("/home");
  };

  const scrollToId = (id, smooth = true) => {
    const el = document.getElementById(id);
    if (!el) return;

    const y =
      el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - 12;

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
    const handleFocus = () => syncAuthState();

    window.addEventListener("storage", handleStorage);
    window.addEventListener("userUpdated", handleUserUpdated);
    window.addEventListener("authChanged", handleAuthChanged);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("userUpdated", handleUserUpdated);
      window.removeEventListener("authChanged", handleAuthChanged);
      window.removeEventListener("focus", handleFocus);
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
    if (location.pathname !== "/") {
      setActiveSection("");
      return;
    }

    const sectionIds = navLinks.map((link) => link.sectionId).filter(Boolean);

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + NAVBAR_HEIGHT + 120;

      let currentSection = "top";

      for (const id of sectionIds) {
        if (id === "top") continue;

        const element = document.getElementById(id);
        if (!element) continue;

        if (element.offsetTop <= scrollPosition) {
          currentSection = id;
        }
      }

      setActiveSection(currentSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, [location.pathname, navLinks]);

  useEffect(() => {
    const handlePointerDown = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      if (signupRef.current && !signupRef.current.contains(target)) {
        setSignupOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
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

          <nav
            className="hidden items-center gap-6 lg:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const isActive = isLanding && activeSection === link.sectionId;

              return (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => goToHash(link.href)}
                  className={`relative text-sm font-medium transition ${
                    isActive
                      ? "text-green-700"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 bg-green-700 transition-all ${
                      isActive ? "w-full" : "w-0"
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {showAuthedControls && (
              <>
                {!isAdminArea && (
                  <NotificationBell variant="light" role={role} />
                )}

                <div ref={profileRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                    className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1 pl-1 pr-3 shadow-sm transition hover:bg-gray-50"
                    aria-label="Open profile menu"
                    aria-haspopup="menu"
                    aria-expanded={profileOpen}
                    title={`Profile - ${role}`}
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-green-700 text-sm font-extrabold text-white ring-2 ring-green-100">
                      <img
                        src={imgError ? getFallbackAvatar(initials) : profilePic}
                        alt="Profile"
                        className="h-full w-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    </span>

                    <span className="max-w-[120px] truncate text-sm font-semibold text-gray-800">
                      {displayName}
                    </span>

                    <svg
                      className={`h-4 w-4 text-gray-500 transition ${
                        profileOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>

                  {profileOpen && (
                    <div
                      role="menu"
                      className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl"
                    >
                      <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-4">
                        <span className="inline-flex h-11 w-11 overflow-hidden rounded-full bg-green-700 ring-2 ring-green-100">
                          <img
                            src={
                              imgError
                                ? getFallbackAvatar(initials)
                                : profilePic
                            }
                            alt="Profile"
                            className="h-full w-full object-cover"
                            onError={() => setImgError(true)}
                          />
                        </span>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-gray-900">
                            {displayName}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {userState?.email || `${role} account`}
                          </p>
                          <span className="mt-1 inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-bold capitalize text-green-700">
                            {role}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={goToProfile}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                      >
                        Profile settings
                      </button>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={goToDashboard}
                        className="w-full px-4 py-3 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                      >
                        Dashboard
                      </button>

                      <button
                        type="button"
                        role="menuitem"
                        onClick={logout}
                        className="w-full border-t border-gray-100 px-4 py-3 text-left text-sm font-bold text-red-600 transition hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
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
                    <svg
                      className={`h-4 w-4 transition ${
                        signupOpen ? "rotate-180" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
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

          <div className="flex items-center gap-2 lg:hidden">
            {showAuthedControls && !isAdminArea && (
              <NotificationBell variant="light" role={role} />
            )}

            <button
              ref={mobileToggleRef}
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-xl font-bold text-gray-900 transition hover:bg-gray-50"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className="border-t border-gray-200 bg-white shadow-lg lg:hidden"
        >
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-2">
              {showAuthedControls && (
                <div className="mb-2 flex items-center gap-3 rounded-2xl bg-green-50 p-3 ring-1 ring-green-100">
                  <span className="inline-flex h-12 w-12 overflow-hidden rounded-full bg-green-700 ring-2 ring-white">
                    <img
                      src={imgError ? getFallbackAvatar(initials) : profilePic}
                      alt="Profile"
                      className="h-full w-full object-cover"
                      onError={() => setImgError(true)}
                    />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-gray-900">
                      {displayName}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {userState?.email || `${role} account`}
                    </p>
                    <span className="mt-1 inline-flex rounded-full bg-white px-2 py-0.5 text-[11px] font-bold capitalize text-green-700">
                      {role}
                    </span>
                  </div>
                </div>
              )}

              {navLinks.map((link) => {
                const isActive = isLanding && activeSection === link.sectionId;

                return (
                  <button
                    key={link.href}
                    type="button"
                    onClick={() => goToHash(link.href)}
                    className={`rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                      isActive
                        ? "bg-green-50 text-green-700"
                        : "text-gray-800 hover:bg-gray-50"
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}

              <div className="my-2 h-px bg-gray-200" />

              {showAuthedControls && (
                <>
                  <button
                    type="button"
                    onClick={goToProfile}
                    className="rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                  >
                    Profile settings
                  </button>

                  <button
                    type="button"
                    onClick={goToDashboard}
                    className="rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-800 transition hover:bg-gray-50"
                  >
                    Dashboard
                  </button>

                  <button
                    type="button"
                    onClick={logout}
                    className="rounded-xl bg-red-50 px-3 py-2 text-left text-sm font-bold text-red-600 transition hover:bg-red-100"
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