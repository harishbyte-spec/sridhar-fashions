import React, { useState } from 'react';
import './BrandPages.css';

const Contact = () => {
  const [status, setStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("sending");
    // Simulate API call
    setTimeout(() => setStatus("success"), 1500);
  };

  return (
    <div className="brand-page-container">
      <div className="brand-hero">
        <span className="brand-pre">Get In Touch</span>
        <h1 className="brand-title">We’d Love to <br /> Hear From You</h1>
      </div>

      <section className="contact-container">
        <div className="contact-form-card">
          {status === "success" ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <h2 style={{ fontFamily: 'Playfair Display', color: '#b49349' }}>Message Received</h2>
              <p style={{ fontFamily: 'Plus Jakarta Sans', color: '#555' }}>
                Thank you for reaching out. Our concierge will be in touch shortly.
              </p>
              <button className="contact-submit-btn" onClick={() => setStatus(null)} style={{ marginTop: '20px' }}>
                Send Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="brand-grid" style={{ gap: '30px' }}>
                <div className="form-group">
                  <label>Full Name</label>
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="example@email.com" required />
                </div>
              </div>

              <div className="form-group">
                <label>Subject</label>
                <input type="text" placeholder="How can we help?" />
              </div>

              <div className="form-group">
                <label>Your Message</label>
                <textarea rows="5" placeholder="Tell us more..."></textarea>
              </div>

              <button type="submit" className="contact-submit-btn" disabled={status === "sending"}>
                {status === "sending" ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>

        <div className="brand-grid" style={{ marginTop: '80px', textAlign: 'center' }}>
          <div className="brand-text-block">
            <span className="brand-pre" style={{ letterSpacing: '2px', fontSize: '9px' }}>Visit Us</span>
            <a
              href="https://www.google.com/maps/dir//Durgigudi+Main+Road,+Nehru+Rd,+next+to+Surama+Textiles,+Shivamogga,+Karnataka+577201/@13.9365361,75.5708678,17z"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              <p style={{ fontSize: '18px', color: '#1a1a1a' }}>
                Durgigudi Main Road, Nehru Rd, <br />
                next to Surama Textiles, Shivamogga, <br />
                Karnataka 577201
              </p>
            </a>
          </div>
          <div className="brand-text-block">
            <span className="brand-pre" style={{ letterSpacing: '2px', fontSize: '9px' }}>Inquiries</span>
            <p style={{ fontSize: '18px', color: '#1a1a1a' }}>
              <a href="mailto:sridharfashions@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>
                sridharfashions@gmail.com
              </a> <br />
              <a href="https://wa.me/08182405059" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
                081824 05059 (WhatsApp)
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;