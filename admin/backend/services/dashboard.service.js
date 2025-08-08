import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import Review from "../models/review.model.js";
import Banner from "../models/banner.model.js";
import Coupon from "../models/coupon.model.js";

export const getDashboardStatsService = async () => {
    try {
        // Get date ranges for comparison
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterdayStart = new Date(todayStart.getTime() - 24 * 60 * 60 * 1000);
        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        // Parallel queries for better performance
        const [
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            todayOrders,
            yesterdayOrders,
            thisMonthOrders,
            lastMonthOrders,
            todayRevenue,
            thisMonthRevenue,
            recentOrders,
            lowStockProducts,
            totalReviews,
            activeBanners,
            activeCoupons,
            topProducts,
            orderStatusCounts,
        ] = await Promise.all([
            // Basic counts
            User.countDocuments(),
            Product.countDocuments(),
            Order.countDocuments(),
            
            // Revenue calculations
            Order.aggregate([
                { $match: { paymentStatus: "paid" } },
                { $group: { _id: null, total: { $sum: "$total" } } }
            ]),

            // Today's orders
            Order.countDocuments({ createdAt: { $gte: todayStart } }),
            
            // Yesterday's orders  
            Order.countDocuments({ 
                createdAt: { 
                    $gte: yesterdayStart, 
                    $lt: todayStart 
                } 
            }),

            // This month's orders
            Order.countDocuments({ createdAt: { $gte: thisMonthStart } }),
            
            // Last month's orders
            Order.countDocuments({ 
                createdAt: { 
                    $gte: lastMonthStart, 
                    $lt: thisMonthStart 
                } 
            }),

            // Today's revenue
            Order.aggregate([
                { 
                    $match: { 
                        createdAt: { $gte: todayStart },
                        paymentStatus: "paid" 
                    } 
                },
                { $group: { _id: null, total: { $sum: "$total" } } }
            ]),

            // This month's revenue
            Order.aggregate([
                { 
                    $match: { 
                        createdAt: { $gte: thisMonthStart },
                        paymentStatus: "paid" 
                    } 
                },
                { $group: { _id: null, total: { $sum: "$total" } } }
            ]),

            // Recent orders (last 5)
            Order.find()
                .populate("user", "name phone")
                .sort({ createdAt: -1 })
                .limit(5)
                .select("orderNumber total status paymentStatus createdAt user"),

            // Low stock products
            Product.find({ stock: { $lt: 10 } })
                .select("name stock images")
                .limit(10),

            // Total reviews
            Review.countDocuments(),

            // Active banners
            Banner.countDocuments({ isActive: true }),

            // Active coupons
            Coupon.countDocuments({ isActive: true }),

            // Top selling products (this month)
            Order.aggregate([
                { $match: { createdAt: { $gte: thisMonthStart } } },
                { $unwind: "$items" },
                { 
                    $group: { 
                        _id: "$items.product",
                        totalSold: { $sum: "$items.quantity" },
                        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                    } 
                },
                { $sort: { totalSold: -1 } },
                { $limit: 5 },
                { 
                    $lookup: {
                        from: "products",
                        localField: "_id",
                        foreignField: "_id",
                        as: "product"
                    }
                },
                { $unwind: "$product" },
                {
                    $project: {
                        name: "$product.name",
                        image: { $arrayElemAt: ["$product.images", 0] },
                        totalSold: 1,
                        revenue: 1
                    }
                }
            ]),

            // Order status distribution
            Order.aggregate([
                { 
                    $group: { 
                        _id: "$status", 
                        count: { $sum: 1 } 
                    } 
                }
            ]),
        ]);

        // Calculate growth percentages
        const orderGrowthPercent = yesterdayOrders > 0 
            ? ((todayOrders - yesterdayOrders) / yesterdayOrders * 100)
            : todayOrders > 0 ? 100 : 0;

        const monthlyOrderGrowthPercent = lastMonthOrders > 0
            ? ((thisMonthOrders - lastMonthOrders) / lastMonthOrders * 100)
            : thisMonthOrders > 0 ? 100 : 0;

        // Format the response
        const stats = {
            overview: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
                totalReviews,
                activeBanners,
                activeCoupons,
                lowStockCount: lowStockProducts.length,
            },
            
            today: {
                orders: todayOrders,
                revenue: todayRevenue[0]?.total || 0,
                orderGrowthPercent: Math.round(orderGrowthPercent * 10) / 10,
            },

            thisMonth: {
                orders: thisMonthOrders,
                revenue: thisMonthRevenue[0]?.total || 0,
                orderGrowthPercent: Math.round(monthlyOrderGrowthPercent * 10) / 10,
            },

            recentActivity: {
                recentOrders: recentOrders.map(order => ({
                    id: order._id,
                    orderNumber: order.orderNumber,
                    customer: order.user?.name || order.user?.phone || "Guest",
                    total: order.total,
                    status: order.status,
                    paymentStatus: order.paymentStatus,
                    date: order.createdAt,
                })),
                
                lowStockProducts: lowStockProducts.map(product => ({
                    id: product._id,
                    name: product.name,
                    stock: product.stock,
                    image: product.images?.[0] || null,
                })),
            },

            analytics: {
                topProducts,
                orderStatusDistribution: orderStatusCounts.reduce((acc, status) => {
                    acc[status._id] = status.count;
                    return acc;
                }, {}),
            },
        };

        return stats;

    } catch (error) {
        console.error("Dashboard stats service error:", error);
        throw new Error("Failed to fetch dashboard statistics");
    }
};
