import React from 'react';
import './BrandPages.css';
import silkImg from '../assets/silk saree.jpg';

const Story = () => {
    return (
        <div className="brand-page-container">
            <div className="brand-hero">
                <span className="brand-pre">The Artisanal Journey</span>
                <h1 className="brand-title">From the Loom <br /> To Your Wardrobe</h1>
            </div>

            <section className="brand-section">
                <div className="brand-grid">
                    <div className="brand-image-block">
                        <img src="/images/placeholder-saree.png" alt="The Loom" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1598462041242-9969062e249b?auto=format&fit=crop&q=80&w=800"} />
                    </div>
                    <div className="brand-text-block">
                        <h2>The Craft</h2>
                        <p>
                            Our story begins in the quiet villages where the rhythm of the loom is the heartbeat of the community. Here, weaving is not just a trade; it is a spiritual practice.
                        </p>
                        <p>
                            Each Sridhar Fashions saree takes weeks, sometimes months, to complete. The process starts with selecting the finest raw silk and hand-dyeing it in an array of vibrant, natural hues.
                        </p>
                    </div>
                </div>
            </section>

            <section className="brand-section" style={{ backgroundColor: '#fff' }}>
                <div className="brand-grid">
                    <div className="brand-text-block">
                        <h2>The Weaver's Hand</h2>
                        <p>
                            The soul of the saree lies in the hand of the weaver. Every minor variation in the weave is a testament to its handmade nature—a signature of a human touch that machines can never replicate.
                        </p>
                        <p>
                            By choosing Sridhar Fashions, you are directly supporting weaving families and helping preserve a thousand-year-old tradition that celebrates the beauty of slow fashion.
                        </p>
                    </div>
                    <div className="brand-image-block">
                        <img src={silkImg} alt="The Weaver" onError={(e) => e.target.src = "https://images.unsplash.com/photo-1510480115228-3e549117edab?auto=format&fit=crop&q=80&w=800"} />
                    </div>
                </div>
            </section>

            <section className="brand-section" style={{ backgroundColor: '#111', color: '#fff', textAlign: 'center' }}>
                <div className="brand-text-block" style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <h2 style={{ color: '#fff' }}>A Drape of Destiny</h2>
                    <p style={{ color: '#aaa' }}>
                        We invite you to be a part of our story. Wear a piece of art that carries the whispers of the loom and the dreams of the artisan.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default Story;
