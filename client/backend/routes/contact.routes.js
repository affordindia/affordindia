import express from "express";
import {
    submitContactForm,
    checkEmailHealth,
} from "../controllers/contact.controller.js";

const router = express.Router();

// Submit contact form
router.post("/", submitContactForm);

// Health check for email service (for admin/monitoring)
router.get("/health", checkEmailHealth);

export default router;
