# Tour Guide Sandbox

A sandboxed preview environment for the Tour Guide 3D character.

## Quick Start

```bash
cd tools/sandbox
npm install
npm run dev
```

### Open in VS Code (Recommended)

The dev server does NOT auto-open a browser. To preview inside VS Code:

1. **Start the server** (see above)
2. **Open Command Palette**: `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
3. **Run**: `Simple Browser: Show`
4. **Enter URL**: `http://localhost:5173`

This keeps your preview inside the IDE for faster iteration.

### Open in External Browser

If you prefer Chrome/Firefox, manually navigate to `http://localhost:5173`.

## Features

- **Auto-popup Modal**: Tour Guide modal opens automatically on page load
- **3D GLB Viewer**: Renders the Tour Guide model using Three.js / react-three-fiber
- **Sandboxed Iframe**: 3D viewer runs in an isolated iframe for security
- **Graceful Fallbacks**:
  - GLB missing → Shows thumbnail image
  - Both missing → Shows setup instructions

## Asset Loading

The viewer checks for assets in this order:

1. `public/assets/tour-guide.glb` - Exported artifacts (from Blender scripts)
2. `public/source-assets/tour-guide.glb` - Pre-copied source assets

## Project Structure

```
tools/sandbox/
├── src/
│   ├── main.tsx           # Entry point with router
│   ├── App.tsx            # Main app with modal state
│   └── components/
│       ├── TourGuideModal.tsx   # Centered modal container
│       ├── Viewer.tsx           # 3D viewer with fallbacks
│       └── *.css                # Component styles
├── public/
│   ├── assets/            # Exported artifacts (from Blender)
│   └── source-assets/     # Pre-copied source files
├── index.html
├── vite.config.ts
└── package.json
```

## Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Dependencies

- React 18
- Vite 6
- Three.js / react-three-fiber
- react-router-dom

## Notes

- The 3D viewer uses OrbitControls for interaction (drag to rotate, scroll to zoom)
- Auto-rotate is enabled by default
- Modal can be closed with Escape key or by clicking the backdrop
