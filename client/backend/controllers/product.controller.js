import {
    getProducts,
    getProductById,
    getFeaturedProducts,
    getNewProducts,
    getPopularProducts,
    getRelatedProducts,
} from "../services/product.service.js";
import config from "../config/server.config.js";

export const listProducts = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = Math.min(
            parseInt(req.query.limit, 10) || config.pagination.defaultLimit,
            config.pagination.maxLimit
        );
        const skip = (page - 1) * limit;
        const sort = req.query.sort || "-createdAt";
        // Advanced filters
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        if (req.query.search)
            filter.name = { $regex: req.query.search, $options: "i" };
        if (req.query.brand) filter.brand = req.query.brand;
        if (req.query.inStock === "true") filter.stock = { $gt: 0 };
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice)
                filter.price.$gte = Number(req.query.minPrice);
            if (req.query.maxPrice)
                filter.price.$lte = Number(req.query.maxPrice);
        }
        const { products, totalCount } = await getProducts(filter, {
            skip,
            limit,
            sort,
        });
        res.json({
            page,
            limit,
            count: products.length,
            totalCount,
            products,
        });
    } catch (err) {
        next(err);
    }
};

export const getProduct = async (req, res, next) => {
    try {
        const product = await getProductById(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        next(err);
    }
};

export const featuredProducts = async (req, res, next) => {
    try {
        const limit = Math.min(
            parseInt(req.query.limit, 10) || config.pagination.defaultLimit,
            config.pagination.maxLimit
        );
        const products = await getFeaturedProducts(limit);
        res.json({ count: products.length, products });
    } catch (err) {
        next(err);
    }
};

export const newProducts = async (req, res, next) => {
    try {
        const limit = Math.min(
            parseInt(req.query.limit, 10) || config.pagination.defaultLimit,
            config.pagination.maxLimit
        );
        const products = await getNewProducts(limit);
        res.json({ count: products.length, products });
    } catch (err) {
        next(err);
    }
};

export const popularProducts = async (req, res, next) => {
    try {
        const limit = Math.min(
            parseInt(req.query.limit, 10) || config.pagination.defaultLimit,
            config.pagination.maxLimit
        );
        const products = await getPopularProducts(limit);
        res.json({ count: products.length, products });
    } catch (err) {
        next(err);
    }
};

export const relatedProducts = async (req, res, next) => {
    try {
        const limit = Math.min(
            parseInt(req.query.limit, 10) || config.products.relatedLimit,
            config.pagination.maxLimit
        );
        const products = await getRelatedProducts(req.params.id, limit);
        res.json({ count: products.length, products });
    } catch (err) {
        next(err);
    }
};
