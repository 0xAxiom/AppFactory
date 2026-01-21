# Personal Site Design: Creative Portfolio + Developer Showcase + Blog

**Date:** 2026-01-21
**Status:** Approved
**Pipeline:** dapp-factory (Next.js)

---

## Overview

A bold, experimental personal website combining a creative portfolio, developer showcase, and blog into a unified experience. Content is presented in an integrated feed mixing all types. The site features heavy motion design, 3D accents, and distinctive interactive elements.

### Content Types

- Visual art
- Motion/video work
- AI development projects
- Blog posts/writing

### Key Characteristics

- Bold/experimental aesthetic
- Integrated feed (portfolio + blog mixed)
- All-out interactivity: dark mode, custom cursor, page transitions, 3D/WebGL

---

## Site Structure & Navigation

### Pages

| Page            | Purpose                                                                               |
| --------------- | ------------------------------------------------------------------------------------- |
| **Home / Feed** | Integrated timeline mixing portfolio pieces and blog posts                            |
| **About**       | Story, skills, personality — potential for interactive element (AI chat or 3D avatar) |
| **Work**        | Filter view of the same feed content by type: Visual Art, Motion, AI Dev, Writing     |
| **Contact**     | Simple form or links to socials/email                                                 |

### Navigation

- Fixed header: name/logo left, nav links right
- Hover animations on nav items (underline draws in, slight lift)
- Dark mode toggle in nav (sun/moon morph animation)
- Frosted glass header background on scroll
- Mobile: hamburger with full-screen overlay, staggered link animations

### Page Transitions

- Content fades/slides out with subtle scale, new content animates in
- Colored wipe or shape crosses screen during transitions
- URL changes feel intentional and cinematic

---

## Visual Design Language

### Color Palette

| Mode           | Background             | Notes                      |
| -------------- | ---------------------- | -------------------------- |
| Dark (default) | `#0a0a0a` or `#0a0f1a` | Deep charcoal or rich navy |
| Light          | `#f5f2eb`              | Warm off-white             |

**Accents:** 1-2 bold colors (electric blue, hot pink, or acid green) — used for links, hover states, cursor trail, transition wipes. Final choice based on user's art style.

### Typography

- **Display/Headlines:** Bold, distinctive typeface with personality (Space Grotesk, Clash Display, or variable font for animation)
- **Body:** Clean and readable (Inter, Söhne, or similar)
- **Oversized moments:** Headlines that break the grid, bleed off-screen, or layer behind images

### Layout Principles

- Asymmetric grid embracing tension
- Generous whitespace punctuated by dense content clusters
- Overlapping elements (text over images with blend modes, shapes at edges)
- Depth cues: subtle shadows, layered elements, parallax on scroll

### Imagery & Media

- Portfolio images/videos are hero-sized, not thumbnails
- Hover: slight scale + lift + glow or border animation
- Videos autoplay muted on hover, full controls on click

---

## Motion & Interactive Elements

### Custom Cursor

- Default: small circle/dot following mouse with eased lag
- Hover on links/buttons: expands, changes color, shows text ("View", "Read")
- Hover on media: becomes play icon or "Explore" indicator
- Optional: faint trail or particles

### Scroll Animations

- Content fades/slides in on viewport entry (staggered timing)
- Parallax: background shapes move slower than foreground
- Progress indicator: subtle line/shape filling as you scroll

### 3D Accents (Three.js/WebGL)

- **Hero:** Animated 3D shape responding to mouse movement
- **Background:** Floating geometric shapes (subtle, ambient)
- **About page:** Potential 3D room/environment to explore
- **Image effects:** Shader distortion on hover (RGB split, noise)

### Micro-interactions

- Button press states (scale down, color shift)
- Form input glow/border animation on focus
- Dark mode toggle: sun morphs to moon with ray animations
- Optional: like/reaction animations on posts

### Performance

- 3D elements lazy-loaded, don't block initial paint
- `prefers-reduced-motion` media query respected

---

## The Integrated Feed

### Concept

A single scrollable timeline mixing all content types. Each item is a card with varying size/layout based on type — not a uniform grid. A curated river of work and thoughts.

### Card Types

| Type             | Appearance                                                             |
| ---------------- | ---------------------------------------------------------------------- |
| **Visual Art**   | Large image hero, minimal text (title + date), expands to gallery      |
| **Motion/Video** | Video thumbnail with play indicator, autoplay on hover, click for full |
| **AI Project**   | Code snippet preview or demo embed, description, repo/demo links       |
| **Blog Post**    | Title, excerpt (2-3 lines), read time, optional featured image         |

### Feed Behavior

- Infinite scroll or "Load more" button
- Filter bar at top: "All / Art / Motion / AI / Writing" — filters without reload
- Type badge/icon on each card for scannability
- Staggered animation on scroll

### Detail Views

- Click opens expanded view (modal overlay or dedicated page with transition)
- Blog posts: full reading layout with nice typography
- Portfolio: gallery/showcase view with description, tools used, links

---

## Technical Implementation

### Framework

- **Next.js 14+** (App Router) via `dapp-factory/` pipeline
- React Server Components for fast initial load
- Client components for interactivity

### Styling & Animation

| Tool                         | Purpose                                                 |
| ---------------------------- | ------------------------------------------------------- |
| Tailwind CSS                 | Base styles, responsive design                          |
| Framer Motion                | Page transitions, scroll animations, micro-interactions |
| Three.js + React Three Fiber | 3D elements (lazy-loaded)                               |
| GSAP (optional)              | Complex timeline animations                             |

### Content Management

- **MDX files** in repo for blog posts (Markdown + React components)
- **JSON/YAML** data files for portfolio items
- Media in `/public` or CDN
- Version-controlled, no external CMS required
- Future option: Notion or Sanity for GUI editing

### Key Libraries

- `next-mdx-remote` or `contentlayer` — MDX processing
- `react-three-fiber` + `drei` — 3D
- `framer-motion` — animations
- `next-themes` — dark mode

### Deployment

- **Vercel** — automatic previews, edge delivery
- Next.js Image optimization

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx          # Home / Feed
│   ├── about/page.tsx
│   ├── work/page.tsx     # Filtered feed view
│   ├── contact/page.tsx
│   └── [slug]/page.tsx   # Dynamic post/project pages
├── components/
│   ├── layout/           # Header, Footer, PageTransition
│   ├── feed/             # FeedCard, FeedFilter, FeedList
│   ├── ui/               # Button, Cursor, DarkModeToggle
│   └── three/            # Hero3D, FloatingShapes, shaders
├── content/
│   ├── posts/            # MDX blog posts
│   └── projects/         # Portfolio items (JSON + media refs)
├── lib/                  # Content loaders, utilities
└── styles/               # Global CSS, Tailwind config
```

---

## Deliverables

### What Gets Built

- Responsive site (mobile through desktop)
- Dark/light mode with system preference detection
- Integrated feed with filtering
- Animated page transitions and scroll effects
- 3D hero element and ambient shapes
- Custom cursor with contextual states
- MDX blog with syntax highlighting
- Portfolio detail views with galleries

### User-Provided Assets Needed

- Content (art, videos, project descriptions, blog posts)
- Color accent preference
- Font preferences (if any)
- Logo or wordmark (or name set in display font)

---

## Next Steps

1. Set up isolated workspace via git worktree
2. Create detailed implementation plan
3. Build in phases: structure → styling → motion → 3D → content
