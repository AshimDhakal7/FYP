// import React from "react";
// import { Routes, Route } from "react-router-dom";
// import Header from "./components/Navbar";
// import Footer from "./components/Footer";
// import Landing from "./pages/Landing";
// import Login from "./pages/Login";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import Home from "./pages/Home";
// import FindCricsal from "./pages/FindCricsal";
// import VerifyOtp from "./pages/VerifyOtp";
// import RequireAuth from "./components/RequireAuth";
// import UserProfile from "./pages/UserProfile";
// import Bookings from "./pages/Booking";
// import BookCricsal from "./pages/BookCricsal";
// import Support from "./pages/Support";
// import EditProfile from "./pages/EditProfile";
// import "./App.css";

// export default function App() {
//   return (
//     <div className="app-shell">
//       <Header />

//       {/* ✅ No inline minHeight. Layout handled by CSS. */}
//       <main className="app-main">
//         <Routes>
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/find-cricsal" element={<FindCricsal />} />

//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password/:token" element={<ResetPassword />} />
//           <Route path="/verify-otp" element={<VerifyOtp />} />

//           {/* Protected */}
//           <Route
//             path="/home"
//             element={
//               <RequireAuth>
//                 <Home />
//               </RequireAuth>
//             }
//           />
//           <Route
//             path="/dashboard"
//             element={
//               <RequireAuth>
//                 <Dashboard />
//               </RequireAuth>
//             }
//           />
//           <Route
//             path="/profile"
//             element={
//               <RequireAuth>
//                 <UserProfile />
//               </RequireAuth>
//             }
//           />
//           <Route
//             path="/edit-profile"
//             element={
//               <RequireAuth>
//                 <EditProfile />
//               </RequireAuth>
//             }
//           />
//           <Route
//             path="/bookings"
//             element={
//               <RequireAuth>
//                 <Bookings />
//               </RequireAuth>
//             }
//           />
//           <Route
//             path="/book/:id"
//             element={
//               <RequireAuth>
//                 <BookCricsal />
//               </RequireAuth>
//             }
//           />
//           <Route
//             path="/support"
//             element={
//               <RequireAuth>
//                 <Support />
//               </RequireAuth>
//             }
//           />
//         </Routes>
//       </main>

//       <Footer />
//     </div>
//   );
// }
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Navbar";
import Footer from "./components/Footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import FindCricsal from "./pages/FindCricsal";
import VerifyOtp from "./pages/VerifyOtp";
import RequireAuth from "./components/RequireAuth";
import UserProfile from "./pages/UserProfile";
import Bookings from "./pages/Booking";
import BookCricsal from "./pages/BookCricsal";
import Support from "./pages/Support";
import EditProfile from "./pages/EditProfile";

import "./App.css";

export default function App() {
  return (
    <div className="app-shell">
      <Header />

      {/* ✅ FIX: no inline minHeight calc. Layout handled by CSS */}
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/find-cricsal" element={<FindCricsal />} />

          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          <Route path="/home" element={<Home />} />

          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />

          <Route
            path="/bookings"
            element={
              <RequireAuth>
                <Bookings />
              </RequireAuth>
            }
          />

          <Route
            path="/book/:cricsalId"
            element={
              <RequireAuth>
                <BookCricsal />
              </RequireAuth>
            }
          />

          <Route
            path="/support"
            element={
              <RequireAuth>
                <Support />
              </RequireAuth>
            }
          />

          <Route
            path="/profile"
            element={
              <RequireAuth>
                <UserProfile />
              </RequireAuth>
            }
          />

          <Route
            path="/profile/edit"
            element={
              <RequireAuth>
                <EditProfile />
              </RequireAuth>
            }
          />

          {/* ✅ Only ONE fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
