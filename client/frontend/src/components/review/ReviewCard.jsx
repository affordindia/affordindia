import React, { useState } from "react";
import {
    FaEdit,
    FaTrash,
    FaUser,
    FaCalendar,
    FaImages,
    FaChevronLeft,
    FaChevronRight,
    FaTimes,
} from "react-icons/fa";
import StarRating from "./StarRating";

const ReviewCard = ({
    review,
    currentUserId,
    onEdit,
    onDelete,
    loading = false,
    className = "",
}) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const isOwnReview = currentUserId && review.user._id === currentUserId;
    const reviewDate = new Date(review.createdAt).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

    const handleImageClick = (image, index) => {
        setSelectedImage(image);
        setCurrentImageIndex(index);
    };

    const closeImageModal = () => {
        setSelectedImage(null);
        setCurrentImageIndex(0);
    };

    const nextImage = () => {
        if (review.images && currentImageIndex < review.images.length - 1) {
            const newIndex = currentImageIndex + 1;
            setCurrentImageIndex(newIndex);
            setSelectedImage(review.images[newIndex]);
        }
    };

    const prevImage = () => {
        if (review.images && currentImageIndex > 0) {
            const newIndex = currentImageIndex - 1;
            setCurrentImageIndex(newIndex);
            setSelectedImage(review.images[newIndex]);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            closeImageModal();
        } else if (e.key === "ArrowRight") {
            nextImage();
        } else if (e.key === "ArrowLeft") {
            prevImage();
        }
    };

    return (
        <>
            <div
                className={`bg-[#f9f7f3] rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow ${className}`}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#B76E79] rounded-full flex items-center justify-center text-white">
                            <FaUser className="text-sm" />
                        </div>
                        <div>
                            <h4 className="font-medium text-[#404040]">
                                {review.user.name || "Anonymous User"}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <FaCalendar className="text-xs" />
                                <span>{reviewDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons for own reviews */}
                    {isOwnReview && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => onEdit(review)}
                                disabled={loading}
                                className="p-2 text-gray-500 hover:text-[#B76E79] transition-colors disabled:opacity-50"
                                title="Edit review"
                            >
                                <FaEdit />
                            </button>
                            <button
                                onClick={() => onDelete(review._id)}
                                disabled={loading}
                                className="p-2 text-gray-500 hover:text-red-500 transition-colors disabled:opacity-50"
                                title="Delete review"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    )}
                </div>

                {/* Rating */}
                <div className="mb-3">
                    <StarRating
                        rating={review.rating}
                        size="text-lg"
                        showNumber={false}
                    />
                </div>

                {/* Comment */}
                {review.comment && (
                    <p className="text-[#404040] mb-4 leading-relaxed">
                        {review.comment}
                    </p>
                )}

                {/* Images */}
                {review.images && review.images.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FaImages />
                            <span>
                                {review.images.length} image
                                {review.images.length > 1 ? "s" : ""}
                            </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {review.images.map((image, index) => (
                                <div
                                    key={image._id || index}
                                    className="w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
                                    onClick={() =>
                                        handleImageClick(image, index)
                                    }
                                >
                                    <img
                                        src={image.url}
                                        alt={
                                            image.altText ||
                                            `Review image ${index + 1}`
                                        }
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Update indicator */}
                {review.updatedAt && review.updatedAt !== review.createdAt && (
                    <div className="mt-4 pt-3 border-t border-gray-200">
                        <span className="text-xs text-gray-500">
                            Updated on{" "}
                            {new Date(review.updatedAt).toLocaleDateString(
                                "en-IN",
                                {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                }
                            )}
                        </span>
                    </div>
                )}
            </div>

            {/* Enhanced Image Modal with Carousel */}
            {selectedImage && (
                <div
                    className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50"
                    onClick={closeImageModal}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                >
                    <div className="relative w-full h-full max-w-7xl max-h-full flex items-center justify-center p-4">
                        {/* Close Button */}
                        <button
                            onClick={closeImageModal}
                            className="absolute top-6 right-6 bg-white/80 text-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-white transition-all z-10 text-lg"
                            title="Close (Esc)"
                        >
                            <FaTimes />
                        </button>

                        {/* Image Counter */}
                        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white/80 text-black px-4 py-2 rounded-full text-sm z-10 font-medium">
                            {currentImageIndex + 1} of {review.images.length}
                        </div>

                        {/* Previous Button */}
                        {review.images.length > 1 && currentImageIndex > 0 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    prevImage();
                                }}
                                className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/80 text-black rounded-full w-12 h-12 flex items-center justify-center hover:bg-white transition-all z-10 text-lg"
                                title="Previous image (←)"
                            >
                                <FaChevronLeft />
                            </button>
                        )}

                        {/* Next Button */}
                        {review.images.length > 1 &&
                            currentImageIndex < review.images.length - 1 && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                    className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/80 text-black rounded-full w-12 h-12 flex items-center justify-center hover:bg-white transition-all z-10 text-lg"
                                    title="Next image (→)"
                                >
                                    <FaChevronRight />
                                </button>
                            )}

                        {/* Main Image */}
                        <div
                            className="relative flex items-center justify-center px-4 sm:px-8"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src={selectedImage.url}
                                alt={
                                    selectedImage.altText ||
                                    `Review image ${currentImageIndex + 1}`
                                }
                                className="max-h-[85vh] w-auto h-auto object-contain rounded-lg sm:rounded-xl shadow-2xl"
                                style={{
                                    maxWidth: "85vw",
                                    minWidth: "300px",
                                }}
                            />
                        </div>

                        {/* Thumbnail Strip (if more than 1 image) */}
                        {review.images.length > 1 && (
                            <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 bg-white/80 p-2 sm:p-3 rounded-lg sm:rounded-xl max-w-[95vw] overflow-x-auto">
                                {review.images.map((image, index) => (
                                    <div
                                        key={image._id || index}
                                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-md sm:rounded-lg cursor-pointer transition-all flex-shrink-0 ${
                                            index === currentImageIndex
                                                ? "ring-2 ring-black opacity-100 scale-110"
                                                : "opacity-70 hover:opacity-90 hover:scale-105"
                                        }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleImageClick(image, index);
                                        }}
                                    >
                                        <img
                                            src={image.url}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover rounded-md sm:rounded-lg border border-gray-500"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ReviewCard;
