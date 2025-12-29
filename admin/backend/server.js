import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db.js";
import productRoutes from "./routes/product.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import userRoutes from "./routes/user.routes.js";
import bannerRoutes from "./routes/banner.routes.js";
import orderRoutes from "./routes/order.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import configRoutes from "./routes/config.routes.js";
import reviewRoutes from "./routes/reviews.routes.js";
import adminAuthRoutes from "./routes/adminAuth.routes.js";
import adminUsersRoutes from "./routes/adminUsers.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import shiprocketRoutes from "./routes/shiprocket.routes.js";

// Load env vars

const app = express();

// Allow webhook endpoint from any origin (Shiprocket servers)
app.use('/api/shiprocket/webhook', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Middleware
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "http://localhost:5001",
            "https://admin-portal-affordindia.vercel.app",
            "https://admin.affordindia.com",
            "https://admin.affordindia.in",
            "https://admin.affordindia.co.in",
            "https://affordindia.vercel.app",
            "https://www.affordindia.com",
        ],
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

// Connect to DB
connectDB();

// Health check route
app.get("/", (req, res) => {
    res.send("AffordIndia Admin Backend Running");
});

// Routes
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/users", adminUsersRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/config", configRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", invoiceRoutes);
app.use("/api/shiprocket", shiprocketRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
