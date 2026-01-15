import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        productDescription: { type: String },
        price: { type: Number, required: true },
        images: [{ type: String }],
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true,
        },
        subcategories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
            },
        ],
        brand: { type: String },
        stock: { type: Number, default: 0 },
        ratings: { type: Number, default: 0 },
        reviewsCount: { type: Number, default: 0 },
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
        isFeatured: { type: Boolean, default: false },
        views: { type: Number, default: 0 },
        salesCount: { type: Number, default: 0 },
        discount: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        dimensions: {
            length: { type: Number, default: 10 }, // in cm
            breadth: { type: Number, default: 10 }, // in cm
            height: { type: Number, default: 5 }, // in cm
            weight: { type: Number, default: 0.5 } // in kg
        },
    },
    { timestamps: true }
);

productSchema.index({ name: 1, category: 1 }, { unique: true });

const Product = mongoose.model("Product", productSchema);
export default Product;
