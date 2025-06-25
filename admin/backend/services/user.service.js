import User from "../models/user.model.js";

// Get all users with optional filtering and pagination
export const getAllUsersService = async (filter = {}, options = {}) => {
    const { page = 1, limit = 20, sort = "-createdAt" } = options;
    const skip = (page - 1) * limit;
    const query = User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select("-password"); // Exclude password
    const users = await query.exec();
    const total = await User.countDocuments(filter);
    return { users, total, page, limit };
};

// Get a single user by ID
export const getUserByIdService = async (userId) => {
    return User.findById(userId).select("-password");
};
