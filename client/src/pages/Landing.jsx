import React from "react";
import { Link } from "react-router-dom";
import "../styles/landing.css";

export default function Landing() {
  return (
    <div className="landing">
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-left">
            <h1>Book Your Indoor Cricket <br/> In Seconds</h1>
            <p className="lead">Find and book the best cricsal near you. No hassle, no waiting.</p>
            <div className="ctas">
              <Link to="/find" className="btn primary">Book Now</Link>
              <Link to="/signup" className="btn outline">Create account</Link>
            </div>
          </div>
          <div className="hero-right">
            {/* optional image */}
          </div>
        </div>
      </section>

      <section className="why">
        <div className="container">
          <h2>Why CricBook</h2>
          <div className="features">
            <div className="card"> 
              <h3>Quick Bookings</h3>
              <p>Book your favourite court in less than a minute.</p>
            </div>
            <div className="card">
              <h3>Find nearby courts</h3>
              <p>Discover the best cricsal courts near your location.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <h2>Featured Cricsal</h2>
          <div className="list">
            <div className="place">
              <div className="thumb" />
              <h4>Great Himalaya Cricket Academy</h4>
              <p>Hattiban, Lalitpur</p>
            </div>
            <div className="place">
              <div className="thumb" />
              <h4>Velocity Arena</h4>
              <p>Battisputali, Kathmandu</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
