import React from "react";
import "./location.css";

export default function LocationSection() {
    return (
        <section className="location-section">
            <div className="loc-container">
                <div className="loc-info">
                    <span className="loc-pre">Our Legacy</span>
                    <h2>Artisanal Heritage</h2>
                    <p>
                        Established with a vision to celebrate the timeless elegance of Indian weaving, Sridhar Fashions has become a destination for those who seek authenticity. Every drape in our collection tells a story of passion, precision, and the enduring beauty of handwoven silk.
                    </p>
                    <div className="loc-details">
                        <div className="loc-detail-item">
                            <strong>The Boutique:</strong>
                            <p>
                                Durgigudi Main Road, Nehru Rd,<br />
                                next to Surama Textiles, Shivamogga,<br />
                                Karnataka - 577201
                            </p>
                        </div>
                        <div className="loc-detail-item">
                            <strong>Inquiries:</strong>
                            <p>081824 05059</p>
                        </div>
                    </div>
                </div>
                <div className="loc-map">
                    <iframe
                        title="Sridhar Fashions Location"
                        src="https://maps.google.com/maps?q=13.9365361,75.5708678&z=17&output=embed"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </section>
    );
}
