import { createContext, useEffect, useState, useContext } from "react";
import { useUser } from "./UserContext.jsx";
import * as cartApi from "../api/cart.js";

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
    const { user } = useUser();
    const [cart, setCart] = useState(getInitialCart);
    const [loading, setLoading] = useState(false);

    // On login: merge guest cart if needed, then fetch user cart
    useEffect(() => {
        const syncCartOnLogin = async () => {
            if (user) {
                // If guest cart exists, merge it
                const guestCart = getInitialCart();
                if (guestCart.items && guestCart.items.length > 0) {
                    try {
                        await cartApi.mergeCart(
                            guestCart.items.map((item) => ({
                                product: item.product._id,
                                quantity: item.quantity,
                            }))
                        );
                        localStorage.removeItem("cart");
                    } catch (e) {
                        // ignore merge error
                    }
                }
                // Fetch user cart from backend
                setLoading(true);
                try {
                    const dbCart = await cartApi.getCart();
                    setCart(dbCart);
                } catch {
                    setCart({ items: [] });
                } finally {
                    setLoading(false);
                }
            } else {
                // Not logged in: use guest cart
                setCart(getInitialCart());
            }
        };
        syncCartOnLogin();
        // eslint-disable-next-line
    }, [user]);

    // Keep guest cart in localStorage if not logged in
    useEffect(() => {
        if (!user) {
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }, [cart, user]);

    // Cart actions
    const addToCart = async (product, quantity = 1) => {
        if (user) {
            // Logged in: call backend
            await cartApi.addOrUpdateCartItem(product._id, quantity);
            const dbCart = await cartApi.getCart();
            setCart(dbCart);
        } else {
            // Guest: update local cart
            setCart((prev) => {
                const existing = prev.items.find(
                    (item) => item.product._id === product._id
                );
                if (existing) {
                    return {
                        ...prev,
                        items: prev.items.map((item) =>
                            item.product._id === product._id
                                ? {
                                      ...item,
                                      quantity: item.quantity + quantity,
                                  }
                                : item
                        ),
                    };
                }
                return {
                    ...prev,
                    items: [...prev.items, { product, quantity }],
                };
            });
        }
    };

    const updateCartItem = async (productId, quantity) => {
        if (user) {
            await cartApi.addOrUpdateCartItem(productId, quantity);
            const dbCart = await cartApi.getCart();
            setCart(dbCart);
        } else {
            setCart((prev) => ({
                ...prev,
                items: prev.items.map((item) =>
                    item.product._id === productId
                        ? { ...item, quantity }
                        : item
                ),
            }));
        }
    };

    const removeFromCart = async (productId) => {
        if (user) {
            // Find itemId in backend cart
            const item = cart.items.find((i) => i.product._id === productId);
            if (item && item._id) {
                await cartApi.removeCartItem(item._id);
                const dbCart = await cartApi.getCart();
                setCart(dbCart);
            }
        } else {
            setCart((prev) => ({
                ...prev,
                items: prev.items.filter(
                    (item) => item.product._id !== productId
                ),
            }));
        }
    };

    const clearCart = async () => {
        if (user) {
            await cartApi.clearCart();
            const dbCart = await cartApi.getCart();
            setCart(dbCart);
        } else {
            setCart({ items: [] });
        }
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                updateCartItem,
                removeFromCart,
                clearCart,
                loading,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
