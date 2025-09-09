import express from "express";
import {
    getAllCategories,
    getCategoriesWithHierarchy,
    getRootCategories,
    getSubcategories,
    getAllSubcategories,
} from "../controllers/category.controller.js";

const router = express.Router();

// GET /api/categories - Get all categories (backward compatibility)
router.get("/", getAllCategories);

// GET /api/categories/hierarchy - Get categories with hierarchy
router.get("/hierarchy", getCategoriesWithHierarchy);

// GET /api/categories/root - Get root categories only
router.get("/root", getRootCategories);

// GET /api/categories/subcategories/all - Get all subcategories
router.get("/subcategories/all", getAllSubcategories);

// GET /api/categories/:parentId/subcategories - Get subcategories by parent
router.get("/:parentId/subcategories", getSubcategories);

export default router;
