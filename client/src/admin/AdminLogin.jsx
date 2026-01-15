import React, { useState } from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Temporary password (change later)
    if (password === "admin123") {
      localStorage.setItem("adminToken", "logged_in");
      navigate("/admin/dashboard");
    } else {
      toast.error("Incorrect password");
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}
