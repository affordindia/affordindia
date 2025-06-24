import { Router } from "express";
import upload from "../middlewares/upload.middleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    disableCategory,
    restoreCategory,
    permanentDeleteCategory,
} from "../controllers/category.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", upload.single("image"), createCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.put("/:id", upload.single("image"), updateCategory);
router.delete("/:id", deleteCategory);
router.patch("/:id/disable", disableCategory);
router.patch("/:id/restore", restoreCategory);
router.delete("/:id/permanent", permanentDeleteCategory);

export default router;
