# Sitemap

**Phase:** 3 - Information Architecture
**Timestamp:** 2026-01-18T10:10:00Z

---

## Page Hierarchy

```
/ (Home)
├── /work (Portfolio)
│   ├── /work/nexus-tech
│   ├── /work/bloom-botanicals
│   ├── /work/velocity-sports
│   └── /work/harbor-coffee
├── /services
├── /about
├── /contact
├── /privacy
├── /terms
└── /404 (Not Found)
```

---

## Page Details

| Route | Page Title | Purpose | Priority |
|-------|------------|---------|----------|
| `/` | Luminary Studio | Primary landing, hero, featured work | 1.0 |
| `/work` | Work - Luminary Studio | Portfolio grid with filtering | 0.9 |
| `/work/[slug]` | [Project] - Luminary Studio | Case study deep dive | 0.8 |
| `/services` | Services - Luminary Studio | Service offerings | 0.8 |
| `/about` | About - Luminary Studio | Team, story, philosophy | 0.8 |
| `/contact` | Contact - Luminary Studio | Inquiry form | 0.9 |
| `/privacy` | Privacy Policy - Luminary Studio | Legal requirement | 0.3 |
| `/terms` | Terms of Service - Luminary Studio | Legal requirement | 0.3 |
| `/404` | Not Found - Luminary Studio | Error handling | 0.1 |

---

## URL Structure

### Principles
- Clean, readable URLs (no IDs or query params)
- Lowercase with hyphens
- Max 3 levels deep
- Descriptive slugs

### Examples
```
✅ /work/nexus-tech
✅ /services
✅ /about

❌ /work?id=123
❌ /Work/NexusTech
❌ /portfolio/case-studies/brand-identity/nexus-tech
```

---

## Sitemap XML Configuration

```typescript
// app/sitemap.ts
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://luminary.studio';

  const staticPages = [
    { url: baseUrl, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${baseUrl}/work`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/services`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, changeFrequency: 'yearly', priority: 0.9 },
  ];

  const projects = ['nexus-tech', 'bloom-botanicals', 'velocity-sports', 'harbor-coffee'];
  const projectPages = projects.map(slug => ({
    url: `${baseUrl}/work/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...projectPages];
}
```

---

## robots.txt Configuration

```txt
User-agent: *
Allow: /

Disallow: /api/
Disallow: /_next/

Sitemap: https://luminary.studio/sitemap.xml
```
