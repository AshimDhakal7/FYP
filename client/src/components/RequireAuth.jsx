import React from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Protects routes based on auth and optional required role.
 *
 * Usage:
 *   <RequireAuth>                    -> any logged-in user
 *   <RequireAuth role="admin">       -> admin or superadmin
 */
export default function RequireAuth({ children, role }) {
  const token = localStorage.getItem("token");
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role) {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userRole = user?.role;

      if (role === "admin") {
        if (userRole !== "admin" && userRole !== "superadmin") {
          return <Navigate to="/" replace />;
        }
      } else if (userRole !== role) {
        return <Navigate to="/" replace />;
      }
    } catch {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
}