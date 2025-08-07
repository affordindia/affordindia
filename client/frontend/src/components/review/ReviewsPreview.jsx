import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaPlus, FaStar, FaArrowRight } from "react-icons/fa";
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

const ReviewsPreview = ({ productId, currentUserId, className = "" }) => {
    const [reviews, setReviews] = useState([]);
    const [userReview, setUserReview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [error, setError] = useState(null);

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
            setUserReview(response.review || response);
            await fetchReviews();
            setShowForm(false);
            setEditingReview(null);
        } catch (error) {
            console.error("Error creating review:", error);
            setError(error.message || "Failed to create review");
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
            setUserReview(response.review || response);
            await fetchReviews();
            setShowForm(false);
            setEditingReview(null);
        } catch (error) {
            console.error("Error updating review:", error);
            setError(error.message || "Failed to update review");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm("Are you sure you want to delete this review?"))
            return;
        try {
            setActionLoading(true);
            await deleteProductReview(productId, reviewId);
            setUserReview(null);
            await fetchReviews();
        } catch (error) {
            console.error("Error deleting review:", error);
            setError(error.message || "Failed to delete review");
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

    // Get latest 3 reviews - include user's own review if there are few total reviews
    const otherReviews = reviews.filter(
        (review) => review.user._id !== currentUserId
    );
    const latestReviews =
        totalReviews <= 3
            ? reviews.slice(0, 3) // Show all reviews including user's own if total is 3 or less
            : otherReviews.slice(0, 3); // Only show others if there are more than 3 total

    if (loading) {
        return <Loader />;
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-[#404040]">
                    Customer Reviews
                </h2>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Review Form */}
            {showForm && (
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <ReviewForm
                        productId={productId}
                        initialReview={editingReview}
                        onSubmit={
                            editingReview
                                ? handleUpdateReview
                                : handleCreateReview
                        }
                        onCancel={handleCancelForm}
                        loading={actionLoading}
                    />
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Side - Rating Summary */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
                        <h3 className="text-lg font-semibold text-[#404040] mb-4">
                            Customer Rating
                        </h3>

                        {totalReviews > 0 ? (
                            <>
                                {/* Overall Rating */}
                                <div className="text-center mb-6">
                                    <div className="text-4xl font-bold text-[#404040] mb-2">
                                        {averageRating.toFixed(1)}/5
                                    </div>
                                    <StarRating
                                        rating={averageRating}
                                        size="text-lg"
                                        showNumber={false}
                                        className="justify-center mb-2"
                                    />
                                    <div className="text-sm text-gray-600">
                                        Based on {totalReviews} review
                                        {totalReviews !== 1 ? "s" : ""}
                                    </div>
                                </div>

                                {/* Rating Breakdown */}
                                <div className="space-y-2">
                                    {ratingCounts.map(
                                        ({ rating, count, percentage }) => (
                                            <div
                                                key={rating}
                                                className="flex items-center gap-3"
                                            >
                                                <span className="text-sm w-2">
                                                    {rating}
                                                </span>
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-[#B76E79] h-2 rounded-full transition-all duration-300"
                                                        style={{
                                                            width: `${percentage}%`,
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-600 w-8 text-right">
                                                    {count}
                                                </span>
                                            </div>
                                        )
                                    )}
                                </div>

                                {/* Write Review Button */}
                                {currentUserId && (
                                    <button
                                        onClick={() => {
                                            if (userReview) {
                                                setEditingReview(userReview);
                                            }
                                            setShowForm(true);
                                        }}
                                        className="w-full mt-6 bg-[#B76E79] text-white px-4 py-3 rounded-lg hover:bg-[#a55c66] transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaPlus className="text-sm" />
                                        {userReview
                                            ? "Edit Review"
                                            : "Write a Review"}
                                    </button>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-8">
                                <FaStar className="mx-auto text-4xl mb-4 text-gray-300" />
                                <h4 className="font-medium text-gray-600 mb-2">
                                    No reviews yet
                                </h4>
                                <p className="text-sm text-gray-500 mb-4">
                                    Be the first to share your experience!
                                </p>
                                {currentUserId && (
                                    <button
                                        onClick={() => setShowForm(true)}
                                        className="bg-[#B76E79] text-white px-4 py-2 rounded-lg hover:bg-[#a55c66] transition-colors flex items-center justify-center gap-2 mx-auto"
                                    >
                                        <FaPlus className="text-sm" />
                                        Write First Review
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - Latest Reviews */}
                <div className="lg:col-span-2">
                    {latestReviews.length > 0 ? (
                        <div className="space-y-4">
                            {latestReviews.map((review) => (
                                <ReviewCard
                                    key={review._id}
                                    review={review}
                                    isOwner={currentUserId === review.user._id}
                                    onEdit={() => handleEditReview(review)}
                                    onDelete={() =>
                                        handleDeleteReview(review._id)
                                    }
                                    loading={actionLoading}
                                />
                            ))}

                            {/* View All Reviews Button - Show only when more than 3 reviews */}
                            {totalReviews > 3 && (
                                <div className="text-center pt-4">
                                    <Link
                                        to={`/products/id/${productId}/reviews`}
                                        className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg transition-colors"
                                    >
                                        View All {totalReviews} Reviews
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : totalReviews === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <div className="text-lg mb-2">
                                No reviews to display
                            </div>
                            <p className="text-sm">
                                Reviews from other customers will appear here.
                            </p>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <div className="text-lg mb-2">
                                Your review is the only one so far!
                            </div>
                            <p className="text-sm">
                                More reviews from other customers will appear
                                here.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewsPreview;
