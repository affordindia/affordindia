import {
    createCategoryService,
    getAllCategoriesService,
    getCategoryByIdService,
    updateCategoryService,
    disableCategoryService,
    restoreCategoryService,
    deleteCategoryService,
    getCategoryTreeService,
    getSubcategoriesService,
    getParentCategoriesService,
    getCategoryPathService,
    getCategoryUsageService,
} from "../services/category.service.js";
import { uploadToCloudinary } from "../services/upload.service.js";
import {
    DEFAULT_CATEGORY_SKIP,
    DEFAULT_CATEGORY_LIMIT,
} from "../config/pagination.config.js";
import Category from "../models/category.model.js";

export const createCategory = async (req, res) => {
    try {
        // Check for duplicate category by name before uploading image
        const { name } = req.body;
        const existing = await Category.findOne({ name });
        if (existing) {
            return res.status(400).json({
                message: "A category with this name already exists.",
            });
        }
        let imageUrl = undefined;
        if (req.file) {
            const uploadResult = await uploadToCloudinary(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString(
                    "base64"
                )}`,
                "categories"
            );
            imageUrl = uploadResult.secure_url;
        }
        const categoryData = imageUrl
            ? { ...req.body, image: imageUrl }
            : req.body;
        // All validation and DB logic handled in service
        const { error, category } = await createCategoryService(categoryData);
        if (error) {
            return res.status(400).json({ message: error });
        }
        res.status(201).json(category);
    } catch (error) {
        // Handle duplicate key error from MongoDB
        if (error.code === 11000) {
            return res.status(400).json({
                message: "A category with this name already exists.",
            });
        }
        res.status(500).json({
            message: "Failed to create category",
            error: error.message,
        });
    }
};

export const getAllCategories = async (req, res) => {
    try {
        const filter = {
            status: req.query.status,
            parentCategory: req.query.parentCategory,
            search: req.query.search,
        };
        const options = {
            skip: req.query.skip
                ? parseInt(req.query.skip)
                : DEFAULT_CATEGORY_SKIP,
            limit: req.query.limit
                ? parseInt(req.query.limit)
                : DEFAULT_CATEGORY_LIMIT,
        };
        const categories = await getAllCategoriesService(filter, options);
        res.json(categories);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch categories",
            error: error.message,
        });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await getCategoryByIdService(req.params.id);
        if (!category)
            return res.status(404).json({ message: "Category not found" });
        res.json(category);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch category",
            error: error.message,
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        let imageUrl = undefined;
        if (req.file) {
            const uploadResult = await uploadToCloudinary(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString(
                    "base64"
                )}`,
                "categories"
            );
            imageUrl = uploadResult.secure_url;
        }
        const updateData = imageUrl
            ? { ...req.body, image: imageUrl }
            : req.body;
        // All validation and DB logic handled in service
        const { error, category } = await updateCategoryService(
            req.params.id,
            updateData
        );
        if (error) {
            return res.status(400).json({ message: error });
        }
        if (!category)
            return res.status(404).json({ message: "Category not found" });
        res.json(category);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update category",
            error: error.message,
        });
    }
};

export const disableCategory = async (req, res) => {
    try {
        const { category } = await disableCategoryService(req.params.id);
        if (!category)
            return res.status(404).json({ message: "Category not found" });
        res.json({ message: "Category disabled (status set to inactive)" });
    } catch (error) {
        res.status(500).json({
            message: "Failed to disable category",
            error: error.message,
        });
    }
};

export const restoreCategory = async (req, res) => {
    try {
        const { error, category } = await restoreCategoryService(req.params.id);
        if (error) {
            return res.status(400).json({ message: error });
        }
        if (!category)
            return res.status(404).json({ message: "Category not found" });
        res.json({ message: "Category restored", category });
    } catch (error) {
        res.status(500).json({
            message: "Failed to restore category",
            error: error.message,
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const { error, deleted } = await deleteCategoryService(req.params.id);
        if (error) {
            return res.status(400).json({ message: error });
        }
        if (!deleted)
            return res.status(404).json({ message: "Category not found" });
        res.json({ message: "Category permanently deleted" });
    } catch (error) {
        res.status(500).json({
            message: "Failed to permanently delete category",
            error: error.message,
        });
    }
};

export const getCategoryTree = async (req, res) => {
    try {
        const tree = await getCategoryTreeService();
        res.json(tree);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch category tree",
            error: error.message,
        });
    }
};

export const getSubcategories = async (req, res) => {
    try {
        const subcategories = await getSubcategoriesService(req.params.id);
        res.json(subcategories);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch subcategories",
            error: error.message,
        });
    }
};

export const getParentCategories = async (req, res) => {
    try {
        const parentCategories = await getParentCategoriesService();
        res.json(parentCategories);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch parent categories",
            error: error.message,
        });
    }
};

export const getCategoryPath = async (req, res) => {
    try {
        const path = await getCategoryPathService(req.params.id);
        res.json(path);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch category path",
            error: error.message,
        });
    }
};

export const getCategoryUsage = async (req, res) => {
    try {
        const usage = await getCategoryUsageService(req.params.id);
        res.json(usage);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch category usage",
            error: error.message,
        });
    }
};
