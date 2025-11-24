import React from "react";
import { FaShoppingBag } from "react-icons/fa";

const OrderSummary = ({
    items,
    originalSubtotal,
    totalProductDiscount,
    couponDiscount,
    shippingFee,
    shippingInfo,
    total,
    paymentMethod,
    onPlaceOrder,
    loading,
    disabled,
}) => {
    return (
        <div className="bg-[#efeee5] p-4 sm:p-6 rounded-lg border border-gray-300">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <FaShoppingBag className="text-[#404040]" />
                <h3 className="text-lg font-semibold text-[#404040]">
                    Order Summary
                </h3>
            </div>

            {/* Cart Items */}
            <div className="space-y-3 mb-4">
                {items.map(({ product, quantity }) => {
                    const hasDiscount =
                        product.discount && product.discount > 0;
                    const discountedPrice = hasDiscount
                        ? Math.round(
                              product.price * (1 - product.discount / 100)
                          )
                        : product.price;
                    return (
                        <div
                            key={product._id}
                            className="flex items-center gap-3 p-2 bg-white rounded"
                        >
                            <img
                                src={product.images?.[0] || "/placeholder.png"}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#404040] truncate">
                                    {product.name}
                                </p>
                                <p className="text-xs text-[#404040]">
                                    Qty: {quantity}
                                </p>
                            </div>
                            <span className="text-sm font-medium text-[#404040]">
                                {hasDiscount ? (
                                    <div className="flex flex-col items-center">
                                        <span className="line-through text-gray-400 text-xs">
                                            ₹{product.price * quantity}
                                        </span>
                                        <span className="font-bold">
                                            ₹{discountedPrice * quantity}
                                        </span>
                                    </div>
                                ) : (
                                    <>₹{product.price * quantity}</>
                                )}
                            </span>
                        </div>
                    );
                })}
            </div>

            {/* Price Breakdown */}
            <div className="border-t border-gray-300 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-[#404040]">
                    <span>Subtotal ({items.length} items)</span>
                    <span>₹{originalSubtotal.toLocaleString()}</span>
                </div>

                {totalProductDiscount > 0 && (
                    <div className="flex justify-between text-sm text-[#404040]">
                        <span>Product Discount</span>
                        <span className="text-green-600">
                            -₹{totalProductDiscount.toLocaleString()}
                        </span>
                    </div>
                )}

                {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-[#404040]">
                        <span>Coupon Discount</span>
                        <span className="text-green-600">
                            -₹{couponDiscount.toLocaleString()}
                        </span>
                    </div>
                )}

                <div className="flex justify-between text-sm text-[#404040]">
                    <span>Shipping Fee</span>
                    <span
                        className={
                            shippingFee === 0
                                ? "text-green-600 font-medium"
                                : ""
                        }
                    >
                        {shippingFee === 0 ? "Free" : `₹${shippingFee}`}
                    </span>
                </div>
                {shippingInfo &&
                    !shippingInfo.isFreeShipping &&
                    shippingInfo.remainingForFreeShipping > 0 && (
                        <div className="text-xs text-[#404040] italic">
                            Add ₹
                            {shippingInfo.remainingForFreeShipping.toLocaleString()}{" "}
                            more for free shipping
                        </div>
                    )}
                <div className="flex justify-between font-semibold text-lg text-[#404040] border-t border-gray-300 pt-2">
                    <span>Grand Total</span>
                    <span>₹{total.toLocaleString()}</span>
                </div>
            </div>

            {/* Place Order Button */}
            <button
                onClick={onPlaceOrder}
                disabled={loading || disabled}
                className="w-full mt-6 bg-[#B76E79] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#C68F98] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                {loading ? (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Placing Order...
                    </div>
                ) : paymentMethod === "COD" ? (
                    `Place Order - ₹${total.toLocaleString()}`
                ) : (
                    `Pay Online - ₹${total.toLocaleString()}`
                )}
            </button>

            {disabled && (
                <p className="text-xs text-red-600 mt-2 text-center">
                    Please complete shipping address to place order
                </p>
            )}

            {/* Security Note */}
            <div className="mt-4 text-xs text-[#404040] text-center">
                <p>🔒 Your order is secure and encrypted</p>
            </div>
        </div>
    );
};

export default OrderSummary;
