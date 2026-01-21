# Base Mini App Compatibility Validator

A read-only validation tool that scans mini app codebases to identify patterns that are not supported in Base app.

## What it does

This validator searches your mini app code for specific patterns that work in other environments (like Farcaster frames) but are not supported in Base app, helping ensure compatibility before deployment.

## What it checks for

- **Environment Detection**: `isInMiniApp()` calls
- **Haptics**: Haptic feedback API usage
- **Warpcast Composer URLs**: Direct links to Warpcast compose
- **Token Operations**: `swapToken`, `viewToken`, `sendToken` actions
- **Direct HTML Links**: `<a href>` tags and external links
- **Location Context**: Context location properties
- **SDK Ready Call**: Required `sdk.actions.ready()` implementation

## How it works

1. Scans application code in `/app/`, `/src/`, `/components/`, `/pages/` directories
2. Excludes third-party code (`/node_modules/`, `/.next/`, etc.)
3. Reports exact file locations and line numbers for unsupported patterns
4. Provides compatibility notes for each issue found

## Output

The validator provides a simple report listing any compatibility issues found, or confirms when no unsupported patterns are detected.

---

_This is a read-only validator - it only reports findings and does not modify code or suggest fixes._
