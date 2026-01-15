import React from 'react';
import './BrandPages.css';

const About = () => {
  return (
    <div className="brand-page-container">
      <div className="brand-hero">
        <span className="brand-pre">Our Heritage</span>
        <h1 className="brand-title">Elegance Woven <br /> Into Every Thread</h1>
      </div>

      <section className="brand-section">
        <div className="brand-grid">
          <div className="brand-text-block">
            <h2>Our Vision</h2>
            <p>
              At Sridhar Fashions, we believe a saree is more than just six yards of fabric—it is a canvas of history, a symbol of grace, and a legacy passed through generations.
            </p>
            <p>
              Founded with a passion for preserving the intricate art of Indian weaving, we collaborate directly with master artisans to bring you sarees that are as unique as the women who wear them.
            </p>
          </div>
          <div className="brand-image-block">
            <img src="/images/placeholder-saree.png" alt="Heritage Weaving" />
          </div>
        </div>
      </section>

      <section className="brand-section" style={{ backgroundColor: '#fdfbf7' }}>
        <div className="brand-grid" style={{ gridTemplateColumns: '1fr', textAlign: 'center', maxWidth: '800px' }}>
          <div className="brand-text-block">
            <h2>The Promise of Quality</h2>
            <p>
              Every piece in our collection undergoes a rigorous selection process. From the purity of the silk to the precision of the zari work, we ensure that every drape feels like a second skin—breathable, luxurious, and timeless.
            </p>
            <p>
              Whether it's a regal Kanchipuram, a breathable Cotton, or a versatile Silk-Cotton, our commitment to authenticity remains unwavering.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;