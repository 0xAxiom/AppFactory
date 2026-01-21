# Create Manifest Route

**Source**: https://docs.base.org/cookbook/minikit/create-manifest
**Cached**: 2026-01-18

## Overview

The manifest route exposes required metadata at `/.well-known/farcaster.json`, proving your Mini App's ownership and enabling discovery features within the Base App.

## Implementation

Create a Next.js route handler at `app/.well-known/farcaster.json/route.ts`:

```typescript
import { minikitConfig } from '@/minikit.config';

function withValidProperties(properties: Record<string, undefined | string | string[]>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
  );
}

export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL as string;

  return Response.json({
    accountAssociation: minikitConfig.accountAssociation,
    frame: withValidProperties({
      version: '1',
      name: minikitConfig.miniapp.name,
      subtitle: minikitConfig.miniapp.subtitle,
      description: minikitConfig.miniapp.description,
      screenshotUrls: minikitConfig.miniapp.screenshotUrls,
      iconUrl: minikitConfig.miniapp.iconUrl,
      splashImageUrl: minikitConfig.miniapp.splashImageUrl,
      splashBackgroundColor: minikitConfig.miniapp.splashBackgroundColor,
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: minikitConfig.miniapp.primaryCategory,
      tags: minikitConfig.miniapp.tags,
      heroImageUrl: minikitConfig.miniapp.heroImageUrl,
      tagline: minikitConfig.miniapp.tagline,
      ogTitle: minikitConfig.miniapp.ogTitle,
      ogDescription: minikitConfig.miniapp.ogDescription,
      ogImageUrl: minikitConfig.miniapp.ogImageUrl,
      noindex: process.env.NODE_ENV !== 'production',
    }),
  });
}
```

## Alternative: Environment Variables Approach

If you prefer configuration via environment variables:

```typescript
export async function GET() {
  const URL = process.env.NEXT_PUBLIC_URL as string;

  return Response.json({
    accountAssociation: {
      header: process.env.FARCASTER_HEADER,
      payload: process.env.FARCASTER_PAYLOAD,
      signature: process.env.FARCASTER_SIGNATURE,
    },
    frame: withValidProperties({
      version: '1',
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
      subtitle: process.env.NEXT_PUBLIC_APP_SUBTITLE,
      description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
      screenshotUrls: [],
      iconUrl: process.env.NEXT_PUBLIC_APP_ICON,
      splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE,
      splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY,
      tags: [],
      heroImageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
      tagline: process.env.NEXT_PUBLIC_APP_TAGLINE,
      ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE,
      ogDescription: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION,
      ogImageUrl: process.env.NEXT_PUBLIC_APP_OG_IMAGE,
      noindex: true, // Set to false for production
    }),
  });
}
```

## Configuration File: minikit.config.ts

```typescript
export const minikitConfig = {
  accountAssociation: {
    header: '', // Fill after signing
    payload: '', // Fill after signing
    signature: '', // Fill after signing
  },
  miniapp: {
    version: '1',
    name: 'Your App Name',
    subtitle: 'Brief tagline',
    description: 'Detailed description of your mini app',
    screenshotUrls: ['https://yourdomain.com/screenshots/1.png'],
    iconUrl: 'https://yourdomain.com/icon.png',
    splashImageUrl: 'https://yourdomain.com/splash.png',
    splashBackgroundColor: '#FFFFFF',
    homeUrl: 'https://yourdomain.com',
    webhookUrl: 'https://yourdomain.com/api/webhook',
    primaryCategory: 'social',
    tags: ['base', 'miniapp'],
    heroImageUrl: 'https://yourdomain.com/hero.png',
    tagline: 'Marketing tagline',
    ogTitle: 'Your App Name',
    ogDescription: 'Social sharing description',
    ogImageUrl: 'https://yourdomain.com/og.png',
  },
} as const;

export type MinikitConfig = typeof minikitConfig;
```

## Helper Function Explanation

The `withValidProperties` function filters out undefined or empty values:

```typescript
function withValidProperties(properties: Record<string, undefined | string | string[]>) {
  return Object.fromEntries(
    Object.entries(properties).filter(([_, value]) => (Array.isArray(value) ? value.length > 0 : !!value))
  );
}
```

**Purpose**: Ensures the manifest JSON only includes fields with actual values, preventing issues with undefined or empty fields.

## Directory Structure

```
app/
├── .well-known/
│   └── farcaster.json/
│       └── route.ts      # Manifest route handler
├── page.tsx              # Main app page
└── layout.tsx            # Root layout
minikit.config.ts         # Configuration file
```

## Verification

1. Start dev server: `npm run dev`
2. Visit: `http://localhost:3000/.well-known/farcaster.json`
3. Confirm valid JSON output with all expected fields
4. Deploy and verify production URL

## Key Points

- **Account Association**: Empty until you sign via Base Build
- **Property Filtering**: Removes undefined/empty values
- **noindex**: Set `true` during development to prevent indexing
- **URL Configuration**: Use `NEXT_PUBLIC_URL` for domain
- **Webhook**: Optional but recommended for notifications

## Common Patterns

### Dynamic URL Based on Environment

```typescript
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_URL) {
    return process.env.NEXT_PUBLIC_URL;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return 'http://localhost:3000';
};
```

### Conditional Webhook

```typescript
webhookUrl: process.env.ENABLE_WEBHOOKS === 'true'
  ? `${URL}/api/webhook`
  : undefined,
```
