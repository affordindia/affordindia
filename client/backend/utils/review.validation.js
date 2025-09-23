import { body } from "express-validator";
import { validationResult } from "express-validator";

// Basic validation for review creation

export const validateCreateReview = [
    body("rating")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),

    body("comment")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Comment is too long"),
];

// Basic validation for review update

export const validateUpdateReview = [
    body("rating")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5"),

    body("comment")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Comment is too long"),
];

// Validation for file uploads

export const validateImageUpload = (req, res, next) => {
    if (req.files && req.files.length > 5) {
        return res.status(400).json({
            success: false,
            message: "Maximum 5 images allowed per review",
        });
    }
    next();
};

// Simple validation error handler

export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Invalid input",
            errors: errors.array().map((error) => error.msg),
        });
    }

    next();
};
