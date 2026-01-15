import {
    createProduct as createProductService,
    getAllProducts as getAllProductsService,
    getProductById as getProductByIdService,
    updateProduct as updateProductService,
    deleteProduct as deleteProductService,
    removeProductImage as removeProductImageService,
    updateProductStock as updateProductStockService,
    updateProductFeature as updateProductFeatureService,
    addProductReview as addProductReviewService,
    getProductReviews as getProductReviewsService,
    deleteProductReview as deleteProductReviewService,
    getProductAnalytics as getProductAnalyticsService,
    getLowStockProducts as getLowStockProductsService,
    bulkUpdateStock as bulkUpdateStockService,
    getProductsByCategoryTree,
    getProductsBySubcategory,
} from "../services/product.service.js";
import { uploadToCloudinary } from "../services/upload.service.js";
import { DEFAULT_SKIP, DEFAULT_LIMIT } from "../config/pagination.config.js";
import Product from "../models/product.model.js";
import { convertToBoolean } from "../utils/form.util.js";

export const createProduct = async (req, res) => {
    try {
        // Handle subcategories array from FormData
        if (req.body["subcategories[]"]) {
            req.body.subcategories = Array.isArray(req.body["subcategories[]"])
                ? req.body["subcategories[]"]
                : [req.body["subcategories[]"]];
            delete req.body["subcategories[]"];
        }

        // Handle dimensions object from FormData
        if (req.body["dimensions[length]"] !== undefined) {
            req.body.dimensions = {
                length: parseFloat(req.body["dimensions[length]"]) || 10,
                breadth: parseFloat(req.body["dimensions[breadth]"]) || 10,
                height: parseFloat(req.body["dimensions[height]"]) || 5,
                weight: parseFloat(req.body["dimensions[weight]"]) || 0.5
            };
            delete req.body["dimensions[length]"];
            delete req.body["dimensions[breadth]"];
            delete req.body["dimensions[height]"];
            delete req.body["dimensions[weight]"];
        }

        // Check for duplicate before uploading images
        const { name, category, subcategories } = req.body;
        const existing = await Product.findOne({ name, category });
        if (existing) {
            return res.status(400).json({
                message:
                    "A product with this name already exists in this category.",
            });
        }
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            // Upload each file to Cloudinary
            const uploadPromises = req.files.map((file) =>
                uploadToCloudinary(
                    `data:${file.mimetype};base64,${file.buffer.toString(
                        "base64"
                    )}`
                )
            );
            const uploadResults = await Promise.all(uploadPromises);
            imageUrls = uploadResults.map((result) => result.secure_url);
        }
        const productData = { ...req.body, images: imageUrls };

        // Convert checkbox values to boolean
        if (productData.isFeatured !== undefined) {
            productData.isFeatured = convertToBoolean(productData.isFeatured);
        }
        if (productData.isReturnable !== undefined) {
            productData.isReturnable = convertToBoolean(
                productData.isReturnable
            );
        }

        const product = await createProductService(productData);
        res.status(201).json(product);
    } catch (error) {
        console.error("❌ Product Creation Error:", error.message);
        console.error("❌ Full Error:", error);
        // Handle duplicate key error from MongoDB
        if (error.code === 11000) {
            return res.status(400).json({
                message:
                    "A product with this name already exists in this category.",
            });
        }
        res.status(500).json({
            message: "Failed to create product",
            error: error.message,
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        // Handle subcategories array from query params
        let subcategories =
            req.query.subcategories || req.query["subcategories[]"];
        if (subcategories) {
            // If it's a single value, convert to array
            if (!Array.isArray(subcategories)) {
                subcategories = [subcategories];
            }
        }

        // Support search/filter/pagination via query params
        const filter = {
            search: req.query.search,
            category: req.query.category,
            subcategories: subcategories,
            minPrice: req.query.minPrice,
            maxPrice: req.query.maxPrice,
            isFeatured: req.query.isFeatured,
            inStock: req.query.inStock,
            lowStock: req.query.lowStock,
            minStock: req.query.minStock,
            maxStock: req.query.maxStock,
            minRating: req.query.minRating,
            maxRating: req.query.maxRating,
            hasReviews: req.query.hasReviews,
            minReviews: req.query.minReviews,
            minSales: req.query.minSales,
            maxSales: req.query.maxSales,
            minViews: req.query.minViews,
            hasDiscount: req.query.hasDiscount,
            minDiscount: req.query.minDiscount,
            maxDiscount: req.query.maxDiscount,
        };

        const options = {
            skip: req.query.skip ? parseInt(req.query.skip) : DEFAULT_SKIP,
            limit: req.query.limit ? parseInt(req.query.limit) : DEFAULT_LIMIT,
            sort: req.query.sort
                ? JSON.parse(req.query.sort)
                : { createdAt: -1 },
        };
        const products = await getAllProductsService(filter, options);
        res.json(products);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message,
        });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await getProductByIdService(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch product",
            error: error.message,
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        // Handle subcategories array from FormData
        if (req.body["subcategories[]"]) {
            req.body.subcategories = Array.isArray(req.body["subcategories[]"])
                ? req.body["subcategories[]"]
                : [req.body["subcategories[]"]];
            delete req.body["subcategories[]"];
        }

        // Handle dimensions object from FormData
        if (req.body["dimensions[length]"] !== undefined) {
            req.body.dimensions = {
                length: parseFloat(req.body["dimensions[length]"]) || 10,
                breadth: parseFloat(req.body["dimensions[breadth]"]) || 10,
                height: parseFloat(req.body["dimensions[height]"]) || 5,
                weight: parseFloat(req.body["dimensions[weight]"]) || 0.5
            };
            delete req.body["dimensions[length]"];
            delete req.body["dimensions[breadth]"];
            delete req.body["dimensions[height]"];
            delete req.body["dimensions[weight]"];
        }

        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            const uploadPromises = req.files.map((file) =>
                uploadToCloudinary(
                    `data:${file.mimetype};base64,${file.buffer.toString(
                        "base64"
                    )}`
                )
            );
            const uploadResults = await Promise.all(uploadPromises);
            imageUrls = uploadResults.map((result) => result.secure_url);
        }
        const updateData =
            imageUrls.length > 0
                ? { ...req.body, images: imageUrls }
                : req.body;

        // Convert checkbox values to boolean
        if (updateData.isFeatured !== undefined) {
            updateData.isFeatured = convertToBoolean(updateData.isFeatured);
        }
        if (updateData.isReturnable !== undefined) {
            updateData.isReturnable = convertToBoolean(updateData.isReturnable);
        }

        const product = await updateProductService(req.params.id, updateData);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        console.error("❌ Product Update Error:", error.message);
        console.error("❌ Full Error:", error);
        res.status(500).json({
            message: "Failed to update product",
            error: error.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await deleteProductService(req.params.id);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json({ message: "Product deleted" });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete product",
            error: error.message,
        });
    }
};

export const removeProductImage = async (req, res) => {
    try {
        const { imageUrl } = req.body;
        const product = await removeProductImageService(
            req.params.id,
            imageUrl
        );
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: "Failed to remove image",
            error: error.message,
        });
    }
};

export const updateProductStock = async (req, res) => {
    try {
        const { stock } = req.body;
        const product = await updateProductStockService(req.params.id, stock);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update stock",
            error: error.message,
        });
    }
};

export const updateProductFeature = async (req, res) => {
    try {
        let { isFeatured } = req.body;

        // Convert checkbox values to boolean
        if (isFeatured !== undefined) {
            isFeatured = convertToBoolean(isFeatured);
        }

        const product = await updateProductFeatureService(
            req.params.id,
            isFeatured
        );
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update feature status",
            error: error.message,
        });
    }
};

export const addProductReview = async (req, res) => {
    try {
        const review = await addProductReviewService(req.params.id, req.body);
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({
            message: "Failed to add review",
            error: error.message,
        });
    }
};

export const getProductReviews = async (req, res) => {
    try {
        const reviews = await getProductReviewsService(req.params.id);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch reviews",
            error: error.message,
        });
    }
};

export const deleteProductReview = async (req, res) => {
    try {
        const product = await deleteProductReviewService(
            req.params.id,
            req.params.reviewId
        );
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete review",
            error: error.message,
        });
    }
};

export const getProductAnalytics = async (req, res) => {
    try {
        const analytics = await getProductAnalyticsService(req.params.id);
        if (!analytics)
            return res.status(404).json({ message: "Product not found" });
        res.json(analytics);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch analytics",
            error: error.message,
        });
    }
};

// Get low stock products
export const getLowStockProducts = async (req, res) => {
    try {
        const { threshold = 10, limit = 20 } = req.query;

        const products = await getLowStockProductsService(threshold, limit);

        res.json({
            success: true,
            products,
            count: products.length,
            threshold: parseInt(threshold),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch low stock products",
            error: error.message,
        });
    }
};

// Bulk stock update
export const bulkUpdateStock = async (req, res) => {
    try {
        const { updates } = req.body; // Array of {productId, stock}

        if (!Array.isArray(updates) || updates.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please provide valid stock updates",
            });
        }

        const result = await bulkUpdateStockService(updates);

        res.json({
            success: true,
            message: `Successfully updated ${result.modifiedCount} products`,
            ...result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update stock",
            error: error.message,
        });
    }
};

export const getProductsByCategoryHierarchy = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const options = {
            skip: req.query.skip ? parseInt(req.query.skip) : DEFAULT_SKIP,
            limit: req.query.limit ? parseInt(req.query.limit) : DEFAULT_LIMIT,
            sort: req.query.sort
                ? JSON.parse(req.query.sort)
                : { createdAt: -1 },
        };

        const result = await getProductsByCategoryTree(categoryId, options);

        res.json({
            success: true,
            ...result,
            message: `Found ${result.products.length} products in category hierarchy`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products by category hierarchy",
            error: error.message,
        });
    }
};

export const getProductsBySubcategoryController = async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        const options = {
            skip: req.query.skip ? parseInt(req.query.skip) : DEFAULT_SKIP,
            limit: req.query.limit ? parseInt(req.query.limit) : DEFAULT_LIMIT,
            sort: req.query.sort
                ? JSON.parse(req.query.sort)
                : { createdAt: -1 },
        };

        const result = await getProductsBySubcategory(subcategoryId, options);

        res.json({
            success: true,
            ...result,
            message: `Found ${result.products.length} products in subcategory`,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch products by subcategory",
            error: error.message,
        });
    }
};
