# Stage M3: Manifest Configuration

## Manifest Values

| Field | Value |
|-------|-------|
| name | Commit |
| subtitle | Stake ETH on your goals |
| description | Set goals, stake crypto, get an accountability partner. Complete your goal and get your stake back. Fail and lose it. |
| tagline | Put your money where your mouth is |
| primaryCategory | productivity |
| tags | goals, accountability, staking, productivity, social |
| splashBackgroundColor | #0A0A0A |

## Asset Configuration

| Asset | Path | Dimensions |
|-------|------|------------|
| Icon | /icon.png | 1024x1024 |
| Splash | /splash.png | 200x200 |
| Hero | /hero.png | 1200x630 |
| OG Image | /og.png | 1200x630 |
| Screenshot 1 | /screenshots/1.png | 1284x2778 |
| Screenshot 2 | /screenshots/2.png | 1284x2778 |
| Screenshot 3 | /screenshots/3.png | 1284x2778 |

## Account Association

**Status**: PENDING

Account association values must be filled after deployment:
- Deploy to Vercel
- Visit https://base.dev (Build → Account Association)
- Sign with Farcaster wallet
- Update `minikit.config.ts` with header, payload, signature

## Manifest Endpoint

Route: `/.well-known/farcaster.json`
Implementation: Uses `withValidManifest` from OnchainKit

Ready for Stage M4: Vercel Deployment Plan.
