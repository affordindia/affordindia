import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";
import * as wishlistApi from "../api/wishlist.js";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const { user } = useAuth();
    const [wishlist, setWishlist] = useState(null);
    const [loading, setLoading] = useState(false);
    // Auto-load wishlist on login/logout
    useEffect(() => {
        if (user) {
            fetchWishlist();
        } else {
            setWishlist(null);
        }
        // eslint-disable-next-line
    }, [user]);

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

    const addToWishlist = async (productId) => {
        setLoading(true);
        try {
            await wishlistApi.addToWishlist(productId);
            await fetchWishlist();
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        setLoading(true);
        try {
            await wishlistApi.removeFromWishlist(productId);
            await fetchWishlist();
        } finally {
            setLoading(false);
        }
    };

    const moveToCartFromWishlist = async (productId) => {
        setLoading(true);
        try {
            await wishlistApi.moveToCartFromWishlist(productId);
            await fetchWishlist();
        } finally {
            setLoading(false);
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                fetchWishlist,
                addToWishlist,
                removeFromWishlist,
                moveToCartFromWishlist,
                loading,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
