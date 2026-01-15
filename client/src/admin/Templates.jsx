import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./admin.css";
import "./adminTemplates.css";
import API_URL from "../config";

const API = `${API_URL}/templates`;
const token = localStorage.getItem("authToken");

export default function Templates() {
  const [activeTab, setActiveTab] = useState("description");

  // Data state for each template type
  const [data, setData] = useState({
    description: [],
    measurement: [],
    washcare: [],
    notes: [],
    color: [],
  });

  // Search, sort, loading
  const [search, setSearch] = useState("");
  const [sortType, setSortType] = useState("newest");
  const [loading, setLoading] = useState(false);

  // New template form fields
  const [form, setForm] = useState({
    title: "",
    content: "",
    measurements: "",
    instructions: "",
    notes: "",
    colorName: "",
    colorHex: "#000000",
    partType: "generic",
    isLocked: false,
  });

  // Independent color forms for the 4 parts + Main + Generic
  const [colorForms, setColorForms] = useState({
    main: { colorName: "", colorHex: "#000000" },
    body: { colorName: "", colorHex: "#000000" },
    border: { colorName: "", colorHex: "#000000" },
    pallu: { colorName: "", colorHex: "#000000" },
    blouse: { colorName: "", colorHex: "#000000" },
    generic: { colorName: "", colorHex: "#000000" },
  });

  // ===== Fetch templates for selected tab =====
  const fetchTemplates = async (tabName) => {
    setLoading(true);

    try {
      const res = await fetch(`${API}/${tabName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (json.success) {
        let key = tabName;
        if (tabName === "washcare") key = "washcare";
        if (tabName === "color") key = "color";

        setData((prev) => ({
          ...prev,
          [key]: json.templates || json.colors || [],
        }));
      }
    } catch (err) {
      console.error("Template fetch failed", err);
    }

    setLoading(false);
  };

  // When switching tabs → load data
  useEffect(() => {
    fetchTemplates(activeTab);
  }, [activeTab]);

  // ===== Add new template =====
  const saveTemplate = async (colorPart = null) => {
    let body;
    if (colorPart) {
      body = {
        title: colorForms[colorPart].colorName,
        colorName: colorForms[colorPart].colorName,
        colorHex: colorForms[colorPart].colorHex,
        partType: colorPart,
        isLocked: false,
      };
    } else {
      body = {
        title: activeTab === "color" ? form.colorName : form.title,
        content: form.content,
        measurements: form.measurements,
        instructions: form.instructions,
        notes: form.notes,
        colorName: form.colorName,
        colorHex: form.colorHex,
        partType: form.partType,
        isLocked: form.isLocked,
      };
    }

    let endpoint = activeTab;

    try {
      const res = await fetch(`${API}/${endpoint}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const json = await res.json();
      if (json.success) {
        toast.success("Template added successfully!");
        if (colorPart) {
          setColorForms(prev => ({
            ...prev,
            [colorPart]: { colorName: "", colorHex: "#000000" }
          }));
        } else {
          setForm({
            title: "",
            content: "",
            measurements: "",
            instructions: "",
            notes: "",
            colorName: "",
            colorHex: "#000000",
            partType: "generic",
            isLocked: false,
          });
        }
        fetchTemplates(activeTab);
      } else {
        toast.error(json.message || "Failed to save template");
      }
    } catch (err) {
      console.error("Save failed", err);
      toast.error("Error saving template");
    }
  };

  // ===== Delete template =====
  const deleteTemplate = async (id) => {
    if (!window.confirm("Delete this template?")) return;

    try {
      const res = await fetch(`${API}/delete/${activeTab}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const json = await res.json();
      if (json.success) {
        // Update local state immediately for better UX
        setData(prev => ({
          ...prev,
          [activeTab]: prev[activeTab].filter(t => t._id !== id)
        }));
        toast.success("Template deleted successfully!");
      } else {
        toast.error(json.message || "Failed to delete template");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting template");
    }
  };

  // ===== Filtering and Sorting =====
  const applyFilters = (list) => {
    let filtered = list.filter((t) =>
      JSON.stringify(t).toLowerCase().includes(search.toLowerCase())
    );

    if (sortType === "newest")
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortType === "oldest")
      filtered = filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortType === "az")
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    if (sortType === "za")
      filtered = filtered.sort((a, b) => b.title.localeCompare(a.title));

    return filtered;
  };

  // ===== UI for each tab =====
  const renderInputSection = () => {
    return (
      <div className="template-input-box">
        <input
          type="text"
          placeholder="Template Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        {/* DESCRIPTION */}
        {activeTab === "description" && (
          <textarea
            placeholder="Description content..."
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          ></textarea>
        )}

        {/* MEASUREMENT */}
        {activeTab === "measurement" && (
          <textarea
            placeholder="Measurement details..."
            value={form.measurements}
            onChange={(e) => setForm({ ...form, measurements: e.target.value })}
          ></textarea>
        )}

        {/* WASHCARE */}
        {activeTab === "washcare" && (
          <textarea
            placeholder="Washcare Instructions..."
            value={form.instructions}
            onChange={(e) => setForm({ ...form, instructions: e.target.value })}
          ></textarea>
        )}

        {/* NOTES */}
        {activeTab === "notes" && (
          <textarea
            placeholder="Notes content..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          ></textarea>
        )}

        {/* COLOR TEMPLATE */}
        {activeTab === "color" && (
          <div className="color-input-container" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div className="form-group-custom">
              <label style={{ fontSize: '13px', color: '#6b7280', marginBottom: '5px', display: 'block' }}>Color Name</label>
              <input
                type="text"
                placeholder="e.g. Royal Blue"
                value={form.colorName}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                onChange={(e) => setForm({ ...form, colorName: e.target.value })}
              />
            </div>

            <div className="form-group-custom">
              <label style={{ fontSize: '13px', color: '#6b7280', marginBottom: '5px', display: 'block' }}>Pick Color or Enter HEX</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <input
                  type="color"
                  value={form.colorHex}
                  style={{ width: '45px', height: '45px', padding: '0', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
                  onChange={(e) => setForm({ ...form, colorHex: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="#000000"
                  value={form.colorHex}
                  style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', textTransform: 'uppercase' }}
                  onChange={(e) => setForm({ ...form, colorHex: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group-custom">
              <label style={{ fontSize: '13px', color: '#6b7280', marginBottom: '5px', display: 'block' }}>Saree Part</label>
              <select
                value={form.partType}
                style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}
                onChange={(e) => setForm({ ...form, partType: e.target.value })}
              >
                <option value="generic">Generic (All Parts)</option>
                <option value="body">Body</option>
                <option value="border">Border</option>
                <option value="pallu">Pallu</option>
                <option value="blouse">Blouse</option>
              </select>
            </div>

            <div style={{
              marginTop: '10px',
              padding: '15px',
              borderRadius: '8px',
              background: '#f9fafb',
              border: '1px solid #efeff1',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: form.colorHex,
                border: '4px solid white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}></div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Preview</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{form.colorName || "Unnamed"} ({form.colorHex.toUpperCase()})</div>
              </div>
            </div>
          </div>
        )}

        <label className="lock-check">
          <input
            type="checkbox"
            checked={form.isLocked}
            onChange={(e) => setForm({ ...form, isLocked: e.target.checked })}
          />
          Lock Template (cannot be edited during product creation)
        </label>

        <button className="btn btn-primary" onClick={saveTemplate}>
          Add Template
        </button>
      </div>
    );
  };

  // ===== List view for non-color templates =====
  const renderList = () => {
    const list = applyFilters(data[activeTab] || []);

    if (loading) return <p>Loading...</p>;
    if (!list.length) return <p>No templates found.</p>;

    return (
      <div className="template-list">
        {list.map((t) => (
          <div key={t._id} className="template-item">
            <div className="template-info">
              <div className="template-title">{t.title || "Untitled Template"}</div>
              <div className="template-preview">
                {t.content || t.measurements || t.instructions || t.notes || ""}
              </div>
            </div>

            <div className="template-actions">
              <button
                className="btn btn-sm btn-danger"
                onClick={() => deleteTemplate(t._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ===== Color Part Section Render =====
  const renderColorSection = (part) => {
    const partColors = (data.color || []).filter(c => c.partType === part);
    const partForm = colorForms[part];

    return (
      <div className="color-part-block" key={part}>
        <h3 className="section-title" style={{ textTransform: 'capitalize' }}>{part} Colors</h3>

        {/* Creator */}
        <div className="color-creator-box" style={{ background: '#f8fafc', padding: '15px', borderRadius: '10px', marginBottom: '15px', border: '1px solid #e2e8f0' }}>
          <div className="template-input-box" style={{ gap: '10px' }}>
            <input
              type="text"
              placeholder={`${part.charAt(0).toUpperCase() + part.slice(1)} Color Name`}
              value={partForm.colorName}
              onChange={(e) => setColorForms(prev => ({ ...prev, [part]: { ...prev[part], colorName: e.target.value } }))}
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="color"
                value={partForm.colorHex}
                style={{ width: '40px', height: '40px', padding: 0 }}
                onChange={(e) => setColorForms(prev => ({ ...prev, [part]: { ...prev[part], colorHex: e.target.value } }))}
              />
              <input
                type="text"
                placeholder="#000000"
                value={partForm.colorHex}
                style={{ flex: 1 }}
                onChange={(e) => setColorForms(prev => ({ ...prev, [part]: { ...prev[part], colorHex: e.target.value } }))}
              />
            </div>
            <button className="btn btn-primary" style={{ padding: '8px' }} onClick={() => saveTemplate(part)}>Add {part} Color</button>
          </div>
        </div>

        {/* Mini List */}
        <div className="part-color-list" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {partColors.map(c => (
            <div key={c._id} style={{ display: 'flex', alignItems: 'center', background: 'white', padding: '8px 12px', borderRadius: '8px', border: '1px solid #f1f5f9', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: c.colorHex, border: '1px solid #ddd' }}></div>
                <span style={{ fontSize: '13px', fontWeight: '500' }}>{c.colorName}</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>{c.colorHex}</span>
              </div>
              <button
                onClick={() => deleteTemplate(c._id)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px' }}
              >×</button>
            </div>
          ))}
          {partColors.length === 0 && <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic', textAlign: 'center' }}>No {part} colors yet</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="admin-page template-page-container">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#b49349',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <h1 className="admin-title">Template Manager</h1>

      {/* TABS */}
      <div className="template-tabs-container">
        {["description", "measurement", "washcare", "notes", "color"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {activeTab === "color" ? (
        <div className="color-complex-management" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
          {["main", "body", "border", "pallu", "blouse", "generic"].map(renderColorSection)}
        </div>
      ) : (
        <div className="template-wrapper">
          {/* LEFT/TOP PAN: INPUTS */}
          <div className="template-form-section">
            <h3 className="section-title">Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
            {renderInputSection()}
          </div>

          {/* RIGHT/BOTTOM PAN: LIST */}
          <div className="template-list-section">
            <div className="list-header">
              <h3 className="section-title">Existing Templates</h3>
              <div className="template-controls-mini">
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="az">A-Z</option>
                </select>
              </div>
            </div>
            {renderList()}
          </div>
        </div>
      )}
    </div>
  );
}
