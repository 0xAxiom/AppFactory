# How to Build a Base Mini App

This guide walks through building a Mini App for the Base ecosystem using miniapp-pipeline.

---

## What Is a Base Mini App?

Base Mini Apps are lightweight applications that run inside the Base app. They use MiniKit for platform integration and Next.js for rendering.

Key characteristics:

- Runs in Base app context
- Access to wallet and identity
- Frame-based distribution
- Social sharing features

---

## Prerequisites

- Node.js 18+
- Claude Code installed
- AppFactory repository cloned
- Vercel account (for deployment)
- Base app account (for testing)

---

## Step 1: Navigate to the Pipeline

```bash
cd /path/to/AppFactory/miniapp-pipeline
```

---

## Step 2: Start Claude

```bash
claude
```

---

## Step 3: Describe Your Mini App

```
Build a mini app for daily gratitude journaling where
users can share what they're grateful for with friends
```

Or:

```
Build a mini app for a simple poll/voting system
that users can share in their feed
```

---

## Step 4: Review and Approve

```
[PHASE 0: INTENT NORMALIZATION]

Upgrading "daily gratitude journaling" to:
"A social gratitude Mini App with:
- Daily gratitude entry (3 items)
- Public/private visibility toggle
- Friend feed with reactions
- Streak tracking
- Weekly reflection summaries
- Share to feed functionality
- Notification reminders"

[PHASE 1: PLANNING]

Milestones:
- M1: Scaffold Next.js with MiniKit
- M2: Create journal interface
- M3: Implement social features
- M4: Add streak/gamification
- M5: Polish and MiniKit integration
- M6: Generate manifest and documentation

Proceed? (yes/no)
```

---

## Step 5: Wait for Generation

```
[BUILDING]
M1: Scaffold ✓
M2: Journal UI ✓
M3: Social ✓
M4: Streaks ✓
M5: Polish ✓
M6: Manifest ✓

[RALPH QA]
Pass 1: 94%
Pass 2: 97% - PASS

BUILD COMPLETE
```

---

## Step 6: Find Your Output

```
miniapp-pipeline/builds/miniapps/<app-name>/app/
```

Note: The `app/` subdirectory contains the actual Next.js application.

---

## Step 7: Understand the Structure

```
builds/miniapps/<app-name>/
├── app/                      ← The Next.js application
│   ├── package.json
│   ├── next.config.js
│   ├── minikit.config.ts     ← MiniKit configuration
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── .well-known/
│   │   │       └── farcaster.json/route.ts  ← Manifest route
│   │   └── components/
│   └── public/
│       ├── icon.png          ← App icon (placeholder)
│       ├── splash.png        ← Splash screen
│       └── hero.png          ← Hero image
├── README.md
├── DEPLOYMENT.md             ← Deployment instructions
└── ACCOUNT_ASSOCIATION.md    ← Account linking guide
```

---

## Step 8: Configure MiniKit

Edit `minikit.config.ts`:

```typescript
export const minikitConfig = {
  appName: 'Gratitude Journal',
  appDescription: 'Share daily gratitude with friends',
  appIcon: '/icon.png',
  splashScreen: '/splash.png',
  heroImage: '/hero.png',
};
```

---

## Step 9: Replace Placeholder Assets

Replace these files in `public/`:

- `icon.png` - 512x512px app icon
- `splash.png` - 1200x630px splash screen
- `hero.png` - 1200x630px hero image

---

## Step 10: Run Locally

```bash
cd miniapp-pipeline/builds/miniapps/<app-name>/app
npm install
npm run dev
```

Open http://localhost:3000.

---

## Step 11: Deploy to Vercel

```bash
npx vercel
```

Note your deployment URL (e.g., `https://gratitude-journal.vercel.app`).

---

## Step 12: Complete Account Association

This is **required** for your app to work in Base.

### Generate Association Key

```bash
# In your app directory
npm run generate-association
```

This creates a key pair for signing.

### Add to Vercel Environment

1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add the generated environment variables

### Verify Association

Visit: `https://your-app.vercel.app/.well-known/farcaster.json`

You should see a valid JSON manifest with your account association.

See `ACCOUNT_ASSOCIATION.md` in your build for detailed instructions.

---

## Step 13: Submit to Base

1. Open the Base app
2. Navigate to Mini App submission
3. Enter your deployment URL
4. Submit for review

---

## MiniKit Features

Your generated app can use MiniKit features:

### Get User Identity

```typescript
import { useProfile } from '@base/minikit';

function UserGreeting() {
  const { profile } = useProfile();
  return <h1>Hello, {profile?.username}</h1>;
}
```

### Share to Feed

```typescript
import { useShare } from '@base/minikit';

function ShareButton() {
  const { share } = useShare();

  const handleShare = () => {
    share({
      text: "I'm grateful for...",
      url: window.location.href,
    });
  };

  return <button onClick={handleShare}>Share</button>;
}
```

### Wallet Actions

```typescript
import { useWallet } from '@base/minikit';

function WalletInfo() {
  const { address, isConnected } = useWallet();
  // ...
}
```

---

## Testing in Base App

### Option 1: Vercel Preview

Deploy a preview branch and test the URL in Base app.

### Option 2: Local Tunnel

```bash
npx localtunnel --port 3000
```

Use the generated URL for testing (works for development only).

---

## Common Issues

### "Manifest not found"

Ensure `src/app/.well-known/farcaster.json/route.ts` exists and returns valid JSON.

### "Account association failed"

1. Regenerate association keys
2. Redeploy to Vercel
3. Verify environment variables are set

### "App not loading in Base"

1. Check browser console for errors
2. Verify CORS headers are configured
3. Ensure HTTPS is working

---

## Checklist Before Submission

- [ ] Replace all placeholder images
- [ ] Test all features locally
- [ ] Deploy to Vercel
- [ ] Complete account association
- [ ] Verify manifest at `/.well-known/farcaster.json`
- [ ] Test in Base app
- [ ] Review content guidelines

---

## Next Steps

- [Preview Output](./preview-output.md) - Use the preview system
- [Build a dApp](./build-dapp.md) - Build a full web app
- [Troubleshooting](../TROUBLESHOOTING.md) - Problem solving

---

**Back to**: [Index](../index.md)
