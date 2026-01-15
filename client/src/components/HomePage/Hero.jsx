import React, { useState, useEffect } from "react";
import "./Hero.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import modelImg from "../../assets/model2.png"; // Fallback
import API_URL from "../../config";

const Hero = () => {
  const [heroImg, setHeroImg] = useState(modelImg);

  useEffect(() => {
    fetch(`${API_URL}/home-settings`)
      .then(res => res.json())
      .then(data => {
        if (data.settings?.heroBanner?.url) {
          setHeroImg(data.settings.heroBanner.url);
        }
      })
      .catch(err => console.error("Hero settings fetch error", err));
  }, []);

  return (
    <div className="hero-split-container">
      {/* LEFT SIDE: CONTENT */}
      <div className="hero-info-side">
        <motion.div
          className="hero-content-v2"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <p className="hero-tagline">Sridhar fashions · Since 1998</p>

          <h1 className="hero-title">
            Drape Yourself in <span>Timeless Luxury</span>
          </h1>

          <p className="hero-text">
            Handpicked silk, cotton and silk-cotton sarees crafted by master
            weavers. Celebrate every occasion with grace, colour and heritage.
          </p>

          <div className="hero-actions">
            <Link to="/shop" className="hero-btn hero-btn-primary" aria-label="Shop Silk Saree Collection">
              Shop Silk Collection
            </Link>
            <Link to="/shop" className="hero-btn hero-btn-secondary" aria-label="Explore Cotton Saree Collection">
              Explore Cotton
            </Link>
          </div>

          <div className="hero-stats-v2">
            <div>
              <span>5000+</span>
              <p>Happy Brides</p>
            </div>
            <div>
              <span>25+</span>
              <p>Years of Tradition</p>
            </div>
            <div>
              <span>100%</span>
              <p>Handwoven</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* RIGHT SIDE: IMAGE */}
      <div className="hero-visual-side">
        <motion.div
          className="hero-img-showcase"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <img src={heroImg} alt="Model wearing a premium Sridhar Fashions silk saree" fetchpriority="high" width="600" height="800" />
        </motion.div>
      </div>
    </div>
  )
}

export default Hero