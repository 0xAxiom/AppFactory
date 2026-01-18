# Stage M1: Template Selection & Scaffold Plan

## Purpose

Choose the technical approach and plan the complete project structure before any code generation.

## Input

- `artifacts/inputs/normalized_prompt.md` from Stage M0

## Process

1. **Select Base Template**
   - Default: MiniKit Next.js Starter
   - Consider onchain requirements for additional packages

2. **Plan Route Structure**
   - Required: `/` (main page)
   - Required: `/.well-known/farcaster.json` (manifest)
   - Optional: `/api/webhook` (notifications)
   - App-specific routes

3. **Plan Component Hierarchy**
   - Layout components
   - Page-level components
   - Shared/reusable components
   - Feature-specific components

4. **Determine Data Layer**
   - Local state (simple apps)
   - Local storage (persistence)
   - External API (data sync)
   - Onchain (blockchain data)

5. **Plan Asset Requirements**
   - All required images with dimensions
   - Color palette
   - Typography choices

## Output

File: `artifacts/stage01/scaffold_plan.md`

```markdown
# Scaffold Plan

## Project Metadata
- Slug: [url-safe-name]
- Generated: [timestamp]

## Template
MiniKit Next.js Starter (v14+ App Router)

## Dependencies
### Core
- next: ^14.0.0
- react: ^18.0.0
- react-dom: ^18.0.0
- typescript: ^5.0.0
- tailwindcss: ^3.0.0

### MiniKit
- @coinbase/minikit: ^latest

### Additional (if needed)
- [package]: [version] - [reason]

## Routes

### Required
| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Main app page |
| `/.well-known/farcaster.json` | `app/.well-known/farcaster.json/route.ts` | Manifest endpoint |

### Optional
| Route | File | Purpose |
|-------|------|---------|
| `/api/webhook` | `app/api/webhook/route.ts` | Notification webhook |
| [custom] | [path] | [purpose] |

## Components

### Layout
- `app/layout.tsx` - Root layout with providers
- `components/ClientWrapper.tsx` - Browser fallback handler

### Pages
- `app/page.tsx` - Main app content

### Shared
- `components/LoadingState.tsx` - Loading indicator
- `components/ErrorBoundary.tsx` - Error handling

### Feature-Specific
- `components/[Feature].tsx` - [description]

## Data Layer

### State Management
[Describe approach: useState, useReducer, context, etc.]

### Persistence
[Local storage, API, none]

### Onchain (if applicable)
[Wallet connection, contract interactions]

## Assets Required

### Images
| Asset | Dimensions | Format | Purpose |
|-------|-----------|--------|---------|
| icon.png | 1024x1024 | PNG (no transparency) | App icon |
| splash.png | 200x200 | PNG | Loading screen |
| hero.png | 1200x630 | PNG/JPG | Hero image |
| og.png | 1200x630 | PNG/JPG | Social sharing |
| screenshots/1.png | 1284x2778 | PNG | App screenshot |

### Colors
- Primary: [hex]
- Background: [hex]
- Splash background: [hex]

## File Structure Preview

```
app/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── .well-known/
│   │   └── farcaster.json/
│   │       └── route.ts
│   └── api/
│       └── webhook/
│           └── route.ts
├── components/
│   ├── ClientWrapper.tsx
│   ├── LoadingState.tsx
│   ├── ErrorBoundary.tsx
│   └── [Feature].tsx
├── public/
│   ├── icon.png
│   ├── splash.png
│   ├── hero.png
│   ├── og.png
│   └── screenshots/
│       └── 1.png
├── minikit.config.ts
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── .env.example
└── .gitignore
```

## Implementation Notes

[Any special considerations, gotchas, or decisions]
```

## Validation

- [ ] Slug is URL-safe (lowercase, hyphens only)
- [ ] All required routes are planned
- [ ] All required assets are listed
- [ ] Dependencies are appropriate for requirements
- [ ] File structure is complete

## Template Selection Guide

### Default Template
Use for most apps:
- MiniKit Next.js Starter
- Includes all required setup
- Tailwind CSS for styling

### With Onchain Features
Add when `onchainRequirements` is not "none":
- `@coinbase/onchainkit` for wallet UI
- `wagmi` for wallet hooks
- `viem` for blockchain interactions

### With External API
Add when data layer needs API:
- API routes in `app/api/`
- Consider caching strategy
- Handle loading/error states

## Examples

### Simple Social App
```markdown
## Template
MiniKit Next.js Starter

## Dependencies
Core Next.js + MiniKit only

## Routes
- `/` - Main gratitude input and feed
- `/.well-known/farcaster.json` - Manifest

## Components
- GratitudeInput.tsx - Text input for gratitude
- GratitudeCard.tsx - Display single entry
- GratitudeFeed.tsx - List of entries

## Data Layer
Local state with localStorage for persistence
```

### Tip Jar with Payments
```markdown
## Template
MiniKit Next.js Starter + OnchainKit

## Dependencies
- @coinbase/onchainkit
- wagmi
- viem

## Routes
- `/` - Tip jar interface
- `/api/webhook` - Payment notifications
- `/.well-known/farcaster.json` - Manifest

## Components
- TipSelector.tsx - Amount selection
- WalletConnect.tsx - Connect wallet
- TransactionStatus.tsx - Tx feedback

## Data Layer
Onchain for payments, local state for UI
```

## Next Stage

Output feeds into Stage M2 (Scaffold Project).
