
// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";

// import Header from "./components/Navbar";
// import Footer from "./components/Footer";

// import Landing from "./pages/user/Landing";
// import Home from "./pages/user/Home";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import FindCricsal from "./pages/user/FindCricsal";

// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
// import VerifyOtp from "./pages/VerifyOtp";

// import Dashboard from "./pages/user/Dashboard";
// import BookCricsal from "./pages/user/BookCricsal"; 
// import Bookings from "./pages/user/Booking"; 
// import RequireAuth from "./components/RequireAuth";

// import Profile from "./pages/user/UserProfile"; 
// import EditProfile from "./pages/user/EditProfile";

// import OwnerLayout from "./pages/owner/OwnerLayout";
// import OwnerDashboard from "./pages/owner/OwnerDashboard";
// import OwnerCourts from "./pages/owner/OwnerCourts";
// import OwnerBookings from "./pages/owner/OwnerBookings";
// import OwnerSettings from "./pages/owner/OwnerSettings";
// import GroundDetails from "./pages/user/GroundDetails";


// import "./App.css";
// // import AdminLayout from "./pages/admin/AdminLayout";
// // import AdminDashboard from "./pages/admin/AdminDashboard";
// // import AdminBookings from "./pages/admin/AdminBookings";


// export default function App() {
//   return (
//     <div className="app-shell">
//       <Header />

//       <main className="app-main">
//         <Routes>
//           {/* Public */}
//           <Route path="/" element={<Landing />} />
//           <Route path="/find-cricsal" element={<FindCricsal />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/verify-otp" element={<VerifyOtp />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/reset-password/:token" element={<ResetPassword />} />
//           <Route path="/ground/:id" element={<GroundDetails />} />

//           {/* Protected */}
//           <Route
//             path="/home"
//             element={
//               <RequireAuth>
//                 <Home />
//               </RequireAuth>
//             }
//           />

//           {/* ✅ ADD THIS ROUTE */}
//           <Route
//             path="/profile"
//             element={
//               <RequireAuth>
//                 <Profile />
//               </RequireAuth>
//             }
//           />

// <Route
//   path="/book/:cricsalId"
//   element={
//     <RequireAuth>
//       <BookCricsal />
//     </RequireAuth>
//   }
// />


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

//            <Route
//             path="/profile/edit"
//             element={
//               <RequireAuth>
//                 <EditProfile />
//               </RequireAuth>
//             }
//           />

//           {/* Owner dashboard (nested) */}
//           <Route
//             path="/owner-dashboard"
//             element={
//               <RequireAuth>
//                 <OwnerLayout />
//               </RequireAuth>
//             }
//           >
//             <Route index element={<OwnerDashboard />} />
//             <Route path="courts" element={<OwnerCourts />} />
//             <Route path="bookings" element={<OwnerBookings />} />
//             <Route path="settings" element={<OwnerSettings />} />
//           </Route>

//           {/* Fallback */}
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>

//         {/* <Routes>
//   <Route path="/admin" element={<AdminLayout />}>
//     <Route index element={<AdminDashboard />} />
//     <Route path="bookings" element={<AdminBookings />} />
//   </Route>
// </Routes> */}
//       </main>

//       <Footer />
//     </div>
//   );
// }


import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

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
import EditProfile from "./pages/user/EditProfile";
import GroundDetails from "./pages/user/GroundDetails";

import OwnerLayout from "./pages/owner/OwnerLayout";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerCourts from "./pages/owner/OwnerCourts";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerSettings from "./pages/owner/OwnerSettings";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminOwners from "./pages/admin/AdminOwners";
import AdminGrounds from "./pages/admin/AdminGrounds";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminReviews from "./pages/admin/AdminReviews";

import InvoiceVerification from "./pages/InvoiceVerification";

import "./App.css";

function AppRoutes() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="app-shell">
      {!isAdminRoute && <Header />}

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/find-cricsal" element={<FindCricsal />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/ground/:id" element={<GroundDetails />} />
          <Route path="/invoice/:bookingId" element={<InvoiceVerification />} />
          <Route
            path="/home"
            element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            }
          />

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

          <Route
            path="/profile/edit"
            element={
              <RequireAuth>
                <EditProfile />
              </RequireAuth>
            }
          />

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

          <Route
            path="/admin"
            element={
              <RequireAuth role="admin">
                <AdminLayout />
              </RequireAuth>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="owners" element={<AdminOwners />} />
            <Route path="grounds" element={<AdminGrounds />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

export default function App() {
  return <AppRoutes />;
}