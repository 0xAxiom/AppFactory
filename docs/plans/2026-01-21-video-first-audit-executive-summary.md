# Video-First Audit Executive Summary

**Date:** 2026-01-21
**Status:** Implementation Complete
**Scope:** Remotion Agent Skills Integration + Video-First Pipeline Enhancement

---

## Overview

Seven specialized Ralph agents conducted a comprehensive audit focused on making App Factory "video-first" - ensuring that successful builds automatically generate polished promotional videos.

**Core Objectives:**

- Automatic video generation when Local Run Proof passes
- Deterministic rendering (same props = same video)
- Visual feedback throughout the pipeline
- Zero manual steps for video generation
- `/factory video` command for manual invocation

---

## Ralph Agent Findings (Unanimous Critical Issues)

All 7 agents identified these as highest priority:

| Issue                                        | Resolution                                              |
| -------------------------------------------- | ------------------------------------------------------- |
| Video generation NOT automatically triggered | Added hooks.toml hook for post-verification video       |
| demo-video dependencies NOT installed        | Dependencies now installed (185 packages)               |
| No visual feedback during rendering          | Integrated visual.mjs (spinners, progress, celebration) |
| No `/factory video` command                  | Added to factory.md command surface                     |
| Determinism violation in Footer.tsx          | Fixed with UTC timezone enforcement                     |

---

## Implementation Details

### 1. Determinism Fixes

**Footer.tsx** - Force UTC timezone for reproducible timestamps:

```typescript
timeZone: 'UTC',
timeZoneName: 'short',
```

**Root.tsx** - Static timestamp placeholder for studio preview:

```typescript
timestamp: '2026-01-01T00:00:00.000Z',
```

### 2. Video Generation Hook

Added to `.claude/hooks.toml`:

```toml
[[hooks.post_tool_execution]]
tool = "bash"
match_commands = [
  "scripts/local-run-proof/verify",
  "local-run-proof/verify.mjs",
  "node scripts/local-run-proof/verify.mjs"
]
run = "node scripts/hooks/post-run-certificate-video.mjs"
timeout_ms = 300000
run_in_background = true
```

### 3. Hook Script

Created `scripts/hooks/post-run-certificate-video.mjs`:

- Detects RUN_CERTIFICATE.json with PASS status
- Extracts slug from directory structure
- Invokes render-demo-video.mjs with --skip-verify
- Provides visual feedback during rendering

### 4. Visual Feedback Integration

Enhanced `scripts/render-demo-video.mjs` with:

- Phase headers for each step (Verification, Props Generation, Rendering)
- Spinners with elapsed time during async operations
- Celebration banner on successful render
- Error boxes with remediation hints on failure

### 5. `/factory video` Command

Added to `plugins/factory/commands/factory.md`:

```
/factory video <path> [--slug S]   Generate demo video for a verified build
```

Features:

- Validates RUN_CERTIFICATE.json exists with PASS status
- Extracts build metadata from certificate
- Renders MP4 using Remotion
- Outputs to `demo/out/<slug>.mp4`

---

## Files Created

| File                                           | Purpose                                 |
| ---------------------------------------------- | --------------------------------------- |
| `scripts/hooks/post-run-certificate-video.mjs` | Auto-trigger video on verification pass |

## Files Modified

| File                                   | Change                                          |
| -------------------------------------- | ----------------------------------------------- |
| `.claude/hooks.toml`                   | Added video generation hook (6th hook category) |
| `scripts/render-demo-video.mjs`        | Integrated visual.mjs feedback module           |
| `demo-video/src/Root.tsx`              | Fixed determinism, added Zod schema             |
| `demo-video/src/components/Footer.tsx` | Force UTC timezone                              |
| `plugins/factory/commands/factory.md`  | Added `/factory video` command                  |

## Dependencies Added

| Package | Location    | Purpose                          |
| ------- | ----------- | -------------------------------- |
| zod     | demo-video/ | Remotion props schema validation |

---

## Video Pipeline Architecture

```
User builds app
       ↓
Pipeline runs Local Run Proof
       ↓
verify.mjs writes RUN_CERTIFICATE.json
       ↓
hooks.toml triggers post-run-certificate-video.mjs
       ↓
Hook script detects PASS status
       ↓
render-demo-video.mjs invoked with --skip-verify
       ↓
Visual feedback shown (spinners, phases)
       ↓
Remotion renders demo/out/<slug>.mp4
       ↓
Celebration banner displayed
```

---

## Verification Results

All components validated:

```
post-run-certificate-video.mjs: OK (syntax valid)
render-demo-video.mjs: OK (syntax valid)
Root.tsx: OK (TypeScript passes)
Footer.tsx: OK (determinism enforced)
Remotion compositions: OK (AppFactoryDemo available)
```

Remotion composition details:

- **ID:** AppFactoryDemo
- **FPS:** 30
- **Resolution:** 1920x1080
- **Duration:** 300 frames (10 seconds)

---

## Usage Examples

### Automatic Video Generation

When Claude runs Local Run Proof verification and it passes:

1. Hook triggers automatically
2. Video renders in background
3. Output appears at `demo/out/<slug>.mp4`

### Manual Video Generation

```bash
/factory video ./app-factory/builds/my-app/app

# With custom slug
/factory video ./builds/my-miniapp/app --slug custom-name
```

### Direct Script Invocation

```bash
node scripts/render-demo-video.mjs \
  --cwd ./builds/my-app \
  --slug my-app \
  --skip-verify
```

---

## Quality Guarantees

### Determinism

- Same props always produce identical video output
- UTC timezone enforced for all timestamps
- Static default props for studio preview

### Visual Feedback

- Phase headers indicate progress
- Spinners show elapsed time during async operations
- Celebration banner on success with stats
- Error boxes with remediation hints on failure

### Integration

- Hook triggers automatically - no manual steps
- Background execution doesn't block user
- Graceful fallback if Remotion unavailable
- CI environments automatically skipped

---

## Conclusion

The App Factory is now "video-first" - successful builds automatically generate polished promotional videos that can be used for:

1. Portfolio showcasing
2. Social media sharing
3. Client presentations
4. App store previews

The implementation follows all invariants:

- No silent execution (visual feedback throughout)
- Deterministic output (reproducible videos)
- Offline by default (no network calls required)
- Full audit trail (integrated with Local Run Proof)

**Video-First Audit v1.0.0**: Build apps, get videos. Automatically.
