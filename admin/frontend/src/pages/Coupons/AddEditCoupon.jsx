import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCoupon, createCoupon, updateCoupon } from "../../api/coupons.api";
import { getCategories } from "../../api/categories.api";
import {
    FiArrowLeft,
    FiSave,
    FiPercent,
    FiDollarSign,
    FiTag,
} from "react-icons/fi";

const AddEditCoupon = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        code: "",
        description: "",
        discountType: "percentage",
        discountValue: "",
        maxDiscountAmount: "",
        minOrderAmount: "",
        usageLimit: "",
        expiresAt: "",
        category: "",
        isActive: true,
    });

    useEffect(() => {
        fetchCategories();
        if (isEdit) {
            fetchCoupon();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const response = await getCategories();
            console.log("AddEditCoupon - Categories API response:", response);
            if (response.success) {
                console.log(
                    "AddEditCoupon - Categories data:",
                    response.data.categories
                );
                setCategories(response.data.categories || []);
            } else {
                console.error("Error fetching categories:", response.error);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchCoupon = async () => {
        try {
            setLoading(true);
            const response = await getCoupon(id);
            if (response.success) {
                const coupon = response.data.coupon;

                setFormData({
                    code: coupon.code || "",
                    description: coupon.description || "",
                    discountType: coupon.discountType || "percentage",
                    discountValue: coupon.discountValue || "",
                    maxDiscountAmount: coupon.maxDiscountAmount || "",
                    minOrderAmount: coupon.minOrderAmount || "",
                    usageLimit: coupon.usageLimit || "",
                    expiresAt:
                        coupon.validUntil || coupon.expiresAt
                            ? new Date(coupon.validUntil || coupon.expiresAt)
                                  .toISOString()
                                  .split("T")[0]
                            : "",
                    category:
                        coupon.applicableCategories?.[0]?._id ||
                        coupon.category?._id ||
                        "",
                    isActive: coupon.isActive !== false,
                });
            } else {
                console.error("Error fetching coupon:", response.error);
            }
        } catch (error) {
            console.error("Error fetching coupon:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const generateCouponCode = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let result = "";
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData((prev) => ({ ...prev, code: result }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const submitData = {
                code: formData.code,
                description: formData.description,
                discountType: formData.discountType,
                discountValue: Number(formData.discountValue),
                maxDiscountAmount: formData.maxDiscountAmount
                    ? Number(formData.maxDiscountAmount)
                    : undefined,
                minOrderAmount: Number(formData.minOrderAmount),
                usageLimit: formData.usageLimit
                    ? Number(formData.usageLimit)
                    : 0,
                validUntil: formData.expiresAt
                    ? new Date(
                          formData.expiresAt + "T23:59:59.999Z"
                      ).toISOString()
                    : undefined,
                applicableCategories: formData.category
                    ? [formData.category]
                    : [],
                isGlobal: !formData.category, // Set to true if no category selected
                isActive: formData.isActive,
            };

            let response;
            if (isEdit) {
                response = await updateCoupon(id, submitData);
            } else {
                response = await createCoupon(submitData);
            }

            if (response.success) {
                navigate("/coupons");
            } else {
                alert(`Error saving coupon: ${response.error}`);
            }
        } catch (error) {
            console.error("Error saving coupon:", error);
            alert("Error saving coupon. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <button
                        onClick={() => navigate("/coupons")}
                        className="flex items-center gap-2 text-admin-text-secondary hover:text-admin-text mb-4 transition-colors"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Back to Coupons
                    </button>
                    <h1 className="text-2xl font-bold text-admin-text">
                        {isEdit ? "Edit Coupon" : "Add New Coupon"}
                    </h1>
                </div>
            </div>

            {/* Form */}
            <form
                onSubmit={handleSubmit}
                className="bg-admin-card rounded-lg shadow-sm border border-admin-border p-6"
            >
                {/* Coupon Code */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-admin-text mb-2">
                        Coupon Code
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            className="flex-1 border border-admin-border rounded-lg px-3 py-2 text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-admin-primary"
                            placeholder="Enter coupon code"
                            required
                        />
                        <button
                            type="button"
                            onClick={generateCouponCode}
                            className="px-4 py-2 text-admin-text-secondary hover:text-admin-text border border-admin-border rounded-lg hover:bg-admin-bg transition-colors"
                        >
                            Generate
                        </button>
                    </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={3}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Describe the coupon offer"
                        required
                    />
                </div>

                {/* Discount Type */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Type
                    </label>
                    <select
                        name="discountType"
                        value={formData.discountType}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <option value="percentage">Percentage Discount</option>
                        <option value="fixed">Fixed Amount Discount</option>
                        <option value="percentage_upto">
                            Percentage with Maximum Cap
                        </option>
                    </select>
                </div>

                {/* Discount Value */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Discount Value
                        </label>
                        <input
                            type="number"
                            name="discountValue"
                            value={formData.discountValue}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder={
                                formData.discountType === "fixed"
                                    ? "Amount in ₹"
                                    : "Percentage"
                            }
                            required
                        />
                    </div>

                    {formData.discountType === "percentage_upto" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Maximum Discount Amount (₹)
                            </label>
                            <input
                                type="number"
                                name="maxDiscountAmount"
                                value={formData.maxDiscountAmount}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Max discount amount"
                            />
                        </div>
                    )}
                </div>

                {/* Order & Usage Limits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Minimum Order Amount (₹)
                        </label>
                        <input
                            type="number"
                            name="minOrderAmount"
                            value={formData.minOrderAmount}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Minimum order amount"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Usage Limit
                        </label>
                        <input
                            type="number"
                            name="usageLimit"
                            value={formData.usageLimit}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Leave empty for unlimited"
                        />
                    </div>
                </div>

                {/* Expiry Date & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Date
                        </label>
                        <input
                            type="date"
                            name="expiresAt"
                            value={formData.expiresAt}
                            onChange={handleInputChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-admin-text mb-2">
                            Category (Optional)
                        </label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                            className="w-full border border-admin-border rounded-lg px-3 py-2 text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-admin-primary"
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Active Status */}
                <div className="mb-6">
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            className="rounded border-admin-border text-admin-primary focus:ring-admin-primary"
                        />
                        <span className="text-sm font-medium text-admin-text">
                            Active (coupon can be used)
                        </span>
                    </label>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-admin-primary text-white px-6 py-2 rounded-lg hover:bg-admin-primary-dark transition-colors disabled:opacity-50"
                >
                    <FiSave className="w-4 h-4" />
                    {loading
                        ? "Saving..."
                        : isEdit
                        ? "Update Coupon"
                        : "Create Coupon"}
                </button>
            </form>
        </div>
    );
};

export default AddEditCoupon;
