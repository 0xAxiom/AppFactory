# SEO Guidelines

**Purpose:** Search engine optimization rules for websites - metadata, structured data, and performance.

**Source:** Internal (website-pipeline specific)

---

## When to Activate

This skill activates during:

- **Phase 7** (SEO Review) - Comprehensive SEO audit

Trigger phrases:

- "Check SEO"
- "Review metadata"
- "Audit search optimization"
- "Check structured data"

---

## How to Use This Skill

1. **During Build:** Apply SEO patterns when creating pages
2. **Phase 7 Audit:** Run full SEO review after skills audit passes
3. **Gate Criteria:** All checklist items must pass

---

## Rule Categories

| Category        | Rules | Priority |
| --------------- | ----- | -------- |
| Technical SEO   | 8     | HIGH     |
| On-Page SEO     | 10    | HIGH     |
| Performance SEO | 6     | HIGH     |
| Social SEO      | 5     | MEDIUM   |

---

## Technical SEO (HIGH)

### robots.txt Configuration

```txt
# public/robots.txt

User-agent: *
Allow: /

# Disallow admin/private routes
Disallow: /api/
Disallow: /_next/

Sitemap: https://example.com/sitemap.xml
```

### Sitemap Generation

```typescript
// app/sitemap.ts (Next.js 14)
import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://example.com';

  // Static pages
  const staticPages = ['', '/about', '/work', '/contact'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic pages (e.g., blog posts, projects)
  const dynamicPages = projects.map((project) => ({
    url: `${baseUrl}/work/${project.slug}`,
    lastModified: project.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...dynamicPages];
}
```

### Canonical URLs

```tsx
// In page metadata
export const metadata: Metadata = {
  alternates: {
    canonical: 'https://example.com/about',
  },
};
```

### Structured Data (JSON-LD)

```tsx
// components/json-ld.tsx
export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Company Name',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-555-5555',
      contactType: 'customer service',
    },
    sameAs: ['https://twitter.com/company', 'https://linkedin.com/company/company'],
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

// For articles/blog posts
export function ArticleJsonLd({ title, description, image, datePublished, author }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    author: {
      '@type': 'Person',
      name: author,
    },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}
```

---

## On-Page SEO (HIGH)

### Title Tags

```tsx
// BAD
export const metadata: Metadata = {
  title: 'Home',
};

// GOOD - Unique, descriptive, < 60 chars
export const metadata: Metadata = {
  title: 'John Doe - Full Stack Developer & Designer',
};

// With template
// app/layout.tsx
export const metadata: Metadata = {
  title: {
    default: 'John Doe - Developer',
    template: '%s | John Doe',
  },
};

// app/about/page.tsx
export const metadata: Metadata = {
  title: 'About', // Renders as "About | John Doe"
};
```

### Meta Descriptions

```tsx
// BAD - Too short or missing
export const metadata: Metadata = {
  description: 'My website',
};

// GOOD - Compelling, 150-160 chars
export const metadata: Metadata = {
  description:
    'Full stack developer specializing in React, Next.js, and TypeScript. View my portfolio of web applications and get in touch for your next project.',
};
```

### Heading Hierarchy

```tsx
// BAD - Skipped heading levels
<h1>Page Title</h1>
<h3>Section Title</h3>  // Skipped h2!
<h4>Subsection</h4>

// GOOD - Proper hierarchy
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection</h3>
```

### Image Alt Text

```tsx
// BAD
<Image src="/project.jpg" alt="" />
<Image src="/project.jpg" alt="image" />
<Image src="/project.jpg" alt="project.jpg" />

// GOOD - Descriptive alt text
<Image
  src="/project.jpg"
  alt="Screenshot of e-commerce dashboard showing sales analytics"
/>

// For decorative images
<Image src="/decoration.svg" alt="" aria-hidden="true" />
```

### Internal Linking

```tsx
// BAD - External link to own site
<a href="https://example.com/about">About</a>

// GOOD - Internal link with Link component
import Link from 'next/link';

<Link href="/about">About</Link>

// With descriptive anchor text
// BAD
<Link href="/services">Click here</Link>

// GOOD
<Link href="/services">View our web development services</Link>
```

---

## Performance SEO (HIGH)

### Core Web Vitals Targets

| Metric | Target  | Impact         |
| ------ | ------- | -------------- |
| LCP    | < 2.5s  | Ranking factor |
| FID    | < 100ms | Ranking factor |
| CLS    | < 0.1   | Ranking factor |
| TTFB   | < 800ms | Affects LCP    |

### Image Optimization

```tsx
// REQUIRED: Use next/image
import Image from 'next/image';

// Above-the-fold images: priority
<Image
  src="/hero.jpg"
  alt="Hero description"
  width={1200}
  height={600}
  priority
  sizes="100vw"
/>

// Below-the-fold: lazy (default)
<Image
  src="/feature.jpg"
  alt="Feature description"
  width={600}
  height={400}
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

### Font Optimization

```tsx
// REQUIRED: Use next/font
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

### No Render-Blocking Resources

```tsx
// BAD - External stylesheets block render
<link href="https://fonts.googleapis.com/css?family=Inter" rel="stylesheet" />

// GOOD - Use next/font (self-hosted, no blocking)
// See font optimization above

// For third-party scripts
// BAD
<script src="https://analytics.example.com/script.js" />

// GOOD - Load after interactive
<Script
  src="https://analytics.example.com/script.js"
  strategy="afterInteractive"
/>
```

---

## Social SEO (MEDIUM)

### Open Graph Tags

```tsx
// app/layout.tsx or page-specific
export const metadata: Metadata = {
  openGraph: {
    title: 'John Doe - Developer Portfolio',
    description: 'Full stack developer specializing in React and Next.js',
    url: 'https://example.com',
    siteName: 'John Doe',
    images: [
      {
        url: 'https://example.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'John Doe Portfolio Preview',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};
```

### Twitter Cards

```tsx
export const metadata: Metadata = {
  twitter: {
    card: 'summary_large_image',
    title: 'John Doe - Developer Portfolio',
    description: 'Full stack developer specializing in React and Next.js',
    images: ['https://example.com/og-image.png'],
    creator: '@johndoe',
  },
};
```

### OG Image Requirements

- **Size:** 1200x630 pixels
- **Format:** PNG or JPG
- **Location:** `public/og-image.png`
- **Content:** Clear branding, readable text

---

## SEO Audit Checklist

```markdown
## Technical SEO

- [ ] robots.txt exists and is valid
- [ ] sitemap.xml is generated
- [ ] Canonical URLs are set
- [ ] Structured data (JSON-LD) present
- [ ] No broken internal links
- [ ] No redirect chains
- [ ] HTTPS enforced
- [ ] Valid HTML (no parsing errors)

## On-Page SEO

- [ ] Unique title tags (< 60 chars)
- [ ] Meta descriptions (150-160 chars)
- [ ] H1 on every page (only one)
- [ ] Proper heading hierarchy
- [ ] Alt text on all images
- [ ] Descriptive anchor text
- [ ] Internal linking present
- [ ] URL structure is clean
- [ ] No duplicate content
- [ ] Content is crawlable

## Performance SEO

- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] Images optimized (next/image)
- [ ] Fonts optimized (next/font)
- [ ] No render-blocking resources

## Social SEO

- [ ] Open Graph tags present
- [ ] Twitter Card tags present
- [ ] OG image exists (1200x630)
- [ ] Favicon present
- [ ] Apple touch icon present
```

---

## Audit Report Format

```markdown
# SEO Audit Report

**Website:** <slug>
**Audited:** <timestamp>

## Summary

| Category        | Passed | Failed | Score |
| --------------- | ------ | ------ | ----- |
| Technical SEO   | 7      | 1      | 88%   |
| On-Page SEO     | 9      | 1      | 90%   |
| Performance SEO | 6      | 0      | 100%  |
| Social SEO      | 5      | 0      | 100%  |

**Overall Score:** 95%
**Verdict:** PASS

## Issues Found

### [HIGH] Missing sitemap.xml

**Fix:** Add app/sitemap.ts to generate sitemap

### [MEDIUM] Meta description too short on /contact

**Current:** "Contact us"
**Fix:** Expand to 150-160 characters with call to action

## Recommendations

1. Add FAQ structured data to service pages
2. Consider adding breadcrumb structured data
3. Improve internal linking between related content
```

---

## Version

- **1.0** (2026-01-18): Initial release for website-pipeline
