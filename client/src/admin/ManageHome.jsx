import React, { useState, useEffect } from "react";
import axios from "axios";
import "./admin.css";
import { FaCloudUploadAlt, FaEdit, FaCheck, FaHome, FaShapes, FaTshirt } from "react-icons/fa";
import modelFallback from "../assets/silk saree.jpg";
import toast from "react-hot-toast";
import API_URL from "../config";

const API = `${API_URL}/home-settings`;

export default function ManageHome() {
  const [settings, setSettings] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    fetchSettings();
    fetchCategories();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await axios.get(API);
      if (res.data.success) setSettings(res.data.settings);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load home settings");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/meta/category`);
      const list = res.data.items || res.data.categories || res.data.data || [];
      setCategories(list);
    } catch (err) {
      console.error("Categories fetch error", err);
    }
  };

  const handleImageUpload = async (type, index = null) => {
    const uploadId = index !== null ? `${type}-${index}` : type;
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);
      if (index !== null) formData.append("index", index);

      setUploading(uploadId);
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.post(`${API}/update-image`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setSettings(res.data.settings);
          toast.success("Image updated successfully");
        }
      } catch (err) {
        toast.error("Upload failed");
      } finally {
        setUploading(null);
      }
    };
    fileInput.click();
  };

  const handleTitleUpdate = async (index, title) => {
    try {
      const token = localStorage.getItem("authToken");
      await axios.post(`${API}/update-title`, { index, title }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Title updated");
    } catch (err) {
      toast.error("Title update failed");
    }
  };

  if (loading) return <div className="admin-loading">Curating Visuals...</div>;

  return (
    <div className="manage-home-page">
      <div className="page-header-vibe compact">
        <div className="header-text">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <button onClick={() => window.history.back()} className="back-btn" aria-label="Go Back">
              ← Back
            </button>
            <h1 style={{ margin: 0 }}>Homepage Visuals</h1>
          </div>
          <p>Manage banners and collections.</p>
        </div>
        <div className="header-badge"><FaHome /> Master Admin</div>
      </div>

      <div className="settings-row-compact">
        {/* HERO */}
        <div className="compact-card">
          <div className="cc-head">
            <h3><FaShapes /> Hero Banner</h3>
            <button onClick={() => handleImageUpload("hero")} disabled={uploading}>
              {uploading === "hero" ? "Updating..." : "Change"}
            </button>
          </div>
          <div className="cc-preview hero">
            <img src={settings?.heroBanner?.url || modelFallback} alt="" />
          </div>
        </div>

        {/* ACCESSORIZE */}
        <div className="compact-card">
          <div className="cc-head">
            <h3><FaTshirt /> Accessorize Image</h3>
            <button onClick={() => handleImageUpload("accessorize")} disabled={uploading}>
              {uploading === "accessorize" ? "Updating..." : "Change"}
            </button>
          </div>
          <div className="cc-preview accessorize">
            <img src={settings?.accessorizeImage?.url || modelFallback} alt="" />
          </div>
        </div>
      </div>

      {/* COLLECTIONS */}
      <div className="compact-card full-w">
        <div className="cc-head">
          <h3><FaShapes /> Collection Slots (3)</h3>
        </div>
        <div className="slots-grid-compact">
          {[0, 1, 2].map(i => (
            <div key={i} className="slot-item">
              <div className="slot-img">
                <img src={settings?.categories?.[i]?.url || modelFallback} alt="" />
                <button className="slot-edit" onClick={() => handleImageUpload("category", i)}>
                  {uploading === `category-${i}` ? "..." : <FaEdit />}
                </button>
              </div>
              <select
                value={settings?.categories?.[i]?.title || ""}
                onChange={(e) => {
                  const ns = { ...settings };
                  ns.categories[i].title = e.target.value;
                  setSettings(ns);
                  handleTitleUpdate(i, e.target.value);
                }}
              >
                <option value="">Select Category</option>
                {categories.map((c, idx) => {
                  const name = c.name || c.label || c;
                  return <option key={c._id || idx} value={name}>{name}</option>;
                })}
              </select>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .manage-home-page { padding: 0 40px 40px; }
        .page-header-vibe.compact { margin-bottom: 25px; align-items: flex-end; }
        .settings-row-compact { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .compact-card { background: #fff; border-radius: 12px; border: 1px solid #eee; padding: 18px; }
        .cc-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .cc-head h3 { font-size: 15px; display: flex; align-items: center; gap: 8px; }
        .cc-head button { background: #000; color: #fff; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; cursor: pointer; }
        .cc-preview { height: 160px; border-radius: 8px; overflow: hidden; background: #f9f9f9; }
        .cc-preview img { width: 100%; height: 100%; object-fit: cover; }
        .slots-grid-compact { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
        .slot-img { position: relative; height: 120px; border-radius: 6px; overflow: hidden; margin-bottom: 10px; }
        .slot-img img { width: 100%; height: 100%; object-fit: cover; }
        .slot-edit { position: absolute; top: 6px; right: 6px; background: #fff; border: none; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.1); }
        .slot-item select { width: 100%; padding: 8px; border: 1px solid #eee; border-radius: 6px; font-size: 13px; outline: none; background: #fff; cursor: pointer; }
        .slot-item select:focus { border-color: #b49349; }
        @media (max-width: 900px) { .settings-row-compact { grid-template-columns: 1fr; } .slots-grid-compact { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </div>
  );
}
