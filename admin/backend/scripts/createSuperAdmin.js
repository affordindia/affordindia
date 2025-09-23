import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "../config/db.js";
import AdminUser from "../models/adminUser.model.js";

// Create initial superadmin user
const createInitialSuperAdmin = async () => {
    try {
        await connectDB();

        // Check if any superadmin exists
        const existingSuperAdmin = await AdminUser.findOne({ accessLevel: 5 });

        if (existingSuperAdmin) {
            console.log("Superadmin already exists:", existingSuperAdmin.email);
            process.exit(0);
        }

        // Create initial superadmin
        const superAdmin = new AdminUser({
            name: "Super Admin",
            email: "superadmin@affordindia.com",
            password: "password123", // Change this in production
            accessLevel: 5,
            isActive: true,
        });

        await superAdmin.save();

        console.log("Initial superadmin created successfully!");
        console.log("Email: superadmin@affordindia.com");
        console.log("Password: password123");
        console.log("⚠️  Please change the password after first login!");

        process.exit(0);
    } catch (error) {
        console.error("Error creating superadmin:", error);
        process.exit(1);
    }
};

createInitialSuperAdmin();
