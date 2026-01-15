import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "./featured.css";
import { Link } from "react-router-dom";
import Price from "../Price";
import API_URL from "../../config";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(res => res.json())
      .then(data => {
        // Handle both Array and Object with products field
        const items = Array.isArray(data) ? data : (data.products || []);
        if (items.length > 0) {
          setProducts(items.slice(0, 8));
        }
      })
      .catch(err => console.error("Featured fetch error", err));
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="featured-section-luxury">
      <div className="luxury-header">
        <span className="luxury-pre">Exquisite Collection</span>
        <h2 className="luxury-title">New Arrivals</h2>
        <div className="luxury-line"></div>
        <p className="luxury-subtitle">Discover our latest handpicked sarees crafted for elegance</p>
      </div>

      <Swiper
        modules={[Navigation, Autoplay, Pagination]}
        navigation
        pagination={{ clickable: true, dynamicBullets: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        spaceBetween={40}
        slidesPerView={1}
        loop={products.length > 4}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1440: { slidesPerView: 4 },
        }}
        className="featured-slider-luxury"
      >
        {products.map((item) => {
          const mainImg = item.thumbnail || (item.colors && item.colors[0]?.images?.[0]) || "/images/placeholder-saree.jpg";
          return (
            <SwiperSlide key={item._id}>
              <Link to={`/product/${item._id}`} className="luxury-card">
                <div className="luxury-img-wrap">
                  <img src={mainImg} alt={item.title} />
                  <div className="luxury-overlay-btn">
                    <span>Explore Details</span>
                  </div>
                </div>
                <div className="luxury-info">
                  <h3 className="luxury-item-title">{item.title}</h3>
                  <div className="luxury-price-tag">
                    <Price amount={item.price} />
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </section>
  );
}
