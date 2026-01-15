import { useContext } from "react";
import { WishlistContext } from "../context/WishlistContext";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import "../components/shop/favourites.css";

export default function Favourites() {
  const { wishlist, toggleWishlist } = useContext(WishlistContext);

  return (
    <div className="fav-page">
      <div className="fav-container">
        <h1 className="fav-title">Your Favourites</h1>

        {/* If empty */}
        {wishlist.length === 0 && (
          <>
            <p className="fav-empty-text">No favourites added yet.</p>
            <Link to="/shop" className="fav-back-link">
              ← Back to Shop
            </Link>
          </>
        )}

        {/* Grid */}
        <div className="fav-grid">
          {wishlist.map((item) => {
            // Robust Image Resolution
            const mainImage = item.thumbnail || 
                              (item.colors && item.colors[0]?.images?.[0]) || 
                              "/images/placeholder-saree.jpg";
            const itemId = item._id || item.id;

            return (
              <div className="fav-card" key={itemId}>
                <Link
                  to={`/product/${itemId}`}
                  state={{ product: item }}
                  className="fav-image-link"
                >
                  <img src={mainImage} alt={item.title} onError={(e) => e.target.src="/images/placeholder-saree.jpg"} />
                </Link>

                <div className="fav-info">
                  <h4>{item.title}</h4>
                  <p className="fav-price">₹{item.price}</p>

                  <div className="fav-actions">
                    <button
                      className="fav-remove-btn"
                      onClick={() => toggleWishlist(item)}
                    >
                      <FaTrash /> Remove
                    </button>

                    <Link
                      className="fav-view-btn"
                      to={`/product/${itemId}`}
                      state={{ product: item }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* <Link to="/shop" className="fav-back-link">
          ← Back to Shop
        </Link> */}
      </div>
    </div>
  );
}
