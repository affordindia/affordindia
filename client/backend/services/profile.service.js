import User from "../models/user.model.js";
import {
    validateProfile,
    validateAddress,
} from "../utils/profile.validation.js";

// Get current user's profile
export const getProfile = async (userId) => {
    const user = await User.findById(userId).select("-password");
    if (!user) throw new Error("User not found");
    return user;
};

// Update current user's profile (name, phone, etc.)
export const updateProfile = async (userId, profileData) => {
    const errors = validateProfile(profileData);
    if (errors.length) throw new Error(errors.join(" "));

    try {
        const user = await User.findByIdAndUpdate(userId, profileData, {
            new: true,
            runValidators: true,
        }).select("-password");
        if (!user) throw new Error("User not found");
        return user;
    } catch (error) {
        // Handle MongoDB duplicate key errors with user-friendly messages
        if (error.code === 11000) {
            if (error.keyPattern?.phone) {
                throw new Error(
                    "Phone number is already registered with another account"
                );
            }
        }
        throw error; // Re-throw other errors as-is
    }
};

// List all addresses
export const getAddresses = async (userId) => {
    const user = await User.findById(userId).select("addresses");
    if (!user) throw new Error("User not found");
    return user.addresses;
};

// Add a new address
export const addAddress = async (userId, address) => {
    const errors = validateAddress(address);
    if (errors.length) throw new Error(errors.join(" "));
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // If this is the first address or user explicitly sets it as default
    if (user.addresses.length === 0 || address.isDefault) {
        user.addresses.forEach((addr) => (addr.isDefault = false));
        address.isDefault = true;
    }

    user.addresses.push(address);
    await user.save();
    return user.addresses;
};

// Update an address
export const updateAddress = async (userId, addressId, address) => {
    const errors = validateAddress(address);
    if (errors.length) throw new Error(errors.join(" "));
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    const addr = user.addresses.id(addressId);
    if (!addr) throw new Error("Address not found");
    if (address.isDefault) {
        user.addresses.forEach((a) => (a.isDefault = false));
    }
    Object.assign(addr, address);
    await user.save();
    return user.addresses;
};

// Delete an address
export const deleteAddress = async (userId, addressId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Prevent deletion if this is the only address
    if (user.addresses.length <= 1) {
        throw new Error(
            "Cannot delete the last address. At least one address must be maintained."
        );
    }

    const addressIndex = user.addresses.findIndex(
        (addr) => addr._id.toString() === addressId
    );
    if (addressIndex === -1) throw new Error("Address not found");

    const addressToDelete = user.addresses[addressIndex];
    const wasDefault = addressToDelete.isDefault;

    // Remove the address
    user.addresses.splice(addressIndex, 1);

    // If we deleted the default address, set the first remaining address as default
    if (wasDefault && user.addresses.length > 0) {
        user.addresses[0].isDefault = true;
    }

    await user.save();
    return user.addresses;
};

// Set default address
export const setDefaultAddress = async (userId, addressId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    // Check if the address exists
    const targetAddress = user.addresses.find(
        (addr) => addr._id.toString() === addressId
    );
    if (!targetAddress) throw new Error("Address not found");

    // Set all addresses to non-default, then set the target as default
    user.addresses.forEach((addr) => {
        addr.isDefault = addr._id.toString() === addressId;
    });

    await user.save();
    return user.addresses;
};
