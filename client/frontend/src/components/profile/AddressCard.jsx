import React, { useState } from "react";
import { FaEdit, FaTrash, FaStar } from "react-icons/fa";
import { useProfile } from "../../context/ProfileContext.jsx";

const AddressCard = ({ address, onEdit, onDelete }) => {
    const { setDefaultAddress, loading } = useProfile();
    const [isSettingDefault, setIsSettingDefault] = useState(false);

    const handleSetDefault = async () => {
        if (address.isDefault) return; // Already default
        setIsSettingDefault(true);
        try {
            await setDefaultAddress(address._id);
        } catch (error) {
            console.error("Set default error:", error);
        } finally {
            setIsSettingDefault(false);
        }
    };

    // Helper to format address string
    const formatAddress = () => {
        const parts = [
            address.houseNumber,
            address.street,
            address.area,
            address.city,
        ].filter(Boolean);

        return parts.join(", ");
    };

    const formatFullAddress = () => {
        return [formatAddress(), address.state, address.pincode]
            .filter(Boolean)
            .join(", ");
    };

    return (
        <div
            className={`w-full p-6 rounded-lg shadow-sm border ${
                address.isDefault ? "border-[#B76E79]" : "border-gray-400 "
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg text-gray-800">
                        {address.label}
                    </h3>
                    {address.isDefault && (
                        <span className="bg-[#B76E79] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <FaStar className="text-xs" />
                            Default
                        </span>
                    )}
                </div>
            </div>

            {/* Address Details */}
            <div className="mb-4">
                <p className="text-gray-700 leading-relaxed text-sm">
                    {formatFullAddress()}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    onClick={() => onEdit(address)}
                    disabled={loading}
                    className="flex items-center gap-1 px-4 py-2 text-sm bg-[#B76E79] text-white rounded hover:bg-white hover:text-[#B76E79] hover:border hover:border-[#B76E79] transition-colors disabled:opacity-50 font-medium"
                >
                    <FaEdit className="text-xs" />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(address)}
                    disabled={loading}
                    className="flex items-center gap-1 px-2 py-2 text-sm border border-[#B76E79] text-[#B76E79] bg-white rounded hover:bg-[#B76E79] hover:text-white transition-colors disabled:opacity-50 font-medium min-w-[70px]"
                >
                    <FaTrash className="text-xs" />
                    Delete
                </button>
                {!address.isDefault && (
                    <button
                        onClick={handleSetDefault}
                        disabled={loading || isSettingDefault}
                        className="flex items-center gap-1 px-4 py-2 text-sm border border-[#B76E79] text-[#B76E79] bg-white rounded hover:bg-[#B76E79] hover:text-white transition-colors disabled:opacity-50 font-medium whitespace-nowrap"
                    >
                        {isSettingDefault ? "Setting..." : "Set Default"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AddressCard;
