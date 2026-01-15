import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API_URL from "../config";

const API = `${API_URL}/meta/jari`;

export default function JariTypes() {
    const [items, setItems] = useState([]);
    const [name, setName] = useState("");
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    const token = localStorage.getItem("authToken");

    const fetchItems = async () => {
        setLoading(true);
        try {
            const res = await fetch(API);
            const data = await res.json();
            setItems(data.items || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load jari types");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleSave = async () => {
        if (!name.trim()) return toast.error("Name required");

        const method = editId ? "PUT" : "POST";
        const url = editId ? `${API}/${editId}` : API;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name }),
            });

            const data = await res.json();
            if (!res.ok) return toast.error(data.message);

            toast.success(editId ? "Jari Type Updated" : "Jari Type Added");
            setName("");
            setEditId(null);
            fetchItems();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const deleteItem = async (id) => {
        if (!window.confirm("Delete?")) return;

        try {
            await fetch(`${API}/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            toast.success("Deleted successfully");
            fetchItems();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="admin-page template-page-container">
            <div className="admin-top">
                <h2 className="admin-title">Manage Jari Types</h2>
            </div>

            <div className="template-layout">
                {/* LEFT: FORM */}
                <div className="template-form-section">
                    <div className="card">
                        <h3 className="card-title">{editId ? "Edit Jari Type" : "Add New Jari Type"}</h3>
                        <div className="form-group">
                            <label className="field-label">Jari Type Name</label>
                            <input
                                type="text"
                                value={name}
                                placeholder="Enter jari type"
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="actions">
                            {editId && (
                                <button
                                    className="btn-outline"
                                    onClick={() => {
                                        setEditId(null);
                                        setName("");
                                    }}
                                    style={{ marginRight: "10px" }}
                                >
                                    Cancel
                                </button>
                            )}
                            <button className="btn-primary" onClick={handleSave}>
                                {editId ? "Update Jari Type" : "Add Jari Type"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* RIGHT: LIST */}
                <div className="template-list-section">
                    <div className="card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h3 className="card-title">Existing Jari Types</h3>
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
                                {items.length === 0 && <p className="muted">No jari types found.</p>}
                                {items.filter((i) => i.name?.toLowerCase().includes(searchQuery.toLowerCase())).map((i) => (
                                    <div key={i._id} className="template-item">
                                        <span className="template-name">{i.name}</span>
                                        <div className="template-actions">
                                            <button
                                                className="edit-icon-btn"
                                                onClick={() => {
                                                    setEditId(i._id);
                                                    setName(i.name);
                                                }}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="delete-icon-btn"
                                                onClick={() => deleteItem(i._id)}
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
