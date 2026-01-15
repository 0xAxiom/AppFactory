# EVP Analyzer - Component Inventory

## Buttons

### RecordButton
Large circular button for starting/stopping recordings.
- **Variants**: idle (teal outline), recording (red with pulse)
- **Size**: 80x80pt
- **Usage**: Home screen hero, Recording screen

### PrimaryButton
Full-width primary action button.
- **Variants**: default (teal), destructive (red)
- **Sizes**: md (44pt), lg (56pt)
- **Usage**: CTAs, paywall, onboarding

### SecondaryButton
Outlined or ghost secondary action.
- **Variants**: default, ghost
- **Sizes**: sm (32pt), md (44pt)
- **Usage**: Secondary actions, dismiss

### IconButton
Icon-only circular button.
- **Variants**: default, ghost, recording
- **Sizes**: sm (32pt), md (44pt), lg (56pt)
- **Usage**: Toolbar actions, playback controls

---

## Data Display

### Waveform
Audio waveform visualization component.
- **Variants**: live (animated), static (interactive), mini (thumbnail)
- **Props**: data[], color, height, onScrub
- **Usage**: Recording screen, Session analyzer

### Spectrogram
Frequency heatmap visualization.
- **Variants**: full (scrollable), mini (preview)
- **Props**: data, colorScale, duration
- **Usage**: Session analyzer (premium)

### Timeline
Horizontal timeline with playback position.
- **Props**: duration, position, markers[], onSeek
- **Usage**: Session analyzer

### AnomalyMarker
Event marker on timeline.
- **Variants**: spike (yellow), floor_change (orange), silence (gray)
- **Props**: timestamp, type, onTap
- **Usage**: Timeline overlay

### SessionCard
Investigation session list item.
- **Variants**: default, compact
- **Props**: session, onTap, onDelete
- **Usage**: Investigation log list

### TagChip
Category tag display.
- **Variants**: voice (blue), noise (gray), knock (brown), unknown (purple), other (teal)
- **Props**: label, category, onTap
- **Usage**: Tag list, session detail

---

## Inputs

### TextInput
Text entry field with dark styling.
- **Variants**: default (single line), multiline
- **Props**: value, placeholder, onChange
- **Usage**: Location entry, notes

### Slider
Horizontal slider for numeric values.
- **Props**: value, min, max, step, onChange
- **Usage**: Sensitivity setting

### SegmentedControl
Horizontal segment picker.
- **Props**: options[], selected, onChange
- **Usage**: Recording quality, view toggle

---

## Navigation

### TabBar
Bottom tab navigation with 3 tabs.
- **Tabs**: Investigate (mic), Log (list), Settings (cog)
- **Style**: Dark background, teal active indicator

### Header
Screen header with title and actions.
- **Variants**: default, recording (with time), session (with actions)
- **Props**: title, leftAction, rightActions[]

---

## Feedback

### Toast
Brief notification message.
- **Variants**: success (teal), error (red), info (gray)
- **Props**: message, duration
- **Animation**: Slide from top, auto-dismiss

### RecordingIndicator
Pulsing recording status.
- **Style**: Red dot with pulse animation
- **Usage**: Recording screen, status bar

### LoadingSkeleton
Placeholder while loading.
- **Variants**: waveform, card, text
- **Animation**: Shimmer effect

---

## Modals

### PaywallModal
Subscription offer presentation.
- **Presentation**: formSheet
- **Sections**: Header, features list, pricing, CTA, footer links

### TagModal
Tag editor for adding annotations.
- **Presentation**: modal
- **Sections**: Category picker, label input, notes, save button

### ExportModal
Export options for clips/sessions.
- **Presentation**: modal
- **Sections**: Format picker, include metadata toggle, export button
