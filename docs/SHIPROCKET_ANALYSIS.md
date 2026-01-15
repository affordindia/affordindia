# Shiprocket Integration - Complete Analysis & Issues

**Analysis Date**: January 13, 2026  
**Status**: ✅ Critical Issues Fixed | ⚠️ Configuration Review Needed

---

## 🔍 System Overview

The Shiprocket integration is split across **Admin Backend** and **Client Backend**:

### Architecture
```
Client Backend (Port 5001)
  └── Places order → Calls Admin API
         ↓
Admin Backend (Port 5000)
  └── Creates Shiprocket order
  └── Handles webhooks
  └── Stores tracking data
```

---

## ✅ Issues Fixed

### 1. **CRITICAL: Missing `shiprocket` Field in Order Models**
**Status**: ✅ FIXED

**Issue**: Both Order models (`admin` and `client`) were missing the `shiprocket` field definition.

**Impact**:
- Shiprocket data couldn't be properly stored in MongoDB
- Webhook updates failed silently
- Tracking information was lost
- AWB codes and courier details weren't persisted

**Fix Applied**:
- Added complete `shiprocket` schema to both models with:
  - `orderId` - Shiprocket order ID
  - `shipmentId` - Shiprocket shipment ID
  - `awbCode` - AWB tracking number
  - `courierName` & `courierId` - Courier details
  - `status` & `shipmentStatus` - Status tracking
  - `etd` - Estimated delivery date
  - `scans[]` - Tracking scan history
  - `webhookEvents[]` - All webhook events
  - Timestamps and metadata

- Added indexes for efficient querying:
  - `shiprocket.awbCode`
  - `shiprocket.orderId`

**Files Modified**:
- [admin/backend/models/order.model.js](e:\Affordindia\affordindia\admin\backend\models\order.model.js)
- [client/backend/models/order.model.js](e:\Affordindia\affordindia\client\backend\models\order.model.js)

---

## ⚠️ Configuration Issues

### 2. **Pickup Location Mismatch**

**Admin `.env`**: `SHIPROCKET_PICKUP_LOCATION=munish`  
**Client `.env`**: `SHIPROCKET_PICKUP_LOCATION=VANDANA`

**Recommendation**: 
- Verify which pickup location is registered in your Shiprocket account
- Update both to use the same value
- The pickup location must match exactly what's configured in Shiprocket dashboard

---

## 📋 System Components

### Admin Backend Files
1. **[config/shiprocket.config.js](e:\Affordindia\affordindia\admin\backend\config\shiprocket.config.js)**
   - Base configuration
   - Default dimensions: 10x10x5 cm, 0.5 kg
   - Token expiry: 9 days (refreshes 1 day before expiry)

2. **[services/shiprocket.service.js](e:\Affordindia\affordindia\admin\backend\services\shiprocket.service.js)**
   - ✅ Authentication with token caching
   - ✅ Order creation with proper format
   - ✅ Shipment tracking by AWB
   - ✅ Dimension calculation helpers
   - ✅ Address formatting

3. **[controllers/shiprocket.webhook.controller.js](e:\Affordindia\affordindia\admin\backend\controllers\shiprocket.webhook.controller.js)**
   - ✅ Webhook handler (now properly stores data with fixed schema)
   - ✅ Status mapping (Shiprocket → Internal)
   - ✅ Manual sync endpoint
   - ✅ Public API for client backend to create orders

4. **[routes/shiprocket.routes.js](e:\Affordindia\affordindia\admin\backend\routes\shiprocket.routes.js)**
   - `GET /api/logistics/webhook` - Verification endpoint
   - `POST /api/logistics/webhook` - Webhook receiver (⚠️ **NOTE**: URL cannot contain "shiprocket", "kartrocket", "sr", or "kr" - Shiprocket restriction)
   - `POST /api/logistics/orders/create` - Order creation (called by client backend)
   - `POST /api/logistics/orders/:orderId/sync` - Manual sync (admin only)

### Client Backend Integration
Located in [services/order.service.js](e:\Affordindia\affordindia\client\backend\services\order.service.js):

**COD Orders** (Line ~300):
```javascript
// After order creation, calls admin API
fetch(`${ADMIN_BACKEND_URL}/api/shiprocket/orders/create`, {
    method: 'POST',
    body: JSON.stringify({ orderId })
})
```

**Online Orders** (Razorpay webhook):
Located in [controllers/razorpay.controller.js](e:\Affordindia\affordindia\client\backend\controllers\razorpay.controller.js):
- Shiprocket order created after payment success
- Stock deducted only after payment
- Cart cleared after payment success

---

## 🔄 Workflow

### COD Order Flow
```
1. User places COD order
2. Stock deducted immediately
3. Order saved to DB
4. Cart cleared
5. Client backend → Admin API → Shiprocket
6. AWB assigned
7. Webhooks update tracking
```

### Online Payment Flow
```
1. User places order
2. Razorpay order created (no stock deduction)
3. Payment timeout: 15 minutes
4. On payment success webhook:
   → Stock deducted
   → Order status updated
   → Client backend → Admin API → Shiprocket
   → Cart cleared
5. Webhooks update tracking
```

---

## 📊 Status Mapping

| Shiprocket Status | Internal Status | Description |
|-------------------|-----------------|-------------|
| `DELIVERED` | `delivered` | Package delivered |
| `READY_TO_SHIP` | `processing` | Ready for pickup |
| `SHIPPED` | `shipped` | In transit |
| `PICKED UP` | `shipped` | Picked up by courier |
| `PICKUP_SCHEDULED` | `processing` | Pickup scheduled |
| `CANCELLED` | `cancelled` | Order cancelled |
| `LOST` | `cancelled` | Package lost |
| `RETURN_IN_TRANSIT` | `return_initiated` | Return in progress |
| `RETURNED` | `returned` | Returned to seller |

---

## 🔐 Security

### Webhook Security
- Currently **NO AUTHENTICATION** on webhook endpoint (line 16 in routes)
- Returns 200 even on errors to prevent Shiprocket from marking endpoint as failed
- Stores all webhook events for audit trail

**Recommendation**: 
- Implement webhook signature verification using `SHIPROCKET_WEBHOOK_SECRET`
- Add rate limiting on webhook endpoint

---

## 🎯 Current Functionality Status

### ✅ Working Features
- [x] Authentication with token caching
- [x] Order creation for COD
- [x] Order creation for online payments (after Razorpay success)
- [x] Webhook receiving and processing
- [x] Status updates from webhooks
- [x] Order tracking by AWB
- [x] Manual status sync
- [x] Proper error handling and logging
- [x] Data persistence (now fixed with schema update)

### ⚠️ Needs Review
- [ ] Pickup location configuration mismatch
- [ ] Webhook signature verification
- [ ] Product weight/dimensions (using defaults)
- [ ] HSN code population (optional in items)

### 📝 Enhancement Opportunities
- [ ] Add retry logic for failed Shiprocket API calls
- [ ] Implement webhook signature validation
- [ ] Add more detailed logging for debugging
- [ ] Create admin UI for manual order sync
- [ ] Add alerts for failed Shiprocket orders
- [ ] Implement automatic order cancellation in Shiprocket when user cancels

---

## 🔧 Configuration Checklist

### Environment Variables Required

**Admin Backend** (`.env`):
```bash
SHIPROCKET_EMAIL=api@affordindia.com
SHIPROCKET_PASSWORD="your-password"
SHIPROCKET_PICKUP_LOCATION=VANDANA  # ⚠️ Verify this
SHIPROCKET_BASE_URL=https://apiv2.shiprocket.in
SHIPROCKET_ENABLED=true
SHIPROCKET_WEBHOOK_SECRET=  # ⚠️ Not implemented yet
SERVER_URL=https://admin-backend-bgx3.onrender.com
```

**Client Backend** (`.env`):
```bash
ADMIN_BACKEND_URL=http://localhost:5000  # Or production URL
```

### Shiprocket Dashboard Setup
1. ✅ Account created
2. ✅ API credentials generated
3. ⚠️ Verify pickup location: "VANDANA" or "munish"
4. 📋 Configure webhook URL: `https://admin-backend-bgx3.onrender.com/api/logistics/webhook`
   - **IMPORTANT**: Cannot use URLs containing "shiprocket", "kartrocket", "sr", or "kr"
5. 📋 Test webhook with Shiprocket's test tool

---

## 🧪 Testing Recommendations

### 1. Test Order Creation
```bash
# After placing a COD order, check logs for:
"📦 Creating Shiprocket order for COD: ORD-xxxxx"
"✅ Shiprocket order created: [shiprocket_order_id]"
```

### 2. Test Webhook
```bash
# Send test webhook from Shiprocket dashboard
# Check admin backend logs for:
"📦 Received Shiprocket webhook"
"✅ Order updated: ORD-xxxxx Status: [status]"
```

### 3. Verify Data Persistence
```javascript
// Query order to verify shiprocket data is saved
db.orders.findOne({ orderId: "ORD-xxxxx" })
// Should have shiprocket.orderId, shiprocket.awbCode, etc.
```

---

## 📞 Support & Troubleshooting

### Common Issues

**1. "Shiprocket authentication failed"**
- Check email/password in `.env`
- Verify Shiprocket account is active
- Check API rate limits

**2. "Order not found" in webhook**
- Verify order was created in Shiprocket
- Check AWB code matches
- Review webhook data format

**3. "Admin API returned 500"**
- Check admin backend is running
- Verify `ADMIN_BACKEND_URL` in client `.env`
- Check MongoDB connection

**4. Shiprocket data not saving**
- ✅ FIXED: Schema updated with shiprocket field
- Restart both servers to load new schema
- Verify MongoDB connection

---

## 🚀 Deployment Notes

### Production Checklist
- [ ] Update `ADMIN_BACKEND_URL` to production URL
- [ ] Update `SERVER_URL` for webhook callbacks
- [ ] Configure webhook in Shiprocket dashboard with production URL
- [ ] Verify pickup location setting
- [ ] Test end-to-end flow with real order
- [ ] Monitor webhook logs for first few days
- [ ] Set up alerts for failed Shiprocket orders

---

## 📝 Next Steps

1. **Immediate**: Resolve pickup location mismatch
2. **Short-term**: Implement webhook signature verification
3. **Medium-term**: Add product weight/dimension fields to Product model
4. **Long-term**: Build admin dashboard for Shiprocket order management

---

**Last Updated**: January 13, 2026  
**Reviewed By**: AI Assistant  
**Status**: Schema Fixed | Configuration Review Needed
