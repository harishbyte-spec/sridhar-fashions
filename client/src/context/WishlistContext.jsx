import { createContext } from "react";
import useWishlist from "../hooks/useWishlist";

export const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const wishlist = useWishlist();
  return (
    <WishlistContext.Provider value={wishlist}>
      {children}
    </WishlistContext.Provider>
  );
}
