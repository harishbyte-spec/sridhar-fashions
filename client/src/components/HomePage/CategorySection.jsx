import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./category.css";
import API_URL from "../../config";

import silkImg from "../../assets/silk saree.jpg";
import cottonImg from "../../assets/cotton.jpg";
import silkCottonImg from "../../assets/silk cotton.jpg";

const CategorySection = () => {
  const [categories, setCategories] = useState([
    { url: silkImg, title: "Silk Sarees" },
    { url: cottonImg, title: "Cotton Sarees" },
    { url: silkCottonImg, title: "Silk-Cotton" }
  ]);

  useEffect(() => {
    fetch(`${API_URL}/home-settings`)
      .then(res => res.json())
      .then(data => {
        if (data.settings?.categories) {
          const mapped = data.settings.categories.map((c, i) => ({
            url: c.url || [silkImg, cottonImg, silkCottonImg][i],
            title: c.title || ["Silk Sarees", "Cotton Sarees", "Silk-Cotton"][i]
          }));
          setCategories(mapped);
        }
      })
      .catch(err => console.error("Category settings fetch error", err));
  }, []);

  return (
    <section className="collections-accordion-section">
      <div className="accordion-header">
        <span className="accordion-pre">Our Signature Styles</span>
        <h2 className="accordion-title">Explore Our Collections</h2>
      </div>

      <div className="accordion-container">
        {categories.slice(0, 3).map((cat, i) => (
          <div key={i} className="accordion-panel">
            <div className="accordion-bg">
              <img src={cat.url} alt={cat.title} loading="lazy" width="400" height="600" />
              <div className="accordion-overlay"></div>
            </div>

            <div className="accordion-content">
              <span className="accordion-num">0{i + 1}</span>
              <h3 className="accordion-panel-title">{cat.title}</h3>
              <div className="accordion-action">
                <Link to={`/shop?category=${encodeURIComponent(cat.title)}`} className="accordion-link" aria-label={`View ${cat.title} Collection`}>View Collection</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySection;
