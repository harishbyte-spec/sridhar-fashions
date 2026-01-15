import React from 'react';
import './BrandPages.css';

const TermsOfService = () => {
    return (
        <div className="brand-page-container">
            <div className="brand-hero">
                <span className="brand-pre">Legal</span>
                <h1 className="brand-title">Terms of Service</h1>
            </div>

            <div className="legal-container">
                <div className="legal-content">
                    <p>Last updated: December 25, 2025</p>

                    <h2>1. Terms</h2>
                    <p>
                        By accessing Sridhar Fashions, you agree to abide by these terms and conditions. If you do not agree, please do not use our services.
                    </p>

                    <h2>2. Intellectual Property</h2>
                    <p>
                        All content on this site, including images, text, and designs, is the property of Sridhar Fashions and is protected by copyright laws.
                    </p>

                    <h2>3. Product Accuracy</h2>
                    <p>
                        We strive to display our sarees as accurately as possible. However, due to the nature of handwoven fabrics and screen variations, slight color or texture differences may occur.
                    </p>

                    <h2>4. Shipping & Returns</h2>
                    <p>
                        Shipping times and return policies are outlined in our dedicated Shipping Guide. We reserve the right to refuse returns on custom-altered products.
                    </p>

                    <h2>5. Limitation of Liability</h2>
                    <p>
                        Sridhar Fashions shall not be held liable for any indirect or consequential damages arising from the use of our website or products.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
