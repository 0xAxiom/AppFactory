# Upstream Repository Provenance

## Source Repository

- **URL**: https://github.com/base/demos
- **Branch**: master
- **Commit SHA**: 84caae0a337e2ca95f6c5d3e5e822900bb2d0f9a
- **Commit Short**: 84caae0a
- **Vendored Date**: 2026-01-18 19:54:49 UTC

## Purpose

This upstream clone is vendored as a read-only reference for the `miniapp-pipeline/` in App Factory. It provides:

- Official Base Mini App templates
- MiniKit integration patterns
- Farcaster manifest examples
- OnchainKit usage patterns

## Important Notes

- **DO NOT EDIT** files in `_upstream/base-demos/` - they are reference copies
- Selected, curated content is extracted to `selected/` with modifications documented
- To update: delete `_upstream/base-demos/`, re-clone, update this file with new SHA

## License

The upstream repository is MIT licensed. See `_upstream/base-demos/LICENSE` for details.

## Refresh Instructions

```bash
cd vendor/base-demos
rm -rf _upstream/base-demos
git clone --depth 50 https://github.com/base/demos.git _upstream/base-demos
# Update this file with new commit SHA and date
```
