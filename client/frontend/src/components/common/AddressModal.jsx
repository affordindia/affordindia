import React, { useState, useEffect } from "react";
import { FaTimes, FaMapMarkerAlt } from "react-icons/fa";
import { useProfile } from "../../context/ProfileContext.jsx";

const AddressModal = ({ isOpen, onClose, editingAddress = null }) => {
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
        isDefault: false,
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset form when modal opens/closes or editing address changes
    useEffect(() => {
        if (isOpen) {
            if (editingAddress) {
                setFormData({
                    label: editingAddress.label || "",
                    houseNumber: editingAddress.houseNumber || "",
                    street: editingAddress.street || "",
                    landmark: editingAddress.landmark || "",
                    area: editingAddress.area || "",
                    city: editingAddress.city || "",
                    state: editingAddress.state || "",
                    pincode: editingAddress.pincode || "",
                    isDefault: editingAddress.isDefault || false,
                });
            } else {
                setFormData({
                    label: "Home",
                    houseNumber: "",
                    street: "",
                    landmark: "",
                    area: "",
                    city: "",
                    state: "",
                    pincode: "",
                    isDefault: false,
                });
            }
            setErrors({});
        }
    }, [isOpen, editingAddress]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        // For pincode, only allow numbers
        if (name === "pincode") {
            const numericValue = value.replace(/[^0-9]/g, "");
            setFormData((prev) => ({
                ...prev,
                [name]: numericValue,
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
        if (!formData.street.trim()) newErrors.street = "Street is required";
        if (!formData.city.trim()) newErrors.city = "City is required";
        if (!formData.state.trim()) newErrors.state = "State is required";
        if (!formData.pincode.trim()) {
            newErrors.pincode = "Pincode is required";
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = "Pincode must be 6 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            // Prepare data for backend
            const submitData = {
                ...formData,
            };

            if (editingAddress) {
                await updateAddress(editingAddress._id, submitData);
            } else {
                await addAddress(submitData);
            }
            onClose();
        } catch (error) {
            console.error("Form submission error:", error);
            setErrors({ submit: error.message || "Failed to save address" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#b76e79]" />
                        <h3 className="text-lg font-semibold text-gray-900">
                            {editingAddress
                                ? "Edit Address"
                                : "Add New Address"}
                        </h3>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Submit Error */}
                    {errors.submit && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">
                                {errors.submit}
                            </p>
                        </div>
                    )}

                    {/* House Number and Street */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                House/Flat No. *
                            </label>
                            <input
                                type="text"
                                name="houseNumber"
                                value={formData.houseNumber}
                                onChange={handleChange}
                                placeholder="e.g., 123, A-45"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                            />
                            {errors.houseNumber && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.houseNumber}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Street *
                            </label>
                            <input
                                type="text"
                                name="street"
                                value={formData.street}
                                onChange={handleChange}
                                placeholder="Street name"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                            />
                            {errors.street && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.street}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Area and Landmark */}
                    <div className="grid grid-cols-2 gap-4">
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
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
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
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* City, State, Pincode */}
                    <div className="grid grid-cols-3 gap-4">
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
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
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
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
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
                                placeholder="6-digit"
                                maxLength="6"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                            />
                            {errors.pincode && (
                                <p className="text-red-500 text-xs mt-1">
                                    {errors.pincode}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Address Label */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Type *
                        </label>
                        <select
                            name="label"
                            value={formData.label}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent"
                        >
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

                    {/* Set as Default */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isDefault"
                            name="isDefault"
                            checked={formData.isDefault}
                            onChange={handleChange}
                            className="mr-3 text-[#b76e79] focus:ring-gray-400 accent-[#b76e79]"
                        />
                        <label
                            htmlFor="isDefault"
                            className="text-sm text-[#404040]"
                        >
                            Set as default address
                        </label>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 bg-white border-2 border-[#B76E79] text-[#B76E79] rounded-lg font-medium hover:bg-[#B76E79] hover:text-white transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 bg-[#b66e79] border-2 border-[#b66e79] text-white rounded-lg font-medium hover:bg-white hover:text-[#b66e79] transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </div>
                            ) : editingAddress ? (
                                "Update Address"
                            ) : (
                                "Add Address"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;
