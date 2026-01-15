import React from "react";
import "./testimonials.css";
import { FaQuoteLeft } from "react-icons/fa";

const reviews = [
    { name: "Priya S.", text: "The Kanchipuram silk saree I bought for my wedding was absolutely stunning. The quality and craftsmanship are unmatched!", location: "Chennai" },
    { name: "Anjali M.", text: "Beautiful collection and excellent service. The silk cotton sarees are so comfortable and elegant for daily wear.", location: "Bangalore" },
    { name: "Sneha R.", text: "Ordering via WhatsApp was seamless. The saree arrived beautifully packaged and looked even better in person.", location: "Hyderabad" }
];

export default function Testimonials() {
    return (
        <section className="testimonials-section">
            <h2 className="section-title">Client Love</h2>
            <div className="testimonials-grid">
                {reviews.map((r, i) => (
                    <div key={i} className="testi-card">
                        <FaQuoteLeft className="quote-icon" />
                        <p className="testi-text">"{r.text}"</p>
                        <div className="testi-author">
                            <strong>{r.name}</strong>
                            <span>{r.location}</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
