import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
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
    },
    { timestamps: true }
);

productSchema.index({ name: 1, category: 1 }, { unique: true });

// Pre-save middleware to validate subcategories belong to category
productSchema.pre("save", async function (next) {
    if (this.subcategories && this.subcategories.length > 0 && this.category) {
        const Category = mongoose.model("Category");

        // Validate all subcategories
        for (let subcategoryId of this.subcategories) {
            const subcategory = await Category.findById(subcategoryId);

            if (!subcategory) {
                return next(
                    new Error(`Subcategory ${subcategoryId} not found`)
                );
            }

            // Check if subcategory's parent is the specified category
            if (
                !subcategory.parentCategory ||
                subcategory.parentCategory.toString() !==
                    this.category.toString()
            ) {
                return next(
                    new Error(
                        `Subcategory ${subcategory.name} must belong to the specified category`
                    )
                );
            }
        }
    }
    next();
});

const Product = mongoose.model("Product", productSchema);
export default Product;
