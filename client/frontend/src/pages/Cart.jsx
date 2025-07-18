import React from "react";
import { useCart } from "../context/CartContext.jsx";

const Cart = () => {
    const { cart, updateCartItem, removeFromCart, clearCart } = useCart();
    const items = cart?.items || [];

    if (!items.length)
        return <div className="p-6 text-center">Your cart is empty.</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Your Cart</h2>
            <ul className="divide-y">
                {items.map(({ product, quantity }) => (
                    <li
                        key={product._id}
                        className="flex items-center justify-between py-3"
                    >
                        <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-500">
                                ₹{product.price}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="number"
                                min={1}
                                value={quantity}
                                onChange={(e) =>
                                    updateCartItem(
                                        product._id,
                                        Number(e.target.value)
                                    )
                                }
                                className="w-16 border rounded px-2 py-1"
                            />
                            <button
                                onClick={() => removeFromCart(product._id)}
                                className="text-red-500 hover:underline ml-2"
                            >
                                Remove
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
            <button
                onClick={clearCart}
                className="mt-6 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
                Clear Cart
            </button>
        </div>
    );
};

export default Cart;
