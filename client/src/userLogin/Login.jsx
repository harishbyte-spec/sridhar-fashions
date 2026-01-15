// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";
import "./login.css";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Invalid email or password");
      }

      // ==========================================================
      // SAVE AUTH INFO IN CORRECT FORMAT (IMPORTANT)
      // ==========================================================
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      // localStorage.setItem("role", data.user.role); // required for AdminRoute
      localStorage.setItem("role", data.user.role.toLowerCase());


      // Update context
      loginUser(data.user);

      // ==========================================================
      // ADMIN REDIRECT
      // ==========================================================
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong");
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
            <span className="login-tagline">Heritage & Craft</span>
            <h1 className="login-hero-text">
              The Art of
              <br />
              Woven Poetry.
            </h1>
            <p className="login-caption">
              Enter your boutique dashboard to manage the world's finest handwoven sarees and timeless artisanal legacies.
            </p>
          </div>
        </div>

        {/* Form Side */}
        <div className="login-form-card">
          <h2 className="login-title">Sign In</h2>
          <p className="login-subtitle">
            Welcome back to your exclusive space.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="login-label">
              Signature Email
              <input
                type="email"
                className="login-input"
                placeholder="email@boutique.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="login-label">
              Passcode
              <input
                type="password"
                className="login-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Verifying..." : "Access Dashboard"}
            </button>
          </form>

          <div className="login-footnote">
            Don't have an account yet? <br />
            <span className="login-switch-link" onClick={() => navigate("/register")}>
              Register for your account
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
