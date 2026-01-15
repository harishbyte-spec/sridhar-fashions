import React, { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import API_URL from "../config";
import "./addProduct.css";

const API = API_URL;

/* ================= AUTH FETCH ================= */
const authFetch = async (url) => {
  const token = localStorage.getItem("authToken");
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt);
  }
  return res.json();
};

export default function AddProduct(
  { mode = "create",
    productId = null,
    initialData = null,
  }) {
  /* ================= BASIC ================= */
  const [form, setForm] = useState({
    title: "",
    price: "",
    productNo: "",
    category: "",
    collection: "",
    fabric: "",
    shippingTime: "",
    origin: "",
    jariType: "",
    silkMark: false,
    occasions: [],
  });

  const [thumbnail, setThumbnail] = useState({ file: null, preview: null });
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ================= META ================= */
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [jariTypes, setJariTypes] = useState([]);
  const [occasionsList, setOccasionsList] = useState([]);

  /* ================= TEMPLATES ================= */
  const [descTpls, setDescTpls] = useState([]);
  const [measTpls, setMeasTpls] = useState([]);
  const [washTpls, setWashTpls] = useState([]);
  const [noteTpls, setNoteTpls] = useState([]);
  const [colorTpls, setColorTpls] = useState([]);

  // Saree Part Templates removed as per request

  /* ================= TEMPLATE STATE ================= */
  const tplState = { type: "custom", templateId: "", value: "" };
  const [description, setDescription] = useState(tplState);
  const [measurement, setMeasurement] = useState(tplState);
  const [washcare, setWashcare] = useState(tplState);
  const [notes, setNotes] = useState(tplState);

  /* ================= COLORS ================= */
  const emptyParts = {
    body: { colorHex: "#000000", image: null, preview: null, fileName: "" },
    border: { colorHex: "#000000", image: null, preview: null, fileName: "" },
    pallu: { colorHex: "#000000", image: null, preview: null, fileName: "" },
    blouse: { colorHex: "#000000", image: null, preview: null, fileName: "" },
  };

  const [colors, setColors] = useState([
    {
      id: Date.now(),
      colorId: "",
      name: "",
      hexCode: "#000000",
      images: [],
      videos: [],
      parts: JSON.parse(JSON.stringify(emptyParts)),
    },
  ]);

  useEffect(() => {
    if (!initialData) return;

    setForm({
      title: initialData.title || "",
      price: initialData.price || "",
      productNo: initialData.productNo || "",
      category: initialData.category || "",
      collection: initialData.collection || "",
      fabric: initialData.fabric || "",
      shippingTime: initialData.shippingTime || "",
      origin: initialData.origin || "",
      jariType: initialData.jariType || "",
      silkMark: initialData.silkMark || false,
      occasions: initialData.occasions || [],
    });

    setDescription({
      type: initialData.descriptionType,
      templateId: initialData.descriptionTemplateId || "",
      value: initialData.descriptionValue || "",
    });

    setMeasurement({
      type: initialData.measurementType,
      templateId: initialData.measurementTemplateId || "",
      value: initialData.measurementValue || "",
    });

    setWashcare({
      type: initialData.washcareType,
      templateId: initialData.washcareTemplateId || "",
      value: initialData.washcareValue || "",
    });

    setNotes({
      type: initialData.notesType,
      templateId: initialData.notesTemplateId || "",
      value: initialData.notesValue || "",
    });

    setColors(
      initialData.colors.map((c, i) => ({
        id: Date.now() + i,
        colorId: "",
        name: c.name,
        hexCode: c.hexCode,
        images: [],
        videos: [],
        parts: {
          body: initialData.body || {},
          border: initialData.border || {},
          pallu: initialData.pallu || {},
          blouse: initialData.blouse || {},
        },
      }))
    );
  }, [initialData]);


  /* ================= FETCH ALL ================= */
  useEffect(() => {
    (async () => {
      try {
        const [
          cat, col, fab, org, jari, occ,
          desc, meas, wash, note, color,
        ] = await Promise.all([
          authFetch(`${API}/meta/category`),
          authFetch(`${API}/meta/collection`),
          authFetch(`${API}/meta/fabric`),
          authFetch(`${API}/meta/origin`),
          authFetch(`${API}/meta/jari`),
          authFetch(`${API}/occasions`), // Fetch occasions from correct endpoint

          authFetch(`${API}/templates/description`),
          authFetch(`${API}/templates/measurement`),
          authFetch(`${API}/templates/washcare`),
          authFetch(`${API}/templates/notes`),
          authFetch(`${API}/templates/color`),
        ]);

        setCategories(cat.items || []);
        setCollections(col.items || []);
        setFabrics(fab.items || []);
        setOrigins(org.items || []);
        setJariTypes(jari.items || []);
        setOccasionsList(occ.occasions || []); // Fix: use .occasions instead of .items

        setDescTpls(desc.templates || []);
        setMeasTpls(meas.templates || []);
        setWashTpls(wash.templates || []);
        setNoteTpls(note.templates || []);
        setColorTpls(color.colors || []);


      } catch (e) {
        console.error(e.message);
        toast.error("Failed to load templates and metadata");
      }
    })();
  }, []);

  /* ================= HELPERS ================= */
  const onForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const updateColor = (id, key, val) =>
    setColors((cs) => cs.map((c) => (c.id === id ? { ...c, [key]: val } : c)));

  const updatePart = (cid, part, data) =>
    setColors((cs) =>
      cs.map((c) =>
        c.id === cid
          ? { ...c, parts: { ...c.parts, [part]: { ...c.parts[part], ...data } } }
          : c
      )
    );

  const handlePartImageChange = (cid, part, e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      updatePart(cid, part, {
        image: file,
        preview: previewUrl,
        fileName: file.name
      });
    }
  };

  /* ----- New: Main Media Handlers ----- */
  const handleResourceChange = (cid, type, e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setColors((prev) => prev.map(c => {
      if (c.id !== cid) return c;
      // Create previews
      const newResources = files.map(f => ({
        file: f,
        preview: URL.createObjectURL(f),
        name: f.name
      }));
      return { ...c, [type]: [...c[type], ...newResources] };
    }));
  };

  const removeResource = (cid, type, index) => {
    setColors((prev) => prev.map(c => {
      if (c.id !== cid) return c;
      const updated = [...c[type]];
      updated.splice(index, 1);
      return { ...c, [type]: updated };
    }));
  };

  /* ----- New: Thumbnail Handler ----- */
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const addColor = () =>
    setColors((c) => [
      ...c,
      {
        id: Date.now(),
        colorId: "",
        name: "",
        hexCode: "#000000",
        images: [],
        videos: [],
        parts: JSON.parse(JSON.stringify(emptyParts)),
      },
    ]);

  /* ================= TEMPLATE BLOCK ================= */
  const tplBlock = (title, state, setState, list) => (
    <div className="card">
      <h2 className="card-title">{title}</h2>

      <div className="source-toggle">
        <label>
          <input
            type="radio"
            checked={state.type === "custom"}
            onChange={() => setState({ ...state, type: "custom", templateId: "" })}
          /> Custom
        </label>
        <label>
          <input
            type="radio"
            checked={state.type === "template"}
            onChange={() => setState({ ...state, type: "template" })}
          /> Template
        </label>
      </div>

      {state.type === "template" && (
        <select
          value={state.templateId}
          onChange={(e) => {
            const t = list.find((x) => x._id === e.target.value);
            setState({
              type: "template",
              templateId: t?._id || "",
              value: t?.content || t?.instructions || t?.measurements || t?.notes || "",
            });
          }}
          className="form-select"
        >
          <option value="">Select Template</option>
          {list.map((t) => (
            <option key={t._id} value={t._id}>{t.title}</option>
          ))}
        </select>
      )}

      <textarea
        value={state.value}
        onChange={(e) => setState({ ...state, value: e.target.value })}
        readOnly={state.type === "template"}
        className="form-textarea"
      />
    </div>
  );

  /* ================= FORM VALIDATION ================= */
  const validateForm = () => {
    if (!form.title.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!form.price || form.price <= 0) {
      toast.error("Valid price is required");
      return false;
    }
    if (!form.productNo.trim()) {
      toast.error("Product number is required");
      return false;
    }
    if (!form.category) {
      toast.error("Please select a category");
      return false;
    }
    if (!form.collection) {
      toast.error("Please select a collection");
      return false;
    }
    if (!form.fabric) {
      toast.error("Please select a fabric");
      return false;
    }
    if (colors.length === 0 || !colors[0].name) {
      toast.error("At least one color variant is required");
      return false;
    }
    if (!thumbnail.file && mode !== "edit") {
      toast.error("Featured image is required");
      return false;
    }
    return true;
  };

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setForm({
      title: "",
      price: "",
      productNo: "",
      category: "",
      collection: "",
      fabric: "",
      shippingTime: "",
      origin: "",
      jariType: "",
      silkMark: false,
      occasions: [],
    });
    setThumbnail({ file: null, preview: null });
    setDescription({ type: "custom", templateId: "", value: "" });
    setMeasurement({ type: "custom", templateId: "", value: "" });
    setWashcare({ type: "custom", templateId: "", value: "" });
    setNotes({ type: "custom", templateId: "", value: "" });
    setColors([
      {
        id: Date.now(),
        colorId: "",
        name: "",
        hexCode: "#000000",
        images: [],
        videos: [],
        parts: JSON.parse(JSON.stringify(emptyParts)),
      },
    ]);
  };

  /* ================= SUBMIT (FormData) ================= */
  const handleSubmit = async () => {
    // Validate form
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading(
        mode === "edit" ? "Updating product..." : "Creating product..."
      );

      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.dismiss(loadingToast);
        toast.error("Please login again");
        return;
      }

      const formData = new FormData();

      // 1. Basic Fields
      formData.append("title", form.title);
      formData.append("price", form.price);
      formData.append("productNo", form.productNo);
      formData.append("category", form.category);
      formData.append("collection", form.collection);
      formData.append("fabric", form.fabric);
      formData.append("shippingTime", form.shippingTime);
      formData.append("origin", form.origin);
      formData.append("jariType", form.jariType);
      formData.append("silkMark", form.silkMark);
      formData.append("occasions", JSON.stringify(form.occasions || []));

      // 2. Templates
      formData.append("descriptionType", description.type);
      formData.append("descriptionTemplateId", description.templateId || "");
      formData.append("descriptionValue", description.value);

      formData.append("measurementType", measurement.type);
      formData.append("measurementTemplateId", measurement.templateId || "");
      formData.append("measurementValue", measurement.value);

      formData.append("washcareType", washcare.type);
      formData.append("washcareTemplateId", washcare.templateId || "");
      formData.append("washcareValue", washcare.value);

      formData.append("notesType", notes.type);
      formData.append("notesTemplateId", notes.templateId || "");
      formData.append("notesValue", notes.value);

      // 3. Colors Metadata & Files
      // Append Thumbnail
      if (thumbnail.file) {
        formData.append("thumbnail", thumbnail.file);
      }

      // and append files with specific keys that the backend loops through.
      const colorsMeta = colors.map((c, index) => {
        // Append Files

        // Main Images
        c.images.forEach((imgObj) => {
          if (imgObj.file) {
            formData.append(`color_${index}_images`, imgObj.file);
          }
        });

        // Main Videos
        c.videos.forEach((vidObj) => {
          if (vidObj.file) {
            formData.append(`color_${index}_videos`, vidObj.file);
          }
        });

        // Saree Parts
        ["body", "border", "pallu", "blouse"].forEach(part => {
          if (c.parts[part] && c.parts[part].image) {
            formData.append(`color_${index}_part_${part}`, c.parts[part].image);
          }
        });

        return {
          name: c.name,
          hexCode: c.hexCode,
          parts: {
            body: { colorHex: c.parts.body.colorHex },
            border: { colorHex: c.parts.border.colorHex },
            pallu: { colorHex: c.parts.pallu.colorHex },
            blouse: { colorHex: c.parts.blouse.colorHex },
          }
        };
      });

      formData.append("colors", JSON.stringify(colorsMeta));

      const url =
        mode === "edit"
          ? `${API}/products/${productId}`
          : `${API}/products`;

      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      toast.dismiss(loadingToast);

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      toast.success(
        mode === "edit"
          ? "Product updated successfully!"
          : "Product created successfully!",
        { duration: 4000 }
      );

      // Reset form only in create mode
      if (mode !== "edit") {
        setTimeout(() => {
          resetForm();
        }, 500);
      }

    } catch (err) {
      toast.error(err.message || "Failed to save product");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };


  /* ================= UI ================= */
  return (
    <div className="add-product-container">
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
      {/* HEADER */}
      <div className="add-product-header">
        <div className="page-title">
          <span style={{ color: "#6b7280", fontWeight: "normal" }}>Products /</span> Add New Product
        </div>
        <div className="header-actions">
          <button className="btn-draft" disabled={isSubmitting}>Save Draft</button>
          <button
            className="btn-publish"
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? 'not-allowed' : 'pointer' }}
          >
            {isSubmitting
              ? (mode === "edit" ? "Updating..." : "Creating...")
              : (mode === "edit" ? "Update Product" : "Publish Product")
            }
          </button>
        </div>
      </div>

      <div className="add-product-layout">

        {/* LEFT COLUMN (MAIN) */}
        <div className="ap-main-col">

          {/* 1. GENERAL INFORMATION */}
          <div className="ap-card">
            <h3 className="ap-card-title">General Information</h3>
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input
                className="form-input"
                name="title"
                value={form.title}
                onChange={onForm}
                placeholder="e.g. Kanjivaram Silk Saree"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Product Number</label>
              <input
                className="form-input"
                name="productNo"
                value={form.productNo}
                onChange={onForm}
                placeholder="e.g. KSS-001"
              />
            </div>
            {/* TEMPLATE BLOCKS - Description */}
            <div className="form-group">
              <label className="form-label">Description Product</label>
              {tplBlock("Description", description, setDescription, descTpls)}
            </div>
          </div>

          {/* 2. PRICING */}
          <div className="ap-card">
            <h3 className="ap-card-title">Pricing</h3>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Base Pricing (₹)</label>
                <input
                  className="form-input"
                  name="price"
                  type="number"
                  value={form.price}
                  onChange={onForm}
                  placeholder="0.00"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Shipping Time</label>
                <input
                  className="form-input"
                  name="shippingTime"
                  value={form.shippingTime}
                  onChange={onForm}
                  placeholder="e.g. 3-5 Days"
                />
              </div>
            </div>
          </div>

          {/* 3. ADDITIONAL DETAILS (Templates) */}
          <div className="ap-card">
            <h3 className="ap-card-title">Additional Details</h3>
            <div className="form-group">
              {tplBlock("Measurements", measurement, setMeasurement, measTpls)}
            </div>
            <div className="form-group">
              {tplBlock("Washcare", washcare, setWashcare, washTpls)}
            </div>
            <div className="form-group">
              {tplBlock("Notes", notes, setNotes, noteTpls)}
            </div>
          </div>

          {/* 4. COLOR VARIANTS & SAREE PARTS */}
          <div className="ap-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h3 className="ap-card-title" style={{ marginBottom: 0 }}>Color Variants</h3>
              <button className="btn-draft" onClick={addColor} style={{ padding: "6px 14px", fontSize: "13px" }}>+ Add Color</button>
            </div>

            {colors.map((c) => (
              <div key={c.id} className="variants-container">
                <div className="variant-item">
                  <div className="form-group full-width">
                    <label className="form-label">Select Color Template</label>
                    <select
                      className="form-select"
                      onChange={(e) => {
                        const col = colorTpls.find((x) => x._id === e.target.value);
                        updateColor(c.id, "colorId", col?._id || "");
                        updateColor(c.id, "name", col?.colorName || "");
                        updateColor(c.id, "hexCode", col?.colorHex || "#000000");
                      }}
                    >
                      <option value="">Choose a color...</option>
                      {colorTpls
                        .filter(x => x.partType === "main")
                        .map((x) => (
                          <option key={x._id} value={x._id}>{x.colorName || x.name || "Unnamed Color"}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <input
                      type="color"
                      className="variant-color-preview"
                      value={c.hexCode}
                      onChange={(e) => updateColor(c.id, "hexCode", e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      style={{ width: "100px" }}
                      value={c.hexCode}
                      onChange={(e) => updateColor(c.id, "hexCode", e.target.value)}
                    />
                  </div>
                </div>

                {/* --- MAIN IMAGES --- */}
                <div style={{ padding: "12px", background: "white", borderRadius: "8px", border: "1px solid #e5e7eb", marginBottom: "16px" }}>
                  <h4 className="form-label" style={{ marginBottom: "12px" }}>Main Product Images</h4>

                  {/* IMAGES */}
                  <div style={{ marginBottom: "0" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#6b7280" }}>Images</span>
                      <label className="btn-draft" style={{ padding: "4px 12px", fontSize: "12px", cursor: "pointer" }}>
                        + Add Images
                        <input type="file" multiple accept="image/*" style={{ display: "none" }} onChange={(e) => handleResourceChange(c.id, "images", e)} />
                      </label>
                    </div>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {c.images.map((img, idx) => (
                        <div key={idx} style={{ width: "60px", height: "60px", position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid #eee" }}>
                          <img src={img.preview || img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button
                            onClick={() => removeResource(c.id, "images", idx)}
                            style={{ position: "absolute", top: 0, right: 0, background: "rgba(0,0,0,0.5)", color: "white", border: "none", width: "20px", height: "20px", fontSize: "12px", cursor: "pointer" }}>×</button>
                        </div>
                      ))}
                      {c.images.length === 0 && <span style={{ fontSize: "12px", color: "#999", fontStyle: "italic" }}>No images selected</span>}
                    </div>
                  </div>
                </div>


                {/* SAREE PARTS GRID */}
                <h4 className="form-label" style={{ marginTop: "16px" }}>Upload Images (Saree Parts)</h4>
                <div className="saree-parts-grid">
                  {["body", "border", "pallu", "blouse"].map((part) => (
                    <div key={part} className="part-card">
                      <div className="part-title">{part}</div>
                      <div className="part-preview-box">
                        {c.parts[part].preview ? (
                          <img src={c.parts[part].preview} alt={part} className="part-preview-img" />
                        ) : (
                          <span style={{ fontSize: "24px", color: "#d1d5db" }}>📷</span>
                        )}
                      </div>
                      <div className="custom-upload-box">
                        <input
                          type="file"
                          id={`file-${c.id}-${part}`}
                          accept="image/*"
                          className="hidden-input"
                          onChange={(e) => handlePartImageChange(c.id, part, e)}
                        />
                        <label htmlFor={`file-${c.id}-${part}`} style={{ fontSize: "12px", color: "#10b981", cursor: "pointer", fontWeight: "600" }}>
                          {c.parts[part].preview ? "Change" : "Upload"}
                        </label>
                      </div>

                      <div style={{ marginTop: "8px" }}>
                        <select
                          className="form-select"
                          style={{ fontSize: '11px', padding: '4px', marginBottom: '8px' }}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (!val) return;
                            const tpl = colorTpls.find(t => t._id === val);
                            if (tpl) {
                              updatePart(c.id, part, { colorHex: tpl.colorHex });
                            }
                          }}
                        >
                          <option value="">Select Color...</option>
                          {colorTpls
                            .filter(t => t.partType === part)
                            .map(t => (
                              <option key={t._id} value={t._id}>{t.colorName || t.name}</option>
                            ))
                          }
                        </select>
                        <div style={{ display: "flex", gap: "4px" }}>
                          <input
                            type="color"
                            style={{ width: "100%", height: "24px", padding: 0, border: "none" }}
                            value={c.parts[part].colorHex}
                            onChange={(e) => updatePart(c.id, part, { colorHex: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* --- VIDEOS --- */}
                <div style={{ padding: "12px", background: "white", borderRadius: "8px", border: "1px solid #e5e7eb", marginTop: "16px", marginBottom: "16px" }}>
                  <h4 className="form-label" style={{ marginBottom: "12px" }}>Product Videos</h4>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#6b7280" }}>Videos</span>
                      <label className="btn-draft" style={{ padding: "4px 12px", fontSize: "12px", cursor: "pointer" }}>
                        + Add Video
                        <input type="file" multiple accept="video/*" style={{ display: "none" }} onChange={(e) => handleResourceChange(c.id, "videos", e)} />
                      </label>
                    </div>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {c.videos.map((vid, idx) => (
                        <div key={idx} style={{ width: "60px", height: "60px", position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid #eee", background: "#000" }}>
                          <video src={vid.preview || vid} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          <button
                            onClick={() => removeResource(c.id, "videos", idx)}
                            style={{ position: "absolute", top: 0, right: 0, background: "rgba(0,0,0,0.5)", color: "white", border: "none", width: "20px", height: "20px", fontSize: "12px", cursor: "pointer" }}>×</button>
                        </div>
                      ))}
                      {c.videos.length === 0 && <span style={{ fontSize: "12px", color: "#999", fontStyle: "italic" }}>No videos selected</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN (SIDEBAR) */}
        <div className="ap-sidebar">

          {/* THUMBNAIL / FEATURED IMAGE */}
          <div className="ap-card">
            <h3 className="ap-card-title">Featured Image</h3>
            <div className="thumbnail-upload-container" style={{ textAlign: "center", border: "2px dashed #e5e7eb", borderRadius: "12px", padding: "20px" }}>
              {thumbnail.preview ? (
                <div style={{ position: "relative" }}>
                  <img src={thumbnail.preview} alt="Thumbnail Preview" style={{ maxWidth: "100%", borderRadius: "8px", maxHeight: "200px" }} />
                  <button
                    onClick={() => setThumbnail({ file: null, preview: null })}
                    style={{ position: "absolute", top: "-10px", right: "-10px", background: "#ef4444", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer" }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label style={{ cursor: "pointer" }}>
                  <div style={{ fontSize: "36px", color: "#d1d5db", marginBottom: "8px" }}>🖼️</div>
                  <div style={{ fontSize: "14px", color: "#6b7280", fontWeight: "600" }}>Upload Saree Thumbnail</div>
                  <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "4px" }}>Click to browse</div>
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleThumbnailChange} />
                </label>
              )}
            </div>
            <p style={{ fontSize: "12px", color: "#9ca3af", marginTop: "12px", fontStyle: "italic" }}>
              This image will be used as the main display in the catalog.
            </p>
          </div>

          {/* CATEGORY */}
          <div className="ap-card">
            <h3 className="ap-card-title">Organization</h3>

            <div className="org-section">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category</label>
                <select className="form-select" name="category" value={form.category} onChange={onForm}>
                  <option value="">Select Category</option>
                  {categories.map((i) => <option key={i._id}>{i.name}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Collection</label>
                <select className="form-select" name="collection" value={form.collection} onChange={onForm}>
                  <option value="">Select Collection</option>
                  {collections.map((i) => <option key={i._id}>{i.name}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Fabric</label>
                <select className="form-select" name="fabric" value={form.fabric} onChange={onForm}>
                  <option value="">Select Fabric</option>
                  {fabrics.map((i) => <option key={i._id}>{i.name}</option>)}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Origin</label>
                <select className="form-select" name="origin" value={form.origin} onChange={onForm}>
                  <option value="">Select Origin</option>
                  {origins.map((i) => <option key={i._id}>{i.name}</option>)}
                </select>
              </div>

              {/* Jari Type */}
              <div className="form-group full-width">
                <label>Jari Type (Meta)</label>
                <select
                  name="jariType"
                  value={form.jariType} // Assuming form.jariType and onForm are still used, based on original context
                  onChange={onForm} // Assuming form.jariType and onForm are still used, based on original context
                >
                  <option value="">Select Jari</option>
                  {jariTypes.map((j) => (
                    <option key={j._id} value={j.name}>
                      {j.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* OCCASIONS (Multi-select / Checkboxes) */}
              <div className="form-group full-width">
                <label>Occasions (Select multiple)</label>
                <div className="occasions-select" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '10px' }}>
                  {occasionsList.map((occ) => (
                    <label key={occ._id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: '#f5f5f5', padding: '8px 12px', borderRadius: '6px' }}>
                      <input
                        type="checkbox"
                        checked={(form.occasions || []).includes(occ._id)}
                        onChange={(e) => {
                          const { checked } = e.target;
                          setForm(prev => {
                            const current = prev.occasions || [];
                            const newOccs = checked
                              ? [...current, occ._id]
                              : current.filter(id => id !== occ._id);
                            return { ...prev, occasions: newOccs };
                          });
                        }}
                      />
                      <span style={{ fontSize: '14px' }}>{occ.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SILK MARK */}
          <div className="ap-card">
            <h3 className="ap-card-title">Silk Mark</h3>
            <div className="silkmark" style={{ display: "flex", gap: "20px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="radio" checked={form.silkMark} onChange={() => setForm({ ...form, silkMark: true })} />
                <span>Yes</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input type="radio" checked={!form.silkMark} onChange={() => setForm({ ...form, silkMark: false })} />
                <span>No</span>
              </label>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
