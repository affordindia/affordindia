import React, { useState, useEffect } from "react";
import { FaPlus, FaFilter, FaStar, FaUser } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import StarRating from "./StarRating";
import Loader from "../common/Loader";
import {
    getProductReviews,
    getUserProductReview,
    createProductReview,
    updateProductReview,
    deleteProductReview,
} from "../../api/review";

const ReviewsList = ({ productId, currentUserId, className = "" }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    // Initialize showForm as false - form shows when user clicks button
    const [showForm, setShowForm] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [filter, setFilter] = useState("all");
    const [error, setError] = useState(null);

    // Reset form when editing is cancelled or completed
    useEffect(() => {
        if (!editingReview && !showForm) {
            setShowForm(false);
        }
    }, [editingReview, showForm]);

    // Fetch reviews on component mount
    useEffect(() => {
        if (productId) {
            fetchReviews();
            if (currentUserId) {
                fetchUserReview();
            }
        }
    }, [productId, currentUserId]);

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await getProductReviews(productId);
            setReviews(response.reviews || response || []);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setError("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    const fetchUserReview = async () => {
        try {
            const response = await getUserProductReview(productId);
            setUserReview(response.review || null);
        } catch (error) {
            // User hasn't reviewed this product yet
            setUserReview(null);
        }
    };

    const handleCreateReview = async (reviewData, images, imageAction) => {
        try {
            setActionLoading(true);
            const response = await createProductReview(
                productId,
                reviewData,
                images
            );

            // Add new review to the list
            setReviews((prev) => [response.review, ...prev]);
            setUserReview(response.review);
            setShowForm(false);
            setError(null);
        } catch (error) {
            console.error("Error creating review:", error);
            setError("Failed to submit review. Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdateReview = async (reviewData, images, imageAction) => {
        try {
            setActionLoading(true);
            const response = await updateProductReview(
                productId,
                editingReview._id,
                reviewData,
                images,
                imageAction
            );

            // Update review in the list
            setReviews((prev) =>
                prev.map((review) =>
                    review._id === editingReview._id ? response.review : review
                )
            );
            setUserReview(response.review);
            setEditingReview(null);
            setShowForm(false);
            setError(null);
        } catch (error) {
            console.error("Error updating review:", error);
            setError("Failed to update review. Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?")) {
            return;
        }

        try {
            setActionLoading(true);
            await deleteProductReview(productId, reviewId);

            // Remove review from the list
            setReviews((prev) =>
                prev.filter((review) => review._id !== reviewId)
            );

            // If it was the user's review, clear userReview and show form again
            if (userReview && userReview._id === reviewId) {
                setUserReview(null);
                setShowForm(true);
            }

            setError(null);
        } catch (error) {
            console.error("Error deleting review:", error);
            setError("Failed to delete review. Please try again.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleEditReview = (review) => {
        setEditingReview(review);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setEditingReview(null);
        setShowForm(false);
    };

    const handleLoginRedirect = () => {
        // Navigate to login with current page as return location
        navigate("/login", {
            state: {
                from:
                    location.pathname +
                    location.search +
                    location.hash +
                    "#reviews-section",
            },
        });
    };

    // Filter reviews based on selected filter
    const filteredReviews = reviews.filter((review) => {
        if (filter === "all") return true;
        if (filter === "5") return review.rating === 5;
        if (filter === "4") return review.rating === 4;
        if (filter === "3") return review.rating === 3;
        if (filter === "2") return review.rating === 2;
        if (filter === "1") return review.rating === 1;
        return true;
    });

    // Calculate rating statistics
    const totalReviews = reviews.length;
    const averageRating =
        totalReviews > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) /
              totalReviews
            : 0;

    const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: reviews.filter((review) => review.rating === rating).length,
        percentage:
            totalReviews > 0
                ? (reviews.filter((review) => review.rating === rating).length /
                      totalReviews) *
                  100
                : 0,
    }));

    if (loading) {
        return <Loader />;
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#404040]">
                    Reviews & Ratings
                </h2>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Rating Summary */}
            {totalReviews > 0 && (
                <div className="bg-gray-50 rounded-lg p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Overall Rating */}
                        <div className="flex flex-col items-center">
                            <div className="text-4xl font-bold text-[#404040] mb-2">
                                {averageRating.toFixed(1)}
                            </div>
                            <StarRating
                                rating={averageRating}
                                size="text-xl"
                                showNumber={false}
                                className="mb-2"
                            />
                            <div className="text-sm text-gray-600">
                                {totalReviews} review
                                {totalReviews !== 1 ? "s" : ""}
                            </div>
                        </div>

                        {/* Rating Breakdown */}
                        <div className="flex-1">
                            {ratingCounts.map(
                                ({ rating, count, percentage }) => (
                                    <div
                                        key={rating}
                                        className="flex items-center gap-3 mb-2"
                                    >
                                        <span className="text-sm w-8">
                                            {rating} ★
                                        </span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-[#B76E79] h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${percentage}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-600 w-8">
                                            {count}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Write Review Section - Always Visible for Logged in Users */}
            {currentUserId && (
                <div className="bg-gradient-to-r from-[#B76E79]/10 to-[#B76E79]/5 border border-[#B76E79]/20 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-[#404040] mb-2">
                                {userReview
                                    ? "Edit Your Review"
                                    : "Share Your Experience"}
                            </h3>
                            <p className="text-gray-600 text-sm">
                                {userReview
                                    ? "Update your review and photos"
                                    : "Help others by writing a review with photos"}
                            </p>
                        </div>
                        <button
                            data-write-review
                            onClick={() => {
                                if (userReview) {
                                    setEditingReview(userReview);
                                }
                                setShowForm(true);
                            }}
                            disabled={actionLoading}
                            className="px-6 py-2 bg-[#B76E79] text-white rounded-lg hover:bg-[#A5647A] transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                            <span className="flex items-center gap-2">
                                <FaPlus />
                                {userReview ? "Edit Review" : "Write Review"}
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {/* Login Prompt for Non-logged Users */}
            {!currentUserId && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-[#404040] mb-2">
                        Want to Write a Review?
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                        Please log in to share your experience and upload photos
                    </p>
                    <button
                        onClick={handleLoginRedirect}
                        className="px-6 py-2 bg-[#B76E79] text-white rounded-lg hover:bg-[#A5647A] transition-colors"
                    >
                        Login to Write Review
                    </button>
                </div>
            )}

            {/* Review Form */}
            {showForm && currentUserId && (
                <ReviewForm
                    onSubmit={
                        editingReview ? handleUpdateReview : handleCreateReview
                    }
                    onCancel={handleCancelForm}
                    initialReview={editingReview}
                    loading={actionLoading}
                />
            )}

            {/* Filters */}
            {totalReviews > 0 && (
                <div className="flex items-center gap-4 overflow-x-auto pb-2">
                    <FaFilter className="text-gray-500 flex-shrink-0" />
                    {[
                        { key: "all", label: "All Reviews" },
                        { key: "5", label: "5", mobileLabel: "5 ★" },
                        { key: "4", label: "4", mobileLabel: "4 ★" },
                        { key: "3", label: "3", mobileLabel: "3 ★" },
                        { key: "2", label: "2", mobileLabel: "2 ★" },
                        { key: "1", label: "1", mobileLabel: "1 ★" },
                    ].map(({ key, label, mobileLabel }) => (
                        <button
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                                filter === key
                                    ? "bg-[#B76E79] text-white"
                                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`}
                        >
                            <span className="hidden sm:inline">{label}</span>
                            <span className="sm:hidden">
                                {mobileLabel || label}
                            </span>
                            {key !== "all" && (
                                <span className="ml-1 hidden sm:inline">
                                    Stars (
                                    {ratingCounts.find(
                                        (r) => r.rating.toString() === key
                                    )?.count || 0}
                                    )
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {filteredReviews.length > 0 ? (
                    filteredReviews.map((review) => (
                        <ReviewCard
                            key={review._id}
                            review={review}
                            isOwner={currentUserId === review.user._id}
                            onEdit={() => handleEditReview(review)}
                            onDelete={() => handleDeleteReview(review._id)}
                            loading={actionLoading}
                        />
                    ))
                ) : totalReviews > 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No reviews found for the selected filter.
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <FaStar className="mx-auto text-4xl mb-4 text-gray-300" />
                        <h3 className="text-lg font-medium mb-2">
                            No Reviews Yet
                        </h3>
                        <p className="text-sm">
                            Be the first to share your experience with this
                            product!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewsList;
