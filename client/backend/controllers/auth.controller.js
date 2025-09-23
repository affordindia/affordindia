import jwt from "jsonwebtoken";
import { admin } from "../config/firebase.config.js";
import User from "../models/user.model.js";

// Verify Firebase token and create/login user
export const verifyPhoneAuth = async (req, res) => {
    try {
        const { firebaseToken } = req.body; // Removed name parameter

        if (!firebaseToken) {
            return res.status(400).json({
                success: false,
                message: "Firebase token is required",
            });
        }

        // Verify Firebase token with Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(firebaseToken);

        // Extract phone number from Firebase token
        const phoneNumber = decodedToken.phone_number;
        const firebaseUid = decodedToken.uid;

        if (!phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "Phone number not found in Firebase token",
            });
        }

        // Check if user exists
        let user = await User.findOne({
            $or: [{ phone: phoneNumber }, { firebaseUid: firebaseUid }],
        });

        if (!user) {
            // Create new user for phone authentication - no name required for auth
            user = new User({
                phone: phoneNumber,
                firebaseUid: firebaseUid,
                authMethod: "phone",
                // name will be null initially, can be updated later via profile
            });

            await user.save();
        } else {
            // Existing user - update Firebase UID if not set
            if (!user.firebaseUid) {
                user.firebaseUid = firebaseUid;
                await user.save();
            }
        }

        // Check if user is blocked
        if (user.isBlocked) {
            return res.status(403).json({
                success: false,
                message: "Account is blocked. Please contact support.",
            });
        }

        // Generate access token (short-lived) and refresh token (long-lived)
        const accessToken = jwt.sign(
            {
                userId: user._id,
                phone: phoneNumber,
                authMethod: "phone",
                type: "access",
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // Short-lived access token
        );

        const refreshToken = jwt.sign(
            {
                userId: user._id,
                phone: phoneNumber,
                authMethod: "phone",
                type: "refresh",
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" } // Long-lived refresh token
        );

        res.json({
            success: true,
            message: "Authentication successful",
            token: accessToken,
            refreshToken: refreshToken,
            user: {
                id: user._id,
                name: user.name, // Include name (may be null for new users)
                phone: user.phone,
                authMethod: user.authMethod,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error("Phone authentication error:", error);

        if (error.code === "auth/id-token-expired") {
            return res.status(401).json({
                success: false,
                message: "Firebase token has expired",
            });
        }

        if (error.code === "auth/invalid-id-token") {
            return res.status(401).json({
                success: false,
                message: "Invalid Firebase token",
            });
        }

        res.status(500).json({
            success: false,
            message: "Authentication failed",
            error: error.message,
        });
    }
};

// Refresh JWT token
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token is required",
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Check if it's actually a refresh token
        if (decoded.type !== "refresh") {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
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
                message: "Account is blocked",
            });
        }

        // Generate new access token (short-lived)
        const newAccessToken = jwt.sign(
            {
                userId: user._id,
                phone: user.phone,
                authMethod: user.authMethod,
                type: "access",
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // Short-lived access token
        );

        // Optionally generate new refresh token (for token rotation)
        const newRefreshToken = jwt.sign(
            {
                userId: user._id,
                phone: user.phone,
                authMethod: user.authMethod,
                type: "refresh",
            },
            process.env.JWT_SECRET,
            { expiresIn: "30d" } // Long-lived refresh token
        );

        res.json({
            success: true,
            message: "Token refreshed successfully",
            token: newAccessToken,
            refreshToken: newRefreshToken,
            user: {
                id: user._id,
                name: user.name, // Include name (may be null)
                phone: user.phone,
                authMethod: user.authMethod,
            },
        });
    } catch (error) {
        console.error("Token refresh error:", error);

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Refresh token has expired",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token",
            });
        }

        res.status(500).json({
            success: false,
            message: "Token refresh failed",
            error: error.message,
        });
    }
};

// Get current user info
export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await User.findById(userId).select(
            "-password -firebaseUid"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name, // Include name (may be null)
                email: user.email,
                phone: user.phone,
                authMethod: user.authMethod,
                addresses: user.addresses,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (error) {
        console.error("Get current user error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get user information",
            error: error.message,
        });
    }
};
