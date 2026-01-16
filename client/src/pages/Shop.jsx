import React, { useState, useEffect } from "react";
import "../components/shop/shop.css";
import { Link, useSearchParams } from "react-router-dom";
import Price from "../components/Price";
import { addWatermark } from "../utils/urlHelper";
import API_URL from "../config";

const API_PRODUCTS = `${API_URL}/products`;
const API_META = `${API_URL}/meta`;
const PLACEHOLDER = "/images/placeholder-saree.jpg";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get("category");
  const urlCollection = searchParams.get("collection");

  const [filters, setFilters] = useState({
    color: "All",
    category: urlCategory || "All",
    collection: urlCollection || "All",
    fabric: "All",
    price: "All",
  });

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [colorsList, setColorsList] = useState(["All"]);

  const [loading, setLoading] = useState(true);
  const [metaLoading, setMetaLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // state
  const [tempFilters, setTempFilters] = useState({
    color: "All",
    category: urlCategory || "All",
    collection: urlCollection || "All",
    fabric: "All",
    price: "All",
  });

  // use selects to update tempFilters instead of filters when using drawer
  <select value={tempFilters.color} onChange={(e) => setTempFilters({ ...tempFilters, color: e.target.value })} />

  // Apply handler
  const onApplyFilters = () => {
    setFilters(tempFilters);
    setDrawerOpen(false); // optional: close drawer
  }

  // Clear handler should reset both
  const onClearFilters = () => {
    const cleared = { color: "All", category: "All", collection: "All", fabric: "All", price: "All" };
    setTempFilters(cleared);
    setFilters(cleared);
    setCurrentPage(1);
  }

  // Reset page when filters or sorting change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);


  const safeJson = async (res) => {
    try { return await res.json(); } catch { return null; }
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setMetaLoading(true);

        const responses = await Promise.all([
          fetch(API_PRODUCTS),
          fetch(`${API_META}/category`),
          fetch(`${API_META}/collection`),
          fetch(`${API_META}/fabric`),
          fetch(`${API_URL}/templates/color`),
        ]);

        const [pRaw, catRaw, colRaw, fabRaw, colorRaw] = await Promise.all(responses.map(safeJson));

        console.group("Shop load debug");
        console.log("Products raw:", pRaw);
        console.log("Categories raw:", catRaw);
        console.log("Collections raw:", colRaw);
        console.log("Fabrics raw:", fabRaw);
        console.log("Colors raw:", colorRaw);
        console.groupEnd();

        const extractItems = (obj) => {
          if (!obj) return [];
          if (Array.isArray(obj)) return obj;
          if (Array.isArray(obj.items)) return obj.items;
          if (Array.isArray(obj.data)) return obj.data;
          if (Array.isArray(obj.categories)) return obj.categories;
          if (Array.isArray(obj.result)) return obj.result;
          if (Array.isArray(obj.products)) return obj.products;
          const firstArray = Object.values(obj).find((v) => Array.isArray(v));
          if (firstArray) return firstArray;
          return [];
        };

        const productsList = (pRaw && (Array.isArray(pRaw.products) ? pRaw.products : extractItems(pRaw))) || [];
        const cats = extractItems(catRaw) || [];
        const cols = extractItems(colRaw) || [];
        const fabs = extractItems(fabRaw) || [];

        setProducts(productsList);
        setCategories(cats);
        setCollections(cols);
        setFabrics(fabs);

        // Fetch colors from Color Templates API - only main/generic colors
        const allColors = colorRaw?.colors || [];
        const mainColors = allColors.filter(c => c.partType === "main" || c.partType === "generic");
        const colorsFromTemplates = mainColors.map(c => c.colorName);
        setColorsList(["All", ...colorsFromTemplates]);
      } catch (err) {
        console.error("Shop load error:", err);
      } finally {
        setLoading(false);
        setMetaLoading(false);
      }
    };

    load();
  }, []);

  const [selectedColors, setSelectedColors] = useState({});
  const getActiveColor = (p) => selectedColors[p._id] || p.colors?.[0] || null;

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = PLACEHOLDER;
  };

  const filterDataUnsorted = products.filter((p) => {
    const colorNames = (p.colors || []).map((c) => c.name);
    const matchesColor = filters.color === "All" || colorNames.includes(filters.color);
    const matchesCategory = filters.category === "All" || p.category === filters.category;
    const matchesCollection = filters.collection === "All" || p.collection === filters.collection;
    const matchesFabric = filters.fabric === "All" || p.fabric === filters.fabric;
    const matchesPrice =
      filters.price === "All" ||
      (filters.price === "below5" && p.price < 5000) ||
      (filters.price === "5to10" && p.price >= 5000 && p.price <= 10000) ||
      (filters.price === "10to15" && p.price > 10000 && p.price <= 15000) ||
      (filters.price === "above15" && p.price > 15000);

    return matchesColor && matchesCategory && matchesCollection && matchesFabric && matchesPrice;
  });

  const filterData = (() => {
    const arr = [...filterDataUnsorted];
    if (sortBy === "price-asc") return arr.sort((a, b) => (a.price || 0) - (b.price || 0));
    if (sortBy === "price-desc") return arr.sort((a, b) => (b.price || 0) - (a.price || 0));
    if (sortBy === "newest") return arr.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return arr;
  })();

  // Pagination metrics
  const totalPages = Math.ceil(filterData.length / itemsPerPage);
  const currentItems = filterData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // const clearFilters = () => setFilters({ color: "All", category: "All", collection: "All", fabric: "All", price: "All" });
  const toggleDrawer = () => setDrawerOpen((s) => !s);

  if (loading) {
    return (
      <div className="shop-page">
        <div className="shop-container">
          <aside className="shop-sidebar skeleton-sidebar" />
          <main className="shop-content">
            <div className="shop-header-row">
              <h2 className="shop-title">Shop Sarees</h2>
            </div>
            <div className="shop-loading-container">
              <div className="shop-spinner-large"></div>
              <div className="shop-loading-text">Discovering Collection...</div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-page">
      <div className="shop-container">

        <aside className={`shop-sidebar ${drawerOpen ? "drawer-open" : ""}`} aria-label="Shop filters" role="complementary">
          <div className="sidebar-top">
            <h3 className="filter-head">Filters</h3>
            <button className="drawer-close-btn" onClick={() => setDrawerOpen(false)} aria-label="Close filters">✕</button>
            {metaLoading ? <div className="meta-spinner" aria-hidden="true" /> : null}
          </div>

          <label htmlFor="color-select">Color</label>
          <select id="color-select" value={filters.color} onChange={(e) => setFilters({ ...filters, color: e.target.value })}>
            {colorsList.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <label htmlFor="category-select">Category</label>
          <select id="category-select" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
            <option value="All">All</option>
            {categories.map((c) => <option key={c._id || c.id || c.name} value={c.name || c.label || c}>{c.name || c.label || c}</option>)}
          </select>

          <label htmlFor="collection-select">Collection</label>
          <select id="collection-select" value={filters.collection} onChange={(e) => setFilters({ ...filters, collection: e.target.value })}>
            <option value="All">All</option>
            {collections.map((c) => <option key={c._id || c.id || c.name} value={c.name || c.label || c}>{c.name || c.label || c}</option>)}
          </select>

          <label htmlFor="fabric-select">Fabric</label>
          <select id="fabric-select" value={filters.fabric} onChange={(e) => setFilters({ ...filters, fabric: e.target.value })}>
            <option value="All">All</option>
            {fabrics.map((f) => <option key={f._id || f.id || f.name} value={f.name || f.label || f}>{f.name || f.label || f}</option>)}
          </select>

          <label htmlFor="price-select">Price</label>
          <select id="price-select" value={filters.price} onChange={(e) => setFilters({ ...filters, price: e.target.value })}>
            <option value="All">All</option>
            <option value="below5">Below ₹5000</option>
            <option value="5to10">₹5000 – ₹10000</option>
            <option value="10to15">₹10000 – ₹15000</option>
            <option value="above15">Above ₹15000</option>
          </select>

          <div className="sidebar-actions">
            <button className="clear-btn" onClick={onClearFilters}>Clear Filters</button>
            <button className="apply-btn" onClick={onApplyFilters}>Apply</button>
          </div>
        </aside>

        <main className="shop-content">
          <div className="shop-header-row">
            <h2 className="shop-title">Shop Sarees</h2>
            <div className="header-controls">
              <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Sort</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
              <button className="filter-toggle-btn" onClick={toggleDrawer}>Filters</button>
            </div>
          </div>

          <div className="products-grid">
            {currentItems.map((item) => {
              const activeColor = getActiveColor(item);
              const mainImage = addWatermark(activeColor?.images?.[0] || item.thumbnail || PLACEHOLDER);
              const hoverImage = addWatermark(activeColor?.images?.[1] || activeColor?.images?.[0] || item.thumbnail || PLACEHOLDER);

              return (
                <Link
                  to={`/product/${item._id || item.id}`}
                  state={{ product: item, selectedColor: activeColor }}
                  className="product-card"
                  key={item._id || item.id}
                  aria-label={`View details of ${item.title}`}
                >
                  <div className="product-img-wrapper">
                    <img className="img-main" src={mainImage} alt={item.title} loading="lazy" width="300" height="400" onError={handleImgError} />
                    <img className="img-hover" src={hoverImage} alt="" loading="lazy" width="300" height="400" onError={handleImgError} />
                  </div>

                  <div className="product-info">
                    <h4>{item.title}</h4>
                    <p className="price"><Price amount={item.price} /></p>

                    <div className="swatches" onClick={(e) => e.preventDefault()}>
                      {(item.colors || []).slice(0, 6).map((c, idx) => (
                        <button
                          key={c._id || idx}
                          className={`swatch ${getActiveColor(item)?.name === c.name ? "active" : ""}`}
                          title={c.name}
                          onClick={(e) => {
                            e.preventDefault(); // Prevent navigation
                            e.stopPropagation();
                            setSelectedColors({ ...selectedColors, [item._id]: c });
                          }}
                          style={{ backgroundColor: c.hexCode || c.hex || "#ccc" }}
                        />
                      ))}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="shop-pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="pag-btn"
              >
                Previous
              </button>

              <div className="pag-numbers">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`pag-number ${currentPage === i + 1 ? "active" : ""}`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="pag-btn"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div >

      <div className={`drawer-backdrop ${drawerOpen ? "open" : ""}`} onClick={() => setDrawerOpen(false)} />
    </div >
  );
}
