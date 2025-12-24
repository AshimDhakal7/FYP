import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/landing.css";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="lp">
      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <h1>Book Your Indoor Cricket In Seconds</h1>
          <p>Find and book the best cricsal near you. No hassle, no waiting.</p>

          <div className="lp-hero-cta">
            <button className="lp-btn primary" onClick={() => navigate("/login")}>
              Book Now
            </button>
            <button className="lp-btn white" onClick={() => navigate("/signup")}>
              Create Account
            </button>
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="lp-section" id="why">
        <div className="lp-container">
          <h2 className="lp-title">Why CricBook</h2>

          <div className="lp-grid2">
            <div className="lp-card">
              <h3>Quick Bookings</h3>
              <p>Book your favourite court in less than a minute.</p>
            </div>
            <div className="lp-card">
              <h3>Find nearby courts</h3>
              <p>Discover the best cricsal courts near your location.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="lp-section" id="featured">
        <div className="lp-container">
          <h2 className="lp-title">Featured Cricsal</h2>

          <div className="lp-grid2">
            <div className="lp-card venue">
              <div className="venue-img" />
              <h3>Great Himalaya Cricket Academy</h3>
              <p className="muted">Hattiban, Lalitpur</p>
            </div>

            <div className="lp-card venue">
              <div className="venue-img" />
              <h3>Velocity Arena</h3>
              <p className="muted">Battisputali, Kathmandu</p>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="lp-section" id="about">
        <div className="lp-container">
          <h2 className="lp-title">About Us</h2>

          <div className="lp-card about">
            <p>
              <b>CricBook</b> is a platform designed to make indoor cricket bookings easier for
              players and ground owners in Nepal. Our goal is to reduce the time spent calling,
              messaging, and waiting for confirmations — by providing a clean booking experience
              with availability, booking history, and management tools.
            </p>

            <div className="about-points">
              <div className="point">✅ Faster booking & confirmation</div>
              <div className="point">✅ Booking history & reminders</div>
              <div className="point">✅ Tools for ground owners</div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="lp-section" id="contact">
        <div className="lp-container">
          <h2 className="lp-title">Contact Us</h2>

          <div className="lp-grid2">
            <div className="lp-card">
              <h3>Get in touch</h3>
              <p className="muted">We usually respond within 24 hours.</p>
              <p><b>Email:</b> support@cricbook.com</p>
              <p><b>Phone:</b> +977-9841333838</p>
              <p><b>Location:</b> Bhaktapur, Nepal</p>
            </div>

            <div className="lp-card">
              <h3>Send a message</h3>
              <form
                className="contact-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Message submitted (demo). Connect this to backend later.");
                }}
              >
                <input placeholder="Your name" required />
                <input placeholder="Your email" type="email" required />
                <textarea placeholder="Your message" rows="4" required />
                <button className="lp-btn primary full" type="submit">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
