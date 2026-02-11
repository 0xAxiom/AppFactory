# AppFactory Demo Video Pipeline

Remotion-based video generation for automatically creating demo videos of user-built apps.

## Available Compositions

| ID               | Duration | Resolution | Description                   |
| ---------------- | -------- | ---------- | ----------------------------- |
| `AppFactoryDemo` | 10s      | 1920x1080  | Build verification demo video |

## Quick Start

```bash
# Install dependencies
cd demo-video
npm install

# Preview in Remotion Studio
npm run studio

# Render a specific composition
npx remotion render src/index.ts AppFactoryDemo ../demo/out/my-app-demo.mp4
```

---

## Build Demo Video (10s)

Auto-generated video showcasing verified builds. This is the primary composition used by the pipeline to create promotional videos for user-built apps.

### Automatic Generation

When Local Run Proof verification passes, a demo video is automatically generated via the pipeline hooks. No manual steps required.

### Manual Rendering

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

### Composition Props

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

---

## Rendering Options

### Output Formats

```bash
# MP4 (H.264) - default, best compatibility
npx remotion render src/index.ts AppFactoryDemo output.mp4

# WebM (VP9) - smaller file size
npx remotion render src/index.ts AppFactoryDemo output.webm --codec=vp9

# GIF - for previews
npx remotion render src/index.ts AppFactoryDemo output.gif
```

### Quality Settings

```bash
# Higher quality (slower)
npx remotion render src/index.ts AppFactoryDemo output.mp4 --crf=18

# Smaller file (lower quality)
npx remotion render src/index.ts AppFactoryDemo output.mp4 --crf=28
```

---

## Architecture

```
demo-video/
├── src/
│   ├── index.ts              # Remotion entry point
│   ├── Root.tsx              # Composition registry
│   ├── compositions/
│   │   └── AppFactoryDemo.tsx # 10s demo video
│   └── components/
│       ├── Title.tsx         # Title + branding
│       ├── BulletPoints.tsx  # Animated highlights
│       ├── VerificationBadge.tsx # PASS badge
│       └── Footer.tsx        # Timestamp footer
├── public/                   # Static assets
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
- UTC timezone enforced for all date formatting

## Requirements

- Node.js 18+
- ffmpeg (for audio generation)
- Chrome/Chromium (auto-downloaded by Remotion)
