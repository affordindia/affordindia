import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: false }, // Optional name field (not required for auth)
        email: { type: String, unique: true, sparse: true }, // Make email optional for phone auth
        password: { type: String }, // Make password optional for phone auth
        phone: { type: String, unique: true, sparse: true }, // Make phone unique and optional
        authMethod: { 
            type: String, 
            enum: ['email', 'phone'], 
            default: 'phone' // Default to phone auth
        }, // Track authentication method
        firebaseUid: { type: String, unique: true, sparse: true }, // Store Firebase UID for phone auth
        addresses: [
            {
                label: { type: String }, // e.g. 'Home', 'Work'
                houseNumber: { type: String },
                street: { type: String },
                landmark: { type: String },
                area: { type: String },
                city: { type: String },
                state: { type: String },
                pincode: { type: String },
                country: { type: String, default: "India" },
                phone: { type: String },
                isDefault: { type: Boolean, default: false },
            },
        ],
        isBlocked: { type: Boolean, default: false },
        orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
        wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
