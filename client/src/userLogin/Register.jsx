// src/pages/Register.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API_URL from "../config";
import "./login.css"; // uses SAME style as login page

import toast from "react-hot-toast";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "Something went wrong");
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Heritage Side */}
        <div className="login-visual">
          <div className="login-visual-content">
            <span className="login-tagline">Begin Your Story</span>
            <h1 className="login-hero-text">
              Fine Weaves,
              <br />
              Timeless Tales.
            </h1>
            <p className="login-caption">
              Join Sridhar Fashions to curate your artisanal collection and preserve the heritage of handwoven elegance.
            </p>
          </div>
        </div>

        {/* Form Side */}
        <div className="login-form-card">
          <h2 className="login-title">Create Account</h2>
          <p className="login-subtitle">
            Register to experience artisanal excellence.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-label">
              Distinguished Name
              <input
                type="text"
                className="login-input"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>

            <div className="login-label">
              Signature Email
              <input
                type="email"
                className="login-input"
                placeholder="email@boutique.com"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                required
              />
            </div>

            <div className="login-label">
              Secure Passcode
              <input
                type="password"
                className="login-input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Processing..." : "Create Account"}
            </button>
          </form>

          <div className="login-footnote">
            Already have an account? <br />
            <span className="login-switch-link" onClick={() => navigate("/login")}>
              Sign in to your boutique
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
