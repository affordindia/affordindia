import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        price: { type: Number, required: true },
        images: [{ type: String }],
        category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
        brand: { type: String },
        stock: { type: Number, default: 0 },
        ratings: { type: Number, default: 0 },
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
