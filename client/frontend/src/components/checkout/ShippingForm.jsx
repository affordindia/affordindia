import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProfile } from "../../context/ProfileContext.jsx";
import { FaTruck, FaMapMarkerAlt, FaPlus, FaCheck } from "react-icons/fa";

const ShippingForm = ({ address, onChange, onStepChange }) => {
    const { user } = useAuth();
    const { addresses, getDefaultAddress } = useProfile();
    const [errors, setErrors] = useState({});
    const [selectedAddressId, setSelectedAddressId] = useState("");

    // Auto-select default address and pre-fill form
    useEffect(() => {
        const defaultAddress = getDefaultAddress();
        const hasEmptyAddress = Object.keys(address).every(
            (key) => !address[key]
        );
        const hasNoSelectedAddress = !selectedAddressId;

        // Auto-select default address if available and no address is currently selected
        if (defaultAddress && (hasEmptyAddress || hasNoSelectedAddress)) {
            setSelectedAddressId(defaultAddress._id);
            onChange({
                label: defaultAddress.label || "Home",
                houseNumber: defaultAddress.houseNumber || "",
                street: defaultAddress.street || "",
                landmark: defaultAddress.landmark || "",
                area: defaultAddress.area || "",
                city: defaultAddress.city || "",
                state: defaultAddress.state || "",
                pincode: defaultAddress.pincode || "",
                country: defaultAddress.country || "India",
            });
        } else if (
            !defaultAddress &&
            addresses.length > 0 &&
            hasEmptyAddress &&
            hasNoSelectedAddress
        ) {
            // Use first available address if no default
            const firstAddress = addresses[0];
            setSelectedAddressId(firstAddress._id);
            onChange({
                label: firstAddress.label || "Home",
                houseNumber: firstAddress.houseNumber || "",
                street: firstAddress.street || "",
                landmark: firstAddress.landmark || "",
                area: firstAddress.area || "",
                city: firstAddress.city || "",
                state: firstAddress.state || "",
                pincode: firstAddress.pincode || "",
                country: firstAddress.country || "India",
            });
        } else if (
            !addresses.length &&
            user?.profile?.address &&
            hasEmptyAddress &&
            hasNoSelectedAddress
        ) {
            // Fallback to profile address if no saved addresses
            const profileAddress = {
                ...user.profile.address,
                label: "Home",
            };
            onChange(profileAddress);
        }
    }, [addresses, user]);

    // Update step when address is complete
    useEffect(() => {
        const isLabelValid =
            selectedAddressId === "new"
                ? address.label &&
                  ["Home", "Work", "Other"].includes(address.label)
                : true;

        const isComplete =
            isLabelValid &&
            address.houseNumber &&
            address.street &&
            address.area &&
            address.city &&
            address.state &&
            address.pincode?.match(/^\d{6}$/);
        if (isComplete) {
            onStepChange("payment");
        } else {
            onStepChange("shipping");
        }
    }, [address, selectedAddressId, onStepChange]);

    const handleAddressSelect = (addressId) => {
        if (addressId === "new") {
            setSelectedAddressId("new");
            onChange({
                label: "Home", // Default to Home for new addresses
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
                    label: selectedAddress.label || "Home",
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
        let processedValue = value;

        // Special handling for pincode - only allow numeric values and max 6 digits
        if (field === "pincode") {
            // Remove any non-numeric characters and limit to 6 digits
            processedValue = value.replace(/[^0-9]/g, "").slice(0, 6);
        }

        // Update the address field
        const updateData = { [field]: processedValue };

        // Only clear selected address when user manually edits and it's not "new"
        // This prevents clearing when they're intentionally adding a new address
        if (selectedAddressId && selectedAddressId !== "new") {
            setSelectedAddressId("new");
            // Ensure we maintain a label when switching to "new" mode
            if (
                !address.label ||
                !["Home", "Work", "Other"].includes(address.label)
            ) {
                updateData.label = "Home";
            }
        }

        onChange((prev) => ({ ...prev, ...updateData }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: "" }));
        }
    };

    const validateField = (field, value) => {
        let error = "";

        switch (field) {
            case "label":
                if (!value || !["Home", "Work", "Other"].includes(value)) {
                    error = "Please select a valid address type";
                }
                break;
            case "houseNumber":
            case "street":
            case "area":
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
                        {addresses.find(
                            (addr) => addr._id === selectedAddressId
                        )?.isDefault
                            ? "Using default address"
                            : "Using saved address"}
                    </div>
                )}
                {selectedAddressId === "new" && (
                    <div className="bg-green-50 border border-green-200 rounded px-3 py-1 text-xs text-green-700 flex items-center gap-1">
                        <FaPlus size={10} />
                        New address - will be saved when order is placed
                    </div>
                )}
                {!selectedAddressId &&
                    addresses.length === 0 &&
                    user?.profile?.address && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded px-3 py-1 text-xs text-yellow-700 flex items-center gap-1">
                            <FaMapMarkerAlt size={10} />
                            Using profile address
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

                {/* Address Label - Only show for new addresses */}
                {selectedAddressId === "new" && (
                    <div>
                        <label className="block text-sm font-medium text-[#404040] mb-1">
                            Address Label *
                        </label>
                        <select
                            value={address.label || "Home"}
                            onChange={(e) =>
                                handleInputChange("label", e.target.value)
                            }
                            onBlur={(e) => handleBlur("label", e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2 text-[#404040] focus:outline-none focus:ring-2 focus:ring-[#C1B086] ${
                                errors.label
                                    ? "border-red-500"
                                    : "border-gray-300"
                            }`}
                            required
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
                        <p className="text-xs text-gray-500 mt-1">
                            Choose address type for easy identification
                        </p>
                    </div>
                )}
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
