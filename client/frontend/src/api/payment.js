import axios from "./axios";

// Verify payment status for a specific order (PRIMARY PAYMENT VERIFICATION API)
export const verifyPaymentStatus = async (orderId) => {
    console.log("API CALL: verifyPaymentStatus", orderId);
    const res = await axios.get(`/payments/verify/${orderId}`);
    return res.data;
};
