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

        // Build MongoDB filter object
        const filter = {};

        // Single category filter (backward compatibility)
        if (req.query.category) {
            filter.category = req.query.category;
        }

        // Multiple categories filter - support both category names and IDs
        if (req.query.categories) {
            const categories = Array.isArray(req.query.categories)
                ? req.query.categories
                : req.query.categories.split(",").filter(Boolean);
            if (categories.length > 0) {
                // Check if they are ObjectIds or names
                const isObjectIds = categories.every((cat) =>
                    /^[0-9a-fA-F]{24}$/.test(cat.trim())
                );

                if (isObjectIds) {
                    filter.categoryIds = categories;
                } else {
                    filter.categoryNames = categories;
                }
            }
        }

        // Subcategories filter - support arrays
        if (req.query.subcategories) {
            let subcategories;
            if (Array.isArray(req.query.subcategories)) {
                subcategories = req.query.subcategories;
            } else if (typeof req.query.subcategories === "string") {
                subcategories = req.query.subcategories
                    .split(",")
                    .filter(Boolean);
            }

            if (subcategories && subcategories.length > 0) {
                filter.subcategories = { $in: subcategories };
            }
        }

        // Search filter
        if (req.query.search) {
            filter.name = { $regex: req.query.search, $options: "i" };
        }

        // Brand filter
        if (req.query.brand) {
            filter.brand = req.query.brand;
        }

        // Stock filter
        if (req.query.inStock === "true") {
            filter.stock = { $gt: 0 };
        }

        // Featured filter
        if (req.query.isFeatured === "true") {
            filter.isFeatured = true;
        }

        // Handle price range filtering first to get accurate count
        if (req.query.priceRanges) {
            const priceRangeIndices = Array.isArray(req.query.priceRanges)
                ? req.query.priceRanges.map((idx) => parseInt(idx))
                : req.query.priceRanges
                      .split(",")
                      .map((idx) => parseInt(idx))
                      .filter((idx) => !isNaN(idx));

            // Define price ranges (should match frontend)
            const priceRanges = [
                { min: 0, max: 500 },
                { min: 500, max: 1000 },
                { min: 1000, max: 5000 },
                { min: 5000, max: 10000 },
            ];

            if (priceRangeIndices.length > 0) {
                // For now, get all products first to filter by calculated price
                // TODO: Optimize this with database aggregation
                const { products: allProducts } = await getProducts(filter, {
                    sort,
                    skip: 0,
                    limit: 10000, // Get more products for price filtering
                });

                // Calculate discounted price and filter
                const productsWithDiscount = allProducts.map((product) => {
                    const discount = product.discount || 0;
                    const discountedPrice =
                        discount > 0
                            ? Math.round(product.price * (1 - discount / 100))
                            : product.price;
                    return { ...product, discountedPrice };
                });

                const priceFilteredProducts = productsWithDiscount.filter(
                    (product) => {
                        const price = product.discountedPrice;
                        return priceRangeIndices.some((idx) => {
                            const range = priceRanges[idx];
                            return (
                                range &&
                                price >= range.min &&
                                price <= range.max
                            );
                        });
                    }
                );

                // Apply pagination to filtered results
                const totalFiltered = priceFilteredProducts.length;
                const paginatedProducts = priceFilteredProducts.slice(
                    skip,
                    skip + limit
                );

                return res.json({
                    page,
                    limit,
                    count: paginatedProducts.length,
                    total: totalFiltered,
                    products: paginatedProducts,
                });
            }
        }

        // Fetch products with filter (no price range filtering)
        // Fetch products with filter (no price range filtering)
        const { products, totalCount } = await getProducts(filter, {
            skip,
            limit,
            sort,
        });

        // Calculate discounted price for each product
        const productsWithDiscount = products.map((product) => {
            const discount = product.discount || 0;
            const discountedPrice =
                discount > 0
                    ? Math.round(product.price * (1 - discount / 100))
                    : product.price;
            return { ...product, discountedPrice };
        });

        res.json({
            page,
            limit,
            count: productsWithDiscount.length,
            total: totalCount,
            products: productsWithDiscount,
        });
    } catch (err) {
        console.error("❌ Product listing error:", err);
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
