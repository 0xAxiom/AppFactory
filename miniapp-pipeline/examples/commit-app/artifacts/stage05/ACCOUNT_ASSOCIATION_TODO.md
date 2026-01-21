# Account Association - MANUAL STEP REQUIRED

## What This Does

Account association cryptographically proves you own this domain
and connects your mini app to your Farcaster account.

## Prerequisites

- [ ] App deployed to Vercel (Stage M4 complete)
- [ ] Vercel Deployment Protection disabled
- [ ] Base app account with connected wallet

## Steps

### 1. Open Base Build Tool

Go to: https://base.dev (Build section → Account Association)

### 2. Enter Your Domain

Paste your Vercel URL: `https://your-commit-app.vercel.app`

### 3. Submit and Verify

1. Click "Submit"
2. Click "Verify"
3. Sign the message with your wallet

### 4. Copy Generated Values

You'll receive three values:

- header
- payload
- signature

### 5. Update minikit.config.ts

```typescript
accountAssociation: {
  header: "PASTE_HEADER_HERE",
  payload: "PASTE_PAYLOAD_HERE",
  signature: "PASTE_SIGNATURE_HERE"
}
```

### 6. Deploy Update

```bash
git add minikit.config.ts
git commit -m "Add account association"
git push origin main
```

### 7. Verify

Visit: https://base.dev/preview
Enter your URL and check "Account Association" tab shows green checkmarks.

## Resume Pipeline

Once account association is complete, proceed to Stage M6.
