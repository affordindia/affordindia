import { getDashboardStatsService } from "../services/dashboard.service.js";

export const getDashboardStats = async (req, res) => {
    try {
        const stats = await getDashboardStatsService();

        res.json({
            success: true,
            data: stats,
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics",
            error: error.message,
        });
    }
};
