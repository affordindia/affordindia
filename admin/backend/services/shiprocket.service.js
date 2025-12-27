import axios from 'axios';
import { SHIPROCKET_CONFIG } from '../config/shiprocket.config.js';

// In-memory token storage
let authToken = null;
let tokenExpiry = null;

/**
 * Authenticate with Shiprocket and get access token
 */
export async function authenticateShiprocket() {
    try {
        if (authToken && tokenExpiry && new Date() < tokenExpiry) {
            return authToken;
        }

        console.log('🔐 Authenticating with Shiprocket...');

        const response = await axios.post(
            `${SHIPROCKET_CONFIG.BASE_URL}/v1/external/auth/login`,
            {
                email: SHIPROCKET_CONFIG.EMAIL,
                password: SHIPROCKET_CONFIG.PASSWORD,
            }
        );

        authToken = response.data.token;
        tokenExpiry = new Date(Date.now() + SHIPROCKET_CONFIG.TOKEN_EXPIRY_BUFFER * 24 * 60 * 60 * 1000);

        console.log('✅ Shiprocket authentication successful');
        return authToken;
    } catch (error) {
        console.error('❌ Shiprocket authentication failed:', error.response?.data || error.message);
        throw new Error(`Shiprocket authentication failed: ${error.response?.data?.message || error.message}`);
    }
}

/**
 * Create order in Shiprocket - matches exact API format
 */
export async function createShiprocketOrder(order, user) {
    try {
        if (!SHIPROCKET_CONFIG.ENABLED) {
            console.log('⚠️ Shiprocket integration disabled');
            return null;
        }

        console.log('📦 Creating Shiprocket order for:', order.orderId);

        const token = await authenticateShiprocket();

        // Format date: "YYYY-MM-DD HH:mm"
        const orderDate = order.createdAt.toISOString().slice(0, 16).replace('T', ' ');

        // Calculate package dimensions
        const totalWeight = calculateTotalWeight(order.items);
        const length = calculateTotalLength(order.items);
        const breadth = calculateMaxBreadth(order.items);
        const height = calculateTotalHeight(order.items);

        // Format order data matching exact API format
        const orderData = {
            order_id: order.orderId,
            order_date: orderDate,
            pickup_location: SHIPROCKET_CONFIG.PICKUP_LOCATION,
            comment: `Order from AffordIndia`,
            
            // Billing details (numbers not strings for phone/pincode)
            billing_customer_name: user.name || order.receiverName || 'Customer',
            billing_last_name: '',
            billing_address: formatAddress(order.billingAddress),
            billing_address_2: order.billingAddress.landmark || '',
            billing_city: order.billingAddress.city,
            billing_pincode: parseInt(order.billingAddress.pincode),
            billing_state: order.billingAddress.state,
            billing_country: order.billingAddress.country || 'India',
            billing_email: user.email || 'customer@affordindia.com',
            billing_phone: parseInt(order.receiverPhone || user.phone || '0000000000'),
            
            // Shipping details
            shipping_is_billing: order.billingAddressSameAsShipping,
            shipping_customer_name: order.receiverName || user.name || 'Customer',
            shipping_last_name: '',
            shipping_address: order.billingAddressSameAsShipping ? '' : formatAddress(order.shippingAddress),
            shipping_address_2: order.billingAddressSameAsShipping ? '' : (order.shippingAddress.landmark || ''),
            shipping_city: order.billingAddressSameAsShipping ? '' : order.shippingAddress.city,
            shipping_pincode: order.billingAddressSameAsShipping ? '' : order.shippingAddress.pincode,
            shipping_country: order.billingAddressSameAsShipping ? '' : (order.shippingAddress.country || 'India'),
            shipping_state: order.billingAddressSameAsShipping ? '' : order.shippingAddress.state,
            shipping_email: order.billingAddressSameAsShipping ? '' : (user.email || 'customer@affordindia.com'),
            shipping_phone: order.billingAddressSameAsShipping ? '' : (order.receiverPhone || user.phone || ''),
            
            // Order items - send actual selling price (after discount)
            order_items: order.items.map(item => ({
                name: item.product.name,
                sku: item.product.sku || `SKU-${item.product._id}`,
                units: item.quantity,
                selling_price: item.discountedPrice, // Actual price customer pays per item
                discount: 0, // Already included in discountedPrice
                tax: '', // Empty string as per API docs
                hsn: item.product.hsnCode ? parseInt(item.product.hsnCode) : ''
            })),
            
            // Payment details
            payment_method: order.paymentMethod === 'COD' ? 'COD' : 'Prepaid',
            shipping_charges: order.shippingFee || 0,
            giftwrap_charges: 0,
            transaction_charges: 0,
            total_discount: order.couponDiscount, // Only coupon discount (product discounts already in item prices)
            sub_total: order.subtotal - order.totalDiscount, // Items total after product discounts
            
            // Package dimensions
            length: length,
            breadth: breadth,
            height: height,
            weight: totalWeight
        };

        console.log('📤 Sending order to Shiprocket:', {
            orderId: orderData.order_id,
            items: orderData.order_items.length,
            weight: orderData.weight,
            payment: orderData.payment_method,
            sub_total: orderData.sub_total,
            shipping_charges: orderData.shipping_charges,
            total_discount: orderData.total_discount,
            calculated_total: orderData.sub_total + orderData.shipping_charges,
            actual_order_total: order.total
        });

        console.log('📦 Order breakdown:', {
            original_subtotal: order.subtotal,
            product_discounts: order.totalDiscount,
            coupon_discount: order.couponDiscount,
            shipping: order.shippingFee,
            final_total: order.total
        });

        console.log('📦 Items detail:', orderData.order_items.map(item => ({
            name: item.name,
            units: item.units,
            selling_price: item.selling_price,
            total: item.selling_price * item.units
        })));

        const response = await axios.post(
            `${SHIPROCKET_CONFIG.BASE_URL}/v1/external/orders/create/adhoc`,
            orderData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log('📦 Full Shiprocket response:', JSON.stringify(response.data, null, 2));

        // Handle different response structures
        const responseData = response.data;
        const orderId = responseData.order_id || responseData.data?.order_id;
        const shipmentId = responseData.shipment_id || responseData.data?.shipment_id;

        console.log('✅ Shiprocket order created:', {
            order_id: orderId,
            shipment_id: shipmentId,
            status: responseData.status || responseData.status_code
        });

        return {
            order_id: orderId,
            shipment_id: shipmentId,
            ...responseData
        };
    } catch (error) {
        console.error('❌ Failed to create Shiprocket order:', error.response?.data || error.message);
        console.error('Order can be manually created in Shiprocket dashboard');
        return null;
    }
}

/**
 * Track shipment by AWB code
 */
export async function trackShipment(awbCode) {
    try {
        const token = await authenticateShiprocket();

        const response = await axios.get(
            `${SHIPROCKET_CONFIG.BASE_URL}/v1/external/courier/track/awb/${awbCode}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('❌ Failed to track shipment:', error.response?.data || error.message);
        return null;
    }
}

// Helper functions
function formatAddress(address) {
    const parts = [
        address.houseNumber,
        address.street,
        address.area
    ].filter(Boolean);
    return parts.join(', ') || address.city;
}

function calculateTotalWeight(items) {
    let totalWeight = 0;
    for (const item of items) {
        const weight = item.product?.weight || SHIPROCKET_CONFIG.DEFAULT_DIMENSIONS.weight;
        totalWeight += weight * item.quantity;
    }
    return Math.max(totalWeight, 0.5); // Minimum 0.5kg
}

function calculateTotalLength(items) {
    return SHIPROCKET_CONFIG.DEFAULT_DIMENSIONS.length;
}

function calculateMaxBreadth(items) {
    return SHIPROCKET_CONFIG.DEFAULT_DIMENSIONS.breadth;
}

function calculateTotalHeight(items) {
    return SHIPROCKET_CONFIG.DEFAULT_DIMENSIONS.height;
}
