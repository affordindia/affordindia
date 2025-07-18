import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

const getInitialCart = () => {
    try {
        const stored = localStorage.getItem("cart");
        return stored ? JSON.parse(stored) : { items: [] };
    } catch {
        return { items: [] };
    }
};

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(getInitialCart);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity = 1) => {
        setCart((prev) => {
            const existing = prev.items.find(
                (item) => item.product._id === product._id
            );
            if (existing) {
                return {
                    ...prev,
                    items: prev.items.map((item) =>
                        item.product._id === product._id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    ),
                };
            }
            return { ...prev, items: [...prev.items, { product, quantity }] };
        });
    };

    const updateCartItem = (productId, quantity) => {
        setCart((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.product._id === productId ? { ...item, quantity } : item
            ),
        }));
    };

    const removeFromCart = (productId) => {
        setCart((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.product._id !== productId),
        }));
    };

    const clearCart = () => setCart({ items: [] });

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateCartItem,
                removeFromCart,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
