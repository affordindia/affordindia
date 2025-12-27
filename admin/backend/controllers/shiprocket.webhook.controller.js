import Order from '../models/order.model.js';

/**
 * Handle Shiprocket webhook for order status updates
 */
export const handleShiprocketWebhook = async (req, res, next) => {
    try {
        console.log('📦 Received Shiprocket webhook');
        
        const webhookData = req.body;
        console.log('📦 Webhook data:', JSON.stringify(webhookData, null, 2));

        // Extract key fields from webhook
        const {
            awb,
            sr_order_id,
            order_id,
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

        // Find order by AWB or order_id or sr_order_id
        let order = await Order.findOne({
            $or: [
                { 'shiprocket.awbCode': awb },
                { 'shiprocket.orderId': sr_order_id },
                { orderId: order_id }
            ]
        });

        if (!order) {
            console.log('⚠️ Order not found for webhook:', { awb, sr_order_id, order_id });
            return res.status(200).json({ message: 'Order not found, webhook acknowledged' });
        }

        // Update order with webhook data
        order.shiprocket = {
            ...order.shiprocket?.toObject?.() || order.shiprocket || {},
            awbCode: awb || order.shiprocket?.awbCode,
            courierName: courier_name || order.shiprocket?.courierName,
            courierId: courier_id || order.shiprocket?.courierId,
            currentStatus: current_status,
            currentStatusId: current_status_id,
            shipmentStatus: shipment_status,
            shipmentStatusId: shipment_status_id,
            estimatedDeliveryDate: etd ? new Date(etd) : order.shiprocket?.estimatedDeliveryDate,
            pickupScheduledDate: pickup_scheduled_date ? new Date(pickup_scheduled_date) : order.shiprocket?.pickupScheduledDate,
            awbAssignedDate: awb_assigned_date ? new Date(awb_assigned_date) : order.shiprocket?.awbAssignedDate,
            lastWebhookAt: new Date(),
            scans: scans || order.shiprocket?.scans || [],
            podStatus: pod_status || order.shiprocket?.podStatus,
            webhookEvents: [...(order.shiprocket?.webhookEvents || []), {
                receivedAt: new Date(),
                data: webhookData
            }]
        };

        // Update tracking number if available
        if (awb) {
            order.trackingNumber = awb;
        }

        // Map Shiprocket status to our order status
        const statusMapping = {
            'MANIFEST GENERATED': 'processing',
            'PICKED UP': 'shipped',
            'SHIPPED': 'shipped',
            'IN TRANSIT': 'in_transit',
            'OUT FOR DELIVERY': 'out_for_delivery',
            'DELIVERED': 'delivered',
            'RTO INITIATED': 'rto_initiated',
            'RTO DELIVERED': 'rto_delivered',
            'CANCELLED': 'cancelled',
        };

        if (current_status && statusMapping[current_status]) {
            order.status = statusMapping[current_status];
        }

        // Set delivered date
        if (current_status === 'DELIVERED' && !order.deliveredAt) {
            order.deliveredAt = new Date();
        }

        await order.save();

        console.log('✅ Order updated with tracking:', awb);

        res.status(200).json({
            success: true,
            message: 'Webhook processed successfully'
        });
    } catch (error) {
        console.error('❌ Webhook processing error:', error);
        next(error);
    }
};

/**
 * Manually sync order status from Shiprocket
 */
export const syncOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const order = await Order.findOne({ orderId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (!order.shiprocket?.awbCode) {
            return res.status(400).json({
                success: false,
                message: 'Order does not have AWB code yet'
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
