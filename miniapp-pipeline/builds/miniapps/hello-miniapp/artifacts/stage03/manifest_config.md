# Manifest Configuration

## Generated: 2026-01-18
## Slug: hello-miniapp

## Values Applied

### Identity
| Field | Value | Char Count | Max |
|-------|-------|-----------|-----|
| name | Hello Mini App | 14 | 32 |
| subtitle | Your first Base mini app | 24 | 30 |
| tagline | Your first Base mini app | 24 | 30 |
| description | A simple example mini app demonstrating the MiniApp Pipeline. Say hello to the Base ecosystem! | 95 | 170 |

### Discovery
| Field | Value |
|-------|-------|
| primaryCategory | utility |
| tags | hello, example, starter, base |

### Branding
| Field | Value |
|-------|-------|
| splashBackgroundColor | #3B82F6 |

### Assets
| Asset | Path | Dimensions |
|-------|------|-----------|
| Icon | /icon.png | 1024x1024 |
| Splash | /splash.png | 200x200 |
| Hero | /hero.png | 1200x630 |
| OG Image | /og.png | 1200x630 |
| Screenshot 1 | /screenshots/1.png | 1284x2778 |

## Manifest Preview

The manifest is served at `/.well-known/farcaster.json`:

```json
{
  "accountAssociation": {
    "header": "eyJmaWQiOjEyMzQ1...",
    "payload": "eyJkb21haW4iOiJoZWxsby1taW5pYXBwLnZlcmNlbC5hcHAifQ",
    "signature": "0x0000..."
  },
  "frame": {
    "version": "1",
    "name": "Hello Mini App",
    "subtitle": "Your first Base mini app",
    "description": "A simple example mini app...",
    "primaryCategory": "utility",
    "tags": ["hello", "example", "starter", "base"],
    "iconUrl": "https://hello-miniapp.vercel.app/icon.png",
    "splashImageUrl": "https://hello-miniapp.vercel.app/splash.png",
    "splashBackgroundColor": "#3B82F6",
    "homeUrl": "https://hello-miniapp.vercel.app",
    "heroImageUrl": "https://hello-miniapp.vercel.app/hero.png",
    "screenshotUrls": ["https://hello-miniapp.vercel.app/screenshots/1.png"]
  }
}
```

## Validation Checklist

- [x] All character limits respected
- [x] Category is valid
- [x] Tags are properly formatted
- [x] All asset files exist (placeholders)
- [x] Asset dimensions are correct
- [x] Manifest route returns valid JSON
- [x] accountAssociation fields present (example values)

## Next Step

Proceed to Stage M4 (Vercel Deployment Plan)
