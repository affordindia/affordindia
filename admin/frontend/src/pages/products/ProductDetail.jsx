import React, { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
    FaArrowLeft,
    FaEdit,
    FaTrash,
    FaStar,
    FaBox,
    FaTag,
    FaEye,
} from "react-icons/fa";
import {
    getProduct,
    deleteProduct,
    toggleProductFeature,
} from "../../api/products.api.js";
import Loader from "../../components/common/Loader.jsx";
import ProtectedComponent from "../../components/common/ProtectedComponent.jsx";

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getProduct(id);
            if (result.success) {
                setProduct(result.data);
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error("Error fetching product:", error);
            setError("Failed to load product");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async () => {
        try {
            const result = await deleteProduct(id);
            if (result.success) {
                navigate("/products");
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error("Error deleting product:", error);
            setError("Failed to delete product");
        } finally {
            setDeleteConfirm(false);
        }
    };

    const handleToggleFeatured = async () => {
        try {
            const result = await toggleProductFeature(id, !product.isFeatured);
            if (result.success) {
                setProduct((prev) => ({
                    ...prev,
                    isFeatured: !prev.isFeatured,
                }));
            } else {
                setError(result.error);
            }
        } catch (error) {
            console.error("Error toggling featured status:", error);
        }
    };

    if (loading) {
        return <Loader fullScreen={true} />;
    }

    if (!product) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="text-admin-error text-lg mb-4">
                        ⚠️ Product not found
                    </div>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark mr-4 transition-colors"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate("/products")}
                            className="px-4 py-2 text-admin-text-secondary bg-admin-card border border-admin-border rounded-lg hover:bg-admin-bg hover:text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary transition-all duration-200 disabled:opacity-50"
                        >
                            All Products
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-blur-xs bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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

    const discountedPrice =
        product.discount > 0
            ? Math.round(product.price * (1 - product.discount / 100))
            : product.price;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate("/products")}
                        className="p-2 hover:bg-admin-bg rounded-lg transition-colors"
                    >
                        <FaArrowLeft className="w-5 h-5 text-admin-text-secondary" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-admin-text">
                            {product.name}
                        </h1>
                        <p className="text-admin-text-secondary">
                            Product Details
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3">
                    <ProtectedComponent permission="products.update">
                        <button
                            onClick={handleToggleFeatured}
                            className={`p-2 rounded-lg transition-colors ${
                                product.isFeatured
                                    ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                                    : "bg-admin-bg text-admin-text-secondary hover:bg-yellow-100 hover:text-yellow-600"
                            }`}
                            title={
                                product.isFeatured
                                    ? "Remove from featured"
                                    : "Mark as featured"
                            }
                        >
                            <FaStar className="w-5 h-5" />
                        </button>
                    </ProtectedComponent>
                    <ProtectedComponent
                        permission="products.update"
                        view={true}
                    >
                        <Link
                            to={`/products/edit/${product._id}`}
                            className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors flex items-center gap-2"
                        >
                            <FaEdit className="w-4 h-4" />
                            Edit Product
                        </Link>
                    </ProtectedComponent>
                    <ProtectedComponent
                        permission="products.delete"
                        view={true}
                    >
                        <button
                            onClick={() => setDeleteConfirm(true)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                            <FaTrash className="w-4 h-4" />
                            Delete Product
                        </button>
                    </ProtectedComponent>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Images Section */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="bg-admin-card rounded-lg border border-admin-border overflow-hidden">
                        <div className="aspect-square bg-admin-bg flex items-center justify-center">
                            {product.images && product.images[selectedImage] ? (
                                <img
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-admin-text-secondary text-center">
                                    <FaBox className="w-16 h-16 mx-auto mb-2 opacity-50" />
                                    <p>No Image Available</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Thumbnail Images */}
                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto">
                            {product.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(index)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                                        selectedImage === index
                                            ? "border-admin-primary"
                                            : "border-admin-border hover:border-admin-primary"
                                    }`}
                                >
                                    <img
                                        src={image}
                                        alt={`${product.name} ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    {/* Basic Info */}
                    <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                        <h3 className="text-lg font-semibold text-admin-text mb-4">
                            Basic Information
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-admin-text-secondary">
                                    Product Name
                                </label>
                                <p className="text-admin-text">
                                    {product.name}
                                </p>
                            </div>

                            {product.description && (
                                <div>
                                    <label className="text-sm font-medium text-admin-text-secondary">
                                        Description
                                    </label>
                                    <p className="text-admin-text">
                                        {product.description}
                                    </p>
                                </div>
                            )}
                            {product.productDescription && (
                                <div>
                                    <label className="text-sm font-medium text-admin-text-secondary">
                                        Product Description
                                    </label>
                                    <p className="text-admin-text">
                                        {product.productDescription}
                                    </p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-admin-text-secondary">
                                        Category
                                    </label>
                                    <p className="text-admin-text flex items-center gap-2">
                                        <FaTag className="w-4 h-4" />
                                        {product.category?.name ||
                                            "Uncategorized"}
                                    </p>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-admin-text-secondary">
                                        Stock
                                    </label>
                                    <p
                                        className={`font-medium flex items-center gap-2 ${
                                            product.stock <= 5
                                                ? "text-red-500"
                                                : product.stock <= 20
                                                ? "text-yellow-500"
                                                : "text-green-500"
                                        }`}
                                    >
                                        <FaBox className="w-4 h-4" />
                                        {product.stock} units
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                        <h3 className="text-lg font-semibold text-admin-text mb-4">
                            Pricing
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-admin-text-secondary">
                                    Original Price
                                </label>
                                <p className="text-xl font-bold text-admin-text">
                                    ₹{product.price?.toLocaleString()}
                                </p>
                            </div>

                            {product.discount > 0 && (
                                <>
                                    <div>
                                        <label className="text-sm font-medium text-admin-text-secondary">
                                            Discount
                                        </label>
                                        <p className="text-admin-text">
                                            {product.discount}% off
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-admin-text-secondary">
                                            Discounted Price
                                        </label>
                                        <p className="text-xl font-bold text-admin-primary">
                                            ₹{discountedPrice.toLocaleString()}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                        <h3 className="text-lg font-semibold text-admin-text mb-4">
                            Statistics
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-admin-text-secondary">
                                    Views
                                </label>
                                <p className="text-admin-text flex items-center gap-2">
                                    <FaEye className="w-4 h-4" />
                                    {product.views || 0}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-admin-text-secondary">
                                    Sales
                                </label>
                                <p className="text-admin-text">
                                    {product.salesCount || 0}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-admin-text-secondary">
                                    Rating
                                </label>
                                <p className="text-admin-text flex items-center gap-2">
                                    <FaStar className="w-4 h-4 text-yellow-500" />
                                    {product.ratings || 0}/5
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-admin-text-secondary">
                                    Reviews
                                </label>
                                <p className="text-admin-text">
                                    {product.reviewsCount || 0}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                        <h3 className="text-lg font-semibold text-admin-text mb-4">
                            Status
                        </h3>
                        <div className="flex items-center gap-4">
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    product.stock > 0
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                }`}
                            >
                                {product.stock > 0
                                    ? "In Stock"
                                    : "Out of Stock"}
                            </span>

                            {product.isFeatured && (
                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 flex items-center gap-1">
                                    <FaStar className="w-3 h-3" />
                                    Featured
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Timestamps */}
                    <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                        <h3 className="text-lg font-semibold text-admin-text mb-4">
                            Timeline
                        </h3>
                        <div className="space-y-2">
                            <div>
                                <label className="text-sm font-medium text-admin-text-secondary">
                                    Created
                                </label>
                                <p className="text-admin-text">
                                    {new Date(
                                        product.createdAt
                                    ).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-admin-text-secondary">
                                    Last Updated
                                </label>
                                <p className="text-admin-text">
                                    {new Date(
                                        product.updatedAt
                                    ).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-admin-card rounded-lg p-6 max-w-md w-full border border-admin-border">
                        <h3 className="text-lg font-semibold text-admin-text mb-4">
                            Confirm Delete
                        </h3>
                        <p className="text-admin-text-secondary mb-6">
                            Are you sure you want to delete "{product?.name}"?
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 border border-admin-border rounded-lg hover:bg-admin-bg transition-colors text-admin-text"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteProduct}
                                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
