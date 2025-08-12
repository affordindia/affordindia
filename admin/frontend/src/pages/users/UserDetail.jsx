import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaCalendarAlt,
    FaShoppingCart,
    FaRupeeSign,
    FaMapMarkerAlt,
    FaTrash,
    FaUserCheck,
    FaUserTimes,
    FaEye,
} from "react-icons/fa";
import { getUserById, deleteUser, blockUser, unblockUser } from "../../api/users.api.js";
import Loader from "../../components/common/Loader.jsx";

const UserDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        fetchUserDetails();
    }, [id]);

    const fetchUserDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getUserById(id);
            
            // Handle different response formats
            if (response.success) {
                // Use backend stats if available
                const userWithStats = {
                    ...response.user,
                    isActive: !response.user.isBlocked,
                    // Use backend calculated stats if available
                    totalOrders: response.user.stats?.orderCount || response.user.orderCount || 0,
                    totalSpent: response.user.stats?.totalSpent || response.user.totalSpent || 0,
                    reviewCount: response.user.stats?.reviewCount || 0,
                    recentOrders: response.user.recentOrders || []
                };
                setUser(userWithStats);
            } else if (response.user) {
                setUser(response.user);
            } else {
                setUser(response); // Direct user object response
            }
        } catch (err) {
            setError("Failed to fetch user details");
            console.error("Error fetching user details:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleStatus = async () => {
        setActionLoading(true);
        try {
            if (user.isActive) {
                await blockUser(id);
            } else {
                await unblockUser(id);
            }
            await fetchUserDetails(); // Refresh user details
        } catch (err) {
            console.error("Error toggling user status:", err);
            setError("Failed to update user status");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDeleteUser = async () => {
        setActionLoading(true);
        try {
            await deleteUser(id);
            navigate("/users", { 
                state: { message: "User deleted successfully" } 
            });
        } catch (err) {
            console.error("Error deleting user:", err);
            setError("Failed to delete user");
            setShowDeleteConfirm(false);
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatCurrency = (amount) => {
        const validAmount = Number(amount) || 0;
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(validAmount);
    };

    if (loading) {
        return <Loader />;
    }

    if (error || !user) {
        return (
            <div className="p-6">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate("/users")}
                        className="flex items-center text-admin-primary hover:text-admin-primary-dark transition-colors"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Users
                    </button>
                </div>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error || "User not found"}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate("/users")}
                        className="flex items-center text-admin-primary hover:text-admin-primary-dark transition-colors mr-4"
                    >
                        <FaArrowLeft className="mr-2" />
                        Back to Users
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-admin-text">
                            User Details
                        </h1>
                        <p className="text-admin-text-secondary">
                            View and manage user information
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <button
                        onClick={handleToggleStatus}
                        disabled={actionLoading}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors disabled:opacity-50 ${
                            user.isActive
                                ? "bg-red-600 hover:bg-red-700 text-white"
                                : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                    >
                        {user.isActive ? (
                            <>
                                <FaUserTimes className="mr-2" />
                                Block User
                            </>
                        ) : (
                            <>
                                <FaUserCheck className="mr-2" />
                                Unblock User
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main User Information */}
                <div className="lg:col-span-2">
                    <div className="bg-admin-card rounded-lg border border-admin-border p-6 mb-6">
                        <div className="flex items-center mb-6">
                            <div className="flex-shrink-0 h-16 w-16 bg-admin-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mr-4">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-admin-text">
                                    {user.name || "No Name"}
                                </h2>
                                <p className="text-admin-text-secondary">
                                    User ID: {user._id}
                                </p>
                                <div className="flex items-center space-x-2 mt-2">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            user.isActive
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {user.isActive ? "Active" : "Blocked"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-medium text-admin-text mb-4">
                                    Contact Information
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <FaEnvelope className="text-admin-text-secondary mr-3" />
                                        <div>
                                            <p className="text-sm text-admin-text-secondary">
                                                Email
                                            </p>
                                            <p className="text-admin-text">
                                                {user.email || "Not provided"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <FaPhone className="text-admin-text-secondary mr-3" />
                                        <div>
                                            <p className="text-sm text-admin-text-secondary">
                                                Phone
                                            </p>
                                            <p className="text-admin-text">
                                                {user.phone || "Not provided"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-medium text-admin-text mb-4">
                                    Account Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <FaCalendarAlt className="text-admin-text-secondary mr-3" />
                                        <div>
                                            <p className="text-sm text-admin-text-secondary">
                                                Joined
                                            </p>
                                            <p className="text-admin-text">
                                                {formatDate(user.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-admin-card rounded-lg border border-admin-border p-6 mb-6">
                        <h3 className="text-lg font-medium text-admin-text mb-4">
                            Saved Addresses
                        </h3>
                        {user.addresses && user.addresses.length > 0 ? (
                            <div className="space-y-4">
                                {user.addresses.map((address, index) => (
                                    <div
                                        key={index}
                                        className="border border-admin-border rounded-lg p-4"
                                    >
                                        <div className="flex items-start">
                                            <FaMapMarkerAlt className="text-admin-text-secondary mr-3 mt-1" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <p className="font-medium text-admin-text">
                                                        {address.type || "Address"}
                                                    </p>
                                                    {address.isDefault && (
                                                        <span className="px-2 py-1 bg-admin-primary text-white text-xs rounded">
                                                            Default
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-admin-text-secondary text-sm">
                                                    {address.street}, {address.city},{" "}
                                                    {address.state} - {address.zipCode}
                                                </p>
                                                {address.country && (
                                                    <p className="text-admin-text-secondary text-sm">
                                                        {address.country}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FaMapMarkerAlt className="mx-auto text-4xl text-admin-text-secondary mb-4" />
                                <p className="text-admin-text-secondary">No saved addresses</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-admin-card rounded-lg border border-admin-border p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-admin-text">
                                Recent Orders
                            </h3>
                            <button
                                onClick={() => navigate(`/orders?userId=${user._id}`)}
                                className="text-admin-primary hover:text-admin-primary-dark transition-colors text-sm flex items-center"
                            >
                                <FaEye className="mr-1" />
                                View All Orders
                            </button>
                        </div>
                        {user.recentOrders && user.recentOrders.length > 0 ? (
                            <div className="space-y-3">
                                {user.recentOrders.slice(0, 5).map((order) => (
                                    <div
                                        key={order._id}
                                        className="flex items-center justify-between p-3 border border-admin-border rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-admin-text">
                                                Order #{order._id?.slice(-6)}
                                            </p>
                                            <p className="text-sm text-admin-text-secondary">
                                                {formatDate(order.createdAt)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-admin-text">
                                                {formatCurrency(order.total || 0)}
                                            </p>
                                            <p className="text-sm text-admin-text-secondary capitalize">
                                                {order.status}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <FaShoppingCart className="mx-auto text-4xl text-admin-text-secondary mb-4" />
                                <p className="text-admin-text-secondary">No orders</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Statistics Sidebar */}
                <div className="space-y-6">
                    {/* Order Statistics */}
                    <div className="bg-admin-card rounded-lg border border-admin-border p-6">
                        <h3 className="text-lg font-medium text-admin-text mb-4">
                            Order Statistics
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FaShoppingCart className="text-admin-primary mr-3" />
                                    <span className="text-admin-text-secondary">
                                        Total Orders
                                    </span>
                                </div>
                                <span className="font-semibold text-admin-text">
                                    {user.totalOrders || 0}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FaRupeeSign className="text-admin-primary mr-3" />
                                    <span className="text-admin-text-secondary">
                                        Total Spent
                                    </span>
                                </div>
                                <span className="font-semibold text-admin-text">
                                    {formatCurrency(user.totalSpent || 0)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <FaRupeeSign className="text-admin-primary mr-3" />
                                    <span className="text-admin-text-secondary">
                                        Average Order
                                    </span>
                                </div>
                                <span className="font-semibold text-admin-text">
                                    {formatCurrency(
                                        user.totalOrders > 0
                                            ? (user.totalSpent || 0) / user.totalOrders
                                            : 0
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Activity Information */}
                    <div className="bg-admin-card rounded-lg border border-admin-border p-6">
                        <h3 className="text-lg font-medium text-admin-text mb-4">
                            Activity
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-admin-text-secondary">
                                    Last Login
                                </p>
                                <p className="text-admin-text">
                                    {user.lastLogin
                                        ? formatDate(user.lastLogin)
                                        : "Never logged in"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-admin-text-secondary">
                                    Account Created
                                </p>
                                <p className="text-admin-text">
                                    {formatDate(user.createdAt)}
                                </p>
                            </div>
                            {user.lastUpdated && (
                                <div>
                                    <p className="text-sm text-admin-text-secondary">
                                        Last Updated
                                    </p>
                                    <p className="text-admin-text">
                                        {formatDate(user.lastUpdated)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-admin-card rounded-lg border border-admin-border p-6">
                        <h3 className="text-lg font-medium text-admin-text mb-4">
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate(`/orders?userId=${user._id}`)}
                                className="w-full flex items-center justify-center px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors"
                            >
                                <FaEye className="mr-2" />
                                View User Orders
                            </button>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="bg-admin-card rounded-lg border border-red-300 p-6">
                        <h3 className="text-lg font-medium text-red-600 mb-4">
                            Danger Zone
                        </h3>
                        <p className="text-sm text-admin-text-secondary mb-4">
                            User deletion is permanent and cannot be undone. This will remove
                            all user data including order history.
                        </p>
                        {!showDeleteConfirm ? (
                            <button
                                onClick={() => setShowDeleteConfirm(true)}
                                className="w-full flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <FaTrash className="mr-2" />
                                Delete User Account
                            </button>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-sm font-medium text-red-600">
                                    Are you sure you want to delete this user?
                                </p>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleDeleteUser}
                                        disabled={actionLoading}
                                        className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
                                    >
                                        {actionLoading ? "Deleting..." : "Yes, Delete"}
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(false)}
                                        className="flex-1 px-3 py-2 bg-admin-secondary text-admin-text rounded-lg hover:bg-admin-secondary-dark transition-colors text-sm"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetail;
