# WarrantyVault UI/UX Design Contract

## Design Role Definition

You are designing a **home utility app** focused on warranty tracking and documentation organization. The visual language should convey:

- **Trust**: Users are storing important financial documents
- **Organization**: Clear structure and hierarchy
- **Protection**: Safeguarding against loss
- **Efficiency**: Quick access when needed

---

## Design Philosophy

### Core Principles

1. **Clarity First**: Information hierarchy should immediately communicate warranty status
2. **Document-Centric**: Receipt images are primary evidence - treat them with respect
3. **Time-Aware**: Countdown to expiration is the key differentiator - make it prominent
4. **Minimal Friction**: Adding items should be fast - don't ask for unnecessary info

### Visual Language

- **Clean and professional** - not playful or trendy
- **High-contrast status indicators** - expiring items need visual urgency
- **Photography-forward** - receipt images are real, not illustrations
- **Systematic spacing** - organized like a well-maintained filing system

---

## Screen Specifications

### Dashboard (Home Tab)

**Purpose**: Show warranty status at a glance

**Layout**:
```
┌─────────────────────────────────────┐
│ WarrantyVault              [🔍]    │  ← Header (future search)
├─────────────────────────────────────┤
│ ⚠️ EXPIRING SOON (2)                │  ← Section header (orange)
│ ┌─────────────────────────────────┐ │
│ │ [📷] Samsung TV                 │ │
│ │      Electronics • 15 days      │ │  ← Item card
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ [📷] Dyson Vacuum               │ │
│ │      Appliances • 28 days       │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ✅ ACTIVE (8)                       │  ← Section header (green)
│ ┌─────────────────────────────────┐ │
│ │ [📷] MacBook Pro                │ │
│ │      Electronics • 142 days     │ │
│ └─────────────────────────────────┘ │
│ ... more items                      │
├─────────────────────────────────────┤
│ ⏰ EXPIRED (3)                      │  ← Section header (gray)
│ └─────────────────────────────────┘ │
│                              [+]    │  ← FAB (Add Item)
└─────────────────────────────────────┘
```

**Behavior**:
- Pull to refresh
- Tap card → Item Detail
- Tap FAB → Add Item
- Badge on tab shows expiring count

### Add Item Screen

**Purpose**: Capture receipt and warranty info

**Layout**:
```
┌─────────────────────────────────────┐
│ ← Add Item                          │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │      [📷 Take Photo]            │ │  ← Camera preview/placeholder
│ │         or                      │ │
│ │      Choose from Gallery        │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Product Name *                      │
│ ┌─────────────────────────────────┐ │
│ │ e.g., Samsung 55" TV            │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Purchase Date *                     │
│ ┌─────────────────────────────────┐ │
│ │ January 9, 2026               📅│ │
│ └─────────────────────────────────┘ │
│                                     │
│ Warranty Duration *                 │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌─────┐ │
│ │ 1 yr │ │ 2 yr │ │ 3 yr │ │Other│ │  ← Quick select
│ └──────┘ └──────┘ └──────┘ └─────┘ │
│                                     │
│ Category *                          │
│ ┌─────────────────────────────────┐ │
│ │ Electronics                   ▼ │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ▼ More Options                      │  ← Expandable
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │         Save Item               │ │  ← Primary button (sticky)
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Item Detail Screen

**Purpose**: View complete warranty info and documents

**Layout**:
```
┌─────────────────────────────────────┐
│ ← Samsung 55" TV            [Edit] │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │      [Receipt Image]            │ │  ← Tap to zoom
│ │                                 │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │   WARRANTY EXPIRES IN           │ │
│ │       142 DAYS                  │ │  ← Large countdown
│ │   March 31, 2026                │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ Product Details                     │
│ ┌─────────────────────────────────┐ │
│ │ Category    Electronics         │ │
│ │ Purchased   Jan 9, 2026         │ │
│ │ Warranty    1 year              │ │
│ │ Price       $899.00             │ │
│ │ Retailer    Best Buy            │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🔔 Alert: 30 days before      >│ │  ← Configurable
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │        🗑️ Delete Item           │ │  ← Destructive
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

---

## Component Specifications

### Item Card
- Height: 72dp minimum
- Receipt thumbnail: 56x56dp, rounded corners
- Primary text: Product name, 16sp, semibold
- Secondary text: Category + days remaining, 14sp, regular
- Days remaining color: Green (>30), Orange (≤30), Gray (expired)

### Status Section Header
- Height: 48dp
- Icon + text + count badge
- Background: subtle tint matching status color
- Tap to expand/collapse section

### Countdown Display
- Large number (32sp) for days
- Label text (14sp) "days remaining"
- Expiration date (14sp) below
- Status color border/background

### Primary Button
- Height: 48dp minimum
- Full width minus padding
- Primary color background
- White text, 16sp, semibold
- Corner radius: 8dp

---

## Interaction Expectations

### Adding an Item
1. User taps FAB or navigates to Add tab
2. Camera preview appears (or permission prompt if first time)
3. User captures receipt photo
4. Form fields appear below photo
5. User enters product name (required)
6. User selects purchase date (date picker)
7. User selects warranty duration (quick chips or custom)
8. User selects category (dropdown)
9. Optional fields available in expandable section
10. User taps Save
11. Haptic feedback + success toast
12. Navigate back to dashboard with new item visible

### Receiving an Alert
1. Push notification appears: "Samsung TV warranty expires in 30 days"
2. User taps notification
3. App opens to item detail screen
4. User reviews warranty info and receipt
5. User decides action (extend, claim, dismiss)

### Filing a Claim
1. Product breaks, user needs warranty info
2. User opens app → Dashboard
3. User finds item (search if many items)
4. Taps item card → Detail screen
5. Views receipt photo (zooms if needed)
6. Has proof of purchase for claim

---

## Accessibility Requirements

### Screen Reader
- All images have alt text describing content
- Form fields have visible labels
- Status changes announced (e.g., "Item saved successfully")
- Section headers are semantic headings

### Motor
- All touch targets ≥44pt
- No gestures without tap alternatives
- Actions don't timeout

### Visual
- Contrast ratio ≥4.5:1 for all text
- Status indicated by icon + color + text (not color alone)
- Supports Dynamic Type up to 200%

### Cognitive
- Simple, clear language
- Consistent navigation
- Confirmation before delete
- No unexpected changes

---

*This design contract is BINDING for Stage 10 implementation*
