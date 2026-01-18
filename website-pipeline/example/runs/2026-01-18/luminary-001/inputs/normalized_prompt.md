# Normalized Prompt

**Phase:** 0 - Intent Normalization
**Timestamp:** 2026-01-18T10:00:30Z

---

## Normalized Website Description

A sophisticated portfolio website for **Luminary Studio**, a creative agency specializing in brand identity design. The website showcases their case studies, team expertise, and design philosophy through an immersive, visually-driven experience.

### Core Features

- **Hero Section**: Full-viewport animated introduction with studio name, tagline, and featured work preview
- **Work Portfolio**: Filterable project gallery with case study detail pages featuring before/after imagery, process documentation, and results
- **Services Page**: Comprehensive breakdown of brand identity offerings (logo design, visual systems, brand guidelines, packaging)
- **About Page**: Studio story, team members with roles, and design philosophy
- **Contact Page**: Professional inquiry form with project type selection, budget range, and timeline fields

### Design Direction

- Minimalist, high-contrast aesthetic with generous whitespace
- Dark mode support with seamless toggle
- Smooth page transitions and scroll-triggered animations using Framer Motion
- Typography-forward design emphasizing hierarchy and readability

### Technical Requirements

- Mobile-first responsive design (320px to 1920px+)
- Core Web Vitals compliant (LCP < 2.5s, CLS < 0.1, FID < 100ms)
- WCAG 2.1 AA accessibility compliance
- SEO-optimized with structured data for Organization and CreativeWork schemas

### Performance Budget

- Initial bundle size < 200KB
- Hero image optimized with next/image, priority loading
- Fonts self-hosted via next/font
- Lazy-loaded project images below the fold

---

## Inferred Enhancements

| User Omitted | Claude Added |
|--------------|--------------|
| No pages specified | Home, Work, Work/[slug], Services, About, Contact |
| No animations | Framer Motion page transitions, scroll animations |
| No dark mode | Dark mode with system preference detection |
| No SEO | Full metadata, JSON-LD structured data |
| No performance | Core Web Vitals targets, bundle budget |
| No accessibility | WCAG 2.1 AA compliance |
| No forms | Contact form with React Hook Form + Zod |
