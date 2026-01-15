import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./adminProducts.css";
import toast from "react-hot-toast";
import API_URL from "../config";

const API = `${API_URL}/products`;

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  const fetchProducts = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product permanently?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div className="admin-page">
      <h1 className="admin-title">All Products</h1>

      <div className="admin-table">
        <div className="admin-table-head">
          <span>Image</span>
          <span>Title</span>
          <span>Price</span>
          <span>SKU</span>
          <span>Actions</span>
        </div>

        {products.map((p) => (
          <div key={p._id} className="admin-table-row">
            <img
              src={p.thumbnail || "/placeholder.png"}
              alt={p.title}
            />

            <span>{p.title}</span>
            <span>₹ {p.price}</span>
            <span>{p.productNo}</span>

            <div className="admin-actions">
              <Link
                to={`/admin/edit-product/${p._id}`}
                className="btn-edit"
              >
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
    </div>
  );
}
