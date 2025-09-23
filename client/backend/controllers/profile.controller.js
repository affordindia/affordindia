import {
    getProfile as getProfileService,
    updateProfile as updateProfileService,
    getAddresses as getAddressesService,
    addAddress as addAddressService,
    updateAddress as updateAddressService,
    deleteAddress as deleteAddressService,
    setDefaultAddress as setDefaultAddressService,
} from "../services/profile.service.js";

// Get current user's profile
export const getProfile = async (req, res, next) => {
    try {
        const user = await getProfileService(req.user._id);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

// Update current user's profile
export const updateProfile = async (req, res, next) => {
    try {
        const user = await updateProfileService(req.user._id, req.body);
        res.json(user);
    } catch (err) {
        next(err);
    }
};

// List all addresses
export const getAddresses = async (req, res, next) => {
    try {
        const addresses = await getAddressesService(req.user._id);
        res.json(addresses);
    } catch (err) {
        next(err);
    }
};

// Add a new address
export const addAddress = async (req, res, next) => {
    try {
        const addresses = await addAddressService(req.user._id, req.body);
        res.json(addresses);
    } catch (err) {
        next(err);
    }
};

// Update an address
export const updateAddress = async (req, res, next) => {
    try {
        const addresses = await updateAddressService(
            req.user._id,
            req.params.addressId,
            req.body
        );
        res.json(addresses);
    } catch (err) {
        next(err);
    }
};

// Delete an address
export const deleteAddress = async (req, res, next) => {
    try {
        const addresses = await deleteAddressService(
            req.user._id,
            req.params.addressId
        );
        res.json(addresses);
    } catch (err) {
        next(err);
    }
};

// Set default address
export const setDefaultAddress = async (req, res, next) => {
    try {
        const addresses = await setDefaultAddressService(
            req.user._id,
            req.params.addressId
        );
        res.json(addresses);
    } catch (err) {
        next(err);
    }
};
