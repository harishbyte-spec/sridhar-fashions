import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";
import { FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer-lux-section">
      <div className="footer-lux-container">
        {/* Brand Section */}
        <div className="footer-lux-brand">
          <h2 className="lux-brand-logo">Sridhar <span>Fashions</span></h2>
          <p className="lux-brand-tagline">
            Weaving tradition with modern elegance. Premium handwoven sarees crafted for the woman of today.
          </p>
          <div className="lux-social-row">
            <a href="https://www.instagram.com/sridharfashionskanchipuram?igsh=ZHpseDAzMzBxcWg%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" className="lux-social-btn" aria-label="Visit us on Instagram"><FaInstagram /></a>
            <a href="https://wa.me/918197082919" target="_blank" rel="noopener noreferrer" className="lux-social-btn" aria-label="Chat with us on WhatsApp"><FaWhatsapp /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-lux-links">
          <h3 className="lux-footer-title">Quick Links</h3>
          <ul className="lux-link-list">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/story">Our Story</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* Collections Links */}
        <div className="footer-lux-links">
          <h3 className="lux-footer-title">Collections</h3>
          <ul className="lux-link-list">
            <li><Link to="/shop">Silk Sarees</Link></li>
            <li><Link to="/shop">Cotton Sarees</Link></li>
            <li><Link to="/shop">Silk-Cotton</Link></li>
            <li><Link to="/shop">New Arrivals</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-lux-contact">
          <h3 className="lux-footer-title">Connect</h3>
          <div className="lux-contact-item">
            <span className="lux-contact-label">Address</span>
            <a
              href="https://www.google.com/maps/dir//Durgigudi+Main+Road,+Nehru+Rd,+next+to+Surama+Textiles,+Shivamogga,+Karnataka+577201/@13.9365361,75.5708678,17z"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              <p>Durgigudi Main Road, Nehru Rd, <br /> next to Surama Textiles, Shivamogga, <br /> Karnataka 577201</p>
            </a>
          </div>
          <div className="lux-contact-item">
            <span className="lux-contact-label">Email</span>
            <a href="mailto:sridharfashions@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
              <p>sridharfashions@gmail.com</p>
            </a>
          </div>
          <div className="lux-contact-item">
            <span className="lux-contact-label">Phone</span>
            <a href="tel:918197082919" style={{ color: 'inherit', textDecoration: 'none' }}>
              <p>+91 81970 82919</p>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-lux-bottom">
        <div className="lux-bottom-container">
          <p>© {new Date().getFullYear()} Sridhar Fashions. Handcrafted with Love.</p>
          <div className="lux-bottom-links">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
