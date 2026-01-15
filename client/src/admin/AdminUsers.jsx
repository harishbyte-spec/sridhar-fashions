// src/admin/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import "./admin.css";
import toast from "react-hot-toast";
import API_URL from "../config";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Edit State
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "", // Optional password override
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const [usersRes, wishlistRes] = await Promise.all([
        fetch(`${API_URL}/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${API_URL}/admin/wishlist-insights`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      const usersData = await usersRes.json();
      const wishlistData = await wishlistRes.json();

      if (usersData.success) setUsers(usersData.users);
      if (wishlistData.success) setWishlists(wishlistData.insights);
    } catch (err) {
      console.error("Error fetching admin user data:", err);
      toast.error("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (u) => {
    setEditingUser(u);
    setEditForm({
      name: u.name,
      email: u.email,
      phone: u.phone || "",
      password: "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/admin/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("User updated successfully");
        setEditingUser(null);
        fetchData();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setUsers(users.filter(u => u._id !== userId));
        toast.success("User deleted");
      } else {
        toast.error(data.message || "Delete failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error during deletion");
    }
  };

  if (loading) return <div className="admin-page">Loading Users...</div>;

  // Filter users based on search query
  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    return (
      u.name?.toLowerCase().includes(query) ||
      u.email?.toLowerCase().includes(query) ||
      u.phone?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="admin-page">
      <div className="admin-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button onClick={() => window.history.back()} className="back-btn" aria-label="Go Back">
            ← Back
          </button>
          <h2 className="admin-title" style={{ margin: 0 }}>User Intelligence</h2>
        </div>
        <input
          type="text"
          placeholder="🔍 Search users..."
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
      </div>

      <div className="admin-card" style={{ padding: "30px", background: "white", borderRadius: "20px", marginBottom: "40px", boxShadow: "0 10px 30px rgba(0,0,0,0.02)" }}>
        <h3 style={{ marginBottom: "25px", color: "#1e293b" }}>Total Registered Users: {filteredUsers.length}</h3>
        <table className="admin-table" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #f1f5f9", color: "#64748b", fontSize: "14px" }}>
              <th style={{ padding: "12px" }}>Name</th>
              <th style={{ padding: "12px" }}>Email</th>
              <th style={{ padding: "12px" }}>Phone</th>
              <th style={{ padding: "12px" }}>Joined</th>
              <th style={{ padding: "12px", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u) => (
              <tr key={u._id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                <td style={{ padding: "12px", fontWeight: "500" }}>{u.name}</td>
                <td style={{ padding: "12px" }}>{u.email}</td>
                <td style={{ padding: "12px" }}>{u.phone || "-"}</td>
                <td style={{ padding: "12px" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td style={{ padding: "12px", textAlign: "right" }}>
                  <button
                    onClick={() => handleEditClick(u)}
                    style={{ background: "#b49349", color: "white", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", marginRight: "8px", fontSize: "12px" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u._id)}
                    style={{ background: "#fee2e2", color: "#b91c1c", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "white", padding: "40px", borderRadius: "24px", width: "100%", maxWidth: "500px", position: "relative" }}>
            <h2 style={{ marginBottom: "5px", fontFamily: "Playfair Display, serif" }}>Refine User Profile</h2>
            <p style={{ color: "#64748b", fontSize: "14px", marginBottom: "30px" }}>Update personal details or override credentials.</p>

            <form onSubmit={handleUpdate}>
              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", color: "#b49349", fontWeight: "bold", marginBottom: "5px" }}>Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #eee" }}
                  required
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", color: "#b49349", fontWeight: "bold", marginBottom: "5px" }}>Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #eee" }}
                  required
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", color: "#b49349", fontWeight: "bold", marginBottom: "5px" }}>Phone Number</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #eee" }}
                />
              </div>

              <div style={{ marginBottom: "30px" }}>
                <label style={{ display: "block", fontSize: "11px", textTransform: "uppercase", color: "#e11d48", fontWeight: "bold", marginBottom: "5px" }}>Reset Password (leave blank for no change)</label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="New password"
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #fecaca" }}
                />
              </div>

              <div style={{ display: "flex", gap: "15px" }}>
                <button type="submit" style={{ flex: 1, background: "#b49349", color: "white", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                  Save Changes
                </button>
                <button type="button" onClick={() => setEditingUser(null)} style={{ flex: 1, background: "#f1f5f9", color: "#334155", padding: "14px", borderRadius: "12px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Decorative Gold Bar mentioned by user */}
      <div style={{ width: "100px", height: "15px", background: "#b49349", margin: "40px auto", borderRadius: "3px" }}></div>

      <div className="admin-top">
        <h2 className="admin-title" style={{ background: "linear-gradient(to right, #b49349, #ccac66)", color: "white" }}>Product Interests</h2>
      </div>

      <div className="admin-card" style={{ padding: "30px", background: "white", borderRadius: "20px" }}>
        {wishlists.length === 0 ? (
          <p>No user wishlists found yet.</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
            {wishlists.map((item) => (
              <div key={item.email} style={{ border: "1px solid #f1f5f9", borderRadius: "16px", padding: "20px" }}>
                <h4 style={{ color: "#b49349", marginBottom: "5px" }}>{item.name}</h4>
                <p style={{ fontSize: "12px", color: "#64748b", marginBottom: "15px" }}>{item.email}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {item.wishlist.map((p) => (
                    <div key={p._id} title={p.title} style={{ width: "60px", height: "80px", borderRadius: "8px", overflow: "hidden", border: "1px solid #eee" }}>
                      <img src={p.thumbnail} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
