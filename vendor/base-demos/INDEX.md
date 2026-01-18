# Base Demos Repository Index

Navigational tree and summary of the vendored `base/demos` repository.

## Repository Overview

| Category | Count | Description |
|----------|-------|-------------|
| Mini App Templates | 4 | Official starter templates for Base Mini Apps |
| Mini App Workshops | 6 | Advanced examples with specific features |
| Base Account Demos | 5 | Account abstraction patterns |
| Paymaster Examples | 2 | Gasless transaction patterns |
| Other | 1 | App coins demo |

---

## Directory Tree

```
base-demos/
├── mini-apps/                           # Primary Mini App resources
│   ├── templates/                       # Official starter templates
│   │   ├── minikit/                     # MiniKit-based templates (RECOMMENDED)
│   │   │   ├── new-mini-app-quickstart/ # [STARTER] Waitlist signup app
│   │   │   ├── mini-app-full-demo-minikit/ # [FULL] All features demo
│   │   │   └── vite-mini/               # [ALT] Vite alternative (not Next.js)
│   │   └── farcaster-sdk/               # Pure Farcaster SDK templates
│   │       └── mini-app-full-demo/      # Full demo without MiniKit
│   │
│   ├── workshops/                       # Advanced feature examples
│   │   ├── mini-app-route/              # Route-based navigation
│   │   ├── mini-app-wrapped/            # MiniKit provider wrapping
│   │   ├── my-simple-mini-app/          # Notifications, webhooks
│   │   ├── three-card-monte/            # Gaming, transactions, CDP
│   │   ├── mini-neynar/                 # Neynar API integration
│   │   └── my-mini-zora/                # Zora token integration
│   │
│   └── mini-app-validation/             # Validation utilities
│
├── base-account/                        # Account abstraction demos
│   ├── base-account-wagmi-template/     # Wagmi + Base Account
│   ├── base-account-rainbow-template/   # Rainbow + Base Account
│   ├── base-account-privy-template/     # Privy authentication
│   ├── auto-sub-accounts/               # Sub-account automation
│   ├── base-pay-amazon/                 # Payment integration
│   │   ├── checkout-app/                # Checkout flow
│   │   └── chrome-extension/            # Browser extension
│   └── agent-spend-permissions/         # AI agent wallet permissions
│
├── paymaster/                           # Gasless transaction demos
│   ├── hangman-onchain/                 # Hangman game with paymaster
│   └── onchain-game-lingos/             # Word game with paymaster
│
└── base-app-coins/                      # App coins demo
```

---

## Mini App Templates (Priority Order)

### 1. MiniKit Templates (Recommended)

#### `new-mini-app-quickstart/` - Official Quickstart
**Best for**: First-time Mini App builders, production apps

| Attribute | Value |
|-----------|-------|
| Framework | Next.js 15.3.6 |
| React | 19.0.0 |
| Key Deps | @coinbase/onchainkit, @farcaster/miniapp-sdk, wagmi, viem |
| Structure | App Router, TypeScript |

**Key Files**:
- `minikit.config.ts` - Centralized manifest configuration
- `app/.well-known/farcaster.json/route.ts` - Manifest endpoint using `withValidManifest`
- `app/page.tsx` - Main application entry

---

#### `mini-app-full-demo-minikit/` - Feature Complete Demo
**Best for**: Learning all MiniKit features, reference implementation

| Attribute | Value |
|-----------|-------|
| Framework | Next.js 15.5.7 |
| React | 19.1.1 |
| Key Deps | @base-org/account, @base-org/account-ui, @farcaster/miniapp-core, @farcaster/quick-auth |
| Extras | Tailwind, lucide-react, siwe, eruda (debugging) |

**Key Files**:
- `src/app/.well-known/farcaster.json/route.ts` - Manifest endpoint
- `src/components/actions/` - Action component examples
- `src/components/wallet/` - Wallet integration patterns
- `src/components/providers/` - Provider configuration
- `src/lib/` - Utility functions

---

#### `vite-mini/` - Vite Alternative
**Best for**: Non-Next.js projects, simpler builds

| Attribute | Value |
|-----------|-------|
| Framework | Vite |
| Key Deps | React, Vite plugins |
| Note | Static manifest in `public/.well-known/` |

---

### 2. Farcaster SDK Template (Advanced)

#### `farcaster-sdk/mini-app-full-demo/` - Pure SDK Demo
**Best for**: Maximum control, non-MiniKit implementations

Uses `@farcaster/miniapp-sdk` directly without MiniKit wrappers.

---

## Mini App Workshops (Feature Examples)

| Workshop | Key Feature | Integration |
|----------|-------------|-------------|
| `mini-app-route/` | Multi-page navigation | Routes, layouts |
| `mini-app-wrapped/` | Provider patterns | MiniKit wrapping |
| `my-simple-mini-app/` | Push notifications | Redis, webhooks |
| `three-card-monte/` | Gaming + transactions | CDP, smart contracts |
| `mini-neynar/` | Social features | Neynar API |
| `my-mini-zora/` | NFT minting | Zora protocol |

---

## Key Integration Patterns

### Manifest Handling
All templates use the pattern:
```typescript
// minikit.config.ts - Centralized configuration
export const minikitConfig = {
  accountAssociation: { header: "", payload: "", signature: "" },
  miniapp: { version: "1", name: "...", /* ... */ }
};

// route.ts - Dynamic endpoint
import { withValidManifest } from "@coinbase/onchainkit/minikit";
export async function GET() {
  return Response.json(withValidManifest(minikitConfig));
}
```

### Provider Structure
```typescript
// Standard provider hierarchy
<WagmiProvider>
  <QueryClientProvider>
    <MiniKitProvider>
      <App />
    </MiniKitProvider>
  </QueryClientProvider>
</WagmiProvider>
```

### Notification Webhooks
```
app/api/webhook/route.ts  - Incoming webhook handler
app/api/notify/route.ts   - Outbound notification sender
lib/notification.ts       - Notification utilities
lib/redis.ts              - State persistence
```

---

## Selection Guide for miniapp-pipeline

| Use Case | Recommended Template |
|----------|---------------------|
| New production app | `new-mini-app-quickstart` |
| Learning all features | `mini-app-full-demo-minikit` |
| Adding notifications | `my-simple-mini-app` |
| Gaming with transactions | `three-card-monte` |
| Social features | `mini-neynar` |
| NFT integration | `my-mini-zora` |

---

## Files of Interest for Integration

### Core Patterns (Must Extract)
- `*/minikit.config.ts` - Configuration pattern
- `*/.well-known/farcaster.json/route.ts` - Manifest endpoint
- `*/providers.tsx` or `*/providers/` - Provider setup

### Feature Patterns (Optional Extract)
- `*/api/webhook/route.ts` - Webhook handling
- `*/api/notify/route.ts` - Push notifications
- `*/lib/notification.ts` - Notification utilities
- `*/components/actions/` - Action components
- `*/components/wallet/` - Wallet components

---

## Dependency Summary

### Common Dependencies (Latest Versions from mini-app-full-demo-minikit)
```json
{
  "@base-org/account": "^2.0.2",
  "@base-org/account-ui": "^1.0.1",
  "@coinbase/onchainkit": "^1.0.3",
  "@farcaster/miniapp-core": "^0.3.8",
  "@farcaster/miniapp-node": "^0.1.8",
  "@farcaster/miniapp-sdk": "^0.1.9",
  "@farcaster/miniapp-wagmi-connector": "^1.0.0",
  "@farcaster/quick-auth": "^0.0.8",
  "@tanstack/react-query": "^5.85.9",
  "next": "15.5.7",
  "react": "19.1.1",
  "viem": "^2.37.1",
  "wagmi": "^2.16.9"
}
```

---

*Generated: 2026-01-18*
*Source: base/demos @ 84caae0a*
