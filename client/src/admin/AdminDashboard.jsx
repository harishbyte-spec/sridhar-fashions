// src/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import "./admin.css";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, products: 0 });
  const navigate = useNavigate();

  // PROTECT PAGE
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));
    if (!user || user.role !== "admin") {
      navigate("/login");
    }
  }, []);

  // GET STATS DATA
  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch(`${API_URL}/admin/stats`);
      const data = await res.json();
      if (data.success) {
        setStats({ users: data.users, products: data.products });
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="admin-page">

      <div className="admin-top">
         <h2 className="admin-title">Welcome Back, Admin</h2>
      </div>

      <div className="admin-stats-row">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Users</div>
          <div className="admin-stat-value">{stats.users}</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Products</div>
          <div className="admin-stat-value">{stats.products}</div>
        </div>

        {/* Placeholder for future stats */}
        <div className="admin-stat-card">
          <div className="admin-stat-label">Pending Orders</div>
          <div className="admin-stat-value">0</div>
        </div>
         <div className="admin-stat-card">
          <div className="admin-stat-label">Revenue</div>
          <div className="admin-stat-value">₹ 0</div>
        </div>
      </div>
    </div>
  );
}
