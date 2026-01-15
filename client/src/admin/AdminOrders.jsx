// src/admin/AdminOrders.jsx
import React, { useEffect, useState } from "react";
import "./admin.css";
import API_URL from "../config";

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("authToken");
                const res = await fetch(`${API_URL}/admin/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.success) {
                    setOrders(data.orders);
                }
            } catch (err) {
                console.error("Error fetching admin orders:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="admin-page">Loading WhatsApp Order Logs...</div>;

    return (
        <div className="admin-page">
            <div className="admin-top">
                <h2 className="admin-title">WhatsApp Intent Logs</h2>
            </div>

            <div className="admin-card" style={{ padding: "30px", background: "white", borderRadius: "24px", boxShadow: "0 10px 40px rgba(0,0,0,0.05)" }}>
                {orders.length === 0 ? (
                    <p style={{ textAlign: "center", color: "#64748b", padding: "40px" }}>No WhatsApp clicks logged yet.</p>
                ) : (
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ textAlign: "left", borderBottom: "2px solid #f1f5f9", color: "#64748b", fontSize: "13px", textTransform: "uppercase", letterSpacing: "1px" }}>
                                <th style={{ padding: "16px" }}>Product</th>
                                <th style={{ padding: "16px" }}>User Email</th>
                                <th style={{ padding: "16px" }}>Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }}>
                                    <td style={{ padding: "16px" }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                                            <img
                                                src={order.productImage}
                                                alt=""
                                                style={{ width: "50px", height: "65px", borderRadius: "8px", objectFit: "cover", background: "#f8fafc" }}
                                            />
                                            <span style={{ fontWeight: "600", color: "#1e293b" }}>{order.productName}</span>
                                        </div>
                                    </td>
                                    <td style={{ padding: "16px" }}>
                                        <span style={{ color: "#4f46e5", fontWeight: "500" }}>{order.userEmail}</span>
                                    </td>
                                    <td style={{ padding: "16px", color: "#64748b", fontSize: "14px" }}>
                                        {new Date(order.clickedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
