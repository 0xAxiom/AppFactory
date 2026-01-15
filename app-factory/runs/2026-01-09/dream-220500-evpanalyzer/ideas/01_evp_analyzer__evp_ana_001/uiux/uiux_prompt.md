# EVP Analyzer - UI/UX Design System Prompt

## Design Philosophy

EVP Analyzer uses **Field Equipment Minimalism**—a design language that treats the app as professional investigation equipment rather than entertainment software.

### Core Principles

1. **Night-Friendly by Default**
   - Dark theme is the primary experience
   - All colors optimized for low-light environments
   - No bright whites or harsh contrasts

2. **Data Visualization First**
   - Waveforms and spectrograms are the hero elements
   - Visual analysis tools dominate screen real estate
   - Controls are secondary to visualizations

3. **Minimal Decoration, Maximum Function**
   - No decorative graphics or illustrations
   - Every element serves a purpose
   - Clean lines, precise alignment

4. **Technical Credibility**
   - Professional, scientific aesthetic
   - Monospace fonts for data display
   - Accurate visualizations

5. **Calm Focus**
   - No sensational or spooky elements
   - Subdued color palette
   - Smooth, deliberate animations

---

## Color Application

### Backgrounds
- Use `background.primary` (#0D0D0F) for main screens
- Use `background.secondary` (#161619) for cards/surfaces
- Use `background.elevated` (#252529) for modals

### Text
- Use `text.primary` (#FFFFFF) for main content
- Use `text.secondary` (#A0A0A8) for supporting text
- Use `text.tertiary` (#6B6B73) for disabled/placeholder

### Accent
- Use `accent.primary` (#00D9A5) for primary actions, waveforms
- Use `accent.muted` (#00D9A520) for subtle highlights

### Status
- Use `status.recording` (#FF4444) ONLY for recording state
- Use `status.anomaly` (#FFB800) for detected anomalies
- Never use recording red for anything except active recording

---

## Typography Rules

1. **System fonts only** - No custom web fonts
2. **Hierarchy is critical** - Clear visual distinction between levels
3. **Monospace for data** - Timestamps, frequencies, durations
4. **Generous line height** - Readability in dark mode

---

## Component Guidelines

### Buttons
- Minimum touch target: 44x44pt
- Primary buttons: Filled teal with white text
- Secondary buttons: Outlined or ghost
- Haptic feedback on all taps

### Cards
- Subtle border radius (8-12pt)
- No drop shadows (too bright in dark mode)
- Slight background elevation distinction

### Waveforms
- Teal color (#00D9A5) on dark background
- Smooth curves, not jagged lines
- Responsive to touch for scrubbing

### Spectrograms
- Cool-to-warm color gradient
- Clear frequency scale labels
- Synchronized with timeline

---

## Animation Guidelines

- **Recording pulse**: 1s infinite, subtle opacity change
- **Screen transitions**: 300ms ease-out
- **Waveform render**: 30fps minimum
- **Respect reduce motion**: Disable non-essential animations

---

## Accessibility Requirements

- All colors meet 4.5:1 contrast ratio
- VoiceOver labels on all interactive elements
- Support for Dynamic Type
- 44x44pt minimum touch targets
- Haptic feedback for key actions
