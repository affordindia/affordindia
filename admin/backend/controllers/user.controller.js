import {
    getAllUsersService,
    getUserByIdService,
    blockUserService,
    unblockUserService,
    deleteUserService,
    getUserStatsService,
} from "../services/user.service.js";

// Get all users
export const getAllUsers = async (req, res) => {
    try {
        const { page, limit, sort, ...filter } = req.query;
        const options = {
            sort: sort || "-createdAt",
            skip: req.query.skip !== undefined ? parseInt(req.query.skip) : 0,
            limit: limit !== undefined ? parseInt(limit) : 50,
        };
        const users = await getAllUsersService(filter, options);
        res.json({
            success: true,
            users,
        });
    } catch (err) {
        console.error("Get all users error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: err.message,
        });
    }
};

// Get user by ID with extended information
export const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserByIdService(id);
        
        res.json({
            success: true,
            user,
        });
    } catch (err) {
        console.error("Get user by ID error:", err);
        const statusCode = err.message === "User not found" ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: err.message === "User not found" ? "User not found" : "Failed to fetch user",
            error: err.message,
        });
    }
};

// Block user
export const blockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;

        const user = await blockUserService(id, reason);

        res.json({
            success: true,
            message: "User blocked successfully",
            user,
        });
    } catch (err) {
        console.error("Block user error:", err);
        const statusCode = err.message === "User not found" ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: err.message === "User not found" ? "User not found" : "Failed to block user",
            error: err.message,
        });
    }
};

// Unblock user
export const unblockUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await unblockUserService(id);

        res.json({
            success: true,
            message: "User unblocked successfully",
            user,
        });
    } catch (err) {
        console.error("Unblock user error:", err);
        const statusCode = err.message === "User not found" ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: err.message === "User not found" ? "User not found" : "Failed to unblock user",
            error: err.message,
        });
    }
};

// Delete user (soft delete by default, hard delete with query param)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { hardDelete = false } = req.query;

        const result = await deleteUserService(id, hardDelete === "true");

        res.json({
            success: true,
            message: hardDelete === "true" 
                ? "User and all associated data deleted permanently"
                : "User account deactivated successfully",
            ...result,
        });
    } catch (err) {
        console.error("Delete user error:", err);
        const statusCode = err.message === "User not found" ? 404 : 500;
        res.status(statusCode).json({
            success: false,
            message: err.message === "User not found" ? "User not found" : "Failed to delete user",
            error: err.message,
        });
    }
};

// Get user statistics
export const getUserStats = async (req, res) => {
    try {
        const stats = await getUserStatsService();

        res.json({
            success: true,
            stats,
        });
    } catch (err) {
        console.error("Get user stats error:", err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch user statistics",
            error: err.message,
        });
    }
};
