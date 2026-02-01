// // client/src/pages/Login.jsx
// import React, { useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import "../styles/login.css";
// import api from "../utils/api";

// export default function Login() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   // if user was redirected from a protected route, go back there; otherwise go to /home
//   const from = location.state?.from?.pathname || "/home";

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleChange = (e) => {
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       setLoading(true);
//       const res = await api.post("/api/auth/login", {
//         email: form.email,
//         password: form.password,
//       });

//       // Save token and user
//       localStorage.setItem("token", res.data.token);
//       localStorage.setItem("user", JSON.stringify(res.data));

//       // go to previous protected page or home
//       navigate(from, { replace: true });
//     } catch (err) {
//       console.error("Login error:", err);
//       setError(
//         err.response?.data?.message ||
//           err.message ||
//           "Invalid credentials, please try again"
//       );
//     } finally {
//       setLoading(false);
//     }
    
//   };

//   return (
//     <div className="auth-page">
//       <div className="auth-card">
//         <div className="auth-side">
//           <h2>Welcome back</h2>
//           <p>Continue managing your cricket bookings with CricBook.</p>
//           <ul>
//             <li>✔ View upcoming bookings</li>
//             <li>✔ Cancel or reschedule easily</li>
//             <li>✔ Exclusive member offers</li>
//           </ul>
//         </div>

//         <div className="auth-form-wrap">
//           <h1>Log In</h1>
//           <p className="auth-subtitle">
//             Enter your credentials to access your dashboard.
//           </p>

//           {error && <div className="auth-error">{error}</div>}

//           <form className="auth-form" onSubmit={handleSubmit}>
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
//               <input
//                 type="password"
//                 name="password"
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="Enter your password"
//                 required
//               />
//             </label>
//             <div className="auth-forgot">
//   <button
//     type="button"
//     className="auth-link"
//     onClick={() => navigate("/forgot-password")}
//   >
//     Forgot password?
//   </button>
// </div>

//             <button type="submit" disabled={loading}>
//               {loading ? "Logging in..." : "Log In"}
//             </button>
//           </form>

//           <p className="auth-switch">
//             Don’t have an account? <Link to="/signup">Sign Up</Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
// client/src/pages/Login.jsx
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/login.css";
import api from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  // if user was redirected from a protected route, go back there; otherwise go to /home
  const from = location.state?.from?.pathname || "/home";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // ✅ ADDED: show/hide password toggle
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await api.post("/api/auth/login", {
        email: form.email,
        password: form.password,
      });

      // Save token and user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data));

      // go to previous protected page or home
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Invalid credentials, please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card--premium">
        <div className="auth-side auth-side--premium">
          <h2>Welcome back</h2>
          <p>Continue managing your cricket bookings with CricBook.</p>
          <ul>
            <li>✔ View upcoming bookings</li>
            <li>✔ Cancel or reschedule easily</li>
            <li>✔ Exclusive member offers</li>
          </ul>
        </div>

        <div className="auth-form-wrap auth-form-wrap--premium">
          <h1>Log In</h1>
          <p className="auth-subtitle">
            Enter your credentials to access your dashboard.
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="auth-input"
              />
            </label>
            <label>
  Password
  <div className="auth-password-field">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={form.password}
      onChange={handleChange}
      placeholder="Enter your password"
      required
      className="auth-input"
    />

    <button
      type="button"
      className="auth-eye-btn"
      onClick={() => setShowPassword((s) => !s)}
      aria-label={showPassword ? "Hide password" : "Show password"}
      title={showPassword ? "Hide password" : "Show password"}
    >
      {/* ✅ SVG Eye Icon (no emoji) */}
      {showPassword ? (
        // Eye-off icon
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="auth-eye-icon"
        >
          <path
            d="M3 3L21 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M10.58 10.58A2 2 0 0 0 13.42 13.42"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M9.88 5.09A10.55 10.55 0 0 1 12 4.8c6 0 10 7.2 10 7.2a18.6 18.6 0 0 1-4.24 5.12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M6.11 6.11C3.65 7.86 2 12 2 12s4 7.2 10 7.2c1.1 0 2.14-.19 3.1-.53"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ) : (
        // Eye icon
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="auth-eye-icon"
        >
          <path
            d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  </div>
</label>


            <div className="auth-forgot">
              <button
                type="button"
                className="auth-link"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading} className="auth-primary-btn">
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <p className="auth-switch">
            Don’t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

