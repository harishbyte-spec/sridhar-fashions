// src/pages/ProductDetails.jsx
import React, { useState, useEffect, useContext } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import "./productDetails.css";
import { WishlistContext } from "../../context/WishlistContext";
import { AuthContext } from "../../context/AuthContext";
import { FaHeart, FaRegHeart, FaWhatsapp, FaShippingFast, FaRulerCombined } from "react-icons/fa";
import { addWatermark } from "../../utils/urlHelper";
import Price from "../Price";
import API_URL from "../../config";

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const locationProduct = location.state?.product || null;
  const locationSelectedColor = location.state?.selectedColor || null;

  const { toggleWishlist, isWishlisted } = useContext(WishlistContext);

  const [product, setProduct] = useState(locationProduct);
  const [loading, setLoading] = useState(!locationProduct);
  const [error, setError] = useState("");

  const [colorList, setColorList] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);

  // Images: Array of objects { src: string, tag: "Main" | "Body" | "Pallu" etc }
  const [images, setImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [openSection, setOpenSection] = useState("description"); // Default open
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // 1) Fetch product from backend if not passed via state
  useEffect(() => {
    if (product) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        const data = await res.json();

        if (!data.success || !data.product) {
          setError("Product not found.");
        } else {
          setProduct(data.product);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, product]);

  // 2) Build colour list + images logic
  useEffect(() => {
    if (!product) return;

    let list;
    if (Array.isArray(product.colors) && product.colors.length > 0) {
      list = product.colors.map((c) => {
        // Build Typed Media Array
        const typedMedia = [];

        // Main Images -> Type "image"
        if (c.images && c.images.length) {
          c.images.forEach(img => typedMedia.push({ src: addWatermark(img), tag: "View", type: "image" }));
        }

        // Part Images -> Tag "Body", "Pallu", etc
        if (c.body?.image) typedMedia.push({ src: addWatermark(c.body.image), tag: "Body", type: "image" });
        if (c.border?.image) typedMedia.push({ src: addWatermark(c.border.image), tag: "Border", type: "image" });
        if (c.pallu?.image) typedMedia.push({ src: addWatermark(c.pallu.image), tag: "Pallu", type: "image" });
        if (c.blouse?.image) typedMedia.push({ src: addWatermark(c.blouse.image), tag: "Blouse", type: "image" });

        // Videos -> Type "video"
        if (c.videos && c.videos.length) {
          c.videos.forEach(vid => typedMedia.push({ src: vid, tag: "Video", type: "video" }));
        }

        // Fallback
        if (typedMedia.length === 0 && product.thumbnail) {
          typedMedia.push({ src: addWatermark(product.thumbnail), tag: "Main", type: "image" });
        }

        return {
          id: c._id || c.name || "default",
          displayName: c.name || "Colour",
          swatch: c.hexCode || "#b49349",
          images: typedMedia, // naming kept as 'images' for compatibility but contains media
        };
      });
    } else {
      // Legacy Structure
      list = [{
        id: "default",
        displayName: "Default",
        swatch: "#b49349",
        images: product.thumbnail ? [{ src: addWatermark(product.thumbnail), tag: "Main", type: "image" }] : []
      }];
    }

    setColorList(list);

    // Default Selection Logic
    let initialColor = list[0];
    if (locationSelectedColor) {
      initialColor = list.find((c) => c.displayName === locationSelectedColor.name || c.id === locationSelectedColor._id) || list[0];
    }

    setSelectedColor(initialColor);
    setImages(initialColor.images);
    setActiveImageIndex(0);
  }, [product, locationSelectedColor]);


  // Handlers
  const handleColorSelect = (c) => {
    setSelectedColor(c);
    setImages(c.images);
    setActiveImageIndex(0);
  };

  const { user, updateUser } = useContext(AuthContext); // user needed for email log

  const handleWhatsAppOrder = async () => {
    const WHATSAPP_NUMBER = "918056799410";
    const message = `Hello, I'm interested in: ${product?.title} (${selectedColor?.displayName}). Price: ₹${product?.price}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    // Log to admin if user is logged in
    if (user?.email) {
      try {
        await fetch(`${API_URL}/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail: user.email,
            productName: `${product.title} (${selectedColor?.displayName})`,
            productImage: addWatermark(images[0]?.src || product.thumbnail)
          })
        });
      } catch (err) {
        console.error("Failed to log order hint", err);
      }
    }

    window.open(url, "_blank");
  };

  const productId = product?._id || product?.id;

  // 3) Fetch Related Products
  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    if (!product) return;

    const fetchRelated = async () => {
      try {
        const res = await fetch(`${API_URL}/products`);
        const data = await res.json();
        if (data.success || Array.isArray(data.products)) {
          const all = data.products || [];
          // Filter: Same category, exclude current, limit to 4
          const related = all
            .filter(p => p.category === product.category && p._id !== product._id)
            .slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error("Failed to fetch related", err);
      }
    };
    fetchRelated();
  }, [product]);


  if (loading) return <div className="pd-page"><div className="pd-container">Loading...</div></div>;
  if (error || !product) return <div className="pd-page"><div className="pd-container">Product Not Found</div></div>;

  const activeImgObj = images[activeImageIndex] || { src: "", tag: "" };

  return (
    <div
      className="pd-page"
      style={{
        "--active-theme": selectedColor?.swatch || "#000000"
      }}
    >
      <div className="pd-container">

        {/* Breadcrumbs */}
        <div className="pd-breadcrumbs">
          <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{product.title}</span>
        </div>

        <div className="pd-content-wrapper">
          {/* --- LEFT: GALLERY --- */}
          <div className="pd-gallery-container">
            {/* Scrollable Sidebar Thumbnails */}
            <div className="pd-thumbs-sidebar">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`pd-thumb-wrapper ${idx === activeImageIndex ? 'active' : ''}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  {img.type === "video" ? (
                    <div className="pd-video-thumb-overlay">
                      <video src={img.src} muted />
                      <div className="play-icon-small">▶</div>
                    </div>
                  ) : (
                    <img src={img.src} alt={`thumb-${idx}`} className="pd-thumb" />
                  )}
                </div>
              ))}
            </div>

            {/* Main Image/Video */}
            <div className="pd-main-media-wrapper" onClick={() => setLightboxOpen(true)}>
              {activeImgObj.type === "video" ? (
                <video
                  src={activeImgObj.src}
                  className="pd-main-media"
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls={false}
                />
              ) : (
                <img src={activeImgObj.src} className="pd-main-media" alt="Main View" />
              )}
              {activeImgObj.tag && activeImgObj.tag !== "View" && activeImgObj.tag !== "Main" && (
                <div className="pd-img-tag">{activeImgObj.tag}</div>
              )}
              {activeImgObj.type === "video" && (
                <div className="pd-video-indicator">VIDEO</div>
              )}
            </div>
          </div>

          {/* --- RIGHT: INFO --- */}
          <div className="pd-info-col">
            <h1 className="pd-title">{product.title}</h1>
            <div className="pd-specs-grid">
              <div className="pd-spec-item">
                <span className="spec-label">SAREE CODE</span>
                <span className="spec-value">{product.productNo || 'SF-XXXX'}</span>
              </div>
              <div className="pd-spec-item">
                <span className="spec-label">HERITAGE</span>
                <span className="spec-value">{product.origin || 'Artisanal'}</span>
              </div>
              <div className="pd-spec-item">
                <span className="spec-label">TYPE OF JARI</span>
                <span className="spec-value">{product.jariType || 'Authentic'}</span>
              </div>
            </div>

            <div className="pd-price-row">
              <span className="pd-price"><Price amount={product.price} /></span>
              {product.silkMark && (
                <span className="pd-silk-mark-badge">
                  ✓ Silk Mark Certified
                </span>
              )}
            </div>

            {/* Color Selector */}
            <div className="pd-color-section">
              <div className="pd-color-title">Color: {selectedColor?.displayName}</div>
              <div className="pd-colors-list">
                {colorList.map(c => (
                  <button
                    key={c.id}
                    className={`pd-color-btn ${selectedColor?.id === c.id ? 'active' : ''}`}
                    style={{ backgroundColor: c.swatch }}
                    onClick={() => handleColorSelect(c)}
                    title={c.displayName}
                  />
                ))}
              </div>
            </div>

            {/* Actions - Stacked */}
            <div className="pd-actions">
              <button onClick={handleWhatsAppOrder} className="btn-whatsapp">
                ORDER VIA WHATSAPP
              </button>
              <button className="btn-wishlist" onClick={() => toggleWishlist(product)}>
                {isWishlisted(productId) ? <FaHeart color="#e0245e" /> : <FaRegHeart />}
                <span style={{ marginLeft: '10px' }}>Add to Wishlist</span>
              </button>
            </div>

            {/* Accordion */}
            <div className="pd-accordion">
              {[
                { id: 'description', label: 'Description', content: product.descriptionValue },
                { id: 'measurements', label: 'Measurements', content: product.measurementValue },
                { id: 'washcare', label: 'Wash Care', content: product.washcareValue },
                { id: 'notes', label: 'Notes', content: product.notesValue },
                {
                  id: 'shipping', label: 'Shipping & Returns', content: `
                            <strong>Shipping:</strong> ${product.shippingTime || '3-5 Business Days'} <br/><br/>
                            <strong>Returns:</strong> Returns accepted only for damaged products with unboxing video within 24 hours of delivery.
                        ` }
              ].map(sect => (
                <div key={sect.id} className="pd-acc-item">
                  <button className="pd-acc-header" onClick={() => setOpenSection(openSection === sect.id ? '' : sect.id)}>
                    {sect.label}
                    <span>{openSection === sect.id ? '−' : '+'}</span>
                  </button>
                  {openSection === sect.id && (
                    <div className="pd-acc-content" dangerouslySetInnerHTML={{ __html: sect.content || "No details available." }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RELATED PRODUCTS --- */}
        {relatedProducts.length > 0 && (
          <div className="pd-related-section">
            <h3 className="pd-related-title">You May Also Like</h3>
            <div className="pd-related-grid">
              {relatedProducts.map(rp => {
                const mainImg = rp.thumbnail || (rp.colors && rp.colors[0]?.images?.[0]) || "/images/placeholder-saree.jpg";
                return (
                  <Link to={`/product/${rp._id}`} key={rp._id} className="pd-related-card">
                    <div className="pd-related-img-wrap">
                      <img src={mainImg} alt={rp.title} />
                    </div>
                    <div className="pd-related-info">
                      <h4>{rp.title}</h4>
                      <p><Price amount={rp.price} /></p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Overlay */}
      {lightboxOpen && (
        <div className="lightbox-overlay" onClick={() => setLightboxOpen(false)}>
          <button className="lightbox-close" onClick={() => setLightboxOpen(false)}>×</button>

          {activeImgObj.type === "video" ? (
            <video
              src={activeImgObj.src}
              className="lightbox-media"
              controls
              autoPlay
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <img src={activeImgObj.src} className="lightbox-media" alt="Zoomed" onClick={(e) => e.stopPropagation()} />
          )}
        </div>
      )}

    </div>
  );
}
