import React, { useState, useEffect } from "react";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useProfile } from "../../context/ProfileContext.jsx";

const ProfileForm = () => {
    const { profile, updateProfile, loading } = useProfile();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
    });
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    // Initialize form data when profile loads
    useEffect(() => {
        if (profile) {
            // Remove +91 prefix from phone if present for display
            const phoneNumber = profile.phone
                ? profile.phone.replace(/^\+91/, "")
                : "";

            setFormData({
                name: profile.name || "",
                phone: phoneNumber,
                email: profile.email || "",
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // For phone, only allow 10 digit numbers
        if (name === "phone") {
            const numericValue = value.replace(/[^0-9]/g, "");
            // Limit to 10 digits
            const limitedValue = numericValue.slice(0, 10);
            setFormData((prev) => ({
                ...prev,
                [name]: limitedValue,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        if (formData.phone && formData.phone.length > 0) {
            if (!/^\d{10}$/.test(formData.phone)) {
                newErrors.phone = "Phone must be 10 digits";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;

        setIsSaving(true);
        try {
            // Prepare data for backend - add +91 prefix to phone if provided
            const submitData = {
                ...formData,
                phone: formData.phone ? `+91${formData.phone}` : "",
            };

            await updateProfile(submitData);
            setIsEditing(false);
            // Clear any previous errors on successful save
            setErrors({});
        } catch (error) {
            console.error("Profile update error:", error);

            // Handle specific error types for field-level display
            if (
                error.message &&
                error.message.includes("Phone number is already registered")
            ) {
                setErrors((prev) => ({
                    ...prev,
                    phone: "This phone number is already registered with another account",
                }));
            } else {
                // For other errors, you can add toast notification here in future
                console.error("Unexpected error:", error.message);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Reset form data to original profile data
        if (profile) {
            // Remove +91 prefix from phone if present for display
            const phoneNumber = profile.phone
                ? profile.phone.replace(/^\+91/, "")
                : "";

            setFormData({
                name: profile.name || "",
                phone: phoneNumber,
                email: profile.email || "",
            });
        }
        setErrors({});
        setIsEditing(false);
    };

    if (!profile) {
        return (
            <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-4">
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    Contact Details
                </h2>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-[#B76E79] text-white rounded hover:bg-[#C68F98] transition-colors"
                    >
                        <FaEdit className="text-xs" />
                        Edit
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="flex items-center gap-1 px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            <FaTimes className="text-xs" />
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-1 px-3 py-1 text-sm bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                        >
                            <FaSave className="text-xs" />
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                    </div>
                )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Enter your full name"
                        className={`w-full p-2 border border-gray-300 rounded ${
                            isEditing
                                ? "bg-white focus:outline-none focus:ring-2 focus:ring-black"
                                : "bg-gray-100 cursor-not-allowed"
                        }`}
                    />
                    {errors.name && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number
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
                            disabled={!isEditing}
                            placeholder="9876543210"
                            maxLength="10"
                            className={`w-full p-2 pl-12 border border-gray-300 rounded ${
                                isEditing
                                    ? "bg-white focus:outline-none focus:ring-2 focus:ring-black"
                                    : "bg-gray-100 cursor-not-allowed"
                            }`}
                        />
                    </div>
                    {errors.phone && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.phone}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder="Enter your email"
                        className={`w-full p-2 border border-gray-300 rounded ${
                            isEditing
                                ? "bg-white focus:outline-none focus:ring-2 focus:ring-black"
                                : "bg-gray-100 cursor-not-allowed"
                        }`}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileForm;
