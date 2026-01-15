import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./allProducts.css";
import API_URL from "../config";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products?admin=true`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    const token = localStorage.getItem("authToken");

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setProducts(products.filter((p) => p._id !== id));
        alert("Product deleted!");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  if (loading) return <p className="loading-text">Loading products...</p>;

  // Filter products based on search query
  const filteredProducts = products.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.title?.toLowerCase().includes(query) ||
      p.productNo?.toLowerCase().includes(query) ||
      p.price?.toString().includes(query)
    );
  });

  return (
    <div className="all-products-page">
      <div className="header-row">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => window.history.back()} className="back-btn" aria-label="Go Back">
            ← Back
          </button>
          <h2 style={{ margin: 0 }}>All Products</h2>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="🔍 Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "14px",
              width: "280px",
              outline: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => e.target.style.borderColor = "#b49349"}
            onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
          />
          <Link to="/admin/add-product" className="btn-create">+ Create Product</Link>
        </div>
      </div>

      <div className="product-table">
        <div className="row header">
          <div className="cell">Thumbnail</div>
          <div className="cell">Title</div>
          <div className="cell">Price</div>
          <div className="cell">Product No</div>
          <div className="cell">Actions</div>
        </div>

        {filteredProducts.map((p) => (
          <div className="row" key={p._id}>
            <div className="cell">
              {p.thumbnail ? (
                <img src={p.thumbnail} alt="thumb" className="thumb-img" />
              ) : (
                <span className="no-thumb">No Image</span>
              )}
            </div>

            <div className="cell">{p.title}</div>
            <div className="cell">₹{p.price}</div>
            <div className="cell">{p.productNo}</div>

            <div className="cell actions">
              <Link to={`/admin/edit-product/${p._id}`} className="btn-edit">
                Edit
              </Link>

              <button
                className="btn-delete"
                onClick={() => deleteProduct(p._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
