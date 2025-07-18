import express from "express";
import { getAllUsers, getUserById } from "../controllers/user.controller.js";
import adminAuth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(adminAuth);

router.get("/", getAllUsers);
router.get("/:id", getUserById);

export default router;
