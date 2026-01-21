# AppFactory Demo Video Pipeline

Remotion-based demo video renderer for AppFactory builds. Produces deterministic MP4 videos showcasing generated applications with build verification status.

## Prerequisites

- Node.js >= 18
- npm/pnpm/yarn
- Local Run Proof must PASS before video can be rendered

## Installation

```bash
cd demo-video
npm install
```

## Usage

### Studio Mode (Development)

Open Remotion Studio to preview compositions:

```bash
npm run studio
```

### Render Demo Video

Use the render-demo-video.mjs script from repo root:

```bash
node scripts/render-demo-video.mjs --cwd <generated_app_path> --slug <video_slug>
```

**Required flags:**

- `--cwd <path>`: Path to the generated app to verify and render
- `--slug <string>`: Slug for the output video filename

**Optional flags:**

- `--install <cmd>`: Install command (default: "npm install")
- `--build <cmd>`: Build command (default: "npm run build")
- `--dev <cmd>`: Dev server command (default: "npm run dev")
- `--url <url>`: Health check URL (default: "http://localhost:{port}/")
- `--title <string>`: Video title (default: derived from slug)
- `--highlights <json>`: JSON array of highlight strings

### Output

Videos are rendered to `demo/out/<slug>.mp4` with props saved to `demo/out/<slug>.props.json`.

## Composition Props

The `AppFactoryDemo` composition accepts:

```typescript
interface AppFactoryDemoProps {
  title: string; // App/pipeline name
  slug: string; // Identifier slug
  verifiedUrl: string; // The localhost URL that passed health check
  timestamp: string; // ISO timestamp of verification
  highlights: string[]; // Key bullet points (4-6 recommended)
  certificateHash: string; // SHA256 of RUN_CERTIFICATE.json
}
```

## Video Specifications

- **Resolution**: 1920x1080 (Full HD)
- **Frame Rate**: 30 fps
- **Duration**: 10 seconds (300 frames)
- **Format**: MP4 (H.264)

## Local Run Proof Integration

This pipeline depends on Local Run Proof:

1. Before rendering, verify.mjs runs against the target project
2. Must produce RUN_CERTIFICATE.json with status "PASS"
3. If verification fails, render is blocked
4. Verified URL from certificate is embedded in video
5. Certificate hash is displayed for traceability

## Architecture

```
demo-video/
├── src/
│   ├── index.ts              # Remotion entry point
│   ├── Root.tsx              # Composition registry
│   ├── compositions/
│   │   └── AppFactoryDemo.tsx # Main demo composition
│   └── components/
│       ├── Title.tsx         # Title + branding
│       ├── BulletPoints.tsx  # Animated highlights
│       ├── VerificationBadge.tsx # PASS badge
│       └── Footer.tsx        # Timestamp footer
├── remotion.config.ts        # Remotion configuration
├── package.json
├── tsconfig.json
└── README.md
```

## Determinism

Video output is deterministic:

- Same props produce byte-identical MP4
- No random elements in composition
- Timestamps are input props, not runtime-generated
