import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
// Import routes (to be implemented)
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import orderRoutes from "./routes/order.routes.js";
// import categoryRoutes from "./routes/category.routes.js";
// import userRoutes from "./routes/user.routes.js";
// import reviewRoutes from "./routes/review.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Health check route
app.get("/", (req, res) => {
    res.send("AffordIndia Client Backend Running");
});

// Routes (to be enabled as implemented)
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
// app.use("/api/categories", categoryRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/reviews", reviewRoutes);

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Client Server running on port ${PORT}`);
});
