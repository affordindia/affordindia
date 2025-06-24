import {
    createCategoryService,
    getAllCategoriesService,
    getCategoryByIdService,
    updateCategoryService,
    deleteCategoryService,
} from "../services/category.service.js";
import { uploadToCloudinary } from "../services/upload.service.js";
import {
    DEFAULT_CATEGORY_SKIP,
    DEFAULT_CATEGORY_LIMIT,
} from "../config/pagination.config.js";

export const createCategory = async (req, res) => {
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
        const categoryData = imageUrl
            ? { ...req.body, image: imageUrl }
            : req.body;
        const category = await createCategoryService(categoryData);
        res.status(201).json(category);
    } catch (error) {
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
        const category = await updateCategoryService(req.params.id, updateData);
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

export const deleteCategory = async (req, res) => {
    try {
        const category = await deleteCategoryService(req.params.id);
        if (!category)
            return res.status(404).json({ message: "Category not found" });
        res.json({ message: "Category deleted (status set to inactive)" });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete category",
            error: error.message,
        });
    }
};
