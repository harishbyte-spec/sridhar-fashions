// src/pages/Profile.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaUserEdit, FaPlus, FaTrashAlt, FaMapMarkerAlt, FaTimes } from "react-icons/fa";
import "./profile.css";
import API_URL from "../config";

export default function Profile() {
    const { user, updateUser } = useContext(AuthContext);

    const [personalInfo, setPersonalInfo] = useState({
        name: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
    });

    const [addresses, setAddresses] = useState(user?.addresses || []);
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddressIndex, setEditingAddressIndex] = useState(null);

    const [newAddress, setNewAddress] = useState({
        label: "Home",
        street: "",
        city: "",
        state: "",
        zip: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (user) {
            setPersonalInfo({
                name: user.name,
                phone: user.phone || "",
                email: user.email,
            });
            setAddresses(user.addresses || []);
        }
    }, [user]);

    const handleInfoUpdate = async () => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${API_URL}/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: personalInfo.name,
                    phone: personalInfo.phone
                })
            });
            const data = await res.json();
            if (data.success) {
                updateUser(data.user);
                setSuccess("Profile updated successfully!");
                setIsEditingInfo(false);
            } else {
                setError(data.message || "Failed to update profile");
            }
        } catch (err) {
            setError("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddressSave = async () => {
        if (!newAddress.street || !newAddress.city || !newAddress.state || !newAddress.zip) {
            setError("Please fill all address fields.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            let updatedAddresses = [...addresses];
            if (editingAddressIndex !== null) {
                updatedAddresses[editingAddressIndex] = newAddress;
            } else {
                updatedAddresses.push(newAddress);
            }

            const token = localStorage.getItem("authToken");
            const res = await fetch(`${API_URL}/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ addresses: updatedAddresses })
            });
            const data = await res.json();
            if (data.success) {
                updateUser(data.user);
                setShowAddressModal(false);
                setEditingAddressIndex(null);
                setNewAddress({ label: "Home", street: "", city: "", state: "", zip: "" });
            } else {
                setError(data.message || "Failed to save address");
            }
        } catch (err) {
            setError("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const deleteAddress = async (index) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;

        setLoading(true);
        try {
            const updatedAddresses = addresses.filter((_, i) => i !== index);
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${API_URL}/auth/profile`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ addresses: updatedAddresses })
            });
            const data = await res.json();
            if (data.success) {
                updateUser(data.user);
            }
        } catch (err) {
            setError("Failed to delete address");
        } finally {
            setLoading(false);
        }
    };

    const openEditAddress = (index) => {
        setEditingAddressIndex(index);
        setNewAddress(addresses[index]);
        setShowAddressModal(true);
    };

    if (!user) {
        return (
            <div className="profile-page">
                <div className="profile-container" style={{ textAlign: "center" }}>
                    <h2 className="profile-title">Please Sign In</h2>
                    <p>You need to be logged in to view your profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">

                <header className="profile-header">
                    <span className="profile-subtitle">Personal Sanctuary</span>
                    <h1 className="profile-title">Your Profile</h1>
                </header>

                {(error || success) && (
                    <div className={`profile-alert ${error ? "error" : "success"}`} style={{
                        padding: "15px", borderRadius: "12px", marginBottom: "20px",
                        backgroundColor: error ? "#fee" : "#efc",
                        color: error ? "#c33" : "#363",
                        fontSize: "14px", textAlign: "center", border: error ? "1px solid #fcc" : "1px solid #cfb"
                    }}>
                        {error || success}
                    </div>
                )}

                <div className="profile-grid">

                    {/* Personal Info Card */}
                    <aside className="profile-card">
                        <div className="profile-avatar-wrap">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>

                        <div className="profile-info-item">
                            <span className="profile-info-label">Signature Name</span>
                            {isEditingInfo ? (
                                <input
                                    type="text"
                                    className="profile-info-input"
                                    value={personalInfo.name}
                                    onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                                />
                            ) : (
                                <div className="profile-info-value">{user.name}</div>
                            )}
                        </div>

                        <div className="profile-info-item">
                            <span className="profile-info-label">Registered Email</span>
                            <div className="profile-info-value" style={{ opacity: 0.6 }}>{user.email}</div>
                        </div>

                        <div className="profile-info-item">
                            <span className="profile-info-label">Contact Phone</span>
                            {isEditingInfo ? (
                                <input
                                    type="text"
                                    className="profile-info-input"
                                    placeholder="e.g. +91 98765 43210"
                                    value={personalInfo.phone}
                                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                                />
                            ) : (
                                <div className="profile-info-value">{user.phone || "Not provided"}</div>
                            )}
                        </div>

                        <div className="profile-info-actions">
                            {isEditingInfo ? (
                                <>
                                    <button className="save-btn" onClick={handleInfoUpdate} disabled={loading}>
                                        {loading ? "Updating..." : "Save Changes"}
                                    </button>
                                    <button className="action-btn" onClick={() => setIsEditingInfo(false)} style={{ display: "block", width: "100%", marginTop: "10px" }}>
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <button className="btn-wishlist" onClick={() => setIsEditingInfo(true)} style={{ marginTop: "10px" }}>
                                    <FaUserEdit style={{ marginRight: "8px" }} /> Edit Profile
                                </button>
                            )}
                        </div>
                    </aside>

                    {/* Address Management Section */}
                    <main className="address-section">
                        <div className="section-head">
                            <h2 className="section-title">Shipping Legacy</h2>
                            <button className="add-btn" onClick={() => {
                                setEditingAddressIndex(null);
                                setNewAddress({ label: "Home", street: "", city: "", state: "", zip: "" });
                                setShowAddressModal(true);
                            }}>
                                <FaPlus style={{ marginRight: "8px" }} /> Add Address
                            </button>
                        </div>

                        {addresses.length === 0 ? (
                            <div className="empty-state" style={{ textAlign: "center", padding: "40px", color: "#8a7b6a" }}>
                                <FaMapMarkerAlt style={{ fontSize: "40px", marginBottom: "15px", display: "block", margin: "0 auto" }} />
                                <p>No addresses found. Add a destination for your sarees.</p>
                            </div>
                        ) : (
                            <div className="address-list">
                                {addresses.map((addr, idx) => (
                                    <div className="address-card" key={idx}>
                                        <span className="address-label">{addr.label}</span>
                                        <div className="address-details">
                                            {addr.street}<br />
                                            {addr.city}, {addr.state} - {addr.zip}
                                        </div>
                                        <div className="address-actions">
                                            <button className="action-btn" onClick={() => openEditAddress(idx)}>Edit</button>
                                            <button className="action-btn delete" onClick={() => deleteAddress(idx)}>Delete</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </main>
                </div>

            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <button className="modal-close" onClick={() => setShowAddressModal(false)}><FaTimes /></button>
                        <span className="modal-subtitle">Shipping Sanctuary</span>
                        <h2 className="section-title" style={{ marginBottom: "40px" }}>
                            {editingAddressIndex !== null ? "Refine Address" : "New Shipping Point"}
                        </h2>

                        <div className="address-form-grid">
                            <div className="profile-info-item form-full">
                                <span className="profile-info-label">Address Category</span>
                                <select
                                    className="profile-info-input"
                                    value={newAddress.label}
                                    onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                                >
                                    <option value="Home">Home</option>
                                    <option value="Work">Office</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="profile-info-item form-full">
                                <span className="profile-info-label">Street Address</span>
                                <input
                                    type="text"
                                    className="profile-info-input"
                                    value={newAddress.street}
                                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                />
                            </div>

                            <div className="profile-info-item">
                                <span className="profile-info-label">City</span>
                                <input
                                    type="text"
                                    className="profile-info-input"
                                    value={newAddress.city}
                                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                />
                            </div>

                            <div className="profile-info-item">
                                <span className="profile-info-label">Zip Code</span>
                                <input
                                    type="text"
                                    className="profile-info-input"
                                    value={newAddress.zip}
                                    onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                                />
                            </div>

                            <div className="profile-info-item form-full">
                                <span className="profile-info-label">State / Region</span>
                                <input
                                    type="text"
                                    className="profile-info-input"
                                    value={newAddress.state}
                                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                />
                            </div>
                        </div>

                        <button className="save-btn" onClick={handleAddressSave} disabled={loading}>
                            {loading ? "Preserving..." : "Save Address"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
