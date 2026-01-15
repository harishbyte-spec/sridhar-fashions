import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./occasions.css";
import API_URL from "../../config";

export default function OccasionsSection() {
    const [occasions, setOccasions] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/occasions`)
            .then(res => res.json())
            .then(data => {
                if (data.occasions) setOccasions(data.occasions);
            })
            .catch(err => console.error(err));
    }, []);

    if (occasions.length === 0) return null;

    return (
        <section className="occasions-section">
            <div className="section-header">
                <p className="section-subtitle">From everyday to occasion wear</p>
                <h2 className="section-title">Shop by Occasion</h2>
                <div className="occ-tabs">
                    {occasions.map(occ => (
                        <Link to="/shop" state={{ occasion: occ.name }} key={occ._id} className="occ-tab-link">
                            {occ.name}
                        </Link>
                    ))}
                </div>
            </div>

            <div className="occasions-grid">
                {occasions.map((occ) => (
                    <div key={occ._id} className="occ-card">
                        <img src={occ.image} alt={occ.name} loading="lazy" width="400" height="300" />
                        <div className="occ-overlay">
                            <h3>{occ.name}</h3>
                            <Link to="/shop" state={{ occasion: occ.name }} className="occ-btn" aria-label={`Shop for ${occ.name}`}>Explore</Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
