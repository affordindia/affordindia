import React, { useState, useEffect } from "react";
import { FaTag, FaTimes, FaGift, FaSpinner } from "react-icons/fa";
import {
    getAvailableCoupons,
    applyCouponToCart,
    removeCouponFromCart,
} from "../../api/coupon";
import toast from "react-hot-toast";

const CouponSection = ({ cart, onCartUpdate }) => {
    const [showCoupons, setShowCoupons] = useState(false);
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingCoupons, setLoadingCoupons] = useState(false);

    // Better check for applied coupon - ensure it has valid data
    const appliedCoupon =
        cart?.appliedCoupon &&
        cart.appliedCoupon.code &&
        cart.appliedCoupon.discountAmount !== undefined &&
        cart.appliedCoupon.discountAmount !== null
            ? cart.appliedCoupon
            : null;

    // Listen for cart updates to refresh coupons
    useEffect(() => {
        const handleCartUpdate = () => {
            // Only reload coupons if they're currently being shown
            if (showCoupons) {
                loadCoupons();
            }
        };

        window.addEventListener("cartUpdated", handleCartUpdate);
        return () =>
            window.removeEventListener("cartUpdated", handleCartUpdate);
    }, [showCoupons]);

    const loadCoupons = async () => {
        try {
            setLoadingCoupons(true);
            const response = await getAvailableCoupons();
            setAvailableCoupons(response.coupons || []);
        } catch (error) {
            toast.error("Failed to load coupons");
            console.error("Error loading coupons:", error);
        } finally {
            setLoadingCoupons(false);
        }
    };

    const handleShowCoupons = async () => {
        if (!showCoupons && availableCoupons.length === 0) {
            await loadCoupons();
        }
        setShowCoupons(!showCoupons);
    };

    const handleApplyCoupon = async (couponCode) => {
        try {
            setLoading(true);
            const response = await applyCouponToCart(couponCode);

            if (response.success) {
                toast.success(`Coupon ${couponCode} applied successfully!`);
                setShowCoupons(false);

                // Trigger cart refresh
                if (onCartUpdate) {
                    await onCartUpdate();
                }
            }
        } catch (error) {
            const errorMsg =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to apply coupon";
            toast.error(errorMsg);
            console.error("Error applying coupon:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCoupon = async () => {
        try {
            setLoading(true);
            const response = await removeCouponFromCart();

            if (response.success) {
                toast.success("Coupon removed successfully!");

                // Trigger cart refresh
                if (onCartUpdate) {
                    await onCartUpdate();
                }
            }
        } catch (error) {
            const errorMsg =
                error?.response?.data?.message ||
                error?.message ||
                "Failed to remove coupon";
            toast.error(errorMsg);
            console.error("Error removing coupon:", error);
        } finally {
            setLoading(false);
        }
    };

    const formatCouponDescription = (coupon) => {
        let description = "";

        switch (coupon.discountType) {
            case "percentage":
                description = `${coupon.discountValue}% OFF`;
                break;
            case "fixed":
                description = `₹${coupon.discountValue} OFF`;
                break;
            case "percentage_upto":
                description = `${coupon.discountValue}% OFF up to ₹${coupon.maxDiscountAmount}`;
                break;
            default:
                description = coupon.description;
        }

        // if (coupon.minOrderAmount > 0) {
        //     description += ` (Min: ₹${coupon.minOrderAmount})`;
        // }

        // if (coupon.isGlobal) {
        //     description += " • Valid on all products";
        // }

        return description;
    };

    return (
        <div className="mb-6" data-coupon-section>
            {/* Applied Coupon Display */}
            {appliedCoupon && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <FaTag className="text-green-600" />
                            <div>
                                <div className="font-medium text-green-800">
                                    Coupon Applied: {appliedCoupon.code}
                                </div>
                                <div className="text-sm text-green-600">
                                    You saved ₹{appliedCoupon.discountAmount}!
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={handleRemoveCoupon}
                            disabled={loading}
                            className="text-red-500 hover:text-red-700 p-2 disabled:opacity-50"
                            title="Remove coupon"
                        >
                            {loading ? (
                                <FaSpinner className="animate-spin" />
                            ) : (
                                <FaTimes />
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Apply Coupon Button (show only if no coupon is applied) */}
            {!appliedCoupon && (
                <div className="space-y-4">
                    <div className="text-center">
                        <button
                            onClick={handleShowCoupons}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#B76E79] text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
                        >
                            <FaGift />
                            {showCoupons ? "Hide Coupons" : "Apply Coupon"}
                        </button>
                    </div>

                    {/* Available Coupons List */}
                    {showCoupons && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <h3 className="font-medium text-gray-800 mb-3">
                                Available Coupons
                            </h3>

                            {loadingCoupons ? (
                                <div className="text-center py-4">
                                    <FaSpinner className="animate-spin mx-auto text-gray-400 mb-2" />
                                    <div className="text-sm text-gray-500">
                                        Loading coupons...
                                    </div>
                                </div>
                            ) : availableCoupons.length > 0 ? (
                                <div className="space-y-3">
                                    {availableCoupons.map((coupon) => (
                                        <div
                                            key={coupon._id}
                                            className={`p-3 border border-gray-200 rounded-lg bg-white transition-shadow ${
                                                coupon.isApplicable
                                                    ? "hover:shadow-md"
                                                    : "opacity-60 bg-gray-50"
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div
                                                        className={`font-medium mb-1 ${
                                                            coupon.isApplicable
                                                                ? "text-[#404040]"
                                                                : "text-gray-500"
                                                        }`}
                                                    >
                                                        {coupon.code}
                                                    </div>
                                                    <div
                                                        className={`text-sm mb-1 ${
                                                            coupon.isApplicable
                                                                ? "text-gray-600"
                                                                : "text-gray-400"
                                                        }`}
                                                    >
                                                        {formatCouponDescription(
                                                            coupon
                                                        )}
                                                    </div>
                                                    <div
                                                        className={`text-xs ${
                                                            coupon.isApplicable
                                                                ? "text-gray-500"
                                                                : "text-gray-400"
                                                        }`}
                                                    >
                                                        {coupon.description}
                                                    </div>
                                                    {!coupon.isApplicable &&
                                                        coupon.applicabilityReason && (
                                                            <div className="text-xs text-red-500 mt-1 italic">
                                                                {
                                                                    coupon.applicabilityReason
                                                                }
                                                            </div>
                                                        )}
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleApplyCoupon(
                                                            coupon.code
                                                        )
                                                    }
                                                    disabled={
                                                        loading ||
                                                        !coupon.isApplicable
                                                    }
                                                    className={`ml-3 px-4 py-2 text-white text-sm rounded transition-colors min-w-[80px] ${
                                                        coupon.isApplicable
                                                            ? "bg-[#B76E79] hover:bg-[#A5647A]"
                                                            : "bg-gray-400 cursor-not-allowed"
                                                    } disabled:opacity-50`}
                                                    title={
                                                        !coupon.isApplicable
                                                            ? coupon.applicabilityReason
                                                            : "Apply coupon"
                                                    }
                                                >
                                                    {loading ? (
                                                        <FaSpinner className="animate-spin mx-auto" />
                                                    ) : coupon.isApplicable ? (
                                                        "Apply"
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-4 text-gray-500">
                                    <FaGift className="mx-auto text-2xl mb-2 text-gray-300" />
                                    <div className="text-sm">
                                        No coupons available for your current
                                        cart
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        Try adding more items or check minimum
                                        order requirements
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CouponSection;
