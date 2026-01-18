# Ralph Report #1 - Base Demos Integration Review

**Date**: 2026-01-18
**Focus**: Upstream extraction and documentation quality

---

## Summary

Initial review of the base/demos integration. Found documentation gaps and inconsistencies between upstream patterns and existing templates.

---

## Critical Issues (Must Fix)

### 1. Minikit Config Template Uses Getter Pattern Not Present in Upstream
- **Location**: `templates/app_template/minikit.config.ts.template`
- **Impact**: Template uses getter functions (`get homeUrl()`) but upstream uses `ROOT_URL` constant
- **Suggested fix**: Align with upstream pattern using const ROOT_URL

### 2. Missing env.example Updates
- **Location**: `templates/app_template/.env.example.template`
- **Impact**: New required env vars for MiniKit not documented
- **Suggested fix**: Add `NEXT_PUBLIC_ONCHAINKIT_API_KEY` and `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME`

---

## Major Issues (Should Fix)

### 1. Notification Module Not Integrated into Templates
- **Location**: `vendor/base-demos/selected/notifications-module/`
- **Impact**: Extracted but not available as optional template
- **Suggested fix**: Create conditional template or separate feature module

### 2. INDEX.md Missing Dependency Versions
- **Location**: `vendor/base-demos/INDEX.md`
- **Impact**: Version pinning info scattered
- **Suggested fix**: Consolidate pinned versions in a single section

---

## Minor Issues (Nice to Fix)

### 1. Proof Gate Check Order
- SDK Ready check is #7, should logically follow manifest validation
- Suggested: Reorder checks for logical flow

### 2. Selected Directory README Missing
- No README in `vendor/base-demos/selected/`
- Suggested: Add README explaining what selected contains

---

## Passing Checks

- [x] Upstream cloned with correct commit
- [x] UPSTREAM.md has provenance info
- [x] INDEX.md provides navigation
- [x] BASE_DEMOS_AUDIT.md is comprehensive
- [x] Integration plan is actionable
- [x] Selected directory structure is correct
- [x] Proof gate has SDK ready check

---

## Verdict

**NEEDS WORK** - Address critical and major issues before proceeding.
