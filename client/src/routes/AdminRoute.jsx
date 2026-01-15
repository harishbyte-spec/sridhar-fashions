// src/routes/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("role");

  // No login → send to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but not admin → go home
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }
  

  // Admin → allow
  return children;
}
