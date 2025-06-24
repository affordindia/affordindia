import Category from "../models/category.model.js";
import {
    DEFAULT_CATEGORY_SKIP,
    DEFAULT_CATEGORY_LIMIT,
} from "../config/pagination.config.js";

export const createCategoryService = async (data) => {
    // Validation: name required
    if (!data.name || data.name.trim() === "") {
        return { error: "Category name is required" };
    }
    // Validation: unique name
    const existing = await Category.findOne({ name: data.name });
    if (existing) {
        return { error: "Category name must be unique" };
    }
    // Validation: parentCategory exists (if provided)
    if (data.parentCategory) {
        const parent = await Category.findById(data.parentCategory);
        if (!parent) {
            return { error: "Parent category does not exist" };
        }
    }
    const category = new Category(data);
    await category.save();
    return { category };
};

export const getAllCategoriesService = async (filter = {}, options = {}) => {
    const query = {};
    if (filter.status) query.status = filter.status;
    if (filter.parentCategory) query.parentCategory = filter.parentCategory;
    if (filter.search) {
        query.name = { $regex: filter.search, $options: "i" };
    }
    return await Category.find(query)
        .sort({ order: 1, name: 1 })
        .skip(options.skip !== undefined ? options.skip : DEFAULT_CATEGORY_SKIP)
        .limit(
            options.limit !== undefined ? options.limit : DEFAULT_CATEGORY_LIMIT
        );
};

export const getCategoryByIdService = async (id) => {
    return await Category.findById(id);
};

export const updateCategoryService = async (id, updateData) => {
    // Validation: name unique (if changed)
    if (updateData.name) {
        const existing = await Category.findOne({
            name: updateData.name,
            _id: { $ne: id },
        });
        if (existing) {
            return { error: "Category name must be unique" };
        }
    }
    // Validation: parentCategory exists (if provided)
    if (updateData.parentCategory) {
        const parent = await Category.findById(updateData.parentCategory);
        if (!parent) {
            return { error: "Parent category does not exist" };
        }
    }
    const category = await Category.findByIdAndUpdate(id, updateData, {
        new: true,
    });
    return { category };
};

export const disableCategoryService = async (id) => {
    // Soft delete: set status to 'inactive'
    const category = await Category.findByIdAndUpdate(
        id,
        { status: "inactive" },
        { new: true }
    );
    return { category };
};

export const restoreCategoryService = async (id) => {
    const category = await Category.findByIdAndUpdate(
        id,
        { status: "active" },
        { new: true }
    );
    return { category };
};

export const permanentDeleteCategoryService = async (id) => {
    // Optionally: handle orphaned subcategories or products here
    const deleted = await Category.findByIdAndDelete(id);
    return { deleted };
};
