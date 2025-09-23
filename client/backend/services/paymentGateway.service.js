import axios from "axios";
import crypto from "crypto";
import hdfcConfig from "../config/hdfc.config.js";
import Order from "../models/order.model.js";

/**
 * Create payment session with HDFC SmartGateway
 * @param {Object} order - Order object
 * @returns {Object} - HDFC session response
 */
export async function createPaymentSession(order) {
    try {
        // Validate required order data
        if (!order || !order.user) {
            throw new Error("Order with user information is required");
        }

        // Populate user data to get email and phone if not already populated
        let populatedOrder = order;
        if (!order.user.email) {
            populatedOrder = await Order.findById(order._id).populate(
                "user",
                "name email phone"
            );
        }

        // Extract user name for first_name and last_name
        const userName =
            order.receiverName || order.userName || populatedOrder.user?.name;
        const nameParts = userName ? userName.trim().split(" ") : [];
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        // Use actual user data, receiver data, or empty string for required fields
        const customerEmail = populatedOrder.user?.email || "";
        const customerPhone =
            order.receiverPhone || populatedOrder.user?.phone || "";

        // Validation for absolutely required fields
        if (!firstName) {
            throw new Error("Customer name is required for payment");
        }
        if (!customerPhone) {
            throw new Error("Customer phone is required for payment");
        }

        const payload = {
            order_id: order.orderId, // Use custom orderId instead of MongoDB _id
            amount: order.total.toString(),
            customer_id: order.user.toString(),
            customer_email: customerEmail,
            customer_phone: customerPhone,
            payment_page_client_id: hdfcConfig.clientId,
            action: hdfcConfig.action,
            return_url: hdfcConfig.returnUrl,
            description: "Complete your payment",
            first_name: firstName,
            last_name: lastName,
        };

        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${hdfcConfig.apiKey}`,
            "x-merchantid": hdfcConfig.merchantId,
            // "x-clientid": hdfcConfig.clientId,
            "x-customerid": order.user.toString(), // Required: Unique Customer ID
        };

        console.log("🔄 Creating HDFC payment session for order:", order._id);
        console.log("📋 HDFC API Payload:", JSON.stringify(payload, null, 2));
        console.log("👤 Customer ID in headers:", order.user.toString());

        // Pre-validate critical data before sending to HDFC
        console.log("🔐 Pre-validating payment session data:");
        console.log("💰 Amount being sent to HDFC:", payload.amount);
        console.log("🆔 Order ID being sent to HDFC:", payload.order_id);
        console.log("👤 Customer ID being sent to HDFC:", payload.customer_id);

        const response = await axios.post(hdfcConfig.sessionApiUrl, payload, {
            headers,
        });

        console.log("✅ HDFC payment session created successfully");

        // Enrich the HDFC response with our original payload data for verification
        const enrichedResponse = {
            ...response.data,
            // Add original payload data for verification purposes
            _originalPayload: {
                order_id: payload.order_id,
                amount: parseFloat(payload.amount),
                customer_id: payload.customer_id,
                customer_email: payload.customer_email,
                customer_phone: payload.customer_phone,
            },
        };

        return enrichedResponse;
    } catch (error) {
        console.error(
            "❌ HDFC payment session creation failed:",
            error.response?.data || error.message
        );
        throw new Error(
            `Payment session creation failed: ${
                error.response?.data?.message || error.message
            }`
        );
    }
}

/**
 * Get payment status from HDFC SmartGateway
 * @param {string} customOrderId - Custom order ID (not MongoDB _id)
 * @param {string} customerId - Customer ID for x-customerid header
 * @returns {Object} - HDFC status response
 */
export async function getPaymentStatus(customOrderId, customerId) {
    try {
        // Validate required parameters
        if (!customOrderId) {
            throw new Error("Custom order ID is required");
        }
        if (!customerId) {
            throw new Error("Customer ID is required for HDFC API calls");
        }

        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${hdfcConfig.apiKey}`,
            "x-merchantid": hdfcConfig.merchantId,
            // "x-clientid": hdfcConfig.clientId,
            "x-customerid": customerId, // Required: Unique Customer ID
        };

        console.log(
            "🔄 Checking HDFC payment status for order:",
            customOrderId
        );
        console.log("👤 Customer ID:", customerId);
        const response = await axios.get(
            `${hdfcConfig.statusApiBaseURL}/${customOrderId}`,
            { headers }
        );

        console.log("✅ HDFC payment status retrieved successfully");
        return response.data;
    } catch (error) {
        console.error(
            "❌ HDFC payment status check failed:",
            error.response?.data || error.message
        );
        throw new Error(
            `Payment status check failed: ${
                error.response?.data?.message || error.message
            }`
        );
    }
}

/**
 * Verify HDFC webhook/return URL signature using HMAC-SHA256
 * @param {Object} params - All parameters from return URL or webhook
 * @param {string} secret - HDFC Response Key for HMAC calculation
 * @returns {boolean} - Verification result
 */
export function verifyWebhookSignature(params, secret) {
    try {
        console.log("🔐 Starting HDFC signature verification...");
        console.log("📋 Parameters received:", JSON.stringify(params, null, 2));

        // Check if secret is provided
        if (!secret) {
            console.log("❌ No secret key provided for signature verification");
            return false;
        }

        // Check if signature exists
        if (!params.signature) {
            console.log("❌ No signature found in parameters");
            return false;
        }

        // Check if signature_algorithm exists and is correct
        if (
            !params.signature_algorithm ||
            params.signature_algorithm !== "HMAC-SHA256"
        ) {
            console.log(
                "❌ Invalid or missing signature algorithm:",
                params.signature_algorithm
            );
            return false;
        }

        // Step 1: Get all parameters except signature and signature_algorithm
        const filteredParams = {};
        for (const key in params) {
            if (key !== "signature" && key !== "signature_algorithm") {
                // Convert all values to strings for consistent processing
                filteredParams[key] = String(params[key]);
            }
        }

        console.log(
            "📋 Filtered parameters for signature:",
            JSON.stringify(filteredParams, null, 2)
        );

        // Step 2: Sort parameters alphabetically by key (ASCII based sort)
        const sortedParams = sortObjectByKeys(filteredParams);
        console.log(
            "📋 Sorted parameters:",
            JSON.stringify(sortedParams, null, 2)
        );

        // Step 3: Build the parameter string
        let paramsString = "";
        for (const key in sortedParams) {
            // Percentage encode key and value
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(sortedParams[key]);

            // Append to string
            paramsString += encodedKey + "=" + encodedValue + "&";
        }

        // Remove the last '&' character
        if (paramsString.endsWith("&")) {
            paramsString = paramsString.substring(0, paramsString.length - 1);
        }
        console.log("📋 Parameter string before encoding:", paramsString);

        // Step 4: Percentage encode the entire string
        const encodedParamsString = encodeURIComponent(paramsString);
        console.log("� Final encoded parameter string:", encodedParamsString);

        // Step 5: Calculate HMAC-SHA256
        const computedHmac = crypto
            .createHmac("sha256", secret)
            .update(encodedParamsString)
            .digest("base64");

        // Step 6: Decode the received signature for comparison
        const receivedHmac = decodeURIComponent(params.signature);

        console.log("🔐 Computed HMAC:", computedHmac);
        console.log("🔐 Received HMAC:", receivedHmac);

        // Step 7: Compare signatures
        const isValid = computedHmac === receivedHmac;
        console.log("✅ Signature verification result:", isValid);

        return isValid;
    } catch (error) {
        console.error("❌ Signature verification failed:", error);
        return false;
    }
}

/**
 * Helper function to sort object by keys alphabetically
 * @param {Object} obj - Object to sort
 * @returns {Object} - Sorted object
 */
function sortObjectByKeys(obj) {
    return Object.keys(obj)
        .sort()
        .reduce((result, key) => {
            result[key] = obj[key];
            return result;
        }, {});
}

/**
 * Parse payment status from HDFC response
 * @param {Object} hdfcResponse - HDFC status response
 * @returns {string} - Normalized payment status
 */
export function parsePaymentStatus(hdfcResponse) {
    const status = hdfcResponse.status?.toUpperCase();

    switch (status) {
        case "NEW":
        case "PENDING":
            return "pending";
        case "SUCCESS":
        case "CHARGED":
        case "COMPLETED":
            return "paid";
        case "FAILED":
        case "CANCELLED":
        case "EXPIRED":
            return "failed";
        default:
            return "pending";
    }
}

/**
 * Verify payment data matches the original session data
 * This is a critical security check as per HDFC requirements
 * @param {Object} order - Order with original session data
 * @param {Object} paymentStatusResponse - Current payment status from HDFC
 * @returns {Object} - Verification result with details
 */
export function verifyPaymentData(order, paymentStatusResponse) {
    try {
        console.log("🔐 Starting payment data verification...");

        const sessionData = order.paymentSessionData;
        if (!sessionData) {
            return {
                isValid: false,
                errors: ["Original session data not found in order"],
                details: "Cannot verify payment without original session data",
            };
        }

        console.log("📋 Session data structure:", {
            hasOrderId: !!sessionData.order_id,
            hasAmount: !!sessionData.amount,
            hasCustomerId: !!sessionData.customer_id,
            sessionKeys: Object.keys(sessionData),
        });

        console.log("📋 Status response structure:", {
            hasOrderId: !!paymentStatusResponse.order_id,
            hasAmount: !!paymentStatusResponse.amount,
            hasCustomerId: !!paymentStatusResponse.customer_id,
            statusKeys: Object.keys(paymentStatusResponse),
        });

        const errors = [];
        const warnings = [];

        // 1. Verify Order ID matches
        const sessionOrderId =
            sessionData.order_id || sessionData._originalPayload?.order_id;
        const statusOrderId = paymentStatusResponse.order_id;

        if (sessionOrderId !== statusOrderId) {
            errors.push(
                `Order ID mismatch: session=${sessionOrderId}, status=${statusOrderId}`
            );
        }

        // 2. Verify Amount matches
        const sessionAmount = parseFloat(
            sessionData.amount || sessionData._originalPayload?.amount
        );
        const statusAmount = parseFloat(paymentStatusResponse.amount);

        if (Math.abs(sessionAmount - statusAmount) > 0.01) {
            // Allow 1 paisa difference for rounding
            errors.push(
                `Amount mismatch: session=${sessionAmount}, status=${statusAmount}`
            );
        }

        // 3. Verify Customer ID matches
        const sessionCustomerId =
            sessionData.customer_id ||
            sessionData._originalPayload?.customer_id;
        const statusCustomerId = paymentStatusResponse.customer_id;

        if (sessionCustomerId !== statusCustomerId) {
            errors.push(
                `Customer ID mismatch: session=${sessionCustomerId}, status=${statusCustomerId}`
            );
        }

        // 4. Verify Session ID matches (if present in status response)
        if (paymentStatusResponse.session_id && sessionData.id) {
            if (paymentStatusResponse.session_id !== sessionData.id) {
                warnings.push(
                    `Session ID mismatch: session=${sessionData.id}, status=${paymentStatusResponse.session_id}`
                );
            }
        }

        // 5. Additional verification for paid payments
        if (parsePaymentStatus(paymentStatusResponse) === "paid") {
            // Verify transaction details if available
            if (
                paymentStatusResponse.transactions &&
                paymentStatusResponse.transactions.length > 0
            ) {
                const transaction = paymentStatusResponse.transactions[0];
                console.log("💳 Transaction details:", {
                    id: transaction.id,
                    amount: transaction.amount,
                    status: transaction.status,
                });
            }
        }

        const isValid = errors.length === 0;

        console.log("🔐 Payment data verification result:", {
            isValid,
            errors,
            warnings,
            sessionAmount: sessionAmount || "undefined",
            statusAmount: statusAmount || "undefined",
            sessionOrderId: sessionOrderId || "undefined",
            statusOrderId: statusOrderId || "undefined",
            sessionCustomerId: sessionCustomerId || "undefined",
            statusCustomerId: statusCustomerId || "undefined",
        });

        return {
            isValid,
            errors,
            warnings,
            details: isValid
                ? "All payment data verified successfully"
                : "Payment data verification failed",
        };
    } catch (error) {
        console.error("❌ Payment data verification failed:", error);
        return {
            isValid: false,
            errors: [`Verification process failed: ${error.message}`],
            details: "Verification process encountered an error",
        };
    }
}