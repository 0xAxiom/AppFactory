# Deployment Guide

## Prerequisites

- Vercel account
- GitHub repository with the app code
- CDP API key from https://portal.cdp.coinbase.com/

## Steps

### 1. Push to GitHub

```bash
cd commit-app/app
git init
git add .
git commit -m "Initial Commit app scaffold"
git remote add origin https://github.com/YOUR_USERNAME/commit-app.git
git push -u origin main
```

### 2. Import to Vercel

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Keep default settings for Next.js
4. Click Deploy

### 3. Configure Environment Variables

In Vercel project settings → Environment Variables:

| Variable                              | Value                       |
| ------------------------------------- | --------------------------- |
| `NEXT_PUBLIC_URL`                     | https://your-app.vercel.app |
| `NEXT_PUBLIC_ONCHAINKIT_API_KEY`      | Your CDP API key            |
| `NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME` | Commit                      |

### 4. CRITICAL: Disable Deployment Protection

1. Go to Settings → Deployment Protection
2. Set to "None" or disable for production
3. This allows Base to access `/.well-known/farcaster.json`

### 5. Verify Deployment

Visit: `https://your-app.vercel.app/.well-known/farcaster.json`

Confirm valid JSON response with all manifest fields.

## Next Step

Proceed to Stage M5: Account Association
