# Expo Preview Hook

Automatic browser launch for Expo dev server during Claude Code builds.

## Overview

This hook automatically opens a web preview when Claude Code executes `expo start` commands during the app-factory build pipeline. No manual intervention required.

## How It Works

1. Claude Code hook triggers after any `expo start` or `npx expo start` command
2. Script polls `localhost:{port}` until Metro bundler responds
3. Browser opens automatically with the preview URL
4. Metro's built-in hot reload handles subsequent file changes

## Configuration

The hook is configured in `.claude/hooks.toml`:

```toml
[[hooks.post_tool_execution]]
tool = "bash"
match_commands = ["expo start", "npx expo start"]
run = "node scripts/expo-preview/preview.mjs"
timeout_ms = 35000
run_in_background = true
```

## Port Detection

The script automatically detects the correct port:

| Command                  | Port                 |
| ------------------------ | -------------------- |
| `expo start`             | 8081 (Metro default) |
| `expo start --web`       | 19006 (Expo web)     |
| `expo start --port 3000` | 3000 (custom)        |
| `expo start --port=3000` | 3000 (custom)        |
| `expo start -p 3000`     | 3000 (custom)        |

**Note:** `--web` flag takes precedence and uses port 19006 unless overridden.

## Environment Variables

| Variable              | Effect               |
| --------------------- | -------------------- |
| `CI=true`             | Skips browser launch |
| `HEADLESS=true`       | Skips browser launch |
| `GITHUB_ACTIONS=true` | Skips browser launch |
| `GITLAB_CI=true`      | Skips browser launch |
| `BUILDKITE=true`      | Skips browser launch |

## Behavior

### Success Path

1. Expo command executes (by Claude)
2. Hook runs in background
3. Polls localhost every 500ms (max 30s)
4. Opens browser on first successful response (HTTP 200-399)
5. Exits cleanly

### Failure Handling

- **Server not ready:** Logs warning, exits cleanly (no build failure)
- **Port conflict:** Same - logs and exits cleanly
- **Browser fails to open:** Logs error, exits cleanly
- **CI environment:** Skips entirely, no-op

### Multiple Invocations

Each `expo start` triggers the hook independently. The OS typically reuses the existing browser tab.

## Manual Testing

```bash
# Simulate hook with command
CLAUDE_TOOL_INPUT='{"command":"npx expo start --web"}' node scripts/expo-preview/preview.mjs

# Or pass command directly
node scripts/expo-preview/preview.mjs npx expo start --web
```

## Dependencies

- Node.js 18+ (uses native fetch)
- No npm dependencies required
