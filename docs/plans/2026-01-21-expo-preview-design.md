# Expo Preview Hook Design

**Date:** 2026-01-21
**Status:** Implemented
**Author:** Claude (via brainstorming skill)

## Problem Statement

When Claude Code builds or modifies React Native/Expo code in the app-factory pipeline, developers must manually run `npx expo start` and scan QR codes or open URLs to see changes. This friction slows the development feedback loop.

## Solution

A Claude Code post-command hook that automatically opens a web browser preview when Expo dev server starts. Zero manual intervention required.

## Design Decisions

### 1. Trigger Mechanism

**Chosen:** Claude Code `post_tool_execution` hook on bash commands matching "expo start"

**Rationale:**

- Integrates directly with Claude Code's execution model
- No process interception or stdout parsing needed
- Hook runs after command starts, giving server time to boot

**Alternatives considered:**

- Parse Metro stdout for "ready" messages (fragile, version-dependent)
- File watcher for `.expo/` directory (indirect, timing issues)
- Pre-command hook (server not running yet)

### 2. Preview Target

**Chosen:** Web preview via localhost in default browser

**Rationale:**

- Universally available (no emulator setup)
- Single implementation path
- Expo web rendering is production-quality for most UI work

**Alternatives considered:**

- iOS Simulator via `xcrun simctl` (macOS only)
- Android Emulator via `adb` (requires Android Studio)
- Expo Go deep links (requires device on network)
- Smart detection (complexity not justified)

### 3. Readiness Detection

**Chosen:** HTTP polling with tolerant success criteria (200-399)

**Rationale:**

- Simple, reliable, no Metro version dependencies
- Handles transitional states (Metro warming up)
- 500ms interval balances responsiveness with overhead

**Parameters:**

- Poll interval: 500ms
- Max attempts: 60 (30 seconds total)
- Request timeout: 2000ms
- Success: HTTP 200-399

### 4. Hot Reload Strategy

**Chosen:** Fire-and-forget (rely on Metro's built-in HMR)

**Rationale:**

- Metro's hot module replacement is battle-tested
- No value in monitoring/reconnecting logic
- If server restarts, new hook execution opens browser again

### 5. Failure Handling

**Chosen:** Silent degradation (log and exit cleanly)

**Rationale:**

- Preview is enhancement, not requirement
- Should never fail the build
- Logs provide debugging info without blocking

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                 Claude Code Build Flow                  │
│                                                         │
│  Claude executes: npx expo start --web                  │
│                     │                                   │
│                     ▼                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  .claude/hooks.toml                             │   │
│  │  [[hooks.post_tool_execution]]                  │   │
│  │  tool = "bash"                                  │   │
│  │  match_commands = ["expo start"]                │   │
│  │  run_in_background = true                       │   │
│  └──────────────────┬──────────────────────────────┘   │
│                     │                                   │
│                     ▼                                   │
│  ┌─────────────────────────────────────────────────┐   │
│  │  scripts/expo-preview/preview.mjs               │   │
│  │  1. Parse port from command (8081/19006/custom) │   │
│  │  2. Poll http://localhost:{port} until ready    │   │
│  │  3. Open in default browser                     │   │
│  │  4. Exit (Metro HMR handles updates)            │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## File Structure

```
scripts/expo-preview/
├── preview.mjs     # Main hook script (~200 lines)
└── README.md       # Documentation

.claude/hooks.toml  # Hook configuration
```

## Port Detection Logic

| Pattern                        | Port  |
| ------------------------------ | ----- |
| `expo start`                   | 8081  |
| `expo start --web`             | 19006 |
| `expo start --port 3000`       | 3000  |
| `expo start --port=3000`       | 3000  |
| `expo start -p 3000`           | 3000  |
| `expo start --web --port 8080` | 8080  |

The `--web` flag switches to port 19006 unless explicitly overridden.

## CI/Headless Detection

Browser launch is skipped when any of these are detected:

- `CI=true`
- `HEADLESS=true`
- `GITHUB_ACTIONS=true`
- `GITLAB_CI=true`
- `JENKINS_URL` is set
- `BUILDKITE=true`

## Integration with Existing Systems

### Local-Run-Proof

This hook is **independent** of the local-run-proof verification system:

- Local-run-proof validates clean installs and builds
- Expo preview provides development feedback during iteration
- They serve different purposes and can coexist

### App-Factory Pipeline

The hook enhances Phase 2 (Build) of the app-factory pipeline:

- Claude generates/modifies code
- Claude runs `npx expo start --web`
- Hook automatically opens preview
- Developer sees changes immediately
- Metro HMR keeps preview updated as Claude continues editing

## Security Considerations

1. **Localhost only:** Browser only opens localhost URLs
2. **No shell execution:** Uses `spawn` with `shell: false`
3. **No secrets in logs:** Only logs port and status
4. **Graceful failures:** Never exposes errors to external systems

## Future Enhancements (Not Implemented)

These were considered but deferred (YAGNI):

- Emulator/simulator support
- QR code display in terminal
- Multi-device preview
- Preview URL notification to IDE
