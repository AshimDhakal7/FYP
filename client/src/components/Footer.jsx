// import React from "react";
// import { Link, useLocation } from "react-router-dom";
// import "../styles/Footer.css";

// export default function Footer() {
//   const { pathname } = useLocation();
//   const isLanding = pathname === "/";

//   return (
//     <footer className="footer">
//       <div className="footer-inner">
//         <div className="footer-left">
//           <div className="footer-brand">
//             <span className="footer-badge">CB</span>
//             <span className="footer-title">CricBook</span>
//           </div>
//           <p className="footer-sub">
//             Book indoor cricket courts faster. Simple for players, powerful for ground owners.
//           </p>
//           <p className="footer-copy">© {new Date().getFullYear()} CricBook. All rights reserved.</p>
//         </div>

//         <div className="footer-right">
//           {isLanding ? (
//             <div className="footer-links">
//               <a href="#about">About</a>
//               <a href="#contact">Contact</a>
//               <a href="#featured">Featured</a>
//               <a href="#why">Why CricBook</a>
//             </div>
//           ) : (
//             <div className="footer-links">
//               <Link to="/about">About</Link>
//               <Link to="/contact">Contact</Link>
//               <Link to="/find">Find Cricsal</Link>
//               <Link to="/">Home</Link>
//             </div>
//           )}
//         </div>
//       </div>
//     </footer>
//   );
// }
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold">
              CB
            </div>
            <div>
              <div className="font-semibold text-gray-900">CricBook</div>
              <div className="text-sm text-gray-600">
                Indoor cricket booking platform
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <Link className="hover:text-gray-900" to="/support">
              Support
            </Link>
            <span className="text-gray-300">|</span>
            <span>Bhaktapur, Nepal</span>
            <span className="text-gray-300">|</span>
            <span>support@cricbook.com</span>
          </div>
        </div>

        <div className="mt-6 text-xs text-gray-500">
          © {new Date().getFullYear()} CricBook. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
