import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaFilter, FaEye } from "react-icons/fa";
import { getOrders } from "../../api/orders.api.js";
import Loader from "../../components/common/Loader.jsx";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge.jsx";
import PaymentStatusBadge from "../../components/orders/PaymentStatusBadge.jsx";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Advanced filter states
    const [filters, setFilters] = useState({
        status: [],
        paymentStatus: [],
        startDate: "",
        endDate: "",
        minAmount: "",
        maxAmount: "",
        paymentMethod: "",
        hasCoupon: "",
        minItems: "",
        maxItems: "",
        customerName: "",
        customerEmail: "",
    });

    // Applied filters (what's actually sent to API)
    const [appliedFilters, setAppliedFilters] = useState({
        status: [],
        paymentStatus: [],
        startDate: "",
        endDate: "",
        minAmount: "",
        maxAmount: "",
        paymentMethod: "",
        hasCoupon: "",
        minItems: "",
        maxItems: "",
        customerName: "",
        customerEmail: "",
    });

    const ordersPerPage = 25;

    const orderStatusOptions = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
    ];

    const paymentStatusOptions = ["pending", "paid", "failed"];

    const paymentMethodOptions = [
        "Card",
        "UPI",
        "Net Banking",
        "COD",
        "Wallet",
    ];

    useEffect(() => {
        fetchOrders();
    }, [currentPage, searchTerm, appliedFilters]);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const filters = {
                // Add search filter
                ...(searchTerm && { search: searchTerm }),

                // Add applied filters
                ...Object.keys(appliedFilters).reduce((acc, key) => {
                    const value = appliedFilters[key];
                    if (Array.isArray(value)) {
                        if (value.length > 0) {
                            acc[key] = value;
                        }
                    } else if (value !== "" && value !== false) {
                        acc[key] = value;
                    }
                    return acc;
                }, {}),
            };

            const pagination = {
                skip: (currentPage - 1) * ordersPerPage,
                limit: ordersPerPage,
                sort: { createdAt: -1 },
            };

            console.log("Fetching orders with filters:", filters);
            console.log("Fetching orders with pagination:", pagination);

            const response = await getOrders(filters, pagination);
            console.log("Orders API result:", response);

            if (response.success) {
                setOrders(response.orders || []);
                setTotalOrders(response.total || 0);
                console.log("Orders loaded:", response.orders?.length || 0);
                console.log("Total orders:", response.total || 0);
            } else {
                console.error("Failed to fetch orders:", response.error);
                setError(response.error || "Failed to fetch orders");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setError("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setSearchTerm(searchInput);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleFilterChange = (filterName, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterName]: value,
        }));
        // Don't reset page here since filters haven't been applied yet
    };

    const handleMultiSelectChange = (filterName, value) => {
        setFilters((prev) => ({
            ...prev,
            [filterName]: prev[filterName].includes(value)
                ? prev[filterName].filter((item) => item !== value)
                : [...prev[filterName], value],
        }));
    };

    const applyFilters = () => {
        setAppliedFilters(filters);
        setCurrentPage(1); // Reset to first page when applying filters
    };

    const clearAllFilters = () => {
        const clearedFilters = {
            status: [],
            paymentStatus: [],
            startDate: "",
            endDate: "",
            minAmount: "",
            maxAmount: "",
            paymentMethod: "",
            hasCoupon: "",
            minItems: "",
            maxItems: "",
            customerName: "",
            customerEmail: "",
        };
        setFilters(clearedFilters);
        setAppliedFilters(clearedFilters);
        setSearchTerm("");
        setSearchInput("");
        setCurrentPage(1);
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        Object.values(appliedFilters).forEach((value) => {
            if (Array.isArray(value)) {
                if (value.length > 0) count++;
            } else if (value !== "" && value !== false) {
                count++;
            }
        });
        if (searchTerm) count++;
        return count;
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    // Helper function to get display name with priority: receiver > user > NA
    const getDisplayName = (order) => {
        if (order.receiverName && order.receiverName.trim()) {
            return order.receiverName;
        }
        if (order.userDetails?.name && order.userDetails.name.trim()) {
            return order.userDetails.name;
        }
        if (order.user?.name && order.user.name.trim()) {
            return order.user.name;
        }
        return "N/A";
    };

    // Helper function to get display email with priority: user account > NA
    const getDisplayEmail = (order) => {
        if (order.userDetails?.email && order.userDetails.email.trim()) {
            return order.userDetails.email;
        }
        if (order.user?.email && order.user.email.trim()) {
            return order.user.email;
        }
        return "N/A";
    };

    // Helper function to get display phone with priority: receiver > user > NA
    const getDisplayPhone = (order) => {
        if (order.receiverPhone && order.receiverPhone.trim()) {
            return order.receiverPhone;
        }
        if (order.userDetails?.phone && order.userDetails.phone.trim()) {
            return order.userDetails.phone;
        }
        if (order.user?.phone && order.user.phone.trim()) {
            return order.user.phone;
        }
        return "N/A";
    };

    const totalPages = Math.ceil(totalOrders / ordersPerPage);

    if (loading) {
        return <Loader fullScreen={true} />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="text-admin-error text-lg mb-4">
                        ⚠️ {error}
                    </div>
                    <button
                        onClick={() => {
                            setError(null);
                            fetchOrders();
                        }}
                        className="px-4 py-2 bg-admin-primary text-white rounded hover:bg-admin-primary-dark"
                    >
                        Retry
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
                        Orders
                    </h1>
                    <p className="text-admin-text-secondary">
                        Manage your customer orders ({totalOrders} orders)
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-text-secondary w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by Order ID, Customer Name, Email, Phone..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full pl-10 pr-4 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors"
                        >
                            Search
                        </button>
                    </div>

                    {/* Filters Toggle */}
                    <button
                        onClick={() =>
                            setShowAdvancedFilters(!showAdvancedFilters)
                        }
                        className={`px-4 py-2 border border-admin-border rounded-lg transition-colors whitespace-nowrap ${
                            showAdvancedFilters
                                ? "bg-admin-primary text-white"
                                : "text-admin-text-secondary hover:text-admin-text hover:bg-admin-bg"
                        }`}
                    >
                        <FaFilter className="w-4 h-4 inline mr-2" />
                        Filters ({getActiveFiltersCount()})
                    </button>

                    {/* Clear Filters */}
                    <button
                        onClick={clearAllFilters}
                        className="px-4 py-2 text-admin-text-secondary hover:text-admin-text border border-admin-border rounded-lg hover:bg-admin-bg transition-colors whitespace-nowrap"
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Advanced Filters Panel */}
                {showAdvancedFilters && (
                    <div className="mt-6 pt-6 border-t border-admin-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {/* Order Status Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Order Status
                                </label>
                                <div className="space-y-1">
                                    {orderStatusOptions.map((status) => (
                                        <label
                                            key={status}
                                            className="flex items-center text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={filters.status.includes(
                                                    status
                                                )}
                                                onChange={() =>
                                                    handleMultiSelectChange(
                                                        "status",
                                                        status
                                                    )
                                                }
                                                className="mr-2 text-admin-primary focus:ring-admin-primary border-admin-border"
                                            />
                                            <span className="capitalize text-admin-text-secondary">
                                                {status}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Status Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Payment Status
                                </label>
                                <div className="space-y-1">
                                    {paymentStatusOptions.map((status) => (
                                        <label
                                            key={status}
                                            className="flex items-center text-sm"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={filters.paymentStatus.includes(
                                                    status
                                                )}
                                                onChange={() =>
                                                    handleMultiSelectChange(
                                                        "paymentStatus",
                                                        status
                                                    )
                                                }
                                                className="mr-2 text-admin-primary focus:ring-admin-primary border-admin-border"
                                            />
                                            <span className="capitalize text-admin-text-secondary">
                                                {status}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Date Range Filters */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={filters.startDate}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "startDate",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={filters.endDate}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "endDate",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                />
                            </div>

                            {/* Amount Range Filters */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Min Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    value={filters.minAmount}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "minAmount",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Max Amount (₹)
                                </label>
                                <input
                                    type="number"
                                    placeholder="10000"
                                    value={filters.maxAmount}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "maxAmount",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                />
                            </div>

                            {/* Payment Method Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Payment Method
                                </label>
                                <select
                                    value={filters.paymentMethod}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "paymentMethod",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                >
                                    <option value="">All Methods</option>
                                    {paymentMethodOptions.map((method) => (
                                        <option key={method} value={method}>
                                            {method}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Has Coupon Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Coupon Usage
                                </label>
                                <select
                                    value={filters.hasCoupon}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "hasCoupon",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                >
                                    <option value="">All Orders</option>
                                    <option value="true">With Coupon</option>
                                    <option value="false">
                                        Without Coupon
                                    </option>
                                </select>
                            </div>

                            {/* Items Count Range */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Min Items
                                </label>
                                <input
                                    type="number"
                                    placeholder="1"
                                    min="1"
                                    value={filters.minItems}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "minItems",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Max Items
                                </label>
                                <input
                                    type="number"
                                    placeholder="50"
                                    min="1"
                                    value={filters.maxItems}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "maxItems",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                />
                            </div>

                            {/* Customer Name Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Customer Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Search by name..."
                                    value={filters.customerName}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "customerName",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                />
                            </div>

                            {/* Customer Email Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Customer Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="Search by email..."
                                    value={filters.customerEmail}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "customerEmail",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Filter Action Buttons */}
                        <div className="flex gap-3 mt-6 pt-4 border-t border-admin-border">
                            <button
                                onClick={applyFilters}
                                className="bg-admin-primary text-white px-6 py-2 rounded-lg hover:bg-admin-primary-dark transition-colors"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={clearAllFilters}
                                className="border border-admin-border text-admin-text-secondary px-6 py-2 rounded-lg hover:bg-admin-bg hover:text-admin-text transition-colors"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Orders Table */}
            <div className="bg-admin-card rounded-lg border border-admin-border overflow-hidden">
                {orders.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-6xl text-admin-text-secondary mb-4">
                            📦
                        </div>
                        <div className="text-xl font-medium text-admin-text mb-2">
                            {searchTerm || getActiveFiltersCount() > 0
                                ? "No orders found"
                                : "No orders yet"}
                        </div>
                        <div className="text-admin-text-secondary mb-6">
                            {searchTerm || getActiveFiltersCount() > 0
                                ? "Try adjusting your search or filters to find what you're looking for."
                                : "When customers place orders, they'll appear here."}
                        </div>
                        {(searchTerm || getActiveFiltersCount() > 0) && (
                            <button
                                onClick={clearAllFilters}
                                className="px-6 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-admin-bg border-b border-admin-border">
                                <tr>
                                    <th className="text-left px-6 py-4 font-semibold text-admin-text">
                                        Order
                                    </th>
                                    <th className="text-left px-6 py-4 font-semibold text-admin-text">
                                        Items
                                    </th>
                                    <th className="text-left px-6 py-4 font-semibold text-admin-text">
                                        Amount
                                    </th>
                                    <th className="text-left px-6 py-4 font-semibold text-admin-text">
                                        Order Status
                                    </th>
                                    <th className="text-left px-6 py-4 font-semibold text-admin-text">
                                        Payment Status
                                    </th>
                                    <th className="text-left px-6 py-4 font-semibold text-admin-text">
                                        Date
                                    </th>
                                    <th className="text-right px-6 py-4 font-semibold text-admin-text">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-admin-border">
                                {orders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="hover:bg-admin-bg transition-colors"
                                    >
                                        {/* Order Info */}
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-admin-text">
                                                    #{order.orderId}
                                                </div>
                                                {order.shiprocket?.awbCode && (
                                                    <div className="text-sm text-blue-600 font-medium">
                                                        AWB: {order.shiprocket.awbCode}
                                                    </div>
                                                )}
                                                {order.trackingNumber && !order.shiprocket?.awbCode && (
                                                    <div className="text-sm text-admin-primary">
                                                        Track:{" "}
                                                        {order.trackingNumber}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        {/* Items */}
                                        <td className="px-6 py-4">
                                            <div className="text-admin-text">
                                                {order.items?.length || 0} Items
                                            </div>
                                            {order.items &&
                                                order.items.length > 0 && (
                                                    <div className="text-sm text-admin-text-secondary">
                                                        {order.items[0].product
                                                            ?.name ||
                                                            order
                                                                .productDetails?.[0]
                                                                ?.name ||
                                                            "Product details"}
                                                        {order.items.length >
                                                            1 &&
                                                            ` +${
                                                                order.items
                                                                    .length - 1
                                                            } more`}
                                                    </div>
                                                )}
                                        </td>

                                        {/* Amount */}
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-admin-text">
                                                {formatCurrency(
                                                    order.total ||
                                                        order.totalAmount ||
                                                        0
                                                )}
                                            </div>
                                        </td>

                                        {/* Order Status */}
                                        <td className="px-6 py-4">
                                            <OrderStatusBadge
                                                status={order.status}
                                            />
                                        </td>

                                        {/* Payment Status */}
                                        <td className="px-6 py-4">
                                            <div>
                                                <PaymentStatusBadge
                                                    paymentStatus={
                                                        order.paymentStatus
                                                    }
                                                />
                                                <div className="text-sm text-admin-text-secondary mt-1">
                                                    {order.paymentMethod ||
                                                        "N/A"}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-4">
                                            <span className="text-admin-text">
                                                {formatDate(order.createdAt)}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end">
                                                <Link
                                                    to={`/orders/${order._id}`}
                                                    className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors text-sm"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6">
                    <div className="text-sm text-admin-text-secondary">
                        Showing {(currentPage - 1) * ordersPerPage + 1} to{" "}
                        {Math.min(currentPage * ordersPerPage, totalOrders)} of{" "}
                        {totalOrders} orders
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm border border-admin-border rounded-lg hover:bg-admin-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        {Array.from(
                            { length: Math.min(totalPages, 7) },
                            (_, i) => {
                                let pageNumber;
                                if (totalPages <= 7) {
                                    pageNumber = i + 1;
                                } else if (currentPage <= 4) {
                                    pageNumber = i + 1;
                                } else if (currentPage >= totalPages - 3) {
                                    pageNumber = totalPages - 6 + i;
                                } else {
                                    pageNumber = currentPage - 3 + i;
                                }
                                return pageNumber;
                            }
                        ).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                                    currentPage === page
                                        ? "bg-admin-primary text-white border-admin-primary"
                                        : "border-admin-border hover:bg-admin-bg text-admin-text-secondary"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-sm border border-admin-border rounded-lg hover:bg-admin-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Orders;
