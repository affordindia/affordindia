import React, { useEffect, useState } from "react";
import Loader from "../components/common/Loader.jsx";
import ScrollToTop from "../components/common/ScrollToTop.jsx";
import CouponSection from "../components/cart/CouponSection.jsx";
import { useCart } from "../context/CartContext.jsx";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { calculateShipping } from "../api/shipping.js";

const Cart = () => {
    const { cart, updateCartItem, removeFromCart, loading, refreshCart } =
        useCart();
    const items = cart?.items || [];

    // Shipping state
    const [shippingInfo, setShippingInfo] = useState({
        shippingFee: 50,
        isFreeShipping: false,
        minOrderForFree: 1000,
        remainingForFreeShipping: 1000,
    });

    // Discounts calculation
    const { totalProductDiscount, originalSubtotal, discountedSubtotal } =
        items.reduce(
            (acc, { product, quantity }) => {
                const hasDiscount = product.discount && product.discount > 0;
                const discountedPrice = hasDiscount
                    ? Math.round(product.price * (1 - product.discount / 100))
                    : product.price;

                acc.originalSubtotal += product.price * quantity;
                acc.discountedSubtotal += discountedPrice * quantity;
                acc.totalProductDiscount +=
                    (product.price - discountedPrice) * quantity;
                return acc;
            },
            {
                totalProductDiscount: 0,
                originalSubtotal: 0,
                discountedSubtotal: 0,
            }
        );

    const couponDiscount = cart?.couponDiscount || 0;

    // Fetch shipping
    useEffect(() => {
        const fetchShipping = async () => {
            if (discountedSubtotal > 0) {
                try {
                    const orderAmountAfterCoupon = Math.max(
                        0,
                        discountedSubtotal - couponDiscount
                    );
                    const shipping = await calculateShipping(
                        orderAmountAfterCoupon
                    );
                    setShippingInfo(shipping);
                } catch (error) {
                    console.error("Error calculating shipping:", error);
                }
            }
        };
        fetchShipping();
    }, [discountedSubtotal, couponDiscount]);

    const total =
        discountedSubtotal - couponDiscount + shippingInfo.shippingFee;

    const handleCartUpdate = async () => {
        await refreshCart();
        window.dispatchEvent(new CustomEvent("cartUpdated"));
    };

    if (loading) {
        return (
            <>
                <ScrollToTop />
                <Loader fullScreen={true} />;
            </>
        );
    }

    if (!items.length) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16">
                <ScrollToTop />
                <div className="text-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M7 13h10m0 0v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Your Cart is Empty
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Looks like you haven't added any items to your cart yet.
                    </p>
                    <Link
                        to="/"
                        className="inline-block bg-[#B76E79] text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col gap-5">
            <ScrollToTop />
            <h2 className="text-2xl font-bold mb-2">Your Shopping Cart</h2>

            {/* Header Row (Desktop Only) */}
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
                        className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-[#F7F4EF] text-[#404040] rounded-md w-full shadow-md"
                    >
                        {/* Product Info */}
                        <div className="flex items-start gap-4 flex-[2]">
                            <Link to={`/products/id/${product._id}`}>
                                <img
                                    src={
                                        product.images?.[0] ||
                                        "/placeholder.png"
                                    }
                                    alt={product.name}
                                    className="w-20 h-20 object-cover rounded-sm cursor-pointer hover:opacity-90 transition"
                                />
                            </Link>
                            <div className="flex flex-col flex-1">
                                <span className="text-sm font-medium">
                                    {product.name}
                                </span>

                                {/* Mobile Price & Subtotal */}
                                <div className="mt-2 md:hidden text-sm">
                                    {product.discount &&
                                    product.discount > 0 ? (
                                        <>
                                            <span className="line-through text-gray-400 mr-1 text-xs">
                                                ₹{product.price}
                                            </span>
                                            <span className="font-semibold">
                                                ₹
                                                {Math.round(
                                                    product.price *
                                                        (1 -
                                                            product.discount /
                                                                100)
                                                )}
                                            </span>
                                        </>
                                    ) : (
                                        <>₹{product.price}</>
                                    )}
                                    <div className="text-xs text-gray-500">
                                        Subtotal:{" "}
                                        {product.discount &&
                                        product.discount > 0
                                            ? `₹${
                                                  Math.round(
                                                      product.price *
                                                          (1 -
                                                              product.discount /
                                                                  100)
                                                  ) * quantity
                                              }`
                                            : `₹${product.price * quantity}`}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price (Desktop Only) */}
                        <div className="hidden md:flex flex-1 justify-center items-center">
                            <div className="bg-[#FAFAFA] border border-[#D0D0D0] rounded w-full max-w-[120px] mx-auto h-10 flex items-center justify-center text-sm">
                                {product.discount && product.discount > 0 ? (
                                    <>
                                        <span className="line-through text-gray-400 mr-1 text-xs">
                                            ₹{product.price}
                                        </span>
                                        <span>
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
                            <div className="flex items-center bg-[#FAFAFA] border border-[#D0D0D0] rounded w-full max-w-[120px] mx-auto h-10">
                                <button
                                    className="w-8 h-full text-xl font-medium flex items-center justify-center"
                                    onClick={async () => {
                                        await updateCartItem(
                                            product._id,
                                            quantity - 1
                                        );
                                        await handleCartUpdate();
                                    }}
                                >
                                    –
                                </button>
                                <div className="flex-1 text-center text-sm select-none">
                                    {quantity}
                                </div>
                                <button
                                    className="w-8 h-full text-xl font-medium flex items-center justify-center"
                                    onClick={async () => {
                                        await updateCartItem(
                                            product._id,
                                            quantity + 1
                                        );
                                        await handleCartUpdate();
                                    }}
                                >
                                    +
                                </button>
                            </div>

                            {/* Delete (Mobile) */}
                            <button
                                onClick={async () => {
                                    await removeFromCart(product._id);
                                    await handleCartUpdate();
                                }}
                                className="md:hidden ml-3 text-[#404040] hover:text-black text-lg"
                            >
                                <FaTrash />
                            </button>
                        </div>

                        {/* Subtotal (Desktop Only) */}
                        <div className="hidden md:flex flex-1 justify-center items-center">
                            <div className="bg-[#FAFAFA] border border-[#D0D0D0] rounded w-full max-w-[120px] mx-auto h-10 flex items-center justify-center text-sm">
                                {product.discount && product.discount > 0 ? (
                                    <>
                                        ₹
                                        {Math.round(
                                            product.price *
                                                (1 - product.discount / 100)
                                        ) * quantity}
                                    </>
                                ) : (
                                    <>₹{product.price * quantity}</>
                                )}
                            </div>
                        </div>

                        {/* Delete (Desktop Only) */}
                        <div className="hidden md:flex flex-1 justify-center items-center">
                            <button
                                onClick={async () => {
                                    await removeFromCart(product._id);
                                    await handleCartUpdate();
                                }}
                                className="text-[#404040] hover:text-black text-lg"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions & Summary */}
            <div className="flex flex-col md:flex-row md:items-start gap-8 mt-6">
                {/* Actions */}
                <div className="w-full md:max-w-xs">
                    <div className="flex flex-row md:flex-col gap-4">
                        <Link
                            to="/wishlist"
                            className="bg-[#B76E79] text-white px-4 py-2 rounded text-sm text-center hover:opacity-90 transition-colors w-full"
                        >
                            Add More from Wishlist
                        </Link>
                    </div>
                </div>

                {/* Summary */}
                <div className="w-full md:max-w-md md:ml-auto">
                    <CouponSection
                        cart={cart}
                        onCartUpdate={handleCartUpdate}
                    />

                    <div className="p-6 border border-gray-300 rounded-md bg-[#f7f2e9] text-sm">
                        <div className="flex justify-between mb-2">
                            <span>Total MRP</span>
                            <span>₹{originalSubtotal}</span>
                        </div>

                        {totalProductDiscount > 0 && (
                            <div className="flex justify-between mb-2">
                                <span>Product Discount</span>
                                <span className="text-green-600">
                                    -₹{totalProductDiscount}
                                </span>
                            </div>
                        )}

                        {couponDiscount > 0 && (
                            <div className="flex justify-between mb-2">
                                <span>Coupon Discount</span>
                                <span className="text-green-600">
                                    -₹{couponDiscount}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between mb-2">
                            <span>Delivery Charge</span>
                            <span>
                                {shippingInfo.isFreeShipping
                                    ? "FREE"
                                    : `₹${shippingInfo.shippingFee}`}
                            </span>
                        </div>
                        {!shippingInfo.isFreeShipping &&
                            shippingInfo.remainingForFreeShipping > 0 && (
                                <div className="text-xs text-gray-600 mb-2">
                                    Add ₹{shippingInfo.remainingForFreeShipping}{" "}
                                    more for free shipping
                                </div>
                            )}
                        <div className="flex justify-between font-bold text-base mt-4">
                            <span>Total Amount</span>
                            <span>₹{total}</span>
                        </div>
                        <Link
                            to="/checkout"
                            className="mt-6 w-full bg-[#B76E79] text-white py-2 rounded hover:opacity-90 transition block text-center"
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
