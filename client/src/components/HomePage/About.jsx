import React from "react";
import "./about.css";
import aboutImg from "../../assets/react.svg"; // add your image here

export default function AboutSection() {
  return (
    <section className="about-section">
      <div className="about-container">

        {/* LEFT IMAGE */}
        <div className="about-image">
          <img src={aboutImg} alt="Sridhar Fashions" />
        </div>

        {/* RIGHT TEXT */}
        <div className="about-text">
          <h2>About Sridhar Fashions</h2>
          <p>
            At Sridhar Fashions, we bring you the finest collection of 
            handwoven Silk, Cotton, and Silk-Cotton sarees crafted with 
            tradition, elegance, and purity. 
          </p>

          <p>
            Each saree in our collection is carefully curated to reflect 
            timeless beauty, intricate craftsmanship, and luxurious comfort 
            — perfect for weddings, festivals, and special occasions.
          </p>

          <button className="about-btn">Explore Collection</button>
        </div>
      </div>
    </section>
  );
}
