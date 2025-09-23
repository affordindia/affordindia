import Order from "../models/order.model.js";

// Shiprocket Webhook Handler
// Expects POST requests from Shiprocket with status updates
export const shiprocketWebhook = async (req, res) => {
    // Verify Shiprocket token
    const token = req.headers["x-token"] || req.headers["x-token".toLowerCase()];
    if (token !== process.env.SHIPROCKET_WEBHOOK_TOKEN) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    // Shiprocket sends status updates in req.body
    const data = req.body;
    if (!data || !data.awb || !data.current_status) {
        return res.status(400).json({ message: "Invalid webhook payload" });
    }

    try {
        // Find the order by AWB code (tracking number)
        const order = await Order.findOne({ "shiprocket.awbCode": data.awb });
        if (!order) {
            return res.status(404).json({ message: "Order not found for AWB" });
        }

        // Update order status based on Shiprocket status
        const mapped = mapShiprocketStatus(data.current_status);
        if (mapped === "delivered") {
            order.status = "delivered";
            order.deliveredAt = new Date();
            order.shiprocket.delivered = true;
        } else if (order.status !== "delivered") {
            order.status = mapped;
        }
        // Optionally, store full status history
        order.shiprocket.statusHistory = order.shiprocket.statusHistory || [];
        order.shiprocket.statusHistory.push({
            status: data.current_status,
            activity: data.status || "",
            location: data.current_city || "",
            time: new Date(),
        });
        await order.save();

        return res.json({ message: "Order status updated", status: order.status });
    } catch (err) {
        console.error("[Shiprocket Webhook] Error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// Helper: Map Shiprocket status to your order status
function mapShiprocketStatus(shiprocketStatus) {
    switch ((shiprocketStatus || "").toLowerCase()) {
        case "order picked up":
        case "shipped":
            return "shipped";
        case "in transit":
            return "in-transit";
        case "out for delivery":
            return "out-for-delivery";
        case "delivered":
            return "delivered";
        case "rto initiated":
        case "rto in transit":
            return "rto";
        case "cancelled":
            return "cancelled";
        default:
            return "processing";
    }
}

/**
 * Handle incoming Shiprocket webhook for tracking updates
 * Webhook URL should be: https://yourdomain.com/api/shiprocket/webhook
 */
export const handleShiprocketWebhook = async (req, res) => {
    try {
        console.log("📦 Shiprocket webhook received:", JSON.stringify(req.body, null, 2));

        // Validate security token from flexible locations
        const headers = req.headers || {};
        const tokenCandidates = [
            headers['x-api-key'],
            headers['anx-api-key'],
            headers['x-token'],
            headers['x-sr-webhook-token'],
            (headers['authorization'] || headers['Authorization'])?.replace(/^Bearer\s+/i, ''),
            req.query?.token,
            req.body?.token
        ].filter(Boolean);
        const securityToken = tokenCandidates[0];
        const expectedToken = process.env.SHIPROCKET_WEBHOOK_SECRET || process.env.SHIPROCKET_WEBHOOK_TOKEN;

        if (expectedToken && securityToken !== expectedToken) {
            console.error("❌ Invalid webhook security token");
            return res.status(401).json({ error: "Unauthorized" });
        }

        const webhookData = req.body;

        // Extract key information from webhook
        const {
            awb,
            courier_name,
            current_status,
            current_status_id,
            shipment_status,
            shipment_status_id,
            current_timestamp,
            order_id,
            sr_order_id,
            awb_assigned_date,
            pickup_scheduled_date,
            etd, // Expected delivery time
            scans,
            is_return,
            channel_id,
            pod_status,
            pod
        } = webhookData;

        // Find the order in our database
        // We can search by AWB code or Shiprocket order ID
        let order = null;

        // Try to find by AWB code first
        if (awb) {
            order = await Order.findOne({
                $or: [
                    { trackingNumber: awb },
                    { "shiprocket.awbCode": awb }
                ]
            });
        }

        // If not found by AWB, try by Shiprocket order ID
        if (!order && sr_order_id) {
            order = await Order.findOne({ "shiprocket.orderId": sr_order_id });
        }

        // If still not found, try by order_id (which might match our orderId)
        if (!order && order_id) {
            // Extract our order ID from Shiprocket order_id format
            const ourOrderId = order_id.split('_')[0]; // "1373900_150876814" -> "1373900"
            order = await Order.findOne({ orderId: ourOrderId });
        }

        if (!order) {
            console.error("❌ Order not found for webhook data:", { awb, sr_order_id, order_id });
            // Still return 200 to acknowledge webhook receipt
            return res.status(200).json({ status: "order_not_found", message: "Order not found but webhook acknowledged" });
        }

        console.log(`✅ Found order: ${order.orderId} for AWB: ${awb}`);

        // Prepare update data
        const updateData = {
            "shiprocket.webhook.lastReceivedAt": new Date(),
            "shiprocket.webhook.lastStatus": current_status,
            "shiprocket.lastSyncAt": new Date()
        };

        // Update AWB and courier info if not present
        if (awb && !order.shiprocket?.awbCode) {
            updateData["shiprocket.awbCode"] = awb;
            updateData.trackingNumber = awb; // For backward compatibility
        }

        if (courier_name && !order.shiprocket?.courierName) {
            updateData["shiprocket.courierName"] = courier_name;
        }

        if (sr_order_id && !order.shiprocket?.orderId) {
            updateData["shiprocket.orderId"] = sr_order_id;
        }

        // Update current status
        if (current_status) {
            updateData["shiprocket.currentStatus"] = current_status;
        }

        // Update expected delivery date
        if (etd) {
            updateData["shiprocket.expectedDeliveryDate"] = new Date(etd);
        }

        // Handle pickup scheduled
        if (pickup_scheduled_date && !order.shiprocket?.pickupScheduled) {
            updateData["shiprocket.pickupScheduled"] = true;
            updateData["shiprocket.pickupDate"] = new Date(pickup_scheduled_date);
        }

        // Update order status based on current_status
        const statusLower = current_status?.toLowerCase() || "";

        // Normalize known variants
        const statusMap = new Map([
            ["out for delivery", "out-for-delivery"],
            ["in transit", "in-transit"],
        ]);
        const normalized = statusMap.get(statusLower) || statusLower;

        if (normalized.includes("delivered")) {
            updateData.status = "delivered";
            updateData.deliveredAt = new Date();
            updateData["shiprocket.delivered"] = true;
        } else if (normalized.includes("picked") || normalized.includes("pickup")) {
            if (!['delivered','returned','cancelled','canceled'].includes(order.status)) {
                updateData.status = "shipped";
            }
        } else if (normalized.includes("shipped") || normalized.includes("transit") || normalized.includes("dispatched")) {
            if (!['delivered','returned','cancelled','canceled'].includes(order.status)) {
                updateData.status = "shipped";
            }
        } else if (normalized.includes("rto") || normalized.includes("return")) {
            updateData["shiprocket.rtoInitiated"] = true;
            updateData.status = "returned";
            updateData.returnedAt = new Date();
        }

        // Handle return orders
        if (is_return === 1) {
            updateData["shiprocket.rtoInitiated"] = true;
            updateData.status = "returned";
            updateData.returnedAt = new Date();
        }

        // Process scans array to build status history
        if (scans && Array.isArray(scans)) {
            const statusHistory = scans.map(scan => ({
                status: scan.status,
                statusDate: new Date(scan.date),
                activity: scan.activity,
                location: scan.location,
                srStatus: scan["sr-status"],
                srStatusLabel: scan["sr-status-label"]
            }));

            // Sort by date (most recent first)
            statusHistory.sort((a, b) => new Date(b.statusDate) - new Date(a.statusDate));

            updateData["shiprocket.statusHistory"] = statusHistory;
        }

        // Update POD information
        if (pod_status) {
            updateData["shiprocket.podStatus"] = pod_status;
        }
        if (pod) {
            updateData["shiprocket.pod"] = pod;
        }

        // Update the order in database
        const updatedOrder = await Order.findByIdAndUpdate(
            order._id,
            updateData,
            { new: true }
        );

        console.log(`📦 Updated order ${order.orderId} with status: ${current_status}`);

        // Log key tracking events
        if (statusLower.includes("delivered")) {
            console.log(`🎉 Order ${order.orderId} has been DELIVERED!`);
        } else if (statusLower.includes("picked")) {
            console.log(`📦 Order ${order.orderId} has been PICKED UP by ${courier_name}`);
        } else if (statusLower.includes("transit")) {
            console.log(`🚛 Order ${order.orderId} is IN TRANSIT via ${courier_name}`);
        } else if (statusLower.includes("rto")) {
            console.log(`⚠️ Order ${order.orderId} is being RETURNED TO ORIGIN`);
        }

        // Always return 200 status as required by Shiprocket
        res.status(200).json({
            status: "success",
            message: "Webhook processed successfully",
            orderId: order.orderId,
            currentStatus: current_status
        });

    } catch (error) {
        console.error("❌ Webhook processing error:", error);
        
        // Still return 200 to acknowledge webhook receipt (as per Shiprocket requirement)
        res.status(200).json({
            status: "error",
            message: "Webhook received but processing failed",
            error: error.message
        });
    }
};

/**
 * Test webhook endpoint for development
 */
export const testWebhook = async (req, res) => {
    const sampleWebhookData = {
        "awb": "19041424751540",
        "courier_name": "Delhivery Surface",
        "current_status": "DELIVERED",
        "current_status_id": 21,
        "shipment_status": "DELIVERED",
        "shipment_status_id": 21,
        "current_timestamp": "23 05 2023 11:43:52",
        "order_id": "TEST123_150876814",
        "sr_order_id": 348456385,
        "awb_assigned_date": "2023-05-19 11:59:16",
        "pickup_scheduled_date": "2023-05-19 11:59:17",
        "etd": "2023-05-23 15:40:19",
        "scans": [
            {
                "date": "2023-05-19 11:59:16",
                "status": "X-UCI",
                "activity": "Manifested - Manifest uploaded",
                "location": "Mumbai (Maharashtra)",
                "sr-status": "5",
                "sr-status-label": "MANIFEST GENERATED"
            },
            {
                "date": "2023-05-23 11:43:46",
                "status": "X-DLV",
                "activity": "Delivered",
                "location": "Customer Address",
                "sr-status": "21",
                "sr-status-label": "DELIVERED"
            }
        ],
        "is_return": 0,
        "channel_id": 3422553,
        "pod_status": "OTP Based Delivery",
        "pod": "Delivered Successfully"
    };

    // Simulate webhook processing
    req.body = sampleWebhookData;
    await handleShiprocketWebhook(req, res);
};