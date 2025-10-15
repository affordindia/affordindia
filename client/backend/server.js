import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { verifyEmailConfig } from "./services/email.service.js";
import { initializeScheduler } from "./services/scheduler.service.js";

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
import paymentRoutes from "./routes/payment.routes.js";
import razorpayRoutes from "./routes/razorpay.routes.js";
import stockRoutes from "./routes/stock.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import contactRoutes from "./routes/contact.routes.js";

import errorHandler from "./middlewares/error.middleware.js";

const app = express();

// Middleware
app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:5174",

            "https://affordindia.vercel.app",
            "https://frontend-testing-nw7f.onrender.com",

            "https://affordindia.com",
            "https://www.affordindia.com",
            "https://affordindia.in",
            "https://www.affordindia.in",
            "https://affordindia.co.in",
            "https://www.affordindia.co.in",
        ],
        credentials: true,
    })
);
app.use(express.json());

connectDB();

// Verify email configuration on startup
verifyEmailConfig().catch(() => {
    console.warn(
        "⚠️  Email service not configured properly. Contact form will not work until email settings are configured."
    );
});

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
app.use("/api/payments", paymentRoutes);
app.use("/api/razorpay", razorpayRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/contact", contactRoutes);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Client Server running on port ${PORT}`);

    // Initialize background job scheduler
    if (process.env.NODE_ENV !== "test") {
        setTimeout(() => {
            initializeScheduler();
        }, 10000); // Wait 10 seconds after server start
    }
});
