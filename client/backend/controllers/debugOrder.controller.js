import Order from "../models/order.model.js";

/**
 * Debug endpoint to check order data structure
 */
export const debugOrderData = async (req, res) => {
    try {
        // Get a few recent orders to check their structure
        const orders = await Order.find({})
            .limit(5)
            .sort({ createdAt: -1 })
            .lean();

        console.log("📋 Debug: Found orders:", orders.length);

        const debugInfo = orders.map(order => ({
            orderId: order.orderId,
            _id: order._id,
            status: order.status,
            hasShiprocket: !!order.shiprocket,
            shiprocketData: order.shiprocket || "No Shiprocket data",
            createdAt: order.createdAt
        }));

        res.json({
            success: true,
            message: "Order debug information",
            totalOrders: orders.length,
            debugInfo: debugInfo,
            sampleOrderStructure: orders[0] || "No orders found"
        });

    } catch (error) {
        console.error("❌ Debug order data error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to debug order data",
            error: error.message
        });
    }
};

/**
 * Add test Shiprocket data to an existing order
 */
export const addTestShiprocketData = async (req, res) => {
    try {
        const { orderId } = req.params;

        const testShiprocketData = {
            "shiprocket.orderId": 970408305,
            "shiprocket.shipmentId": 966827206,
            "shiprocket.awbCode": "TEST123456789",
            "shiprocket.courierName": "Test Express Courier",
            "shiprocket.courierId": 1,
            "shiprocket.pickupScheduled": true,
            "shiprocket.lastSyncAt": new Date(),
            status: "shipped" // Update status to shipped
        };

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            testShiprocketData,
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
            message: "Test Shiprocket data added to order",
            order: updatedOrder,
            addedData: testShiprocketData
        });

    } catch (error) {
        console.error("❌ Add test Shiprocket data error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add test Shiprocket data",
            error: error.message
        });
    }
};

/**
 * Create a complete test order with Shiprocket data for UI testing
 */
export const createTestOrderWithTracking = async (req, res) => {
    try {
        const testOrder = new Order({
            orderId: `TEST_${Date.now()}`,
            user: req.user?._id || "60f1b2b3c4d5e6f7a8b9c0d1", // Mock user ID
            items: [
                {
                    product: "60f1b2b3c4d5e6f7a8b9c0d2", // Mock product ID
                    quantity: 1,
                    price: 999,
                    discountedPrice: 899
                }
            ],
            subtotal: 999,
            totalDiscount: 100,
            shippingFee: 0,
            total: 899,
            status: "shipped",
            paymentMethod: "COD",
            paymentStatus: "pending",
            shippingAddress: {
                houseNumber: "123",
                street: "Test Street",
                area: "Test Area",
                city: "Mumbai",
                state: "Maharashtra",
                pincode: 400001,
                country: "India"
            },
            shiprocket: {
                orderId: 970408305,
                shipmentId: 966827206,
                awbCode: "TEST123456789",
                courierName: "Test Express Courier",
                courierId: 1,
                pickupScheduled: true,
                lastSyncAt: new Date(),
                statusHistory: [
                    {
                        status: "Order Created",
                        location: "Mumbai Warehouse",
                        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                        activity: "Order received and processing"
                    },
                    {
                        status: "Picked Up",
                        location: "Mumbai, Maharashtra",
                        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                        activity: "Package picked up by courier"
                    },
                    {
                        status: "In Transit",
                        location: "Delhi Hub",
                        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
                        activity: "Package in transit"
                    }
                ]
            }
        });

        const savedOrder = await testOrder.save();

        res.json({
            success: true,
            message: "Test order with tracking created successfully",
            order: savedOrder,
            instructions: {
                step1: "Go to http://localhost:5173/orders",
                step2: "You should see this test order with tracking info",
                step3: "Click 'View Details' to see full tracking component",
                orderId: savedOrder._id
            }
        });

    } catch (error) {
        console.error("❌ Create test order error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create test order",
            error: error.message
        });
    }
};