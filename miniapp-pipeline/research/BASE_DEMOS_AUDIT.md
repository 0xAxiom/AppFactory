# Base Demos Repository Audit

Deep discovery audit of `base/demos` repository for integration into `miniapp-pipeline`.

**Audited**: 2026-01-18
**Commit**: 84caae0a337e2ca95f6c5d3e5e822900bb2d0f9a
**Source**: https://github.com/base/demos

---

## Executive Summary

The base/demos repository contains 4 official Mini App templates and 6 workshop examples. The **recommended template for miniapp-pipeline integration** is:

1. **Primary**: `mini-apps/templates/minikit/new-mini-app-quickstart/` - Official quickstart, minimal deps
2. **Reference**: `mini-apps/templates/minikit/mini-app-full-demo-minikit/` - Feature-complete demo

The Farcaster SDK template (`farcaster-sdk/mini-app-full-demo/`) uses newer wagmi v3 and should be tracked but not primary.

---

## Repository Structure Analysis

### Mini Apps Directory (`mini-apps/`)

| Path                                            | Purpose          | Framework      | Priority |
| ----------------------------------------------- | ---------------- | -------------- | -------- |
| `templates/minikit/new-mini-app-quickstart/`    | Official starter | Next.js 15.3.6 | **HIGH** |
| `templates/minikit/mini-app-full-demo-minikit/` | Feature demo     | Next.js 15.5.7 | **HIGH** |
| `templates/minikit/vite-mini/`                  | Vite alternative | Vite           | LOW      |
| `templates/farcaster-sdk/mini-app-full-demo/`   | Pure SDK         | Next.js        | MEDIUM   |
| `workshops/my-simple-mini-app/`                 | Notifications    | Next.js        | **HIGH** |
| `workshops/three-card-monte/`                   | Gaming + TX      | Next.js        | MEDIUM   |
| `workshops/mini-neynar/`                        | Neynar API       | Next.js        | LOW      |
| `workshops/my-mini-zora/`                       | Zora NFTs        | Next.js        | LOW      |
| `workshops/mini-app-route/`                     | Routing          | Next.js        | LOW      |
| `workshops/mini-app-wrapped/`                   | Provider wrap    | Next.js        | LOW      |

### Other Directories (Not Relevant to Mini Apps)

- `base-account/` - Account abstraction demos (different use case)
- `paymaster/` - Gasless transaction demos (could be future integration)
- `base-app-coins/` - Coin demos (not relevant)

---

## Key Pattern Analysis

### 1. Manifest Configuration Pattern

**Location**: `minikit.config.ts` (centralized)

```typescript
const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const minikitConfig = {
  accountAssociation: {
    header: '', // Filled after signing
    payload: '', // Filled after signing
    signature: '', // Filled after signing
  },
  miniapp: {
    version: '1',
    name: 'App Name',
    subtitle: 'Short description',
    description: 'Full description',
    screenshotUrls: [`${ROOT_URL}/screenshot.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: '#000000',
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: 'social',
    tags: ['tag1', 'tag2'],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: '',
    ogTitle: '',
    ogDescription: '',
    ogImageUrl: `${ROOT_URL}/og.png`,
  },
} as const;
```

### 2. Manifest Endpoint Pattern

**Location**: `app/.well-known/farcaster.json/route.ts`

```typescript
import { withValidManifest } from '@coinbase/onchainkit/minikit';
import { minikitConfig } from '../../../minikit.config';

export async function GET() {
  return Response.json(withValidManifest(minikitConfig));
}
```

**Key Insight**: `withValidManifest` from OnchainKit validates and transforms the config.

### 3. Provider Hierarchy Pattern

**Location**: Various `providers.tsx` files

```typescript
import { MiniKitProvider } from "@coinbase/onchainkit/minikit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

export function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <MiniKitProvider
          appName={process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME}
          appUrl={process.env.NEXT_PUBLIC_URL}
          projectId={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        >
          {children}
        </MiniKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### 4. Webhook Handler Pattern

**Location**: `app/api/webhook/route.ts`

```typescript
export async function POST(request: Request) {
  const requestJson = await request.json();
  const { header: encodedHeader, payload: encodedPayload } = requestJson;

  const headerData = decode(encodedHeader);
  const event = decode(encodedPayload);
  const { fid, key } = headerData;

  // Verify FID ownership via Key Registry on Optimism
  const valid = await verifyFidOwnership(fid, key);
  if (!valid) {
    return Response.json({ success: false }, { status: 401 });
  }

  // Handle events
  switch (event.event) {
    case 'frame_added':
      // User added the mini app
      break;
    case 'frame_removed':
      // User removed the mini app
      break;
    case 'notifications_enabled':
      // User enabled notifications
      break;
    case 'notifications_disabled':
      // User disabled notifications
      break;
  }

  return Response.json({ success: true });
}
```

### 5. Notification Client Pattern

**Location**: `lib/notification-client.ts`

Uses `@farcaster/frame-sdk` for push notifications with Redis for token storage.

### 6. FrameProvider Context Pattern

**Location**: `components/providers/FrameProvider.tsx`

```typescript
import { useMiniKit, useIsInMiniApp } from '@coinbase/onchainkit/minikit';

export default function FrameProvider({ children }) {
  const { context } = useMiniKit();
  const { isInMiniApp } = useIsInMiniApp();

  // Provides frame context to all children
}
```

### 7. SDK Actions Pattern

**Location**: Various action components

```typescript
import { sdk } from '@farcaster/miniapp-sdk';

// Available actions (from validate.txt and implementations)
sdk.actions.ready(); // Required - dismiss splash screen
sdk.actions.signIn({ nonce }); // Sign in user
sdk.actions.composeCast(params); // Create a cast
sdk.actions.viewProfile({ fid }); // View user profile
sdk.actions.viewToken({ token }); // View token
sdk.actions.sendToken(params); // Send token
sdk.actions.swapToken(params); // Swap tokens
sdk.actions.openMiniApp(params); // Open another mini app
sdk.actions.close(); // Close the mini app
sdk.actions.openUrl(url); // Open external URL
sdk.actions.viewCast({ hash }); // View a cast
sdk.actions.addMiniApp(); // Add to user's apps
sdk.actions.requestCameraAndMicrophoneAccess(); // Media permissions
```

---

## Dependency Analysis

### Core Dependencies (new-mini-app-quickstart)

```json
{
  "@coinbase/onchainkit": "latest",
  "@farcaster/miniapp-sdk": "^0.1.8",
  "@tanstack/react-query": "^5.81.5",
  "next": "15.3.6",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "viem": "^2.31.6",
  "wagmi": "^2.16.3"
}
```

### Extended Dependencies (mini-app-full-demo-minikit)

```json
{
  "@base-org/account": "^2.0.2",
  "@base-org/account-ui": "^1.0.1",
  "@coinbase/onchainkit": "^1.0.3",
  "@farcaster/auth-kit": "^0.8.1",
  "@farcaster/miniapp-core": "^0.3.8",
  "@farcaster/miniapp-node": "^0.1.8",
  "@farcaster/miniapp-sdk": "^0.1.9",
  "@farcaster/miniapp-wagmi-connector": "^1.0.0",
  "@farcaster/quick-auth": "^0.0.8"
}
```

### Notification Dependencies

```json
{
  "@upstash/redis": "^1.x",
  "@farcaster/frame-sdk": "^x.x"
}
```

---

## Environment Variables Analysis

### Required for All Apps

```bash
NEXT_PUBLIC_ONCHAINKIT_API_KEY=   # CDP API Key
NEXT_PUBLIC_URL=                   # Production URL
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=  # App name
```

### Vercel-Specific

```bash
VERCEL_PROJECT_PRODUCTION_URL     # Auto-set by Vercel
VERCEL_URL                        # Preview URL
VERCEL_ENV                        # production/preview/development
```

### Optional (Notifications)

```bash
UPSTASH_REDIS_REST_URL=           # For notification storage
UPSTASH_REDIS_REST_TOKEN=
```

---

## File Mapping for Integration

### Essential Files (Must Extract)

| Source                                    | Target                                                                    | Purpose           |
| ----------------------------------------- | ------------------------------------------------------------------------- | ----------------- |
| `minikit.config.ts`                       | `templates/app_template/minikit.config.ts.template`                       | Config pattern    |
| `app/.well-known/farcaster.json/route.ts` | `templates/app_template/app/.well-known/farcaster.json/route.ts.template` | Manifest endpoint |
| `app/rootProvider.tsx` or `providers.tsx` | `templates/app_template/app/providers.tsx.template`                       | Provider setup    |
| `package.json`                            | `templates/app_template/package.json.template`                            | Dependencies      |

### Optional Files (Feature Modules)

| Source                     | Feature            | Extract Condition       |
| -------------------------- | ------------------ | ----------------------- |
| `app/api/webhook/route.ts` | Webhooks           | If notifications needed |
| `app/api/notify/route.ts`  | Push notifications | If notifications needed |
| `lib/notification.ts`      | Notification utils | If notifications needed |
| `lib/redis.ts`             | Redis client       | If notifications needed |
| `components/wallet/`       | Wallet components  | If wallet UI needed     |
| `components/actions/`      | SDK actions        | If action UI needed     |

---

## Key Findings

### 1. MiniKit vs Farcaster SDK

- **MiniKit** (recommended): Higher-level abstraction via `@coinbase/onchainkit/minikit`
- **Farcaster SDK**: Lower-level, more control, uses `@farcaster/miniapp-sdk` directly

Both can coexist. MiniKit uses Farcaster SDK internally.

### 2. Wagmi Versions

- **quickstart**: wagmi ^2.16.3 (stable)
- **full-demo-minikit**: wagmi ^2.16.9 (stable)
- **farcaster-sdk demo**: wagmi ^3.0.1 (newer, breaking changes)

**Recommendation**: Use wagmi v2 for stability.

### 3. Account Association Workflow

The account association (signing) is a **manual step** that must happen after deployment:

1. Deploy app to production URL
2. Visit https://farcaster.xyz/~/developers/mini-apps/manifest
3. Enter domain and sign with Farcaster wallet
4. Copy `accountAssociation` object to `minikit.config.ts`
5. Redeploy

This matches our existing M5 manual step in miniapp-pipeline.

### 4. Key Registry Verification

Webhook handlers verify FID ownership via the Key Registry contract on Optimism:

- Address: `0x00000000Fc1237824fb747aBDE0FF18990E59b7e`
- This is critical for security - validates webhook caller owns the FID

### 5. Notification System Architecture

```
User enables notifications
        │
        ▼
Webhook receives notification_details
        │
        ▼
Store in Redis (fid → token)
        │
        ▼
Send notifications via Farcaster API
```

---

## Gaps Identified

### 1. No Testing Examples

None of the templates include test files. Our pipeline should add:

- Unit tests for components
- Integration tests for manifest endpoint
- E2E tests for mini app flow

### 2. No CI/CD Configuration

No GitHub Actions or similar. Our pipeline provides this via proof gate.

### 3. No TypeScript Strictness

Most templates use basic TypeScript config. Could be stricter.

### 4. Hardcoded Values

Some templates have hardcoded values that should be templated:

- App names
- Colors
- Categories

---

## Recommendations

### For Integration

1. **Extract `new-mini-app-quickstart`** as primary template base
2. **Reference `mini-app-full-demo-minikit`** for feature patterns
3. **Extract `my-simple-mini-app`** notification patterns as optional module
4. **Create feature flags** for optional integrations (notifications, wallet UI)

### For Proof Gate Updates

Add checks from `mini-app-validation/validate.txt`:

- SDK ready call verification (`sdk.actions.ready()`)
- Manifest field validation
- Image dimension checks

### Version Pinning

Pin to specific versions instead of `latest`:

```json
{
  "@coinbase/onchainkit": "^1.0.3",
  "@farcaster/miniapp-sdk": "^0.1.9"
}
```

---

## Appendix: File Counts

```
mini-apps/templates/minikit/new-mini-app-quickstart/
├── TypeScript files: 12
├── JSON files: 4
├── Markdown: 1

mini-apps/templates/minikit/mini-app-full-demo-minikit/
├── TypeScript files: 35
├── JSON files: 5
├── Markdown: 1

mini-apps/workshops/my-simple-mini-app/
├── TypeScript files: 14
├── JSON files: 4
├── Markdown: 1
```

---

_Audit completed for miniapp-pipeline integration planning._
