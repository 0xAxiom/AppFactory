# RoastPush UI/UX Design Specification

## Design Vision

RoastPush is a **high-energy competitive entertainment app** that makes roast battles feel like being in a packed comedy arena. The design should evoke excitement, tension, and the thrill of live competition without generic Web3 aesthetics.

### Design Principles

1. **Entertainment First**: The app is about roasting, not crypto. Blockchain is infrastructure, not UI focus.
2. **Arena Energy**: Every screen should feel electric, like a comedy club meets esports venue.
3. **Instant Gratification**: Fast matchmaking, immediate reactions, instant rewards.
4. **Shareable Moments**: Everything optimized for viral clip generation and social sharing.
5. **Progressive Web3**: Wallet features are seamlessly integrated, not technical hurdles.

---

## Visual Language

### Color Palette

**Primary**: Fire/flame gradient (#FF4500 → #FF6B35 → #E94560)
- Use for CTAs, active states, emphasis
- Creates energy and excitement

**Background**: Deep dark (#0D0D0D to #1A1A2E)
- Near-black for immersive viewing
- Subtle navy undertones add depth

**Accent**: Electric neon highlights
- Neon pink (#E94560) for notifications, alerts
- Electric blue (#00D9FF) for links, secondary actions
- Gold/Silver/Bronze for rankings

**Semantic**: Standard meanings
- Green (#00E676) for success, wins, earnings
- Red (#FF5252) for errors, losses
- Yellow (#FFB300) for warnings, time pressure

### Typography

**Headings**: Bebas Neue
- Bold, uppercase, tight tracking
- Used for: Battle announcements, winner reveals, section titles
- Creates impact and urgency

**Body**: Inter
- Clean, highly readable
- Used for: All UI text, prompts, descriptions
- Optimized for mobile screens

**Mono**: JetBrains Mono
- Used for: Wallet addresses, transaction IDs
- Technical elements that need precision

### Iconography

- Rounded, bold stroke icons
- Fire/flame motifs for battle-related actions
- Emoji-style reactions (native platform emojis)
- Trophy, crown, medal icons for achievements

---

## Core Screens

### Home Screen
```
┌─────────────────────────────────┐
│  [Logo]    [100 ROAST] [Wallet] │  ← Header
├─────────────────────────────────┤
│                                 │
│  ┌─────────────────────────────┐│
│  │      QUICK MATCH           ││  ← Hero CTA
│  │   [🔥 Battle Now 🔥]       ││
│  └─────────────────────────────┘│
│                                 │
│  🏆 Daily Leaderboard           │  ← Quick access
│  ┌─────┐ ┌─────┐ ┌─────┐       │
│  │ #1  │ │ #2  │ │ #3  │       │
│  └─────┘ └─────┘ └─────┘       │
│                                 │
│  🔥 Trending Clips              │
│  ┌─────┐ ┌─────┐ ┌─────┐       │
│  │ ▶️   │ │ ▶️   │ │ ▶️   │       │
│  └─────┘ └─────┘ └─────┘       │
│                                 │
├─────────────────────────────────┤
│ 🏠  ⚔️  🏆  🎬  👤              │  ← Bottom nav
└─────────────────────────────────┘
```

### Battle Arena
```
┌─────────────────────────────────┐
│           ⏱️ 00:23              │  ← Timer
├─────────────────────────────────┤
│                                 │
│   ┌─────────┐   ┌─────────┐    │
│   │  👤     │   │     👤  │    │  ← Players
│   │ Player1 │ VS│ Player2 │    │
│   │  45pts  │   │  42pts  │    │
│   └─────────┘   └─────────┘    │
│                                 │
│  ┌─────────────────────────────┐│
│  │  "Roast your opponent's    "││  ← Prompt
│  │   fashion sense like       "││
│  │   you mean it"             "││
│  └─────────────────────────────┘│
│                                 │
│        [🎤 HOLD TO ROAST]       │  ← Record
│                                 │
├─────────────────────────────────┤
│ 🔥 💀 😂 👎 🤯                   │  ← Reactions
└─────────────────────────────────┘
```

### Leaderboard
```
┌─────────────────────────────────┐
│  Leaderboard    [Daily ▾]      │
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │ 🥇 1. @FireRoaster          ││
│  │    98% WR │ 15,420 ROAST    ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ 🥈 2. @BurnMaster           ││
│  │    94% WR │ 12,890 ROAST    ││
│  └─────────────────────────────┘│
│  ┌─────────────────────────────┐│
│  │ 🥉 3. @SavageQueen          ││
│  │    91% WR │ 11,200 ROAST    ││
│  └─────────────────────────────┘│
│  ...                            │
├─────────────────────────────────┤
│ 🏠  ⚔️  🏆  🎬  👤              │
└─────────────────────────────────┘
```

### Clip Feed
```
┌─────────────────────────────────┐
│  Clips         [Following ▾]    │
├─────────────────────────────────┤
│  ┌─────────────────────────────┐│
│  │                             ││
│  │         ▶️                  ││  ← 9:16 video
│  │                             ││
│  │                             ││
│  │  @Player1 vs @Player2       ││
│  │  🔥 12.4K  💬 892  ↗️ Share  ││
│  └─────────────────────────────┘│
│                                 │
│  ┌───────┐ ┌───────┐           │
│  │  ▶️   │ │  ▶️   │           │  ← Grid
│  └───────┘ └───────┘           │
├─────────────────────────────────┤
│ 🏠  ⚔️  🏆  🎬  👤              │
└─────────────────────────────────┘
```

---

## Interaction Patterns

### Battle Entry Flow
1. User taps "Battle Now" or selects tier
2. Tier selection modal shows Bronze/Silver/Gold/Diamond
3. User selects tier → Confirm modal shows entry fee
4. Wallet signature requested
5. Matchmaking screen with fire animation
6. Match found → 3-2-1 countdown → Battle starts

### Roast Recording
1. Prompt appears with countdown
2. User holds record button
3. Waveform visualizes audio
4. Release submits roast
5. AI processes → Score revealed with commentary
6. Next round or battle end

### Tipping Flow
1. Spectator taps tip button
2. Quick amounts shown (1/5/10/50 ROAST)
3. Tap amount → Confirmation with fee
4. Wallet signature
5. Success toast, performer notified

### Clip Sharing
1. View clip in feed or after battle
2. Tap share icon
3. Share sheet: TikTok, Reels, X, Copy Link
4. Deep link opens native app with caption
5. User posts, returns to RoastPush

---

## Component Styling Guidelines

### Buttons

**Primary (CTA)**:
- Background: Fire gradient
- Text: White, bold
- Shadow: Fire glow
- States: Scale down on press, pulse on hover

**Secondary**:
- Background: Transparent with border
- Border: Fire gradient
- Text: Fire gradient
- States: Fill on hover

**Ghost**:
- Background: Transparent
- Text: White
- States: Subtle background on hover

### Cards

**Battle Card**:
- Background: Dark navy (#16213E)
- Border: Subtle gradient border
- Shadow: Soft black shadow
- Border radius: 16px

**Player Card**:
- Background: Semi-transparent dark
- Highlight: Fire glow when active
- Avatar: Rounded with status ring

### Inputs

**Text Input**:
- Background: Dark (#1A1A2E)
- Border: 1px subtle gray, fire on focus
- Text: White
- Placeholder: Muted gray

**Selectors**:
- Unselected: Dark with border
- Selected: Fire gradient background
- Transition: Smooth color shift

### Modals

- Backdrop: Dark blur
- Container: Rounded dark card
- Close: X button top right
- Animation: Scale + fade in

---

## Animation Guidelines

### Micro-interactions
- Button press: Scale to 0.95, 150ms
- Emoji react: Float up + fade out, 1s
- Score reveal: Count up + bounce
- Balance update: Flash green + pulse

### Transitions
- Screen change: Slide horizontal, 300ms
- Modal open: Scale from 0.9, 200ms
- Tab switch: Crossfade, 150ms

### Battle Animations
- Matchmaking: Pulsing fire loop
- Countdown: Large numbers scaling
- Winner reveal: Confetti burst + glow
- Score breakdown: Staggered bar fills

---

## Accessibility

### Color Contrast
- Text on dark: Minimum 4.5:1 ratio
- Interactive elements: Clear focus states
- Don't rely on color alone for status

### Motion
- Respect prefers-reduced-motion
- Provide pause for auto-play content
- Keep essential animations minimal

### Screen Readers
- All interactive elements labeled
- Live regions for battle events
- Logical focus order
- Skip links for navigation

---

## Responsive Behavior

### Mobile (Primary)
- Full vertical layout
- Bottom navigation
- Touch-optimized targets (44px min)
- Swipe gestures for clips

### Tablet
- Battle arena centered
- Side panel for reactions/chat
- Larger touch targets

### Desktop
- Max-width container
- Spectator gallery sidebar
- Keyboard shortcuts
- Mouse hover states
