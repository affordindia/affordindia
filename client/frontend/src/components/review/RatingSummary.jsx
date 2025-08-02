import React from "react";
import StarRating from "./StarRating";

const RatingSummary = ({
    averageRating = 0,
    numReviews = 0,
    // Support both field naming conventions
    ratings = 0,
    reviewsCount = 0,
    size = "sm",
    showReviewCount = true,
    className = "",
}) => {
    // Use the backend field names if provided, otherwise fall back to the original prop names
    const finalRating = ratings || averageRating;
    const finalReviewCount = reviewsCount || numReviews;
    const getSizeClasses = () => {
        switch (size) {
            case "xs":
                return {
                    starSize: "text-xs",
                    textSize: "text-xs",
                    gap: "gap-1",
                };
            case "sm":
                return {
                    starSize: "text-sm",
                    textSize: "text-sm",
                    gap: "gap-2",
                };
            case "lg":
                return {
                    starSize: "text-lg",
                    textSize: "text-base",
                    gap: "gap-3",
                };
            case "xl":
                return {
                    starSize: "text-xl",
                    textSize: "text-lg",
                    gap: "gap-3",
                };
            default:
                return {
                    starSize: "text-sm",
                    textSize: "text-sm",
                    gap: "gap-2",
                };
        }
    };

    const { starSize, textSize, gap } = getSizeClasses();

    if (!finalRating && !finalReviewCount) {
        return (
            <div
                className={`flex items-center ${gap} text-gray-400 ${className}`}
            >
                <StarRating rating={0} size={starSize} showNumber={false} />
                <span className={`${textSize}`}>No reviews</span>
            </div>
        );
    }

    return (
        <div className={`flex items-center ${gap} ${className}`}>
            <StarRating
                rating={finalRating}
                size={starSize}
                showNumber={false}
            />
            <span className={`${textSize} text-gray-600`}>
                {finalRating.toFixed(1)}
            </span>
            {showReviewCount && (
                <span className={`${textSize} text-gray-500`}>
                    ({finalReviewCount} review
                    {finalReviewCount !== 1 ? "s" : ""})
                </span>
            )}
        </div>
    );
};

export default RatingSummary;
