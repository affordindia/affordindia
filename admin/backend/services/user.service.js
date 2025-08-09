import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Review from "../models/review.model.js";
import mongoose from "mongoose";

// Get all users with optional filtering and pagination
export const getAllUsersService = async (filter = {}, options = {}) => {
    const users = await User.find(filter)
        .sort(options.sort || {})
        .skip(options.skip !== undefined ? options.skip : 0)
        .limit(options.limit !== undefined ? options.limit : 50)
        .select("-password");
    return users;
};

// Get a single user by ID with extended information
export const getUserByIdService = async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) {
        throw new Error("User not found");
    }

    // In Mongoose 8.x, use the userId string directly for most queries
    // For aggregation, convert to ObjectId using the correct method
    const userObjId = mongoose.Types.ObjectId.isValid(userId)
        ? new mongoose.Types.ObjectId(userId)
        : userId;

    const [orderCount, totalSpent, reviewCount, recentOrders] =
        await Promise.all([
            Order.countDocuments({ user: userId }),
            Order.aggregate([
                { $match: { user: userObjId, paymentStatus: "paid" } },
                { $group: { _id: null, total: { $sum: "$total" } } },
            ]),
            Review.countDocuments({ user: userId }),
            Order.find({ user: userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .select("orderNumber total status paymentStatus createdAt"),
        ]);

    return {
        ...user.toObject(),
        stats: {
            orderCount,
            totalSpent: totalSpent[0]?.total || 0,
            reviewCount,
            joinedDate: user.createdAt,
        },
        recentOrders,
    };
};

// Block user
export const blockUserService = async (userId, reason = "Blocked by admin") => {
    const user = await User.findByIdAndUpdate(
        userId,
        {
            isBlocked: true,
            blockReason: reason,
            blockedAt: new Date(),
        },
        { new: true }
    ).select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    return {
        id: user._id,
        name: user.name,
        isBlocked: user.isBlocked,
    };
};

// Unblock user
export const unblockUserService = async (userId) => {
    const user = await User.findByIdAndUpdate(
        userId,
        {
            isBlocked: false,
            blockReason: null,
            blockedAt: null,
        },
        { new: true }
    ).select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    return {
        id: user._id,
        name: user.name,
        isBlocked: user.isBlocked,
    };
};

// Delete user (soft delete by blocking or hard delete)
export const deleteUserService = async (userId, hardDelete = false) => {
    if (hardDelete) {
        // Hard delete - remove user and all associated data
        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Use userId directly as Mongoose handles ObjectId conversion
        await Promise.all([
            User.findByIdAndDelete(userId),
            Order.deleteMany({ user: userId }),
            Review.deleteMany({ user: userId }),
        ]);

        return { deleted: true };
    } else {
        // Soft delete - just block the user
        const user = await User.findByIdAndUpdate(
            userId,
            {
                isBlocked: true,
                blockReason: "Account deleted by admin",
                blockedAt: new Date(),
            },
            { new: true }
        ).select("-password");

        if (!user) {
            throw new Error("User not found");
        }

        return {
            user: {
                id: user._id,
                name: user.name,
                isBlocked: user.isBlocked,
            },
        };
    }
};

// Get user statistics
export const getUserStatsService = async () => {
    const [
        totalUsers,
        activeUsers,
        blockedUsers,
        newUsersThisMonth,
        topCustomers,
    ] = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isBlocked: false }),
        User.countDocuments({ isBlocked: true }),
        User.countDocuments({
            createdAt: {
                $gte: new Date(
                    new Date().getFullYear(),
                    new Date().getMonth(),
                    1
                ),
            },
        }),
        Order.aggregate([
            { $match: { paymentStatus: "paid" } },
            {
                $group: {
                    _id: "$user",
                    totalSpent: { $sum: "$total" },
                    orderCount: { $sum: 1 },
                },
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user",
                },
            },
            { $unwind: "$user" },
            {
                $project: {
                    name: "$user.name",
                    phone: "$user.phone",
                    totalSpent: 1,
                    orderCount: 1,
                },
            },
        ]),
    ]);

    const stats = {
        overview: {
            totalUsers,
            activeUsers,
            blockedUsers,
            newUsersThisMonth,
        },
        topCustomers,
    };

    return stats;
};
