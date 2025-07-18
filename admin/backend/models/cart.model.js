import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    priceAtAdd: {
        type: Number,
        required: true,
    },
    // Optionally, add variant, size, etc.
});

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },
        items: [cartItemSchema],
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

cartSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
