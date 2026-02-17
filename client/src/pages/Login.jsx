// // // // client/src/pages/Login.jsx
// // // import React, { useState } from "react";
// // // import { Link, useLocation, useNavigate } from "react-router-dom";
// // // import "../styles/login.css";
// // // import api from "../utils/api";

// // // export default function Login() {
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   // if user was redirected from a protected route, go back there; otherwise go to /home
// // //   const from = location.state?.from?.pathname || "/home";

// // //   const [form, setForm] = useState({
// // //     email: "",
// // //     password: "",
// // //   });
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState("");

// // //   const handleChange = (e) => {
// // //     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setError("");

// // //     try {
// // //       setLoading(true);
// // //       const res = await api.post("/api/auth/login", {
// // //         email: form.email,
// // //         password: form.password,
// // //       });

// // //       // Save token and user
// // //       localStorage.setItem("token", res.data.token);
// // //       localStorage.setItem("user", JSON.stringify(res.data));

// // //       // go to previous protected page or home
// // //       navigate(from, { replace: true });
// // //     } catch (err) {
// // //       console.error("Login error:", err);
// // //       setError(
// // //         err.response?.data?.message ||
// // //           err.message ||
// // //           "Invalid credentials, please try again"
// // //       );
// // //     } finally {
// // //       setLoading(false);
// // //     }
    
// // //   };

// // //   return (
// // //     <div className="auth-page">
// // //       <div className="auth-card">
// // //         <div className="auth-side">
// // //           <h2>Welcome back</h2>
// // //           <p>Continue managing your cricket bookings with CricBook.</p>
// // //           <ul>
// // //             <li>✔ View upcoming bookings</li>
// // //             <li>✔ Cancel or reschedule easily</li>
// // //             <li>✔ Exclusive member offers</li>
// // //           </ul>
// // //         </div>

// // //         <div className="auth-form-wrap">
// // //           <h1>Log In</h1>
// // //           <p className="auth-subtitle">
// // //             Enter your credentials to access your dashboard.
// // //           </p>

// // //           {error && <div className="auth-error">{error}</div>}

// // //           <form className="auth-form" onSubmit={handleSubmit}>
// // //             <label>
// // //               Email
// // //               <input
// // //                 type="email"
// // //                 name="email"
// // //                 value={form.email}
// // //                 onChange={handleChange}
// // //                 placeholder="you@example.com"
// // //                 required
// // //               />
// // //             </label>

// // //             <label>
// // //               Password
// // //               <input
// // //                 type="password"
// // //                 name="password"
// // //                 value={form.password}
// // //                 onChange={handleChange}
// // //                 placeholder="Enter your password"
// // //                 required
// // //               />
// // //             </label>
// // //             <div className="auth-forgot">
// // //   <button
// // //     type="button"
// // //     className="auth-link"
// // //     onClick={() => navigate("/forgot-password")}
// // //   >
// // //     Forgot password?
// // //   </button>
// // // </div>

// // //             <button type="submit" disabled={loading}>
// // //               {loading ? "Logging in..." : "Log In"}
// // //             </button>
// // //           </form>

// // //           <p className="auth-switch">
// // //             Don’t have an account? <Link to="/signup">Sign Up</Link>
// // //           </p>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }
// // // client/src/pages/Login.jsx


// // // import React, { useState } from "react";
// // // import { Link, useLocation, useNavigate } from "react-router-dom";
// // // import "../styles/login.css";
// // // import api from "../utils/api";

// // // export default function Login() {
// // //   const navigate = useNavigate();
// // //   const location = useLocation();
// // //   // if user was redirected from a protected route, go back there; otherwise go to /home
// // //   const from = location.state?.from?.pathname || "/home";

// // //   const [form, setForm] = useState({
// // //     email: "",
// // //     password: "",
// // //   });

// // //   // ✅ ADDED: show/hide password toggle
// // //   const [showPassword, setShowPassword] = useState(false);

// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState("");

// // //   const handleChange = (e) => {
// // //     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
// // //   };

// // //   const handleSubmit = async (e) => {
// // //     e.preventDefault();
// // //     setError("");

// // //     try {
// // //       setLoading(true);
// // //       const res = await api.post("/api/auth/login", {
// // //         email: form.email,
// // //         password: form.password,
// // //       });

// // //       // Save token and user
// // //       localStorage.setItem("token", res.data.token);
// // //       localStorage.setItem("user", JSON.stringify(res.data));

// // //       // go to previous protected page or home
// // //       navigate(from, { replace: true });
// // //     } catch (err) {
// // //       console.error("Login error:", err);
// // //       setError(
// // //         err.response?.data?.message ||
// // //           err.message ||
// // //           "Invalid credentials, please try again"
// // //       );
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   return (
// // //     <div className="auth-page">
// // //       <div className="auth-card auth-card--premium">
// // //         <div className="auth-side auth-side--premium">
// // //           <h2>Welcome back</h2>
// // //           <p>Continue managing your cricket bookings with CricBook.</p>
// // //           <ul>
// // //             <li>✔ View upcoming bookings</li>
// // //             <li>✔ Cancel or reschedule easily</li>
// // //             <li>✔ Exclusive member offers</li>
// // //           </ul>
// // //         </div>

// // //         <div className="auth-form-wrap auth-form-wrap--premium">
// // //           <h1>Log In</h1>
// // //           <p className="auth-subtitle">
// // //             Enter your credentials to access your dashboard.
// // //           </p>

// // //           {error && <div className="auth-error">{error}</div>}

// // //           <form className="auth-form" onSubmit={handleSubmit}>
// // //             <label>
// // //               Email
// // //               <input
// // //                 type="email"
// // //                 name="email"
// // //                 value={form.email}
// // //                 onChange={handleChange}
// // //                 placeholder="you@example.com"
// // //                 required
// // //                 className="auth-input"
// // //               />
// // //             </label>
// // //             <label>
// // //   Password
// // //   <div className="auth-password-field">
// // //     <input
// // //       type={showPassword ? "text" : "password"}
// // //       name="password"
// // //       value={form.password}
// // //       onChange={handleChange}
// // //       placeholder="Enter your password"
// // //       required
// // //       className="auth-input"
// // //     />

// // //     <button
// // //       type="button"
// // //       className="auth-eye-btn"
// // //       onClick={() => setShowPassword((s) => !s)}
// // //       aria-label={showPassword ? "Hide password" : "Show password"}
// // //       title={showPassword ? "Hide password" : "Show password"}
// // //     >
// // //       {/* ✅ SVG Eye Icon (no emoji) */}
// // //       {showPassword ? (
// // //         // Eye-off icon
// // //         <svg
// // //           width="20"
// // //           height="20"
// // //           viewBox="0 0 24 24"
// // //           fill="none"
// // //           xmlns="http://www.w3.org/2000/svg"
// // //           className="auth-eye-icon"
// // //         >
// // //           <path
// // //             d="M3 3L21 21"
// // //             stroke="currentColor"
// // //             strokeWidth="2"
// // //             strokeLinecap="round"
// // //           />
// // //           <path
// // //             d="M10.58 10.58A2 2 0 0 0 13.42 13.42"
// // //             stroke="currentColor"
// // //             strokeWidth="2"
// // //             strokeLinecap="round"
// // //           />
// // //           <path
// // //             d="M9.88 5.09A10.55 10.55 0 0 1 12 4.8c6 0 10 7.2 10 7.2a18.6 18.6 0 0 1-4.24 5.12"
// // //             stroke="currentColor"
// // //             strokeWidth="2"
// // //             strokeLinecap="round"
// // //           />
// // //           <path
// // //             d="M6.11 6.11C3.65 7.86 2 12 2 12s4 7.2 10 7.2c1.1 0 2.14-.19 3.1-.53"
// // //             stroke="currentColor"
// // //             strokeWidth="2"
// // //             strokeLinecap="round"
// // //           />
// // //         </svg>
// // //       ) : (
// // //         // Eye icon
// // //         <svg
// // //           width="20"
// // //           height="20"
// // //           viewBox="0 0 24 24"
// // //           fill="none"
// // //           xmlns="http://www.w3.org/2000/svg"
// // //           className="auth-eye-icon"
// // //         >
// // //           <path
// // //             d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"
// // //             stroke="currentColor"
// // //             strokeWidth="2"
// // //             strokeLinecap="round"
// // //             strokeLinejoin="round"
// // //           />
// // //           <path
// // //             d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
// // //             stroke="currentColor"
// // //             strokeWidth="2"
// // //             strokeLinecap="round"
// // //             strokeLinejoin="round"
// // //           />
// // //         </svg>
// // //       )}
// // //     </button>
// // //   </div>
// // // </label>


// // //             <div className="auth-forgot">
// // //               <button
// // //                 type="button"
// // //                 className="auth-link"
// // //                 onClick={() => navigate("/forgot-password")}
// // //               >
// // //                 Forgot password?
// // //               </button>
// // //             </div>

// // //             <button type="submit" disabled={loading} className="auth-primary-btn">
// // //               {loading ? "Logging in..." : "Log In"}
// // //             </button>
// // //           </form>

// // //           <p className="auth-switch">
// // //             Don’t have an account? <Link to="/signup">Sign Up</Link>
// // //           </p>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // import React, { useState } from "react";
// // import { Link, useLocation, useNavigate } from "react-router-dom";
// // import "../styles/login.css";
// // import api from "../utils/api";

// // export default function Login() {
// //   const navigate = useNavigate();
// //   const location = useLocation();

// //   // If user was redirected from a protected route, go back there; otherwise go to role dashboard
// //   const from = location.state?.from?.pathname || "";

// //   const [form, setForm] = useState({ email: "", password: "" });

// //   // show/hide password toggle
// //   const [showPassword, setShowPassword] = useState(false);

// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState("");

// //   const handleChange = (e) => {
// //     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
// //   };

// //   // ✅ Decide where to go after login
// //   const getRedirectPath = (role, fromPath) => {
// //     const ownerHome = "/owner/dashboard";
// //     const userHome = "/user/dashboard";

// //     // If no "from", go straight to role dashboard
// //     if (!fromPath) return role === "groundOwner" ? ownerHome : userHome;

// //     // If role is owner but "from" is user area, ignore it
// //     if (role === "groundOwner" && fromPath.startsWith("/user")) return ownerHome;

// //     // If role is user but "from" is owner area, ignore it
// //     if (role !== "groundOwner" && fromPath.startsWith("/owner")) return userHome;

// //     // Otherwise it's safe to return to intended page
// //     return fromPath;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setError("");

// //     try {
// //       setLoading(true);

// //       const res = await api.post("/api/auth/login", {
// //         email: form.email,
// //         password: form.password,
// //       });

// //       // ✅ IMPORTANT: your backend should return { token, user }
// //       const token = res?.data?.token;
// //       const user = res?.data?.user;

// //       if (!token || !user) {
// //         throw new Error("Login response missing token/user. Check backend response.");
// //       }

// //       // ✅ Save token and user correctly
// //       localStorage.setItem("token", token);
// //       localStorage.setItem("user", JSON.stringify(user));

// //       // ✅ Role-based redirect (owner vs user) + respect protected route "from" when valid
// //       const redirectTo = getRedirectPath(user.role, from);
// //       navigate(redirectTo, { replace: true });
// //     } catch (err) {
// //       console.error("Login error:", err);
// //       setError(
// //         err.response?.data?.message ||
// //           err.message ||
// //           "Invalid credentials, please try again"
// //       );
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div className="auth-page">
// //       <div className="auth-card auth-card--premium">
// //         <div className="auth-side auth-side--premium">
// //           <h2>Welcome back</h2>
// //           <p>Continue managing your cricket bookings with CricBook.</p>
// //           <ul>
// //             <li>✔ View upcoming bookings</li>
// //             <li>✔ Cancel or reschedule easily</li>
// //             <li>✔ Exclusive member offers</li>
// //           </ul>
// //         </div>

// //         <div className="auth-form-wrap auth-form-wrap--premium">
// //           <h1>Log In</h1>
// //           <p className="auth-subtitle">
// //             Enter your credentials to access your dashboard.
// //           </p>

// //           {error && <div className="auth-error">{error}</div>}

// //           <form className="auth-form" onSubmit={handleSubmit}>
// //             <label>
// //               Email
// //               <input
// //                 type="email"
// //                 name="email"
// //                 value={form.email}
// //                 onChange={handleChange}
// //                 placeholder="you@example.com"
// //                 required
// //                 className="auth-input"
// //               />
// //             </label>

// //             <label>
// //               Password
// //               <div className="auth-password-field">
// //                 <input
// //                   type={showPassword ? "text" : "password"}
// //                   name="password"
// //                   value={form.password}
// //                   onChange={handleChange}
// //                   placeholder="Enter your password"
// //                   required
// //                   className="auth-input"
// //                 />

// //                 <button
// //                   type="button"
// //                   className="auth-eye-btn"
// //                   onClick={() => setShowPassword((s) => !s)}
// //                   aria-label={showPassword ? "Hide password" : "Show password"}
// //                   title={showPassword ? "Hide password" : "Show password"}
// //                 >
// //                   {showPassword ? (
// //                     // Eye-off icon
// //                     <svg
// //                       width="20"
// //                       height="20"
// //                       viewBox="0 0 24 24"
// //                       fill="none"
// //                       xmlns="http://www.w3.org/2000/svg"
// //                       className="auth-eye-icon"
// //                     >
// //                       <path
// //                         d="M3 3L21 21"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                       />
// //                       <path
// //                         d="M10.58 10.58A2 2 0 0 0 13.42 13.42"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                       />
// //                       <path
// //                         d="M9.88 5.09A10.55 10.55 0 0 1 12 4.8c6 0 10 7.2 10 7.2a18.6 18.6 0 0 1-4.24 5.12"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                       />
// //                       <path
// //                         d="M6.11 6.11C3.65 7.86 2 12 2 12s4 7.2 10 7.2c1.1 0 2.14-.19 3.1-.53"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                       />
// //                     </svg>
// //                   ) : (
// //                     // Eye icon
// //                     <svg
// //                       width="20"
// //                       height="20"
// //                       viewBox="0 0 24 24"
// //                       fill="none"
// //                       xmlns="http://www.w3.org/2000/svg"
// //                       className="auth-eye-icon"
// //                     >
// //                       <path
// //                         d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                       />
// //                       <path
// //                         d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                         strokeLinecap="round"
// //                         strokeLinejoin="round"
// //                       />
// //                     </svg>
// //                   )}
// //                 </button>
// //               </div>
// //             </label>

// //             <div className="auth-forgot">
// //               <button
// //                 type="button"
// //                 className="auth-link"
// //                 onClick={() => navigate("/forgot-password")}
// //               >
// //                 Forgot password?
// //               </button>
// //             </div>

// //             <button type="submit" disabled={loading} className="auth-primary-btn">
// //               {loading ? "Logging in..." : "Log In"}
// //             </button>
// //           </form>

// //           <p className="auth-switch">
// //             Don’t have an account? <Link to="/signup">Sign Up</Link>
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // import { useState } from "react";
// // import { Link, useNavigate } from "react-router-dom";
// // import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";


// // export default function Login() {
// //   const navigate = useNavigate();
// //   const [role, setRole] = useState("user");
// //   const [showPassword, setShowPassword] = useState(false);

// //   return (
// //     <>
// //       {/* <Navbar /> */}

// //       {/* Background */}
// //       <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_20%_20%,#1e7f4f,#0b3d2e,#052e1b)] px-4 pt-24">
// //         <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
          
// //           {/* LEFT PANEL */}
// //           <div className="hidden flex-col justify-between bg-gradient-to-br from-green-900 to-green-700 p-10 text-white md:flex">
// //             <div>
// //               <div className="mb-6 flex items-center gap-2 text-lg font-semibold">
// //                 <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
// //                   CB
// //                 </span>
// //                 CricBook
// //               </div>

// //               <h2 className="text-3xl font-bold">Welcome back</h2>
// //               <p className="mt-2 text-green-100">
// //                 Continue managing your cricket bookings with CricBook.
// //               </p>

// //               <ul className="mt-6 space-y-3 text-sm text-green-100">
// //                 <li>✔ View upcoming bookings</li>
// //                 <li>✔ Cancel or reschedule easily</li>
// //                 <li>✔ Exclusive member offers</li>
// //               </ul>
// //             </div>

// //             <p className="text-xs text-green-200">
// //               Tip: You can login as User or Ground Owner
// //             </p>
// //           </div>

// //           {/* RIGHT PANEL */}
// //           <div className="p-8 md:p-10">
// //             <h1 className="text-2xl font-bold text-gray-900">Log In</h1>
// //             <p className="text-sm text-gray-500">
// //               Logging in as{" "}
// //               <span className="font-semibold capitalize text-green-700">
// //                 {role}
// //               </span>
// //             </p>

// //             {/* Role Switch */}
// //             <div className="mt-4 flex gap-2">
// //               {["user", "owner"].map((r) => (
// //                 <button
// //                   key={r}
// //                   onClick={() => setRole(r)}
// //                   className={`rounded-full px-4 py-1 text-sm font-medium ${
// //                     role === r
// //                       ? "bg-green-700 text-white"
// //                       : "border text-gray-600"
// //                   }`}
// //                 >
// //                   {r}
// //                 </button>
// //               ))}
// //             </div>

// //             {/* Form */}
// //             <form className="mt-6 space-y-4">
// //               <div>
// //                 <label className="text-sm font-medium text-gray-700">
// //                   Email
// //                 </label>
// //                 <input
// //                   type="email"
// //                   placeholder="you@example.com"
// //                   className="mt-1 w-full rounded-xl border px-4 py-3 focus:border-green-600 focus:outline-none"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="text-sm font-medium text-gray-700">
// //                   Password
// //                 </label>
// //                 <div className="relative mt-1">
// //                   <input
// //                     type={showPassword ? "text" : "password"}
// //                     placeholder="Enter your password"
// //                     className="w-full rounded-xl border px-4 py-3 pr-10 focus:border-green-600 focus:outline-none"
// //                   />
// // <button
// //   type="button"
// //   onClick={() => setShowPassword(!showPassword)}
// //   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
// // >
// //   {showPassword ? (
// //     <EyeSlashIcon className="h-5 w-5" />
// //   ) : (
// //     <EyeIcon className="h-5 w-5" />
// //   )}
// // </button>

// //                 </div>

// //                 <div className="mt-2 text-right">
// //                   <Link
// //                     to="/forgot-password"
// //                     className="text-sm text-green-700 hover:underline"
// //                   >
// //                     Forgot password?
// //                   </Link>
// //                 </div>
// //               </div>

// //               <button
// //                 type="button"
// //                 onClick={() =>
// //                   navigate(role === "owner" ? "/owner/home" : "/home")
// //                 }
// //                 className="mt-4 w-full rounded-full bg-gradient-to-r from-green-700 to-green-600 py-3 font-semibold text-white shadow-lg hover:opacity-90"
// //               >
// //                 Log In
// //               </button>
// //             </form>

// //             <p className="mt-6 text-center text-sm text-gray-500">
// //               Don’t have an account?{" "}
// //               <Link to="/signup" className="font-semibold text-green-700">
// //                 Sign Up
// //               </Link>
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </>
// //   );
// // }

// import React, { useState } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// export default function Login() {
//   const navigate = useNavigate();
//   const [params] = useSearchParams();

//   const initialRole = params.get("role") === "owner" ? "owner" : "user";

//   const [role, setRole] = useState(initialRole);
//   const [showPassword, setShowPassword] = useState(false);

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // ✅ REAL LOGIN FUNCTION (OWNER OTP + ROLE REDIRECT)
//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await fetch(`${API_BASE}/api/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email,
//           password,
//           role,
//         }),
//       });

//       const data = await res.json().catch(() => ({}));

//       // 🧠 Owner not verified yet → go to OTP page
//       if (res.status === 403 && data?.needsOtp) {
//         navigate(`/verify-otp?email=${encodeURIComponent(email)}`, {
//           replace: true,
//         });
//         return;
//       }

//       // ❌ login failed
//       if (!res.ok) {
//         alert(data?.message || "Invalid email or password");
//         return;
//       }

//       // get token & user safely
//       const gotToken =
//         data?.token ||
//         data?.accessToken ||
//         data?.jwt ||
//         data?.authToken ||
//         "";

//       const gotUser = data?.user || data?.data?.user || null;

//       if (!gotToken || !gotUser) {
//         alert("Login response missing token/user");
//         return;
//       }

//       // save auth
//       localStorage.setItem("token", gotToken);
//       localStorage.setItem("user", JSON.stringify(gotUser));

//       // 🎯 ROLE BASED REDIRECT
//       if (gotUser.role === "owner") {
//         navigate("/owner-dashboard", { replace: true });
//       } else {
//         navigate("/home", { replace: true });
//       }
//     } catch (err) {
//       console.log(err);
//       alert("Server error. Make sure backend is running.");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="w-full max-w-md">
//         <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-black/5">
//           <h1 className="text-2xl font-bold text-gray-900 text-center">
//             Log in to CricBook
//           </h1>

//           {/* Role switch */}
//           <div className="mt-6 flex justify-center gap-3">
//             {["user", "owner"].map((r) => (
//               <button
//                 key={r}
//                 type="button"
//                 onClick={() => setRole(r)}
//                 className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
//                   role === r
//                     ? "bg-green-700 text-white shadow-sm"
//                     : "text-gray-600 hover:text-gray-900"
//                 }`}
//               >
//                 {r}
//               </button>
//             ))}
//           </div>

//           <form onSubmit={handleLogin} className="mt-6 space-y-4">
//             <div>
//               <label className="text-sm font-semibold text-gray-700">
//                 Email
//               </label>
//               <input
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 type="email"
//                 placeholder="you@example.com"
//                 className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
//                 required
//               />
//             </div>

//             <div>
//               <label className="text-sm font-semibold text-gray-700">
//                 Password
//               </label>

//               <div className="relative mt-1">
//                 <input
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 outline-none focus:border-green-600"
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword((v) => !v)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
//                   aria-label="Toggle password visibility"
//                 >
//                   {showPassword ? (
//                     <EyeSlashIcon className="h-5 w-5" />
//                   ) : (
//                     <EyeIcon className="h-5 w-5" />
//                   )}
//                 </button>
//               </div>

//               <div className="mt-2 text-right">
//                 <Link
//                   to="/forgot-password"
//                   className="text-sm font-medium text-green-700 hover:underline"
//                 >
//                   Forgot password?
//                 </Link>
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="mt-2 w-full rounded-full bg-gradient-to-r from-green-700 to-green-600 py-3 font-semibold text-white shadow-lg hover:opacity-95 active:scale-[0.99] transition"
//             >
//               Log In
//             </button>
//           </form>

//           <p className="mt-6 text-center text-sm text-gray-500">
//             Don’t have an account?{" "}
//             <Link
//               to={`/signup?role=${role}`}
//               className="font-semibold text-green-700 hover:underline"
//             >
//               Sign Up
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const initialRole = params.get("role") === "owner" ? "owner" : "user";

  const [role, setRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ If already logged in → redirect automatically
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsed = JSON.parse(storedUser);

      if (parsed?.role === "owner") {
        navigate("/owner-dashboard", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    }
  }, []);

  // ✅ LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const data = await res.json().catch(() => ({}));

      // owner needs OTP
      if (res.status === 403 && data?.needsOtp) {
        navigate(`/verify-otp?email=${encodeURIComponent(email)}`, {
          replace: true,
        });
        return;
      }

      if (!res.ok) {
        alert(data?.message || "Invalid email or password");
        return;
      }

      const gotToken =
        data?.token ||
        data?.accessToken ||
        data?.jwt ||
        data?.authToken ||
        "";

      const gotUser = data?.user || data?.data?.user || null;

      if (!gotToken || !gotUser) {
        alert("Login response missing token/user");
        return;
      }

      // save auth
      localStorage.setItem("token", gotToken);
      localStorage.setItem("user", JSON.stringify(gotUser));

      // ✅ ROLE BASED REDIRECT (fixed timing)
      setTimeout(() => {
        const savedUser = JSON.parse(localStorage.getItem("user"));

        if (savedUser?.role === "owner") {
          navigate("/owner-dashboard", { replace: true });
        } else {
          navigate("/home", { replace: true });
        }
      }, 100);

    } catch (err) {
      console.log(err);
      alert("Server error. Make sure backend is running.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-900 flex items-center justify-center px-6 py-10">

      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2">

        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-emerald-900 to-emerald-700 p-10 text-white">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
                CB
              </div>
              <span className="font-semibold text-lg">CricBook</span>
            </div>

            <h1 className="text-3xl font-bold mb-4">
              Welcome back
            </h1>

            <p className="text-emerald-100">
              Log in to manage your bookings and reserve indoor cricket slots instantly.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-emerald-200">
              <li>✓ Check ground availability</li>
              <li>✓ Instant booking confirmation</li>
              <li>✓ Manage your reservations easily</li>
            </ul>
          </div>

          <p className="text-xs text-emerald-200">
            Tip: Choose User or Ground Owner before logging in
          </p>
        </div>

        {/* RIGHT LOGIN FORM */}
        <div className="bg-white p-8 md:p-10">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Log in to CricBook
          </h1>

          {/* Role switch */}
          <div className="mt-6 flex justify-center gap-3">
            {["user", "owner"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  role === r
                    ? "bg-green-700 text-white shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="relative mt-1">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 outline-none focus:border-green-600"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              <div className="mt-2 text-right">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-green-700 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-full bg-gradient-to-r from-green-700 to-green-600 py-3 font-semibold text-white shadow-lg hover:opacity-95 active:scale-[0.99] transition"
            >
              Log In
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don’t have an account?{" "}
            <Link
              to={`/signup?role=${role}`}
              className="font-semibold text-green-700 hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
