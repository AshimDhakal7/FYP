import React from "react";
import "../styles/global.css";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div>© {new Date().getFullYear()} CricBook. All rights reserved.</div>
      </div>
    </footer>
  );
}
