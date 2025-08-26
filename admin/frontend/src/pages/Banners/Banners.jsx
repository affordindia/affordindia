import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FiPlus,
    FiEdit,
    FiTrash2,
    FiImage,
    FiExternalLink,
    FiCalendar,
    FiEye,
} from "react-icons/fi";
import { getBanners, deleteBanner } from "../../api/banners.api";
import Loader from "../../components/common/Loader.jsx";
import ProtectedComponent from "../../components/common/ProtectedComponent.jsx";

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        bannerId: null,
        bannerTitle: "",
    });

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getBanners();
            if (response.success) {
                setBanners(response.data || []);
            } else {
                setError(response.error || "Failed to fetch banners");
            }
        } catch (error) {
            setError("Failed to fetch banners");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteBanner = (bannerId, bannerTitle) => {
        setDeleteModal({
            isOpen: true,
            bannerId,
            bannerTitle,
        });
    };

    const confirmDelete = async () => {
        try {
            const response = await deleteBanner(deleteModal.bannerId);
            if (response.success) {
                fetchBanners();
                setDeleteModal({
                    isOpen: false,
                    bannerId: null,
                    bannerTitle: "",
                });
            } else {
                setError(response.error || "Failed to delete banner");
                setDeleteModal({
                    isOpen: false,
                    bannerId: null,
                    bannerTitle: "",
                });
            }
        } catch (error) {
            setError("Failed to delete banner");
            setDeleteModal({
                isOpen: false,
                bannerId: null,
                bannerTitle: "",
            });
        }
    };

    const cancelDelete = () => {
        setDeleteModal({ isOpen: false, bannerId: null, bannerTitle: "" });
    };

    const formatDate = (date) => {
        if (!date) return "Not set";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800";
            case "scheduled":
                return "bg-blue-100 text-blue-800";
            case "inactive":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return <Loader fullScreen={true} />;
    }

    // Error Modal
    if (error) {
        return (
            <div className="fixed inset-0 backdrop-blur-sm bg-opacity-40 z-50 flex items-center justify-center p-4">
                <div className="bg-admin-card rounded-lg p-6 max-w-md w-full border border-admin-border shadow-xl text-center">
                    <div className="text-admin-error text-lg mb-4">
                        ⚠️ {error}
                    </div>
                    <button
                        onClick={() => setError(null)}
                        className="mt-4 px-6 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors font-semibold"
                    >
                        OK
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-admin-text">
                        Banners
                    </h1>
                    <p className="text-admin-text-secondary">
                        Manage website banners ({banners.length} banners)
                    </p>
                </div>
                <ProtectedComponent permission="banners.create" view={true}>
                    <Link
                        to="/banners/add"
                        className="flex items-center gap-2 bg-admin-primary text-white px-4 py-2 rounded-lg hover:bg-admin-primary-dark transition-colors"
                    >
                        <FiPlus className="w-4 h-4" />
                        Add Banner
                    </Link>
                </ProtectedComponent>
            </div>

            {/* Banners List */}
            {banners.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-admin-text-muted mb-4">
                        <FiImage className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-admin-text mb-2">
                        No banners found
                    </h3>
                    <p className="text-admin-text-secondary mb-4">
                        Get started by creating your first banner
                    </p>
                    <Link
                        to="/banners/add"
                        className="inline-flex items-center gap-2 bg-admin-primary text-white px-4 py-2 rounded-lg hover:bg-admin-primary-dark transition-colors"
                    >
                        <FiPlus className="w-4 h-4" />
                        Add First Banner
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {banners.map((banner) => (
                        <div
                            key={banner._id}
                            className="bg-admin-card rounded-lg shadow-sm border border-admin-border overflow-hidden"
                        >
                            {/* Banner Image - Full Width */}
                            <div className="relative">
                                {banner.image ? (
                                    <div className="w-full bg-gray-50">
                                        <img
                                            src={banner.image}
                                            alt={banner.title}
                                            className="w-full h-auto object-contain max-h-80"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-48 flex items-center justify-center text-gray-400 bg-gray-100">
                                        <FiImage className="w-16 h-16" />
                                    </div>
                                )}

                                {/* Status Badge on Image */}
                                <div className="absolute top-4 left-4">
                                    <span
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                                            banner.status
                                        )}`}
                                    >
                                        {banner.status
                                            ?.charAt(0)
                                            .toUpperCase() +
                                            banner.status?.slice(1) ||
                                            "Inactive"}
                                    </span>
                                </div>
                            </div>

                            {/* Banner Details - Full Width Below Image */}
                            <div className="p-6">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                    {/* Left Side - Main Info */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-start justify-between lg:justify-start lg:gap-8">
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-semibold text-admin-text mb-2">
                                                    {banner.title}
                                                </h3>
                                                {banner.material && (
                                                    <p className="text-admin-text-secondary mb-3">
                                                        <span className="font-medium">
                                                            Category:
                                                        </span>{" "}
                                                        {banner.material}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-admin-text-muted whitespace-nowrap lg:text-base">
                                                Order: {banner.order || 0}
                                            </span>
                                        </div>

                                        {/* Link */}
                                        {banner.link && (
                                            <div className="flex items-start gap-3">
                                                <FiExternalLink className="w-5 h-5 text-admin-text-secondary mt-0.5 flex-shrink-0" />
                                                <span className="text-admin-text-secondary break-all">
                                                    {banner.link}
                                                </span>
                                            </div>
                                        )}

                                        {/* Date Range and Status */}
                                        <div className="flex flex-wrap items-center gap-6 text-admin-text-secondary">
                                            <div className="flex items-center gap-2">
                                                <FiCalendar className="w-4 h-4" />
                                                <span>
                                                    <strong>Start:</strong>{" "}
                                                    {formatDate(
                                                        banner.startDate
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FiCalendar className="w-4 h-4" />
                                                <span>
                                                    <strong>End:</strong>{" "}
                                                    {formatDate(banner.endDate)}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FiEye className="w-4 h-4" />
                                                <span
                                                    className={`font-medium ${
                                                        banner.isActive
                                                            ? "text-green-600"
                                                            : "text-gray-600"
                                                    }`}
                                                >
                                                    {banner.isActive
                                                        ? "Visible"
                                                        : "Hidden"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side - Actions */}
                                    <div className="flex lg:flex-col gap-3 lg:min-w-max">
                                        <ProtectedComponent
                                            permission="banners.update"
                                            view={true}
                                        >
                                            <Link
                                                to={`/banners/edit/${banner._id}`}
                                                className="bg-admin-primary text-white py-2.5 px-6 rounded-lg hover:bg-admin-primary-dark transition-colors flex items-center justify-center gap-2 font-medium"
                                            >
                                                <FiEdit className="w-4 h-4" />
                                                Edit Banner
                                            </Link>
                                        </ProtectedComponent>
                                        <ProtectedComponent
                                            permission="banners.update"
                                            view={true}
                                        >
                                            <button
                                                onClick={() =>
                                                    handleDeleteBanner(
                                                        banner._id,
                                                        banner.title
                                                    )
                                                }
                                                className="bg-red-500 text-white py-2.5 px-6 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 font-medium"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </ProtectedComponent>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-admin-card rounded-lg p-6 max-w-md w-full mx-4 border border-admin-border">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <FiTrash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-admin-text">
                                    Delete Banner
                                </h3>
                                <p className="text-admin-text-secondary text-sm">
                                    This action cannot be undone
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-admin-text">
                                Are you sure you want to delete the banner{" "}
                                <strong>{deleteModal.bannerTitle}</strong>?
                            </p>
                            <p className="text-admin-text-secondary text-sm mt-2">
                                This will permanently remove the banner from
                                your website.
                            </p>
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 text-admin-text-secondary hover:text-admin-text border border-admin-border rounded-lg hover:bg-admin-bg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                            >
                                Delete Banner
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Banners;
