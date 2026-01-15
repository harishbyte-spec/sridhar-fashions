import React, { useEffect, useState } from "react";
import "./Intro.css";

const Intro = ({ onComplete }) => {
    const [exiting, setExiting] = useState(false);

    useEffect(() => {
        // 1. Show intro
        // 2. Wait for loading bar (~2.5s)
        // 3. Fade out
        const timer = setTimeout(() => {
            setExiting(true);
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 800); // Wait for fade out transition
        }, 2800);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`intro-overlay ${exiting ? "exit" : ""}`}>
            <div className="intro-logo-container">
                <h1 className="intro-title">Sridhar <span>Fashions</span></h1>
                <p className="intro-subtitle">Timeless Elegance</p>
                <div className="loading-line" style={{ margin: "30px auto" }}></div>
            </div>
        </div>
    );
};

export default Intro;
