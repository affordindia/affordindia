import Order from "../models/order.model.js";

/**
 * Simulate order status changes for testing UI
 */
export const simulateOrderStatus = async (req, res) => {
    try {
        const { orderId, status, awbCode, courierName } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({
                success: false,
                message: "orderId and status are required"
            });
        }

        const updateData = {
            status: status,
            updatedAt: new Date()
        };

        // Add shipping-specific data
        if (status === "shipped" || status === "processing") {
            updateData["shiprocket.shipmentId"] = 966827206; // Your test shipment ID
            updateData["shiprocket.orderId"] = 970408305; // Your test order ID
            
            if (awbCode) {
                updateData["shiprocket.awbCode"] = awbCode;
            }
            if (courierName) {
                updateData["shiprocket.courierName"] = courierName;
            }
        }

        // Add delivery timestamp
        if (status === "delivered") {
            updateData.deliveredAt = new Date();
        }

        // Add mock tracking history for shipped orders
        if (status === "shipped") {
            updateData["shiprocket.statusHistory"] = [
                {
                    status: "Order Created",
                    location: "Mumbai Warehouse",
                    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
                    activity: "Order received and processing"
                },
                {
                    status: "Picked Up",
                    location: "Mumbai, Maharashtra",
                    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                    activity: "Package picked up by courier"
                },
                {
                    status: "In Transit",
                    location: "Delhi Hub",
                    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                    activity: "Package in transit"
                },
                {
                    status: "Out for Delivery",
                    location: "Local Delivery Hub",
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    activity: "Out for delivery to customer"
                }
            ];
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        res.json({
            success: true,
            message: `Order status updated to ${status}`,
            order: updatedOrder,
            simulatedData: updateData
        });

    } catch (error) {
        console.error("❌ Simulate order status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to simulate order status",
            error: error.message
        });
    }
};

/**
 * Simulate tracking data for testing
 */
export const simulateTrackingData = async (req, res) => {
    try {
        const { shipmentId, trackingStatus = "in_transit" } = req.body;

        const mockTrackingData = {
            success: true,
            message: "Simulated tracking data",
            data: {
                awbCode: "MOCK123456789",
                status: trackingStatus,
                currentLocation: "Delhi Distribution Center",
                expectedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
                courierPartner: "Mock Courier",
                deliveryStatus: trackingStatus === "delivered" ? "Delivered" : "In Transit",
                shipmentStatus: trackingStatus,
                trackingHistory: [
                    {
                        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                        status: "Order Confirmed",
                        location: "Mumbai Warehouse",
                        activity: "Order received and confirmed"
                    },
                    {
                        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                        status: "Picked Up",
                        location: "Mumbai, Maharashtra",
                        activity: "Package picked up by courier partner"
                    },
                    {
                        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                        status: "In Transit",
                        location: "Delhi Hub",
                        activity: "Package in transit to destination city"
                    },
                    {
                        date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
                        status: "Out for Delivery",
                        location: "Delhi Distribution Center",
                        activity: "Package out for delivery"
                    }
                ]
            }
        };

        // Add delivery event if status is delivered
        if (trackingStatus === "delivered") {
            mockTrackingData.data.trackingHistory.push({
                date: new Date().toISOString(),
                status: "Delivered",
                location: "Customer Location",
                activity: "Package delivered successfully"
            });
        }

        res.json(mockTrackingData);

    } catch (error) {
        console.error("❌ Simulate tracking data error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to simulate tracking data",
            error: error.message
        });
    }
};

/**
 * Reset order to original state
 */
export const resetOrderForTesting = async (req, res) => {
    try {
        const { orderId } = req.params;

        const resetData = {
            status: "pending",
            "shiprocket.shipmentId": null,
            "shiprocket.awbCode": null,
            "shiprocket.courierName": null,
            "shiprocket.statusHistory": [],
            deliveredAt: null,
            updatedAt: new Date()
        };

        const resetOrder = await Order.findByIdAndUpdate(
            orderId,
            { $unset: resetData },
            { new: true }
        );

        res.json({
            success: true,
            message: "Order reset for testing",
            order: resetOrder
        });

    } catch (error) {
        console.error("❌ Reset order error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset order",
            error: error.message
        });
    }
};