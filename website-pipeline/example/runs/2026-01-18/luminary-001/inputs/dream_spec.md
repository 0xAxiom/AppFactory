# Dream Spec: Luminary Studio Website

**Phase:** 1 - Dream Spec Author
**Timestamp:** 2026-01-18T10:01:00Z

---

## 1. Website Vision

Luminary Studio's website is a digital showcase of brand identity excellence. Every interaction—from the first scroll to the final form submission—reflects the same attention to detail and craft that defines their client work. The site serves as both portfolio and proof-of-concept: "If we can make our own brand this compelling, imagine what we'll do for yours."

---

## 2. Target Audience

### Primary
- **Startup Founders** (Series A-B): Need cohesive brand identity to stand out in crowded markets
- **Marketing Directors**: Seeking agency partners for rebrands or brand extensions
- **Creative Directors**: Evaluating potential collaborators for joint projects

### Secondary
- **Design Students**: Looking for inspiration and industry standards
- **Recruiters**: Scouting for talent or partnership opportunities

### Audience Expectations
- Quick loading, mobile-optimized experience
- Impressive visuals that demonstrate capability
- Clear path to contact with low friction
- Professional tone with creative flair

---

## 3. Core Pages

| Page | Route | Purpose |
|------|-------|---------|
| Home | `/` | First impression, featured work, value proposition |
| Work | `/work` | Full portfolio with category filtering |
| Case Study | `/work/[slug]` | Deep dive into individual projects |
| Services | `/services` | What Luminary offers and how they work |
| About | `/about` | Team, story, philosophy, culture |
| Contact | `/contact` | Inquiry form with project details |
| 404 | `/not-found` | Branded error page with navigation |

---

## 4. Content Requirements

### Home Page
- Hero: Animated studio name, tagline, CTA
- Featured Work: 3-4 highlighted case studies
- Services Overview: Brief list with icons
- Testimonial: One strong client quote
- Contact CTA: Prominent call-to-action

### Work Page
- Category filters (Brand Identity, Packaging, Digital, Print)
- Project grid with hover effects
- Load more / pagination for 12+ projects

### Case Study Page (per project)
- Hero image (full-width)
- Project overview (client, industry, scope)
- Challenge section
- Solution/approach section
- Visual gallery (logo variations, applications, mockups)
- Results/metrics (if available)
- Related projects

### Services Page
- Service cards with descriptions
- Process timeline/steps
- FAQ section

### About Page
- Studio story (founding, mission)
- Team grid with photos, names, roles
- Values/philosophy
- Studio photos/culture

### Contact Page
- Contact form fields:
  - Name, Email, Company
  - Project type (dropdown)
  - Budget range (dropdown)
  - Timeline (dropdown)
  - Message (textarea)
- Direct email fallback
- Location/timezone info

---

## 5. User Flows

### Flow 1: Discovery → Contact (Primary)
```
Home → Featured Work (click) → Case Study → Contact CTA → Contact Form → Submit
```

### Flow 2: Services Evaluation
```
Home → Services → Read offerings → Contact
```

### Flow 3: Portfolio Browse
```
Home → Work → Filter by category → Browse projects → Case Study → Related projects (repeat)
```

### Flow 4: About/Trust Building
```
Home → About → Team → Philosophy → Contact
```

---

## 6. Design Direction

### Visual Style
- **Aesthetic**: Modern minimalist with bold typography
- **Contrast**: High contrast, black/white foundation with accent color
- **Whitespace**: Generous spacing, breathing room
- **Photography**: High-quality project imagery, lifestyle shots

### Color Palette
| Role | Light Mode | Dark Mode |
|------|------------|-----------|
| Background | #FFFFFF | #0A0A0A |
| Foreground | #0A0A0A | #FAFAFA |
| Primary | #000000 | #FFFFFF |
| Accent | #6366F1 | #818CF8 |
| Muted | #F4F4F5 | #27272A |

### Typography
- **Headings**: Inter (700, tight tracking)
- **Body**: Inter (400, comfortable line-height)
- **Mono**: JetBrains Mono (code snippets if any)

### Animation Principles
- Subtle entrance animations (fade up, 300ms)
- Smooth page transitions (opacity + y-axis)
- Hover states with scale feedback
- Staggered list animations
- Respect prefers-reduced-motion

---

## 7. Component Architecture

### Layout Components
- `Header` - Navigation, logo, theme toggle
- `Footer` - Links, social, copyright
- `Container` - Max-width wrapper
- `Section` - Full-width section with padding

### UI Components (shadcn/ui)
- `Button` - Primary, secondary, ghost variants
- `Card` - Project cards, service cards
- `Input`, `Textarea`, `Select` - Form elements
- `Skeleton` - Loading states
- `Toast` - Form feedback

### Section Components
- `Hero` - Home hero with animation
- `FeaturedWork` - Home portfolio preview
- `ProjectGrid` - Work page grid
- `ProjectCard` - Individual project preview
- `TeamGrid` - About page team display
- `ContactForm` - Contact page form
- `Testimonial` - Quote display

### Animation Components
- `PageTransition` - Framer Motion page wrapper
- `FadeIn` - Scroll-triggered fade animation
- `Stagger` - List stagger animation

---

## 8. Performance Budget

| Metric | Target | Maximum |
|--------|--------|---------|
| LCP | < 2.0s | 2.5s |
| FID | < 50ms | 100ms |
| CLS | < 0.05 | 0.1 |
| TTFB | < 500ms | 800ms |
| Initial JS | < 150KB | 200KB |
| Total Transfer | < 1MB | 1.5MB |

### Optimization Strategies
- Server Components for all static content
- Dynamic imports for Framer Motion (only on pages with animations)
- next/image for all images with proper sizing
- next/font for font optimization
- Preload critical assets
- ISR for case study pages

---

## 9. SEO Strategy

### Target Keywords
- Primary: "brand identity agency", "brand design studio"
- Secondary: "logo design agency", "visual identity design"
- Long-tail: "brand identity for startups", "tech company branding"

### Metadata Approach
- Unique titles per page (< 60 chars)
- Compelling descriptions (150-160 chars)
- Open Graph images per case study
- Twitter card configuration

### Structured Data
- `Organization` - Studio info
- `WebSite` - Search action
- `CreativeWork` - Per case study
- `BreadcrumbList` - Navigation

### Technical SEO
- Clean URL structure
- XML sitemap (generated)
- robots.txt (configured)
- Canonical URLs
- Internal linking strategy

---

## 10. Accessibility Requirements

### WCAG 2.1 AA Compliance
- Color contrast ≥ 4.5:1 for body text
- Color contrast ≥ 3:1 for large text
- Focus indicators on all interactive elements
- Skip navigation link
- ARIA labels on icon buttons
- Alt text on all images
- Keyboard navigation for all features
- Screen reader testing

### Specific Requirements
- Form labels associated with inputs
- Error messages announced to screen readers
- Modal focus trapping
- Reduced motion support
- Touch targets ≥ 44x44px on mobile

---

## 11. Deployment Strategy

### Platform
- **Vercel** - Zero-config Next.js deployment

### Configuration (vercel.json)
```json
{
  "framework": "nextjs",
  "regions": ["sfo1"],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}
```

### Environment Variables
- `NEXT_PUBLIC_SITE_URL` - Production URL
- `CONTACT_EMAIL` - Form submission recipient
- `RESEND_API_KEY` - Email service (optional)

### CI/CD
- Preview deployments on PR
- Production deployment on main merge
- Lighthouse CI for performance regression

---

## 12. Success Criteria

### Technical Success
- [ ] All pages render without errors
- [ ] Build completes with no TypeScript errors
- [ ] Lighthouse Performance ≥ 90
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] All Core Web Vitals pass

### Skills Audit Success
- [ ] react-best-practices ≥ 95%
- [ ] web-design-guidelines ≥ 90%
- [ ] No CRITICAL violations
- [ ] No HIGH accessibility violations

### Content Success
- [ ] All pages have real content (no lorem ipsum)
- [ ] All images have meaningful alt text
- [ ] Contact form validates and submits
- [ ] All internal links work

### User Experience Success
- [ ] Page loads feel instant (< 2s LCP)
- [ ] Animations are smooth (60fps)
- [ ] Site works on mobile Safari, Chrome
- [ ] Dark mode looks intentional

---

## Appendix: Sample Case Studies

For demo purposes, create 4 fictional case studies:

1. **Nexus Tech** - SaaS startup rebrand
2. **Bloom Botanicals** - Organic skincare brand identity
3. **Velocity Sports** - Athletic apparel brand system
4. **Harbor Coffee** - Specialty coffee shop branding
