# Web3 Factory Implementation Checklist

## Scope: Local Tooling Only

This repo contains LOCAL-ONLY tools. The hosted platform (factoryapp.dev) is in a separate repository.

---

## What's In This Repo

### Generator (Complete)
- [x] `generator/index.ts` - Entrypoint for `npm run generate`
- [x] `generator/templates/build_prompt.hbs` - Build instructions
- [x] `generator/templates/checklist.hbs` - Verification checklist
- [x] `generator/templates/contract_spec.hbs` - Blockchain spec
- [x] `generator/templates/frontend_spec.hbs` - UI guidelines
- [x] `generator/package.json` - Dependencies

### Validator (Complete)
- [x] `validator/index.ts` - Entrypoint for `npm run validate`
- [x] `validator/zip.ts` - Entrypoint for `npm run zip`
- [x] Enforces ZIP_CONTRACT.md exactly
- [x] Clear pass/fail output
- [x] Points to factoryapp.dev for upload

### ZIP Contract (Complete)
- [x] `ZIP_CONTRACT.md` - Source of truth for valid builds
- [x] Required files list
- [x] Required dependencies
- [x] Forbidden files/patterns
- [x] Size limits

### Documentation (Complete)
- [x] `README.md` - Clear local-only scope
- [x] `GET_STARTED.md` - Step-by-step guide
- [x] `ARCHITECTURE.md` - System boundary diagram
- [x] `IMPLEMENTATION_CHECKLIST.md` - This file

---

## What's NOT In This Repo

These belong on factoryapp.dev (separate repository):

- [ ] Upload page
- [ ] Metadata form
- [ ] Wallet connection for launch
- [ ] Bags API integration
- [ ] Transaction preparation
- [ ] Vercel deployment
- [ ] Showcase page
- [ ] Database

---

## Commands

```bash
# Generate build prompts
npm run generate "your app idea"

# Validate build (run from build dir)
npm run validate

# Create zip (run from build dir)
npm run zip

# Upload at: https://factoryapp.dev/web3-factory/launch
```

---

## Deprecated

The `deprecated/platform-v1/` directory contains code that was incorrectly placed here. It will be removed in a future cleanup.

---

**Last Updated:** 2026-01-12
