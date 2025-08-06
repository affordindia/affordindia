import express from "express";
import {
    calculateShippingFee,
    getShippingConfiguration,
} from "../controllers/shipping.controller.js";

const router = express.Router();

// Calculate shipping fee for a given order amount
router.post("/calculate", calculateShippingFee);

// Get shipping configuration
router.get("/config", getShippingConfiguration);

export default router;
