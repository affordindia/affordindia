import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaSearch,
    FaFilter,
    FaStar,
    FaEye,
    FaEyeSlash,
    FaTrash,
    FaSort,
    FaUser,
    FaTimes,
} from "react-icons/fa";
import {
    getReviews,
    toggleReviewVisibility,
    deleteReview,
} from "../../api/reviews.api.js";
import Loader from "../../components/common/Loader.jsx";

const Reviews = () => {
    // State management
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal states
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    // Search and filters
    const [searchTerm, setSearchTerm] = useState("");
    const [searchMode, setSearchMode] = useState("text"); // 'text', 'reviewId', 'productId', 'userId', 'product'
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Filters state (for UI form)
    const [filters, setFilters] = useState({
        rating: "",
        minRating: "",
        maxRating: "",
        isVisible: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    // Applied filters (what's actually sent to API)
    const [appliedFilters, setAppliedFilters] = useState({
        rating: "",
        minRating: "",
        maxRating: "",
        isVisible: "",
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    const reviewsPerPage = 20;

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    // Fetch reviews
    const fetchReviews = async (
        page = 1,
        searchQuery = "",
        appliedFiltersParam = {}
    ) => {
        try {
            setLoading(true);
            setError("");

            const params = {
                skip: (page - 1) * reviewsPerPage,
                limit: reviewsPerPage,
                search: searchQuery,
                searchMode: searchMode,
                ...appliedFiltersParam,
            };

            // Remove empty parameters
            Object.keys(params).forEach((key) => {
                if (
                    params[key] === "" ||
                    params[key] === null ||
                    params[key] === undefined
                ) {
                    delete params[key];
                }
            });

            const result = await getReviews(params);

            if (result.success) {
                setReviews(result.data.reviews || []);
                setTotalPages(result.data.pagination?.totalPages || 0);
                setTotalReviews(
                    result.data.pagination?.totalCount ||
                        result.data.pagination?.total ||
                        0
                );
                setCurrentPage(page); // Use the page parameter instead of API response
            } else {
                setError(result.error || "Failed to fetch reviews");
                setReviews([]);
            }
        } catch (err) {
            console.error("Error fetching reviews:", err);
            setError("Failed to fetch reviews");
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    // Search function
    const performSearch = async () => {
        setCurrentPage(1);
        await fetchReviews(1, searchTerm, appliedFilters);
    };

    // Handle search
    const handleSearch = () => {
        performSearch();
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const applyFilters = () => {
        setAppliedFilters({ ...filters });
        setCurrentPage(1);
        fetchReviews(1, searchTerm, filters);
    };

    const clearFilters = () => {
        const defaultFilters = {
            rating: "",
            minRating: "",
            maxRating: "",
            isVisible: "",
            sortBy: "createdAt",
            sortOrder: "desc",
        };
        setFilters(defaultFilters);
        setAppliedFilters(defaultFilters);
        setSearchTerm("");
        setCurrentPage(1);
        fetchReviews(1, "", defaultFilters);
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        Object.values(appliedFilters).forEach((value) => {
            if (
                value !== "" &&
                value !== false &&
                value !== "createdAt" &&
                value !== "desc"
            )
                count++;
        });
        if (searchTerm) count++;
        return count;
    };

    // Handle pagination
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            fetchReviews(page, searchTerm, appliedFilters);
        }
    };

    // Load data on component mount and when search mode changes
    useEffect(() => {
        fetchReviews(1, searchTerm, appliedFilters);
    }, [searchMode]); // Only depend on searchMode to avoid double calls

    // Individual review actions
    const handleToggleVisibility = (reviewId) => {
        setSelectedReviewId(reviewId);
        setConfirmAction("toggle");
        setShowConfirmModal(true);
    };

    const handleDeleteReview = (reviewId) => {
        setSelectedReviewId(reviewId);
        setConfirmAction("delete");
        setShowConfirmModal(true);
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowImageModal(true);
    };

    const confirmActionHandler = async () => {
        try {
            if (confirmAction === "toggle") {
                const result = await toggleReviewVisibility(selectedReviewId);
                if (result.success) {
                    fetchReviews(currentPage, searchTerm, appliedFilters);
                } else {
                    setError(
                        result.error || "Failed to toggle review visibility"
                    );
                }
            } else if (confirmAction === "delete") {
                const result = await deleteReview(selectedReviewId);
                if (result.success) {
                    fetchReviews(currentPage, searchTerm, appliedFilters);
                } else {
                    setError(result.error || "Failed to delete review");
                }
            }
        } catch (err) {
            setError("Error performing action");
        } finally {
            setShowConfirmModal(false);
            setSelectedReviewId(null);
            setConfirmAction(null);
        }
    };

    const cancelAction = () => {
        setShowConfirmModal(false);
        setSelectedReviewId(null);
        setConfirmAction(null);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FaStar
                key={index}
                className={`w-4 h-4 ${
                    index < rating ? "text-yellow-400" : "text-admin-border"
                }`}
            />
        ));
    };

    if (loading) {
        return <Loader fullScreen={true} />;
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-blur-xs bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-admin-card rounded-lg p-6 max-w-md w-full border border-admin-border shadow-xl text-center">
                    <div className="text-admin-error text-lg mb-4">
                        ⚠️ {error}
                    </div>
                    <button
                        onClick={() => setError(null)}
                        className="mt-4 px-6 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors font-semibold"
                    >
                        OK
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-admin-text mb-2">
                        Reviews Management
                    </h1>
                    <p className="text-admin-text-secondary">
                        Manage customer reviews and ratings ({totalReviews}{" "}
                        total)
                    </p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-admin-card rounded-lg p-6 border border-admin-border mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 flex gap-2">
                        <select
                            value={searchMode}
                            onChange={(e) => setSearchMode(e.target.value)}
                            className="px-4 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent bg-white text-sm whitespace-nowrap"
                        >
                            <option value="text">Text Search</option>
                            <option value="reviewId">Review ID</option>
                            <option value="productId">Product ID</option>
                            <option value="userId">User ID</option>
                            <option value="product">Product Name</option>
                        </select>

                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-text-secondary w-4 h-4" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={`Search by ${
                                    searchMode === "text"
                                        ? "review content"
                                        : searchMode === "reviewId"
                                        ? "review ID"
                                        : searchMode === "productId"
                                        ? "product ID"
                                        : searchMode === "userId"
                                        ? "user ID"
                                        : searchMode === "product"
                                        ? "product name"
                                        : "review content"
                                }...`}
                                className="w-full pl-10 pr-4 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                            />
                        </div>

                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors"
                        >
                            Search
                        </button>
                    </div>

                    {/* Filters Toggle */}
                    <button
                        onClick={() =>
                            setShowAdvancedFilters(!showAdvancedFilters)
                        }
                        className={`px-4 py-2 border border-admin-border rounded-lg transition-colors whitespace-nowrap ${
                            showAdvancedFilters
                                ? "bg-admin-primary text-white"
                                : "text-admin-text-secondary hover:text-admin-text hover:bg-admin-bg"
                        }`}
                    >
                        <FaFilter className="w-4 h-4 inline mr-2" />
                        Filters ({getActiveFiltersCount()})
                    </button>

                    {/* Clear Filters */}
                    <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-admin-text-secondary hover:text-admin-text border border-admin-border rounded-lg hover:bg-admin-bg transition-colors whitespace-nowrap"
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Advanced Filters Panel */}
                {showAdvancedFilters && (
                    <div className="mt-6 pt-6 border-t border-admin-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {/* Rating Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Exact Rating
                                </label>
                                <select
                                    value={filters.rating}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "rating",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                >
                                    <option value="">All Ratings</option>
                                    <option value="5">5 Stars</option>
                                    <option value="4">4 Stars</option>
                                    <option value="3">3 Stars</option>
                                    <option value="2">2 Stars</option>
                                    <option value="1">1 Star</option>
                                </select>
                            </div>

                            {/* Visibility Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Visibility
                                </label>
                                <select
                                    value={filters.isVisible}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "isVisible",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                >
                                    <option value="">All Reviews</option>
                                    <option value="true">Visible Only</option>
                                    <option value="false">Hidden Only</option>
                                </select>
                            </div>

                            {/* Sort By Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Sort By
                                </label>
                                <select
                                    value={filters.sortBy}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "sortBy",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                >
                                    <option value="createdAt">
                                        Date Created
                                    </option>
                                    <option value="rating">Rating</option>
                                    <option value="updatedAt">
                                        Last Updated
                                    </option>
                                </select>
                            </div>

                            {/* Sort Order Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Sort Order
                                </label>
                                <select
                                    value={filters.sortOrder}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "sortOrder",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                >
                                    <option value="desc">Descending</option>
                                    <option value="asc">Ascending</option>
                                </select>
                            </div>
                        </div>

                        {/* Apply Filters Button */}
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={applyFilters}
                                className="px-6 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors font-medium"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Reviews Cards */}
            <div className="space-y-6">
                {reviews.map((review) => (
                    <div
                        key={review._id}
                        className="bg-admin-card rounded-xl border border-admin-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
                    >
                        {/* Card Header */}
                        <div className="bg-admin-border/50 px-6 py-4 border-b border-admin-border">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    {/* Product Info */}
                                    <div className="flex items-center gap-3">
                                        {review.product?.images?.[0] && (
                                            <img
                                                src={review.product.images[0]}
                                                alt={
                                                    review.product?.name ||
                                                    "Product"
                                                }
                                                className="w-12 h-12 object-cover rounded-lg border border-admin-border cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() =>
                                                    handleImageClick(
                                                        review.product.images[0]
                                                    )
                                                }
                                            />
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-admin-text text-sm">
                                                {review.product?.name ||
                                                    "Deleted Product"}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Customer Name */}
                                    <div className="flex items-center gap-2 text-admin-text-secondary">
                                        <FaUser className="w-4 h-4" />
                                        <span className="font-medium">
                                            {review.user?.name || "Anonymous"}
                                        </span>
                                    </div>
                                </div>

                                {/* Status & Actions */}
                                <div className="flex items-center gap-3">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            review.isVisible
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {review.isVisible
                                            ? "Visible"
                                            : "Hidden"}
                                    </span>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() =>
                                                handleToggleVisibility(
                                                    review._id
                                                )
                                            }
                                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                                                review.isVisible
                                                    ? "bg-orange-500 text-white hover:bg-orange-600"
                                                    : "bg-green-500 text-white hover:bg-green-600"
                                            }`}
                                            title={
                                                review.isVisible
                                                    ? "Hide Review"
                                                    : "Show Review"
                                            }
                                        >
                                            {review.isVisible ? (
                                                <>
                                                    <FaEyeSlash className="w-3 h-3" />
                                                    Hide
                                                </>
                                            ) : (
                                                <>
                                                    <FaEye className="w-3 h-3" />
                                                    Show
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDeleteReview(review._id)
                                            }
                                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-xs font-medium flex items-center gap-1.5"
                                            title="Delete Review"
                                        >
                                            <FaTrash className="w-3 h-3" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-6">
                            {/* Rating & Date Row */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        {renderStars(review.rating)}
                                    </div>
                                    <span className="text-sm font-semibold text-admin-text">
                                        {review.rating}.0/5
                                    </span>
                                </div>
                                <span className="text-sm text-admin-text-secondary">
                                    {formatDate(review.createdAt)}
                                </span>
                            </div>

                            {/* Review Content */}
                            <div className="space-y-4">
                                {/* Review Text */}
                                {review.comment ? (
                                    <div className="bg-admin-border/30 rounded-lg p-4">
                                        <p className="text-admin-text leading-relaxed">
                                            {review.comment}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="bg-admin-border/30 rounded-lg p-4">
                                        <p className="text-admin-text-secondary italic text-center">
                                            No written review provided
                                        </p>
                                    </div>
                                )}

                                {/* Review Images */}
                                {review.images && review.images.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-admin-text mb-3">
                                            Customer Photos (
                                            {review.images.length})
                                        </h4>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                            {review.images.map(
                                                (image, index) => {
                                                    const imageUrl =
                                                        image.url || image;
                                                    return (
                                                        <div
                                                            key={index}
                                                            className="cursor-pointer"
                                                            onClick={() =>
                                                                handleImageClick(
                                                                    imageUrl
                                                                )
                                                            }
                                                        >
                                                            <img
                                                                src={imageUrl}
                                                                alt={
                                                                    image.altText ||
                                                                    `Review image ${
                                                                        index +
                                                                        1
                                                                    }`
                                                                }
                                                                className="w-full h-24 object-cover rounded-lg border border-admin-border hover:opacity-90 transition-opacity bg-gray-100"
                                                            />
                                                        </div>
                                                    );
                                                }
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {reviews.length === 0 && !loading && (
                <div className="text-center py-12">
                    <div className="text-admin-text-secondary mb-4">
                        <FaStar className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No reviews found</p>
                        {searchTerm ||
                        Object.values(appliedFilters).some(
                            (f) => f !== "" && f !== "createdAt" && f !== "desc"
                        ) ? (
                            <p>
                                Try adjusting your search or filters, or clear
                                all filters to see all reviews
                            </p>
                        ) : (
                            <p>No customer reviews have been submitted yet</p>
                        )}
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border border-admin-border rounded-lg hover:bg-admin-border/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>

                    {/* Page numbers */}
                    {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, index) => {
                            const page =
                                Math.max(
                                    1,
                                    Math.min(currentPage - 2, totalPages - 4)
                                ) + index;
                            if (page > totalPages) return null;

                            return (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`px-3 py-2 border rounded-lg transition-colors ${
                                        currentPage === page
                                            ? "bg-admin-primary text-white border-admin-primary"
                                            : "border-admin-border hover:bg-admin-border/50"
                                    }`}
                                >
                                    {page}
                                </button>
                            );
                        }
                    )}

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border border-admin-border rounded-lg hover:bg-admin-border/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-admin-card rounded-lg p-6 max-w-md w-full mx-4 border border-admin-border">
                        <h3 className="text-lg font-semibold text-admin-text mb-4">
                            {confirmAction === "toggle"
                                ? "Confirm Visibility Change"
                                : "Confirm Deletion"}
                        </h3>
                        <p className="text-admin-text-secondary mb-6">
                            {confirmAction === "toggle"
                                ? "Are you sure you want to change the visibility of this review?"
                                : "Are you sure you want to delete this review? This action cannot be undone."}
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={cancelAction}
                                className="px-4 py-2 border border-admin-border rounded-lg hover:bg-admin-border/50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmActionHandler}
                                className={`px-4 py-2 rounded-lg text-white transition-colors ${
                                    confirmAction === "toggle"
                                        ? "bg-orange-500 hover:bg-orange-600"
                                        : "bg-red-500 hover:bg-red-600"
                                }`}
                            >
                                {confirmAction === "toggle"
                                    ? "Change Visibility"
                                    : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Modal */}
            {showImageModal && selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <div className="relative max-w-4xl max-h-full p-4">
                        <button
                            onClick={() => {
                                setShowImageModal(false);
                                setSelectedImage(null);
                            }}
                            className="absolute -top-2 -right-2 bg-admin-card rounded-full p-2 shadow-lg hover:bg-admin-border/50 transition-colors z-10 border border-admin-border"
                        >
                            <FaTimes className="w-4 h-4 text-admin-text-secondary" />
                        </button>
                        <img
                            src={selectedImage}
                            alt="Review"
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reviews;
