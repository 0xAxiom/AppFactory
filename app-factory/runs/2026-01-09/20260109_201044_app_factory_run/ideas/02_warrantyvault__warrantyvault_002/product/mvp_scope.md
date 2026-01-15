# WarrantyVault MVP Scope Definition

## Success Criteria

> User can add an item, see it on dashboard, receive expiration alert, and access receipt photo when needed for a warranty claim.

---

## Must-Have Features (MVP)

### 1. Add Item Flow
**Priority**: Critical
**Complexity**: Medium

**Requirements**:
- Camera capture for receipt photo
- Gallery selection alternative
- Product name input (required)
- Purchase date picker
- Warranty duration selector (preset options + custom)
- Category selection (5 predefined)
- Optional fields: price, retailer, manufacturer, product photo
- Local storage persistence

**Acceptance Criteria**:
- [ ] User can capture receipt with camera
- [ ] User can select image from gallery
- [ ] All required fields validate before save
- [ ] Item persists after app restart
- [ ] Receipt image stored locally and accessible

---

### 2. Warranty Dashboard
**Priority**: Critical
**Complexity**: Medium

**Requirements**:
- Three sections: Expiring Soon, Active, Expired
- Item cards showing name, category icon, days remaining
- Receipt thumbnail on card
- Section counts/badges
- Pull-to-refresh
- Empty states for each section

**Acceptance Criteria**:
- [ ] Items correctly categorized by warranty status
- [ ] Days remaining updates daily
- [ ] Tap on item opens detail view
- [ ] Empty state when no items in section
- [ ] Smooth scrolling with 20+ items

---

### 3. Item Detail View
**Priority**: Critical
**Complexity**: Low

**Requirements**:
- Full item information display
- Warranty countdown timer (days remaining)
- Receipt photo viewer with zoom
- Edit button → edit mode
- Delete button with confirmation
- Category icon and name

**Acceptance Criteria**:
- [ ] All item fields displayed
- [ ] Receipt photo zoomable
- [ ] Edit mode allows field changes
- [ ] Delete removes item and images
- [ ] Changes persist after save

---

### 4. Push Notification Alerts
**Priority**: Critical
**Complexity**: Low

**Requirements**:
- Default alert 30 days before expiration
- Permission request on first item add
- Notification shows item name and days remaining
- Tap notification opens item detail
- Respect system notification settings

**Acceptance Criteria**:
- [ ] Notification permission requested appropriately
- [ ] Alert fires at correct time
- [ ] Notification content is accurate
- [ ] Deep link to correct item works
- [ ] Works when app is backgrounded/killed

---

### 5. Local Data Persistence
**Priority**: Critical
**Complexity**: Low

**Requirements**:
- SQLite or AsyncStorage for structured data
- Local file storage for images
- Data survives app updates
- No account required

**Acceptance Criteria**:
- [ ] Data persists after app restart
- [ ] Data persists after app update
- [ ] Images accessible offline
- [ ] No data loss scenarios

---

### 6. Category Organization
**Priority**: High
**Complexity**: Low

**Requirements**:
- 5 predefined categories with icons
- Category filter on dashboard
- Category selection during item creation
- Category badge on item cards

**Acceptance Criteria**:
- [ ] Filter shows only selected category
- [ ] Category icons render correctly
- [ ] Category counts accurate
- [ ] "All" option clears filter

---

## Nice-to-Have Features (Post-MVP)

| Feature | Complexity | Notes |
|---------|------------|-------|
| Cloud backup & sync | High | Premium feature, requires auth |
| Insurance export PDF | Medium | Premium feature |
| Multiple documents per item | Medium | Premium feature |
| Custom categories/tags | Low | Premium feature |
| Barcode scanning | Medium | Requires ML Kit or similar |
| OCR for receipt dates | High | Requires on-device ML |
| Search functionality | Low | Could add to MVP if time |
| Home screen widget | Medium | Platform-specific |
| Family sharing | High | Requires cloud infrastructure |
| Apple Watch companion | Medium | Limited use case |

---

## Scope Boundaries

### In Scope (MVP)
- Single-user, single-device
- Local-only data storage
- Manual data entry
- Photo capture and storage
- Push notifications
- 5 predefined categories
- Basic CRUD operations

### Out of Scope (MVP)
- User accounts and authentication
- Cloud sync and backup
- Multi-device access
- Sharing features
- OCR/barcode scanning
- PDF export
- Advanced search/filtering
- Widgets
- Watch app

---

## Technical Constraints

### Platform
- iOS 14+ and Android 10+
- React Native with Expo
- TypeScript

### Storage
- AsyncStorage for small data
- Expo FileSystem for images
- No server-side storage in MVP

### Notifications
- Expo Notifications
- Local scheduling (not push server)

### Premium (RevenueCat)
- Subscription setup in MVP
- Paywall UI ready
- Entitlement checks in place
- Actual premium features gated but may be stubbed

---

## Build Validation Checklist

Before declaring MVP complete:

- [ ] Can add item with receipt photo
- [ ] Dashboard shows correct status groups
- [ ] Expiration alerts fire correctly
- [ ] Data persists across sessions
- [ ] Categories filter correctly
- [ ] Edit and delete work
- [ ] Works offline
- [ ] RevenueCat integration functional
- [ ] Paywall displays correctly
- [ ] Runs on iOS and Android

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Image storage limits | Medium | Medium | Compress images, warn user |
| Notification reliability | Low | High | Test across OS versions |
| Large item counts slow UI | Medium | Low | Implement list virtualization |
| Date calculation bugs | Low | Medium | Unit test date logic |

---

*MVP scope validated - achievable in single build cycle*
