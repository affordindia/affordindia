import Product from "../models/product.model.js";
import Review from "../models/review.model.js";
import { DEFAULT_SKIP, DEFAULT_LIMIT } from "../config/pagination.config.js";

export const createProduct = async (productData) => {
    const product = new Product(productData);
    return await product.save();
};

export const getAllProducts = async (filter = {}, options = {}) => {
    const query = {};
    if (filter.search) {
        query.name = { $regex: filter.search, $options: "i" };
    }
    if (filter.category) {
        query.category = filter.category;
    }
    if (filter.minPrice || filter.maxPrice) {
        query.price = {};
        if (filter.minPrice) query.price.$gte = filter.minPrice;
        if (filter.maxPrice) query.price.$lte = filter.maxPrice;
    }
    if (filter.isFeatured !== undefined) {
        query.isFeatured = filter.isFeatured;
    }
    // ...add more filters as needed
    const products = await Product.find(query)
        .populate("category")
        .skip(options.skip !== undefined ? options.skip : DEFAULT_SKIP)
        .limit(options.limit !== undefined ? options.limit : DEFAULT_LIMIT)
        .sort(options.sort || {});
    return products;
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
    const review = new Review({ ...reviewData, product: productId });
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
