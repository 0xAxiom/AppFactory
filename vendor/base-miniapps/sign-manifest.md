# Signing Your Mini App Manifest

**Source**: https://docs.base.org/mini-apps/technical-guides/sign-manifest
**Cached**: 2026-01-18

## Overview

Every Mini App requires a signed `farcaster.json` manifest to be recognized by Farcaster clients. Signing produces an **Account Association** that cryptographically proves your Farcaster account owns and can publish the app.

## Prerequisites

- A deployed application accessible via HTTPS
- A Base app account with a connected wallet
- Manifest file accessible at `https://yourdomain.com/.well-known/farcaster.json`

## Account Association Structure

The signed manifest includes three components:

```json
{
  "accountAssociation": {
    "header": "<encoded-header>",
    "payload": "<encoded-payload>",
    "signature": "<cryptographic-signature>"
  }
}
```

| Field | Description |
|-------|-------------|
| header | Generated metadata for the signature |
| payload | Encoded manifest/domain data being signed |
| signature | Cryptographic proof of ownership |

## Signing Methods

### Method 1: Base Build Tool (Recommended)

1. Sign in to Base with your account
2. Navigate to **Preview → Account Association**
3. Enter your Mini App domain in the "App URL" field
4. Click **Submit**
5. Click **Verify**
6. Sign the message in your wallet when prompted
7. Copy the generated `accountAssociation` object
8. Paste into your `farcaster.json` or `minikit.config.ts`
9. Redeploy to production

**Success indicator**: Three green checkmarks appear after verification.

### Method 2: Farcaster Manifest Tool

1. Log in to farcaster.xyz
2. Navigate to **Developers → Manifest Tool**
3. Enter your domain (exclude `https://` and trailing slashes)
4. Click **Refresh** to fetch your app
5. Click **Generate Account Association**
6. Copy the generated object
7. Paste into your manifest
8. Redeploy application

## Implementation Example

### Using minikit.config.ts

```typescript
export const minikitConfig = {
  accountAssociation: {
    header: "eyJmaWQiOjEyMzQ1Njc4OTAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgxMjM0NTY3ODkwYWJjZGVmIn0",
    payload: "eyJkb21haW4iOiJ5b3VyYXBwLmNvbSJ9",
    signature: "MHgxMjM0NTY3ODkwYWJjZGVmMTIzNDU2Nzg5MGFiY2RlZjEyMzQ1Njc4OTBhYmNkZWYxMjM0NTY3ODkwYWJjZGVm"
  },
  miniapp: {
    version: "1",
    name: "Your App",
    // ... rest of config
  }
} as const;
```

### Direct farcaster.json

```json
{
  "accountAssociation": {
    "header": "<your-header>",
    "payload": "<your-payload>",
    "signature": "<your-signature>"
  },
  "frame": {
    "version": "1",
    "name": "Your App",
    "iconUrl": "https://yourapp.com/icon.png",
    "homeUrl": "https://yourapp.com",
    "canonicalDomain": "yourapp.com",
    "requiredChains": ["eip155:8453"],
    "requiredCapabilities": ["actions.ready", "actions.signIn"]
  }
}
```

## Key Requirements

| Requirement | Description |
|-------------|-------------|
| Domain Match | Domain in manifest must match deployment URL |
| HTTPS Required | App must be served over HTTPS |
| Public Access | Manifest must be publicly accessible (disable Vercel protection) |
| Wallet Signature | Must sign with wallet connected to your Farcaster account |

## Common Issues

### "Manifest not found"
- Ensure `/.well-known/farcaster.json` returns valid JSON
- Check that Vercel Deployment Protection is disabled

### "Invalid signature"
- Regenerate the account association
- Ensure you're signing with the correct wallet

### "Domain mismatch"
- `canonicalDomain` must match your actual domain
- Don't include `https://` or trailing slashes

## Verification Checklist

- [ ] Manifest accessible at `/.well-known/farcaster.json`
- [ ] Valid JSON format (no syntax errors)
- [ ] `accountAssociation` object present with all three fields
- [ ] All fields are non-empty strings
- [ ] Domain matches deployment URL
- [ ] Vercel Deployment Protection disabled

## Tools

- **Base Build Preview**: https://base.dev/preview
- **Farcaster Manifest Tool**: https://farcaster.xyz/developers
- **JSON Validator**: https://jsonlint.com
