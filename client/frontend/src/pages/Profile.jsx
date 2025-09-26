import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { FaPlus, FaTimes } from "react-icons/fa";
import Loader from "../components/common/Loader";
import ProfileForm from "../components/profile/ProfileForm";
import AddressCard from "../components/profile/AddressCard";
import AddressModal from "../components/common/AddressModal";
import ConfirmationModal from "../components/common/ConfirmationModal";

const Profile = () => {
    const { logout } = useAuth();
    const { addresses, loading, error, deleteAddress } = useProfile();
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingAddress, setDeletingAddress] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setShowAddressModal(true);
    };

    const handleDeleteAddress = (address) => {
        setDeletingAddress(address);
        setShowDeleteModal(true);
    };

    const handleCloseModals = () => {
        setShowAddressModal(false);
        setShowDeleteModal(false);
        setEditingAddress(null);
        setDeletingAddress(null);
    };

    const handleAddNewAddress = () => {
        setEditingAddress(null);
        setShowAddressModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingAddress) return;

        setIsDeleting(true);
        try {
            await deleteAddress(deletingAddress._id);
            handleCloseModals();
        } catch (error) {
            console.error("Failed to delete address:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex justify-center items-start py-10 bg-gray-100 min-h-screen">
            <div
                className="p-8 rounded-lg shadow-md w-full max-w-4xl"
                style={{ backgroundColor: "#E0E0E0" }}
            >
                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Profile Information Section */}
                <div className="mb-8">
                    <ProfileForm />
                </div>

                {/* Address Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">
                            Saved Addresses
                        </h2>
                        {!showAddressModal && (
                            <button
                                onClick={handleAddNewAddress}
                                disabled={loading}
                                className="flex items-center gap-2 bg-[#B76E79] text-white px-4 py-2 rounded hover:bg-[#C68F98] transition-colors disabled:opacity-50"
                            >
                                <FaPlus className="text-sm" />
                                Add Address
                            </button>
                        )}
                    </div>

                    {/* Loading State */}
                    {loading && addresses.length === 0 && !showAddressModal && (
                        <Loader />
                    )}

                    {/* Address List */}
                    {!loading && addresses.length === 0 && !showAddressModal ? (
                        <div className="text-center py-8 text-gray-600">
                            <p>
                                No addresses saved yet. Use the "Add Address"
                                button above to get started.
                            </p>
                        </div>
                    ) : (
                        !showAddressModal && (
                            <div className="space-y-4">
                                {addresses.map((address) => (
                                    <AddressCard
                                        key={address._id}
                                        address={address}
                                        onEdit={handleEditAddress}
                                        onDelete={handleDeleteAddress}
                                    />
                                ))}
                            </div>
                        )
                    )}
                </div>

                {/* Logout Button */}
                <div className="text-center pt-6 border-t border-gray-300">
                    <button
                        onClick={logout}
                        className="bg-[#B76E79] text-white px-6 py-2 rounded-lg hover:bg-[#C68F98] transition-colors font-medium shadow-sm"
                    >
                        Logout
                    </button>
                </div>

                {/* Modals */}
                <AddressModal
                    isOpen={showAddressModal}
                    onClose={handleCloseModals}
                    editingAddress={editingAddress}
                />

                <ConfirmationModal
                    isOpen={showDeleteModal}
                    onClose={handleCloseModals}
                    onConfirm={handleDeleteConfirm}
                    title="Delete Address"
                    message={`Are you sure you want to delete the address "${deletingAddress?.label}"? This action cannot be undone.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    type="danger"
                    loading={isDeleting}
                />
            </div>
        </div>
    );
};

export default Profile;
