import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        image: { type: String },
        parentCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active",
        },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
