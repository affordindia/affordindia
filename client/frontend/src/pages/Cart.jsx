import React from "react";
import Loader from "../components/common/Loader.jsx";
import { useCart } from "../context/CartContext.jsx";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const Cart = () => {
    const { cart, updateCartItem, removeFromCart, loading } = useCart();
    const items = cart?.items || [];

    const deliveryFee = items.length ? 50 : 0;
    // Calculate discounted subtotal and total discount
    const { discountedSubtotal, totalDiscount, originalSubtotal } =
        items.reduce(
            (acc, { product, quantity }) => {
                const hasDiscount = product.discount && product.discount > 0;
                const discountedPrice = hasDiscount
                    ? Math.round(product.price * (1 - product.discount / 100))
                    : product.price;
                acc.originalSubtotal += product.price * quantity;
                acc.discountedSubtotal += discountedPrice * quantity;
                acc.totalDiscount +=
                    (product.price - discountedPrice) * quantity;
                return acc;
            },
            { discountedSubtotal: 0, totalDiscount: 0, originalSubtotal: 0 }
        );
    const total = discountedSubtotal + deliveryFee;

    if (loading) {
        return <Loader fullScreen={true} />;
    }
    if (!items.length) {
        return (
            <div className="p-6 text-center text-xl text-gray-600">
                Your cart is empty.
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-5">
            <h2 className="text-2xl font-bold mb-2">Your Shopping Cart</h2>

            {/* Header Row */}
            <div className="hidden md:flex font-semibold text-gray-700 px-4 w-full">
                <span className="flex-[2]">Products</span>
                <span className="flex-1 text-center">Price</span>
                <span className="flex-1 text-center">Quantity</span>
                <span className="flex-1 text-center">Subtotal</span>
                <span className="flex-1 text-center">Delete</span>
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
                {items.map(({ product, quantity }) => (
                    <div
                        key={product._id}
                        className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-[#F7F4EF] text-[#404040] rounded-md w-full border border-gray-300"
                    >
                        {/* Product Info */}
                        <div className="flex items-center gap-4 flex-[2]">
                            <img
                                src={product.images?.[0] || "/placeholder.png"}
                                alt={product.name}
                                className="w-20 h-20 object-cover rounded-sm border border-[#626262]"
                            />
                            <div className="text-sm">{product.name}</div>
                        </div>

                        {/* Price */}
                        <div className="flex-1 flex md:justify-center items-center">
                            <div className="bg-[#FAFAFA] border border-[#626262] rounded w-full max-w-[120px] mx-auto h-10 flex items-center justify-center text-sm">
                                {product.discount && product.discount > 0 ? (
                                    <>
                                        <span className="line-through text-gray-400 mr-1 text-xs">
                                            ₹{product.price}
                                        </span>
                                        <span className="">
                                            ₹
                                            {Math.round(
                                                product.price *
                                                    (1 - product.discount / 100)
                                            )}
                                        </span>
                                    </>
                                ) : (
                                    <>₹{product.price}</>
                                )}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="flex-1 flex md:justify-center items-center">
                            <div className="flex items-center bg-[#FAFAFA] border border-[#626262] rounded w-full max-w-[120px] mx-auto h-10">
                                <button
                                    className="w-8 h-full text-xl font-medium flex items-center justify-center cursor-pointer"
                                    onClick={() =>
                                        updateCartItem(
                                            product._id,
                                            Math.max(1, quantity - 1)
                                        )
                                    }
                                >
                                    –
                                </button>
                                <div className="flex-1 text-center text-sm select-none">
                                    {quantity}
                                </div>
                                <button
                                    className="w-8 h-full text-xl font-medium flex items-center justify-center cursor-pointer"
                                    onClick={() =>
                                        updateCartItem(
                                            product._id,
                                            quantity + 1
                                        )
                                    }
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Subtotal */}
                        <div className="flex-1 flex md:justify-center items-center">
                            <div className="bg-[#FAFAFA] border border-[#626262] rounded w-full max-w-[120px] mx-auto h-10 flex items-center justify-center text-sm">
                                {product.discount && product.discount > 0 ? (
                                    <>
                                        <span className="">
                                            ₹
                                            {Math.round(
                                                product.price *
                                                    (1 - product.discount / 100)
                                            ) * quantity}
                                        </span>
                                    </>
                                ) : (
                                    <>₹{product.price * quantity}</>
                                )}
                            </div>
                        </div>

                        {/* Delete */}
                        <div className="flex-1 flex md:justify-center items-center">
                            <button
                                onClick={() => removeFromCart(product._id)}
                                className="text-[#404040] hover:text-black text-lg"
                                aria-label="Remove item"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions & Order Summary (side by side on PC) */}
            <div className="flex flex-col md:flex-row md:items-start gap-8 mt-6">
                {/* Actions */}
                <div className="w-full md:max-w-xs">
                    <div className="flex flex-row md:flex-col gap-4">
                        <Link
                            to="/wishlist"
                            className="bg-[#f7f2e9] px-4 py-2 rounded border border-gray-300 text-sm hover:bg-[#f0ebe1] w-full text-center transition-colors"
                        >
                            Add More From Wishlist
                        </Link>
                    </div>
                </div>

                {/* Order Summary */}
                <div className="w-full md:max-w-md md:ml-auto">
                    <div className="p-6 border border-gray-300 rounded-md bg-[#f7f2e9] text-sm">
                        <div className="flex justify-between mb-2">
                            <span>Subtotal</span>
                            <span>₹{originalSubtotal}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Discount</span>
                            <span className="text-green-600">
                                -₹{totalDiscount}
                            </span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Delivery Charge</span>
                            <span>₹{deliveryFee}</span>
                        </div>
                        <div className="flex justify-between font-bold text-base mt-4">
                            <span>Grand Total</span>
                            <span>₹{total}</span>
                        </div>
                        <Link
                            to="/checkout"
                            className="mt-6 w-full bg-black text-white py-2 rounded hover:opacity-90 transition block text-center"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
