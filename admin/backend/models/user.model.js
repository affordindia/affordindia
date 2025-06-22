import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        address: {
            houseNumber: { type: String },
            street: { type: String },
            landmark: { type: String },
            area: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: String },
            country: { type: String, default: "India" },
        },
        phone: { type: String },
        isBlocked: { type: Boolean, default: false },
        orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
