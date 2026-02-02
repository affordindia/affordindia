# Shiprocket Integration Testing Guide

## Complete Flow Overview

```
Customer Order → Shiprocket Order Created → Courier Pickup → Status Webhooks → Database Update → WhatsApp Notification → UI Update
```

---

## 1. Create Test Order & Shiprocket Shipment

### Step 1: Place Order on Website
1. Go to https://affordindia.com
2. Add product to cart
3. Place COD order
4. Note the **Order ID** (e.g., `ORD-T9JBEW-873A`)

### Step 2: Verify Shiprocket Order Created
**Check Admin Backend Logs:**
```
📦 Creating Shiprocket order for COD: ORD-T9JBEW-873A
✅ Shiprocket order created: 1155006933
```

**Or Login to Shiprocket Dashboard:**
- https://app.shiprocket.in/orders
- Find your order by Order ID
- Note the **Shiprocket Order ID** and **AWB Number**

---

## 2. Test Webhook Flow (Without Waiting for Real Courier)

### Option A: Use PowerShell Test Script

```powershell
cd e:\Affordindia\affordindia

# Test pickup notification
.\test-shiprocket-webhook.ps1 -Status "PICKED UP" -OrderId "ORD-T9JBEW-873A" -ShiprocketId "1155006933"

# Test in-transit notification
.\test-shiprocket-webhook.ps1 -Status "IN TRANSIT" -OrderId "ORD-T9JBEW-873A" -ShiprocketId "1155006933"

# Test delivery notification
.\test-shiprocket-webhook.ps1 -Status "DELIVERED" -OrderId "ORD-T9JBEW-873A" -ShiprocketId "1155006933"
```

### Option B: Manual Webhook via PowerShell

```powershell
$body = @'
{
  "awb": "TEST123456789",
  "courier_name": "Xpressbees Surface",
  "current_status": "PICKED UP",
  "order_id": "1155006933",
  "channel_order_id": "ORD-T9JBEW-873A",
  "etd": "2026-02-05",
  "scans": [{
    "location": "Delhi Hub",
    "date": "30 01 2026 15:30:00",
    "activity": "Shipment Picked Up"
  }]
}
'@

Invoke-WebRequest `
  -Uri "https://admin-backend-bgx3.onrender.com/api/logistics/webhook" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

---

## 3. Verify Backend Processing

### Check Admin Backend Logs (Render Dashboard)

**Expected Log Flow:**
```
📦 Webhook received from Shiprocket
✅ Order found: ORD-T9JBEW-873A
📝 Updating order status to: PICKED UP
✅ Order updated in database
📞 Calling client backend WhatsApp API
✅ Shipment WhatsApp sent: { orderId: 'ORD-T9JBEW-873A', status: 'picked up' }
✅ Webhook processed successfully
```

**Check for these specific logs:**
- `📦 Webhook received` - Webhook received
- `✅ Order found` - Order exists in database
- `📝 Updating order status` - Status update started
- `✅ Shipment WhatsApp sent` - WhatsApp notification sent
- `✅ Webhook processed successfully` - Complete success

---

## 4. Verify WhatsApp Notification

### Check Client Backend Logs (Render Dashboard)

**Expected Log:**
```
✅ WhatsApp API Response: {
  mobile: '919635236910',
  templateId: 'shipment_tracking_update',
  status: 200,
  requestId: 'xxxxx'
}
```

### Check Customer Phone
**Customer should receive WhatsApp message:**
```
Hello Deepansh! We have an update on your order ORD-T9JBEW-873A.
Current Status: picked up.
Shipment Details: ✅ Picked up by Xpressbees Surface
AWB: TEST123456789
Thank you for shopping with us!
```

With button: **"Track Order"** → Links to order detail page

---

## 5. Verify Database Updates

### Check MongoDB (via logs or Compass)

**Order document should have:**
```javascript
{
  orderId: "ORD-T9JBEW-873A",
  shiprocket: {
    orderId: 1155006933,
    awb: "TEST123456789",
    courierName: "Xpressbees Surface",
    currentStatus: "PICKED UP",
    statusHistory: [
      {
        status: "PICKED UP",
        timestamp: "2026-01-30T15:30:00Z",
        location: "Delhi Hub"
      }
    ]
  }
}
```

---

## 6. Verify UI Updates

### Check Customer Order Page

**URL:** https://affordindia.com/orders?id=ORD-T9JBEW-873A

**Should Display:**
- ✅ Order Status: "Picked Up" or "In Transit"
- ✅ Tracking Number (AWB): TEST123456789
- ✅ Courier: Xpressbees Surface
- ✅ Expected Delivery: 5 Feb 2026
- ✅ Status Timeline with updates
- ✅ "Track Shipment" button

### Check Admin Order Page

**Admin Dashboard:** https://admin-backend-bgx3.onrender.com (or your admin URL)

**Should Display:**
- ✅ Order with updated status
- ✅ Shiprocket details section
- ✅ Status history/timeline
- ✅ AWB tracking number
- ✅ Last updated timestamp

---

## 7. Test All Status Updates

### Complete Status Flow Test

```powershell
# 1. Order Picked Up
.\test-shiprocket-webhook.ps1 -Status "PICKED UP" -OrderId "ORD-TEST-123"
# Check: UI shows "Picked Up", WhatsApp received

# Wait 1 minute, then:

# 2. In Transit
.\test-shiprocket-webhook.ps1 -Status "IN TRANSIT" -OrderId "ORD-TEST-123"
# Check: UI shows "In Transit", WhatsApp received

# Wait 1 minute, then:

# 3. Out for Delivery
.\test-shiprocket-webhook.ps1 -Status "OUT FOR DELIVERY" -OrderId "ORD-TEST-123"
# Check: UI shows "Out for Delivery", WhatsApp received

# Wait 1 minute, then:

# 4. Delivered
.\test-shiprocket-webhook.ps1 -Status "DELIVERED" -OrderId "ORD-TEST-123"
# Check: UI shows "Delivered", WhatsApp received
```

---

## 8. Troubleshooting

### No WhatsApp Message Received?

**Check:**
1. ✅ Template `shipment_tracking_update` approved in MSG91?
2. ✅ `MSG91_SENDER_ID=15558698683` in Render env?
3. ✅ Customer phone number correct in order?
4. ✅ MSG91 delivery report shows success or error?

**Fix Meta Permission Error:**
- Contact MSG91 support about Meta Graph API error
- Or get Meta Business Manager admin access

### UI Not Updating?

**Check:**
1. ✅ Database updated? (Check logs for "Order updated")
2. ✅ Frontend fetching latest data? (Hard refresh: Ctrl+F5)
3. ✅ API returning updated order? (Check network tab)

### Webhook Not Received?

**Check:**
1. ✅ Webhook URL configured in Shiprocket: https://admin-backend-bgx3.onrender.com/api/logistics/webhook
2. ✅ Admin backend running? (Check Render status)
3. ✅ Order exists in database? (Check logs for "Order found")

---

## 9. Real Courier Testing

### Once Ready for Production:

1. **Place real order** on website
2. **Wait for courier pickup** (1-2 days typically)
3. **Shiprocket sends real webhook** automatically
4. **System processes** automatically
5. **Customer receives WhatsApp** automatically
6. **UI updates** automatically

### Monitor Real Webhooks:

**Admin Backend Logs** will show:
```
📦 Webhook received from Shiprocket
Current Status: PICKED UP
AWB: SR123456789 (real tracking number)
Courier: Delhivery
```

---

## Quick Test Checklist

- [ ] Order placed successfully
- [ ] Shiprocket order created (check logs)
- [ ] Test webhook sent via script
- [ ] Admin logs show webhook received
- [ ] Admin logs show database updated
- [ ] Client logs show WhatsApp sent
- [ ] Customer receives WhatsApp message
- [ ] UI shows updated status
- [ ] Timeline/history displayed correctly
- [ ] Track button works

---

## Need Help?

**Check These Files:**
- Admin webhook handler: `admin/backend/controllers/shiprocket.webhook.controller.js`
- Client WhatsApp service: `client/backend/services/whatsapp.service.js`
- WhatsApp routes: `client/backend/routes/whatsapp.routes.js`

**Environment Variables:**
- `WHATSAPP_TEMPLATE_SHIPMENT_TRACKING=shipment_tracking_update`
- `MSG91_SENDER_ID=15558698683`
- `MSG91_AUTH_KEY=471025AZ6kWkkc1Qfb68da972fP1`
