# Create a New Base Mini App

**Source**: https://docs.base.org/mini-apps/quickstart/create-new-miniapp
**Cached**: 2026-01-18

## Overview

Base Mini Apps are applications that run inside the Base app, built with Next.js and MiniKit. This guide covers the complete workflow from template deployment to publication.

## Prerequisites

- Base app account
- Vercel account for hosting
- Node.js installed locally

## Step-by-Step Process

### Step 1: Deploy Template to Vercel

Deploy the quickstart template to Vercel:

1. Visit the Vercel deployment link for the `base/demos` repository (mini-apps/templates/minikit branch)
2. Follow prompts to create your project
3. Vercel creates a GitHub repository in your account

### Step 2: Clone Repository Locally

```bash
git clone https://github.com/<your-username>/new-mini-app-quickstart
cd new-mini-app-quickstart
npm install
```

### Step 3: Update Manifest Configuration

The `minikit.config.ts` file manages your manifest and embed metadata. Configure the `miniapp` object:

```typescript
export const minikitConfig = {
  accountAssociation: {
    header: '',
    payload: '',
    signature: '',
  },
  miniapp: {
    version: '1',
    name: 'Your App Name',
    subtitle: 'Brief tagline',
    description: 'Detailed description of your mini app',
    screenshotUrls: ['https://yourdomain.com/screenshots/1.png', 'https://yourdomain.com/screenshots/2.png'],
    iconUrl: 'https://yourdomain.com/icon.png',
    splashImageUrl: 'https://yourdomain.com/splash.png',
    splashBackgroundColor: '#FFFFFF',
    homeUrl: 'https://yourdomain.com',
    webhookUrl: 'https://yourdomain.com/api/webhook',
    primaryCategory: 'social',
    tags: ['base', 'miniapp'],
    heroImageUrl: 'https://yourdomain.com/hero.png',
    ogTitle: 'Your App Name',
    ogDescription: 'Social sharing description',
    ogImageUrl: 'https://yourdomain.com/og.png',
  },
} as const;
```

### Step 4: Create Account Association Credentials

This step proves you own the domain:

1. Push changes to `main` branch
2. **IMPORTANT**: Disable Vercel's "Deployment Protection" (Settings → Deployment Protection)
3. Go to Base Build's Account Association tool
4. Paste your domain in "App URL" field
5. Click "Submit", then "Verify"
6. Sign with your wallet
7. Copy the generated `accountAssociation` object

The result contains three fields:

- `header`: Encoded association header
- `payload`: Encoded domain payload
- `signature`: Cryptographic signature

### Step 5: Update Configuration with Credentials

Add the generated values to `minikit.config.ts`:

```typescript
export const minikitConfig = {
  accountAssociation: {
    header: "[your-generated-header]",
    payload: "[your-generated-payload]",
    signature: "[your-generated-signature]"
  },
  miniapp: { ... }
} as const;
```

### Step 6: Deploy to Production

Push all changes to `main` branch. Vercel automatically deploys.

### Step 7: Validate Your App

Visit `base.dev/preview` to test:

- **Embeds Tab**: View embed renders, verify launch works
- **Account Association Tab**: Confirm credentials are valid
- **Metadata Tab**: Review manifest fields, identify gaps

### Step 8: Publish

Create a post within the Base app containing your app's URL. This makes it discoverable.

## Configuration Reference

### Required Manifest Fields

| Field                 | Type     | Constraints                    |
| --------------------- | -------- | ------------------------------ |
| version               | string   | Must be "1"                    |
| name                  | string   | Max 32 chars                   |
| homeUrl               | string   | HTTPS, max 1024 chars          |
| iconUrl               | string   | PNG 1024×1024, no transparency |
| splashImageUrl        | string   | ~200×200px                     |
| splashBackgroundColor | string   | Hex color                      |
| primaryCategory       | string   | See category list              |
| tags                  | string[] | Max 5, ≤20 chars each          |
| subtitle              | string   | Max 30 chars                   |
| description           | string   | Max 170 chars                  |
| heroImageUrl          | string   | 1200×630px (1.91:1)            |
| screenshotUrls        | string[] | Max 3, 1284×2778px portrait    |

### Valid Categories

- games
- social
- finance
- utility
- productivity
- health-fitness
- news-media
- music
- shopping
- education
- developer-tools
- entertainment
- art-creativity

## Next Steps

- Review [Manifest Documentation](./manifest.md)
- Learn about [Signing](./sign-manifest.md)
- Check [Common Issues](./common-issues.md)
