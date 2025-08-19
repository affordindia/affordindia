import AdminUser from "../models/adminUser.model.js";
import { generateTokens } from "../utils/jwt.util.js";
import { isValidAccessLevel } from "../config/rbac.config.js";

// Create new admin user
export const createAdminUserService = async (userData, createdBy) => {
    try {
        const { name, email, password, accessLevel = 1 } = userData;

        // Validate access level
        if (!isValidAccessLevel(accessLevel)) {
            throw new Error("Invalid access level. Must be between 1 and 5");
        }

        // Check if admin already exists
        const existingAdmin = await AdminUser.findByEmail(email);
        if (existingAdmin) {
            throw new Error("Admin with this email already exists");
        }

        // Create admin user
        const adminUser = new AdminUser({
            name,
            email,
            password,
            accessLevel,
            createdBy,
        });

        await adminUser.save();
        return adminUser;
    } catch (error) {
        throw new Error(`Failed to create admin user: ${error.message}`);
    }
};

// Authenticate admin user
export const authenticateAdminService = async (email, password) => {
    try {
        // Find admin by email
        const admin = await AdminUser.findByEmail(email).select("+password");
        if (!admin) {
            throw new Error("Invalid credentials");
        }

        // Check if admin is active
        if (!admin.isActive) {
            throw new Error("Account is deactivated");
        }

        // Verify password
        const isPasswordValid = await admin.comparePassword(password);
        if (!isPasswordValid) {
            throw new Error("Invalid credentials");
        }

        // Update last login
        await updateLastLoginService(admin._id);

        // Remove password from response
        const adminData = admin.toJSON();
        return adminData;
    } catch (error) {
        throw new Error(`Authentication failed: ${error.message}`);
    }
};

// Generate authentication tokens
export const generateAuthTokensService = (adminData) => {
    try {
        const { accessToken, refreshToken } = generateTokens(adminData);
        return { accessToken, refreshToken };
    } catch (error) {
        throw new Error(`Failed to generate tokens: ${error.message}`);
    }
};

// Update last login timestamp
export const updateLastLoginService = async (adminId) => {
    try {
        await AdminUser.findByIdAndUpdate(adminId, {
            lastLogin: new Date(),
        });
    } catch (error) {
        throw new Error(`Failed to update last login: ${error.message}`);
    }
};

// Get admin by ID
export const getAdminByIdService = async (adminId) => {
    try {
        const admin = await AdminUser.findById(adminId);
        if (!admin) {
            throw new Error("Admin not found");
        }
        return admin;
    } catch (error) {
        throw new Error(`Failed to get admin: ${error.message}`);
    }
};

// Update admin profile
export const updateAdminProfileService = async (adminId, updateData) => {
    try {
        const allowedUpdates = ["name", "email"];
        const filteredData = {};

        // Filter allowed updates
        Object.keys(updateData).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                filteredData[key] = updateData[key];
            }
        });

        // Check if email is being updated and if it already exists
        if (filteredData.email) {
            const existingAdmin = await AdminUser.findByEmail(
                filteredData.email
            );
            if (existingAdmin && existingAdmin._id.toString() !== adminId) {
                throw new Error("Email already exists");
            }
        }

        const updatedAdmin = await AdminUser.findByIdAndUpdate(
            adminId,
            filteredData,
            { new: true, runValidators: true }
        );

        if (!updatedAdmin) {
            throw new Error("Admin not found");
        }

        return updatedAdmin;
    } catch (error) {
        throw new Error(`Failed to update profile: ${error.message}`);
    }
};

// Get all admin users
export const getAllAdminsService = async () => {
    try {
        const admins = await AdminUser.find()
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });
        return admins;
    } catch (error) {
        throw new Error(`Failed to get admins: ${error.message}`);
    }
};

// Update admin user
export const updateAdminUserService = async (
    adminId,
    updateData,
    updatedBy
) => {
    try {
        const allowedUpdates = ["name", "email", "accessLevel", "isActive"];
        const filteredData = {};

        // Filter allowed updates
        Object.keys(updateData).forEach((key) => {
            if (allowedUpdates.includes(key)) {
                filteredData[key] = updateData[key];
            }
        });

        // Validate access level if provided
        if (
            filteredData.accessLevel &&
            !isValidAccessLevel(filteredData.accessLevel)
        ) {
            throw new Error("Invalid access level. Must be between 1 and 5");
        }

        // Check if email is being updated and if it already exists
        if (filteredData.email) {
            const existingAdmin = await AdminUser.findByEmail(
                filteredData.email
            );
            if (existingAdmin && existingAdmin._id.toString() !== adminId) {
                throw new Error("Email already exists");
            }
        }

        const updatedAdmin = await AdminUser.findByIdAndUpdate(
            adminId,
            filteredData,
            { new: true, runValidators: true }
        );

        if (!updatedAdmin) {
            throw new Error("Admin not found");
        }

        return updatedAdmin;
    } catch (error) {
        throw new Error(`Failed to update admin: ${error.message}`);
    }
};

// Delete admin user
export const deleteAdminUserService = async (adminId) => {
    try {
        const admin = await AdminUser.findById(adminId);
        if (!admin) {
            throw new Error("Admin not found");
        }

        // Prevent deleting superadmin if it's the last one
        if (admin.accessLevel === 5) {
            const superAdminCount = await AdminUser.countDocuments({
                accessLevel: 5,
                isActive: true,
                _id: { $ne: adminId },
            });
            if (superAdminCount === 0) {
                throw new Error("Cannot delete the last superadmin");
            }
        }

        await AdminUser.findByIdAndDelete(adminId);
        return { message: "Admin deleted successfully" };
    } catch (error) {
        throw new Error(`Failed to delete admin: ${error.message}`);
    }
};
