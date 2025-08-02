import React, { useState } from "react";
import { FaStar, FaPaperPlane, FaTimes } from "react-icons/fa";
import StarRating from "./StarRating";
import ImageUpload from "./ImageUpload";

const ReviewForm = ({
    onSubmit,
    onCancel,
    initialReview = null,
    loading = false,
    className = "",
}) => {
    const [rating, setRating] = useState(initialReview?.rating || 0);
    const [comment, setComment] = useState(initialReview?.comment || "");
    const [images, setImages] = useState([]);
    const [imageAction, setImageAction] = useState("add");
    const [errors, setErrors] = useState({});

    const isEdit = !!initialReview;

    const validateForm = () => {
        const newErrors = {};

        if (!rating || rating < 1 || rating > 5) {
            newErrors.rating = "Please select a rating between 1 and 5 stars";
        }

        if (!comment.trim()) {
            newErrors.comment = "Please write a review comment";
        } else if (comment.trim().length < 10) {
            newErrors.comment =
                "Review comment must be at least 10 characters long";
        } else if (comment.trim().length > 1000) {
            newErrors.comment =
                "Review comment must not exceed 1000 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const reviewData = {
            rating,
            comment: comment.trim(),
        };

        onSubmit(reviewData, images, imageAction);
    };

    const handleCancel = () => {
        setRating(initialReview?.rating || 0);
        setComment(initialReview?.comment || "");
        setImages([]);
        setImageAction("add");
        setErrors({});
        onCancel();
    };

    return (
        <div
            className={`bg-white rounded-xl p-6 shadow-lg border ${className}`}
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#404040]">
                    {isEdit ? "Edit Your Review" : "Write a Review"}
                </h3>
                <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors disabled:opacity-50"
                >
                    <FaTimes />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[#404040]">
                        Rating *
                    </label>
                    <div className="flex items-center gap-4">
                        <StarRating
                            rating={rating}
                            size="text-2xl"
                            interactive={!loading}
                            onRatingChange={setRating}
                            showNumber={false}
                            className="gap-2"
                        />
                        <span className="text-lg font-medium text-[#404040]">
                            {rating > 0
                                ? `${rating} star${rating > 1 ? "s" : ""}`
                                : "Select rating"}
                        </span>
                    </div>
                    {errors.rating && (
                        <p className="text-red-500 text-sm">{errors.rating}</p>
                    )}
                </div>

                {/* Comment */}
                <div className="space-y-2">
                    <label
                        htmlFor="comment"
                        className="block text-sm font-medium text-[#404040]"
                    >
                        Review Comment *
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this product..."
                        disabled={loading}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B76E79] focus:border-transparent transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{comment.length}/1000 characters</span>
                        {errors.comment && (
                            <span className="text-red-500">
                                {errors.comment}
                            </span>
                        )}
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2">
                        <label className="block text-sm font-medium text-[#404040]">
                            📸 Upload Photos
                        </label>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                            Optional
                        </span>
                    </div>
                    <p className="text-xs text-gray-600">
                        Add photos to help others see your experience with this
                        product
                    </p>

                    {isEdit && (
                        <div className="space-y-3">
                            <div className="flex gap-4">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="imageAction"
                                        value="add"
                                        checked={imageAction === "add"}
                                        onChange={(e) =>
                                            setImageAction(e.target.value)
                                        }
                                        disabled={loading}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">
                                        Add to existing images
                                    </span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="imageAction"
                                        value="replace"
                                        checked={imageAction === "replace"}
                                        onChange={(e) =>
                                            setImageAction(e.target.value)
                                        }
                                        disabled={loading}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">
                                        Replace all images
                                    </span>
                                </label>
                            </div>
                        </div>
                    )}

                    <ImageUpload
                        images={images}
                        onImagesChange={setImages}
                        maxImages={5}
                        disabled={loading}
                    />
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={loading || !rating || !comment.trim()}
                        className="button flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="button-content flex items-center justify-center gap-2">
                            <FaPaperPlane />
                            {loading
                                ? isEdit
                                    ? "Updating..."
                                    : "Submitting..."
                                : isEdit
                                ? "Update Review"
                                : "Submit Review"}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={handleCancel}
                        disabled={loading}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
