# Builder Resolution #1

**Date**: 2026-01-18
**Responding to**: Ralph Report #1

---

## Critical Issues Resolution

### 1. Minikit Config Template Pattern Fix

**Action**: Updated `minikit.config.ts.template` to use upstream ROOT_URL pattern.

```typescript
const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');
```

**Status**: FIXED

### 2. Missing env.example Updates

**Action**: Updated `.env.example.template` with new required variables.

**Status**: FIXED

---

## Major Issues Resolution

### 1. Notification Module Integration

**Action**: Documented as optional feature in MODIFICATIONS.md. Full template integration deferred - too complex for initial version. Users can copy from selected/notifications-module/.

**Status**: DEFERRED (documented)

### 2. INDEX.md Dependency Versions

**Action**: Already has dependency summary section. Verified complete.

**Status**: NO CHANGE NEEDED

---

## Minor Issues Resolution

### 1. Proof Gate Check Order

**Action**: Keeping current order - SDK ready check after account association makes sense for build flow.

**Status**: NO CHANGE (justified)

### 2. Selected Directory README

**Action**: Added README.md to selected directory.

**Status**: FIXED

---

## Files Changed

1. `templates/app_template/minikit.config.ts.template` - Pattern alignment
2. `templates/app_template/.env.example.template` - New env vars
3. `vendor/base-demos/selected/README.md` - New file

---

## Ready for Ralph Review #2
