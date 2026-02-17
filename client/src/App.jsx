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
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
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
// import OwnerDashboard from "./pages/owner/OwnerDashboard";

// <Route path="/owner/dashboard" element={<OwnerDashboard />} />



// export default function App() {
//   return (
//     <div className="app-shell">
//       <Header />

//       {/* ✅ FIX: no inline minHeight calc. Layout handled by CSS */}
//       <main className="app-main">
//         <Routes>
//           <Route path="/" element={<Landing />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/find-cricsal" element={<FindCricsal />} />

//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password/:token" element={<ResetPassword />} />
//           <Route path="/verify-otp" element={<VerifyOtp />} />

//           <Route path="/home" element={<Home />} />

//           <Route
//             path="/dashboard"
//             element={
//               <RequireAuth>
//                 <Dashboard />
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
//             path="/book/:cricsalId"
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

//           <Route
//             path="/profile"
//             element={
//               <RequireAuth>
//                 <UserProfile />
//               </RequireAuth>
//             }
//           />

//           <Route
//             path="/profile/edit"
//             element={
//               <RequireAuth>
//                 <EditProfile />
//               </RequireAuth>
//             }
//           />

//           {/* ✅ Only ONE fallback route */}
//           <Route path="*" element={<Navigate to="/" replace />} />
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

import Landing from "./pages/user/Landing";
import Home from "./pages/user/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import FindCricsal from "./pages/user/FindCricsal";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOtp from "./pages/VerifyOtp";

import Dashboard from "./pages/user/Dashboard";
import BookCricsal from "./pages/user/BookCricsal"; 
import Bookings from "./pages/user/Booking"; 
import RequireAuth from "./components/RequireAuth";

import Profile from "./pages/user/UserProfile"; 

import OwnerLayout from "./pages/owner/OwnerLayout";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerCourts from "./pages/owner/OwnerCourts";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerSettings from "./pages/owner/OwnerSettings";

import "./App.css";

export default function App() {
  return (
    <div className="app-shell">
      <Header />

      <main className="app-main">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/find-cricsal" element={<FindCricsal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected */}
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />

          {/* ✅ ADD THIS ROUTE */}
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
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

          {/* Owner dashboard (nested) */}
          <Route
            path="/owner-dashboard"
            element={
              <RequireAuth>
                <OwnerLayout />
              </RequireAuth>
            }
          >
            <Route index element={<OwnerDashboard />} />
            <Route path="courts" element={<OwnerCourts />} />
            <Route path="bookings" element={<OwnerBookings />} />
            <Route path="settings" element={<OwnerSettings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
