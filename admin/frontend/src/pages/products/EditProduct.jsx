import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaUpload, FaTrash, FaArrowLeft, FaSave } from "react-icons/fa";
import { getProduct, updateProduct } from "../../api/products.api.js";
import { getCategories, getRootCategories } from "../../api/categories.api";
import Loader from "../../components/common/Loader.jsx";
import SubcategorySelector from "../../components/common/SubcategorySelector.jsx";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        category: "",
        subcategories: [],
        stock: "",
        discount: "",
        isFeatured: false,
    });
    const [existingImages, setExistingImages] = useState([]);
    const [newImages, setNewImages] = useState([]);
    const [newImagePreviews, setNewImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        fetchProduct();
        fetchCategories();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const result = await getProduct(id);
            if (result.success) {
                const product = result.data;
                setFormData({
                    name: product.name || "",
                    description: product.description || "",
                    price: product.price?.toString() || "",
                    category: product.category?._id || "",
                    subcategories:
                        product.subcategories?.map((sub) => sub._id) || [],
                    stock: product.stock?.toString() || "",
                    discount: product.discount?.toString() || "",
                    isFeatured: product.isFeatured || false,
                });
                setExistingImages(product.images || []);
            } else {
                navigate("/products");
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            navigate("/products");
        }
    };

    const fetchCategories = async () => {
        try {
            const result = await getRootCategories(); // Only fetch root categories
            if (result.success) {
                setCategories(result.data || []);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        // Clear error for this field
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }

        // Clear subcategories when category changes
        if (name === "category" && value !== formData.category) {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
                subcategories: [], // Reset subcategories when main category changes
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleSubcategoriesChange = (subcategories) => {
        setFormData((prev) => ({
            ...prev,
            subcategories,
        }));

        // Clear subcategories error if any
        if (errors.subcategories) {
            setErrors((prev) => ({
                ...prev,
                subcategories: "",
            }));
        }
    };

    const handleNewImageUpload = (e) => {
        const files = Array.from(e.target.files);

        files.forEach((file) => {
            if (file.type.startsWith("image/")) {
                setNewImages((prev) => [...prev, file]);

                // Create preview
                const reader = new FileReader();
                reader.onload = (e) => {
                    setNewImagePreviews((prev) => [
                        ...prev,
                        {
                            file: file,
                            url: e.target.result,
                        },
                    ]);
                };
                reader.readAsDataURL(file);
            }
        });
    };

    const removeExistingImage = (index) => {
        setExistingImages((prev) => prev.filter((_, i) => i !== index));
    };

    const removeNewImage = (index) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
        setNewImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Product name is required";
        }

        if (!formData.price || formData.price <= 0) {
            newErrors.price = "Valid price is required";
        }

        if (!formData.category) {
            newErrors.category = "Category is required";
        }

        if (!formData.stock || formData.stock < 0) {
            newErrors.stock = "Valid stock quantity is required";
        }

        if (
            formData.discount &&
            (formData.discount < 0 || formData.discount > 100)
        ) {
            newErrors.discount = "Discount must be between 0 and 100";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSubmitLoading(true);
        try {
            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                discount: formData.discount ? parseFloat(formData.discount) : 0,
                // Ensure subcategories is always an array
                subcategories: Array.isArray(formData.subcategories)
                    ? formData.subcategories
                    : formData.subcategories
                    ? [formData.subcategories]
                    : [],
                existingImages: existingImages,
                images: newImages,
            };

            const result = await updateProduct(id, productData);

            if (result.success) {
                navigate("/products");
            } else {
                console.error("❌ Product update failed:", result.error);
                setErrors({ submit: result.error });
            }
        } catch (error) {
            console.error("❌ Product update exception:", error);
            setErrors({
                submit: "Failed to update product. Please try again.",
            });
        } finally {
            setSubmitLoading(false);
        }
    };

    if (loading) {
        return <Loader fullScreen={true} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate("/products")}
                    className="p-2 hover:bg-admin-bg rounded-lg transition-colors"
                >
                    <FaArrowLeft className="w-5 h-5 text-admin-text-secondary" />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-admin-text">
                        Edit Product
                    </h1>
                    <p className="text-admin-text-secondary">
                        Update product information
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Images Section */}
                <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                    <h3 className="text-lg font-semibold text-admin-text mb-4">
                        Product Images
                    </h3>

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-admin-text mb-2">
                                Current Images
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                {existingImages.map((imageUrl, index) => (
                                    <div key={index} className="relative group">
                                        <img
                                            src={imageUrl}
                                            alt={`Existing ${index + 1}`}
                                            className="w-full aspect-square object-cover rounded-lg"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeExistingImage(index)
                                            }
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <FaTrash className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Add New Images */}
                    <div className="border-2 border-dashed border-admin-border rounded-lg p-4 text-center hover:border-admin-primary transition-colors cursor-pointer mb-4">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleNewImageUpload}
                            className="hidden"
                            id="image-upload"
                        />
                        <label
                            htmlFor="image-upload"
                            className="cursor-pointer"
                        >
                            <FaUpload className="w-8 h-8 text-admin-text-secondary mx-auto mb-2" />
                            <p className="text-admin-text-secondary">
                                Add more images
                            </p>
                            <p className="text-sm text-admin-text-muted mt-1">
                                PNG, JPG, JPEG up to 10MB each
                            </p>
                        </label>
                    </div>

                    {/* New Image Previews */}
                    {newImagePreviews.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <h4 className="text-sm font-medium text-admin-text mb-2 col-span-2">
                                New Images
                            </h4>
                            {newImagePreviews.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={preview.url}
                                        alt={`New ${index + 1}`}
                                        className="w-full aspect-square object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FaTrash className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                    <h3 className="text-lg font-semibold text-admin-text mb-4">
                        Product Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Name */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-admin-text mb-2">
                                Product Name *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent ${
                                    errors.name
                                        ? "border-red-500"
                                        : "border-admin-border"
                                }`}
                                placeholder="Enter product name"
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-admin-text mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                placeholder="Enter product description"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-admin-text mb-2">
                                Price (₹) *
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                min="0"
                                step="0.01"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent ${
                                    errors.price
                                        ? "border-red-500"
                                        : "border-admin-border"
                                }`}
                                placeholder="0.00"
                            />
                            {errors.price && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.price}
                                </p>
                            )}
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-admin-text mb-2">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                min="0"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent ${
                                    errors.stock
                                        ? "border-red-500"
                                        : "border-admin-border"
                                }`}
                                placeholder="0"
                            />
                            {errors.stock && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.stock}
                                </p>
                            )}
                        </div>

                        {/* Discount */}
                        <div>
                            <label className="block text-sm font-medium text-admin-text mb-2">
                                Discount (%)
                            </label>
                            <input
                                type="number"
                                name="discount"
                                value={formData.discount}
                                onChange={handleInputChange}
                                min="0"
                                max="100"
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent ${
                                    errors.discount
                                        ? "border-red-500"
                                        : "border-admin-border"
                                }`}
                                placeholder="0"
                            />
                            {errors.discount && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.discount}
                                </p>
                            )}
                            <p className="text-sm text-admin-text-secondary mt-1">
                                {formData.discount && formData.price
                                    ? `Final Price: ₹${Math.round(
                                          formData.price *
                                              (1 - formData.discount / 100)
                                      ).toLocaleString()}`
                                    : "Enter percentage discount (0-100)"}
                            </p>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-medium text-admin-text mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent ${
                                    errors.category
                                        ? "border-red-500"
                                        : "border-admin-border"
                                }`}
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option
                                        key={category._id}
                                        value={category._id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {errors.category && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.category}
                                </p>
                            )}
                        </div>

                        {/* Subcategories */}
                        <div>
                            <SubcategorySelector
                                selectedCategory={formData.category}
                                selectedSubcategories={formData.subcategories}
                                onSubcategoriesChange={
                                    handleSubcategoriesChange
                                }
                                error={errors.subcategories}
                            />
                        </div>

                        {/* Featured Toggle */}
                        <div className="md:col-span-2">
                            <label className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={handleInputChange}
                                    className="w-4 h-4 text-admin-primary bg-admin-card border-admin-border rounded focus:ring-admin-primary focus:ring-2"
                                />
                                <span className="text-sm font-medium text-admin-text">
                                    Featured Product
                                </span>
                            </label>
                            <p className="text-sm text-admin-text-secondary mt-1">
                                Featured products will be highlighted on the
                                homepage
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form Errors */}
                {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800 text-sm">{errors.submit}</p>
                    </div>
                )}

                {/* Submit Buttons */}
                <div className="flex gap-4 justify-end">
                    <button
                        type="button"
                        onClick={() => navigate("/products")}
                        className="px-6 py-2 border border-admin-border rounded-lg hover:bg-admin-bg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitLoading}
                        className="px-6 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {submitLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Updating...
                            </>
                        ) : (
                            <>
                                <FaSave className="w-4 h-4" />
                                Update Product
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProduct;
