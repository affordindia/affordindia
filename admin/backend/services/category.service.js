import Category from "../models/category.model.js";
import {
    DEFAULT_CATEGORY_SKIP,
    DEFAULT_CATEGORY_LIMIT,
} from "../config/pagination.config.js";

export const createCategoryService = async (data) => {
    const category = new Category(data);
    return await category.save();
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
    return await Category.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteCategoryService = async (id) => {
    // Soft delete: set status to 'inactive'
    return await Category.findByIdAndUpdate(
        id,
        { status: "inactive" },
        { new: true }
    );
};
