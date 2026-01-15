# WarrantyVault Component Inventory

## Navigation Components

### TabBar
- **Purpose**: Primary app navigation
- **Tabs**: Dashboard (home), Add Item (plus), Settings (gear)
- **Behavior**: Always visible, badge on Dashboard showing expiring count
- **Accessibility**: Tab names announced, selected state clear

### Header
- **Purpose**: Screen title and actions
- **Variants**: Standard (title only), With action (edit button), With back (detail screens)
- **Behavior**: Sticky at top, handles safe area
- **Accessibility**: Back button labeled, title is heading level 1

---

## Content Components

### ItemCard
- **Purpose**: Display item summary in dashboard lists
- **Layout**: Horizontal with thumbnail, text, and days remaining
- **Props**: item (object), onPress (function)
- **States**: Default, Pressed, Disabled
- **Variants**: Expiring (orange accent), Active (green accent), Expired (gray)
- **Accessibility**: Full item description as accessible label

### SectionHeader
- **Purpose**: Group items by warranty status
- **Layout**: Icon + title + count badge, expandable
- **Props**: title, count, icon, isExpanded, onToggle
- **States**: Expanded, Collapsed
- **Variants**: Expiring (orange), Active (green), Expired (gray)
- **Accessibility**: Heading level 2, expand/collapse state announced

### CountdownDisplay
- **Purpose**: Show days until warranty expires
- **Layout**: Large number + "days" label + expiration date
- **Props**: daysRemaining, expirationDate
- **States**: Active, Expiring, Expired
- **Accessibility**: Full announcement "X days remaining, expires on Date"

### ReceiptImage
- **Purpose**: Display receipt photo with zoom capability
- **Props**: imageUri, altText, onPress
- **Behavior**: Tap to open full-screen viewer with pinch-zoom
- **Accessibility**: Descriptive alt text, zoom announced

### EmptyState
- **Purpose**: Display when no items in section/dashboard
- **Layout**: Icon, title, description, optional CTA
- **Props**: icon, title, description, ctaLabel, onCtaPress
- **Accessibility**: All text readable, CTA labeled

---

## Form Components

### TextInput
- **Purpose**: Text entry fields
- **Props**: label, placeholder, value, onChange, error, required
- **States**: Default, Focused, Error, Disabled
- **Accessibility**: Label associated, error announced

### DatePicker
- **Purpose**: Select purchase date
- **Props**: value, onChange, maxDate (today)
- **Behavior**: Opens native date picker
- **Accessibility**: Date format announced

### DurationSelector
- **Purpose**: Select warranty duration
- **Layout**: Chip group with preset options + custom
- **Options**: 3mo, 6mo, 1yr, 2yr, 3yr, Custom
- **Behavior**: Single select, custom opens number input
- **Accessibility**: Selected option announced

### CategoryPicker
- **Purpose**: Select item category
- **Layout**: Dropdown/bottom sheet with icons
- **Options**: Electronics, Appliances, Furniture, Vehicles, Other
- **Accessibility**: Category names with icons described

### PhotoCapture
- **Purpose**: Capture or select receipt photo
- **Layout**: Preview area with camera/gallery buttons
- **Behavior**: Opens camera or image picker
- **Permissions**: Request camera, photo library access
- **Accessibility**: Clear labels for capture actions

---

## Action Components

### PrimaryButton
- **Purpose**: Main action buttons (Save, Subscribe)
- **Props**: label, onPress, loading, disabled
- **States**: Default, Pressed, Loading, Disabled
- **Style**: Full width, primary color, 48dp height
- **Accessibility**: Label announced, loading state announced

### SecondaryButton
- **Purpose**: Secondary actions (Cancel, Skip)
- **Props**: label, onPress, disabled
- **States**: Default, Pressed, Disabled
- **Style**: Outline style, 48dp height
- **Accessibility**: Label announced

### FloatingActionButton
- **Purpose**: Quick access to add item
- **Props**: icon, onPress
- **Position**: Bottom right, above tab bar
- **Behavior**: Haptic on press
- **Accessibility**: "Add item" label

### IconButton
- **Purpose**: Header actions, inline actions
- **Props**: icon, onPress, label
- **States**: Default, Pressed, Disabled
- **Accessibility**: Label required for screen readers

### DestructiveButton
- **Purpose**: Delete actions
- **Props**: label, onPress
- **Style**: Red text or background
- **Behavior**: Requires confirmation dialog
- **Accessibility**: Warns of destructive action

---

## Feedback Components

### Toast
- **Purpose**: Transient success/error messages
- **Props**: message, type (success/error/info)
- **Duration**: 3 seconds
- **Position**: Top of screen, below header
- **Accessibility**: Announced to screen reader

### LoadingIndicator
- **Purpose**: Show loading state
- **Variants**: Full screen overlay, Inline, Button
- **Accessibility**: "Loading" announced

### ConfirmationDialog
- **Purpose**: Confirm destructive actions
- **Props**: title, message, confirmLabel, cancelLabel, onConfirm, onCancel
- **Behavior**: Modal overlay
- **Accessibility**: Focus trapped, escape to cancel

---

## Premium Components

### UpgradeBanner
- **Purpose**: Promote premium subscription
- **Layout**: Card with benefits preview and CTA
- **Position**: Top of settings, after item limit reached
- **Accessibility**: Benefits and CTA clearly labeled

### PaywallModal
- **Purpose**: Present subscription options
- **Layout**: Benefits list, plan cards, legal, actions
- **Behavior**: Full screen modal, dismissible
- **Components**: BenefitRow, PlanCard, LegalText
- **Accessibility**: All prices announced, dismiss button prominent

### PlanCard
- **Purpose**: Display subscription plan option
- **Props**: planId, price, interval, isSelected, onSelect
- **States**: Default, Selected
- **Accessibility**: Plan details and price announced

---

## List Components

### SectionList
- **Purpose**: Dashboard grouped item list
- **Behavior**: Virtualized, pull to refresh
- **Sections**: Expiring, Active, Expired
- **Accessibility**: Section headers are headings

### FilterChips
- **Purpose**: Filter dashboard by category
- **Layout**: Horizontal scroll chips
- **Behavior**: Single select, "All" default
- **Accessibility**: Filter state announced

---

## Utility Components

### SafeAreaView
- **Purpose**: Handle notch and home indicator
- **Behavior**: Automatic safe area insets

### KeyboardAvoidingView
- **Purpose**: Adjust layout when keyboard visible
- **Behavior**: Scroll or padding based on platform

### ImageViewer
- **Purpose**: Full-screen image with zoom
- **Behavior**: Pinch zoom, double tap zoom, pan
- **Accessibility**: Zoom level announced

---

*All components must meet accessibility requirements from design tokens*
