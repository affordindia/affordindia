import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaSearch, FaFilter } from "react-icons/fa";
import { getUsers } from "../../api/users.api.js";
import Loader from "../../components/common/Loader.jsx";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]); // Store all users for client-side pagination
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Advanced filter states
    const [filters, setFilters] = useState({
        isBlocked: "",
        minOrders: "",
        minSpent: "",
        dateJoined: "",
        hasOrders: "",
    });

    // Applied filters (what's actually sent to API)
    const [appliedFilters, setAppliedFilters] = useState({
        isBlocked: "",
        minOrders: "",
        minSpent: "",
        dateJoined: "",
        hasOrders: "",
    });

    const usersPerPage = 12;

    useEffect(() => {
        fetchUsers();
    }, [searchTerm, appliedFilters]);

    // Handle client-side pagination
    useEffect(() => {
        const startIndex = (currentPage - 1) * usersPerPage;
        const endIndex = startIndex + usersPerPage;
        setUsers(allUsers.slice(startIndex, endIndex));
    }, [currentPage, allUsers]);

    // Client-side filtering function
    const applyClientSideFilters = (users) => {
        return users.filter(user => {
            // Search filter
            if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                const matchesSearch = 
                    user.name?.toLowerCase().includes(searchLower) ||
                    user.email?.toLowerCase().includes(searchLower) ||
                    user.phone?.toLowerCase().includes(searchLower) ||
                    user._id?.toLowerCase().includes(searchLower);
                if (!matchesSearch) return false;
            }

            // Account Status filter
            if (appliedFilters.isBlocked !== "") {
                const isBlocked = appliedFilters.isBlocked === "true";
                if (user.isBlocked !== isBlocked) return false;
            }

            // Has Orders filter
            if (appliedFilters.hasOrders !== "") {
                const hasOrders = appliedFilters.hasOrders === "true";
                const userHasOrders = user.totalOrders > 0;
                if (userHasOrders !== hasOrders) return false;
            }

            // Minimum Orders filter
            if (appliedFilters.minOrders !== "") {
                const minOrders = parseInt(appliedFilters.minOrders);
                if (isNaN(minOrders) || user.totalOrders < minOrders) return false;
            }

            // Minimum Spent filter
            if (appliedFilters.minSpent !== "") {
                const minSpent = parseFloat(appliedFilters.minSpent);
                if (isNaN(minSpent) || (user.totalSpent || 0) < minSpent) return false;
            }

            // Date Joined filter
            if (appliedFilters.dateJoined !== "") {
                const joinedDate = new Date(user.createdAt);
                const now = new Date();
                const range = appliedFilters.dateJoined;
                let matches = false;
                
                if (range === "7") {
                    const daysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matches = joinedDate >= daysAgo;
                } else if (range === "30") {
                    const daysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                    matches = joinedDate >= daysAgo;
                } else if (range === "90") {
                    const daysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
                    matches = joinedDate >= daysAgo;
                } else if (range === "180") {
                    const daysAgo = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
                    matches = joinedDate >= daysAgo;
                } else if (range === "365") {
                    const daysAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
                    matches = joinedDate >= daysAgo;
                }
                
                if (!matches) return false;
            }

            return true;
        });
    };

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            // For now, fetch all users without backend filtering
            // We'll do client-side filtering for the advanced options
            const response = await getUsers({});
            
            // Handle response format
            if (response && response.success && response.users) {
                // Transform users data to match expected format
                let transformedUsers = response.users.map(user => ({
                    ...user,
                    // Use backend calculated fields
                    totalOrders: user.orderCount || 0,
                    totalSpent: user.totalSpent || 0
                }));
                
                // Apply client-side filters
                const filteredUsers = applyClientSideFilters(transformedUsers);
                
                setAllUsers(filteredUsers); // Store filtered users
                setTotalUsers(filteredUsers.length);
                
                // Apply client-side pagination
                const startIndex = (currentPage - 1) * usersPerPage;
                const endIndex = startIndex + usersPerPage;
                setUsers(filteredUsers.slice(startIndex, endIndex));
            } else {
                setAllUsers([]);
                setUsers([]);
                setTotalUsers(0);
            }
        } catch (err) {
            setError(`Failed to fetch users: ${err.message}`);
            setUsers([]);
            setTotalUsers(0);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setSearchTerm(searchInput);
        setCurrentPage(1);
    };

    const getActiveFiltersCount = () => {
        return Object.values(appliedFilters).filter(value => value !== "").length;
    };

    const clearAllFilters = () => {
        const emptyFilters = {
            isBlocked: "",
            minOrders: "",
            minSpent: "",
            dateJoined: "",
            hasOrders: "",
        };
        setFilters(emptyFilters);
        setAppliedFilters(emptyFilters);
        setSearchInput("");
        setSearchTerm("");
        setCurrentPage(1);
        setShowAdvancedFilters(false);
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
        // Don't apply filters immediately - wait for Apply button
    };

    const applyFilters = () => {
        setAppliedFilters(filters);
        setCurrentPage(1);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    const totalPages = Math.ceil(totalUsers / usersPerPage);

    if (loading && currentPage === 1) {
        return <Loader fullScreen={true} />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-admin-text">
                        Users
                    </h1>
                    <p className="text-admin-text-secondary">
                        Manage user accounts ({totalUsers} users)
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
                                placeholder="Search users..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
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
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`px-4 py-2 border border-admin-border rounded-lg transition-colors whitespace-nowrap ${
                            showAdvancedFilters
                                ? "bg-admin-primary text-white"
                                : "text-admin-text-secondary hover:text-admin-text hover:bg-admin-bg"
                        }`}
                    >
                        <FaFilter className="w-4 h-4 inline mr-2" />
                        Filters ({getActiveFiltersCount()})
                    </button>
                </div>

                {/* Advanced Filters Panel */}
                {showAdvancedFilters && (
                    <div className="mt-6 pt-6 border-t border-admin-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {/* Account Status Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Account Status
                                </label>
                                <select
                                    value={filters.isBlocked}
                                    onChange={(e) => handleFilterChange("isBlocked", e.target.value)}
                                    className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                >
                                    <option value="">All Status</option>
                                    <option value="false">Active</option>
                                    <option value="true">Blocked</option>
                                </select>
                            </div>

                            {/* Has Orders Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Order Activity
                                </label>
                                <select
                                    value={filters.hasOrders}
                                    onChange={(e) => handleFilterChange("hasOrders", e.target.value)}
                                    className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                >
                                    <option value="">All Users</option>
                                    <option value="true">Has Orders</option>
                                    <option value="false">No Orders</option>
                                </select>
                            </div>

                            {/* Minimum Orders Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Minimum Orders
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Enter minimum orders"
                                    value={filters.minOrders}
                                    onChange={(e) => handleFilterChange("minOrders", e.target.value)}
                                    className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                />
                            </div>

                            {/* Minimum Spent Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Minimum Spent (₹)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter minimum amount"
                                    value={filters.minSpent}
                                    onChange={(e) => handleFilterChange("minSpent", e.target.value)}
                                    className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                />
                            </div>

                            {/* Date Joined Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Joined Period
                                </label>
                                <select
                                    value={filters.dateJoined}
                                    onChange={(e) => handleFilterChange("dateJoined", e.target.value)}
                                    className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                >
                                    <option value="">All Time</option>
                                    <option value="7">Last 7 Days</option>
                                    <option value="30">Last 30 Days</option>
                                    <option value="90">Last 90 Days</option>
                                    <option value="180">Last 6 Months</option>
                                    <option value="365">Last Year</option>
                                </select>
                            </div>
                        </div>
                        
                        {/* Apply/Clear Buttons */}
                        <div className="flex gap-3 mt-6 pt-4 border-t border-admin-border">
                            <button
                                onClick={applyFilters}
                                className="px-6 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors text-sm"
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={clearAllFilters}
                                className="px-6 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Users Table */}
            <div className="bg-admin-card rounded-lg border border-admin-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-admin-bg border-b border-admin-border">
                            <tr>
                                <th className="text-left px-6 py-4 font-semibold text-admin-text">
                                    User
                                </th>
                                <th className="text-left px-6 py-4 font-semibold text-admin-text">
                                    Contact
                                </th>
                                <th className="text-left px-6 py-4 font-semibold text-admin-text">
                                    Orders
                                </th>
                                <th className="text-left px-6 py-4 font-semibold text-admin-text">
                                    Total Spent
                                </th>
                                <th className="text-left px-6 py-4 font-semibold text-admin-text">
                                    Joined
                                </th>
                                <th className="text-right px-6 py-4 font-semibold text-admin-text">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admin-border">
                            {users.map((user) => (
                                <tr
                                    key={user._id}
                                    className="hover:bg-admin-bg transition-colors"
                                >
                                    {/* User Info */}
                                    <td className="px-6 py-4">
                                        <div>
                                            <h3 className="font-medium text-admin-text">
                                                {user.name || "No Name"}
                                            </h3>
                                            <p className="text-sm text-admin-text-secondary">
                                                ID: {user._id?.slice(-6)}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Contact */}
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-admin-text">
                                                {user.email || "No email"}
                                            </p>
                                            <p className="text-sm text-admin-text-secondary">
                                                {user.phone || "No phone"}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Orders */}
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-admin-text">
                                            {user.totalOrders || 0}
                                        </span>
                                    </td>

                                    {/* Total Spent */}
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-admin-text">
                                            {formatCurrency(user.totalSpent || 0)}
                                        </span>
                                    </td>

                                    {/* Joined */}
                                    <td className="px-6 py-4">
                                        <span className="text-admin-text-secondary">
                                            {formatDate(user.createdAt)}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end">
                                            <Link
                                                to={`/users/${user._id}`}
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
            </div>

            {/* Empty State */}
            {users.length === 0 && !loading && (
                <div className="text-center py-12">
                    <div className="text-admin-text-secondary mb-4">
                        <FaSearch className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No users found</p>
                        <p>Try adjusting your search or filters</p>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-6 flex justify-between items-center">
                    <div className="text-sm text-admin-text-secondary">
                        Showing {(currentPage - 1) * usersPerPage + 1} to{" "}
                        {Math.min(currentPage * usersPerPage, totalUsers)} of {totalUsers}{" "}
                        users
                    </div>
                    <div className="flex space-x-1">
                        <button
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-2 text-sm bg-admin-card border border-admin-border text-admin-text rounded-lg hover:bg-admin-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Previous
                        </button>
                        {[...Array(totalPages)].map((_, index) => {
                            const page = index + 1;
                            if (
                                page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 2 && page <= currentPage + 2)
                            ) {
                                return (
                                    <button
                                        key={page}
                                        onClick={() => setCurrentPage(page)}
                                        className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                                            currentPage === page
                                                ? "bg-admin-primary text-white"
                                                : "bg-admin-card border border-admin-border text-admin-text hover:bg-admin-bg"
                                        }`}
                                    >
                                        {page}
                                    </button>
                                );
                            } else if (
                                page === currentPage - 3 ||
                                page === currentPage + 3
                            ) {
                                return (
                                    <span
                                        key={page}
                                        className="px-2 py-2 text-admin-text-secondary"
                                    >
                                        ...
                                    </span>
                                );
                            }
                            return null;
                        })}
                        <button
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-2 text-sm bg-admin-card border border-admin-border text-admin-text rounded-lg hover:bg-admin-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;
