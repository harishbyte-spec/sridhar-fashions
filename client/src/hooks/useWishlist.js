import { useState, useEffect } from "react";
import API_URL from "../config";

export default function useWishlist() {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage on every change
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((prev) => {
      const exists = prev.find((p) => (p.id || p._id) === (product.id || product._id));
      let updated;
      if (exists) {
        updated = prev.filter((p) => (p.id || p._id) !== (product.id || product._id));
      } else {
        updated = [...prev, product];
      }
      
      // Sync to backend if logged in
      const token = localStorage.getItem("authToken");
      if (token) {
        fetch(`${API_URL}/auth/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ wishlist: updated.map(p => p._id || p.id) })
        }).catch(err => console.error("Wishlist sync error:", err));
      }

      return updated;
    });
  };

  const isWishlisted = (id) => {
    return wishlist.some((p) => (p.id || p._id) === id);
  };

  return { wishlist, toggleWishlist, isWishlisted };
}
