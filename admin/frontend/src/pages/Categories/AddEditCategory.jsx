import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    getCategory,
    createCategory,
    updateCategory,
} from "../../api/categories.api";
import { FiArrowLeft, FiSave, FiUpload, FiX } from "react-icons/fi";
import Loader from "../../components/common/Loader.jsx";

const AddEditCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "active",
        order: 0,
    });

    useEffect(() => {
        if (isEdit) {
            fetchCategory();
        }
    }, [id]);

    const fetchCategory = async () => {
        try {
            setLoading(true);
            const response = await getCategory(id);
            if (response.success) {
                const category = response.data;
                setFormData({
                    name: category.name || "",
                    description: category.description || "",
                    status: category.status || "active",
                    order: category.order || 0,
                });
                if (category.image) {
                    setImagePreview(category.image);
                }
            } else {
                console.error("Error fetching category:", response.error);
            }
        } catch (error) {
            console.error("Error fetching category:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview("");
        // Reset file input
        const fileInput = document.getElementById("image-input");
        if (fileInput) {
            fileInput.value = "";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            const submitFormData = new FormData();
            submitFormData.append("name", formData.name);
            submitFormData.append("description", formData.description);
            submitFormData.append("status", formData.status);
            submitFormData.append("order", formData.order);

            if (imageFile) {
                submitFormData.append("image", imageFile);
            }

            let response;
            if (isEdit) {
                response = await updateCategory(id, submitFormData);
            } else {
                response = await createCategory(submitFormData);
            }

            if (response.success) {
                navigate("/categories");
            } else {
                alert(`Error: ${response.error}`);
            }
        } catch (error) {
            console.error("Error submitting category:", error);
            alert("Error saving category. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit) {
        return <Loader fullScreen={true} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <button
                        onClick={() => navigate("/categories")}
                        className="flex items-center gap-2 text-admin-text-secondary hover:text-admin-text mb-4 transition-colors"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Back to Categories
                    </button>
                    <h1 className="text-2xl font-bold text-admin-text">
                        {isEdit ? "Edit Category" : "Add New Category"}
                    </h1>
                </div>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-admin-card rounded-lg shadow-sm border border-admin-border p-6"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Basic Info */}
                    <div className="space-y-6">
                        {/* Category Name */}
                        <div>
                            <label className="block text-sm font-medium text-admin-text mb-2">
                                Category Name{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-admin-primary"
                                placeholder="Enter category name"
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-admin-text mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-admin-primary resize-none"
                                placeholder="Enter category description"
                            />
                        </div>

                        {/* Status and Order */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-admin-text mb-2">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-admin-primary"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-admin-text mb-2">
                                    Display Order
                                </label>
                                <input
                                    type="number"
                                    name="order"
                                    value={formData.order}
                                    onChange={handleInputChange}
                                    className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-admin-primary"
                                    placeholder="0"
                                    min="0"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Image Upload */}
                    <div>
                        <label className="block text-sm font-medium text-admin-text mb-2">
                            Category Image
                        </label>
                        <div className="border border-admin-border rounded-lg p-4">
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Category preview"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-sm text-gray-600 mb-2">
                                        Upload category image
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG up to 2MB
                                    </p>
                                </div>
                            )}

                            <input
                                id="image-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mt-4 w-full text-sm text-admin-text file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-admin-primary file:text-white hover:file:bg-admin-primary-dark file:cursor-pointer"
                            />
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-admin-primary text-white px-6 py-2 rounded-lg hover:bg-admin-primary-dark transition-colors disabled:opacity-50 font-medium"
                    >
                        <FiSave className="w-4 h-4" />
                        {loading
                            ? "Saving..."
                            : isEdit
                            ? "Update Category"
                            : "Create Category"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddEditCategory;
