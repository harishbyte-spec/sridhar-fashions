// src/admin/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import "./admin.css";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API_URL from "../config";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("authUser"));
    if (!user || user.role !== "admin") navigate("/login");
  }, []);

  // FETCH ALL PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products?admin=true`);
        const data = await res.json();
        if (data.success) setProducts(data.products);
      } catch (err) {
        console.error("Error fetching products", err);
        toast.error("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        setProducts((p) => p.filter((item) => item._id !== id));
        toast.success("Product deleted");
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      console.error("Delete failed", err);
      toast.error("Delete failed");
    }
  };

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
    <div className="admin-page">
      <div className="admin-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => window.history.back()} className="back-btn" aria-label="Go Back">
            ← Back
          </button>
          <h2 className="admin-title" style={{ margin: 0 }}>Product Catalog</h2>
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
          <Link to="/admin/add-product" className="admin-btn">
            + New Product
          </Link>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredProducts.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((p) => (
            <div key={p._id} className="product-card-admin">
              <img
                src={p.thumbnail || p.colors?.[0]?.images?.[0] || "/no-image.jpg"}
                alt={p.title}
                className="product-thumb"
              />
              <div className="product-info">
                <h3>{p.title}</h3>
                <div className="product-price">₹ {p.price}</div>
              </div>

              <div className="admin-card-actions">
                <Link to={`/admin/edit-product/${p._id}`} className="admin-edit-btn">
                  Edit
                </Link>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(p._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
