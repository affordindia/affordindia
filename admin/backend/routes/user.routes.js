import express from "express";
import {
    getAllUsersController,
    getUserByIdController,
} from "../controllers/user.controller.js";
import adminAuth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(adminAuth);

router.get("/", getAllUsersController);
router.get("/:id", getUserByIdController);

export default router;
