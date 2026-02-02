# 📱 Shiprocket Tracking UI Preview

## How It Looks on Customer Frontend

### URL
```
https://affordindia.com/orders?id=ORD-T9JBEW-873A
```

---

## 🎨 UI Components Display

### 1. **Shipment Tracking Card** (Blue Box)
**Appears when:** `order.shiprocket.awbCode` exists

```
┌─────────────────────────────────────────────────┐
│ 🚚 Shipment Tracking                            │
├─────────────────────────────────────────────────┤
│                                                  │
│  AWB Number              Courier                │
│  TEST123456789          Xpressbees Surface      │
│                                                  │
│  Status                  Expected Delivery      │
│  PICKED UP              5 Feb 2026              │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │  🚚  Track Live Location                 │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  ────────────────────────────────────────────   │
│  Tracking History                                │
│                                                  │
│  • Shipment Picked Up                           │
│    Delhi Hub                                     │
│    30/01/2026, 15:30                            │
│                                                  │
│  • In Transit to Destination Hub                │
│    Mumbai Hub                                    │
│    31/01/2026, 10:00                            │
│                                                  │
│  • Out for Delivery                             │
│    Local Hub                                     │
│    02/02/2026, 09:00                            │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Colors:**
- Background: Light Blue (#EBF8FF)
- Border: Blue (#3B82F6)
- Text: Dark Blue (#1E3A8A)
- Button: Blue (#2563EB) → Dark Blue (#1D4ED8) on hover

---

### 2. **Before Shiprocket Tracking Available** (Purple Box)
**Appears when:** Order status = "shipped" BUT no `shiprocket.awbCode` yet

```
┌─────────────────────────────────────────────────┐
│ 🚚 Tracking Information                          │
├─────────────────────────────────────────────────┤
│                                                  │
│  • Your order has been shipped                   │
│  • Expected delivery: 3-5 business days          │
│  • Keep cash ready for COD payment               │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Colors:**
- Background: Light Purple (#F3E8FF)
- Border: Purple (#A855F7)
- Text: Dark Purple (#581C87)

---

### 3. **Delivered Status** (Green Box)
**Appears when:** Order status = "delivered"

```
┌─────────────────────────────────────────────────┐
│ ✓ Order Delivered                                │
├─────────────────────────────────────────────────┤
│                                                  │
│  Your order has been successfully delivered.     │
│  Thank you for shopping with us!                 │
│                                                  │
│  ──────────────────────────────────────────      │
│  Delivered on: 5 Feb 2026                        │
│                                                  │
└─────────────────────────────────────────────────┘
```

**Colors:**
- Background: Light Green (#ECFDF5)
- Border: Green (#10B981)
- Text: Dark Green (#065F46)

---

## 📊 Complete Order Detail Page Layout

```
┌────────────────────────────────────────────────────────────────┐
│  ← Back to Orders                                              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ Order Details                                             │ │
│  │ Order ID: ORD-T9JBEW-873A                                │ │
│  │ Status: Shipped                                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  LEFT SIDE                          │  RIGHT SIDE              │
│  ─────────────────────────────────  │  ───────────────────     │
│                                      │                          │
│  📦 Order Items                     │  💰 Order Summary        │
│  • Product 1 (x1)                   │  Subtotal: ₹500          │
│  • Product 2 (x2)                   │  Shipping: ₹50           │
│                                      │  Total: ₹550             │
│  📍 Shipping Address                │                          │
│  Name: Deepansh                     │  💳 Payment Info         │
│  Phone: 919635236910                │  Method: COD             │
│  Address: Delhi                     │  Status: Pending         │
│                                      │                          │
│  🚚 Shipment Tracking (BLUE BOX)   │                          │
│  AWB: TEST123456789                 │                          │
│  Courier: Xpressbees Surface        │                          │
│  Status: PICKED UP                  │                          │
│  Expected: 5 Feb 2026               │                          │
│                                      │                          │
│  [🚚 Track Live Location]           │                          │
│                                      │                          │
│  Tracking History:                  │                          │
│  • Shipment Picked Up               │                          │
│    Delhi Hub                         │                          │
│    30/01/2026, 15:30                │                          │
│                                      │                          │
└─────────────────────────────────────┴──────────────────────────┘
```

---

## 🎬 Status Flow & UI Changes

### Phase 1: Order Placed
```
No Shiprocket info shown
Just order details and items
```

### Phase 2: Shiprocket Order Created
```
Purple box appears:
"Your order has been shipped"
```

### Phase 3: Courier Picks Up (PICKED UP webhook)
```
Blue tracking box appears with:
✓ AWB Number
✓ Courier name
✓ Status: PICKED UP
✓ Tracking button
✓ History: "Shipment Picked Up - Delhi Hub"
```

### Phase 4: In Transit (IN TRANSIT webhook)
```
Blue tracking box updates:
✓ Status: IN TRANSIT
✓ History adds: "In Transit to Destination Hub - Mumbai Hub"
```

### Phase 5: Out for Delivery (OUT FOR DELIVERY webhook)
```
Blue tracking box updates:
✓ Status: OUT FOR DELIVERY
✓ History adds: "Out for Delivery - Local Hub"
```

### Phase 6: Delivered (DELIVERED webhook)
```
Blue box replaced with Green delivered box
✓ "Order Delivered" message
✓ Shows delivery date
```

---

## 🔄 Real-Time Updates

### How Data Refreshes:

**Customer visits order page:**
```jsx
useEffect(() => {
    const fetchOrder = async () => {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
    };
    fetchOrder();
}, [orderId]);
```

**What gets fetched:**
```javascript
{
  orderId: "ORD-T9JBEW-873A",
  status: "shipped",
  shiprocket: {
    orderId: 1155006933,
    awbCode: "TEST123456789",
    courierName: "Xpressbees Surface",
    status: "PICKED UP",
    etd: "2026-02-05",
    scans: [
      {
        activity: "Shipment Picked Up",
        location: "Delhi Hub",
        date: "2026-01-30T15:30:00Z"
      },
      {
        activity: "In Transit to Destination Hub",
        location: "Mumbai Hub",
        date: "2026-01-31T10:00:00Z"
      }
    ]
  }
}
```

---

## 📱 Mobile View

```
┌─────────────────────────┐
│ ← Back to Orders        │
│                          │
│ ┌─────────────────────┐ │
│ │ Order #873A         │ │
│ │ Status: Shipped     │ │
│ └─────────────────────┘ │
│                          │
│ 📦 Order Items          │
│ • Product 1             │
│                          │
│ 🚚 Shipment Tracking   │
│ ┌─────────────────────┐ │
│ │ AWB: TEST123456789  │ │
│ │ Courier: Xpressbees │ │
│ │ Status: PICKED UP   │ │
│ │ ETA: 5 Feb 2026     │ │
│ │                      │ │
│ │ [Track Location]    │ │
│ │                      │ │
│ │ History:             │ │
│ │ • Picked Up          │ │
│ │   Delhi Hub          │ │
│ │   30/01, 15:30      │ │
│ └─────────────────────┘ │
│                          │
│ 💰 Order Summary        │
│ Total: ₹550             │
│                          │
└─────────────────────────┘
```

---

## 🧪 To Test the UI:

### Method 1: With Test Webhook

```powershell
# Send webhook
.\test-shiprocket-webhook.ps1 -Status "PICKED UP" -OrderId "ORD-T9JBEW-873A"

# Visit URL in browser
https://affordindia.com/orders?id=ORD-T9JBEW-873A

# Hard refresh
Ctrl + F5 (or Cmd + Shift + R on Mac)
```

### Method 2: Check Database First

**MongoDB Compass → Find Order:**
```javascript
db.orders.findOne({ orderId: "ORD-T9JBEW-873A" })
```

**Check if `shiprocket` field exists with:**
- ✅ `awbCode`
- ✅ `courierName`
- ✅ `status`
- ✅ `scans` array

**Then visit the order page** - UI will automatically display the tracking info!

---

## 🎨 Design Features

### Interactive Elements:

1. **Track Live Location Button**
   - Opens Shiprocket tracking page in new tab
   - URL: `https://shiprocket.co/tracking/{AWB}`
   - Shows real-time map & detailed tracking

2. **Tracking Timeline**
   - Shows up to 5 most recent scan events
   - Scrollable if more than 5 events
   - Auto-updates when page refreshes

3. **Status Colors**
   - Blue: In transit/shipped
   - Green: Delivered
   - Purple: Pending tracking info
   - Yellow: Warnings/delays
   - Red: Issues/cancelled

### Responsive Design:
- Desktop: Side-by-side layout
- Tablet: Stacked with full width
- Mobile: Single column, optimized spacing

---

## 🔍 What Customer Sees at Each Stage

| Stage | Status Badge | Tracking Card | Track Button | History |
|-------|-------------|---------------|--------------|---------|
| Order Placed | "Pending" | ❌ | ❌ | ❌ |
| Processing | "Processing" | ❌ | ❌ | ❌ |
| Shiprocket Created | "Shipped" | 🟣 Purple Info | ❌ | ❌ |
| Picked Up | "Shipped" | 🔵 Blue Tracking | ✅ | ✅ 1 event |
| In Transit | "Shipped" | 🔵 Blue Tracking | ✅ | ✅ 2+ events |
| Out for Delivery | "Out for Delivery" | 🔵 Blue Tracking | ✅ | ✅ 3+ events |
| Delivered | "Delivered" | 🟢 Green Success | ❌ | ✅ Delivery date |

---

## 💡 Pro Tips

1. **Test with different statuses** to see UI transitions
2. **Check mobile responsiveness** - layout adapts beautifully
3. **Use browser DevTools** to inspect element styling
4. **Test "Track Live Location"** button - opens Shiprocket page
5. **Refresh page after webhook** to see updates (no auto-refresh yet)

---

## 🚀 Next Steps

Want to see this live? 

1. Place a test order
2. Send test webhook
3. Visit order detail page
4. Take screenshot and compare with this guide!

The UI will match exactly what's described here! 🎉
