import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API_URL from "../config";

export default function Categories() {
  const API = `${API_URL}/meta/category`;
  const token =
    localStorage.getItem("authToken") || localStorage.getItem("token") || "";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [value, setValue] = useState("");

  // Load all categories
  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setItems(data.items || []);
    } catch (err) {
      console.error("Fetch category error:", err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Add or update
  const handleSave = async () => {
    if (!value.trim()) return toast.error("Name is required");

    try {
      const method = editId ? "PUT" : "POST";
      const url = editId ? `${API}/${editId}` : API;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: value }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setModalOpen(false);
      setValue("");
      setEditId(null);
      loadItems();
      toast.success(editId ? "Category Updated" : "Category Added");
    } catch (err) {
      toast.error(err.message || "Error saving category");
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      loadItems();
      toast.success("Category deleted");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <div className="admin-page template-page-container">
      <div className="admin-top">
        <h2 className="admin-title">Manage Categories</h2>
      </div>

      <div className="template-layout">
        {/* LEFT COLUMN: FORM */}
        <div className="template-form-section">
          <div className="card">
            <h3 className="card-title">{editId ? "Edit Category" : "Add New Category"}</h3>
            <div className="form-group">
              <label className="field-label">Category Name</label>
              <input
                type="text"
                value={value}
                placeholder="Enter category name"
                onChange={(e) => setValue(e.target.value)}
              />
            </div>

            <div className="actions">
              {editId && (
                <button
                  className="btn-outline"
                  onClick={() => {
                    setEditId(null);
                    setValue("");
                  }}
                  style={{ marginRight: "10px" }}
                >
                  Cancel
                </button>
              )}
              <button className="btn-primary" onClick={handleSave}>
                {editId ? "Update Category" : "Add Category"}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIST */}
        <div className="template-list-section">
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 className="card-title">Existing Categories</h3>
              <input
                type="text"
                placeholder="🔍 Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e5e7eb",
                  fontSize: "13px",
                  width: "200px",
                  outline: "none",
                }}
                onFocus={(e) => e.target.style.borderColor = "#b49349"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="template-list">
                {items.length === 0 && <p className="muted">No categories found.</p>}
                {items.filter((item) => item.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((item) => (
                  <div key={item._id} className="template-item">
                    <span className="template-name">{item.name}</span>
                    <div className="template-actions">
                      <button
                        className="edit-icon-btn"
                        onClick={() => {
                          setEditId(item._id);
                          setValue(item.name);
                        }}
                      >
                        ✏️
                      </button>
                      <button
                        className="delete-icon-btn"
                        onClick={() => handleDelete(item._id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
