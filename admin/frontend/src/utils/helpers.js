// ===== AffordIndia Admin Utility Functions =====

/**
 * Format currency in INR
 */
export const formatCurrency = (amount) => {
    if (!amount && amount !== 0) return "₹0";
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
};

/**
 * Format numbers with Indian numbering system
 */
export const formatNumber = (number) => {
    if (!number && number !== 0) return "0";
    return new Intl.NumberFormat("en-IN").format(number);
};

/**
 * Format date for display
 */
export const formatDate = (date, options = {}) => {
    if (!date) return "";

    const defaultOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
        ...options,
    };

    return new Date(date).toLocaleDateString("en-IN", defaultOptions);
};

/**
 * Format date with time
 */
export const formatDateTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date) => {
    if (!date) return "";

    const now = new Date();
    const past = new Date(date);
    const diffInSeconds = Math.floor((now - past) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
        return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400)
        return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
        return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return formatDate(date);
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
};

/**
 * Generate random ID
 */
export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Deep clone object
 */
export const deepClone = (obj) => {
    if (obj === null || typeof obj !== "object") return obj;
    if (obj instanceof Date) return new Date(obj);
    if (Array.isArray(obj)) return obj.map(deepClone);

    const cloned = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            cloned[key] = deepClone(obj[key]);
        }
    }
    return cloned;
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
    if (obj === null || obj === undefined) return true;
    if (Array.isArray(obj)) return obj.length === 0;
    if (typeof obj === "object") return Object.keys(obj).length === 0;
    if (typeof obj === "string") return obj.trim().length === 0;
    return false;
};

/**
 * Get status color class
 */
export const getStatusColor = (status, type = "order") => {
    const statusMap = {
        order: {
            pending: "status-warning",
            processing: "status-info",
            shipped: "status-info",
            delivered: "status-success",
            cancelled: "status-error",
            returned: "status-error",
        },
        user: {
            active: "status-success",
            blocked: "status-error",
        },
        review: {
            visible: "status-success",
            hidden: "status-error",
        },
        general: {
            active: "status-success",
            inactive: "status-error",
            draft: "status-warning",
            published: "status-success",
        },
    };

    return statusMap[type]?.[status?.toLowerCase()] || "status-info";
};

/**
 * Calculate percentage change
 */
export const calculatePercentageChange = (current, previous) => {
    if (!previous || previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
};

/**
 * Format percentage
 */
export const formatPercentage = (percentage, decimalPlaces = 1) => {
    if (!percentage && percentage !== 0) return "0%";
    return `${percentage.toFixed(decimalPlaces)}%`;
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate phone number (Indian format)
 */
export const isValidPhone = (phone) => {
    const phoneRegex = /^[+]?[91]?[0-9]{10}$/;
    return phoneRegex.test(phone?.replace(/\s/g, ""));
};

/**
 * Extract error message from API response
 */
export const getErrorMessage = (error) => {
    if (typeof error === "string") return error;
    if (error?.response?.data?.message) return error.response.data.message;
    if (error?.message) return error.message;
    return "An unexpected error occurred";
};

/**
 * Download file from blob
 */
export const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        return true;
    }
};
