import React, { useState, useEffect } from "react";
import { validatePhoneNumber } from "../../utils/validatePhoneNumber";
import { useProfile } from "../../context/ProfileContext.jsx";

const AddressForm = ({ editingAddress = null, onClose, inline = false }) => {
    const { addAddress, updateAddress, loading } = useProfile();

    const [formData, setFormData] = useState({
        label: "",
        houseNumber: "",
        street: "",
        landmark: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
        phone: "",
        isDefault: false,
    });
    const [errors, setErrors] = useState({});

    // Reset form when editing address changes
    useEffect(() => {
        if (editingAddress) {
            // Remove +91 prefix from phone if present for display
            const phoneNumber = editingAddress.phone
                ? editingAddress.phone.replace(/^\+91/, "")
                : "";

            setFormData({
                label: editingAddress.label || "",
                houseNumber: editingAddress.houseNumber || "",
                street: editingAddress.street || "",
                landmark: editingAddress.landmark || "",
                area: editingAddress.area || "",
                city: editingAddress.city || "",
                state: editingAddress.state || "",
                pincode: editingAddress.pincode || "",
                phone: phoneNumber,
                isDefault: editingAddress.isDefault || false,
            });
        } else {
            setFormData({
                label: "",
                houseNumber: "",
                street: "",
                landmark: "",
                area: "",
                city: "",
                state: "",
                pincode: "",
                phone: "",
                isDefault: false,
            });
        }
        setErrors({});
    }, [editingAddress]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // For pincode, only allow numbers
        if (name === "pincode") {
            const numericValue = value.replace(/[^0-9]/g, "");
            setFormData((prev) => ({
                ...prev,
                [name]: numericValue,
            }));
        }
        // For phone, only allow 10 digit numbers
        else if (name === "phone") {
            // Only allow numeric and max 10 digits
            const cleaned = value.replace(/[^0-9]/g, "").slice(0, 10);
            setFormData((prev) => ({
                ...prev,
                [name]: cleaned,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.label.trim())
            newErrors.label = "Address label is required";
        if (!formData.houseNumber.trim())
            newErrors.houseNumber = "House/Building number is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.pincode.trim()) {
            newErrors.pincode = "Pincode is required";
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = "Pincode must be 6 digits";
        }

        if (formData.phone && formData.phone.length > 0) {
            if (!validatePhoneNumber(formData.phone)) {
                newErrors.phone = "Phone must be 10 digits";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            // Prepare data for backend - add +91 prefix to phone if provided
            const submitData = {
                ...formData,
                phone: formData.phone ? `+91${formData.phone}` : "",
            };

            if (editingAddress) {
                await updateAddress(editingAddress._id, submitData);
            } else {
                await addAddress(submitData);
            }
            onClose();
        } catch (error) {
            console.error("Form submission error:", error);
        }
    };

    return (
        <div className="w-full">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* House Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        House/Building Number *
                    </label>
                    <input
                        type="text"
                        name="houseNumber"
                        value={formData.houseNumber}
                        onChange={handleChange}
                        placeholder="e.g., 123, A-45"
                        className="w-full p-2 border border-gray-400 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
                    />
                    {errors.houseNumber && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.houseNumber}
                        </p>
                    )}
                </div>

                {/* Street and Landmark Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Street
                        </label>
                        <input
                            type="text"
                            name="street"
                            value={formData.street}
                            onChange={handleChange}
                            placeholder="Street name"
                            className="w-full p-2 border border-gray-400 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Landmark
                        </label>
                        <input
                            type="text"
                            name="landmark"
                            value={formData.landmark}
                            onChange={handleChange}
                            placeholder="Near landmark"
                            className="w-full p-2 border border-gray-400 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
                        />
                    </div>
                </div>

                {/* Area */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Area/Locality
                    </label>
                    <input
                        type="text"
                        name="area"
                        value={formData.area}
                        onChange={handleChange}
                        placeholder="Area or locality"
                        className="w-full p-2 border border-gray-400 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
                    />
                </div>

                {/* City, State and Pincode Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="City"
                            className="w-full p-2 border border-gray-400 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
                        />
                        {errors.city && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.city}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                        </label>
                        <input
                            type="text"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="State"
                            className="w-full p-2 border border-gray-400 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
                        />
                        {errors.state && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.state}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pincode *
                        </label>
                        <input
                            type="text"
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleChange}
                            placeholder="6-digit pincode"
                            maxLength="6"
                            className="w-full p-2 border border-gray-400 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
                        />
                        {errors.pincode && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.pincode}
                            </p>
                        )}
                    </div>
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                    </label>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-500">
                            +91
                        </span>
                        <input
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="9876543210"
                            maxLength="10"
                            className="w-full p-2 pl-12 border border-gray-400 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
                        />
                    </div>
                    {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.phone}
                        </p>
                    )}
                </div>

                {/* Address Label */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Label *
                    </label>
                    <select
                        name="label"
                        value={formData.label}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-400 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:bg-white"
                    >
                        <option value="">Select address type</option>
                        <option value="Home">Home</option>
                        <option value="Work">Work</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.label && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.label}
                        </p>
                    )}
                </div>

                {/* Default Address Checkbox */}
                <div className="flex items-center">
                    <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={formData.isDefault}
                        onChange={handleChange}
                        className="mr-2"
                    />
                    <label
                        htmlFor="isDefault"
                        className="text-sm text-gray-700"
                    >
                        Set as default address
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-200 border border-gray-400 text-gray-800 rounded hover:bg-gray-300 transition-colors font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                        {loading
                            ? "Saving..."
                            : editingAddress
                            ? "Update"
                            : "Add"}{" "}
                        Address
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddressForm;
