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
        images: c.images || [],
        videos: c.videos || [],
        parts: {
          body: c.body || {},
          border: c.border || {},
          pallu: c.pallu || {},
          blouse: c.blouse || {},
        },
      }))
    );

    if (initialData.thumbnail) {
      setThumbnail({ file: null, preview: initialData.thumbnail });
    }
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
    <div className="tpl-block-compact" style={{ background: '#f8fafc', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
      <div className="source-toggle" style={{ display: 'flex', gap: '15px', marginBottom: '8px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
          <input
            type="radio"
            checked={state.type === "custom"}
            onChange={() => setState({ ...state, type: "custom", templateId: "" })}
            style={{ width: '16px', height: '16px' }}
          /> Custom
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
          <input
            type="radio"
            checked={state.type === "template"}
            onChange={() => setState({ ...state, type: "template" })}
            style={{ width: '16px', height: '16px' }}
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
          style={{ marginBottom: '8px', padding: '6px 10px', fontSize: '13px' }}
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
        style={{ minHeight: '80px', padding: '8px', fontSize: '13px' }}
      />
    </div>
  );

  /* ================= FORM VALIDATION ================= */
  const validateForm = (isDraft = false) => {
    if (!form.title.trim()) {
      toast.error("Product name is required");
      return false;
    }
    if (!form.productNo.trim()) {
      toast.error("Product number is required");
      return false;
    }

    if (isDraft) return true; // Draft only needs title and productNo

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
  const handleSubmit = async (status = "published") => {
    // Validate form
    const isDraft = status === "draft";
    if (!validateForm(isDraft)) return;

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading(
        isDraft ? "Saving draft..." : (mode === "edit" ? "Updating product..." : "Creating product...")
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

      formData.append("notesTemplateId", notes.templateId || "");
      formData.append("notesValue", notes.value);

      formData.append("status", status);

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

        // Helper to separate existing URLs from new Files
        const existingImages = c.images.filter(img => typeof img === 'string');
        const existingVideos = c.videos.filter(vid => typeof vid === 'string');

        return {
          name: c.name,
          hexCode: c.hexCode,
          existingImages, // Send existing URLs
          existingVideos, // Send existing URLs
          parts: {
            body: {
              colorHex: c.parts.body.colorHex,
              // Send existing image URL if it's a string (not a File/Blob) and wasn't replaced
              image: typeof c.parts.body.image === 'string' ? c.parts.body.image : undefined
            },
            border: {
              colorHex: c.parts.border.colorHex,
              image: typeof c.parts.border.image === 'string' ? c.parts.border.image : undefined
            },
            pallu: {
              colorHex: c.parts.pallu.colorHex,
              image: typeof c.parts.pallu.image === 'string' ? c.parts.pallu.image : undefined
            },
            blouse: {
              colorHex: c.parts.blouse.colorHex,
              image: typeof c.parts.blouse.image === 'string' ? c.parts.blouse.image : undefined
            },
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
        status === "draft"
          ? "Draft saved successfully!"
          : (mode === "edit" ? "Product updated successfully!" : "Product published successfully!"),
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
          <button onClick={() => window.history.back()} className="back-btn" aria-label="Go Back">
            ← Back
          </button>
          <span style={{ color: "#6b7280", fontWeight: "normal", marginLeft: "10px" }}>Products /</span> Add New Product
        </div>
        <div className="header-actions">
          <button
            className="btn-publish"
            onClick={() => handleSubmit("published")}
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

      <div className="ap-layout-new">
        <div className="ap-top-row">
          {/* 1. GENERAL INFORMATION CARD */}
          <div className="ap-card-new">
            <h3 className="ap-card-new-title">✨ General Information</h3>
            <div className="gen-info-grid">
              <div className="info-fields-stack">
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

                <div className="meta-fields-grid">
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" name="category" value={form.category} onChange={onForm}>
                      <option value="">Select Category</option>
                      {categories.map((i) => <option key={i._id}>{i.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Collection</label>
                    <select className="form-select" name="collection" value={form.collection} onChange={onForm}>
                      <option value="">Select Collection</option>
                      {collections.map((i) => <option key={i._id}>{i.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Fabric</label>
                    <select className="form-select" name="fabric" value={form.fabric} onChange={onForm}>
                      <option value="">Select Fabric</option>
                      {fabrics.map((i) => <option key={i._id}>{i.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Origin</label>
                    <select className="form-select" name="origin" value={form.origin} onChange={onForm}>
                      <option value="">Select Origin</option>
                      {origins.map((i) => <option key={i._id}>{i.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Jari Type</label>
                    <select className="form-select" name="jariType" value={form.jariType} onChange={onForm}>
                      <option value="">Select Jari</option>
                      {jariTypes.map((j) => <option key={j._id} value={j.name}>{j.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              <div className="featured-image-side">
                <label className="form-label">Home Page Thumbnail Image</label>
                <div className="featured-image-upload-box">
                  {thumbnail.preview ? (
                    <>
                      <img src={thumbnail.preview} alt="Thumbnail Preview" className="featured-preview-img" />
                      <button
                        className="featured-image-remove"
                        onClick={() => setThumbnail({ file: null, preview: null })}
                        aria-label="Remove Image"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <label style={{ cursor: "pointer", textAlign: 'center' }}>
                      <div style={{ fontSize: "48px", marginBottom: "8px" }}>🖼️</div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#64748b" }}>Add Saree Photo</div>
                      <div style={{ fontSize: "12px", color: "#94a3b8" }}>Click to browse</div>
                      <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleThumbnailChange} />
                    </label>
                  )}
                </div>
                <p style={{ fontSize: "11px", color: "#94a3b8", marginTop: "12px", fontStyle: "italic", textAlign: 'center' }}>
                  This image represents the product in the catalog.
                </p>
              </div>
            </div>
          </div>

          {/* 2. PRICING & LOGISTICS CARD (With integrated Occasions) */}
          <div className="ap-card-new">
            <h3 className="ap-card-new-title">💰 Price & Logistics</h3>
            <div className="pricing-logistics-grid">
              <div className="pricing-row-3">
                <div className="form-group">
                  <label className="form-label">Base Price (₹)</label>
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

                <div className="form-group">
                  <label className="form-label">Silk Mark</label>
                  <div className="silkmark" style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                      <input type="radio" checked={form.silkMark} onChange={() => setForm({ ...form, silkMark: true })} />
                      <span style={{ fontSize: '12px' }}>Yes</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "4px", cursor: "pointer" }}>
                      <input type="radio" checked={!form.silkMark} onChange={() => setForm({ ...form, silkMark: false })} />
                      <span style={{ fontSize: '12px' }}>No</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Integrated Occasions */}
              <div className="form-group" style={{ marginTop: '5px', borderTop: '2px solid #f8fafc', paddingTop: '15px' }}>
                <label className="form-label" style={{ marginBottom: '12px' }}>🎉 Select Occasions</label>
                <div className="occasions-select" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {occasionsList.map((occ) => (
                    <label key={occ._id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', background: '#f8fafc', padding: '6px 10px', borderRadius: '8px', border: '1px solid #e2e8f0', transition: 'all 0.2s' }}>
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
                      <span style={{ fontSize: '12px', fontWeight: '500' }}>{occ.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. DESCRIPTION & TEMPLATES SECTION */}
        <div className="ap-card-new">
          <h3 className="ap-card-new-title">📝 Product Story & Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Description</label>
              {tplBlock("Description", description, setDescription, descTpls)}
            </div>
            <div className="form-group">
              <label className="form-label">Measurements</label>
              {tplBlock("Measurements", measurement, setMeasurement, measTpls)}
            </div>
            <div className="form-group">
              <label className="form-label">Washcare</label>
              {tplBlock("Washcare", washcare, setWashcare, washTpls)}
            </div>
            <div className="form-group">
              <label className="form-label">Notes</label>
              {tplBlock("Notes", notes, setNotes, noteTpls)}
            </div>
          </div>
        </div>

        {/* 5. COLOR VARIANTS & SAREE PARTS SECTION */}
        <div className="ap-card-new shadow-none" style={{ background: 'transparent', padding: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <h3 className="ap-card-new-title" style={{ border: 0, padding: 0, margin: 0 }}>🎨 Color Variants & Saree Parts</h3>
            <button className="btn-publish" onClick={addColor} style={{ padding: "8px 20px", fontSize: "14px" }}>+ Add New Color Variant</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {colors.map((c) => (
              <div key={c.id} className="ap-card-new" style={{ borderLeft: '6px solid #b49349' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                  <div className="variant-item" style={{ border: 0, padding: 0, gap: '15px', flex: 1 }}>
                    <div className="form-group" style={{ flex: 1, maxWidth: '400px' }}>
                      <label className="form-label">Base Color Name</label>
                      <select
                        className="form-select"
                        value={c.colorId}
                        onChange={(e) => {
                          const col = colorTpls.find((x) => x._id === e.target.value);
                          updateColor(c.id, "colorId", col?._id || "");
                          updateColor(c.id, "name", col?.colorName || "");
                          updateColor(c.id, "hexCode", col?.colorHex || "#000000");
                        }}
                      >
                        <option value="">Choose Template...</option>
                        {colorTpls.filter(x => x.partType === "main").map((x) => (
                          <option key={x._id} value={x._id}>{x.colorName || "Unnamed"}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: '22px' }}>
                      <input
                        type="color"
                        className="variant-color-preview"
                        value={c.hexCode}
                        onChange={(e) => updateColor(c.id, "hexCode", e.target.value)}
                        style={{ border: '2px solid #fff', boxShadow: '0 0 0 1px #e2e8f0' }}
                      />
                      <input
                        type="text"
                        className="form-input"
                        style={{ width: "100px", textTransform: 'uppercase' }}
                        value={c.hexCode}
                        onChange={(e) => updateColor(c.id, "hexCode", e.target.value)}
                      />
                    </div>
                  </div>
                  {colors.length > 1 && (
                    <button
                      className="btn-delete"
                      style={{ padding: '8px 12px' }}
                      onClick={() => setColors(prev => prev.filter(x => x.id !== c.id))}
                    >
                      Delete Variant
                    </button>
                  )}
                </div>

                <div className="gen-info-grid" style={{ gap: '20px' }}>
                  {/* LEFT: MEDIA SECTION */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="part-card-new">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <h4 style={{ margin: 0, fontSize: '15px' }}>📸 Front Dual Image</h4>
                        <label className="btn-draft" style={{ padding: "4px 12px", fontSize: "12px", cursor: "pointer" }}>
                          Upload
                          <input type="file" multiple accept="image/*" style={{ display: "none" }} onChange={(e) => handleResourceChange(c.id, "images", e)} />
                        </label>
                      </div>
                      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        {c.images.map((img, idx) => (
                          <div key={idx} style={{ width: "70px", height: "70px", position: "relative", borderRadius: "10px", overflow: "hidden", border: "1px solid #f1f5f9" }}>
                            <img src={img.preview || img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button
                              onClick={() => removeResource(c.id, "images", idx)}
                              style={{ position: "absolute", top: 0, right: 0, background: "rgba(225,29,72,0.8)", color: "white", border: "none", width: "22px", height: "22px", fontSize: "14px", cursor: "pointer" }}>×</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="part-card-new">
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                        <h4 style={{ margin: 0, fontSize: '15px' }}>🎥 Product Videos</h4>
                        <label className="btn-draft" style={{ padding: "4px 12px", fontSize: "12px", cursor: "pointer" }}>
                          Upload
                          <input type="file" multiple accept="video/*" style={{ display: "none" }} onChange={(e) => handleResourceChange(c.id, "videos", e)} />
                        </label>
                      </div>
                      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                        {c.videos.map((vid, idx) => (
                          <div key={idx} style={{ width: "70px", height: "70px", position: "relative", borderRadius: "10px", overflow: "hidden", background: "#000" }}>
                            <video src={vid.preview || vid} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <button
                              onClick={() => removeResource(c.id, "videos", idx)}
                              style={{ position: "absolute", top: 0, right: 0, background: "rgba(225,29,72,0.8)", color: "white", border: "none", width: "22px", height: "22px", fontSize: "14px", cursor: "pointer" }}>×</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: SAREE PARTS COMPACT */}
                  <div className="part-card-new" style={{ border: 0, background: '#f8fafc' }}>
                    <h4 style={{ marginTop: 0, marginBottom: '20px', fontSize: '15px' }}>🧱 Saree Anatomy (Parts)</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      {["body", "border", "pallu", "blouse"].map((part) => (
                        <div key={part} style={{ background: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: '#64748b' }}>{part}</span>
                            <label htmlFor={`file-${c.id}-${part}`} style={{ fontSize: '11px', color: '#b49349', fontWeight: '700', cursor: 'pointer' }}>
                              {c.parts[part].preview || c.parts[part].image ? "CHANGE" : "ADD"}
                            </label>
                          </div>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <div style={{ width: '45px', height: '45px', borderRadius: '8px', background: '#f1f5f9', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {c.parts[part].preview || c.parts[part].image ? (
                                <img src={c.parts[part].preview || c.parts[part].image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={part} />
                              ) : <span style={{ fontSize: '18px' }}>📸</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                              <select
                                className="form-select"
                                style={{ fontSize: '10px', height: '24px', padding: '2px 4px' }}
                                onChange={(e) => {
                                  const t = colorTpls.find(x => x._id === e.target.value);
                                  if (t) updatePart(c.id, part, { colorHex: t.colorHex });
                                }}
                              >
                                <option value="">Color...</option>
                                {colorTpls.filter(t => t.partType === part).map(t => (
                                  <option key={t._id} value={t._id}>{t.colorName}</option>
                                ))}
                              </select>
                              <input
                                type="color"
                                value={c.parts[part].colorHex}
                                style={{ width: '100%', height: '10px', marginTop: '4px', padding: 0, border: 'none', borderRadius: '2px' }}
                                onChange={(e) => updatePart(c.id, part, { colorHex: e.target.value })}
                              />
                            </div>
                          </div>
                          <input type="file" id={`file-${c.id}-${part}`} accept="image/*" style={{ display: "none" }} onChange={(e) => handlePartImageChange(c.id, part, e)} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
