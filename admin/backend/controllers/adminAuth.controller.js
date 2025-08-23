import {
    createAdminUserService,
    authenticateAdminService,
    generateAuthTokensService,
    getAdminByIdService,
    updateAdminProfileService,
    getAllAdminsService,
    updateAdminUserService,
    deleteAdminUserService,
} from "../services/adminAuth.service.js";
import {
    verifyRefreshToken,
    setTokenCookies,
    clearTokenCookies,
    REFRESH_TOKEN_COOKIE,
} from "../utils/jwt.util.js";
import {
    getUserPermissionSummary,
    getPermissionsByCategory,
} from "../utils/permissions.util.js";

// Admin login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // Authenticate admin
        const adminData = await authenticateAdminService(email, password);

        // Generate tokens
        const { accessToken, refreshToken } =
            generateAuthTokensService(adminData);

        // Set cookies
        setTokenCookies(res, accessToken, refreshToken);

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                admin: adminData,
            },
        });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

// Admin register (only accessible by level 4+ admins)
export const adminRegister = async (req, res) => {
    try {
        const { name, email, password, accessLevel } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email, and password are required",
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long",
            });
        }

        // Create admin user
        const newAdmin = await createAdminUserService(
            { name, email, password, accessLevel },
            req.admin.adminId
        );

        res.status(201).json({
            success: true,
            message: "Admin user created successfully",
            data: {
                admin: newAdmin,
            },
        });
    } catch (error) {
        console.error("Admin register error:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Refresh access token
export const refreshToken = async (req, res) => {
    try {
        // Get refresh token from cookies
        const refreshTokenValue = req.cookies[REFRESH_TOKEN_COOKIE];

        if (!refreshTokenValue) {
            return res.status(401).json({
                success: false,
                message: "Refresh token not found",
            });
        }

        // Verify refresh token
        const tokenResult = verifyRefreshToken(refreshTokenValue);

        if (!tokenResult.success) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token",
            });
        }

        // Get admin data
        const adminData = await getAdminByIdService(tokenResult.data.adminId);

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } =
            generateAuthTokensService(adminData);

        // Set new cookies
        setTokenCookies(res, accessToken, newRefreshToken);

        res.status(200).json({
            success: true,
            message: "Token refreshed successfully",
        });
    } catch (error) {
        console.error("Token refresh error:", error);
        res.status(401).json({
            success: false,
            message: "Token refresh failed",
        });
    }
};

// Admin logout
export const adminLogout = async (req, res) => {
    try {
        // Clear token cookies
        clearTokenCookies(res);

        res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.error("Admin logout error:", error);
        res.status(500).json({
            success: false,
            message: "Logout failed",
        });
    }
};

// Get admin profile
export const getProfile = async (req, res) => {
    try {
        const admin = await getAdminByIdService(req.admin.adminId);

        res.status(200).json({
            success: true,
            message: "Profile retrieved successfully",
            data: {
                admin,
            },
        });
    } catch (error) {
        console.error("Get profile error:", error);
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

// Update admin profile
export const updateProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        const updatedAdmin = await updateAdminProfileService(
            req.admin.adminId,
            { name, email }
        );

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                admin: updatedAdmin,
            },
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Get all admins (level 4+ only)
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await getAllAdminsService();

        res.status(200).json({
            success: true,
            message: "Admins retrieved successfully",
            data: {
                admins,
                total: admins.length,
            },
        });
    } catch (error) {
        console.error("Get all admins error:", error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Get admin by ID (level 4+ only)
export const getAdminById = async (req, res) => {
    try {
        const { id } = req.params;
        const admin = await getAdminByIdService(id);

        res.status(200).json({
            success: true,
            message: "Admin retrieved successfully",
            data: {
                admin,
            },
        });
    } catch (error) {
        console.error("Get admin by ID error:", error);
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

// Update admin (level 4+ only)
export const updateAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedAdmin = await updateAdminUserService(
            id,
            updateData,
            req.admin.adminId
        );

        res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            data: {
                admin: updatedAdmin,
            },
        });
    } catch (error) {
        console.error("Update admin error:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Delete admin (level 5 only)
export const deleteAdmin = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await deleteAdminUserService(id);

        res.status(200).json({
            success: true,
            message: result.message,
        });
    } catch (error) {
        console.error("Delete admin error:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Toggle admin status (level 4+ only)
export const toggleAdminStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        if (typeof isActive !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "isActive must be a boolean value",
            });
        }

        const updatedAdmin = await updateAdminUserService(
            id,
            { isActive },
            req.admin.adminId
        );

        res.status(200).json({
            success: true,
            message: `Admin ${
                isActive ? "activated" : "deactivated"
            } successfully`,
            data: {
                admin: updatedAdmin,
            },
        });
    } catch (error) {
        console.error("Toggle admin status error:", error);
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Get admin permissions
export const getAdminPermissions = async (req, res) => {
    try {
        const permissionSummary = getUserPermissionSummary(
            req.admin.accessLevel
        );

        res.status(200).json({
            success: true,
            message: "Permissions retrieved successfully",
            data: permissionSummary,
        });
    } catch (error) {
        console.error("Get permissions error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve permissions",
        });
    }
};

// Get all available permissions (superadmin only)
export const getAllPermissions = async (req, res) => {
    try {
        const permissionsByCategory = getPermissionsByCategory();

        res.status(200).json({
            success: true,
            message: "All permissions retrieved successfully",
            data: {
                permissionsByCategory,
                totalCategories: Object.keys(permissionsByCategory).length,
                totalPermissions: Object.values(permissionsByCategory).flat()
                    .length,
            },
        });
    } catch (error) {
        console.error("Get all permissions error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve all permissions",
        });
    }
};

// Get all RBAC config for frontend
export const getAllRBACConfig = async (req, res) => {
    try {
        // Import directly to avoid circular dependency
        const { ACCESS_LEVELS, PERMISSIONS } = await import("../config/rbac.config.js");
        res.status(200).json({
            success: true,
            message: "RBAC config fetched successfully",
            data: {
                accessLevels: ACCESS_LEVELS,
                permissions: PERMISSIONS,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch RBAC config",
        });
    }
};
