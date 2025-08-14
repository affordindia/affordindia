import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import orderRoutes from "./routes/order.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import bannerRoutes from "./routes/banner.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import shippingRoutes from "./routes/shipping.routes.js";

import errorHandler from "./middlewares/error.middleware.js";

const app = express();

// Middleware
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",
            "https://client-frontend-chi.vercel.app",
            "https://client-frontend-hw8c.onrender.com",
            "https://affordindia.vercel.app",
        ],
        credentials: true,
    })
);
app.use(express.json());

connectDB();

// Health check route
app.get("/", (req, res) => {
    res.send("AffordIndia Client Backend Running");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/shipping", shippingRoutes);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Client Server running on port ${PORT}`);
});
