import shiprocketTrackingService from "../services/shiprocketTracking.service.js";
import Order from "../models/order.model.js";

/**
 * Track shipment by AWB code
 */
export const trackByAWB = async (req, res) => {
    try {
        const { awbCode } = req.params;

        console.log(`🔍 Tracking request for AWB: ${awbCode}`);

        // Track the shipment
        const trackingData = await shiprocketTrackingService.trackByAWB(awbCode);

        // Format for display
        const formattedTracking = shiprocketTrackingService.formatTrackingForDisplay(trackingData);

        res.json({
            success: true,
            message: "Tracking information retrieved successfully",
            awbCode: awbCode,
            data: formattedTracking,
            rawData: trackingData // Include raw data for debugging
        });

    } catch (error) {
        console.error("❌ Track by AWB controller error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get tracking information",
            error: error.message
        });
    }
};

/**
 * Track shipment by shipment ID
 */
export const trackByShipmentId = async (req, res) => {
    try {
        const { shipmentId } = req.params;

        console.log(`🔍 Tracking request for shipment ID: ${shipmentId}`);

        const trackingData = await shiprocketTrackingService.trackByShipmentId(shipmentId);

        res.json({
            success: true,
            message: "Shipment tracking retrieved successfully",
            shipmentId: shipmentId,
            data: trackingData
        });

    } catch (error) {
        console.error("❌ Track by shipment ID controller error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get shipment tracking",
            error: error.message
        });
    }
};

/**
 * Track order using our internal order ID
 */
export const trackOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;

        console.log(`🔍 Tracking request for order: ${orderId}`);

        // Find the order in our database
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if order has Shiprocket details
        if (!order.shiprocket?.shipmentId) {
            return res.status(400).json({
                success: false,
                message: "Order not shipped through Shiprocket",
                orderStatus: order.status
            });
        }

        // Track using shipment ID
        const trackingData = await shiprocketTrackingService.trackByShipmentId(order.shiprocket.shipmentId);

        // If we have AWB code, also get detailed tracking
        let detailedTracking = null;
        if (order.shiprocket.awbCode) {
            try {
                detailedTracking = await shiprocketTrackingService.trackByAWB(order.shiprocket.awbCode);
            } catch (error) {
                console.log("⚠️ Could not get detailed tracking:", error.message);
            }
        }

        res.json({
            success: true,
            message: "Order tracking retrieved successfully",
            orderInfo: {
                orderId: order.orderId,
                status: order.status,
                shiprocketOrderId: order.shiprocket.orderId,
                shipmentId: order.shiprocket.shipmentId,
                awbCode: order.shiprocket.awbCode
            },
            trackingData: trackingData,
            detailedTracking: detailedTracking ? shiprocketTrackingService.formatTrackingForDisplay(detailedTracking) : null
        });

    } catch (error) {
        console.error("❌ Track order by ID controller error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get order tracking",
            error: error.message
        });
    }
};

/**
 * Test tracking with sample AWB/Shipment ID
 */
export const testTracking = async (req, res) => {
    try {
        const { awbCode, shipmentId } = req.body;

        if (!awbCode && !shipmentId) {
            return res.status(400).json({
                success: false,
                message: "Either awbCode or shipmentId is required for testing"
            });
        }

        let trackingData = null;

        if (awbCode) {
            console.log(`🧪 Testing tracking with AWB: ${awbCode}`);
            trackingData = await shiprocketTrackingService.trackByAWB(awbCode);
        } else if (shipmentId) {
            console.log(`🧪 Testing tracking with shipment ID: ${shipmentId}`);
            trackingData = await shiprocketTrackingService.trackByShipmentId(shipmentId);
        }

        res.json({
            success: true,
            message: "Test tracking successful",
            testParams: { awbCode, shipmentId },
            data: trackingData
        });

    } catch (error) {
        console.error("❌ Test tracking error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to test tracking",
            error: error.message
        });
    }
};

/**
 * Get tracking history for an AWB
 */
export const getTrackingHistory = async (req, res) => {
    try {
        const { awbCode } = req.params;

        console.log(`📋 Getting tracking history for AWB: ${awbCode}`);

        const trackingHistory = await shiprocketTrackingService.getTrackingHistory(awbCode);

        res.json({
            success: true,
            message: "Tracking history retrieved successfully",
            awbCode: awbCode,
            data: trackingHistory
        });

    } catch (error) {
        console.error("❌ Get tracking history controller error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get tracking history",
            error: error.message
        });
    }
};

/**
 * Track multiple shipments at once
 */
export const trackMultipleShipments = async (req, res) => {
    try {
        const { shipmentIds } = req.body;

        if (!shipmentIds || !Array.isArray(shipmentIds) || shipmentIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Array of shipmentIds is required"
            });
        }

        console.log(`🔍 Tracking multiple shipments:`, shipmentIds);

        const trackingData = await shiprocketTrackingService.trackMultipleShipments(shipmentIds);

        res.json({
            success: true,
            message: "Multiple shipments tracking retrieved successfully",
            shipmentIds: shipmentIds,
            data: trackingData
        });

    } catch (error) {
        console.error("❌ Track multiple shipments controller error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to track multiple shipments",
            error: error.message
        });
    }
};