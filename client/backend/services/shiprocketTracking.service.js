import axios from "axios";
import shiprocketAuthService from "./shiprocketAuth.service.js";

class ShiprocketTrackingService {
    constructor() {
        this.baseURL = "https://apiv2.shiprocket.in/v1/external";
    }

    /**
     * Track shipment using AWB code
     * @param {string} awbCode - AWB tracking number
     * @returns {Promise<Object>} Tracking details
     */
    async trackByAWB(awbCode) {
        try {
            console.log(`🔍 Tracking shipment by AWB: ${awbCode}`);

            const authHeader = await shiprocketAuthService.getAuthHeader();
            
            const response = await axios.get(
                `${this.baseURL}/courier/track/awb/${awbCode}`,
                {
                    headers: authHeader
                }
            );

            console.log("✅ AWB tracking successful:", response.data);
            return response.data;

        } catch (error) {
            console.error("❌ Track by AWB error:", error.response?.data || error.message);
            throw new Error(`Failed to track by AWB: ${error.response?.data?.message || error.message}`);
        }
    }

    /**
     * Track shipment using shipment ID
     * @param {number} shipmentId - Shiprocket shipment ID
     * @returns {Promise<Object>} Tracking details
     */
    async trackByShipmentId(shipmentId) {
        try {
            console.log(`🔍 Tracking shipment by ID: ${shipmentId}`);

            const authHeader = await shiprocketAuthService.getAuthHeader();
            
            const response = await axios.get(
                `${this.baseURL}/courier/track/shipment/${shipmentId}`,
                {
                    headers: authHeader
                }
            );

            console.log("✅ Shipment tracking successful:", response.data);
            return response.data;

        } catch (error) {
            console.error("❌ Track by shipment ID error:", error.response?.data || error.message);
            throw new Error(`Failed to track by shipment ID: ${error.response?.data?.message || error.message}`);
        }
    }

    /**
     * Get multiple shipments tracking
     * @param {Array<number>} shipmentIds - Array of shipment IDs
     * @returns {Promise<Object>} Multiple tracking details
     */
    async trackMultipleShipments(shipmentIds) {
        try {
            console.log(`🔍 Tracking multiple shipments:`, shipmentIds);

            const authHeader = await shiprocketAuthService.getAuthHeader();
            
            const response = await axios.get(
                `${this.baseURL}/courier/track`,
                {
                    headers: authHeader,
                    params: {
                        shipment_id: shipmentIds.join(',')
                    }
                }
            );

            console.log("✅ Multiple shipments tracking successful:", response.data);
            return response.data;

        } catch (error) {
            console.error("❌ Track multiple shipments error:", error.response?.data || error.message);
            throw new Error(`Failed to track multiple shipments: ${error.response?.data?.message || error.message}`);
        }
    }

    /**
     * Get order tracking using order ID
     * @param {number} orderId - Shiprocket order ID
     * @returns {Promise<Object>} Order tracking details
     */
    async trackByOrderId(orderId) {
        try {
            console.log(`🔍 Tracking order by ID: ${orderId}`);

            const authHeader = await shiprocketAuthService.getAuthHeader();
            
            const response = await axios.get(
                `${this.baseURL}/orders/show/${orderId}`,
                {
                    headers: authHeader
                }
            );

            console.log("✅ Order tracking successful:", response.data);
            return response.data;

        } catch (error) {
            console.error("❌ Track by order ID error:", error.response?.data || error.message);
            throw new Error(`Failed to track by order ID: ${error.response?.data?.message || error.message}`);
        }
    }

    /**
     * Get shipment tracking history and current status
     * @param {string} awbCode - AWB tracking number
     * @returns {Promise<Object>} Detailed tracking history
     */
    async getTrackingHistory(awbCode) {
        try {
            console.log(`📋 Getting tracking history for AWB: ${awbCode}`);

            const authHeader = await shiprocketAuthService.getAuthHeader();
            
            const response = await axios.get(
                `${this.baseURL}/courier/track/awb/${awbCode}`,
                {
                    headers: authHeader
                }
            );

            // Format the tracking data for better readability
            const trackingData = response.data;
            
            if (trackingData.tracking_data) {
                const formattedHistory = {
                    awbCode: awbCode,
                    currentStatus: trackingData.tracking_data.track_status,
                    currentLocation: trackingData.tracking_data.current_location,
                    expectedDelivery: trackingData.tracking_data.expected_delivery_date,
                    courierName: trackingData.tracking_data.courier_name,
                    history: trackingData.tracking_data.shipment_track || []
                };

                console.log("✅ Formatted tracking history:", formattedHistory);
                return formattedHistory;
            }

            return trackingData;

        } catch (error) {
            console.error("❌ Get tracking history error:", error.response?.data || error.message);
            throw new Error(`Failed to get tracking history: ${error.response?.data?.message || error.message}`);
        }
    }

    /**
     * Format tracking status for display
     * @param {Object} trackingData - Raw tracking data from Shiprocket
     * @returns {Object} Formatted tracking information
     */
    formatTrackingForDisplay(trackingData) {
        try {
            if (!trackingData.tracking_data) {
                return {
                    status: "No tracking data available",
                    message: "Tracking information not yet available"
                };
            }

            const track = trackingData.tracking_data;
            
            return {
                awbCode: track.awb_code,
                status: track.track_status,
                currentLocation: track.current_location,
                expectedDelivery: track.expected_delivery_date,
                courierPartner: track.courier_name,
                deliveryStatus: track.delivery_status,
                shipmentStatus: track.shipment_status,
                trackingHistory: track.shipment_track?.map(event => ({
                    date: event.date,
                    status: event.status,
                    location: event.location,
                    activity: event.activity
                })) || []
            };

        } catch (error) {
            console.error("❌ Format tracking error:", error);
            return {
                status: "Error formatting tracking data",
                message: error.message
            };
        }
    }
}

export default new ShiprocketTrackingService();