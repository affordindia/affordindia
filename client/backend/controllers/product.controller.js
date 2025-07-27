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

        // We'll filter by discounted price in-memory after fetching products
        const { products, totalCount } = await getProducts(filter, {
            skip,
            limit,
            sort,
        });

        // Calculate discounted price for each product
        const productsWithDiscount = products.map((product) => {
            const discount = product.discount || 0;
            const discountedPrice = discount > 0
                ? Math.round(product.price * (1 - discount / 100))
                : product.price;
            return { ...product, discountedPrice };
        });

        // Filter by discounted price if requested
        let filteredProducts = productsWithDiscount;
        if (req.query.minPrice || req.query.maxPrice) {
            filteredProducts = filteredProducts.filter((product) => {
                const price = product.discountedPrice;
                if (req.query.minPrice && price < Number(req.query.minPrice)) return false;
                if (req.query.maxPrice && price > Number(req.query.maxPrice)) return false;
                return true;
            });
        }

        // Sort by discounted price if requested
        if (req.query.sort === "price") {
            filteredProducts = filteredProducts.sort((a, b) => a.discountedPrice - b.discountedPrice);
        } else if (req.query.sort === "-price") {
            filteredProducts = filteredProducts.sort((a, b) => b.discountedPrice - a.discountedPrice);
        }

        res.json({
            page,
            limit,
            count: filteredProducts.length,
            totalCount,
            products: filteredProducts,
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
