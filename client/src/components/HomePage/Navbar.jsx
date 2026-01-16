// src/components/HomePage/Navbar.jsx
import React, { useContext, useState } from "react";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { WishlistContext } from "../../context/WishlistContext";
import { AuthContext } from "../../context/AuthContext";
import { CurrencyContext } from "../../context/CurrencyContext";

import logone from "../../assets/SF_logo-removebg-preview.png"
import logotwo from "../../assets/SF_logo-removebg-preview.png"




export default function Navbar() {
  const { wishlist } = useContext(WishlistContext);
  const { user, logoutUser } = useContext(AuthContext);
  const { currency, currencies, switchCurrency } = useContext(CurrencyContext);

  const [adminMenuOpen, setAdminMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logoutUser();
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("role");
    setAdminMenuOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* MOBILE MENU TOGGLE (Left) */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
        ☰
      </button>

      {/* BRAND (Logo + Text) */}
      <Link to="/" className="nav-brand" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div className="Sridhar_Fashions_logo">
          <img src={logone} alt="Sridhar Fashions Logo" className="SF_logo" loading="eager" />
        </div>
        <div className="nav-logo">
          Sridhar<span> Fashions</span>
        </div>
      </Link>

      {/* MAIN LINKS (Desktop) */}
      <div className="nav-links">
        <Link to="/" className={location.pathname === "/" ? "" : ""}>Home</Link>
        <Link to="/shop" className={location.pathname === "/shop" ? "active" : ""}>Shop</Link>
        <Link to="/favourites" className={location.pathname === "/favourites" ? "active" : ""}>Favourites ({wishlist.length})</Link>
        <Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link>
        <Link to="/contact" className={location.pathname === "/contact" ? "active" : ""}>Contact</Link>
      </div>

      {/* RIGHT SIDE – AUTH + ADMIN */}
      <div className="nav-right">

        {/* If not logged in */}
        {!user && (
          <Link className="nav-login-btn" to="/login">
            Login
          </Link>
        )}

        {/* If logged in */}
        {user && (
          <>
            <span className="nav-user-name">
              Hi, {user.name?.split(" ")[0] || "User"}
            </span>

            {user.role === "admin" && (
              <div className="nav-admin-menu">
                <button
                  type="button"
                  className="nav-admin-btn"
                  onClick={() => setAdminMenuOpen((prev) => !prev)}
                  aria-label="Toggle admin menu"
                >
                  ☰
                </button>

                {adminMenuOpen && (
                  <div className="nav-admin-dropdown">
                    <Link to="/admin/dashboard" onClick={() => setAdminMenuOpen(false)}>Dashboard</Link>
                    <Link to="/admin/add-product" onClick={() => setAdminMenuOpen(false)}>Create Product</Link>
                    <Link to="/admin/products" onClick={() => setAdminMenuOpen(false)}>All Products</Link>
                    <Link to="/admin/users" onClick={() => setAdminMenuOpen(false)}>User Insights</Link>
                    <Link to="/admin/order-insights" onClick={() => setAdminMenuOpen(false)}>Order Insights</Link>
                    <Link to="/admin/templates" onClick={() => setAdminMenuOpen(false)}>Text Templates</Link>
                    <Link to="/admin/manage-home" onClick={() => setAdminMenuOpen(false)}>Manage Home</Link>
                    <Link to="/admin/occasions" onClick={() => setAdminMenuOpen(false)}>Occasions</Link>

                    {/* ===== META ===== */}
                    <div className="nav-admin-divider">Meta</div>
                    <Link to="/admin/categories" onClick={() => setAdminMenuOpen(false)}>Categories</Link>
                    <Link to="/admin/collections" onClick={() => setAdminMenuOpen(false)}>Collections</Link>
                    <Link to="/admin/fabrics" onClick={() => setAdminMenuOpen(false)}>Fabrics</Link>
                    <Link to="/admin/origins" onClick={() => setAdminMenuOpen(false)}>Manage Origins</Link>
                    <Link to="/admin/jari-types" onClick={() => setAdminMenuOpen(false)}>Manage Jari Types</Link>

                    <div className="nav-admin-divider">Account</div>
                    <Link to="/profile" onClick={() => setAdminMenuOpen(false)}>My Profile</Link>

                    <button type="button" className="nav-admin-logout" onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            )}

            {/* NORMAL USER LINKS - Desktop mainly, but kept here */}
            {user.role !== "admin" && (
              <div className="nav-user-desktop-only">
                <Link to="/profile" className="nav-profile-link" style={{ marginRight: "15px", fontSize: "14px", color: "#b49349", fontWeight: "600", textDecoration: "none" }}>
                  Profile
                </Link>
                <button type="button" className="nav-logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </>
        )}

        {/* CURRENCY SWITCHER */}
        <div className="nav-currency-switcher" style={{ marginLeft: "15px", position: "relative", display: "inline-block" }}>
          <select
            value={currency.code}
            onChange={(e) => switchCurrency(e.target.value)}
            aria-label="Select Currency"
            style={{
              background: "transparent",
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "4px 8px",
              fontSize: "13px",
              fontWeight: "600",
              color: "#333",
              cursor: "pointer",
              outline: "none"
            }}
          >
            {currencies.map(c => (
              <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
            ))}
          </select>
        </div>
      </div>
    </div>

      {/* MOBILE MENU OVERLAY */ }
  <div className={`mobile-menu-overlay ${mobileMenuOpen ? "open" : ""}`}>
    <div className="mobile-menu-content">
      <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close navigation menu">✕</button>

      <div className="mobile-menu-links">
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
        <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
        <Link to="/favourites" onClick={() => setMobileMenuOpen(false)}>Favourites ({wishlist.length})</Link>
        <Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link>
        <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>

        {user && (
          <>
            <div className="mobile-divider">Account</div>
            <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
            {user.role === "admin" && (
              <Link to="/admin/dashboard" onClick={() => setMobileMenuOpen(false)}>Admin Dashboard</Link>
            )}
            <button className="mobile-logout-btn" onClick={handleLogout}>Logout</button>
          </>
        )}

        {!user && (
          <Link to="/login" className="mobile-login-link" onClick={() => setMobileMenuOpen(false)}>Login / Register</Link>
        )}
      </div>
    </div>
  </div>
    </nav >
  );
}
