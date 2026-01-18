# Base Mini Apps Troubleshooting Guide

**Source**: https://docs.base.org/mini-apps/troubleshooting/common-issues
**Cached**: 2026-01-18

## Quick Diagnostic

| Symptom | Likely Cause | Solution Section |
|---------|--------------|------------------|
| App not in search | Missing manifest fields | App Discovery |
| Embed not rendering | Missing meta tag | Embed Rendering |
| Wallet won't connect | Wrong connection method | Wallet Connection |
| App closes unexpectedly | Gesture conflicts | Gesture Conflicts |
| Changes not visible | Manifest caching | Caching Issues |
| Flagged as unsafe | Security detection | Safety Flagging |

## App Discovery & Indexing Issues

### Problem: Mini App doesn't appear in search results or catalogs

**Root Cause**: Missing or incomplete manifest configuration

**Solutions**:

1. **Check required fields**:
   - `primaryCategory` (required for searchability)
   - `accountAssociation` (required for verification)

2. **Trigger indexing**:
   - Share your Mini App URL in a post
   - Indexing takes ~10 minutes after sharing

3. **Cache refresh**:
   - Farcaster clients cache manifest for up to 24 hours
   - Re-share URL to refresh cached data

## Manifest Configuration Problems

### Image Display Issues

**Checklist**:
- [ ] Test image URLs in incognito mode (ensure public access)
- [ ] Verify supported formats: PNG, JPG, WebP
- [ ] Confirm HTTPS URLs only (HTTP will fail)
- [ ] Check image dimensions match requirements

**Image Specifications**:
| Asset | Dimensions | Format |
|-------|-----------|--------|
| Icon | 1024×1024px | PNG (no transparency) |
| Splash | ~200×200px | PNG/JPG |
| Hero | 1200×630px | PNG/JPG |
| Screenshots | 1284×2778px | PNG/JPG (portrait) |

### Required Manifest Structure

```json
{
  "accountAssociation": {
    "header": "...",
    "payload": "...",
    "signature": "..."
  },
  "frame": {
    "version": "1",
    "name": "App Name",
    "iconUrl": "https://...",
    "homeUrl": "https://...",
    "imageUrl": "https://...",
    "buttonTitle": "Launch",
    "description": "Max 130 chars",
    "primaryCategory": "social",
    "tags": ["tag1", "tag2"]
  }
}
```

## Embed Rendering Issues

### Problem: Mini App URLs don't render as rich embeds when shared

**Solution**: Add the `fc:frame` meta tag in your `<head>`:

```html
<meta name="fc:frame" content="..." />
```

**Validation**: Use Base Build's Embed Tool to test rendering.

## Wallet Connection Problems

### Best Practice

Use the user's connected wallet via OnchainKit or Wagmi hooks for cryptographically verified addresses.

```typescript
import { useAccount } from 'wagmi';

function MyComponent() {
  const { address, isConnected } = useAccount();

  if (!isConnected) {
    return <p>Please connect wallet</p>;
  }

  return <p>Connected: {address}</p>;
}
```

**Warning**: Never rely on URL parameters for wallet addresses - always use the cryptographically verified connection.

## Gesture Conflicts & App Dismissal

### Problem: App closes unexpectedly during swipe/drag interactions

**Solution**: Disable native gestures when implementing custom interactions:

```typescript
await sdk.actions.ready({ disableNativeGestures: true });
```

**When to use**: Any app with swipe gestures, drag-and-drop, or custom touch interactions.

## Mobile Testing & Debugging

### Setting Up Eruda Console

For mobile debugging, use Eruda (only in development):

```typescript
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  import('eruda').then(eruda => eruda.default.init());
}
```

### Mobile Testing Workflow

1. Deploy to production or use ngrok for local testing
2. Share mini app URL in Farcaster DM to yourself
3. Open in mobile client (Base App or Farcaster)
4. Use Eruda console for debugging

### Mobile Testing Checklist

- [ ] App loads correctly on mobile
- [ ] Touch interactions work properly
- [ ] Viewport sizes correctly
- [ ] All images display
- [ ] Console shows no critical errors
- [ ] Wallet connection works
- [ ] Gestures don't conflict with native behaviors

## Caching Issues

### Problem: Manifest changes not reflected

**Cause**: Farcaster clients cache manifests for up to 24 hours

**Solutions**:
1. Wait for cache expiration
2. Re-share your app URL to trigger refresh
3. Use `noindex: true` during development

## Safety Flagging

### Problem: App flagged as unsafe by Blockaid

**Resolution Steps**:

1. Navigate to [Blockaid Reporting Portal](https://blockaid.io)
2. Submit report as "mistake" or "developer"
3. Follow Blockaid's resolution instructions
4. Contact Base Discord support if unresolved

## Debugging Tools

### Prerequisites Checklist

- [ ] Domain accessible via HTTPS
- [ ] Manifest at `/.well-known/farcaster.json`
- [ ] All image URLs publicly accessible
- [ ] Valid JSON syntax

### Base Build Preview Tool

URL: https://base.dev/preview

Features:
- Manifest validation
- Metadata verification
- Account association check
- Visual rendering preview

### Validation Steps

1. Test manifest: `curl https://yourdomain.com/.well-known/farcaster.json`
2. Validate JSON: Use JSONLint
3. Check console for errors
4. Verify all URLs are accessible

## Additional Resources

- **CBW Validator Tool**: Coinbase Wallet compatibility analysis
- **Eruda**: https://github.com/nickolasliao/eruda - Mobile debugging
- **Base Discord**: #minikit channel for community support
