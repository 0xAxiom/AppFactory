# Ralph Report #2 - Template Consistency Review

**Date**: 2026-01-18
**Focus**: Template files and build validation

---

## Summary

Critical issues from Report #1 have been addressed. Now reviewing template consistency and proof gate completeness.

---

## Critical Issues (Must Fix)

### 1. withValidManifest Import Missing
- **Location**: `templates/app_template/app/.well-known/farcaster.json/route.ts.template`
- **Impact**: Upstream uses `withValidManifest` from OnchainKit, template may not
- **Suggested fix**: Verify template matches upstream pattern

---

## Major Issues (Should Fix)

### 1. Providers Template Missing Wagmi/QueryClient
- **Location**: `templates/app_template/app/providers.tsx.template`
- **Impact**: Upstream pattern includes WagmiProvider and QueryClient
- **Suggested fix**: Add full provider hierarchy for wallet integration

### 2. hello-miniapp Build Not Updated
- **Location**: `builds/miniapps/hello-miniapp/`
- **Impact**: Existing example may not reflect new patterns
- **Suggested fix**: Verify hello-miniapp uses updated templates

---

## Minor Issues (Nice to Fix)

### 1. TypeScript Types for Config
- No type exports for MinikitConfig usage

### 2. No Notification Template Option Flag
- Stage schemas don't have `enable_notifications` field
- Suggested: Add to M1 schema

---

## Passing Checks

- [x] minikit.config.ts uses ROOT_URL pattern
- [x] .env.example has OnchainKit vars
- [x] selected/README.md exists
- [x] Package versions are pinned
- [x] Proof gate has SDK ready check

---

## Verdict

**NEEDS WORK** - Verify template files match upstream patterns.
