import React from "react";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger", // danger, warning, info
    loading = false,
}) => {
    if (!isOpen) return null;

    const getTypeStyles = () => {
        switch (type) {
            case "danger":
                return {
                    iconColor: "text-red-600",
                    iconBg: "bg-red-100",
                    confirmBg: "bg-red-600 hover:bg-red-700",
                    borderColor: "border-red-200",
                };
            case "warning":
                return {
                    iconColor: "text-yellow-600",
                    iconBg: "bg-yellow-100",
                    confirmBg: "bg-yellow-600 hover:bg-yellow-700",
                    borderColor: "border-yellow-200",
                };
            case "info":
                return {
                    iconColor: "text-blue-600",
                    iconBg: "bg-blue-100",
                    confirmBg: "bg-[#B76E79] hover:bg-[#C68F98]",
                    borderColor: "border-blue-200",
                };
            default:
                return {
                    iconColor: "text-red-600",
                    iconBg: "bg-red-100",
                    confirmBg: "bg-red-600 hover:bg-red-700",
                    borderColor: "border-red-200",
                };
        }
    };

    const styles = getTypeStyles();

    const handleConfirm = () => {
        if (!loading) {
            onConfirm();
        }
    };

    const handleClose = () => {
        if (!loading) {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${styles.iconBg}`}>
                            <FaExclamationTriangle
                                className={`${styles.iconColor} text-lg`}
                            />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            {title}
                        </h3>
                    </div>
                    <button
                        onClick={handleClose}
                        disabled={loading}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        {message}
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-white border-2 border-[#B76E79] text-[#B76E79] rounded-lg font-medium hover:bg-[#B76E79] hover:text-white transition-colors disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={loading}
                            className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 ${styles.confirmBg}`}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Processing...
                                </div>
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
