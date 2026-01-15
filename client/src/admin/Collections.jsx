import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API_URL from "../config";

export default function Collections() {
  const API = `${API_URL}/meta/collection`;
  const token =
    localStorage.getItem("authToken") || localStorage.getItem("token") || "";

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [value, setValue] = useState("");

  const loadItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setItems(data.items || []);
    } catch (err) {
      console.error("Collection fetch error:", err);
      toast.error("Failed to load collections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSave = async () => {
    if (!value.trim()) return toast.error("Collection name is required");

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
      toast.success(editId ? "Collection Updated" : "Collection Created");
    } catch (err) {
      toast.error(err.message || "Error saving collection");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this collection?")) return;

    try {
      const res = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      loadItems();
      toast.success("Collection Deleted");
    } catch (err) {
      toast.error(err.message || "Delete failed");
    }
  };

  return (
    <div className="admin-page template-page-container">
      <div className="admin-top">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => window.history.back()} className="back-btn" aria-label="Go Back">
            ← Back
          </button>
          <h2 className="admin-title" style={{ margin: 0 }}>Manage Collections</h2>
        </div>
      </div>

      <div className="template-layout">
        <div className="template-form-section">
          <div className="card">
            <h3 className="card-title">{editId ? "Edit Collection" : "Add New Collection"}</h3>
            <div className="form-group">
              <label className="field-label">Collection Name</label>
              <input
                type="text"
                value={value}
                placeholder="Enter collection name"
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
                {editId ? "Update Collection" : "Add Collection"}
              </button>
            </div>
          </div>
        </div>

        <div className="template-list-section">
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 className="card-title">Existing Collections</h3>
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
                {items.length === 0 && <p className="muted">No collections found.</p>}
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
