# Portfolio Website Template

**Pipeline**: website-pipeline
**Category**: Personal / Creative
**Complexity**: Low-Medium

---

## Description

A professional portfolio website template for creatives, developers, designers, and professionals. Features project showcases, about sections, and contact functionality with modern animations.

---

## Pre-Configured Features

### Core Features

- Hero section with animated introduction
- Project gallery with filtering
- About page with skills showcase
- Contact form with validation
- Blog/articles section (optional)

### UI Components

- Animated page transitions
- Project cards with hover effects
- Image lightbox for projects
- Skills progress indicators
- Testimonials carousel
- Social media links

### Performance

- Optimized for Core Web Vitals
- Image lazy loading
- Font optimization
- Static generation

---

## Ideal For

- Developers
- Designers
- Photographers
- Writers
- Artists
- Freelancers

---

## File Structure

```
website-builds/<slug>/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Hero + featured work
│   │   ├── projects/
│   │   │   ├── page.tsx      # All projects
│   │   │   └── [slug]/
│   │   │       └── page.tsx  # Project detail
│   │   ├── about/
│   │   │   └── page.tsx      # Bio, skills, experience
│   │   ├── contact/
│   │   │   └── page.tsx      # Contact form
│   │   └── globals.css
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── FeaturedWork.tsx
│   │   │   ├── About.tsx
│   │   │   └── Contact.tsx
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectGrid.tsx
│   │   │   └── ProjectFilter.tsx
│   │   ├── ui/               # shadcn/ui
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   └── projects.ts       # Project data
│   └── styles/
│       └── design-tokens.ts
├── public/
│   ├── projects/             # Project images
│   ├── og-image.png
│   └── favicon.ico
├── research/
│   └── positioning.md
├── audits/
│   ├── react-best-practices.md
│   └── web-design-guidelines.md
└── ralph/
    └── PROGRESS.md
```

---

## Default Tech Stack

| Component | Technology              |
| --------- | ----------------------- |
| Framework | Next.js 14 (App Router) |
| Language  | TypeScript              |
| Styling   | Tailwind CSS            |
| UI        | shadcn/ui               |
| Animation | Framer Motion           |
| Forms     | React Hook Form + Zod   |
| SEO       | next-seo                |
| Icons     | Lucide React            |

---

## Usage

When using this template in Phase 0, Claude will:

1. Normalize your idea for portfolio presentation
2. Pre-configure project showcase components
3. Set up contact form with validation
4. Include personal branding research

**Example prompt enhancement:**

- User says: "portfolio for a UX designer"
- Template adds: case study pages with process documentation, before/after sliders, testimonials from clients, skills matrix, tools I use section, downloadable resume

---

## Design System Defaults

```typescript
// design-tokens.ts (pre-configured)
{
  colors: {
    primary: "neutral", // Professional
    accent: "blue",
    background: {
      light: "#ffffff",
      dark: "#0a0a0a"
    }
  },
  typography: {
    headings: "Inter",
    body: "Inter"
  },
  animation: {
    pageTransition: "fade-up",
    hover: "scale"
  }
}
```

---

## Customization Points

| Element             | How to Customize                    |
| ------------------- | ----------------------------------- |
| Hero content        | Edit `components/sections/Hero.tsx` |
| Project data        | Update `lib/projects.ts`            |
| Color scheme        | Modify `styles/design-tokens.ts`    |
| Skills list         | Edit `about/page.tsx`               |
| Contact form fields | Update `contact/page.tsx`           |

---

## Quality Expectations

When using this template, Ralph will check for:

- [ ] Hero section has animated entrance
- [ ] Projects display in grid with filters
- [ ] Project pages have case study content
- [ ] About page shows skills visually
- [ ] Contact form validates input
- [ ] Navigation is accessible
- [ ] Mobile layout works perfectly
- [ ] Page transitions are smooth
- [ ] Images load with blur placeholder
- [ ] SEO metadata is complete

---

## SEO Pre-Configuration

```tsx
// Already included:
// - Unique title tags per page
// - Meta descriptions
// - Open Graph images
// - Structured data (Person schema)
// - Canonical URLs
// - robots.txt
// - sitemap.xml generation
```
