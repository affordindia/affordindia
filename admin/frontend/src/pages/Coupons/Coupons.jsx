import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    getCoupons,
    toggleCouponStatus,
    deleteCoupon,
} from "../../api/coupons.api";
import { getCategories } from "../../api/categories.api";
import {
    FiPlus,
    FiFilter,
    FiX,
    FiEdit,
    FiTrash2,
    FiToggleLeft,
    FiToggleRight,
    FiPercent,
    FiDollarSign,
    FiTag,
} from "react-icons/fi";

const Coupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        category: "",
        discountType: "",
        status: "",
    });
    const [showFilters, setShowFilters] = useState(false);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        couponId: null,
        couponCode: "",
    });

    useEffect(() => {
        fetchCoupons();
        fetchCategories();
    }, [filters]);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([_, value]) => value !== "")
            );
            console.log("Applying filters:", activeFilters);
            const response = await getCoupons(activeFilters);
            console.log("Coupons API response:", response);
            if (response.success) {
                setCoupons(response.data.coupons || []);
            } else {
                console.error("Error fetching coupons:", response.error);
            }
        } catch (error) {
            console.error("Error fetching coupons:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            console.log("Categories API response:", response);
            if (response.success) {
                const categories = response.data.categories || response.data;
                console.log("Categories data:", categories);
                setCategories(Array.isArray(categories) ? categories : []);
            } else {
                console.error("Error fetching categories:", response.error);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleToggleStatus = async (couponId) => {
        try {
            const response = await toggleCouponStatus(couponId);
            if (response.success) {
                fetchCoupons();
            } else {
                console.error("Error toggling coupon status:", response.error);
            }
        } catch (error) {
            console.error("Error toggling coupon status:", error);
        }
    };

    const handleDeleteCoupon = (couponId, couponCode) => {
        setDeleteModal({
            isOpen: true,
            couponId,
            couponCode,
        });
    };

    const confirmDelete = async () => {
        try {
            const response = await deleteCoupon(deleteModal.couponId);
            if (response.success) {
                fetchCoupons();
                setDeleteModal({
                    isOpen: false,
                    couponId: null,
                    couponCode: "",
                });
            } else {
                console.error("Error deleting coupon:", response.error);
            }
        } catch (error) {
            console.error("Error deleting coupon:", error);
        }
    };

    const cancelDelete = () => {
        setDeleteModal({ isOpen: false, couponId: null, couponCode: "" });
    };

    const resetFilters = () => {
        setFilters({
            category: "",
            discountType: "",
            status: "",
        });
    };

    const getDiscountIcon = (type) => {
        switch (type) {
            case "percentage":
                return <FiPercent className="w-4 h-4" />;
            case "fixed":
                return <FiDollarSign className="w-4 h-4" />;
            case "percentage_upto":
                return <FiTag className="w-4 h-4" />;
            default:
                return <FiTag className="w-4 h-4" />;
        }
    };

    const formatDiscountValue = (coupon) => {
        switch (coupon.discountType) {
            case "percentage":
                return `${coupon.discountValue}% OFF`;
            case "fixed":
                return `₹${coupon.discountValue} OFF`;
            case "percentage_upto":
                return `${coupon.discountValue}% OFF UPTO ₹${coupon.maxDiscountAmount}`;
            default:
                return `${coupon.discountValue}% OFF`;
        }
    };

    const CouponCard = ({ coupon }) => (
        <div className="relative bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
            {/* Ticket Design - Horizontal Layout */}
            <div className="flex h-[140px]">
                {/* Left Section - Discount Info */}
                <div className="flex-shrink-0 w-28 bg-gradient-to-br from-blue-50 to-indigo-100 p-3 flex flex-col items-center justify-center border-r-2 border-dashed border-gray-300 relative">
                    {/* Perforated circles */}
                    <div className="absolute -top-3 right-0 w-6 h-6 bg-gray-50 rounded-full border-2 border-dashed border-gray-300"></div>
                    <div className="absolute -bottom-3 right-0 w-6 h-6 bg-gray-50 rounded-full border-2 border-dashed border-gray-300"></div>

                    <div className="text-center">
                        <div className="flex items-center justify-center mb-1 text-indigo-600">
                            {getDiscountIcon(coupon.discountType)}
                        </div>
                        <div className="text-xs font-bold text-indigo-800 leading-tight text-center">
                            {formatDiscountValue(coupon)}
                        </div>
                    </div>
                </div>

                {/* Middle Section - Main Content */}
                <div className="flex-1 min-w-0 p-3">
                    {/* Header with code and status */}
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex-1 min-w-0 mr-2">
                            <div className="font-mono text-base font-bold text-gray-900 truncate">
                                {coupon.code}
                            </div>
                        </div>
                        <span
                            className={`flex-shrink-0 px-2 py-1 rounded text-xs font-semibold ${
                                coupon.isActive
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {coupon.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                    </div>

                    {/* Description with fixed height */}
                    <div className="mb-3">
                        <div className="h-8 overflow-hidden">
                            <p
                                className="text-sm text-gray-600 leading-4"
                                style={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                }}
                            >
                                {coupon.description}
                            </p>
                        </div>
                    </div>

                    {/* Details in compact rows */}
                    <div className="space-y-1 text-xs text-gray-600">
                        <div className="flex justify-between">
                            <span>
                                Min:{" "}
                                <span className="font-semibold text-gray-900">
                                    ₹{coupon.minOrderAmount}
                                </span>
                            </span>
                            <span>
                                Used:{" "}
                                <span className="font-semibold text-gray-900">
                                    {coupon.totalUsages || 0} times
                                </span>
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span>
                                Expires:{" "}
                                <span className="font-semibold text-gray-900">
                                    {new Date(
                                        coupon.validUntil || coupon.expiresAt
                                    ).toLocaleDateString("en-GB")}
                                </span>
                            </span>
                            <span className="flex items-center gap-1">
                                <FiTag className="w-3 h-3" />
                                <span className="font-semibold text-gray-900 truncate max-w-[80px]">
                                    {coupon.isGlobal ||
                                    (!coupon.applicableCategories?.length &&
                                        !coupon.category)
                                        ? "All Categories"
                                        : coupon.applicableCategories?.[0]
                                              ?.name ||
                                          coupon.category?.name ||
                                          "All Categories"}
                                </span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Section - Actions */}
                <div className="flex-shrink-0 w-16 bg-gray-50 border-l-2 border-dashed border-gray-300 flex flex-col justify-center gap-1 p-1">
                    <Link
                        to={`/coupons/edit/${coupon._id}`}
                        className="w-full bg-blue-600 text-white p-1.5 rounded text-center hover:bg-blue-700 transition-colors flex items-center justify-center"
                        title="Edit Coupon"
                    >
                        <FiEdit className="w-3 h-3" />
                    </Link>
                    <button
                        onClick={() => handleToggleStatus(coupon._id)}
                        className={`w-full p-1.5 rounded flex items-center justify-center transition-colors ${
                            coupon.isActive
                                ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                : "bg-green-500 text-white hover:bg-green-600"
                        }`}
                        title={coupon.isActive ? "Deactivate" : "Activate"}
                    >
                        {coupon.isActive ? (
                            <FiToggleRight className="w-3 h-3" />
                        ) : (
                            <FiToggleLeft className="w-3 h-3" />
                        )}
                    </button>
                    <button
                        onClick={() =>
                            handleDeleteCoupon(coupon._id, coupon.code)
                        }
                        className="w-full bg-red-500 text-white p-1.5 rounded hover:bg-red-600 transition-colors flex items-center justify-center"
                        title="Delete Coupon"
                    >
                        <FiTrash2 className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-admin-text">
                        Coupons
                    </h1>
                    <p className="text-admin-text-secondary">
                        Manage your discount coupons and promotional offers
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 text-admin-text-secondary hover:text-admin-text border border-admin-border rounded-lg hover:bg-admin-bg transition-colors"
                    >
                        <FiFilter className="w-4 h-4" />
                        Filters
                    </button>
                    <Link
                        to="/coupons/add"
                        className="flex items-center gap-2 bg-admin-primary text-white px-4 py-2 rounded-lg hover:bg-admin-primary-dark transition-colors"
                    >
                        <FiPlus className="w-4 h-4" />
                        Add Coupon
                    </Link>
                </div>
            </div>

            {/* Filters */}
            {showFilters && (
                <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <select
                            value={filters.category}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    category: e.target.value,
                                }))
                            }
                            className="border border-admin-border rounded-lg px-3 py-2 text-admin-text focus:border-admin-primary focus:outline-none"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={filters.discountType}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    discountType: e.target.value,
                                }))
                            }
                            className="border border-admin-border rounded-lg px-3 py-2 text-admin-text focus:border-admin-primary focus:outline-none"
                        >
                            <option value="">All Types</option>
                            <option value="percentage">Percentage</option>
                            <option value="fixed">Fixed Amount</option>
                            <option value="percentage_upto">
                                Percentage with Cap
                            </option>
                        </select>

                        <select
                            value={filters.status}
                            onChange={(e) =>
                                setFilters((prev) => ({
                                    ...prev,
                                    status: e.target.value,
                                }))
                            }
                            className="border border-admin-border rounded-lg px-3 py-2 text-admin-text focus:border-admin-primary focus:outline-none"
                        >
                            <option value="">All Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>

                        <button
                            onClick={resetFilters}
                            className="flex items-center justify-center gap-2 text-admin-text-secondary hover:text-admin-text border border-admin-border rounded-lg px-3 py-2 hover:bg-admin-bg transition-colors"
                        >
                            <FiX className="w-4 h-4" />
                            Clear
                        </button>
                    </div>
                </div>
            )}

            {/* Content */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary"></div>
                </div>
            ) : (
                <>
                    {coupons.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-admin-text-muted mb-4">
                                <FiTag className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-admin-text mb-2">
                                No coupons found
                            </h3>
                            <p className="text-admin-text-secondary mb-4">
                                Get started by creating your first coupon
                            </p>
                            <Link
                                to="/coupons/add"
                                className="inline-flex items-center gap-2 bg-admin-primary text-white px-4 py-2 rounded-lg hover:bg-admin-primary-dark transition-colors"
                            >
                                <FiPlus className="w-4 h-4" />
                                Add First Coupon
                            </Link>
                        </div>
                    ) : (
                        <div
                            className={`grid gap-4 ${
                                coupons.length <= 6
                                    ? "grid-cols-1 lg:grid-cols-2"
                                    : "grid-cols-1"
                            }`}
                        >
                            {coupons.map((coupon) => (
                                <CouponCard key={coupon._id} coupon={coupon} />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-admin-card rounded-lg p-6 max-w-md w-full mx-4 border border-admin-border">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <FiTrash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-admin-text">
                                    Delete Coupon
                                </h3>
                                <p className="text-admin-text-secondary text-sm">
                                    This action cannot be undone
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-admin-text">
                                Are you sure you want to delete the coupon{" "}
                                <strong className="font-mono bg-gray-100 px-2 py-1 rounded">
                                    {deleteModal.couponCode}
                                </strong>
                                ?
                            </p>
                            <p className="text-admin-text-secondary text-sm mt-2">
                                This will permanently remove the coupon and all
                                its usage history.
                            </p>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 text-admin-text-secondary hover:text-admin-text border border-admin-border rounded-lg hover:bg-admin-bg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Delete Coupon
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Coupons;
