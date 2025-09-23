import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if it's an access token
        if (decoded.type !== "access") {
            return res.status(401).json({
                success: false,
                message: "Invalid token type. Access token required.",
            });
        }

        // Find user to ensure they still exist and are not blocked
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Account is blocked. Please contact support.",
            });
        }

        // Add user info to request object
        req.user = {
            _id: user._id,
            name: user.name, // Include name (may be null)
            phone: user.phone,
            email: user.email,
            authMethod: user.authMethod,
        };

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        // Only log unexpected errors
        console.error("Auth middleware error:", error);

        res.status(500).json({
            success: false,
            message: "Authentication failed",
            error: error.message,
        });
    }
};

export default authMiddleware;
