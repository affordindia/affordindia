import { Router } from "express";
import upload from "../middlewares/upload.middleware.js";
import {
    verifyAdminAuth,
    requirePermission,
} from "../middlewares/adminAuth.middleware.js";
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    disableCategory,
    restoreCategory,
    deleteCategory,
} from "../controllers/category.controller.js";

const router = Router();

router.use(verifyAdminAuth);

// Category CRUD operations
router.post(
    "/",
    requirePermission("categories.create"),
    upload.single("image"),
    createCategory
);
router.get("/", requirePermission("categories.view"), getAllCategories);
router.get("/:id", requirePermission("categories.view"), getCategoryById);
router.put(
    "/:id",
    requirePermission("categories.update"),
    upload.single("image"),
    updateCategory
);
router.patch(
    "/:id/disable",
    requirePermission("categories.update"),
    disableCategory
);
router.patch(
    "/:id/restore",
    requirePermission("categories.update"),
    restoreCategory
);
router.delete(
    "/:id/delete",
    requirePermission("categories.delete"),
    deleteCategory
);

export default router;
