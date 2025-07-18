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
    const user = await User.findByIdAndUpdate(userId, profileData, {
        new: true,
        runValidators: true,
    }).select("-password");
    if (!user) throw new Error("User not found");
    return user;
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
    if (address.isDefault) {
        user.addresses.forEach((addr) => (addr.isDefault = false));
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
    user.addresses.id(addressId).remove();
    await user.save();
    return user.addresses;
};

// Set default address
export const setDefaultAddress = async (userId, addressId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    user.addresses.forEach((addr) => {
        addr.isDefault = addr._id.toString() === addressId;
    });
    await user.save();
    return user.addresses;
};
