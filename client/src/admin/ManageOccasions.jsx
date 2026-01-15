import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css";
import { FaSearch, FaPlus, FaTimes, FaTrash, FaCalendarCheck, FaCheck } from "react-icons/fa";
import modelFallback from "../assets/silk saree.jpg";

import toast from "react-hot-toast";
import API_URL from "../config";

// ... (imports remain)
const API_PRODUCTS = `${API_URL}/products`;
const API_OCCASIONS = `${API_URL}/occasions`;

export default function ManageOccasions() {
    const [products, setProducts] = useState([]);
    const [occasions, setOccasions] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    // Modals & States
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [occSearch, setOccSearch] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newOccasion, setNewOccasion] = useState({ name: "" });
    const [updating, setUpdating] = useState(false);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [prodRes, occRes] = await Promise.all([
                axios.get(API_PRODUCTS),
                axios.get(API_OCCASIONS)
            ]);
            setProducts(prodRes.data.products || []);
            setOccasions(occRes.data.occasions || []);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOccasion = async (e) => {
        e.preventDefault();
        if (!newOccasion.name) return toast.error("Occasion name is required");

        setCreating(true);
        try {
            const token = localStorage.getItem("authToken");
            const res = await axios.post(API_OCCASIONS, { name: newOccasion.name }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.data.success) {
                setOccasions([...occasions, res.data.occasion]);
                setNewOccasion({ name: "" });
                setShowCreateModal(false);
                toast.success("Occasion created!");
            }
        } catch (err) {
            toast.error("Creation failed");
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteOccasion = async (id) => {
        if (!window.confirm("Are you sure? Products using this occasion will no longer be linked to it.")) return;
        try {
            const token = localStorage.getItem("authToken");
            await axios.delete(`${API_OCCASIONS}/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOccasions(occasions.filter(o => o._id !== id));
            toast.success("Occasion deleted");
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const toggleOccasion = async (occId) => {
        if (!selectedProduct) return;

        setUpdating(true);
        try {
            const token = localStorage.getItem("authToken");
            const currentOccs = selectedProduct.occasions || [];
            const isSelected = currentOccs.includes(occId);
            const newOccs = isSelected
                ? currentOccs.filter(id => id !== occId)
                : [...currentOccs, occId];

            const res = await axios.patch(`${API_PRODUCTS}/${selectedProduct._id}/occasions`,
                { occasions: newOccs },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                setSelectedProduct(prev => ({ ...prev, occasions: newOccs }));
                setProducts(prev => prev.map(p => p._id === selectedProduct._id ? { ...p, occasions: newOccs } : p));
                toast.success(isSelected ? "Removed from occasion" : "Added to occasion");
            }
        } catch (err) {
            toast.error("Update failed");
        } finally {
            setUpdating(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.productNo?.toLowerCase().includes(search.toLowerCase())
    );

    const filteredOccasions = occasions.filter(o =>
        o.name.toLowerCase().includes(occSearch.toLowerCase())
    );

    if (loading) return <div className="admin-loading">Curating Occasions...</div>;

    return (
        <div className="manage-occasions-page">
            <div className="admin-header compact-h">
                <div className="header-lhs">
                    <h1>Occasions Manager</h1>
                    <p>Assign products to events.</p>
                </div>
                <button className="btn-vibe-primary sm" onClick={() => setShowCreateModal(true)}>
                    <FaPlus /> New Occasion
                </button>
            </div>

            <div className="occ-sections-compact">
                {/* PRODS */}
                <div className="prods-side-vibe">
                    <div className="compact-search">
                        <FaSearch />
                        <input
                            type="text"
                            placeholder="Search product..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="prods-grid-compact">
                        {filteredProducts.map(p => (
                            <div key={p._id} className="p-mini-card" onClick={() => setSelectedProduct(p)}>
                                <img src={p.thumbnail || p.colors?.[0]?.images?.[0] || modelFallback} alt="" />
                                <div className="p-mini-info">
                                    <h4>{p.title}</h4>
                                    <span className="p-no">{p.productNo}</span>
                                    <div className="mini-occ-list">
                                        {(p.occasions || []).slice(0, 3).map(oid => {
                                            const o = occasions.find(occ => occ._id === oid);
                                            return o ? <span key={oid} className="m-occ-tag">{o.name}</span> : null;
                                        })}
                                        {p.occasions?.length > 3 && <span>+{p.occasions.length - 3}</span>}
                                        <div className="m-plus"><FaPlus /></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* OCC LIST */}
                <div className="occ-list-side">
                    <h3><FaCalendarCheck /> Collections</h3>
                    <div className="occ-compact-list">
                        {occasions.map(occ => (
                            <div key={occ._id} className="occ-mini-item">
                                <div className="oc-info">
                                    <strong>{occ.name}</strong>
                                </div>
                                <button className="oc-del" onClick={() => handleDeleteOccasion(occ._id)}>
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ASSIGN MODAL */}
            {selectedProduct && (
                <div className="admin-modal-overlay" onClick={() => setSelectedProduct(null)}>
                    <div className="admin-modal compact-m" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Assign To Occasions</h3>
                            <button className="close-btn" onClick={() => setSelectedProduct(null)}><FaTimes /></button>
                        </div>
                        <div className="modal-body">
                            <div className="prod-mini-header">
                                <img src={selectedProduct.thumbnail || modelFallback} alt="" />
                                <div>
                                    <h4>{selectedProduct.title}</h4>
                                    <p>{selectedProduct.productNo}</p>
                                </div>
                            </div>

                            <div className="modal-search-v2">
                                <FaSearch />
                                <input
                                    type="text"
                                    placeholder="Filter occasions..."
                                    value={occSearch}
                                    onChange={e => setOccSearch(e.target.value)}
                                />
                            </div>

                            <div className="occ-checkbox-grid">
                                {filteredOccasions.map(occ => (
                                    <div
                                        key={occ._id}
                                        className={`occ-check-item ${selectedProduct.occasions?.includes(occ._id) ? 'active' : ''}`}
                                        onClick={() => toggleOccasion(occ._id)}
                                    >
                                        <span>{occ.name}</span>
                                        <div className="check-vibe">
                                            {selectedProduct.occasions?.includes(occ._id) && <FaCheck />}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* CREATE MODAL */}
            {showCreateModal && (
                <div className="admin-modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="admin-modal compact-m" style={{ width: '380px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Create Occasion</h3>
                            <button className="close-btn" onClick={() => setShowCreateModal(false)}><FaTimes /></button>
                        </div>
                        <form onSubmit={handleCreateOccasion} className="modal-body">
                            <div className="compact-field">
                                <label>Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Wedding, Festive..."
                                    value={newOccasion.name}
                                    onChange={e => setNewOccasion({ ...newOccasion, name: e.target.value })}
                                />
                            </div>
                            <button type="submit" className="btn-vibe-primary w-100 mt-10" disabled={creating}>
                                {creating ? "Saving..." : "Create Now"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                .manage-occasions-page { padding: 0 40px 40px; }
                .admin-header.compact-h { margin-bottom: 20px; align-items: flex-end; }
                .occ-sections-compact { display: grid; grid-template-columns: 2.5fr 1fr; gap: 30px; }
                .prods-side-vibe { background: #fff; border-radius: 12px; border: 1px solid #eee; padding: 20px; }
                .compact-search { position: relative; margin-bottom: 20px; }
                .compact-search svg { position: absolute; left: 12px; top: 11px; color: #999; }
                .compact-search input { width: 100%; padding: 10px 10px 10px 35px; border: 1px solid #eee; border-radius: 8px; font-size: 14px; outline: none; }
                
                .prods-grid-compact { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 15px; }
                .p-mini-card { border: 1px solid #f5f5f5; border-radius: 10px; padding: 8px; display: flex; gap: 10px; cursor: pointer; transition: 0.2s; }
                .p-mini-card:hover { border-color: #b49349; background: #fafafa; }
                .p-mini-card img { width: 50px; height: 65px; object-fit: cover; border-radius: 5px; }
                .p-mini-info h4 { font-size: 13px; margin-bottom: 2px; color: #111; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px; }
                .p-mini-info .p-no { font-size: 10px; color: #999; display: block; margin-bottom: 5px; }
                .mini-occ-list { display: flex; flex-wrap: wrap; gap: 3px; align-items: center; }
                .m-occ-tag { font-size: 9px; background: #f0f0f0; padding: 1px 5px; border-radius: 3px; }
                .m-plus { width: 15px; height: 15px; background: #b49349; color: #fff; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 8px; }

                .occ-list-side { background: #fff; border-radius: 12px; border: 1px solid #eee; padding: 20px; }
                .occ-list-side h3 { font-size: 15px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px; }
                .occ-mini-item { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid #f9f9f9; }
                .oc-info strong { font-size: 13px; color: #222; }
                .oc-del { margin-left: auto; border: none; background: #fff1f0; color: #ff4d4f; width: 28px; height: 28px; border-radius: 6px; cursor: pointer; }

                .prod-mini-header { display: flex; gap: 15px; background: #f9f9f9; padding: 10px; border-radius: 8px; margin-bottom: 20px; }
                .prod-mini-header img { width: 40px; height: 55px; object-fit: cover; border-radius: 4px; }
                .occ-checkbox-grid { display: flex; flex-direction: column; gap: 8px; }
                .occ-check-item { display: flex; align-items: center; gap: 12px; padding: 8px; border-radius: 8px; cursor: pointer; border: 1px solid transparent; }
                .occ-check-item:hover { background: #f5f5f5; }
                .occ-check-item.active { background: #fff9eb; border-color: #ffe082; }
                .check-vibe { margin-left: auto; color: #b49349; }
                
                .compact-field { margin-bottom: 15px; }
                .compact-field label { font-size: 12px; font-weight: 600; display: block; margin-bottom: 5px; }
                .compact-field input { width: 100%; padding: 8px; border: 1px solid #eee; border-radius: 6px; }
                .mt-10 { margin-top: 10px; }
                .sm { padding: 8px 16px; font-size: 12px; }
            `}</style>
        </div>
    );
}
