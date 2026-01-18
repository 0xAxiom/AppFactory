# Scaffold Plan

## Project Metadata
- Slug: hello-miniapp
- Generated: 2026-01-18

## Template
MiniKit Next.js Starter (v14+ App Router)

## Dependencies
### Core
- next: ^14.2.0
- react: ^18.3.0
- react-dom: ^18.3.0

### Dev
- typescript: ^5.4.0
- tailwindcss: ^3.4.0
- eslint: ^8.57.0

## Routes

### Required
| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Main greeting page |
| `/.well-known/farcaster.json` | `app/.well-known/farcaster.json/route.ts` | Manifest endpoint |

### Optional
| Route | File | Purpose |
|-------|------|---------|
| `/api/webhook` | `app/api/webhook/route.ts` | Notification webhook |

## Components

### Layout
- `app/layout.tsx` - Root layout with metadata

### Shared
- `components/ClientWrapper.tsx` - Browser fallback
- `components/ErrorBoundary.tsx` - Error handling
- `components/LoadingState.tsx` - Loading indicator

### Feature
- Main page has inline greeting logic (simple enough)

## Data Layer

### State Management
React useState for greeting state

### Persistence
None (stateless greeting generator)

## Assets Required

### Images
| Asset | Dimensions | Format | Purpose |
|-------|-----------|--------|---------|
| icon.png | 1024x1024 | PNG | App icon |
| splash.png | 200x200 | PNG | Loading screen |
| hero.png | 1200x630 | PNG | Hero image |
| og.png | 1200x630 | PNG | Social sharing |
| screenshots/1.png | 1284x2778 | PNG | App screenshot |

### Colors
- Primary: #3B82F6 (blue)
- Background: #F9FAFB (light gray)
- Splash background: #3B82F6

## Implementation Notes

This is a minimal example app. The greeting feature is intentionally simple to focus on demonstrating the pipeline structure rather than complex functionality.
