// import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import "../styles/signup.css";
// import api from "../utils/api";

// export default function ForgotPasswordOtp() {
//   const navigate = useNavigate();

//   const [step, setStep] = useState(1); // 1=email, 2=otp+newpass
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const sendOtp = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (!email) {
//       setError("Please enter your email.");
//       return;
//     }

//     try {
//       setLoading(true);
//       await api.post("/api/auth/password/send-otp", { email });
//       setSuccess("OTP sent. Please check your email.");
//       setStep(2);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to send OTP");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetWithOtp = async (e) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     if (otp.length !== 6) {
//       setError("Please enter a valid 6-digit OTP.");
//       return;
//     }
//     if (!password || password.length < 6) {
//       setError("Password must be at least 6 characters.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       setError("Passwords do not match.");
//       return;
//     }

//     try {
//       setLoading(true);
//       await api.post("/api/auth/password/reset-otp", {
//         email,
//         otp,
//         password,
//       });

//       setSuccess("Password updated! Redirecting to login...");
//       setTimeout(() => navigate("/login", { replace: true }), 900);
//     } catch (err) {
//       setError(err.response?.data?.message || "Reset failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <div className="auth-side">
//           <h2>CricBook</h2>
//           <p>Reset your password using OTP verification.</p>
//           <ul>
//             <li>✔ Secure OTP reset</li>
//             <li>✔ Valid for 10 minutes</li>
//             <li>✔ Get back to booking fast</li>
//           </ul>
//         </div>

//         <div className="auth-form-wrap">
//           <h1>Forgot Password</h1>

//           <p className="auth-subtitle">
//             {step === 1
//               ? "Enter your email to receive an OTP."
//               : "Enter OTP and set your new password."}
//           </p>

//           {error && <div className="auth-error">{error}</div>}
//           {success && <div className="auth-success">{success}</div>}

//           {step === 1 ? (
//             <form className="auth-form" onSubmit={sendOtp}>
//               <label>
//                 Email
//                 <input
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   placeholder="you@example.com"
//                   required
//                 />
//               </label>

//               <button type="submit" disabled={loading}>
//                 {loading ? "Sending..." : "Send OTP"}
//               </button>
//             </form>
//           ) : (
//             <form className="auth-form" onSubmit={resetWithOtp}>
//               <label>
//                 OTP Code
//                 <input
//                   type="text"
//                   value={otp}
//                   onChange={(e) =>
//                     setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
//                   }
//                   placeholder="Enter 6-digit OTP"
//                   required
//                 />
//               </label>

//               <label>
//                 New Password
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   placeholder="New password"
//                   minLength={6}
//                   required
//                 />
//               </label>

//               <label>
//                 Confirm Password
//                 <input
//                   type="password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   placeholder="Confirm password"
//                   minLength={6}
//                   required
//                 />
//               </label>

//               <button type="submit" disabled={loading}>
//                 {loading ? "Updating..." : "Reset Password"}
//               </button>
//             </form>
//           )}

//           <p className="auth-switch">
//             Back to <Link to="/login">Log in</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ForgotPasswordOtp() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1=email, 2=otp+newpass
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/password/send-otp", { email });
      setSuccess("OTP sent. Please check your email.");
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetWithOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/auth/password/reset-otp", {
        email,
        otp,
        password,
      });

      setSuccess("Password updated! Redirecting to login...");
      setTimeout(() => navigate("/login", { replace: true }), 900);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
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
                Password reset
              </span>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Forgot password?
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-7 text-white/80">
                Reset your password using secure OTP verification and get back to
                booking your favourite indoor cricket slot.
              </p>
            </div>

            <div className="relative mt-10 grid gap-3 text-sm text-white/80">
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                Secure OTP reset through your registered email.
              </div>
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                OTP verification helps protect your CricBook account.
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div className="bg-white p-8 sm:p-10">
            <div className="mb-7">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Forgot Password
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                {step === 1
                  ? "Enter your email to receive an OTP."
                  : "Enter OTP and set your new password."}
              </p>
            </div>

            <div className="mb-6 rounded-2xl bg-gray-50 p-3 ring-1 ring-gray-100">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Reset progress
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-gray-100">
                <div
                  className={`rounded-xl px-4 py-2 text-center text-sm font-semibold transition ${
                    step === 1
                      ? "bg-green-700 text-white shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  Email
                </div>
                <div
                  className={`rounded-xl px-4 py-2 text-center text-sm font-semibold transition ${
                    step === 2
                      ? "bg-green-700 text-white shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  OTP
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {success}
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={sendOtp} className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-green-700 py-3.5 font-bold text-white shadow-lg shadow-green-900/20 transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={resetWithOtp} className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    OTP Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter 6-digit OTP"
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                    minLength={6}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    minLength={6}
                    className="mt-2 w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-green-700 py-3.5 font-bold text-white shadow-lg shadow-green-900/20 transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Updating..." : "Reset Password"}
                </button>
              </form>
            )}

            <p className="mt-6 text-center text-sm text-gray-600">
              Back to{" "}
              <Link
                to="/login"
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