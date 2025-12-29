import Order from '../models/order.model.js';

/**
 * Handle Shiprocket webhook for order status updates
 */
export const handleShiprocketWebhook = async (req, res, next) => {
    try {
        console.log('📦 Received Shiprocket webhook');
        console.log('📦 Headers:', JSON.stringify(req.headers, null, 2));
        
        const webhookData = req.body;
        console.log('📦 Webhook data:', JSON.stringify(webhookData, null, 2));

        // If it's a test/ping request with no data, return success
        if (!webhookData || Object.keys(webhookData).length === 0) {
            console.log('📦 Empty webhook (test ping) - returning success');
            return res.status(200).json({
                success: true,
                message: 'Webhook endpoint is active'
            });
        }

        // Extract key fields from webhook
        const {
            awb,
            sr_order_id,
            order_id,
            channel_order_id, // This is YOUR order ID
            current_status,
            current_status_id,
            shipment_status,
            shipment_status_id,
            courier_name,
            courier_id,
            etd,
            pickup_scheduled_date,
            awb_assigned_date,
            scans,
            pod_status,
        } = webhookData;

        // Status mapping from Shiprocket to internal system
        const statusMapping = {
            'DELIVERED': 'delivered',
            'Delivered': 'delivered',
            'READY_TO_SHIP': 'processing',
            'SHIPPED': 'shipped',
            'PICKED UP': 'shipped',
            'PICKUP_SCHEDULED': 'processing',
            'CANCELLED': 'cancelled',
            'LOST': 'cancelled',
            'RETURN_IN_TRANSIT': 'return_initiated',
            'RETURNED': 'returned',
        };

        // Find order by multiple fields
        let order = await Order.findOne({
            $or: [
                { 'shiprocket.awbCode': awb },
                { 'shiprocket.orderId': order_id },
                { orderId: channel_order_id } // Use channel_order_id to find your order
            ]
        });

        if (!order) {
            console.log('⚠️ Order not found for AWB:', awb, 'Shiprocket Order ID:', order_id, 'Channel Order ID:', channel_order_id);
            return res.status(200).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Update order with Shiprocket tracking information
        if (!order.shiprocket) {
            order.shiprocket = {};
        }

        order.shiprocket = {
            ...order.shiprocket,
            awbCode: awb,
            orderId: order_id, // Shiprocket order ID
            courierId: courier_id,
            courierName: courier_name,
            status: current_status,
            statusId: current_status_id,
            shipmentStatus: shipment_status,
            shipmentStatusId: shipment_status_id,
            etd: etd,
            pickupScheduledDate: pickup_scheduled_date,
            awbAssignedDate: awb_assigned_date,
            lastUpdated: new Date(),
            scans: scans || [], // Store tracking scans
            webhookEvents: [...(order.shiprocket.webhookEvents || []), {
                status: current_status,
                receivedAt: new Date(),
                data: webhookData
            }]
        };

        // Update order status based on Shiprocket status
        const mappedStatus = statusMapping[current_status];
        if (mappedStatus) {
            order.orderStatus = mappedStatus;
        }

        // If delivered, set deliveredAt date
        if (current_status === 'DELIVERED') {
            order.deliveredAt = new Date();
        }

        await order.save();
        console.log('✅ Order updated:', order.orderId, 'Status:', current_status);

        return res.status(200).json({
            success: true,
            message: 'Webhook processed successfully'
        });
    } catch (error) {
        console.error('❌ Webhook processing error:', error);
        // Return 200 even on error so Shiprocket doesn't mark endpoint as failed
        return res.status(200).json({
            success: false,
            message: 'Webhook received but processing failed',
            error: error.message
        });
    }
};

/**
 * Manually sync order status from Shiprocket
 */
export const syncOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findById(orderId);
        if (!order || !order.shiprocket?.awbCode) {
            return res.status(404).json({
                success: false,
                message: 'Order or AWB not found'
            });
        }

        // Track shipment from Shiprocket
        const { trackShipment } = await import('../services/shiprocket.service.js');
        const trackingData = await trackShipment(order.shiprocket.awbCode);

        if (!trackingData) {
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch tracking data'
            });
        }

        res.json({
            success: true,
            data: trackingData
        });
    } catch (error) {
        console.error('❌ Manual sync error:', error);
        next(error);
    }
};

/**
 * Create Shiprocket order - called by client backend via API
 */
export const createShiprocketOrderHandler = async (req, res, next) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({
                success: false,
                message: 'orderId is required'
            });
        }

        console.log('📦 Creating Shiprocket order for:', orderId);

        // Find order in database
        const order = await Order.findById(orderId)
            .populate('items.product')
            .populate('user');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Import and call shiprocket service
        const { createShiprocketOrder } = await import('../services/shiprocket.service.js');
        const shiprocketResponse = await createShiprocketOrder(order, order.user);

        if (shiprocketResponse) {
            // Update order with shiprocket details
            order.shiprocket = {
                orderId: shiprocketResponse.order_id,
                shipmentId: shiprocketResponse.shipment_id,
                createdAt: new Date(),
            };
            await order.save();
            console.log('✅ Shiprocket order created:', shiprocketResponse.order_id);

            return res.json({
                success: true,
                data: {
                    shiprocketOrderId: shiprocketResponse.order_id,
                    shipmentId: shiprocketResponse.shipment_id
                }
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create Shiprocket order'
        });
    } catch (error) {
        console.error('❌ Shiprocket order creation error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create Shiprocket order'
        });
    }
};
