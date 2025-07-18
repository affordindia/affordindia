import User from "../models/user.model.js";

// Get all users with optional filtering and pagination
export const getAllUsersService = async (filter = {}, options = {}) => {
    const query = User.find(filter)
        .sort(options.sort || {})
        .skip(options.skip !== undefined ? options.skip : 0)
        .limit(options.limit !== undefined ? options.limit : 50)
        .select("-password");
    const users = await query.exec();
    return users;
};

// Get a single user by ID
export const getUserByIdService = async (userId) => {
    return User.findById(userId).select("-password");
};
