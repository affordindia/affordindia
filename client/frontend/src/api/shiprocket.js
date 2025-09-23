import axios from "./axios";

// Track order by internal order ID  
export const trackOrder = async (orderId) => {
    console.log("API CALL: trackOrder", orderId);
    const res = await axios.get(`/shiprocket/track/order/${orderId}`);
    return res.data;
};

// Track by AWB code
export const trackByAWB = async (awbCode) => {
    console.log("API CALL: trackByAWB", awbCode);
    const res = await axios.get(`/shiprocket/track/awb/${awbCode}`);
    return res.data;
};

// Track by shipment ID
export const trackByShipmentId = async (shipmentId) => {
    console.log("API CALL: trackByShipmentId", shipmentId);
    const res = await axios.get(`/shiprocket/track/shipment/${shipmentId}`);
    return res.data;
};

// Get tracking history for AWB
export const getTrackingHistory = async (awbCode) => {
    console.log("API CALL: getTrackingHistory", awbCode);
    const res = await axios.get(`/shiprocket/track/history/${awbCode}`);
    return res.data;
};

// Create Shiprocket order
export const createShiprocketOrder = async (orderId) => {
    console.log("API CALL: createShiprocketOrder", orderId);
    const res = await axios.post(`/shiprocket/orders/${orderId}/create`);
    return res.data;
};

// Generate AWB for order
export const generateAWB = async (orderId, courierId) => {
    console.log("API CALL: generateAWB", orderId, courierId);
    const res = await axios.post(`/shiprocket/orders/${orderId}/awb`, {
        courier_id: courierId
    });
    return res.data;
};

// Get available couriers
export const getCouriers = async () => {
    console.log("API CALL: getCouriers");
    const res = await axios.get("/shiprocket/couriers");
    return res.data;
};

// Test tracking with shipment ID
export const testTracking = async (shipmentId, awbCode) => {
    console.log("API CALL: testTracking", { shipmentId, awbCode });
    const payload = {};
    if (shipmentId) payload.shipmentId = shipmentId;
    if (awbCode) payload.awbCode = awbCode;
    
    const res = await axios.post("/shiprocket/track/test", payload);
    return res.data;
};