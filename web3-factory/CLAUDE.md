# Web3 Factory Control Plane

**Version**: 2.0
**Status**: MANDATORY
**Scope**: LOCAL TOOLING ONLY

---

## CRITICAL: This Repo is Local-Only

This repository contains **local tools that run on the user's machine**:
- Build prompt generator
- Build validator
- Zip creator

This repo does **NOT** contain:
- Backend APIs
- Bags SDK integration
- Token creation
- Vercel deployment
- Any server-side code

All server-side functionality lives on **factoryapp.dev** (separate repository).

---

## Supported Commands

### `npm run generate "idea"`

Generates build prompts from the user's app idea.

**Behavior**:
1. Parse idea text
2. Generate slug and app name
3. Create output directory: `generated/<app-slug>/`
4. Generate files:
   - `build_prompt.md` - Instructions for Claude/Cursor
   - `checklist.md` - Build verification checklist
   - `contract_spec.md` - Blockchain integration spec
   - `frontend_spec.md` - UI guidelines
5. Print next steps pointing to Claude/Cursor

**NO AI INFERENCE** - This just creates templated files.

### `npm run validate`

Validates a build against ZIP_CONTRACT.md.

**Run from**: The build directory (e.g., `web3-builds/roast-battle/`)

**Checks**:
- Required files present
- Required dependencies in package.json
- Wallet provider configured correctly
- No forbidden files (.env, node_modules, etc.)
- No forbidden code patterns (private keys, etc.)
- Size limits

**NO AI INFERENCE** - This just checks files.

### `npm run zip`

Creates an upload package.

**Run from**: The build directory

**Behavior**:
1. Validate the build exists
2. Add manifest.json
3. Exclude forbidden patterns (node_modules, .env, etc.)
4. Create `<app-name>.zip`
5. Print next steps pointing to factoryapp.dev

---

## Directory Structure

```
web3-factory/
├── generator/                  # Build prompt generator
│   ├── index.ts               # npm run generate
│   └── templates/             # Handlebars templates
│
├── validator/                  # Build validator
│   ├── index.ts               # npm run validate
│   └── zip.ts                 # npm run zip
│
├── generated/                  # Output from generator
├── web3-builds/                # User's built apps
├── deprecated/                 # Old code, do not use
│
├── ZIP_CONTRACT.md            # Source of truth for valid builds
├── README.md                  # Project overview
├── GET_STARTED.md             # Step-by-step guide
├── ARCHITECTURE.md            # System boundary diagram
└── CLAUDE.md                  # This file
```

---

## What Belongs Here vs factoryapp.dev

### In This Repo (Local Tools)
- Prompt generation from idea text
- Build validation against ZIP_CONTRACT
- Zip creation for upload
- Documentation

### On factoryapp.dev (Hosted Platform)
- Upload handling
- Bags API integration (server-side key)
- Token creation
- Transaction preparation
- Vercel deployment
- Showcase
- Fee split display

---

## Isolation Rules

**This repo MUST NOT**:
- Contain API keys or secrets
- Contain Bags SDK integration code
- Create tokens
- Deploy apps
- Call external APIs
- Contain backend/server code

**This repo MUST**:
- Operate entirely locally
- Generate files from templates
- Validate builds without network calls
- Point users to factoryapp.dev for launch

---

## Fee Split Policy

Fee split (shown on factoryapp.dev UI only):
- This repo does NOT handle fee routing
- This repo does NOT contain partner keys
- Fee information is shown on the factoryapp.dev UI

---

## Success Criteria

Local tooling works when:
- [x] `npm run generate "idea"` creates build prompts
- [x] `npm run validate` checks builds against ZIP_CONTRACT
- [x] `npm run zip` creates upload package
- [x] All commands point to factoryapp.dev for next steps
- [x] No server-side code in this repo
- [x] No API keys in this repo

---

**CONSTITUTION END**

This document defines the local tooling boundary for Web3 Factory. Server-side functionality (upload, token creation, deployment) lives on factoryapp.dev.
