import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiEdit, FiTrash2, FiImage } from "react-icons/fi";
import { getCategories, deleteCategory } from "../../api/categories.api";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        categoryId: null,
        categoryName: "",
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await getCategories();
            if (response.success) {
                setCategories(response.data || []);
            } else {
                console.error("Error fetching categories:", response.error);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = (categoryId, categoryName) => {
        setDeleteModal({
            isOpen: true,
            categoryId,
            categoryName,
        });
    };

    const confirmDelete = async () => {
        try {
            const response = await deleteCategory(deleteModal.categoryId);
            if (response.success) {
                fetchCategories();
                setDeleteModal({
                    isOpen: false,
                    categoryId: null,
                    categoryName: "",
                });
            } else {
                console.error("Error deleting category:", response.error);
            }
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    const cancelDelete = () => {
        setDeleteModal({ isOpen: false, categoryId: null, categoryName: "" });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-admin-text">
                        Categories
                    </h1>
                    <p className="text-admin-text-secondary">
                        Manage product categories ({categories.length}{" "}
                        categories)
                    </p>
                </div>
                <Link
                    to="/categories/add"
                    className="flex items-center gap-2 bg-admin-primary text-white px-4 py-2 rounded-lg hover:bg-admin-primary-dark transition-colors"
                >
                    <FiPlus className="w-4 h-4" />
                    Add Category
                </Link>
            </div>

            {/* Categories Table */}
            {categories.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-admin-text-muted mb-4">
                        <FiImage className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-medium text-admin-text mb-2">
                        No categories found
                    </h3>
                    <p className="text-admin-text-secondary mb-4">
                        Get started by creating your first category
                    </p>
                    <Link
                        to="/categories/add"
                        className="inline-flex items-center gap-2 bg-admin-primary text-white px-4 py-2 rounded-lg hover:bg-admin-primary-dark transition-colors"
                    >
                        <FiPlus className="w-4 h-4" />
                        Add First Category
                    </Link>
                </div>
            ) : (
                <div className="bg-admin-card rounded-lg shadow-sm border border-admin-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-admin-bg border-b border-admin-border">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-admin-text">
                                        Image
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-admin-text">
                                        Name
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-admin-text">
                                        Description
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-admin-text">
                                        Status
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-admin-text">
                                        Order
                                    </th>
                                    <th className="text-center py-3 px-4 font-medium text-admin-text">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-admin-border">
                                {categories.map((category) => (
                                    <tr
                                        key={category._id}
                                        className="hover:bg-admin-bg/50"
                                    >
                                        {/* Image */}
                                        <td className="py-3 px-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                {category.image ? (
                                                    <img
                                                        src={category.image}
                                                        alt={category.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                        <FiImage className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Name */}
                                        <td className="py-3 px-4">
                                            <div className="font-medium text-admin-text">
                                                {category.name}
                                            </div>
                                        </td>

                                        {/* Description */}
                                        <td className="py-3 px-4">
                                            <div className="text-admin-text-secondary max-w-xs">
                                                {category.description ? (
                                                    <span className="line-clamp-2">
                                                        {category.description}
                                                    </span>
                                                ) : (
                                                    <span className="text-admin-text-muted italic">
                                                        No description
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    category.status === "active"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                            >
                                                {category.status === "active"
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </td>

                                        {/* Order */}
                                        <td className="py-3 px-4">
                                            <span className="text-admin-text-secondary">
                                                {category.order || 0}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3 px-4">
                                            <div className="flex items-center justify-center gap-2">
                                                <Link
                                                    to={`/categories/edit/${category._id}`}
                                                    className="bg-admin-primary text-white py-1.5 px-3 rounded text-sm hover:bg-admin-primary-dark transition-colors flex items-center gap-1"
                                                >
                                                    <FiEdit className="w-3 h-3" />
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteCategory(
                                                            category._id,
                                                            category.name
                                                        )
                                                    }
                                                    className="bg-red-500 text-white py-1.5 px-3 rounded text-sm hover:bg-red-600 transition-colors flex items-center gap-1"
                                                >
                                                    <FiTrash2 className="w-3 h-3" />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-admin-card rounded-lg p-6 max-w-md w-full mx-4 border border-admin-border">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <FiTrash2 className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-admin-text">
                                    Delete Category
                                </h3>
                                <p className="text-admin-text-secondary text-sm">
                                    This action cannot be undone
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-admin-text">
                                Are you sure you want to delete the category{" "}
                                <strong>{deleteModal.categoryName}</strong>?
                            </p>
                            <p className="text-admin-text-secondary text-sm mt-2">
                                This will permanently remove the category and
                                may affect products using this category.
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
                                Delete Category
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Categories;
