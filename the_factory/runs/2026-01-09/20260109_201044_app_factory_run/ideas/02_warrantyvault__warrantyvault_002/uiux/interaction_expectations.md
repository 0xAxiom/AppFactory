# WarrantyVault Interaction Expectations

## App Launch

### Cold Start
1. Splash screen displays (app icon centered)
2. Load persisted data from storage
3. Check notification permissions status
4. Navigate to Dashboard or Onboarding (first launch)
5. Maximum 3 seconds to interactive

### Warm Start
1. Resume from last screen
2. Refresh data if stale (>5 minutes)
3. Update countdown timers

### First Launch
1. Show onboarding flow (3 screens + permissions)
2. Skip option available
3. After onboarding → Dashboard with empty state

---

## Dashboard Interactions

### Pull to Refresh
- **Gesture**: Pull down from top of list
- **Feedback**: Loading indicator appears
- **Duration**: Instant (local data)
- **Result**: Countdown timers recalculated

### Section Expand/Collapse
- **Gesture**: Tap section header
- **Animation**: 300ms ease-in-out
- **State**: Persisted across sessions
- **Accessibility**: State change announced

### Item Card Tap
- **Gesture**: Tap anywhere on card
- **Feedback**: Ripple/highlight effect
- **Navigation**: Push to Item Detail screen
- **Transition**: Slide from right (iOS), Shared element (Android)

### FAB Tap
- **Gesture**: Tap floating action button
- **Feedback**: Haptic (light impact)
- **Navigation**: Navigate to Add Item screen
- **Animation**: Scale/morph to full screen

### Category Filter
- **Gesture**: Tap chip to select
- **Feedback**: Chip fills with color
- **Result**: List filters immediately
- **Reset**: Tap "All" chip

---

## Add Item Interactions

### Photo Capture
- **Gesture**: Tap camera button
- **Permission**: Request if not granted
- **Camera**: Open full-screen camera
- **Capture**: Tap shutter, confirm or retake
- **Feedback**: Shutter sound (if enabled), preview shows
- **Alternative**: Tap gallery to select existing

### Form Field Focus
- **Gesture**: Tap input field
- **Feedback**: Border changes to focus color
- **Keyboard**: Opens with appropriate type
- **Scroll**: Form scrolls to keep field visible

### Date Picker Open
- **Gesture**: Tap date field
- **Feedback**: Native picker opens
- **Constraints**: Max date is today
- **Selection**: Tap date, picker closes

### Duration Selection
- **Gesture**: Tap duration chip
- **Feedback**: Chip becomes selected
- **Custom**: Opens number input modal
- **Validation**: Must be positive number

### Category Selection
- **Gesture**: Tap category field
- **Feedback**: Picker/sheet opens
- **Options**: 5 categories with icons
- **Selection**: Tap option, picker closes

### Save Item
- **Gesture**: Tap Save button
- **Validation**: Check required fields
- **Error**: Show inline errors, scroll to first
- **Loading**: Button shows spinner
- **Success**: Toast, navigate back to dashboard
- **Haptic**: Success pattern

### Cancel/Back
- **Gesture**: Tap back arrow or system back
- **Confirmation**: If form has changes, confirm discard
- **Navigation**: Pop to previous screen

---

## Item Detail Interactions

### Receipt Image Tap
- **Gesture**: Tap receipt image
- **Feedback**: Opens full-screen viewer
- **Gestures**: Pinch zoom, double tap zoom, pan
- **Close**: Tap X or swipe down

### Edit Button Tap
- **Gesture**: Tap Edit in header
- **Navigation**: Push to edit mode (same form as add)
- **Pre-fill**: All fields populated

### Alert Configuration
- **Gesture**: Tap alert row
- **Feedback**: Opens picker/sheet
- **Options**: 7 days, 14 days, 30 days, 60 days, None
- **Result**: Alert rescheduled

### Delete Item
- **Gesture**: Tap Delete button
- **Confirmation**: Dialog appears
- **Confirm**: Item deleted, navigate to dashboard
- **Cancel**: Dialog closes
- **Feedback**: Success toast

---

## Settings Interactions

### Toggle Switch
- **Gesture**: Tap toggle
- **Feedback**: Haptic, state changes
- **Persistence**: Saved immediately
- **Accessibility**: New state announced

### Upgrade Button Tap
- **Gesture**: Tap Upgrade banner or button
- **Feedback**: Navigate to paywall modal
- **Transition**: Modal slides up

### Restore Purchases
- **Gesture**: Tap Restore
- **Feedback**: Loading indicator
- **Success**: Toast "Purchases restored"
- **Failure**: Error toast with retry

### External Links
- **Gesture**: Tap Privacy Policy / Terms
- **Behavior**: Open in-app browser or external
- **Feedback**: Loading indicator

---

## Paywall Interactions

### Plan Selection
- **Gesture**: Tap plan card
- **Feedback**: Card highlights as selected
- **State**: Single selection

### Subscribe Button
- **Gesture**: Tap Subscribe
- **Feedback**: Loading state
- **Flow**: Native purchase sheet appears
- **Success**: Toast, modal closes, premium unlocked
- **Failure**: Error message in modal

### Dismiss Paywall
- **Gesture**: Tap X or swipe down
- **Behavior**: Modal closes
- **No penalty**: User returns to previous screen

---

## Notification Interactions

### Receive Alert
- **Trigger**: Scheduled time (30 days before expiry)
- **Content**: "Samsung TV warranty expires in 30 days"
- **Platform**: Native push notification

### Tap Notification
- **Behavior**: Open app to item detail
- **Deep link**: warrantyvault://item/{id}
- **Fallback**: Dashboard if item not found

---

## Error States

### Network Error
- **Not applicable**: App is offline-first
- **Exception**: RevenueCat purchase requires network
- **Message**: "Unable to connect. Please check your connection."

### Permission Denied
- **Camera**: Show message with Settings link
- **Notifications**: Explain value, offer to enable in Settings

### Form Validation Error
- **Display**: Inline below field
- **Color**: Error red
- **Scroll**: Scroll to first error
- **Accessibility**: Error announced

### Item Limit Reached (Free)
- **Trigger**: Adding 11th item
- **Response**: Paywall modal appears
- **Message**: "Upgrade to Premium for unlimited items"

---

## Loading States

### Dashboard Loading
- **Initial**: Skeleton cards (3)
- **Refresh**: Pull indicator
- **Duration**: <1s (local)

### Image Loading
- **Placeholder**: Gray rectangle
- **Loading**: Fade in when ready
- **Error**: Broken image icon

### Button Loading
- **State**: Spinner replaces text
- **Disabled**: Prevent double-tap

---

## Empty States

### No Items
- **Icon**: Vault illustration
- **Title**: "Your vault is empty"
- **Description**: "Add your first item to start tracking warranties"
- **CTA**: "Add Item" button

### No Expiring
- **Title**: "All clear!"
- **Description**: "No warranties expiring soon"

### No Results (Filter)
- **Title**: "No items found"
- **Description**: "No items in this category"
- **CTA**: "Clear filter"

---

## Transitions

### Screen Transitions
- **Stack Push**: Slide from right (iOS), Slide up (Android)
- **Stack Pop**: Slide to right (iOS), Slide down (Android)
- **Modal Present**: Slide up
- **Modal Dismiss**: Slide down

### Element Transitions
- **List Items**: Fade in sequentially
- **Cards**: Scale on press
- **Buttons**: Opacity on press
- **Toggles**: 150ms duration

### Reduce Motion
- **Respect**: System reduce motion setting
- **Fallback**: Instant transitions, no animations

---

*All interactions must support accessibility alternatives*
