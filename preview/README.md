# App Factory Live Preview

A local development server that provides live preview capabilities for built App Factory apps.

## Quick Start

```bash
cd preview
npm install
npm start
```

The preview server will run on http://localhost:3456

## What It Does

- Manages Expo dev server sessions for built apps
- Provides QR codes and links for mobile testing
- Integrates with the App Factory dashboard
- Supports both Expo Dev Client and Expo Go modes

## API Endpoints

- `GET /health` - Server health check
- `GET /sessions` - Get current session info
- `POST /sessions/start` - Start preview for a build
- `POST /sessions/stop` - Stop current session
- `GET /sessions/:id` - Get specific session details

## Usage

1. Build an app using `build <IDEA_NAME>`
2. Start the preview server: `npm start`
3. Open the App Factory dashboard
4. Click on a built app and select "Launch Live Preview"
5. Scan the QR code with Expo Dev Client or Expo Go

## Requirements

- Node.js
- Expo CLI (npx)
- App Factory builds with valid Expo configuration

## Troubleshooting

**Port already in use**: Stop other Expo instances or change PORT in server.js

**Build not found**: Ensure the app was built successfully with `build <IDEA_NAME>`

**Expo not found**: The build must have Expo in dependencies (all App Factory builds do)

## Safety

- Only manages processes it starts
- Never writes to builds/ or runs/ directories
- Stores session data in preview/.runtime/ only
- Automatically cleans up on shutdown