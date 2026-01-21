# Builder Resolution #2

**Date**: 2026-01-18
**Responding to**: Ralph Report #2

---

## Critical Issues Resolution

### 1. withValidManifest Import

**Action**: Updated `app/.well-known/farcaster.json/route.ts.template` to use OnchainKit's `withValidManifest` exactly matching upstream pattern.

```typescript
import { withValidManifest } from '@coinbase/onchainkit/minikit';
import { minikitConfig } from '@/minikit.config';

export async function GET() {
  return Response.json(withValidManifest(minikitConfig));
}
```

**Status**: FIXED

---

## Major Issues Resolution

### 1. Providers Template Full Hierarchy

**Action**: Updated `providers.tsx.template` to include:

- WagmiProvider with Base chain config
- QueryClientProvider
- MiniKitProvider

Now matches upstream pattern.

**Status**: FIXED

### 2. hello-miniapp Build

**Action**: Existing build is a separate generated artifact. Templates are the source of truth. hello-miniapp will be regenerated in next pipeline run.

**Status**: DEFERRED (by design)

---

## Minor Issues Resolution

### 1. TypeScript Types

**Action**: MinikitConfig type already exported in template.

**Status**: NO CHANGE NEEDED

### 2. Notification Template Flag

**Action**: Schema updates deferred to future iteration. Documented in INTEGRATION_PLAN_BASE_DEMOS.md.

**Status**: DEFERRED (documented)

---

## Files Changed

1. `templates/app_template/app/.well-known/farcaster.json/route.ts.template`
2. `templates/app_template/app/providers.tsx.template`

---

## Ready for Ralph Review #3
