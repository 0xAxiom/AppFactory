# SaaS Landing Page Template

**Pipeline**: website-pipeline
**Category**: Business / Marketing
**Complexity**: Medium

---

## Description

A high-converting SaaS landing page template with hero section, feature showcases, pricing tables, testimonials, and lead capture. Optimized for conversions and SEO.

---

## Pre-Configured Features

### Core Sections

- Hero with headline, subheadline, and CTA
- Social proof bar (logos, stats)
- Feature showcase with icons
- Pricing table (3-tier)
- Testimonials with photos
- FAQ accordion
- Final CTA section

### UI Components

- Animated statistics counters
- Feature comparison table
- Pricing toggle (monthly/yearly)
- Testimonial carousel
- Newsletter signup form
- Cookie consent banner

### Performance

- Optimized for Core Web Vitals
- Above-fold content prioritized
- Lazy load below-fold images
- Static generation

---

## Ideal For

- SaaS products
- B2B services
- Developer tools
- Productivity apps
- Marketing tools
- Any subscription product

---

## File Structure

```
website-builds/<slug>/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Full landing page
│   │   ├── pricing/
│   │   │   └── page.tsx      # Detailed pricing
│   │   ├── features/
│   │   │   └── page.tsx      # Feature deep-dive
│   │   ├── about/
│   │   │   └── page.tsx      # Company info
│   │   ├── contact/
│   │   │   └── page.tsx      # Contact/demo request
│   │   └── globals.css
│   ├── components/
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── SocialProof.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── FAQ.tsx
│   │   │   └── CTA.tsx
│   │   ├── pricing/
│   │   │   ├── PricingCard.tsx
│   │   │   ├── PricingToggle.tsx
│   │   │   └── FeatureList.tsx
│   │   ├── ui/               # shadcn/ui
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── lib/
│   │   ├── pricing.ts        # Pricing data
│   │   └── testimonials.ts   # Testimonial data
│   └── styles/
│       └── design-tokens.ts
├── public/
│   ├── logos/                # Customer logos
│   ├── screenshots/          # Product screenshots
│   └── og-image.png
├── research/
│   ├── market_research.md
│   ├── competitor_analysis.md
│   └── positioning.md
├── audits/
│   ├── react-best-practices.md
│   └── web-design-guidelines.md
└── ralph/
    └── PROGRESS.md
```

---

## Default Tech Stack

| Component | Technology                     |
| --------- | ------------------------------ |
| Framework | Next.js 14 (App Router)        |
| Language  | TypeScript                     |
| Styling   | Tailwind CSS                   |
| UI        | shadcn/ui                      |
| Animation | Framer Motion                  |
| Forms     | React Hook Form + Zod          |
| SEO       | next-seo                       |
| Analytics | (placeholder for GA/Plausible) |

---

## Usage

When using this template in Phase 0, Claude will:

1. Normalize your idea for conversion optimization
2. Pre-configure pricing tier structure
3. Set up lead capture forms
4. Include SaaS market research

**Example prompt enhancement:**

- User says: "landing page for my project management tool"
- Template adds: hero with product screenshot, feature grid with icons, 3-tier pricing (Free/Pro/Enterprise), customer logos section, testimonials from team leads, FAQ about integrations and security

---

## Design System Defaults

```typescript
// design-tokens.ts (pre-configured)
{
  colors: {
    primary: "blue",
    secondary: "slate",
    accent: "violet",
    success: "green",
    background: {
      light: "#ffffff",
      dark: "#0f172a"
    }
  },
  typography: {
    headings: "Inter",
    body: "Inter"
  },
  spacing: {
    section: "py-20 md:py-32"
  }
}
```

---

## Pricing Structure Default

```typescript
// lib/pricing.ts (pre-configured)
{
  tiers: [
    {
      name: 'Starter',
      price: { monthly: 0, yearly: 0 },
      features: ['5 projects', 'Basic support', '1 team member'],
      cta: 'Start Free',
    },
    {
      name: 'Pro',
      price: { monthly: 19, yearly: 190 },
      features: ['Unlimited projects', 'Priority support', '10 team members', 'Advanced analytics'],
      cta: 'Start Trial',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: { monthly: null, yearly: null }, // Contact sales
      features: ['Everything in Pro', 'Dedicated support', 'Custom integrations', 'SLA guarantee'],
      cta: 'Contact Sales',
    },
  ];
}
```

---

## Customization Points

| Element        | How to Customize                          |
| -------------- | ----------------------------------------- |
| Hero headline  | Edit `components/sections/Hero.tsx`       |
| Pricing tiers  | Update `lib/pricing.ts`                   |
| Features list  | Modify `components/sections/Features.tsx` |
| Customer logos | Add to `public/logos/`                    |
| Testimonials   | Edit `lib/testimonials.ts`                |
| FAQ content    | Update `components/sections/FAQ.tsx`      |

---

## Quality Expectations

When using this template, Ralph will check for:

- [ ] Hero loads instantly above fold
- [ ] CTA buttons are prominent and accessible
- [ ] Pricing toggle switches correctly
- [ ] Testimonials show real-looking content
- [ ] FAQ accordion works smoothly
- [ ] Forms validate and show feedback
- [ ] Social proof logos display properly
- [ ] Mobile layout converts well
- [ ] Page speed score > 90
- [ ] All links have hover states

---

## Conversion Optimization

```markdown
Pre-configured for conversions:

- [ ] Above-fold CTA visible
- [ ] Pricing visible without scrolling far
- [ ] Trust signals (logos, testimonials) prominent
- [ ] FAQ addresses common objections
- [ ] Multiple CTAs throughout page
- [ ] Mobile-optimized forms
- [ ] Fast load time for lower bounce
```
