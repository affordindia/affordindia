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
  const [excludedItems, setExcludedItems] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);

  const appliedCoupon =
    cart?.appliedCoupon &&
    cart.appliedCoupon.code &&
    cart.appliedCoupon.discountAmount !== undefined &&
    cart.appliedCoupon.discountAmount !== null
      ? cart.appliedCoupon
      : null;

  useEffect(() => {
    const handleCartUpdate = () => {
      if (showCoupons) loadCoupons();
    };
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, [showCoupons]);

  useEffect(() => {
    if (!appliedCoupon) setExcludedItems([]);
  }, [appliedCoupon]);

  const loadCoupons = async () => {
    try {
      setLoadingCoupons(true);
      const response = await getAvailableCoupons();
      setAvailableCoupons(response.coupons || []);
    } catch (error) {
      toast.error("Failed to load coupons");
    } finally {
      setLoadingCoupons(false);
    }
  };

  const handleShowCoupons = async () => {
    if (!showCoupons && availableCoupons.length === 0) await loadCoupons();
    setShowCoupons(!showCoupons);
  };

  const handleApplySelectedCoupon = async () => {
    if (!selectedCoupon) {
      toast.error("Please select a coupon first.");
      return;
    }

    try {
      setLoading(true);
      const response = await applyCouponToCart(selectedCoupon);
      if (response.success) {
        setExcludedItems(response.excludedItems || []);
        toast.success(`Coupon ${selectedCoupon} applied successfully!`);
        setShowCoupons(false);
        if (response.excludedItems?.length > 0) {
          const excludedCount = response.excludedItems.length;
          setTimeout(() => {
            toast.success(
              `Note: ${excludedCount} item${
                excludedCount > 1 ? "s are" : " is"
              } not eligible for this discount.`,
              { duration: 4000 }
            );
          }, 1000);
        }
        if (onCartUpdate) await onCartUpdate();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to apply coupon"
      );
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
        setExcludedItems([]);
        if (onCartUpdate) await onCartUpdate();
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to remove coupon"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCouponDescription = (coupon) => {
    switch (coupon.discountType) {
      case "percentage":
        return `${coupon.discountValue}% OFF`;
      case "fixed":
        return `₹${coupon.discountValue} OFF`;
      case "percentage_upto":
        return `${coupon.discountValue}% OFF up to ₹${coupon.maxDiscountAmount}`;
      default:
        return coupon.description;
    }
  };

  return (
    <div className="mb-6" data-coupon-section>
      {/* Applied Coupon */}
      {appliedCoupon && (
        <div className="mb-4 p-4 bg-[#FAFAFA]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaTag className="text-[#404040]" />
              <div>
                <div className="font-medium text-[#404040]">
                  Coupon Applied: {appliedCoupon.code}
                </div>
                <div className="text-sm text-[#2ECC71]">
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

      {/* Excluded Items */}
      {appliedCoupon && excludedItems.length > 0 && (
        <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          <div className="font-medium mb-2 flex items-center gap-2">
            ⚠️ Items not eligible for discount:
            <span className="text-xs bg-amber-200 px-2 py-1 rounded">
              {excludedItems.length} item
              {excludedItems.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-1">
            {excludedItems.map((item, index) => (
              <div
                key={`${item.productId}-${index}`}
                className="flex items-center justify-between text-xs bg-white p-2 rounded"
              >
                <span className="font-medium">
                  • {appliedCoupon.code} not applicable on {item.productName}
                </span>
                <span className="text-amber-600 font-semibold">
                  ₹{item.itemTotal}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Apply Coupon Button */}
      {!appliedCoupon && (
        <div className="text-center">
          <button
            onClick={handleShowCoupons}
            disabled={loading}
            className="bg-[#B76E79] text-white px-4 py-2 rounded text-sm hover:opacity-90 transition-colors w-full inline-flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <FaGift />
            Apply Coupon
          </button>
        </div>
      )}

      {/* Modal */}
{showCoupons && (
  <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-7 relative border border-gray-100 max-h-[85vh] overflow-y-auto">
      <button
        onClick={() => setShowCoupons(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        <FaTimes />
      </button>

      <h3 className="font-semibold text-lg mb-4 text-center text-gray-800">
        Available Coupons
      </h3>

      {loadingCoupons ? (
        <div className="text-center py-6">
          <FaSpinner className="animate-spin mx-auto text-gray-400 mb-1" />
          <div className="text-sm text-gray-500">Loading coupons...</div>
        </div>
      ) : availableCoupons.length > 0 ? (
        <>
          <div className="space-y-2 max-h-[70vh] overflow-y-auto">
            {availableCoupons.map((coupon) => (
              <label
                key={coupon._id}
                className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition ${
                  coupon.isApplicable
                    ? "hover:shadow-sm border-gray-200 hover:border-gray-300"
                    : "opacity-60 bg-gray-50 cursor-not-allowed border-gray-100"
                }`}
              >
                <input
                  type="radio"
                  name="coupon"
                  value={coupon.code}
                  disabled={!coupon.isApplicable}
                  checked={selectedCoupon === coupon.code}
                  onChange={() => setSelectedCoupon(coupon.code)}
                  className="mt-1 accent-[#B76E79]"
                />
                <div className="flex-1">
                  <div
                    className={`font-medium mb-1 ${
                      coupon.isApplicable ? "text-[#404040]" : "text-gray-500"
                    }`}
                  >
                    {coupon.code}
                  </div>
                  <div
                    className={`text-sm mb-1 ${
                      coupon.isApplicable ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    {formatCouponDescription(coupon)}
                  </div>
                  <div
                    className={`text-xs ${
                      coupon.isApplicable ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {coupon.description}
                  </div>
                  {!coupon.isApplicable && coupon.applicabilityReason && (
                    <div className="text-xs text-red-500 mt-1 italic">
                      {coupon.applicabilityReason}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApplySelectedCoupon}
            disabled={loading || !selectedCoupon}
            className="mt-5 w-full bg-[#B76E79] hover:bg-[#A5647A] text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {loading ? <FaSpinner className="animate-spin" /> : "Apply Coupon"}
          </button>
        </>
      ) : (
        <div className="text-center py-6 text-gray-500">
          <FaGift className="mx-auto text-2xl mb-2 text-gray-300" />
          <div className="text-sm">
            No coupons available for your current cart
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Try adding more items or check minimum order requirements
          </div>
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default CouponSection;
