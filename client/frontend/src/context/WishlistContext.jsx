import React, { createContext, useState, useContext } from "react";
import * as wishlistApi from "../api/wishlist.js";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const data = await wishlistApi.getWishlist();
            setWishlist(data);
        } catch (e) {
            setWishlist(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <WishlistContext.Provider value={{ wishlist, fetchWishlist, loading }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
