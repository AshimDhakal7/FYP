// import React, { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import api from "../utils/api";

// export default function VerifyOtp() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const pendingId = location.state?.pendingId || "";
//   const email = location.state?.email || "";
//   const role = location.state?.role || "user";

//   const [otp, setOtp] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const roleLabel = role === "owner" ? "Ground Owner" : "User";

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!pendingId) {
//       setError("Signup session expired. Please sign up again.");
//       return;
//     }

//     if (!otp || otp.length !== 6) {
//       setError("Please enter a valid 6-digit OTP.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const res = await api.post("/api/auth/signup/verify-otp", { pendingId, otp });
//       const data = res?.data || {};

//       // detect token/user
//       const token =
//         data?.token ||
//         data?.accessToken ||
//         data?.jwt ||
//         data?.authToken ||
//         data?.data?.token ||
//         "";

//       const user =
//         data?.user ||
//         data?.data?.user ||
//         null;

//       // save auth
//       if (token && user) {
//         localStorage.setItem("token", token);
//         localStorage.setItem("user", JSON.stringify(user));
//       }

//       // redirect by role
//       const finalRole = user?.role || role;

//       if (finalRole === "owner") {
//         navigate("/owner-dashboard", { replace: true });
//       } else {
//         navigate("/home", { replace: true });
//       }

//     } catch (err) {
//       console.error(err);
//       setError(
//         err.response?.data?.message ||
//         err.message ||
//         "OTP verification failed. Please try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-900 flex items-center justify-center px-6 py-10">

//       <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl grid md:grid-cols-2">

//         {/* LEFT PANEL */}
//         <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-emerald-900 to-emerald-700 p-10 text-white">
//           <div>
//             <div className="flex items-center gap-2 mb-8">
//               <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">
//                 CB
//               </div>
//               <span className="font-semibold text-lg">CricBook</span>
//             </div>

//             <h1 className="text-3xl font-bold mb-4">
//               Verify your email
//             </h1>

//             <p className="text-emerald-100">
//               We sent a secure 6-digit verification code to your email address.
//               Enter the code to activate your CricBook account.
//             </p>

//             <ul className="mt-8 space-y-3 text-sm text-emerald-200">
//               <li>✓ Secure signup with OTP</li>
//               <li>✓ Protect your account access</li>
//               <li>✓ Faster bookings after verification</li>
//             </ul>
//           </div>

//           <p className="text-xs text-emerald-200">
//             Verifying as: <b>{roleLabel}</b>
//           </p>
//         </div>

//         {/* RIGHT FORM */}
//         <div className="bg-white p-8 md:p-10">
//           <h1 className="text-2xl font-bold text-gray-900 text-center">
//             Enter Verification Code
//           </h1>

//           <p className="mt-2 text-center text-sm text-gray-500">
//             Code sent to <b>{email || "your email"}</b>
//           </p>

//           {error && (
//             <div className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
//               {error}
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="mt-6 space-y-4">

//             <div>
//               <label className="text-sm font-semibold text-gray-700">
//                 OTP Code
//               </label>
//               <input
//                 type="text"
//                 value={otp}
//                 onChange={(e) =>
//                   setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
//                 }
//                 placeholder="Enter 6-digit OTP"
//                 className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-center tracking-[0.35em] text-lg outline-none focus:border-green-600"
//                 required
//               />
//             </div>

//             <button
//               type="submit"
//               disabled={loading}
//               className="w-full rounded-full bg-gradient-to-r from-green-700 to-green-600 py-3 font-semibold text-white shadow-lg hover:opacity-95 active:scale-[0.99] transition"
//             >
//               {loading ? "Verifying..." : "Verify & Continue"}
//             </button>
//           </form>

//           <p className="mt-6 text-center text-sm text-gray-500">
//             Wrong email?{" "}
//             <Link
//               to={`/signup?role=${role}`}
//               className="font-semibold text-green-700 hover:underline"
//             >
//               Go back
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();

  const pendingId = location.state?.pendingId || "";
  const email = location.state?.email || "";
  const role = location.state?.role || "user";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleLabel = role === "owner" ? "Ground Owner" : "User";

  const clearOldAuthData = () => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!pendingId) {
      setError("Signup session expired. Please sign up again.");
      return;
    }

    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/auth/signup/verify-otp", {
        pendingId,
        otp,
      });

      clearOldAuthData();

      window.dispatchEvent(new Event("authChanged"));
      window.dispatchEvent(new Event("userUpdated"));

      navigate(`/login?role=${role}`, {
        replace: true,
        state: {
          email,
          message: "Account verified successfully. Please login.",
        },
      });
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
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

            <h1 className="text-3xl font-bold mb-4">Verify your email</h1>

            <p className="text-emerald-100">
              We sent a secure 6-digit verification code to your email address.
              Enter the code to activate your CricBook account.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-emerald-200">
              <li>✓ Secure signup with OTP</li>
              <li>✓ Protect your account access</li>
              <li>✓ Faster bookings after verification</li>
            </ul>
          </div>

          <p className="text-xs text-emerald-200">
            Verifying as: <b>{roleLabel}</b>
          </p>
        </div>

        {/* RIGHT FORM */}
        <div className="bg-white p-8 md:p-10">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            Enter Verification Code
          </h1>

          <p className="mt-2 text-center text-sm text-gray-500">
            Code sent to <b>{email || "your email"}</b>
          </p>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-center tracking-[0.35em] text-lg outline-none focus:border-green-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-r from-green-700 to-green-600 py-3 font-semibold text-white shadow-lg hover:opacity-95 active:scale-[0.99] transition"
            >
              {loading ? "Verifying..." : "Verify & Login"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Wrong email?{" "}
            <Link
              to={`/signup?role=${role}`}
              className="font-semibold text-green-700 hover:underline"
            >
              Go back
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
