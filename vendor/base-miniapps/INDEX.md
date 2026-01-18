# Base Mini Apps Documentation Cache

**Last Updated**: 2026-01-18
**Source**: https://docs.base.org/mini-apps/

## Purpose

This directory contains cached documentation from the official Base Mini Apps documentation. These files serve as reference material for the `miniapp-pipeline/` and ensure consistent, accurate implementation guidance even when network access is limited.

## Cached Documents

| File | Source URL | Description |
|------|-----------|-------------|
| `create-new-miniapp.md` | /mini-apps/quickstart/create-new-miniapp | Quickstart guide for creating a new mini app |
| `manifest.md` | /mini-apps/core-concepts/manifest | Manifest file specification and field reference |
| `sign-manifest.md` | /mini-apps/technical-guides/sign-manifest | Account association and signing process |
| `common-issues.md` | /mini-apps/troubleshooting/common-issues | Troubleshooting guide and common problems |
| `create-manifest-route.md` | /cookbook/minikit/create-manifest | Cookbook guide for manifest route implementation |

## Usage

When implementing Base Mini Apps through the `miniapp-pipeline/`:

1. Reference these docs for canonical field names and requirements
2. Use the manifest specification for validation
3. Follow the signing process exactly as documented
4. Check common issues when debugging

## Refresh Policy

These docs should be refreshed:
- When Base releases major updates to MiniKit
- When manifest specification changes
- When new required fields are added
- At minimum, quarterly

## Key Links

- **Base Build Preview Tool**: https://base.dev/preview
- **Account Association Tool**: https://base.dev (Build section)
- **MiniKit Repository**: https://github.com/base/demos
- **Discord Support**: https://discord.gg/buildonbase (#minikit channel)
