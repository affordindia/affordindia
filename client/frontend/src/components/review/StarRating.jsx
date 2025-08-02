import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ 
    rating = 0, 
    maxRating = 5, 
    size = "text-base", 
    interactive = false, 
    onRatingChange = null,
    showNumber = true,
    className = ""
}) => {
    const handleStarClick = (starValue) => {
        if (interactive && onRatingChange) {
            onRatingChange(starValue);
        }
    };

    const renderStar = (index) => {
        const starValue = index + 1;
        const difference = rating - index;
        
        let StarIcon;
        if (difference >= 1) {
            StarIcon = FaStar;
        } else if (difference >= 0.5) {
            StarIcon = FaStarHalfAlt;
        } else {
            StarIcon = FaRegStar;
        }

        return (
            <StarIcon
                key={index}
                className={`${size} ${
                    interactive 
                        ? "cursor-pointer hover:text-yellow-400 transition-colors" 
                        : ""
                } ${
                    difference >= 0.5 ? "text-yellow-400" : "text-gray-300"
                }`}
                onClick={() => handleStarClick(starValue)}
            />
        );
    };

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <div className="flex items-center">
                {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
            </div>
            {showNumber && (
                <span className={`ml-1 ${size.replace('text-', 'text-')} text-gray-600`}>
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default StarRating;
