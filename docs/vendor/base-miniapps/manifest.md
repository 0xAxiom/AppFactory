# Base Mini Apps Manifest Specification

**Source**: https://docs.base.org/mini-apps/core-concepts/manifest
**Cached**: 2026-01-18

## Overview

The manifest file (`farcaster.json`) defines how a mini app appears and functions within the Base app. It controls search, discovery, and rich embed features.

## File Location

The manifest must be accessible at:

```
https://yourdomain.com/.well-known/farcaster.json
```

## Complete Manifest Structure

```json
{
  "accountAssociation": {
    "header": "<generated-header>",
    "payload": "<generated-payload>",
    "signature": "<generated-signature>"
  },
  "frame": {
    "version": "1",
    "name": "App Name",
    "subtitle": "Brief tagline",
    "description": "Detailed description",
    "tagline": "Marketing tagline",
    "iconUrl": "https://domain.com/icon.png",
    "splashImageUrl": "https://domain.com/splash.png",
    "splashBackgroundColor": "#FFFFFF",
    "homeUrl": "https://domain.com",
    "webhookUrl": "https://domain.com/api/webhook",
    "primaryCategory": "social",
    "tags": ["tag1", "tag2"],
    "heroImageUrl": "https://domain.com/hero.png",
    "screenshotUrls": ["https://domain.com/screenshot1.png", "https://domain.com/screenshot2.png"],
    "ogTitle": "OG Title",
    "ogDescription": "OG Description",
    "ogImageUrl": "https://domain.com/og.png",
    "noindex": false
  }
}
```

## Field Reference

### Account Association (Required)

Proves domain ownership through cryptographic verification.

| Field     | Type   | Description                |
| --------- | ------ | -------------------------- |
| header    | string | Encoded association header |
| payload   | string | Encoded domain payload     |
| signature | string | Cryptographic signature    |

Generated via Base Build's Account Association tool.

### Identity Fields (Required)

| Field   | Type   | Constraints                    | Description                |
| ------- | ------ | ------------------------------ | -------------------------- |
| version | string | Must be "1"                    | Manifest version           |
| name    | string | Max 32 chars                   | App name displayed in Base |
| homeUrl | string | HTTPS, max 1024 chars          | Default launch URL         |
| iconUrl | string | PNG 1024×1024, no transparency | App icon                   |

### Loading Experience (Required)

| Field                 | Type   | Constraints            | Description            |
| --------------------- | ------ | ---------------------- | ---------------------- |
| splashImageUrl        | string | ~200×200px recommended | Loading screen image   |
| splashBackgroundColor | string | Hex format (#RRGGBB)   | Background during load |

### Discovery & Search (Required)

| Field           | Type     | Constraints                                        | Description              |
| --------------- | -------- | -------------------------------------------------- | ------------------------ |
| primaryCategory | string   | See category list                                  | Main classification      |
| tags            | string[] | Max 5, ≤20 chars each, lowercase, no spaces/emojis | Searchable tags          |
| noindex         | boolean  | Default: false                                     | Set true for dev/staging |

### Display Information (Required)

| Field          | Type     | Constraints                 | Description       |
| -------------- | -------- | --------------------------- | ----------------- |
| subtitle       | string   | Max 30 chars                | Text under name   |
| description    | string   | Max 170 chars               | Promo text        |
| tagline        | string   | Max 30 chars                | Marketing tagline |
| heroImageUrl   | string   | 1200×630px (1.91:1 ratio)   | Hero graphic      |
| screenshotUrls | string[] | Max 3, 1284×2778px portrait | App screenshots   |

### Notifications (Optional)

| Field      | Type   | Constraints           | Description              |
| ---------- | ------ | --------------------- | ------------------------ |
| webhookUrl | string | HTTPS, max 1024 chars | POST endpoint for events |

### Social Sharing (Optional)

| Field         | Type   | Constraints         | Description      |
| ------------- | ------ | ------------------- | ---------------- |
| ogTitle       | string | Max 30 chars        | Open Graph title |
| ogDescription | string | Max 100 chars       | OG description   |
| ogImageUrl    | string | 1200×630px (1.91:1) | OG image         |

## Valid Categories

```
games
social
finance
utility
productivity
health-fitness
news-media
music
shopping
education
developer-tools
entertainment
art-creativity
```

## Image Specifications

| Asset       | Dimensions  | Format  | Notes                       |
| ----------- | ----------- | ------- | --------------------------- |
| Icon        | 1024×1024px | PNG     | No transparency             |
| Splash      | ~200×200px  | PNG/JPG | Centered on background      |
| Hero        | 1200×630px  | PNG/JPG | 1.91:1 aspect ratio         |
| Screenshots | 1284×2778px | PNG/JPG | Portrait orientation, max 3 |
| OG Image    | 1200×630px  | PNG/JPG | 1.91:1 aspect ratio         |

## Key Constraints

- All image URLs must use HTTPS
- Tags must be lowercase, no special characters or emojis
- Character limits are strictly enforced
- Manifest changes take effect only after redeployment
- Farcaster clients cache manifest data for up to 24 hours

## Validation

Test your manifest:

1. Visit `https://yourdomain.com/.well-known/farcaster.json`
2. Use Base Build Preview tool at `base.dev/preview`
3. Check JSON syntax with JSONLint
