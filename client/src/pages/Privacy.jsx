import React from 'react';
import './BrandPages.css';

const PrivacyPolicy = () => {
    return (
        <div className="brand-page-container">
            <div className="brand-hero">
                <span className="brand-pre">Legal</span>
                <h1 className="brand-title">Privacy Policy</h1>
            </div>

            <div className="legal-container">
                <div className="legal-content">
                    <p>Last updated: December 25, 2025</p>

                    <h2>1. Introduction</h2>
                    <p>
                        At Sridhar Fashions, we value your privacy. This policy explains how we collect, use, and protect your personal information when you visit our website or make a purchase.
                    </p>

                    <h2>2. Information We Collect</h2>
                    <ul>
                        <li>Personal identifiers (Name, Email, Phone Number, Shipping Address).</li>
                        <li>Payment information (Processed securely via third-party providers).</li>
                        <li>Device information and browsing behavior through cookies.</li>
                    </ul>

                    <h2>3. How We Use Your Data</h2>
                    <p>
                        We use your information to process orders, improve our website, and send occasional brand updates. We do not sell your personal data to third parties.
                    </p>

                    <h2>4. Data Security</h2>
                    <p>
                        We implement industry-standard security measures to safeguard your information. However, no method of transmission over the internet is 100% secure.
                    </p>

                    <h2>5. Your Rights</h2>
                    <p>
                        You have the right to access, correct, or request the deletion of your personal data at any time.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
