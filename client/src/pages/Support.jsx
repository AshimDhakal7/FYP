import React from "react";
import { Link } from "react-router-dom";
import "../styles/Support.css";

export default function Support() {
  return (
    <div className="sp-page">
      <div className="sp-container">
        <div className="sp-header card">
          <div>
            <h1>Support</h1>
            <p>Get help with booking, payments, cancellations, and account issues.</p>
          </div>

          <Link to="/home" className="sp-btn sp-btn-outline">
            ← Back to Home
          </Link>
        </div>

        <div className="sp-grid">
          <div className="card">
            <h2>FAQs</h2>

            <details className="sp-faq">
              <summary>How do I book a slot?</summary>
              <div className="sp-faq-body">
                Go to <b>Find Cricsal</b>, select a ground, choose date/time, then confirm booking.
              </div>
            </details>

            <details className="sp-faq">
              <summary>Can I cancel or reschedule?</summary>
              <div className="sp-faq-body">
                Open <b>My Bookings</b>. If cancellation/reschedule is allowed by policy, you will see options there.
              </div>
            </details>

            <details className="sp-faq">
              <summary>Where do I see my booking history?</summary>
              <div className="sp-faq-body">
                Your full booking history is available on the <b>My Bookings</b> page.
              </div>
            </details>

            <div className="sp-actions">
              <Link to="/find-cricsal" className="sp-btn sp-btn-primary">
                Find Cricsal
              </Link>
              <Link to="/bookings" className="sp-btn sp-btn-outline">
                My Bookings
              </Link>
            </div>
          </div>

          <div className="card">
            <h2>Contact</h2>
            <p className="sp-muted">You can mention any problem you faced.</p>

            <form className="sp-form" onSubmit={(e) => e.preventDefault()}>
              <label>
                Name
                <input placeholder="Your name" />
              </label>

              <label>
                Email
                <input placeholder="your@email.com" />
              </label>

              <label>
                Message
                <textarea rows="4" placeholder="Describe your issue..." />
              </label>

              <button className="sp-btn sp-btn-primary" type="submit">
                Submit Request
              </button>
            </form>

            <div className="sp-note">
              (Later you can connect this to backend: <b>/api/support</b>.)
            </div>
          </div>
        </div>

        <footer className="sp-footer">
          © 2026 CricBook • <Link to="/">Terms</Link> • <Link to="/">Privacy</Link>
        </footer>
      </div>
    </div>
  );
}
