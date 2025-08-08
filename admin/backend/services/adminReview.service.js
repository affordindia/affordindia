import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import { DEFAULT_SKIP, DEFAULT_LIMIT } from "../config/pagination.config.js";

// Get all reviews across all products with filtering and pagination
export const getAllReviewsService = async (filter = {}, options = {}) => {
    const {
        skip = DEFAULT_SKIP,
        limit = DEFAULT_LIMIT,
        sort = { createdAt: -1 },
    } = options;

    const [reviews, totalCount] = await Promise.all([
        Review.find(filter)
            .populate("user", "name phone email")
            .populate("product", "name images")
            .sort(sort)
            .skip(skip)
            .limit(limit),

        Review.countDocuments(filter),
    ]);

    // Calculate pagination info
    const currentPage = Math.floor(skip / limit) + 1;
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;

    return {
        reviews,
        pagination: {
            currentPage,
            totalPages,
            totalCount,
            hasNextPage,
            hasPrevPage,
            limit,
        },
    };
};

// Get review by ID with full details
export const getReviewByIdService = async (reviewId) => {
    const review = await Review.findById(reviewId)
        .populate("user", "name phone email addresses")
        .populate("product", "name description images price");

    if (!review) {
        throw new Error("Review not found");
    }

    return review;
};

// Toggle review visibility (hide/show)
export const toggleReviewVisibilityService = async (reviewId) => {
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error("Review not found");
    }

    review.isVisible = !review.isVisible;
    await review.save();

    return {
        _id: review._id,
        isVisible: review.isVisible,
    };
};

// Delete review
export const deleteReviewService = async (reviewId) => {
    const review = await Review.findByIdAndDelete(reviewId);
    if (!review) {
        throw new Error("Review not found");
    }

    // Update product ratings after review deletion
    await updateProductRatingsService(review.product);

    return review;
};

// Bulk operations on reviews
export const bulkReviewOperationsService = async (action, reviewIds) => {
    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
        throw new Error("Please provide valid review IDs");
    }

    let result;
    let message;

    switch (action) {
        case "hide":
            result = await Review.updateMany(
                { _id: { $in: reviewIds } },
                { isVisible: false }
            );
            message = `${result.modifiedCount} reviews hidden successfully`;
            break;

        case "show":
            result = await Review.updateMany(
                { _id: { $in: reviewIds } },
                { isVisible: true }
            );
            message = `${result.modifiedCount} reviews shown successfully`;
            break;

        case "delete":
            const reviewsToDelete = await Review.find({
                _id: { $in: reviewIds },
            });
            const productIds = [
                ...new Set(reviewsToDelete.map((r) => r.product.toString())),
            ];

            result = await Review.deleteMany({ _id: { $in: reviewIds } });

            // Update product ratings for affected products
            await Promise.all(
                productIds.map((productId) =>
                    updateProductRatingsService(productId)
                )
            );
            message = `${result.deletedCount} reviews deleted successfully`;
            break;

        default:
            throw new Error(
                "Invalid action. Supported actions: hide, show, delete"
            );
    }

    return {
        result,
        message,
    };
};

// Get review statistics
export const getReviewStatsService = async () => {
    const [
        totalReviews,
        visibleReviews,
        hiddenReviews,
        ratingDistribution,
        recentReviews,
        topReviewedProducts,
    ] = await Promise.all([
        Review.countDocuments(),
        Review.countDocuments({ isVisible: true }),
        Review.countDocuments({ isVisible: false }),

        // Rating distribution
        Review.aggregate([
            { $group: { _id: "$rating", count: { $sum: 1 } } },
            { $sort: { _id: 1 } },
        ]),

        // Recent reviews (last 7 days)
        Review.countDocuments({
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }),

        // Top reviewed products
        Review.aggregate([
            { $group: { _id: "$product", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $project: {
                    productName: "$product.name",
                    reviewCount: "$count",
                    productImage: { $arrayElemAt: ["$product.images", 0] },
                },
            },
        ]),
    ]);

    const stats = {
        overview: {
            totalReviews,
            visibleReviews,
            hiddenReviews,
            recentReviews,
        },
        ratingDistribution: ratingDistribution.reduce((acc, item) => {
            acc[`${item._id}Star`] = item.count;
            return acc;
        }, {}),
        topReviewedProducts,
    };

    return stats;
};

// Helper function to update product ratings
export const updateProductRatingsService = async (productId) => {
    try {
        const reviews = await Review.find({
            product: productId,
            isVisible: true,
        });

        if (reviews.length === 0) {
            await Product.findByIdAndUpdate(productId, {
                ratings: 0,
                reviewsCount: 0,
            });
            return;
        }

        const totalRating = reviews.reduce(
            (sum, review) => sum + review.rating,
            0
        );
        const averageRating =
            Math.round((totalRating / reviews.length) * 10) / 10;

        await Product.findByIdAndUpdate(productId, {
            ratings: averageRating,
            reviewsCount: reviews.length,
        });
    } catch (error) {
        console.error("Update product ratings error:", error);
        throw new Error("Failed to update product ratings");
    }
};
