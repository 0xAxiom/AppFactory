# WarrantyVault Core User Loop

## Primary User Flow

```
┌─────────────────────────────────────────────────────────────┐
│                         CREATE                               │
│  User adds new item with receipt photo and warranty details │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                          VIEW                                │
│  Dashboard shows items by status: Expiring, Active, Expired │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                        INTERACT                              │
│  View details, edit info, receive alerts, access documents  │
└─────────────────────────────────┬───────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────┐
│                         RESOLVE                              │
│  File warranty claim with documentation OR archive expired  │
└─────────────────────────────────────────────────────────────┘
```

---

## Step 1: CREATE

**Trigger**: User purchases new item with warranty

**Actions**:
1. Tap "Add Item" button
2. Take photo of receipt (or select from gallery)
3. Enter product name
4. Select purchase date
5. Choose warranty duration (3mo, 6mo, 1yr, 2yr, 3yr, custom)
6. Select category (Electronics, Appliances, Furniture, Vehicles, Other)
7. Optional: Add price, retailer, manufacturer, product photo
8. Save item

**Objects Created**:
- Item record with warranty details
- Receipt attachment (image)
- Default Alert (30 days before expiration)

**Immediate Feedback**:
- Item appears in dashboard under "Active" section
- Countdown shows days until expiration
- Confirmation toast: "Item saved"

---

## Step 2: VIEW

**Trigger**: User opens app to check warranties

**Display**:
```
┌────────────────────────────────────┐
│ WarrantyVault                    🔍│
├────────────────────────────────────┤
│ ⚠️ EXPIRING SOON (2)               │
│ ┌──────────────────────────────┐   │
│ │ 📺 Samsung TV      15 days   │   │
│ │ 🔌 Dyson Vacuum    28 days   │   │
│ └──────────────────────────────┘   │
├────────────────────────────────────┤
│ ✅ ACTIVE (8)                      │
│ ┌──────────────────────────────┐   │
│ │ 💻 MacBook Pro     142 days  │   │
│ │ 🪑 Standing Desk   267 days  │   │
│ │ ... more items               │   │
│ └──────────────────────────────┘   │
├────────────────────────────────────┤
│ ⏰ EXPIRED (3)                     │
│ └──────────────────────────────┘   │
└────────────────────────────────────┘
```

**Value Delivered**:
- Instant visibility of warranty status
- Priority view of expiring items
- Count badges for quick assessment

---

## Step 3: INTERACT

**Trigger**: User taps on item OR receives expiration alert

**Actions Available**:
- View full item details and countdown
- View/zoom receipt photo
- Edit item information
- Adjust alert timing
- Delete item
- (Premium) Export for insurance

**Notification Flow**:
1. Push notification: "Samsung TV warranty expires in 30 days"
2. User taps notification → opens item detail
3. User reviews receipt and warranty info
4. User decides: extend warranty, use before expiration, or ignore

---

## Step 4: RESOLVE

**Scenario A: Warranty Claim Needed**
1. Product breaks/malfunctions
2. User opens WarrantyVault
3. Finds item in list
4. Accesses receipt photo
5. Contacts retailer/manufacturer with proof
6. Files successful warranty claim

**Scenario B: Warranty Expiring**
1. User receives 30-day alert
2. Reviews item condition
3. Decides to:
   - Purchase extended warranty (uses receipt as proof)
   - Note for future replacement planning
   - Dismiss and let expire

**Scenario C: Warranty Expired**
1. Item moves to "Expired" section
2. User can:
   - Delete if no longer relevant
   - Keep for insurance inventory
   - Export as part of home inventory

---

## Value Metrics

| Moment | Value Delivered |
|--------|----------------|
| First item added | Peace of mind - warranty is tracked |
| Expiration alert | Proactive - avoid missing deadline |
| Claim needed | Documentation ready - saves time/money |
| Insurance claim | Inventory available - faster recovery |

---

## Loop Frequency

| Action | Frequency |
|--------|-----------|
| Add item | Per purchase (monthly for active consumers) |
| View dashboard | Weekly check-in |
| Receive alert | Per item expiration (varies) |
| File claim | Occasional (varies by item quality) |

---

*Core loop validated - ready for UI/UX design*
