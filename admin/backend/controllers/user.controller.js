import {
    getAllUsersService,
    getUserByIdService,
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
        res.json(users);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch users",
            error: err.message,
        });
    }
};

// Get user by ID
export const getUserById = async (req, res) => {
    try {
        const user = await getUserByIdService(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch user",
            error: err.message,
        });
    }
};
