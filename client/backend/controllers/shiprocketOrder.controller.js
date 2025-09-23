import shiprocketOrderService from "../services/shiprocketOrder.service.js";
import Order from "../models/order.model.js";

/**
 * Create order in Shiprocket for an existing order
 */
export const createShiprocketOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        console.log(`📦 Creating Shiprocket order for: ${orderId}`);

        // Find the order in our database
        const order = await Order.findById(orderId)
            .populate("items.product")
            .populate("user");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if already created in Shiprocket
        if (order.shiprocket?.orderId) {
            return res.status(400).json({
                success: false,
                message: "Order already exists in Shiprocket",
                shiprocketOrderId: order.shiprocket.orderId
            });
        }

        // Format order data for Shiprocket
        const shiprocketOrderData = shiprocketOrderService.formatOrderForShiprocket(order);

        // Create order in Shiprocket
        const shiprocketResponse = await shiprocketOrderService.createOrder(shiprocketOrderData);

        // Update our order with Shiprocket details
        const updateData = {
            "shiprocket.orderId": shiprocketResponse.order_id,
            "shiprocket.shipmentId": shiprocketResponse.shipment_id,
            "shiprocket.lastSyncAt": new Date(),
            status: "processing" // Update status when created in Shiprocket
        };

        // If AWB code is available (rare on creation)
        if (shiprocketResponse.awb_code) {
            updateData["shiprocket.awbCode"] = shiprocketResponse.awb_code;
            updateData.trackingNumber = shiprocketResponse.awb_code;
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        );

        res.json({
            success: true,
            message: "Order created in Shiprocket successfully",
            data: {
                orderId: order.orderId,
                shiprocketOrderId: shiprocketResponse.order_id,
                shipmentId: shiprocketResponse.shipment_id,
                status: shiprocketResponse.status,
                statusCode: shiprocketResponse.status_code,
                awbCode: shiprocketResponse.awb_code,
                courierCompanyId: shiprocketResponse.courier_company_id,
                courierName: shiprocketResponse.courier_name
            }
        });

    } catch (error) {
        console.error("❌ Create Shiprocket order error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create order in Shiprocket",
            error: error.message
        });
    }
};

/**
 * Test order creation with sample data
 */
export const testCreateOrder = async (req, res) => {
    try {
        // Create a test order data structure
        const testOrderData = {
            order_id: `TEST_${Date.now()}`,
            order_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
            pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "warehouse",
            comment: "Test order from API",
            
            billing_customer_name: "John",
            billing_last_name: "Doe",
            billing_address: "123 Test Street",
            billing_address_2: "Near Test Mall",
            billing_city: "Mumbai",
            billing_pincode: 400001,
            billing_state: "Maharashtra",
            billing_country: "India",
            billing_email: "test@example.com",
            billing_phone: 9876543210,
            
            shipping_is_billing: true,
            shipping_customer_name: "",
            shipping_last_name: "",
            shipping_address: "",
            shipping_address_2: "",
            shipping_city: "",
            shipping_pincode: "",
            shipping_country: "",
            shipping_state: "",
            shipping_email: "",
            shipping_phone: "",
            
            order_items: [
                {
                    name: "Test Product",
                    sku: "TEST001",
                    units: 1,
                    selling_price: 100,
                    discount: 0,
                    tax: "",
                    hsn: 441122
                }
            ],
            
            payment_method: "COD",
            shipping_charges: 0,
            giftwrap_charges: 0,
            transaction_charges: 0,
            total_discount: 0,
            sub_total: 100,
            length: 10,
            breadth: 10,
            height: 10,
            weight: 0.5
        };

        // Create test order in Shiprocket
        const response = await shiprocketOrderService.createOrder(testOrderData);

        res.json({
            success: true,
            message: "Test order created successfully",
            testOrderData: testOrderData,
            shiprocketResponse: response
        });

    } catch (error) {
        console.error("❌ Test create order error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create test order",
            error: error.message
        });
    }
};

/**
 * Generate AWB for an order
 */
export const generateAWB = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { courierId } = req.body; // Optional courier selection

        console.log(`📋 Generating AWB for order: ${orderId}`);

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Check if order exists in Shiprocket
        if (!order.shiprocket?.shipmentId) {
            return res.status(400).json({
                success: false,
                message: "Order not found in Shiprocket. Please create the order first."
            });
        }

        // Check if AWB already generated
        if (order.shiprocket?.awbCode) {
            return res.status(400).json({
                success: false,
                message: "AWB already generated for this order",
                awbCode: order.shiprocket.awbCode
            });
        }

        // Generate AWB
        const awbResponse = await shiprocketOrderService.generateAWB(
            order.shiprocket.shipmentId,
            courierId
        );

        // Check if AWB generation was successful
        if (awbResponse.awb_assign_status !== 1) {
            throw new Error("AWB assignment failed");
        }

        const awbData = awbResponse.response.data;

        // Update order with AWB details
        const updateData = {
            "shiprocket.awbCode": awbData.awb_code,
            "shiprocket.courierId": awbData.courier_company_id,
            "shiprocket.courierName": awbData.courier_name,
            "shiprocket.pickupScheduled": true,
            "shiprocket.pickupDate": new Date(awbData.pickup_scheduled_date),
            "shiprocket.lastSyncAt": new Date(),
            trackingNumber: awbData.awb_code, // For backward compatibility
        };

        // Only set status to shipped if order is not already finalized
        const finalizedStatuses = ["delivered", "returned", "cancelled", "canceled"];
        if (!finalizedStatuses.includes(order.status)) {
            updateData.status = "shipped";
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            updateData,
            { new: true }
        );

        res.json({
            success: true,
            message: "AWB generated successfully",
            data: {
                orderId: order.orderId,
                awbCode: awbData.awb_code,
                courierName: awbData.courier_name,
                courierCompanyId: awbData.courier_company_id,
                pickupScheduledDate: awbData.pickup_scheduled_date,
                appliedWeight: awbData.applied_weight,
                invoiceNo: awbData.invoice_no,
                status: "shipped"
            }
        });

    } catch (error) {
        console.error("❌ Generate AWB error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate AWB",
            error: error.message
        });
    }
};

/**
 * Get available couriers list
 */
export const getCouriersList = async (req, res) => {
    try {
        const { type = 'active' } = req.query;
        
        const couriers = await shiprocketOrderService.getCouriersList(type);
        
        res.json({
            success: true,
            couriers: couriers
        });

    } catch (error) {
        console.error("❌ Get couriers list error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get couriers list",
            error: error.message
        });
    }
};

/**
 * Get courier serviceability for an order
 */
export const getCourierServiceability = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order
        const order = await Order.findById(orderId).populate("items.product");
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Calculate weight
        const totalWeight = order.items.reduce((total, item) => {
            const itemWeight = item.product?.weight || 500; // Default 500g
            return total + (itemWeight * item.quantity);
        }, 0);

        // Convert to kg if in grams
        const weightInKg = totalWeight > 100 ? totalWeight / 1000 : totalWeight;

        // Get pickup pincode from environment or default
        const pickupPincode = process.env.SHIPROCKET_PICKUP_PINCODE || "110001";

        const serviceabilityParams = {
            pickupPincode: pickupPincode,
            deliveryPincode: order.shippingAddress.pincode,
            weight: Math.max(weightInKg, 0.5),
            declaredValue: order.total,
            cod: order.paymentMethod === "cod" ? 1 : 0
        };

        const serviceability = await shiprocketOrderService.getCourierServiceability(serviceabilityParams);

        res.json({
            success: true,
            serviceability: serviceability,
            orderDetails: {
                orderId: order.orderId,
                weight: weightInKg,
                declaredValue: order.total,
                pickupPincode: pickupPincode,
                deliveryPincode: order.shippingAddress.pincode,
                paymentMethod: order.paymentMethod
            }
        });

    } catch (error) {
        console.error("❌ Get courier serviceability error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get courier serviceability",
            error: error.message
        });
    }
};

/**
 * Test AWB generation with sample data
 */
export const testGenerateAWB = async (req, res) => {
    try {
        console.log("🔍 AWB Test Request Body:", req.body);
        
        const { shipment_id, shipmentId, courier_id, courierId } = req.body;
        
        console.log("🔍 Extracted values:", {
            shipment_id,
            shipmentId,
            courier_id,
            courierId
        });
        
        // Support both naming conventions
        const finalShipmentId = shipment_id || shipmentId;
        const finalCourierId = courier_id || courierId;

        console.log("🔍 Final values:", {
            finalShipmentId,
            finalCourierId
        });

        if (!finalShipmentId) {
            console.log("❌ No shipment ID found");
            return res.status(400).json({
                success: false,
                message: "shipment_id is required for testing"
            });
        }

        const awbResponse = await shiprocketOrderService.generateAWB(finalShipmentId, finalCourierId);

        res.json({
            success: true,
            message: "Test AWB generation successful",
            data: awbResponse
        });

    } catch (error) {
        console.error("❌ Test AWB generation error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to test AWB generation",
            error: error.message
        });
    }
};

/**
 * Cancel order in Shiprocket
 */
export const cancelShiprocketOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find the order
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (!order.shiprocket?.orderId) {
            return res.status(400).json({
                success: false,
                message: "Order not found in Shiprocket"
            });
        }

        // Cancel in Shiprocket
        const cancelResponse = await shiprocketOrderService.cancelOrder([order.shiprocket.orderId]);

        // Update our order status
        await Order.findByIdAndUpdate(orderId, {
            status: "cancelled",
            cancelledAt: new Date()
        });

        res.json({
            success: true,
            message: "Order cancelled in Shiprocket",
            response: cancelResponse
        });

    } catch (error) {
        console.error("❌ Cancel order error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to cancel order",
            error: error.message
        });
    }
};