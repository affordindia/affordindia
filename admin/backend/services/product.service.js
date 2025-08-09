import Product from "../models/product.model.js";
import Review from "../models/review.model.js";
import { DEFAULT_SKIP, DEFAULT_LIMIT } from "../config/pagination.config.js";
import mongoose from "mongoose";

export const createProduct = async (productData) => {
    const product = new Product(productData);
    return await product.save();
};

export const getAllProducts = async (filter = {}, options = {}) => {
    const query = {};

    // Text search
    if (filter.search) {
        query.name = { $regex: filter.search, $options: "i" };
    }

    // Category filter
    if (filter.category) {
        query.category = filter.category;
    }

    // Price range filter
    if (filter.minPrice || filter.maxPrice) {
        query.price = {};
        if (filter.minPrice) query.price.$gte = parseFloat(filter.minPrice);
        if (filter.maxPrice) query.price.$lte = parseFloat(filter.maxPrice);
    }

    // Featured filter
    if (filter.isFeatured !== undefined) {
        query.isFeatured = filter.isFeatured === "true";
    }

    // Stock filters
    if (filter.inStock !== undefined) {
        if (filter.inStock === "true") {
            query.stock = { $gt: 0 };
        } else if (filter.inStock === "false") {
            query.stock = { $lte: 0 };
        }
    }
    if (filter.lowStock !== undefined && filter.lowStock === "true") {
        query.stock = { $gt: 0, $lte: 10 }; // Consider low stock as <= 10
    }
    if (filter.minStock) {
        query.stock = { ...query.stock, $gte: parseInt(filter.minStock) };
    }
    if (filter.maxStock) {
        query.stock = { ...query.stock, $lte: parseInt(filter.maxStock) };
    }

    // Rating filters
    if (filter.minRating) {
        query.ratings = { $gte: parseFloat(filter.minRating) };
    }
    if (filter.maxRating) {
        query.ratings = {
            ...query.ratings,
            $lte: parseFloat(filter.maxRating),
        };
    }

    // Reviews count filter
    if (filter.hasReviews !== undefined) {
        if (filter.hasReviews === "true") {
            query.reviewsCount = { $gt: 0 };
        } else if (filter.hasReviews === "false") {
            query.reviewsCount = { $eq: 0 };
        }
    }
    if (filter.minReviews) {
        query.reviewsCount = { $gte: parseInt(filter.minReviews) };
    }

    // Sales count filter
    if (filter.minSales) {
        query.salesCount = { $gte: parseInt(filter.minSales) };
    }
    if (filter.maxSales) {
        query.salesCount = {
            ...query.salesCount,
            $lte: parseInt(filter.maxSales),
        };
    }

    // Views filter
    if (filter.minViews) {
        query.views = { $gte: parseInt(filter.minViews) };
    }

    // Discount filter
    if (filter.hasDiscount !== undefined) {
        if (filter.hasDiscount === "true") {
            query.discount = { $gt: 0 };
        } else if (filter.hasDiscount === "false") {
            query.discount = { $eq: 0 };
        }
    }
    if (filter.minDiscount) {
        query.discount = { $gte: parseFloat(filter.minDiscount) };
    }
    if (filter.maxDiscount) {
        query.discount = {
            ...query.discount,
            $lte: parseFloat(filter.maxDiscount),
        };
    }

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    // Get paginated products
    const products = await Product.find(query)
        .populate("category")
        .skip(options.skip !== undefined ? options.skip : DEFAULT_SKIP)
        .limit(options.limit !== undefined ? options.limit : DEFAULT_LIMIT)
        .sort(options.sort || {});

    return {
        products,
        total,
    };
};

export const getProductById = async (id) => {
    return await Product.findById(id).populate("category");
};

export const updateProduct = async (id, updateData) => {
    return await Product.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};

export const removeProductImage = async (productId, imageUrl) => {
    const product = await Product.findById(productId);
    if (!product) return null;
    product.images = product.images.filter((url) => url !== imageUrl);
    await product.save();
    return product;
};

export const updateProductStock = async (productId, newStock) => {
    return await Product.findByIdAndUpdate(
        productId,
        { stock: newStock },
        { new: true }
    );
};

export const updateProductFeature = async (productId, isFeatured) => {
    return await Product.findByIdAndUpdate(
        productId,
        { isFeatured },
        { new: true }
    );
};

export const addProductReview = async (productId, reviewData) => {
    // Ensure user and product are ObjectId
    const userId = reviewData.user
        ? new mongoose.Types.ObjectId(reviewData.user)
        : undefined;
    const review = new Review({
        ...reviewData,
        user: userId,
        product: new mongoose.Types.ObjectId(productId),
    });
    await review.save();
    const product = await Product.findById(productId);
    if (!product) return null;
    product.reviews.push(review._id);
    // Update average rating
    const allReviews = await Review.find({ product: productId });
    const avgRating =
        allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
    product.ratings = avgRating;
    await product.save();
    return review;
};

export const getProductReviews = async (productId) => {
    return await Review.find({ product: productId }).populate("user");
};

export const deleteProductReview = async (productId, reviewId) => {
    await Review.findByIdAndDelete(reviewId);
    const product = await Product.findById(productId);
    if (!product) return null;
    product.reviews = product.reviews.filter(
        (rid) => rid.toString() !== reviewId
    );
    // Update average rating
    const allReviews = await Review.find({ product: productId });
    const avgRating =
        allReviews.length > 0
            ? allReviews.reduce((acc, r) => acc + r.rating, 0) /
              allReviews.length
            : 0;
    product.ratings = avgRating;
    await product.save();
    return product;
};

export const getProductAnalytics = async (productId) => {
    const product = await Product.findById(productId);
    if (!product) return null;
    return {
        views: product.views || 0,
        salesCount: product.salesCount || 0,
        ratings: product.ratings,
        reviewsCount: product.reviews.length,
    };
};

export const getLowStockProducts = async (threshold = 10, limit = 20) => {
    return await Product.find({
        stock: { $lt: parseInt(threshold) },
    })
        .select("name stock images price category")
        .populate("category", "name")
        .sort({ stock: 1 })
        .limit(parseInt(limit));
};

export const bulkUpdateStock = async (updates) => {
    if (!Array.isArray(updates) || updates.length === 0) {
        throw new Error("Please provide valid stock updates");
    }

    const updatePromises = updates.map(({ productId, stock }) =>
        Product.findByIdAndUpdate(
            productId,
            { stock: parseInt(stock) },
            { new: true }
        ).select("name stock")
    );

    const results = await Promise.all(updatePromises);
    const successfulUpdates = results.filter((result) => result !== null);

    return {
        modifiedCount: successfulUpdates.length,
        updatedProducts: successfulUpdates,
        totalRequested: updates.length,
    };
};
