import React, { useState, useEffect } from "react";
import "./promo.css";
import { Link } from "react-router-dom";
import axios from "axios";
import promoImgFallback from "../../assets/silk cotton.jpg";
import API_URL from "../../config";

export default function PromoSection({ settings }) {
    // If settings not loaded, return null or skeleton
    // This prevents the dummy fallback image from displaying before the real one loads
    if (!settings) return <div style={{ height: "400px" }}></div>;

    const promoImg = settings.accessorizeImage?.url || promoImgFallback;

    return (
        <section className="promo-lux-section">
            <div className="promo-lux-container">
                <div className="promo-image-box">
                    <img src={promoImg} alt="Saree Accessories and Blouses" loading="lazy" width="800" height="600" onError={(e) => e.target.src = "/images/placeholder-saree.jpg"} />
                    <div className="promo-image-overlay"></div>
                </div>

                <div className="promo-content-card">
                    <div className="promo-card-inner">
                        <span className="promo-badge">The Perfect Finish</span>
                        <h2 className="promo-lux-title">Accessorize the Drape</h2>
                        <div className="promo-lux-line"></div>
                        <p className="promo-lux-text">
                            Complete your look with the perfect finishing touches.
                            Explore our ready-made designer blouses and artisanal accessories designed to elevate your saree.
                        </p>
                        <Link to="/shop" className="promo-lux-btn" aria-label="Shop Accessories Collection">Shop Collection</Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
