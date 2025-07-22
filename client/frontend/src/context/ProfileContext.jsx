import React, { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";
import * as profileApi from "../api/profile.js";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Auto-load profile and addresses on login/logout
    useEffect(() => {
        if (user) {
            fetchProfile();
            fetchAddresses();
        } else {
            setProfile(null);
            setAddresses([]);
        }
        // eslint-disable-next-line
    }, [user]);

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await profileApi.getProfile();
            setProfile(data);
        } catch (e) {
            setError(e.message || "Failed to load profile");
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchAddresses = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await profileApi.getAddresses();
            setAddresses(data || []);
        } catch (e) {
            setError(e.message || "Failed to load addresses");
            setAddresses([]);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (profileData) => {
        setLoading(true);
        setError(null);
        try {
            const updatedProfile = await profileApi.updateProfile(profileData);
            setProfile(updatedProfile);
            return updatedProfile;
        } catch (e) {
            setError(e.message || "Failed to update profile");
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const addAddress = async (addressData) => {
        setLoading(true);
        setError(null);
        try {
            const updatedAddresses = await profileApi.addAddress(addressData);
            setAddresses(updatedAddresses);
            return updatedAddresses;
        } catch (e) {
            setError(e.message || "Failed to add address");
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const updateAddress = async (addressId, addressData) => {
        setLoading(true);
        setError(null);
        try {
            const updatedAddresses = await profileApi.updateAddress(
                addressId,
                addressData
            );
            setAddresses(updatedAddresses);
            return updatedAddresses;
        } catch (e) {
            setError(e.message || "Failed to update address");
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const deleteAddress = async (addressId) => {
        setLoading(true);
        setError(null);
        try {
            const updatedAddresses = await profileApi.deleteAddress(addressId);
            setAddresses(updatedAddresses);
            return updatedAddresses;
        } catch (e) {
            setError(e.message || "Failed to delete address");
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const setDefaultAddress = async (addressId) => {
        setLoading(true);
        setError(null);
        try {
            const updatedAddresses = await profileApi.setDefaultAddress(
                addressId
            );
            setAddresses(updatedAddresses);
            return updatedAddresses;
        } catch (e) {
            setError(e.message || "Failed to set default address");
            throw e;
        } finally {
            setLoading(false);
        }
    };

    const getDefaultAddress = () => {
        return addresses.find((addr) => addr.isDefault) || null;
    };

    const clearError = () => {
        setError(null);
    };

    const value = {
        profile,
        addresses,
        loading,
        error,
        fetchProfile,
        fetchAddresses,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getDefaultAddress,
        clearError,
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    return context;
};

export default ProfileContext;
