import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    getCouponTemplates,
    createCouponFromTemplate,
} from "../../api/coupons.api";
import {
    FiArrowLeft,
    FiPlus,
    FiPercent,
    FiDollarSign,
    FiTag,
} from "react-icons/fi";
import Loader from "../../components/common/Loader.jsx";

const CouponTemplates = () => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        try {
            const response = await getCouponTemplates();
            if (response.success) {
                setTemplates(response.data.templates || []);
            } else {
                console.error("Error fetching templates:", response.error);
            }
        } catch (error) {
            console.error("Error fetching templates:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateFromTemplate = async (templateId, template) => {
        try {
            const response = await createCouponFromTemplate(templateId);
            if (response.success) {
                navigate(`/coupons/edit/${response.data.coupon._id}`);
            } else {
                alert(`Error creating coupon from template: ${response.error}`);
            }
        } catch (error) {
            console.error("Error creating coupon from template:", error);
            alert("Error creating coupon from template. Please try again.");
        }
    };

    const getDiscountIcon = (type) => {
        switch (type) {
            case "percentage":
                return <FiPercent className="w-5 h-5" />;
            case "fixed":
                return <FiDollarSign className="w-5 h-5" />;
            case "percentage_upto":
                return <FiTag className="w-5 h-5" />;
            default:
                return <FiTag className="w-5 h-5" />;
        }
    };

    const formatDiscountValue = (template) => {
        switch (template.discountType) {
            case "percentage":
                return `${template.discountValue}% OFF`;
            case "fixed":
                return `₹${template.discountValue} OFF`;
            case "percentage_upto":
                return `${template.discountValue}% OFF UPTO ₹${template.maxDiscountAmount}`;
            default:
                return `${template.discountValue}% OFF`;
        }
    };

    if (loading) {
        return <Loader fullScreen={true} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate("/coupons/add")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Back to Add Coupon Options
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Coupon Templates
                    </h1>
                    <p className="text-gray-600">
                        Choose from predefined templates to quickly create
                        coupons
                    </p>
                </div>

                {/* Templates Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="bg-white border-2 border-dashed border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200"
                        >
                            <div className="flex h-[160px]">
                                {/* Left Section - Discount Info */}
                                <div className="flex-shrink-0 w-32 bg-gradient-to-br from-purple-50 to-violet-100 p-4 flex flex-col items-center justify-center border-r-2 border-dashed border-gray-300 relative">
                                    {/* Perforated circles */}
                                    <div className="absolute -top-3 right-0 w-6 h-6 bg-gray-50 rounded-full border-2 border-dashed border-gray-300"></div>
                                    <div className="absolute -bottom-3 right-0 w-6 h-6 bg-gray-50 rounded-full border-2 border-dashed border-gray-300"></div>

                                    <div className="text-center">
                                        <div className="flex items-center justify-center mb-2 text-purple-600">
                                            {getDiscountIcon(
                                                template.discountType
                                            )}
                                        </div>
                                        <div className="text-xs font-bold text-purple-800 leading-tight text-center px-1">
                                            {formatDiscountValue(template)}
                                        </div>
                                    </div>
                                </div>

                                {/* Middle Section - Main Content */}
                                <div className="flex-1 min-w-0 p-4 flex flex-col justify-between">
                                    {/* Header with name and badge */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1 min-w-0 mr-3">
                                            <div className="font-mono text-lg font-bold text-gray-900 truncate">
                                                {template.name}
                                            </div>
                                        </div>
                                        <span className="flex-shrink-0 px-2 py-1 rounded text-xs font-semibold bg-purple-100 text-purple-800">
                                            TEMPLATE
                                        </span>
                                    </div>

                                    {/* Description with controlled height */}
                                    <div className="mb-4 flex-1">
                                        <p
                                            className="text-sm text-gray-600 leading-5"
                                            style={{
                                                display: "-webkit-box",
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: "vertical",
                                                overflow: "hidden",
                                                minHeight: "2.5rem",
                                            }}
                                        >
                                            {template.description}
                                        </p>
                                    </div>

                                    {/* Details in compact format */}
                                    <div className="space-y-2 text-xs text-gray-600 mb-4">
                                        <div className="flex justify-between items-center">
                                            <span>
                                                Min Order:{" "}
                                                <span className="font-semibold text-gray-900">
                                                    ₹{template.minOrderAmount}
                                                </span>
                                            </span>
                                            <span>
                                                Usage:{" "}
                                                <span className="font-semibold text-gray-900">
                                                    {template.usageLimit ===
                                                        0 ||
                                                    template.usageLimit === -1
                                                        ? "Unlimited"
                                                        : template.usageLimit}
                                                </span>
                                            </span>
                                        </div>
                                        {template.category && (
                                            <div className="flex items-center">
                                                <span>
                                                    Category:{" "}
                                                    <span className="font-semibold text-gray-900">
                                                        {template.category}
                                                    </span>
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action button */}
                                    <button
                                        onClick={() =>
                                            handleCreateFromTemplate(
                                                template.id,
                                                template
                                            )
                                        }
                                        className="w-full bg-purple-600 text-white px-4 py-2.5 rounded-md hover:bg-purple-700 transition-colors font-medium text-sm flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <FiPlus className="w-4 h-4" />
                                        Use Template
                                    </button>
                                </div>

                                {/* Right Section - Decorative Icon */}
                                <div className="flex-shrink-0 w-16 bg-purple-50 border-l-2 border-dashed border-gray-300 flex items-center justify-center">
                                    <FiTag className="w-6 h-6 text-purple-400" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {templates.length === 0 && (
                    <div className="text-center py-12">
                        <FiTag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No templates available
                        </h3>
                        <p className="text-gray-600">
                            Templates will appear here once they are configured
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CouponTemplates;
