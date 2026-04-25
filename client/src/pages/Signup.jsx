// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
// import api from "../utils/api";
// import { showError, showSuccess } from "../utils/toast";

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

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const r = params.get("role");
//     if (r === "owner" || r === "user") setRole(r);
//   }, [params]);

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (password !== confirm) {
//       setError("Passwords do not match!");
//       return;
//     }

//     try {
//       setLoading(true);

//       // ✅ STEP 1: Send OTP (creates PendingSignup only)
//       const res = await api.post("/api/auth/signup/send-otp", {
//         name: fullName,
//         email,
//         password,
//         role,
//       });

//       const pendingId = res?.data?.pendingId;

//       if (!pendingId) {
//         showError("OTP could not be started. Missing pendingId from server.");
//         return;
//       }
      
//       showSuccess("OTP sent successfully");
      
//       navigate("/verify-otp", {
//         replace: true,
//         state: { pendingId, email, role },
//       });

//       // ✅ Go to OTP page (STEP 2)
//       navigate("/verify-otp", {
//         replace: true,
//         state: { pendingId, email, role },
//       });
//     } catch (err) {
//       console.error("Signup send-otp error:", err);
//       showError(
//         err?.response?.data?.message ||
//         err?.message ||
//         "Failed to send OTP. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
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

//             {error && (
//               <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
//                 {error}
//               </div>
//             )}

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
//                 disabled={loading}
//                 className="mt-2 w-full rounded-full bg-gradient-to-r from-green-700 to-green-600 py-3 font-semibold text-white shadow-lg hover:opacity-95 active:scale-[0.99] transition disabled:opacity-60"
//               >
//                 {loading ? "Sending OTP..." : "Sign Up"}
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
import { showError, showSuccess } from "../utils/toast";

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
        showError("OTP could not be started. Missing pendingId from server.");
        return;
      }

      showSuccess("OTP sent successfully");

      navigate("/verify-otp", {
        replace: true,
        state: { pendingId, email, role },
      });

      // ✅ Go to OTP page (STEP 2)
      navigate("/verify-otp", {
        replace: true,
        state: { pendingId, email, role },
      });
    } catch (err) {
      console.error("Signup send-otp error:", err);
      showError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-700 via-green-900 to-emerald-950 px-4 py-10">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -bottom-28 -right-24 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />
      <div className="absolute left-1/2 top-10 h-48 w-48 -translate-x-1/2 rounded-full bg-green-300/10 blur-3xl" />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 shadow-2xl shadow-black/30 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT PANEL */}
          <div className="relative overflow-hidden bg-gradient-to-b from-green-950 via-green-900 to-green-800 p-8 text-white sm:p-10">
            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-emerald-300/10 blur-3xl" />

            <div className="relative flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 font-extrabold text-white shadow-lg ring-1 ring-white/20">
                CB
              </span>
              <div>
                <span className="block font-bold tracking-wide">CricBook</span>
                <span className="text-xs text-white/60">
                  Indoor cricket booking
                </span>
              </div>
            </div>

            <div className="relative mt-12">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-green-100 ring-1 ring-white/15">
                Create account
              </span>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Join CricBook
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-7 text-white/80">
                Create your account to book indoor cricket grounds, manage
                reservations, and access your dashboard securely.
              </p>
            </div>

            <div className="relative mt-10 grid gap-3 text-sm text-white/80">
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                Fast signup with OTP verification.
              </div>
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                Separate access for players and ground owners.
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-white p-8 sm:p-10">
            <div className="mb-7">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Create Account
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Enter your details below to continue.
              </p>
            </div>

            <div className="mt-5 rounded-2xl bg-gray-50 p-3 ring-1 ring-gray-100">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Creating account as
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-gray-100">
                {["user", "owner"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`rounded-xl px-4 py-2 text-sm font-semibold capitalize transition ${
                      role === r
                        ? "bg-green-700 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSignup} className="mt-7 space-y-5">
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Full Name
                </label>
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  type="text"
                  placeholder="e.g. Ashim Dhakal"
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
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
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative mt-2">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPass ? "text" : "password"}
                    placeholder="Create a password"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
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
                <div className="relative mt-2">
                  <input
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Re-enter password"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
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
                className="w-full rounded-2xl bg-green-700 py-3.5 font-bold text-white shadow-lg shadow-green-900/20 transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Sending OTP..." : "Sign Up"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to={`/login?role=${role}`}
                className="font-bold text-green-700 hover:underline"
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