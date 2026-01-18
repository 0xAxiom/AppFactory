# Stage M5: Account Association (MANUAL STEP)

## Purpose

Guide the user through the manual process of signing their manifest to establish account association.

## Why This Is Manual

Account association requires:
1. A deployed app (Stage M4)
2. The user's wallet signature
3. Access to their Farcaster account

This cannot be automated - the user must sign with their own wallet.

## Input

- Deployed app URL from Stage M4
- User has Base app account with wallet

## Pipeline Behavior

**The pipeline PAUSES at this stage.**

1. Generate `ACCOUNT_ASSOCIATION_TODO.md`
2. Inform user they must complete manual steps
3. Provide clear instructions
4. Wait for user to update `minikit.config.ts`
5. Resume when account association fields are populated

## Resume Condition

Check `minikit.config.ts`:
```typescript
accountAssociation: {
  header: "",   // Must be non-empty
  payload: "",  // Must be non-empty
  signature: "" // Must be non-empty
}
```

If all three fields have non-empty string values, the stage is complete.

## Output

File: `artifacts/stage05/ACCOUNT_ASSOCIATION_TODO.md`

```markdown
# Account Association - MANUAL STEP REQUIRED

## What is Account Association?

Account association cryptographically proves:
1. **You own this domain** - The app at this URL is yours
2. **You control this Farcaster account** - Your identity is verified
3. **The app is authorized** - Base can trust your manifest

Without it, your mini app won't be recognized by Base.

---

## Prerequisites

Before starting, ensure:
- [ ] App is deployed to Vercel (Stage M4)
- [ ] Vercel Deployment Protection is disabled
- [ ] You can access `https://[your-domain]/.well-known/farcaster.json`
- [ ] You have a Base app account with a connected wallet

---

## Instructions

### Step 1: Open Base Build Tool

Go to: **https://base.dev**

Navigate to the **Build** section, then **Account Association** tool.

(Alternative: Use Farcaster's tool at https://farcaster.xyz/developers → Manifest Tool)

### Step 2: Enter Your Domain

In the "App URL" field, enter your Vercel URL:
```
https://[your-project].vercel.app
```

**Important:**
- Include `https://`
- Do NOT include trailing slash
- Use your production URL (not localhost)

### Step 3: Submit and Verify

1. Click **"Submit"**
   - The tool fetches your manifest
   - If it fails, check Deployment Protection is disabled

2. Click **"Verify"**
   - You'll be prompted to sign with your wallet
   - This signature proves you own the domain

3. **Sign the message** in your wallet
   - The message confirms your domain ownership
   - This is safe - you're not approving any transactions

### Step 4: Copy Generated Values

After signing, you'll see three values:
- **header**: A base64-encoded string
- **payload**: A base64-encoded string
- **signature**: A hex string starting with 0x

Copy each value exactly as shown.

### Step 5: Update minikit.config.ts

Open `minikit.config.ts` in your project and update:

```typescript
export const minikitConfig = {
  accountAssociation: {
    header: "PASTE_HEADER_HERE",
    payload: "PASTE_PAYLOAD_HERE",
    signature: "PASTE_SIGNATURE_HERE"
  },
  miniapp: {
    // ... rest of config unchanged
  }
} as const;
```

**Example with real values:**
```typescript
accountAssociation: {
  header: "eyJmaWQiOjEyMzQ1Njc4OTAsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgxMjM0In0",
  payload: "eyJkb21haW4iOiJteWFwcC52ZXJjZWwuYXBwIn0",
  signature: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
}
```

### Step 6: Deploy the Update

```bash
git add minikit.config.ts
git commit -m "Add account association credentials"
git push origin main
```

Vercel will automatically redeploy.

### Step 7: Verify in Preview Tool

Go to: **https://base.dev/preview**

1. Enter your app URL
2. Check the **Account Association** tab
3. You should see **three green checkmarks**

If you see errors:
- Verify all three values are copied correctly
- Make sure you redeployed after updating
- Check that the domain matches exactly

---

## Troubleshooting

### "Manifest not found"
- Deployment Protection may still be enabled
- Check URL is exactly correct
- Verify manifest returns JSON, not HTML

### "Invalid signature"
- Values may be incorrectly copied
- Try regenerating the association
- Ensure you signed with the right wallet

### "Domain mismatch"
- The domain in your manifest must match deployment
- Check `NEXT_PUBLIC_URL` environment variable
- Redeploy if you made changes

### Preview tool shows red X
- Check the specific error message
- Usually indicates incorrect/missing values
- Review each step above

---

## Resume Pipeline

Once you've completed all steps:

1. Account association values are in `minikit.config.ts`
2. Changes are deployed to Vercel
3. Preview tool shows green checkmarks

The pipeline will verify the association fields are populated and proceed to Stage M6.

---

## Security Notes

- Your signature proves ownership, nothing more
- You're not granting any special permissions
- The signature is specific to this domain
- If you change domains, you need to re-sign
```

## Validation Script

The pipeline should check:

```typescript
// scripts/check_account_association.ts
import { minikitConfig } from '../minikit.config';

const { header, payload, signature } = minikitConfig.accountAssociation;

if (!header || !payload || !signature) {
  console.error('Account association incomplete');
  console.error('header:', header ? '✓' : '✗ missing');
  console.error('payload:', payload ? '✓' : '✗ missing');
  console.error('signature:', signature ? '✓' : '✗ missing');
  process.exit(1);
}

console.log('Account association complete ✓');
process.exit(0);
```

## Pipeline Gate

This stage has a **soft gate**:

1. If association is incomplete:
   - Output reminder message
   - Provide `ACCOUNT_ASSOCIATION_TODO.md` path
   - Do not proceed to Stage M6

2. If association is complete:
   - Log success
   - Proceed to Stage M6

## Next Stage

After user completes manual steps and association is verified, proceed to Stage M6 (Preview Tool Validation).
