import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    FiArrowLeft,
    FiUpload,
    FiX,
    FiCalendar,
    FiExternalLink,
    FiEye,
} from "react-icons/fi";
import { createBanner, updateBanner, getBanner } from "../../api/banners.api";
import { getCategories } from "../../api/categories.api";

const AddEditBanner = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEditing = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        image: null,
        material: "",
        link: "",
        isActive: true,
        startDate: "",
        endDate: "",
        status: "inactive",
        order: 0,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchCategories();
        if (isEditing) {
            fetchBanner();
        }
    }, [id, isEditing]);

    const fetchBanner = async () => {
        try {
            setLoading(true);
            const response = await getBanner(id);
            if (response.success) {
                const banner = response.data;
                setFormData({
                    title: banner.title || "",
                    image: null, // Keep as null for file input
                    material: banner.material || "",
                    link: banner.link || "",
                    isActive: banner.isActive ?? true,
                    startDate: banner.startDate
                        ? new Date(banner.startDate).toISOString().split("T")[0]
                        : "",
                    endDate: banner.endDate
                        ? new Date(banner.endDate).toISOString().split("T")[0]
                        : "",
                    status: banner.status || "inactive",
                    order: banner.order || 0,
                });
                setImagePreview(banner.image);
            } else {
                console.error("Error fetching banner:", response.error);
            }
        } catch (error) {
            console.error("Error fetching banner:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            if (response.success) {
                setCategories(response.data || []);
            } else {
                console.error("Error fetching categories:", response.error);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));

        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                image: file,
            }));

            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Clear error
            if (errors.image) {
                setErrors((prev) => ({
                    ...prev,
                    image: "",
                }));
            }
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({
            ...prev,
            image: null,
        }));
        setImagePreview(null);

        // Reset file input
        const fileInput = document.getElementById("image-upload");
        if (fileInput) fileInput.value = "";
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!isEditing && !formData.image) {
            newErrors.image = "Banner image is required";
        }

        if (formData.startDate && formData.endDate) {
            if (new Date(formData.startDate) >= new Date(formData.endDate)) {
                newErrors.endDate = "End date must be after start date";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            setLoading(true);

            // Create FormData for file upload
            const submitData = new FormData();
            submitData.append("title", formData.title);
            submitData.append("material", formData.material);
            submitData.append("link", formData.link);
            submitData.append("isActive", formData.isActive);
            submitData.append("startDate", formData.startDate);
            submitData.append("endDate", formData.endDate);
            submitData.append("status", formData.status);
            submitData.append("order", formData.order);

            if (formData.image) {
                submitData.append("image", formData.image);
            }

            const response = isEditing
                ? await updateBanner(id, submitData)
                : await createBanner(submitData);

            if (response.success) {
                navigate("/banners");
            } else {
                console.error("Error saving banner:", response.error);
            }
        } catch (error) {
            console.error("Error saving banner:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditing) {
        return (
            <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/banners")}
                    className="p-2 hover:bg-admin-bg rounded-lg transition-colors"
                >
                    <FiArrowLeft className="w-5 h-5 text-admin-text" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-admin-text">
                        {isEditing ? "Edit Banner" : "Add New Banner"}
                    </h1>
                    <p className="text-admin-text-secondary">
                        {isEditing
                            ? "Update banner details"
                            : "Create a new banner for your website"}
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="bg-admin-card rounded-lg shadow-sm border border-admin-border">
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Banner Image */}
                    <div>
                        <label className="block text-sm font-medium text-admin-text mb-2">
                            Banner Image *
                        </label>
                        <div className="space-y-4">
                            {imagePreview ? (
                                <div className="relative">
                                    <div className="w-full bg-gray-50 rounded-lg overflow-hidden border border-admin-border">
                                        <img
                                            src={imagePreview}
                                            alt="Banner preview"
                                            className="w-full h-auto object-contain max-h-80"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                    >
                                        <FiX className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="w-full h-48 border-2 border-dashed border-admin-border rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                    onClick={() =>
                                        document
                                            .getElementById("image-upload")
                                            .click()
                                    }
                                >
                                    <div className="text-center">
                                        <FiUpload className="w-12 h-12 text-admin-text-muted mx-auto mb-3" />
                                        <p className="text-admin-text-muted text-lg font-medium">
                                            Click to upload banner image
                                        </p>
                                        <p className="text-admin-text-muted text-sm mt-1">
                                            Banners will be displayed at full
                                            width
                                        </p>
                                    </div>
                                </div>
                            )}
                            <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            {errors.image && (
                                <p className="text-red-500 text-sm">
                                    {errors.image}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Title */}
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-medium text-admin-text mb-2"
                            >
                                Banner Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                placeholder="Enter banner title"
                            />
                            {errors.title && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Material */}
                        <div>
                            <label
                                htmlFor="material"
                                className="block text-sm font-medium text-admin-text mb-2"
                            >
                                Category
                            </label>
                            <select
                                id="material"
                                name="material"
                                value={formData.material}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option
                                        key={category._id}
                                        value={category.name}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Link */}
                        <div>
                            <label
                                htmlFor="link"
                                className="flex items-center gap-2 text-sm font-medium text-admin-text mb-2"
                            >
                                <FiExternalLink className="w-4 h-4" />
                                Link (URL or Path)
                            </label>
                            <input
                                type="text"
                                id="link"
                                name="link"
                                value={formData.link}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                placeholder="e.g., https://example.com or /products/category"
                            />
                        </div>

                        {/* Order */}
                        <div>
                            <label
                                htmlFor="order"
                                className="block text-sm font-medium text-admin-text mb-2"
                            >
                                Display Order
                            </label>
                            <input
                                type="number"
                                id="order"
                                name="order"
                                value={formData.order}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                placeholder="0"
                                min="0"
                            />
                        </div>

                        {/* Start Date */}
                        <div>
                            <label
                                htmlFor="startDate"
                                className="flex items-center gap-2 text-sm font-medium text-admin-text mb-2"
                            >
                                <FiCalendar className="w-4 h-4" />
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <label
                                htmlFor="endDate"
                                className="flex items-center gap-2 text-sm font-medium text-admin-text mb-2"
                            >
                                <FiCalendar className="w-4 h-4" />
                                End Date
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                            />
                            {errors.endDate && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.endDate}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div>
                            <label
                                htmlFor="status"
                                className="block text-sm font-medium text-admin-text mb-2"
                            >
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleInputChange}
                                className="w-full p-3 border border-admin-border rounded-lg focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                            >
                                <option value="inactive">Inactive</option>
                                <option value="active">Active</option>
                                <option value="scheduled">Scheduled</option>
                            </select>
                        </div>

                        {/* Is Active */}
                        <div>
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-admin-primary border-admin-border rounded focus:ring-admin-primary"
                                />
                                <div className="flex items-center gap-2">
                                    <FiEye className="w-4 h-4 text-admin-text-secondary" />
                                    <span className="text-sm font-medium text-admin-text">
                                        Visible on website
                                    </span>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4 pt-6 border-t border-admin-border">
                        <button
                            type="button"
                            onClick={() => navigate("/banners")}
                            className="px-6 py-2 text-admin-text-secondary hover:text-admin-text border border-admin-border rounded-lg hover:bg-admin-bg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading
                                ? "Saving..."
                                : isEditing
                                ? "Update Banner"
                                : "Create Banner"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditBanner;
