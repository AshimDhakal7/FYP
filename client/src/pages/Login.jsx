
// import React, { useEffect, useMemo, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { showError, showSuccess } from "../utils/toast";

// const API_BASE =
//   import.meta.env.VITE_API_BASE_URL ||
//   process.env.REACT_APP_API_BASE_URL ||
//   "http://localhost:5001";

// const PUBLIC_ROLES = ["user", "owner"];
// const ALL_SUPPORTED_ROLES = ["user", "owner", "admin", "superadmin"];

// const normalizeRole = (value) => {
//   const role = String(value || "").trim().toLowerCase();
//   if (ALL_SUPPORTED_ROLES.includes(role)) return role;
//   return "user";
// };

// const clearLegacyAuth = () => {
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

// export default function Login() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const queryRole = useMemo(() => {
//     const params = new URLSearchParams(location.search);
//     return normalizeRole(params.get("role"));
//   }, [location.search]);

//   const isAdminMode = queryRole === "admin" || queryRole === "superadmin";

//   const [role, setRole] = useState(queryRole || "user");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     setRole(queryRole || "user");
//   }, [queryRole]);

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     if (loading) return;

//     const selectedRole = normalizeRole(role);

//     try {
//       setLoading(true);

//       const res = await fetch(`${API_BASE}/api/auth/login`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           email: email.trim(),
//           password,
//           role: selectedRole,
//         }),
//       });

//       const data = await res.json().catch(() => null);

//       if (!res.ok) {
//         showError(data?.message || "Login failed");
//         return;
//       }
      
//       showSuccess("Login successful");

//       const loggedInRole = normalizeRole(data?.user?.role || selectedRole);

//       clearLegacyAuth();

//       const authPayload = {
//         token: data?.token || "",
//         user: data?.user || null,
//         role: loggedInRole,
//       };

//       localStorage.setItem("auth", JSON.stringify(authPayload));

//       localStorage.setItem("token", authPayload.token);
//       localStorage.setItem("user", JSON.stringify(authPayload.user));

//       window.dispatchEvent(new Event("authChanged"));
//       window.dispatchEvent(new Event("userUpdated"));

//       if (loggedInRole === "owner") {
//         navigate("/owner-dashboard", { replace: true });
//       } else if (loggedInRole === "admin" || loggedInRole === "superadmin") {
//         navigate("/admin", { replace: true });
//       } else {
//         navigate("/home", { replace: true });
//       }
//     } catch (err) {
//       alert("Server not responding");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-emerald-700 via-green-900 to-emerald-950 px-4 py-10">
//       <div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white/10 shadow-2xl backdrop-blur">
//         <div className="grid grid-cols-1 md:grid-cols-2">
//           <div className="relative bg-gradient-to-b from-green-950 to-green-800 p-10 text-white">
//             <div className="flex items-center gap-3">
//               <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 font-bold text-white">
//                 CB
//               </span>
//               <span className="font-semibold">CricBook</span>
//             </div>

//             <h1 className="mt-8 text-4xl font-extrabold tracking-tight">
//               Welcome back
//             </h1>

//             <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
//               Log in to book indoor cricket grounds, manage reservations, and access
//               your dashboard securely.
//             </p>
//           </div>

//           <div className="bg-white p-10">
//             <h2 className="text-2xl font-bold text-gray-900">
//               {isAdminMode ? "Admin Login" : "Login"}
//             </h2>

//             {!isAdminMode && (
//               <div className="mt-5 flex items-center gap-2">
//                 <span className="text-xs font-semibold text-gray-500">
//                   Logging in as:
//                 </span>

//                 <div className="flex rounded-full bg-gray-100 p-1">
//                   {PUBLIC_ROLES.map((r) => (
//                     <button
//                       key={r}
//                       type="button"
//                       onClick={() => setRole(r)}
//                       className={`rounded-full px-4 py-1.5 text-sm font-semibold capitalize transition ${
//                         role === r
//                           ? "bg-green-700 text-white shadow-sm"
//                           : "text-gray-600 hover:text-gray-900"
//                       }`}
//                     >
//                       {r}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             <form onSubmit={handleLogin} className="mt-6 space-y-4">
//               <div>
//                 <label className="text-sm font-semibold text-gray-700">
//                   Email
//                 </label>
//                 <input
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   type="email"
//                   placeholder="you@example.com"
//                   className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-green-600"
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
//                     placeholder="Enter your password"
//                     className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 outline-none transition focus:border-green-600"
//                     required
//                   />
//                 </div>

//                 {/* ✅ Forgot Password Added */}
//                 <p className="mt-2 text-right">
//                   <Link
//                     to="/forgot-password"
//                     className="text-sm text-green-700 hover:underline"
//                   >
//                     Forgot Password?
//                   </Link>
//                 </p>
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full rounded-full bg-green-700 py-3 font-semibold text-white"
//               >
//                 {loading ? "Logging in..." : "Log In"}
//               </button>

//               {!isAdminMode && (
//                 <p className="text-center text-sm text-gray-600">
//                   Don&apos;t have an account?{" "}
//                   <Link
//                     to="/signup"
//                     className="font-semibold text-green-700"
//                   >
//                     Sign up
//                   </Link>
//                 </p>
//               )}
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../utils/toast";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  "http://localhost:5001";

const PUBLIC_ROLES = ["user", "owner"];
const ALL_SUPPORTED_ROLES = ["user", "owner", "admin", "superadmin"];

const normalizeRole = (value) => {
  const role = String(value || "").trim().toLowerCase();
  if (ALL_SUPPORTED_ROLES.includes(role)) return role;
  return "user";
};

const clearLegacyAuth = () => {
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

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const queryRole = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return normalizeRole(params.get("role"));
  }, [location.search]);

  const isAdminMode = queryRole === "admin" || queryRole === "superadmin";

  const [role, setRole] = useState(queryRole || "user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole(queryRole || "user");
  }, [queryRole]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    const selectedRole = normalizeRole(role);

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          role: selectedRole,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        showError(data?.message || "Login failed");
        return;
      }
      
      showSuccess("Login successful");

      const loggedInRole = normalizeRole(data?.user?.role || selectedRole);

      clearLegacyAuth();

      const authPayload = {
        token: data?.token || "",
        user: data?.user || null,
        role: loggedInRole,
      };

      localStorage.setItem("auth", JSON.stringify(authPayload));

      localStorage.setItem("token", authPayload.token);
      localStorage.setItem("user", JSON.stringify(authPayload.user));

      window.dispatchEvent(new Event("authChanged"));
      window.dispatchEvent(new Event("userUpdated"));

      if (loggedInRole === "owner") {
        navigate("/owner-dashboard", { replace: true });
      } else if (loggedInRole === "admin" || loggedInRole === "superadmin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      alert("Server not responding");
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
          <div className="relative overflow-hidden bg-gradient-to-b from-green-950 via-green-900 to-green-800 p-8 text-white sm:p-10">
            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-emerald-300/10 blur-3xl" />

            <div className="relative flex items-center gap-3">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 font-extrabold text-white shadow-lg ring-1 ring-white/20">
                CB
              </span>
              <div>
                <span className="block font-bold tracking-wide">CricBook</span>
                <span className="text-xs text-white/60">Indoor cricket booking</span>
              </div>
            </div>

            <div className="relative mt-12">
              <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-green-100 ring-1 ring-white/15">
                Secure access
              </span>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Welcome back
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-7 text-white/80">
                Log in to book indoor cricket grounds, manage reservations, and access
                your dashboard securely.
              </p>
            </div>

            <div className="relative mt-10 grid gap-3 text-sm text-white/80">
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                Fast booking and easy reservation tracking.
              </div>
              <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/10">
                Separate access for players and ground owners.
              </div>
            </div>
          </div>

          <div className="bg-white p-8 sm:p-10">
            <div className="mb-7">
              <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                {isAdminMode ? "Admin Login" : "Login"}
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Enter your details below to continue.
              </p>
            </div>

            {!isAdminMode && (
              <div className="mt-5 rounded-2xl bg-gray-50 p-3 ring-1 ring-gray-100">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Logging in as
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-1 shadow-sm ring-1 ring-gray-100">
                  {PUBLIC_ROLES.map((r) => (
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
            )}

            <form onSubmit={handleLogin} className="mt-7 space-y-5">
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
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 pr-12 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-100"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs font-semibold text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                  >
                    {showPass ? "Hide" : "Show"}
                  </button>
                </div>

                {/* ✅ Forgot Password Added */}
                <p className="mt-2 text-right">
                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-green-700 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-green-700 py-3.5 font-bold text-white shadow-lg shadow-green-900/20 transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Log In"}
              </button>

              {!isAdminMode && (
                <p className="text-center text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-bold text-green-700 hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
