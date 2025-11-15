import React from "react";
import "../styles/login.css";

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Log In</h1>

        <form className="login-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Password" required />

          <button type="submit">Log In</button>
        </form>

        <p>
          Don’t have an account?{" "}
          <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
