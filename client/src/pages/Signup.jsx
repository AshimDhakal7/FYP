// import React, { useMemo, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";

// import "../styles/signup.css";
// import api from "../utils/api";

// export default function Signup() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const roleFromQuery = useMemo(() => {
//     const role = new URLSearchParams(location.search).get("role");
//     return role === "owner" ? "owner" : "user";
//   }, [location.search]);

//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     role: roleFromQuery, 
//   });
  

//   //(show/hide password icon)
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  
//   React.useEffect(() => {
//     setForm((prev) => ({ ...prev, role: roleFromQuery }));
//   }, [roleFromQuery]);

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (form.password !== form.confirmPassword) {
//       setError("Passwords do not match");
//       return;
//     }

//     try {
//       setLoading(true);

//       // STEP 1: Send OTP (no account created yet)
//       const res = await api.post("/api/auth/signup/send-otp", {
//         name: form.name,
//         email: form.email,
//         password: form.password,
//         role: form.role,
//       });

//       //  Go to OTP verify page with pendingId
//       navigate("/verify-otp", {
//         state: {
//           pendingId: res.data.pendingId,
//           email: form.email,
//           name: form.name,
//           role: form.role,
//         },
//         replace: true,
//       });
//     } catch (err) {
//       console.error("Signup error:", err);
//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           "Something went wrong, please try again"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const roleLabel = form.role === "owner" ? "Ground Owner" : "User";

//   // ✅ ADDED (SVG icons - no emoji)
//   const EyeIcon = () => (
//     <svg
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//       <path
//         d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       />
//     </svg>
//   );

//   const EyeOffIcon = () => (
//     <svg
//       width="20"
//       height="20"
//       viewBox="0 0 24 24"
//       fill="none"
//       xmlns="http://www.w3.org/2000/svg"
//     >
//       <path
//         d="M3 3L21 21"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />
//       <path
//         d="M10.58 10.58A2 2 0 0 0 13.42 13.42"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />
//       <path
//         d="M9.88 5.09A10.55 10.55 0 0 1 12 4.8c6 0 10 7.2 10 7.2a18.6 18.6 0 0 1-4.24 5.12"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />
//       <path
//         d="M6.11 6.11C3.65 7.86 2 12 2 12s4 7.2 10 7.2c1.1 0 2.14-.19 3.1-.53"
//         stroke="currentColor"
//         strokeWidth="2"
//         strokeLinecap="round"
//       />
//     </svg>
//   );

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <div className="auth-side">
//           <h2>CricBook</h2>
//           <p>Book your favorite indoor cricket slot in a few taps.</p>
//           <ul>
//             <li>✔ Live availability</li>
//             <li>✔ Instant confirmation</li>
//             <li>✔ Manage all bookings in one place</li>
//           </ul>
//         </div>

//         <div className="auth-form-wrap">
//           <h1>Create Account</h1>

//           {/* ✅ Role badge */}
//           <div className="role-pill">
//             Creating account as: <b>{roleLabel}</b>
//           </div>

//           <p className="auth-subtitle">
//             Join CricBook and start booking your favorite cricsal.
//           </p>

//           {error && <div className="auth-error">{error}</div>}

//           <form className="auth-form" onSubmit={handleSubmit}>
//             <label>
//               Full Name
//               <input
//                 type="text"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="e.g. Ashim Dhakal"
//                 required
//               />
//             </label>

//             <label>
//               Email
//               <input
//                 type="email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="you@example.com"
//                 required
//               />
//             </label>

//             <label>
//               Password
//               <div className="auth-password-field">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   value={form.password}
//                   onChange={handleChange}
//                   placeholder="Create a password"
//                   required
//                   minLength={6}
//                 />
//                 <button
//                   type="button"
//                   className="auth-eye-btn"
//                   onClick={() => setShowPassword((s) => !s)}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                   title={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? <EyeOffIcon /> : <EyeIcon />}
//                 </button>
//               </div>
//             </label>

//             <label>
//               Confirm Password
//               <div className="auth-password-field">
//                 <input
//                   type={showConfirmPassword ? "text" : "password"}
//                   name="confirmPassword"
//                   value={form.confirmPassword}
//                   onChange={handleChange}
//                   placeholder="Re-enter password"
//                   required
//                   minLength={6}
//                 />
//                 <button
//                   type="button"
//                   className="auth-eye-btn"
//                   onClick={() => setShowConfirmPassword((s) => !s)}
//                   aria-label={
//                     showConfirmPassword ? "Hide password" : "Show password"
//                   }
//                   title={showConfirmPassword ? "Hide password" : "Show password"}
//                 >
//                   {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
//                 </button>
//               </div>
//             </label>

//             <button type="submit" disabled={loading}>
//               {loading ? "Creating account..." : "Sign Up"}
//             </button>
//           </form>

//           <p className="auth-switch">
//             Already have an account? <Link to="/login">Log in</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function Signup() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const initialRole = params.get("role") === "owner" ? "owner" : "user";

  const [role, setRole] = useState(initialRole);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  useEffect(() => {
    const r = params.get("role");
    if (r === "owner" || r === "user") setRole(r);
  }, [params]);

  const handleSignup = (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match!");
      return;
    }

    // ✅ TEMP demo signup (replace with API later)
    localStorage.setItem("token", "demo-token");
    localStorage.setItem("user", JSON.stringify({ role, email, fullName }));

    navigate(role === "owner" ? "/owner/dashboard" : "/dashboard");
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_20%_20%,#1e7f4f,#0b3d2e,#052e1b)] px-4">
      <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center py-10">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
          {/* LEFT PANEL */}
          <div className="hidden flex-col justify-between bg-gradient-to-br from-green-950 via-green-900 to-green-700 p-10 text-white md:flex">
            <div>
              <div className="mb-8 flex items-center gap-2 text-lg font-semibold">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
                  CB
                </span>
                CricBook
              </div>

              <h2 className="text-3xl font-extrabold leading-tight">
                Create your account
              </h2>
              <p className="mt-2 text-sm text-green-100">
                Book your favourite indoor cricket slot in a few taps.
              </p>

              <ul className="mt-7 space-y-3 text-sm text-green-100">
                <li className="flex gap-2">
                  <span className="text-green-200">✓</span> Live availability
                </li>
                <li className="flex gap-2">
                  <span className="text-green-200">✓</span> Instant confirmation
                </li>
                <li className="flex gap-2">
                  <span className="text-green-200">✓</span> Manage all bookings in one place
                </li>
              </ul>
            </div>

            <p className="text-xs text-green-200">
              Tip: Choose User or Ground Owner during signup
            </p>
          </div>

          {/* RIGHT PANEL */}
          <div className="p-8 md:p-10">
            <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>

            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600">
              Creating account as:{" "}
              <span className="capitalize text-green-700">{role}</span>
            </div>

            {/* Role Switch */}
            <div className="mt-5 inline-flex rounded-full border border-gray-200 bg-gray-50 p-1">
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

            <form onSubmit={handleSignup} className="mt-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  placeholder="e.g. Ashim Dhakal"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
                  required
                />
              </div>

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
                    type={showPass ? "text" : "password"}
                    placeholder="Create a password"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 outline-none focus:border-green-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    aria-label="Toggle password visibility"
                  >
                    {showPass ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>
                <div className="relative mt-1">
                  <input
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 outline-none focus:border-green-600"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-gradient-to-r from-green-700 to-green-600 py-3 font-semibold text-white shadow-lg hover:opacity-95 active:scale-[0.99] transition"
              >
                Sign Up
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link
                to={`/login?role=${role}`}
                className="font-semibold text-green-700 hover:underline"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
