import {
    verifyAccessToken,
    ACCESS_TOKEN_COOKIE,
    REFRESH_TOKEN_COOKIE,
} from "../utils/jwt.util.js";
import {
    hasAccess,
    hasPermission,
    getPermissionLevel,
} from "../config/rbac.config.js";

// Verify admin authentication
export const verifyAdminAuth = async (req, res, next) => {
    try {
        // Get access token from cookies
        const accessToken = req.cookies[ACCESS_TOKEN_COOKIE];

        if (!accessToken) {
            return res.status(401).json({
                success: false,
                message: "Access token not found. Please login.",
            });
        }

        // Verify access token
        const tokenResult = verifyAccessToken(accessToken);

        if (!tokenResult.success) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired access token",
            });
        }

        // Add admin data to request
        req.admin = {
            adminId: tokenResult.data.adminId,
            email: tokenResult.data.email,
            accessLevel: tokenResult.data.accessLevel,
        };

        next();
    } catch (error) {
        console.error("Auth verification error:", error);
        return res.status(500).json({
            success: false,
            message: "Authentication verification failed",
        });
    }
};

// Require specific permission (uses RBAC config)
export const requirePermission = (permission) => {
    return (req, res, next) => {
        try {
            if (!req.admin) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            const requiredLevel = getPermissionLevel(permission);

            if (!hasPermission(req.admin.accessLevel, permission)) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Required permission: '${permission}' (Level ${requiredLevel}), Current level: ${req.admin.accessLevel}`,
                });
            }

            next();
        } catch (error) {
            console.error("Permission check error:", error);
            return res.status(500).json({
                success: false,
                message: "Permission verification failed",
            });
        }
    };
};

// Require minimum access level (for backward compatibility)
export const requireAccessLevel = (minLevel) => {
    return (req, res, next) => {
        try {
            if (!req.admin) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication required",
                });
            }

            if (!hasAccess(req.admin.accessLevel, minLevel)) {
                return res.status(403).json({
                    success: false,
                    message: `Insufficient access level. Required: ${minLevel}, Current: ${req.admin.accessLevel}`,
                });
            }

            next();
        } catch (error) {
            console.error("Access level check error:", error);
            return res.status(500).json({
                success: false,
                message: "Access level verification failed",
            });
        }
    };
};

// Optional middleware - verify auth but don't fail if not authenticated
export const optionalAdminAuth = (req, res, next) => {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE];

    if (accessToken) {
        const tokenResult = verifyAccessToken(accessToken);
        if (tokenResult.success) {
            req.admin = {
                adminId: tokenResult.data.adminId,
                email: tokenResult.data.email,
                accessLevel: tokenResult.data.accessLevel,
            };
        }
    }

    next();
};

export default {
    verifyAdminAuth,
    requirePermission,
    requireAccessLevel,
    optionalAdminAuth,
};
