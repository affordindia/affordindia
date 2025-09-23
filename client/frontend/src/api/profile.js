import axios from "./axios";

// Get profile
export const getProfile = async () => {
    console.log("API CALL: getProfile");
    const res = await axios.get("/profile");
    return res.data;
};

// Update profile
export const updateProfile = async (profileData) => {
    console.log("API CALL: updateProfile", profileData);
    const res = await axios.put("/profile", profileData);
    return res.data;
};

// Address management
export const getAddresses = async () => {
    console.log("API CALL: getAddresses");
    const res = await axios.get("/profile/addresses");
    return res.data;
};

export const addAddress = async (addressData) => {
    console.log("API CALL: addAddress", addressData);
    const res = await axios.post("/profile/addresses", addressData);
    return res.data;
};

export const updateAddress = async (addressId, addressData) => {
    console.log("API CALL: updateAddress", addressId, addressData);
    const res = await axios.put(`/profile/addresses/${addressId}`, addressData);
    return res.data;
};

export const deleteAddress = async (addressId) => {
    console.log("API CALL: deleteAddress", addressId);
    const res = await axios.delete(`/profile/addresses/${addressId}`);
    return res.data;
};

export const setDefaultAddress = async (addressId) => {
    console.log("API CALL: setDefaultAddress", addressId);
    const res = await axios.post(`/profile/addresses/${addressId}/default`);
    return res.data;
};
