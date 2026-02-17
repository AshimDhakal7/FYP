import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


export default function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("user");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const res = await fetch("http://localhost:5001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }
  
      // ✅ SAVE TOKEN (MOST IMPORTANT STEP)
      localStorage.setItem("token", data.token);
  
      // OPTIONAL: save user
      localStorage.setItem("user", JSON.stringify(data.user));
  
      // Navigate based on role from backend
      if (data.user.role === "owner") {
        navigate("/owner-dashboard");
      } else {
        navigate("/home");
      }
    } catch (err) {
      alert("Server not responding");
    }
  };
  
  

  const roles = ["user", "owner"];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-700 via-green-900 to-emerald-950 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl bg-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* LEFT PANEL — EXACT SAME AS SIGNUP */}
          <div className="relative p-10 bg-gradient-to-b from-green-950 to-green-800 text-white">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white font-bold">
                CB
              </span>
              <span className="font-semibold">CricBook</span>
            </div>

            <h1 className="mt-8 text-4xl font-extrabold tracking-tight">
              Welcome back
            </h1>

            <p className="mt-3 text-white/80 text-sm leading-relaxed max-w-sm">
              Log in to book indoor cricket grounds and manage your reservations easily.
            </p>

            <ul className="mt-8 space-y-3 text-sm text-white/90">
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span>Live availability</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span>Instant confirmation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5">✓</span>
                <span>Manage all bookings in one place</span>
              </li>
            </ul>

            <p className="absolute bottom-6 left-10 text-xs text-white/70">
              Tip: Choose User or Ground Owner during login
            </p>
          </div>

          {/* RIGHT PANEL — LOGIN FORM */}
          <div className="p-10 bg-white">
            <h2 className="text-2xl font-bold text-gray-900">Login</h2>

            {/* ROLE TOGGLE */}
            <div className="mt-5 flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">
                Logging in as:
              </span>

              <div className="flex rounded-full bg-gray-100 p-1">
                {roles.map((r) => (
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
            </div>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              
              {/* EMAIL */}
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

              {/* PASSWORD */}
              <div>
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>

                <div className="relative mt-1">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type={showPass ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 outline-none focus:border-green-600"
                    required
                  />

                  {/* CLEAN EYE ICON */}
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                  >
                    {showPass ? (
                      /* Eye Off */
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7 0-1.165.568-2.42 1.568-3.568M6.223 6.223A9.956 9.956 0 0112 5c5 0 9 4 9 7 0 1.438-.73 3.014-2.025 4.39M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
                      </svg>
                    ) : (
                      /* Eye */
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* LOGIN BUTTON */}
              <button
                type="submit"
                className="w-full rounded-full bg-green-700 py-3 font-semibold text-white shadow-md hover:bg-green-800 transition"
              >
                Log In
              </button>

              {/* FOOTER LINK */}
              <p className="text-center text-sm text-gray-600">
                Don’t have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-green-700 hover:text-green-800"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
