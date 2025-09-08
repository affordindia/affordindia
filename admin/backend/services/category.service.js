import Category from "../models/category.model.js";
import Product from "../models/product.model.js";
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
    await category.populate("parentCategory", "name");
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
        .populate("parentCategory", "name")
        .sort({ order: 1, name: 1 })
        .skip(options.skip !== undefined ? options.skip : DEFAULT_CATEGORY_SKIP)
        .limit(
            options.limit !== undefined ? options.limit : DEFAULT_CATEGORY_LIMIT
        );
};

export const getCategoryByIdService = async (id) => {
    return await Category.findById(id).populate("parentCategory", "name");
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
        // Prevent circular reference: check if the parent is not a descendant of this category
        const isCircular = await checkCircularReference(
            id,
            updateData.parentCategory
        );
        if (isCircular) {
            return {
                error: "Cannot set parent category: this would create a circular reference",
            };
        }
    }
    const category = await Category.findByIdAndUpdate(id, updateData, {
        new: true,
    }).populate("parentCategory", "name");
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

export const deleteCategoryService = async (id) => {
    // Check if category has subcategories
    const subcategories = await Category.find({ parentCategory: id });
    if (subcategories.length > 0) {
        return {
            error: "Cannot delete category that has subcategories. Delete subcategories first or reassign them.",
        };
    }

    // Check if category has products
    const productsInCategory = await Product.find({ category: id });
    if (productsInCategory.length > 0) {
        return {
            error: `Cannot delete category that contains ${productsInCategory.length} product(s). Move or delete products first.`,
        };
    }
    
    // Check if this category is used as a subcategory in any products
    const productsWithSubcategory = await Product.find({ subcategories: id });
    if (productsWithSubcategory.length > 0) {
        return {
            error: `Cannot delete category that is used as subcategory in ${productsWithSubcategory.length} product(s). Remove from products first.`,
        };
    }

    const deleted = await Category.findByIdAndDelete(id);
    return { deleted };
};

// Helper function to check for circular references
const checkCircularReference = async (categoryId, parentId) => {
    if (categoryId.toString() === parentId.toString()) {
        return true; // Direct circular reference
    }

    const parent = await Category.findById(parentId);
    if (!parent || !parent.parentCategory) {
        return false; // No parent, no circular reference
    }

    // Recursively check up the parent chain
    return await checkCircularReference(categoryId, parent.parentCategory);
};

// Get category hierarchy tree
export const getCategoryTreeService = async () => {
    const categories = await Category.find({ status: "active" })
        .populate("parentCategory", "name")
        .sort({ order: 1, name: 1 });

    // Build tree structure
    const categoryMap = new Map();
    const rootCategories = [];

    // First pass: create map of all categories
    categories.forEach((cat) => {
        categoryMap.set(cat._id.toString(), {
            ...cat.toObject(),
            children: [],
        });
    });

    // Second pass: build parent-child relationships
    categories.forEach((cat) => {
        if (cat.parentCategory) {
            const parent = categoryMap.get(cat.parentCategory._id.toString());
            if (parent) {
                parent.children.push(categoryMap.get(cat._id.toString()));
            }
        } else {
            rootCategories.push(categoryMap.get(cat._id.toString()));
        }
    });

    return rootCategories;
};

// Get all subcategories of a parent category
export const getSubcategoriesService = async (parentId) => {
    return await Category.find({
        parentCategory: parentId,
        status: "active",
    }).sort({ order: 1, name: 1 });
};

// Get all parent categories (categories without a parent)
export const getParentCategoriesService = async () => {
    return await Category.find({
        parentCategory: { $exists: false },
        status: "active",
    }).sort({ order: 1, name: 1 });
};

// Get category path (breadcrumb)
export const getCategoryPathService = async (categoryId) => {
    const path = [];
    let currentCategory = await Category.findById(categoryId).populate(
        "parentCategory"
    );

    while (currentCategory) {
        path.unshift({
            _id: currentCategory._id,
            name: currentCategory.name,
        });

        if (currentCategory.parentCategory) {
            currentCategory = await Category.findById(
                currentCategory.parentCategory._id
            ).populate("parentCategory");
        } else {
            currentCategory = null;
        }
    }

    return path;
};

// Get category usage statistics
export const getCategoryUsageService = async (categoryId) => {
    const subcategoriesCount = await Category.countDocuments({ parentCategory: categoryId });
    const productsInCategoryCount = await Product.countDocuments({ category: categoryId });
    const productsWithSubcategoryCount = await Product.countDocuments({ subcategories: categoryId });
    
    return {
        subcategoriesCount,
        productsInCategoryCount,
        productsWithSubcategoryCount,
        totalProducts: productsInCategoryCount + productsWithSubcategoryCount,
        canDelete: subcategoriesCount === 0 && productsInCategoryCount === 0 && productsWithSubcategoryCount === 0
    };
};
