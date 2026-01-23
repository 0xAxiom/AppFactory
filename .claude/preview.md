# Factory Preview System

**Version**: 1.0.0
**Status**: Cross-Platform
**Last Updated**: 2026-01-22

---

## Overview

The Factory Preview System provides a unified "Preview Output" experience in VS Code that works across macOS, Windows, and Linux. It auto-detects the project type and dev server, then opens the best available preview.

---

## Quick Start

1. **Start the dev server**:
   - Open Command Palette: `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
   - Run: `Tasks: Run Task` → `Factory: Preview (Auto)`
   - The server URL will be written to `.vscode/.preview/PREVIEW.json`

2. **Open in browser**:
   - Run: `Tasks: Run Task` → `Factory: Preview (Open Browser)`
   - Or copy the URL from `PREVIEW.json` and paste in your browser

3. **Mobile preview**:
   - Run: `Tasks: Run Task` → `Factory: Preview (Mobile Web iPhone)`
   - Or: `Factory: Preview (Mobile Web Android)`

---

## Available Tasks

| Task                                    | Description                                              | Platform   |
| --------------------------------------- | -------------------------------------------------------- | ---------- |
| `Factory: Preview (Auto)`               | Launch dev server, discover URL, write PREVIEW.json      | All        |
| `Factory: Preview (Detect Only)`        | Detect package manager and dev command without launching | All        |
| `Factory: Preview (Mobile Web iPhone)`  | Playwright with iPhone 14 Pro emulation                  | All        |
| `Factory: Preview (Mobile Web Android)` | Playwright with Pixel 7 emulation                        | All        |
| `Factory: Preview (Mobile Web iPad)`    | Playwright with iPad Pro emulation                       | All        |
| `Factory: Preview (Open Browser)`       | Open URL in default browser                              | All        |
| `Factory: iOS Simulator (Mac Only)`     | Launch iOS Simulator app                                 | macOS only |

---

## Platform Support

### Cross-Platform (macOS, Windows, Linux)

- **Dev server detection**: Automatically finds package manager (npm, pnpm, yarn, bun) and dev command (dev, start, serve)
- **URL discovery**: Parses stdout for localhost URLs from all major frameworks
- **Browser opening**: Uses platform-native commands (`open`, `xdg-open`, `start`)
- **Mobile web emulation**: Uses Playwright (installed on-demand) for device emulation

### macOS Only

- **iOS Simulator**: Requires Xcode with Simulator app
- Falls back gracefully on other platforms with a clear message

---

## PREVIEW.json Artifact

When you run `Factory: Preview (Auto)`, it writes:

```json
{
  "status": "success",
  "url": "http://localhost:3000",
  "platform": "darwin",
  "pm": "npm",
  "projectType": "nextjs",
  "command": "npm run dev",
  "pid": 12345,
  "cwd": "/path/to/project",
  "timestamp": "2026-01-22T12:00:00.000Z"
}
```

Location: `.vscode/.preview/PREVIEW.json`

### On Failure

If the server fails to start, it writes:

```json
{
  "status": "failure",
  "reason": "No dev command found",
  "suggestion": "Add a \"dev\", \"start\", or \"serve\" script to package.json",
  "cwd": "/path/to/project",
  "timestamp": "2026-01-22T12:00:00.000Z"
}
```

Location: `.vscode/.preview/FAILURE.json`

---

## Supported Project Types

The detection system recognizes:

| Framework        | Detection                                 | Default Port |
| ---------------- | ----------------------------------------- | ------------ |
| Next.js          | `next` in dependencies                    | 3000         |
| Vite             | `vite` in dependencies                    | 5173         |
| Create React App | `react-scripts` in dependencies           | 3000         |
| Expo             | `expo` in dependencies                    | 8081         |
| Remix            | `@remix-run/react` in dependencies        | 3000         |
| Nuxt             | `nuxt` in dependencies                    | 3000         |
| Astro            | `astro` in dependencies                   | 4321         |
| SvelteKit        | `@sveltejs/kit` in dependencies           | 5173         |
| Vue CLI          | `vue` in dependencies                     | 5173         |
| Node servers     | `express`/`fastify`/`koa` in dependencies | 3000         |

---

## Mobile Emulation Devices

Available device profiles for Playwright emulation:

| Device Key       | Name          | Viewport | Browser  |
| ---------------- | ------------- | -------- | -------- |
| `iphone`         | iPhone 14 Pro | 393x852  | WebKit   |
| `iphone-se`      | iPhone SE     | 375x667  | WebKit   |
| `android`        | Pixel 7       | 412x915  | Chromium |
| `android-tablet` | Galaxy Tab S8 | 753x1193 | Chromium |
| `ipad`           | iPad Pro 11   | 834x1194 | WebKit   |

---

## Playwright Installation

Playwright is installed on-demand when you first use mobile emulation:

1. Task detects Playwright is missing
2. Runs `npm install --save-dev playwright`
3. Runs `npx playwright install chromium webkit`
4. Launches the emulator

This only happens once per project.

---

## Embedded Preview (VS Code)

For embedded preview inside VS Code:

1. Install the recommended Playwright extension: `ms-playwright.playwright`
2. Run `Factory: Preview (Auto)` to start the server
3. Copy the URL from `PREVIEW.json`
4. Use VS Code's built-in Simple Browser: `Cmd+Shift+P` → `Simple Browser: Show`

---

## Troubleshooting

### "No package manager detected"

Ensure your project has a `package.json` file. If you have a lockfile, the system will detect the correct package manager.

### "No dev command found"

Add one of these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev"
  }
}
```

### "Timeout waiting for server URL"

The server may have failed to start. Check the terminal output for errors. Common causes:

- Port already in use
- Missing dependencies (run `npm install`)
- Build errors in your code

### iOS Simulator not opening

- Only works on macOS
- Requires Xcode: Install from the App Store
- Requires Xcode Command Line Tools: `xcode-select --install`

### Playwright installation fails

- Ensure you have a `package.json` in your project
- Try manual installation: `npm install --save-dev playwright`
- Then: `npx playwright install`

---

## Scripts Reference

| Script                               | Purpose                                |
| ------------------------------------ | -------------------------------------- |
| `scripts/preview/detect.mjs`         | Detect package manager and dev command |
| `scripts/preview/launch-dev.mjs`     | Launch dev server with URL discovery   |
| `scripts/preview/open-url.mjs`       | Cross-platform browser opener          |
| `scripts/preview/mobile-emulate.mjs` | Playwright mobile emulation            |
| `scripts/preview/ios-simulator.mjs`  | iOS Simulator launcher (Mac only)      |

---

## Version History

| Version | Date       | Changes                |
| ------- | ---------- | ---------------------- |
| 1.0.0   | 2026-01-22 | Initial preview system |

---

**Factory Preview System v1.0.0**: One command, any platform, instant preview.
