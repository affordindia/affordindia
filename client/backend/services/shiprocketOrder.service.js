import shiprocketAuth from "./shiprocketAuth.service.js";
import axios from "axios";

class ShiprocketOrderService {
    constructor() {
        this.baseURL = "https://apiv2.shiprocket.in/v1/external";
    }

    /**
     * Create order in Shiprocket
     * @param {Object} orderData - Order data formatted for Shiprocket
     * @returns {Promise<Object>} Shiprocket order response
     */
    async createOrder(orderData) {
        try {
            console.log("📦 Creating order in Shiprocket...");
            
            const headers = await shiprocketAuth.getAuthHeader();
            
            const response = await axios.post(
                `${this.baseURL}/orders/create/adhoc`,
                orderData,
                { headers }
            );

            console.log("✅ Shiprocket order created successfully:", response.data);
            return response.data;

        } catch (error) {
            console.error("❌ Shiprocket order creation failed:", error.response?.data || error.message);
            throw new Error(`Failed to create Shiprocket order: ${error.response?.data?.message || error.message}`);
        }
    }

    /**
     * Convert our order data to Shiprocket format
     * @param {Object} order - Our order object from database
     * @returns {Object} Formatted data for Shiprocket API
     */
    formatOrderForShiprocket(order) {
        // Parse names - handle cases where receiverName might not be available
        const billingName = this.parseFullName(order.receiverName || `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.trim());
        const shippingName = order.billingAddressSameAsShipping ? billingName : billingName;

        // Format order items
        const orderItems = order.items.map(item => ({
            name: item.product?.name || "Product",
            sku: item.product?.sku || item.product?._id?.toString() || "SKU001",
            units: item.quantity,
            selling_price: item.discountedPrice,
            discount: item.price - item.discountedPrice, // Discount amount per unit
            tax: "", // You can add tax calculation here if needed
            hsn: item.product?.hsn || 441122 // Default HSN code
        }));

        // Calculate dimensions and weight
        const { length, breadth, height, weight } = this.calculateDimensions(order.items);

        // Format addresses
        const billingAddress = this.formatAddress(order.billingAddress);
        const shippingAddress = order.billingAddressSameAsShipping ? 
            billingAddress : this.formatAddress(order.shippingAddress);

        // Ensure phone numbers are always present and valid (fallback to a default if missing)
    // Use a real test phone number for all orders (for testing only)
    const fallbackPhone = "9635236910";
        // Always use user's profile phone for courier contact, format as 10-digit mobile
        function formatIndianMobile(phone) {
            if (!phone) return fallbackPhone;
            // Remove all non-digits, take last 10 digits
            const digits = phone.replace(/\D/g, "");
            return digits.length >= 10 ? digits.slice(-10) : fallbackPhone;
        }
        const billingPhone = formatIndianMobile(order.user?.phone);
        const shippingPhone = formatIndianMobile(order.user?.phone);

        const shiprocketOrder = {
            order_id: order.orderId, // Our unique order ID
            order_date: this.formatDate(order.createdAt),
            pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || "warehouse",
            comment: `Order from AffordIndia - ${order.orderId}`,
            
            // Billing details
            billing_customer_name: billingName.firstName,
            billing_last_name: billingName.lastName,
            billing_address: billingAddress.line1,
            billing_address_2: billingAddress.line2,
            billing_city: order.billingAddress?.city || "",
            billing_pincode: order.billingAddress?.pincode || "",
            billing_state: order.billingAddress?.state || "",
            billing_country: order.billingAddress?.country || "India",
            billing_email: order.user?.email || "",
            billing_phone: billingPhone,
            
            // Shipping details
            shipping_is_billing: order.billingAddressSameAsShipping || true,
            shipping_customer_name: shippingName.firstName,
            shipping_last_name: shippingName.lastName,
            shipping_address: shippingAddress.line1,
            shipping_address_2: shippingAddress.line2,
            shipping_city: order.shippingAddress?.city || order.billingAddress?.city || "",
            shipping_pincode: order.shippingAddress?.pincode || order.billingAddress?.pincode || "",
            shipping_state: order.shippingAddress?.state || order.billingAddress?.state || "",
            shipping_country: order.shippingAddress?.country || order.billingAddress?.country || "India",
            shipping_email: order.user?.email || "",
            shipping_phone: shippingPhone,
            
            // Order items and pricing
            order_items: orderItems,
            payment_method: order.paymentMethod === "cod" ? "COD" : "Prepaid",
            shipping_charges: order.shippingFee || 0,
            giftwrap_charges: 0,
            transaction_charges: 0,
            total_discount: (order.totalDiscount || 0) + (order.couponDiscount || 0),
            sub_total: order.subtotal,
            
            // Package dimensions
            length: length,
            breadth: breadth,
            height: height,
            weight: weight
        };

        console.log("📦 Formatted order for Shiprocket:", JSON.stringify(shiprocketOrder, null, 2));
        return shiprocketOrder;
    }

    /**
     * Parse full name into first and last name
     * @param {string} fullName - Full name string
     * @returns {Object} Object with firstName and lastName
     */
    parseFullName(fullName) {
        if (!fullName || fullName.trim() === "") {
            return { firstName: "Customer", lastName: "" };
        }

        const nameParts = fullName.trim().split(" ");
        return {
            firstName: nameParts[0] || "Customer",
            lastName: nameParts.slice(1).join(" ") || ""
        };
    }

    /**
     * Format address for Shiprocket
     * @param {Object} address - Address object
     * @returns {Object} Formatted address
     */
    formatAddress(address) {
        if (!address) {
            return { line1: "", line2: "" };
        }

        const line1Parts = [
            address.houseNumber,
            address.street,
            address.area
        ].filter(Boolean);

        const line2Parts = [
            address.landmark
        ].filter(Boolean);

        return {
            line1: line1Parts.join(", ").slice(0, 250), // Shiprocket limit
            line2: line2Parts.join(", ").slice(0, 250)
        };
    }

    /**
     * Calculate package dimensions and weight
     * @param {Array} items - Order items
     * @returns {Object} Dimensions and weight
     */
    calculateDimensions(items) {
        let totalWeight = 0;

        // Calculate total weight
        items.forEach(item => {
            const itemWeight = item.product?.weight || 500; // Default 500g per item
            totalWeight += (itemWeight * item.quantity);
        });

        // Convert grams to kg if weight is in grams
        if (totalWeight > 100) {
            totalWeight = totalWeight / 1000; // Convert g to kg
        }

        // Default dimensions (can be made dynamic based on products)
        return {
            length: 10,
            breadth: 10,
            height: 10,
            weight: Math.max(totalWeight, 0.5) // Minimum 0.5 kg
        };
    }

    /**
     * Format date for Shiprocket (YYYY-MM-DD HH:MM)
     * @param {Date} date - Date object
     * @returns {string} Formatted date string
     */
    formatDate(date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    /**
     * Generate AWB (Air Waybill) for shipment
     * @param {number} shipmentId - Shiprocket shipment ID
     * @param {number} courierId - Optional courier ID (if not provided, default courier is used)
     * @param {string} status - Optional status for reassigning courier
     * @returns {Promise<Object>} AWB generation response
     */
    async generateAWB(shipmentId, courierId = null, status = null) {
        try {
            console.log(`📋 Generating AWB for shipment: ${shipmentId}`);
            
            const headers = await shiprocketAuth.getAuthHeader();
            
            const requestData = {
                shipment_id: shipmentId
            };

            // Add courier ID if specified
            if (courierId) {
                requestData.courier_id = courierId;
            }

            // Add status if specified (for reassigning)
            if (status) {
                requestData.status = status;
            }

            const response = await axios.post(
                `${this.baseURL}/courier/assign/awb`,
                requestData,
                { headers }
            );

            console.log("✅ AWB generated successfully:", response.data);
            return response.data;

        } catch (error) {
            console.error("❌ AWB generation failed:", error.response?.data || error.message);
            throw new Error(`Failed to generate AWB: ${error.response?.data?.message || error.message}`);
        }
    }

    /**
     * Get list of available couriers
     * @param {string} type - Filter type: 'active', 'inactive', or 'all'
     * @returns {Promise<Object>} Couriers list
     */
    async getCouriersList(type = 'active') {
        try {
            const headers = await shiprocketAuth.getAuthHeader();
            
            const response = await axios.get(
                `${this.baseURL}/courier/courierListWithCounts?type=${type}`,
                { headers }
            );

            return response.data;

        } catch (error) {
            console.error("❌ Failed to get couriers list:", error.response?.data || error.message);
            throw new Error(`Failed to get couriers list: ${error.message}`);
        }
    }

    /**
     * Get courier serviceability and rates
     * @param {Object} params - Serviceability parameters
     * @returns {Promise<Object>} Available courier services
     */
    async getCourierServiceability(params) {
        try {
            const headers = await shiprocketAuth.getAuthHeader();
            
            const queryParams = new URLSearchParams({
                pickup_postcode: params.pickupPincode,
                delivery_postcode: params.deliveryPincode,
                weight: params.weight,
                declared_value: params.declaredValue,
                cod: params.cod || 0
            });

            const response = await axios.get(
                `${this.baseURL}/courier/serviceability/?${queryParams}`,
                { headers }
            );

            return response.data;

        } catch (error) {
            console.error("❌ Failed to get courier serviceability:", error.response?.data || error.message);
            throw new Error(`Failed to get courier serviceability: ${error.message}`);
        }
    }

    /**
     * Cancel order in Shiprocket
     * @param {Array} orderIds - Array of Shiprocket order IDs
     * @returns {Promise<Object>} Cancellation response
     */
    async cancelOrder(orderIds) {
        try {
            const headers = await shiprocketAuth.getAuthHeader();
            
            const response = await axios.post(
                `${this.baseURL}/orders/cancel`,
                { ids: orderIds },
                { headers }
            );

            return response.data;

        } catch (error) {
            console.error("❌ Failed to cancel order:", error.response?.data || error.message);
            throw new Error(`Failed to cancel order: ${error.message}`);
        }
    }
}

// Create singleton instance
const shiprocketOrderService = new ShiprocketOrderService();

export default shiprocketOrderService;