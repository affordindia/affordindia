import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    removeProductImage,
    updateProductStock,
    updateProductFeature,
    addProductReview,
    getProductReviews,
    deleteProductReview,
    getProductAnalytics,
} from "../services/product.service.js";
import { uploadToCloudinary } from "../services/upload.service.js";
import { DEFAULT_SKIP, DEFAULT_LIMIT } from "../config/pagination.config.js";

export const createProduct = async (req, res) => {
    try {
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
        const product = await createProduct(productData);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create product",
            error: error.message,
        });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        // Support search/filter/pagination via query params
        const filter = {
            search: req.query.search,
            category: req.query.category,
            minPrice: req.query.minPrice,
            maxPrice: req.query.maxPrice,
            isFeatured: req.query.isFeatured,
        };
        const options = {
            skip: req.query.skip ? parseInt(req.query.skip) : DEFAULT_SKIP,
            limit: req.query.limit ? parseInt(req.query.limit) : DEFAULT_LIMIT,
            sort: req.query.sort ? JSON.parse(req.query.sort) : {},
        };
        const products = await getAllProducts(filter, options);
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
        const product = await getProductById(req.params.id);
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
        const product = await updateProduct(req.params.id, updateData);
        if (!product)
            return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update product",
            error: error.message,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await deleteProduct(req.params.id);
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
        const product = await removeProductImage(req.params.id, imageUrl);
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
        const product = await updateProductStock(req.params.id, stock);
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
        const { isFeatured } = req.body;
        const product = await updateProductFeature(req.params.id, isFeatured);
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
        const review = await addProductReview(req.params.id, req.body);
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
        const reviews = await getProductReviews(req.params.id);
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
        const product = await deleteProductReview(
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
        const analytics = await getProductAnalytics(req.params.id);
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
