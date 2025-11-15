import React from "react";
import "../styles/signup.css";

export default function Signup() {
  return (
    <div className="signup-page">
      <div className="signup-container">
        <h1>Create Account</h1>

        <form className="signup-form">
          <input type="email" placeholder="Email" required />
          <input type="password" placeholder="Create a password" required />
          <input type="password" placeholder="Re-enter password" required />

          <button type="submit">Sign Up</button>
        </form>

        <p>
          Already have an account?{" "}
          <a href="/login">Log in</a>
        </p>
      </div>
    </div>
  );
}
