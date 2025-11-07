import React, { useEffect, useState } from "react";
import Loader from "../components/common/Loader.jsx";
import ScrollToTop from "../components/common/ScrollToTop.jsx";
import CouponSection from "../components/cart/CouponSection.jsx";
import { useCart } from "../context/CartContext.jsx";
import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { calculateShipping } from "../api/shipping.js";
import "../index.css";

const Cart = () => {
    const { cart, updateCartItem, removeFromCart, loading, refreshCart } =
        useCart();
    const items = cart?.items || [];

    const [shippingInfo, setShippingInfo] = useState({
        shippingFee: 50,
        isFreeShipping: false,
        minOrderForFree: 1000,
        remainingForFreeShipping: 1000,
    });

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

            {/* Header Row (Desktop Only) */}
            <div className="hidden md:flex font-semibold text-gray-700 px-4 w-full mt-10">
                <span className="flex-[2] text-center">Products</span>
                <span className="flex-1 text-center pr-2">Price</span>
                <span className="flex-1 text-center pr-2">Quantity</span>
                <span className="flex-1 text-center pr-2">Subtotal</span>
                <span className="flex-1 text-center">Delete</span>
            </div>

            {/* Cart Items */}
            <div className="space-y-4">
                {items.map(({ product, quantity }) => (
                    <div
                        key={product._id}
                        className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-[#EFEEE5] text-[#404040] rounded-md w-full shadow-md"
                    >
                        {/* --- MOBILE DESIGN --- */}
                        <div className="flex flex-col md:hidden gap-3 p-3 ">
                            <div className="flex items-start gap-3">
                                {/* Product Image */}
                                <Link
                                    to={`/products/id/${product._id}`}
                                    className="flex-shrink-0"
                                >
                                    <img
                                        src={
                                            product.images?.[0] ||
                                            "/placeholder.png"
                                        }
                                        alt={product.name}
                                        className="w-20 h-20 object-cover rounded-md"
                                    />
                                </Link>

                                {/* Product Details */}
                                <div className="flex-1 flex flex-col">
                                    {/* Product Name & Delete Button */}
                                    <div className="flex justify-between items-start">
                                        <span className="font-normal text-sm text-[#404040] line-clamp-2">
                                            {product.name}
                                        </span>

                                        <button
                                            onClick={async () => {
                                                await removeFromCart(
                                                    product._id
                                                );
                                                await handleCartUpdate();
                                            }}
                                            className="text-[#404040] text-lg font-medium ml-2 flex-shrink-0"
                                        >
                                            <FaTrash className="text-sm m-1" />
                                        </button>
                                    </div>

                                    {/* Price */}
                                    <div className="text-sm mt-1">
                                        {product.discount &&
                                        product.discount > 0 ? (
                                            <>
                                                <span className="text-[#404040] mr-1">
                                                    MRP:{" "}
                                                </span>
                                                <span className="line-through  text-[#ACACAC] text-md  mr-1">
                                                    ₹{product.price}
                                                </span>
                                                <span className="text-[#404040] text-md ">
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
                                            <span>MRP: ₹{product.price}</span>
                                        )}
                                    </div>

                                    {/* Subtotal */}
                                    <div className="text-md font-semibold mt-1">
                                        Subtotal: ₹
                                        {product.discount &&
                                        product.discount > 0
                                            ? Math.round(
                                                  product.price *
                                                      (1 -
                                                          product.discount /
                                                              100)
                                              ) * quantity
                                            : product.price * quantity}
                                    </div>

                                    {/* Quantity Controls (Horizontally aligned, compact) */}
                                    <div className="flex items-center gap-2 mt-2 border border-gray-300 bg-[#ffffff] rounded-md w-max">
                                        <button
                                            className="w-6 h-6 flex items-center justify-center text-base"
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

                                        {/* Left vertical line */}
                                        <div className="h-4 border-l border-gray-300"></div>

                                        <span className="px-2 text-sm">
                                            {quantity}
                                        </span>

                                        {/* Right vertical line */}
                                        <div className="h-4 border-l border-gray-300"></div>

                                        <button
                                            className="w-6 h-6 flex items-center justify-center text-base"
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
                                </div>
                            </div>
                        </div>

                        {/* --- DESKTOP DESIGN  --- */}
                        <div className="hidden md:flex flex-col md:flex-row md:items-center justify-center gap-3 flex-[2] text-center md:text-center">
                            <Link to={`/products/id/${product._id}`}>
                                <img
                                    src={
                                        product.images?.[0] ||
                                        "/placeholder.png"
                                    }
                                    alt={product.name}
                                    className="w-24 h-24 object-cover rounded-sm cursor-pointer hover:opacity-90 transition mx-auto md:mx-0"
                                />
                            </Link>
                            <span
                                className="font-medium text-sm text-[#404040] product-name text-left line-clamp-1 max-w-48"
                                title={product.name}
                            >
                                {product.name}
                            </span>
                        </div>

                        <div className="hidden md:flex flex-1 justify-center items-center text-center">
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

                        <div className="hidden md:flex flex-1 justify-center items-center text-center">
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

                                <div className="h-5 border-l border-gray-300 mx-1"></div>
                                <div className="flex-1 text-center text-sm select-none">
                                    {quantity}
                                </div>
                                <div className="h-5 border-l border-gray-300 mx-1"></div>

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
                        </div>

                        <div className="hidden md:flex flex-1 justify-center items-center text-center">
                            <div className="bg-[#FAFAFA] border border-[#D0D0D0] rounded w-full max-w-[120px] mx-auto h-10 flex items-center justify-center text-sm">
                                ₹
                                {product.discount && product.discount > 0
                                    ? Math.round(
                                          product.price *
                                              (1 - product.discount / 100)
                                      ) * quantity
                                    : product.price * quantity}
                            </div>
                        </div>

                        <div className="hidden md:flex flex-1 justify-center items-center text-center">
                            <button
                                onClick={async () => {
                                    await removeFromCart(product._id);
                                    await handleCartUpdate();
                                }}
                                className="text-[#404040] hover:text-[#DC2626] text-lg"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Actions & Summary */}
            <div className="flex flex-col md:flex-row md:items-start gap-4 mt-6">
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

                {/* ✅ Smaller Summary Box */}
                <div className="w-full md:max-w-sm md:ml-auto">
                    <CouponSection
                        cart={cart}
                        onCartUpdate={handleCartUpdate}
                    />

                    <div className="p-4  rounded-md bg-[#EFEEE5] text-sm">
                        <div className="flex justify-between mb-1">
                            <span className="text-[#404040]">Total MRP</span>
                            <span>₹{originalSubtotal}</span>
                        </div>

                        {totalProductDiscount > 0 && (
                            <div className="flex justify-between mb-1">
                                <span className="text-[#404040]">
                                    Product Discount
                                </span>
                                <span className="text-[#2ECC71]">
                                    -₹{totalProductDiscount}
                                </span>
                            </div>
                        )}

                        {couponDiscount > 0 && (
                            <div className="flex justify-between mb-1">
                                <span className="text-[#404040]">
                                    Coupon Discount
                                </span>
                                <span className="text-[#2ECC71]">
                                    -₹{couponDiscount}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-between mb-1">
                            <span className="text-[#404040]">
                                Delivery Charge
                            </span>
                            <span>
                                {shippingInfo.isFreeShipping
                                    ? "FREE"
                                    : `₹${shippingInfo.shippingFee}`}
                            </span>
                        </div>

                        {!shippingInfo.isFreeShipping &&
                            shippingInfo.remainingForFreeShipping > 0 && (
                                <div className="text-[10px] text-gray-600 mb-1">
                                    Add ₹{shippingInfo.remainingForFreeShipping}{" "}
                                    more for free shipping
                                </div>
                            )}

                        <div className="flex justify-between font-bold text-md mt-3">
                            <span className="text-[#404040]">Total Amount</span>
                            <span className="text-[#404040]">₹{total}</span>
                        </div>

                        <Link
                            to="/checkout"
                            className="bg-[#B76E79] text-white px-4 py-2 rounded text-sm text-center hover:opacity-90 transition-colors mt-4 block"
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
