import Product from "../models/product.model.js";
import config from "../config/server.config.js";

export const getProducts = async (filter, options) => {
    // filter: object for MongoDB query
    // options: { skip, limit, sort }
    return Product.find(filter)
        .sort(options.sort)
        .skip(options.skip)
        .limit(options.limit)
        .populate("category")
        .lean();
};

export const getProductById = async (id) => {
    return Product.findById(id)
        .populate("category")
        .populate({
            path: "reviews",
            populate: { path: "user", select: "name" },
        })
        .lean();
};

export const getFeaturedProducts = async (limit = 10) => {
    return Product.find({ isFeatured: true })
        .sort("-createdAt")
        .limit(limit)
        .populate("category")
        .lean();
};

export const getNewProducts = async (limit = 10) => {
    const date = new Date();
    date.setDate(date.getDate() - config.products.newProductDays);
    return Product.find({ createdAt: { $gte: date } })
        .sort("-createdAt")
        .limit(limit)
        .populate("category")
        .lean();
};

export const getPopularProducts = async (limit = 10) => {
    return Product.find({
        $or: [
            { views: { $gte: config.products.popularMinViews } },
            { salesCount: { $gte: config.products.popularMinSales } },
        ],
    })
        .sort("-views -salesCount")
        .limit(limit)
        .populate("category")
        .lean();
};

export const getRelatedProducts = async (
    productId,
    limit = config.products.relatedLimit
) => {
    const product = await Product.findById(productId).lean();
    if (!product || !product.category) return [];
    return Product.find({
        category: product.category,
        _id: { $ne: productId },
    })
        .sort("-createdAt")
        .limit(limit)
        .populate("category")
        .lean();
};

// Add more product-related service functions as needed
