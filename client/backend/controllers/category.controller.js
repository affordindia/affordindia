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
