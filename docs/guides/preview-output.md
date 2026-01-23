# How to Preview Output

This guide explains the VS Code preview system for viewing generated applications.

---

## Overview

The preview system provides a unified way to:

- Start dev servers
- Discover URLs automatically
- Preview in browsers
- Emulate mobile devices

It works across macOS, Windows, and Linux.

---

## Quick Start

### 1. Generate an Application

First, generate an application using any pipeline:

```bash
cd dapp-factory
claude
# Describe your idea and wait for build
```

### 2. Navigate to Output

```bash
cd dapp-factory/dapp-builds/<your-app>/
```

### 3. Run Preview

Open VS Code Command Palette: `Cmd+Shift+P` / `Ctrl+Shift+P`

Type: `Tasks: Run Task`

Select: `Factory: Preview (Auto)`

### 4. View Result

The terminal shows:

```
=== Factory Preview: Launch Dev Server ===

  Directory:       /path/to/your-app
  Package Manager: npm
  Project Type:    nextjs
  Command:         npm run dev

  Launching server...

  ========================================
  SERVER READY: http://localhost:3000
  ========================================
```

---

## Available Tasks

| Task                                    | Description                           |
| --------------------------------------- | ------------------------------------- |
| `Factory: Preview (Auto)`               | Launch dev server, discover URL       |
| `Factory: Preview (Detect Only)`        | Show what would run without launching |
| `Factory: Preview (Open Browser)`       | Open URL in default browser           |
| `Factory: Preview (Mobile Web iPhone)`  | Playwright iPhone emulation           |
| `Factory: Preview (Mobile Web Android)` | Playwright Android emulation          |
| `Factory: Preview (Mobile Web iPad)`    | Playwright iPad emulation             |
| `Factory: iOS Simulator (Mac Only)`     | Launch iOS Simulator app              |

---

## How It Works

### Detection

The system detects:

- **Package manager**: npm, pnpm, yarn, or bun (via lockfiles)
- **Dev command**: dev, start, serve, or similar (from package.json)
- **Project type**: Next.js, Vite, Expo, etc. (from dependencies)

### URL Discovery

When the dev server starts, the system watches stdout for URLs:

```
ready - started server on http://localhost:3000
➜ Local: http://localhost:5173/
```

It extracts the URL automatically.

### PREVIEW.json

The discovered URL is saved to `.vscode/.preview/PREVIEW.json`:

```json
{
  "status": "success",
  "url": "http://localhost:3000",
  "platform": "darwin",
  "pm": "npm",
  "projectType": "nextjs",
  "command": "npm run dev",
  "timestamp": "2026-01-22T10:30:00.000Z"
}
```

Other tasks read this file to know what URL to open.

---

## Mobile Web Emulation

### What It Is

Mobile emulation uses Playwright to open a browser with mobile device settings:

- Mobile viewport size
- Mobile user agent
- Touch emulation
- Device pixel ratio

This is **not** a native app—it's your web app in a mobile-sized browser.

### Using Mobile Preview

1. Run `Factory: Preview (Auto)` to start the server
2. Run `Factory: Preview (Mobile Web iPhone)` or Android variant

A browser window opens with mobile emulation settings.

### Available Devices

| Task               | Device        | Viewport |
| ------------------ | ------------- | -------- |
| Mobile Web iPhone  | iPhone 14 Pro | 393x852  |
| Mobile Web Android | Pixel 7       | 412x915  |
| Mobile Web iPad    | iPad Pro 11   | 834x1194 |

### First-Time Setup

If Playwright isn't installed, the system installs it:

```
[Preview] Playwright not found. Installing...
npm install --save-dev playwright
npx playwright install chromium webkit

[Preview] Installation complete.
```

This happens once per project.

---

## iOS Simulator (Mac Only)

### What It Is

The iOS Simulator is Apple's tool for running iOS apps on Mac. It's different from mobile web emulation—it runs actual iOS apps.

### When to Use

Use iOS Simulator when:

- You built with app-factory (Expo/React Native)
- You want to test native iOS behavior
- You need to test iOS-specific features

### How to Use

1. Run `Factory: iOS Simulator (Mac Only)`
2. The Simulator app launches
3. For Expo apps: run `npx expo start` then press `i`

### Requirements

- macOS only
- Xcode installed (from App Store)
- Xcode Command Line Tools (`xcode-select --install`)

### On Other Platforms

If you run this task on Windows or Linux:

```
ERROR: iOS Simulator is only available on macOS.

Alternative: Use "Factory: Preview (Mobile Web iPhone)"
This provides mobile web emulation that works on all platforms.
```

---

## Opening in Browser

### Default Browser

Run `Factory: Preview (Open Browser)` to open the URL in your default browser.

The system uses:

- macOS: `open`
- Linux: `xdg-open`
- Windows: `start`

### Manual Opening

You can also read the URL from PREVIEW.json:

```bash
cat .vscode/.preview/PREVIEW.json
```

Then paste into any browser.

---

## Embedded Preview (VS Code)

VS Code can show web content in an embedded panel:

1. Run `Factory: Preview (Auto)` to start server
2. Open Command Palette: `Cmd+Shift+P`
3. Type: `Simple Browser: Show`
4. Enter the URL from PREVIEW.json

This keeps the preview inside VS Code.

---

## Troubleshooting

### "No dev command found"

Your package.json needs a dev script:

```json
{
  "scripts": {
    "dev": "next dev"
  }
}
```

### "No package manager detected"

Ensure package.json exists in the directory.

### "Timeout waiting for URL"

The server may have failed. Check the terminal for errors.

Common causes:

- Port already in use
- Missing dependencies
- Build errors

### "Playwright installation failed"

Try manual installation:

```bash
npm install --save-dev playwright
npx playwright install
```

### Preview Not Updating

Stop the running server (Ctrl+C) and restart with `Factory: Preview (Auto)`.

---

## PREVIEW.json Reference

| Field         | Description            |
| ------------- | ---------------------- |
| `status`      | "success" or "failure" |
| `url`         | The discovered URL     |
| `platform`    | Operating system       |
| `pm`          | Package manager used   |
| `projectType` | Detected project type  |
| `command`     | Command executed       |
| `pid`         | Process ID of server   |
| `timestamp`   | When preview started   |

On failure, a FAILURE.json is written instead:

```json
{
  "status": "failure",
  "reason": "No dev command found",
  "suggestion": "Add a dev script to package.json",
  "timestamp": "..."
}
```

---

## Best Practices

### Run from Output Directory

Always navigate to the generated app directory:

```bash
# Correct
cd dapp-factory/dapp-builds/my-app/

# Wrong
cd dapp-factory/
```

### Install Dependencies First

If npm install hasn't run:

```bash
npm install
# Then run preview
```

### One Server at a Time

The preview system limits to one instance. Stop existing servers before starting new ones.

---

**Next**: [Sync Across Machines](./sync-machines.md) | [Back to Index](../index.md)
