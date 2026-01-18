# Modifications from Upstream

This document tracks all modifications made to files extracted from `_upstream/base-demos/`.

**Upstream Commit**: 84caae0a337e2ca95f6c5d3e5e822900bb2d0f9a
**Extraction Date**: 2026-01-18

---

## Directory: `quickstart/`

**Source**: `mini-apps/templates/minikit/new-mini-app-quickstart/`

### Files Copied As-Is

| File | Notes |
|------|-------|
| `app/.well-known/farcaster.json/route.ts` | Uses `withValidManifest` pattern |
| `app/api/auth/route.ts` | Quick auth endpoint |
| `app/success/page.tsx` | Success page |
| `eslint.config.mjs` | ESLint config |
| `next.config.ts` | Next.js config |
| `tsconfig.json` | TypeScript config |
| `public/*` | Asset files |

### Files Modified

| File | Modification |
|------|--------------|
| `package.json` | Removed `package-lock.json` - regenerate on install |

### Files Removed

| File | Reason |
|------|--------|
| `node_modules/` | Generated on install |
| `package-lock.json` | Regenerate on install |
| `.next/` | Build artifact |

---

## Directory: `full-demo-reference/`

**Source**: `mini-apps/templates/minikit/mini-app-full-demo-minikit/`

### Purpose

Reference-only extraction of component patterns. Not intended for direct use.

### Files Extracted

| Directory | Contents |
|-----------|----------|
| `src/components/actions/` | SDK action component examples |
| `src/components/providers/` | Provider setup patterns |
| `src/components/ui/` | UI component examples |
| `src/components/wallet/` | Wallet integration patterns |
| `src/components/Demo.tsx` | Main demo component |

### Usage Notes

These components demonstrate patterns for:
- `sdk.actions.*` calls
- Wallet connection flows
- Transaction signing
- Profile viewing
- Token operations

---

## Directory: `notifications-module/`

**Source**: `mini-apps/workshops/my-simple-mini-app/`

### Files Extracted and Renamed

| Original Path | New Name | Purpose |
|---------------|----------|---------|
| `app/api/webhook/route.ts` | `webhook-handler.ts` | Farcaster webhook handling |
| `app/api/notify/route.ts` | `notify-endpoint.ts` | Send notification endpoint |
| `lib/notification.ts` | `notification.ts` | Notification CRUD utils |
| `lib/notification-client.ts` | `notification-client.ts` | Farcaster notification API |
| `lib/redis.ts` | `redis.ts` | Redis/Upstash client |

### Integration Notes

To use the notification module:

1. Install dependencies:
   ```bash
   npm install @upstash/redis @farcaster/frame-sdk
   ```

2. Set environment variables:
   ```bash
   UPSTASH_REDIS_REST_URL=
   UPSTASH_REDIS_REST_TOKEN=
   ```

3. Copy files to appropriate locations:
   - `webhook-handler.ts` → `app/api/webhook/route.ts`
   - `notify-endpoint.ts` → `app/api/notify/route.ts`
   - Other files → `lib/`

4. Update `minikit.config.ts` to include `webhookUrl`

---

## Template Variable Substitutions

When integrating into miniapp-pipeline templates, these values should become template variables:

| Hardcoded Value | Template Variable |
|-----------------|-------------------|
| `"Cubey"` | `{{APP_NAME}}` |
| `"Your AI Ad Companion"` | `{{APP_SUBTITLE}}` |
| `"Ads"` | `{{APP_DESCRIPTION}}` |
| `"#000000"` | `{{SPLASH_COLOR}}` |
| `"social"` | `{{PRIMARY_CATEGORY}}` |
| `["marketing", "ads", ...]` | `{{TAGS}}` |

---

## Verification

After extraction, verify:

```bash
# Check file counts
find quickstart/ -type f | wc -l
# Expected: ~15-20 files

find notifications-module/ -type f | wc -l
# Expected: 5 files

find full-demo-reference/src/components -type f | wc -l
# Expected: ~20-30 files
```

---

*Last updated: 2026-01-18*
