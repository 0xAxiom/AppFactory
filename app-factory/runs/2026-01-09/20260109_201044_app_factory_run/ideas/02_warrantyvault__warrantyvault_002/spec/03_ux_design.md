# Stage 03: UX Design Specification - WarrantyVault

**Run ID**: 20260109_201044_app_factory_run
**Idea**: WarrantyVault
**Generated**: 2026-01-09

---

## Design Philosophy

**Brand Personality**: Trustworthy, organized, protective

WarrantyVault should feel like a digital filing cabinet that actively works for the user. The design conveys:
- **Trust**: Users are storing important financial documents
- **Organization**: Clear hierarchy and structure
- **Protection**: Safeguarding against warranty loss
- **Efficiency**: Quick access when needed

---

## Navigation Structure

### Primary Navigation: Bottom Tabs (3)

| Tab | Icon | Purpose |
|-----|------|---------|
| Dashboard | home | View all warranties by status |
| Add Item | plus-circle | Add new warranty |
| Settings | settings | Configuration and subscription |

### Secondary Navigation: Stack

- Dashboard → Item Detail (push)
- Settings → Paywall (modal)
- Add Item → Camera (modal)

---

## Screen Designs

### Dashboard
- **Purpose**: Show warranty status at a glance
- **Sections**: Expiring Soon (orange), Active (green), Expired (gray)
- **Item Cards**: Thumbnail, name, category, days remaining
- **FAB**: Quick add floating action button
- **Empty State**: Vault illustration with "Add Your First Item" CTA

### Add Item
- **Purpose**: Capture receipt and warranty details
- **Hero**: Camera preview / photo placeholder
- **Form**: Product name, purchase date, warranty duration, category
- **Actions**: Save (primary), back to cancel

### Item Detail
- **Purpose**: View complete warranty information
- **Hero**: Receipt image (tap to zoom)
- **Countdown**: Large days remaining display
- **Details**: Purchase info, warranty dates, retailer
- **Actions**: Edit, configure alerts, delete

### Settings
- **Purpose**: App configuration and subscription
- **Sections**: Upgrade, Notifications, About
- **Actions**: Restore purchases, privacy policy, terms

### Paywall
- **Purpose**: Present subscription offering
- **Benefits**: Feature comparison list
- **Plans**: Monthly and annual options
- **Legal**: Terms, cancellation, restore link

---

## Visual Design

### Color Palette

| Role | Color | Usage |
|------|-------|-------|
| Primary | #2563EB | Actions, links, focus |
| Secondary | #059669 | Success, active status |
| Warning | #F97316 | Expiring soon status |
| Error | #EF4444 | Errors, destructive |
| Gray | #6B7280 | Expired, secondary text |

### Typography

- **Font**: System (SF Pro iOS, Roboto Android)
- **Scale**: 12/14/16/20/24/32sp
- **Dynamic Type**: Supported up to 200%

### Spacing

- **Base Unit**: 4dp
- **Standard**: 8, 16, 24, 32dp
- **Touch Targets**: Minimum 44pt iOS / 48dp Android

---

## Key Interactions

### Adding an Item
1. Tap FAB or Add tab
2. Capture receipt photo (camera or gallery)
3. Enter product name (required)
4. Select purchase date
5. Choose warranty duration
6. Select category
7. Tap Save
8. Success toast, return to dashboard

### Viewing Warranty
1. Tap item card on dashboard
2. View receipt image (tap to zoom)
3. See countdown and details
4. Configure alert timing if needed

### Receiving Alert
1. Push notification at scheduled time
2. Tap notification
3. App opens to item detail
4. User reviews warranty status

---

## Accessibility

### Visual
- Contrast ratio ≥ 4.5:1
- Color not sole status indicator
- Dark mode support

### Motor
- Touch targets ≥ 44pt
- No gestures without alternatives
- No time limits

### Screen Reader
- All images have alt text
- Form fields labeled
- Status changes announced

### Cognitive
- Simple, clear language
- Consistent navigation
- Confirmation for destructive actions

---

## Premium Experience

### Free Tier
- 10 items maximum
- Local storage only
- Basic alerts

### Premium Tier ($3.99/month)
- Unlimited items
- Cloud backup and sync
- Insurance export PDF
- Multiple documents per item
- Custom categories

### Upgrade Prompts
- Settings screen banner
- Item limit reached flow
- Export feature attempt

---

*UX specification ready for Stage 04 Monetization*
