
// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

// export default function Signup() {
//   const navigate = useNavigate();
//   const [params] = useSearchParams();

//   const initialRole = params.get("role") === "owner" ? "owner" : "user";

//   const [role, setRole] = useState(initialRole);
//   const [showPass, setShowPass] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");

//   useEffect(() => {
//     const r = params.get("role");
//     if (r === "owner" || r === "user") setRole(r);
//   }, [params]);

//   const handleSignup = (e) => {
//     e.preventDefault();

//     if (password !== confirm) {
//       alert("Passwords do not match!");
//       return;
//     }

//     // ✅ TEMP demo signup (replace with API later)
//     localStorage.setItem("token", "demo-token");
//     localStorage.setItem("user", JSON.stringify({ role, email, fullName }));

//     navigate(role === "owner" ? "/owner/dashboard" : "/dashboard");
//   };

//   return (
//     <div className="min-h-screen w-full bg-[radial-gradient(circle_at_20%_20%,#1e7f4f,#0b3d2e,#052e1b)] px-4">
//       <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center py-10">
//         <div className="grid w-full grid-cols-1 overflow-hidden rounded-3xl bg-white shadow-2xl md:grid-cols-2">
//           {/* LEFT PANEL */}
//           <div className="hidden flex-col justify-between bg-gradient-to-br from-green-950 via-green-900 to-green-700 p-10 text-white md:flex">
//             <div>
//               <div className="mb-8 flex items-center gap-2 text-lg font-semibold">
//                 <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
//                   CB
//                 </span>
//                 CricBook
//               </div>

//               <h2 className="text-3xl font-extrabold leading-tight">
//                 Create your account
//               </h2>
//               <p className="mt-2 text-sm text-green-100">
//                 Book your favourite indoor cricket slot in a few taps.
//               </p>

//               <ul className="mt-7 space-y-3 text-sm text-green-100">
//                 <li className="flex gap-2">
//                   <span className="text-green-200">✓</span> Live availability
//                 </li>
//                 <li className="flex gap-2">
//                   <span className="text-green-200">✓</span> Instant confirmation
//                 </li>
//                 <li className="flex gap-2">
//                   <span className="text-green-200">✓</span> Manage all bookings in one place
//                 </li>
//               </ul>
//             </div>

//             <p className="text-xs text-green-200">
//               Tip: Choose User or Ground Owner during signup
//             </p>
//           </div>

//           {/* RIGHT PANEL */}
//           <div className="p-8 md:p-10">
//             <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>

//             <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-600">
//               Creating account as:{" "}
//               <span className="capitalize text-green-700">{role}</span>
//             </div>

//             {/* Role Switch */}
//             <div className="mt-5 inline-flex rounded-full border border-gray-200 bg-gray-50 p-1">
//               {["user", "owner"].map((r) => (
//                 <button
//                   key={r}
//                   type="button"
//                   onClick={() => setRole(r)}
//                   className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
//                     role === r
//                       ? "bg-green-700 text-white shadow-sm"
//                       : "text-gray-600 hover:text-gray-900"
//                   }`}
//                 >
//                   {r}
//                 </button>
//               ))}
//             </div>

//             <form onSubmit={handleSignup} className="mt-6 space-y-4">
//               <div>
//                 <label className="text-sm font-semibold text-gray-700">
//                   Full Name
//                 </label>
//                 <input
//                   value={fullName}
//                   onChange={(e) => setFullName(e.target.value)}
//                   type="text"
//                   placeholder="e.g. Ashim Dhakal"
//                   className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-semibold text-gray-700">
//                   Email
//                 </label>
//                 <input
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   type="email"
//                   placeholder="you@example.com"
//                   className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="text-sm font-semibold text-gray-700">
//                   Password
//                 </label>
//                 <div className="relative mt-1">
//                   <input
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                     type={showPass ? "text" : "password"}
//                     placeholder="Create a password"
//                     className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 outline-none focus:border-green-600"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPass((v) => !v)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
//                     aria-label="Toggle password visibility"
//                   >
//                     {showPass ? (
//                       <EyeSlashIcon className="h-5 w-5" />
//                     ) : (
//                       <EyeIcon className="h-5 w-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label className="text-sm font-semibold text-gray-700">
//                   Confirm Password
//                 </label>
//                 <div className="relative mt-1">
//                   <input
//                     value={confirm}
//                     onChange={(e) => setConfirm(e.target.value)}
//                     type={showConfirm ? "text" : "password"}
//                     placeholder="Re-enter password"
//                     className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 outline-none focus:border-green-600"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowConfirm((v) => !v)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
//                     aria-label="Toggle confirm password visibility"
//                   >
//                     {showConfirm ? (
//                       <EyeSlashIcon className="h-5 w-5" />
//                     ) : (
//                       <EyeIcon className="h-5 w-5" />
//                     )}
//                   </button>
//                 </div>
//               </div>

//               <button
//                 type="submit"
//                 className="mt-2 w-full rounded-full bg-gradient-to-r from-green-700 to-green-600 py-3 font-semibold text-white shadow-lg hover:opacity-95 active:scale-[0.99] transition"
//               >
//                 Sign Up
//               </button>
//             </form>

//             <p className="mt-6 text-center text-sm text-gray-500">
//               Already have an account?{" "}
//               <Link
//                 to={`/login?role=${role}`}
//                 className="font-semibold text-green-700 hover:underline"
//               >
//                 Log in
//               </Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import api from "../utils/api";

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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const r = params.get("role");
    if (r === "owner" || r === "user") setRole(r);
  }, [params]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      // ✅ STEP 1: Send OTP (creates PendingSignup only)
      const res = await api.post("/api/auth/signup/send-otp", {
        name: fullName,
        email,
        password,
        role,
      });

      const pendingId = res?.data?.pendingId;

      if (!pendingId) {
        setError("OTP could not be started. Missing pendingId from server.");
        return;
      }

      // ✅ Go to OTP page (STEP 2)
      navigate("/verify-otp", {
        replace: true,
        state: { pendingId, email, role },
      });
    } catch (err) {
      console.error("Signup send-otp error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
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

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

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
                disabled={loading}
                className="mt-2 w-full rounded-full bg-gradient-to-r from-green-700 to-green-600 py-3 font-semibold text-white shadow-lg hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Sign Up"}
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
