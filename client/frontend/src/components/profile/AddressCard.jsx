import React, { useState } from "react";
import { FaEdit, FaTrash, FaCheck, FaStar } from "react-icons/fa";
import { useProfile } from "../../context/ProfileContext.jsx";

const AddressCard = ({ address, onEdit }) => {
    const { deleteAddress, setDefaultAddress, loading } = useProfile();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSettingDefault, setIsSettingDefault] = useState(false);

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this address?")) {
            setIsDeleting(true);
            try {
                await deleteAddress(address._id);
            } catch (error) {
                console.error("Delete error:", error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

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

    const formatAddress = () => {
        const parts = [
            address.houseNumber,
            address.street,
            address.landmark,
            address.area,
            address.city,
            address.state,
            address.pincode,
        ].filter(Boolean);

        return parts.join(", ");
    };

    return (
        <div
            className={`w-full p-6 rounded-lg shadow-sm border ${
                address.isDefault
                    ? "border-black bg-gray-50"
                    : "border-gray-400 bg-gray-50"
            }`}
        >
            {/* Header with Label and Default Badge */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg text-gray-800">
                        {address.label}
                    </h3>
                    {address.isDefault && (
                        <span className="bg-black text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                            <FaStar className="text-xs" />
                            Default
                        </span>
                    )}
                </div>
                {address.phone && (
                    <p className="text-sm text-gray-600 font-medium">
                        {address.phone}
                    </p>
                )}
            </div>

            {/* Address Details */}
            <div className="mb-6">
                <p className="text-gray-700 leading-relaxed text-sm">
                    {formatAddress()}
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(address)}
                        disabled={loading}
                        className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-200 border border-gray-400 text-gray-800 rounded hover:bg-gray-300 transition-colors disabled:opacity-50 font-medium"
                    >
                        <FaEdit className="text-xs" />
                        Edit
                    </button>

                    <button
                        onClick={handleDelete}
                        disabled={loading || isDeleting}
                        className="flex items-center gap-1 px-4 py-2 text-sm bg-gray-200 border border-gray-400 text-red-700 rounded hover:bg-red-100 transition-colors disabled:opacity-50 font-medium"
                    >
                        <FaTrash className="text-xs" />
                        {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                </div>

                {!address.isDefault && (
                    <button
                        onClick={handleSetDefault}
                        disabled={loading || isSettingDefault}
                        className="flex items-center gap-1 px-4 py-2 text-sm bg-black text-white rounded hover:bg-gray-800 transition-colors disabled:opacity-50 font-medium"
                    >
                        <FaCheck className="text-xs" />
                        {isSettingDefault ? "Setting..." : "Set Default"}
                    </button>
                )}
            </div>
        </div>
    );
};

export default AddressCard;
