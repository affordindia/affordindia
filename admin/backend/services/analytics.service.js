import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import Review from "../models/review.model.js";
import mongoose from "mongoose";

// Helper function to calculate date ranges
const calculateDateRanges = (timeframe) => {
    const now = new Date();
    let startDate, previousStartDate;

    switch (timeframe) {
        case "day":
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            previousStartDate = new Date(
                now.getTime() - 14 * 24 * 60 * 60 * 1000
            );
            break;
        case "week":
            startDate = new Date(now.getTime() - 4 * 7 * 24 * 60 * 60 * 1000);
            previousStartDate = new Date(
                now.getTime() - 8 * 7 * 24 * 60 * 60 * 1000
            );
            break;
        case "year":
            startDate = new Date(
                now.getFullYear() - 3,
                now.getMonth(),
                now.getDate()
            );
            previousStartDate = new Date(
                now.getFullYear() - 6,
                now.getMonth(),
                now.getDate()
            );
            break;
        default: // month
            startDate = new Date(
                now.getFullYear(),
                now.getMonth() - 12,
                now.getDate()
            );
            previousStartDate = new Date(
                now.getFullYear(),
                now.getMonth() - 24,
                now.getDate()
            );
    }

    return { startDate, previousStartDate };
};

// Helper function to get group format for time aggregation
const getGroupFormat = (timeframe) => {
    switch (timeframe) {
        case "day":
            return {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            };
        case "week":
            return { $dateToString: { format: "%Y-%U", date: "$createdAt" } };
        case "year":
            return { $dateToString: { format: "%Y", date: "$createdAt" } };
        default: // month
            return { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
    }
};

// Get comprehensive analytics overview
export const getAnalyticsOverviewService = async (timeframe = "month") => {
    try {
        const { startDate, previousStartDate } = calculateDateRanges(timeframe);

        // Parallel queries for current period
        const [
            currentRevenue,
            currentOrders,
            currentCustomers,
            currentProductsSold,
            previousRevenue,
            previousOrders,
            previousCustomers,
            previousProductsSold,
        ] = await Promise.all([
            // Current period
            Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
                        paymentStatus: "paid",
                    },
                },
                { $group: { _id: null, total: { $sum: "$total" } } },
            ]),
            Order.countDocuments({ createdAt: { $gte: startDate } }),
            User.countDocuments({ createdAt: { $gte: startDate } }),
            Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
                        paymentStatus: "paid",
                    },
                },
                { $unwind: "$items" },
                { $group: { _id: null, total: { $sum: "$items.quantity" } } },
            ]),
            // Previous period
            Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: previousStartDate, $lt: startDate },
                        paymentStatus: "paid",
                    },
                },
                { $group: { _id: null, total: { $sum: "$total" } } },
            ]),
            Order.countDocuments({
                createdAt: { $gte: previousStartDate, $lt: startDate },
            }),
            User.countDocuments({
                createdAt: { $gte: previousStartDate, $lt: startDate },
            }),
            Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: previousStartDate, $lt: startDate },
                        paymentStatus: "paid",
                    },
                },
                { $unwind: "$items" },
                { $group: { _id: null, total: { $sum: "$items.quantity" } } },
            ]),
        ]);

        // Calculate metrics
        const totalRevenue = currentRevenue[0]?.total || 0;
        const totalOrders = currentOrders;
        const totalCustomers = currentCustomers;
        const productsSold = currentProductsSold[0]?.total || 0;

        const prevRevenue = previousRevenue[0]?.total || 0;
        const prevOrders = previousOrders;
        const prevCustomers = previousCustomers;
        const prevProductsSold = previousProductsSold[0]?.total || 0;

        // Calculate growth rates
        const revenueGrowth =
            prevRevenue > 0
                ? ((totalRevenue - prevRevenue) / prevRevenue) * 100
                : 0;
        const ordersGrowth =
            prevOrders > 0
                ? ((totalOrders - prevOrders) / prevOrders) * 100
                : 0;
        const customersGrowth =
            prevCustomers > 0
                ? ((totalCustomers - prevCustomers) / prevCustomers) * 100
                : 0;
        const productsSoldGrowth =
            prevProductsSold > 0
                ? ((productsSold - prevProductsSold) / prevProductsSold) * 100
                : 0;

        // Additional metrics
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
        const conversionRate =
            totalCustomers > 0 ? totalOrders / totalCustomers : 0;
        const customerLifetimeValue =
            totalCustomers > 0 ? totalRevenue / totalCustomers : 0;

        return {
            totalRevenue,
            totalOrders,
            totalCustomers,
            productsSold,
            revenueGrowth,
            ordersGrowth,
            customersGrowth,
            productsSoldGrowth,
            avgOrderValue,
            conversionRate,
            customerLifetimeValue,
        };
    } catch (error) {
        throw new Error(`Failed to get analytics overview: ${error.message}`);
    }
};

// Get revenue analytics with chart data
export const getRevenueAnalyticsService = async (timeframe = "month") => {
    try {
        const { startDate } = calculateDateRanges(timeframe);
        const groupFormat = getGroupFormat(timeframe);

        const [revenueChart, totalStats] = await Promise.all([
            Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
                        paymentStatus: "paid",
                    },
                },
                {
                    $group: {
                        _id: groupFormat,
                        revenue: { $sum: "$total" },
                        orders: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
                        paymentStatus: "paid",
                    },
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$total" },
                        totalOrders: { $sum: 1 },
                        averageOrderValue: { $avg: "$total" },
                    },
                },
            ]),
        ]);

        // Format chart data
        const chartData = revenueChart.map((item) => ({
            date: item._id,
            revenue: item.revenue,
            orders: item.orders,
        }));

        // Calculate growth rate
        const sortedData = chartData.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );
        const growthRate =
            sortedData.length > 1
                ? ((sortedData[sortedData.length - 1].revenue -
                      sortedData[0].revenue) /
                      sortedData[0].revenue) *
                  100
                : 0;

        return {
            chartData,
            totalRevenue: totalStats[0]?.totalRevenue || 0,
            totalOrders: totalStats[0]?.totalOrders || 0,
            averageOrderValue: totalStats[0]?.averageOrderValue || 0,
            growthRate,
        };
    } catch (error) {
        throw new Error(`Failed to get revenue analytics: ${error.message}`);
    }
};

// Get sales breakdown analytics
export const getSalesAnalyticsService = async (timeframe = "month") => {
    try {
        const { startDate } = calculateDateRanges(timeframe);

        const [byStatus, byPaymentMethod, topCategories] = await Promise.all([
            // Sales by status
            Order.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: "$status",
                        value: { $sum: "$total" },
                        count: { $sum: 1 },
                    },
                },
            ]),
            // Sales by payment method
            Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
                        paymentStatus: "paid",
                    },
                },
                {
                    $group: {
                        _id: "$paymentMethod",
                        value: { $sum: "$total" },
                        count: { $sum: 1 },
                    },
                },
            ]),
            // Top categories
            Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: startDate },
                        paymentStatus: "paid",
                    },
                },
                { $unwind: "$items" },
                {
                    $lookup: {
                        from: "products",
                        localField: "items.product",
                        foreignField: "_id",
                        as: "productInfo",
                    },
                },
                { $unwind: "$productInfo" },
                {
                    $lookup: {
                        from: "categories",
                        localField: "productInfo.category",
                        foreignField: "_id",
                        as: "categoryInfo",
                    },
                },
                { $unwind: "$categoryInfo" },
                {
                    $group: {
                        _id: "$categoryInfo.name",
                        revenue: {
                            $sum: {
                                $multiply: ["$items.quantity", "$items.price"],
                            },
                        },
                        orders: { $sum: 1 },
                    },
                },
                { $sort: { revenue: -1 } },
                { $limit: 10 },
            ]),
        ]);

        return {
            byStatus: byStatus.map((item) => ({
                status: item._id,
                value: item.value,
                count: item.count,
            })),
            byPaymentMethod: byPaymentMethod.map((item) => ({
                method: item._id || "Unknown",
                value: item.value,
                count: item.count,
            })),
            topCategories: topCategories.map((item) => ({
                category: item._id,
                revenue: item.revenue,
                orders: item.orders,
            })),
        };
    } catch (error) {
        throw new Error(`Failed to get sales analytics: ${error.message}`);
    }
};

// Get top performing products
export const getTopProductsService = async (
    limit = 10,
    timeframe = "month"
) => {
    try {
        const { startDate } = calculateDateRanges(timeframe);

        const topProducts = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate },
                    paymentStatus: "paid",
                },
            },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    sales: { $sum: "$items.quantity" },
                    revenue: {
                        $sum: {
                            $multiply: ["$items.quantity", "$items.price"],
                        },
                    },
                    orders: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product",
                },
            },
            { $unwind: "$product" },
            {
                $lookup: {
                    from: "categories",
                    localField: "product.category",
                    foreignField: "_id",
                    as: "category",
                },
            },
            {
                $project: {
                    id: "$_id",
                    name: "$product.name",
                    price: "$product.price",
                    image: { $arrayElemAt: ["$product.images", 0] },
                    category: { $arrayElemAt: ["$category.name", 0] },
                    sales: 1,
                    revenue: 1,
                    orders: 1,
                },
            },
            { $sort: { revenue: -1 } },
            { $limit: parseInt(limit) },
        ]);

        return topProducts;
    } catch (error) {
        throw new Error(`Failed to get top products: ${error.message}`);
    }
};

// Get customer analytics
export const getCustomerAnalyticsService = async (timeframe = "month") => {
    try {
        const { startDate } = calculateDateRanges(timeframe);

        const [
            totalCustomers,
            newCustomers,
            topCustomers,
            acquisitionData,
            returningCustomers,
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ createdAt: { $gte: startDate } }),
            Order.aggregate([
                { $match: { paymentStatus: "paid" } },
                {
                    $group: {
                        _id: "$user",
                        totalSpent: { $sum: "$total" },
                        orders: { $sum: 1 },
                    },
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "userInfo",
                    },
                },
                { $unwind: "$userInfo" },
                {
                    $project: {
                        id: "$_id",
                        name: "$userInfo.name",
                        email: "$userInfo.email",
                        totalSpent: 1,
                        orders: 1,
                    },
                },
                { $sort: { totalSpent: -1 } },
                { $limit: 10 },
            ]),
            // Customer acquisition by period
            User.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format:
                                    timeframe === "day"
                                        ? "%Y-%m-%d"
                                        : timeframe === "week"
                                        ? "%Y-%U"
                                        : timeframe === "year"
                                        ? "%Y"
                                        : "%Y-%m",
                                date: "$createdAt",
                            },
                        },
                        customers: { $sum: 1 },
                    },
                },
                { $sort: { _id: 1 } },
            ]),
            // Calculate returning customers
            Order.aggregate([
                { $match: { createdAt: { $gte: startDate } } },
                { $group: { _id: "$user", orders: { $sum: 1 } } },
                { $match: { orders: { $gt: 1 } } },
                { $count: "returningCustomers" },
            ]),
        ]);

        const avgCustomerValue =
            topCustomers.length > 0
                ? topCustomers.reduce(
                      (sum, customer) => sum + customer.totalSpent,
                      0
                  ) / topCustomers.length
                : 0;

        return {
            totalCustomers,
            newCustomers,
            returningCustomers: returningCustomers[0]?.returningCustomers || 0,
            avgCustomerValue,
            topCustomers,
            acquisitionData: acquisitionData.map((item) => ({
                period: item._id,
                customers: item.customers,
            })),
        };
    } catch (error) {
        throw new Error(`Failed to get customer analytics: ${error.message}`);
    }
};

// Get order analytics
export const getOrderAnalyticsService = async (timeframe = "month") => {
    try {
        const { startDate } = calculateDateRanges(timeframe);

        const statusDistribution = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        return {
            statusDistribution: statusDistribution.map((item) => ({
                status: item._id,
                count: item.count,
            })),
        };
    } catch (error) {
        throw new Error(`Failed to get order analytics: ${error.message}`);
    }
};
