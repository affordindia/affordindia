import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProfile } from "../../context/ProfileContext.jsx";
import { FaTruck, FaMapMarkerAlt, FaPlus, FaCheck } from "react-icons/fa";

const ShippingForm = ({ address, onChange, onStepChange }) => {
    const { user } = useAuth();
    const { addresses, getDefaultAddress } = useProfile();
    const [errors, setErrors] = useState({});
    const [selectedAddressId, setSelectedAddressId] = useState("");

    // Pre-fill from default address or user profile
    useEffect(() => {
        const defaultAddress = getDefaultAddress();
        const hasEmptyAddress = Object.keys(address).every(
            (key) => !address[key]
        );

        if (defaultAddress && hasEmptyAddress) {
            // Use default address
            handleAddressSelect(defaultAddress._id);
        } else if (!defaultAddress && addresses.length > 0 && hasEmptyAddress) {
            // Use first available address if no default
            handleAddressSelect(addresses[0]._id);
        } else if (
            !addresses.length &&
            user?.profile?.address &&
            hasEmptyAddress
        ) {
            // Fallback to profile address if no saved addresses
            onChange(user.profile.address);
        }
    }, [addresses, user, address]);

    // Update step when address is complete
    useEffect(() => {
        const isComplete =
            address.houseNumber &&
            address.street &&
            address.city &&
            address.state &&
            address.pincode?.match(/^\d{6}$/);
        if (isComplete) {
            onStepChange("payment");
        } else {
            onStepChange("shipping");
        }
    }, [address, onStepChange]);

    const handleAddressSelect = (addressId) => {
        if (addressId === "new") {
            setSelectedAddressId("new");
            onChange({
                houseNumber: "",
                street: "",
                landmark: "",
                area: "",
                city: "",
                state: "",
                pincode: "",
                country: "India",
            });
        } else {
            setSelectedAddressId(addressId);
            const selectedAddress = addresses.find(
                (addr) => addr._id === addressId
            );
            if (selectedAddress) {
                onChange({
                    houseNumber: selectedAddress.houseNumber || "",
                    street: selectedAddress.street || "",
                    landmark: selectedAddress.landmark || "",
                    area: selectedAddress.area || "",
                    city: selectedAddress.city || "",
                    state: selectedAddress.state || "",
                    pincode: selectedAddress.pincode || "",
                    country: selectedAddress.country || "India",
                });
            }
        }
    };

    const handleInputChange = (field, value) => {
        // Special handling for pincode - only allow numeric values and max 6 digits
        if (field === "pincode") {
            // Remove any non-numeric characters
            const numericValue = value.replace(/[^0-9]/g, "");
            // Limit to 6 digits
            const limitedValue = numericValue.slice(0, 6);
            onChange((prev) => ({ ...prev, [field]: limitedValue }));
        } else {
            onChange((prev) => ({ ...prev, [field]: value }));
        }

        // Clear selected address when user manually edits
        if (selectedAddressId !== "new" && selectedAddressId !== "") {
            setSelectedAddressId("");
        }

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const validateField = (field, value) => {
        let error = "";

        switch (field) {
            case "houseNumber":
            case "street":
            case "city":
            case "state":
                if (!value?.trim()) error = "This field is required";
                break;
            case "pincode":
                if (!value) {
                    error = "Pincode is required";
                } else if (!/^\d{6}$/.test(value)) {
                    if (value.length < 6) {
                        error = "Pincode must be exactly 6 digits";
                    } else {
                        error = "Enter a valid 6-digit pincode";
                    }
                }
                break;
            default:
                break;
        }

        setErrors((prev) => ({ ...prev, [field]: error }));
        return error;
    };

    const handleBlur = (field, value) => {
        validateField(field, value);
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-300">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <FaTruck className="text-[#404040]" />
                <h3 className="text-lg font-semibold text-[#404040]">
                    Shipping Address
                </h3>
            </div>

            {/* Address Selection */}
            {addresses.length > 0 && (
                <div className="mb-6">
                    <label className="block text-sm font-medium text-[#404040] mb-2">
                        Choose from saved addresses
                    </label>
                    <select
                        value={selectedAddressId}
                        onChange={(e) => handleAddressSelect(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#404040] focus:outline-none focus:ring-2 focus:ring-[#C1B086]"
                    >
                        <option value="">Select an address</option>
                        {addresses.map((addr) => (
                            <option key={addr._id} value={addr._id}>
                                {addr.houseNumber}, {addr.street}, {addr.city} -{" "}
                                {addr.pincode}
                                {addr.isDefault && " (Default)"}
                            </option>
                        ))}
                        <option value="new">+ Add new address</option>
                    </select>
                </div>
            )}

            {/* Status Indicators */}
            <div className="flex gap-2 mb-4">
                {selectedAddressId && selectedAddressId !== "new" && (
                    <div className="bg-blue-50 border border-blue-200 rounded px-3 py-1 text-xs text-blue-700 flex items-center gap-1">
                        <FaCheck size={10} />
                        Using saved address
                    </div>
                )}
                {selectedAddressId === "new" && (
                    <div className="bg-green-50 border border-green-200 rounded px-3 py-1 text-xs text-green-700 flex items-center gap-1">
                        <FaPlus size={10} />
                        New address - will be saved when order is placed
                    </div>
                )}
            </div>

            {/* Pre-fill Notice - Only show if no saved addresses */}
            {addresses.length === 0 && user?.profile?.address && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
                    <div className="flex items-center gap-2 text-blue-700 text-sm">
                        <FaMapMarkerAlt />
                        <span>Address pre-filled from your profile</span>
                    </div>
                </div>
            )}

            {/* Address Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-[#404040] mb-1">
                        House Number *
                    </label>
                    <input
                        type="text"
                        placeholder="Enter house number"
                        value={address.houseNumber || ""}
                        onChange={(e) =>
                            handleInputChange("houseNumber", e.target.value)
                        }
                        onBlur={(e) =>
                            handleBlur("houseNumber", e.target.value)
                        }
                        className={`w-full border rounded-lg px-3 py-2 text-[#404040] focus:outline-none focus:ring-2 focus:ring-[#C1B086] ${
                            errors.houseNumber
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        required
                    />
                    {errors.houseNumber && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.houseNumber}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#404040] mb-1">
                        Street *
                    </label>
                    <input
                        type="text"
                        placeholder="Enter street name"
                        value={address.street || ""}
                        onChange={(e) =>
                            handleInputChange("street", e.target.value)
                        }
                        onBlur={(e) => handleBlur("street", e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-[#404040] focus:outline-none focus:ring-2 focus:ring-[#C1B086] ${
                            errors.street ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                    />
                    {errors.street && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.street}
                        </p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-[#404040] mb-1">
                        Landmark (Optional)
                    </label>
                    <input
                        type="text"
                        placeholder="Enter landmark"
                        value={address.landmark || ""}
                        onChange={(e) =>
                            handleInputChange("landmark", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#404040] focus:outline-none focus:ring-2 focus:ring-[#C1B086]"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#404040] mb-1">
                        Area *
                    </label>
                    <input
                        type="text"
                        placeholder="Enter area"
                        value={address.area || ""}
                        onChange={(e) =>
                            handleInputChange("area", e.target.value)
                        }
                        onBlur={(e) => handleBlur("area", e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-[#404040] focus:outline-none focus:ring-2 focus:ring-[#C1B086] ${
                            errors.area ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                    />
                    {errors.area && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.area}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#404040] mb-1">
                        City *
                    </label>
                    <input
                        type="text"
                        placeholder="Enter city"
                        value={address.city || ""}
                        onChange={(e) =>
                            handleInputChange("city", e.target.value)
                        }
                        onBlur={(e) => handleBlur("city", e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-[#404040] focus:outline-none focus:ring-2 focus:ring-[#C1B086] ${
                            errors.city ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                    />
                    {errors.city && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.city}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#404040] mb-1">
                        State *
                    </label>
                    <input
                        type="text"
                        placeholder="Enter state"
                        value={address.state || ""}
                        onChange={(e) =>
                            handleInputChange("state", e.target.value)
                        }
                        onBlur={(e) => handleBlur("state", e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-[#404040] focus:outline-none focus:ring-2 focus:ring-[#C1B086] ${
                            errors.state ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                    />
                    {errors.state && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.state}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#404040] mb-1">
                        Pincode *
                    </label>
                    <input
                        type="text"
                        placeholder="Enter 6-digit pincode"
                        value={address.pincode || ""}
                        onChange={(e) =>
                            handleInputChange("pincode", e.target.value)
                        }
                        onBlur={(e) => handleBlur("pincode", e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-[#404040] focus:outline-none focus:ring-2 focus:ring-[#C1B086] ${
                            errors.pincode
                                ? "border-red-500"
                                : "border-gray-300"
                        }`}
                        pattern="[0-9]{6}"
                        maxLength="6"
                        required
                    />
                    {errors.pincode && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.pincode}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-[#404040] mb-1">
                        Country *
                    </label>
                    <input
                        type="text"
                        value={address.country || "India"}
                        onChange={(e) =>
                            handleInputChange("country", e.target.value)
                        }
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[#404040] bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#C1B086]"
                        required
                    />
                </div>
            </div>

            {/* Required Fields Note */}
            <div className="mt-4 text-xs text-gray-600">
                <p>* Required fields</p>
                <p className="mt-1 text-blue-600">
                    New addresses will be automatically saved when you place
                    your order
                </p>
            </div>
        </div>
    );
};

export default ShippingForm;
