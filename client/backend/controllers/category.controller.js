import Category from "../models/category.model.js";

// Get all categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find({ status: "active" }).sort({
            order: 1,
            name: 1,
        });
        res.json({ categories });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch categories" });
    }
};

// Get categories with hierarchy (root categories and their subcategories)
export const getCategoriesWithHierarchy = async (req, res) => {
    try {
        // Get all active categories
        const allCategories = await Category.find({ status: "active" })
            .populate("parentCategory")
            .sort({ order: 1, name: 1 })
            .lean();

        // Separate root categories and subcategories
        const rootCategories = allCategories.filter(
            (cat) => !cat.parentCategory
        );
        const subcategories = allCategories.filter((cat) => cat.parentCategory);

        // Build hierarchy
        const hierarchy = rootCategories.map((root) => ({
            ...root,
            subcategories: subcategories.filter(
                (sub) =>
                    sub.parentCategory._id.toString() === root._id.toString()
            ),
        }));

        res.json({
            categories: hierarchy,
            totalCategories: allCategories.length,
            rootCount: rootCategories.length,
            subcategoryCount: subcategories.length,
        });
    } catch (err) {
        console.error("Error fetching categories with hierarchy:", err);
        res.status(500).json({
            error: "Failed to fetch categories with hierarchy",
        });
    }
};

// Get root categories only
export const getRootCategories = async (req, res) => {
    try {
        const rootCategories = await Category.find({
            status: "active",
            parentCategory: { $exists: false },
        }).sort({ order: 1, name: 1 });

        res.json({ categories: rootCategories });
    } catch (err) {
        console.error("Error fetching root categories:", err);
        res.status(500).json({ error: "Failed to fetch root categories" });
    }
};

// Get subcategories by parent category ID
export const getSubcategories = async (req, res) => {
    try {
        const { parentId } = req.params;

        const subcategories = await Category.find({
            status: "active",
            parentCategory: parentId,
        }).sort({ order: 1, name: 1 });

        res.json({
            parentId,
            subcategories,
            count: subcategories.length,
        });
    } catch (err) {
        console.error("Error fetching subcategories:", err);
        res.status(500).json({ error: "Failed to fetch subcategories" });
    }
};

// Get all subcategories (for preloading)
export const getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await Category.find({
            status: "active",
            parentCategory: { $exists: true },
        })
            .populate("parentCategory", "name")
            .sort({ order: 1, name: 1 });

        res.json({
            subcategories,
            count: subcategories.length,
        });
    } catch (err) {
        console.error("Error fetching all subcategories:", err);
        res.status(500).json({ error: "Failed to fetch all subcategories" });
    }
};
