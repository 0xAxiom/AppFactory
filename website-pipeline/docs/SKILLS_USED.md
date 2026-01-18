# Website Pipeline Skills Reference

**Pipeline:** website-pipeline
**Skills System:** See `/docs/pipelines/SKILLS_SYSTEM.md`

---

## Registered Skills

| Skill ID | Location | Source | Purpose |
|----------|----------|--------|---------|
| `website-pipeline:react-best-practices` | `skills/react-best-practices/` | Vercel agent-skills | React/Next.js performance |
| `website-pipeline:web-design-guidelines` | `skills/web-design-guidelines/` | Vercel agent-skills | UI/UX/accessibility |
| `website-pipeline:seo-guidelines` | `skills/seo-guidelines/` | Internal | SEO compliance |

---

## Skill Invocation Schedule

| Phase | Skill | Purpose |
|-------|-------|---------|
| Phase 5 (Build) | All | Reference during development |
| Phase 6 (Skills Audit) | react-best-practices | MANDATORY performance check |
| Phase 6 (Skills Audit) | web-design-guidelines | MANDATORY a11y/UX check |
| Phase 7 (SEO Review) | seo-guidelines | MANDATORY SEO check |
| Phase 8 (Ralph) | All | Final compliance verification |

---

## react-best-practices

### Summary

40+ rules for React/Next.js performance optimization, organized by impact.

### CRITICAL Rules

| Rule ID | Description | Auto-fixable |
|---------|-------------|--------------|
| async-parallel | Use Promise.all for parallel operations | Yes |
| async-defer-await | Defer await until needed | Yes |
| bundle-imports | Avoid barrel file imports | Yes |
| bundle-dynamic-imports | Code split large dependencies | Yes |

### Quick Fix Examples

```typescript
// CRITICAL: async-parallel
// Before
const user = await getUser();
const posts = await getPosts();

// After
const [user, posts] = await Promise.all([getUser(), getPosts()]);
```

```typescript
// CRITICAL: bundle-imports
// Before
import { Button, Card } from '@/components';

// After
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
```

### Gate Criteria

- **Score threshold:** ≥95%
- **Blocking:** Any CRITICAL violation
- **Weight in Ralph:** 15%

### Full Reference

See `skills/react-best-practices/SKILL.md`

---

## web-design-guidelines

### Summary

100+ rules for UI/UX quality, accessibility, and design polish.

### HIGH Rules (Accessibility)

| Rule ID | Description | WCAG |
|---------|-------------|------|
| AC1 | Semantic HTML | 1.3.1 |
| AC2 | ARIA labels | 4.1.2 |
| AC3 | Color contrast ≥4.5:1 | 1.4.3 |
| AC4 | Keyboard navigation | 2.1.1 |
| AC5 | Focus management | 2.4.3 |
| AC8 | Reduced motion | 2.3.3 |

### MEDIUM Rules (Animation)

| Rule ID | Description |
|---------|-------------|
| AN1 | Page entrance animation (Framer Motion) |
| AN2 | Hover/tap feedback |
| AN5 | Stagger list animations |

### MEDIUM Rules (Loading States)

| Rule ID | Description |
|---------|-------------|
| LS1 | Skeleton loaders (not spinners) |
| LS2 | Button loading states |

### Quick Fix Examples

```tsx
// HIGH: AC2 - ARIA labels
// Before
<button onClick={close}><XIcon /></button>

// After
<button onClick={close} aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>
```

```tsx
// MEDIUM: AN1 - Page entrance animation
// Before
export default function Page() {
  return <div>Content</div>;
}

// After
import { motion } from 'framer-motion';

export default function Page() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      Content
    </motion.div>
  );
}
```

### Gate Criteria

- **Score threshold:** ≥90%
- **Blocking:** Any HIGH accessibility violation
- **Weight in Ralph:** 15%

### Full Reference

See `skills/web-design-guidelines/SKILL.md`

---

## seo-guidelines

### Summary

SEO rules specific to websites - metadata, structured data, performance.

### Technical SEO

| Rule | Required |
|------|----------|
| robots.txt | Yes |
| sitemap.xml | Yes |
| Canonical URLs | Yes |
| Structured data (JSON-LD) | Recommended |

### On-Page SEO

| Rule | Requirement |
|------|-------------|
| Title tags | Unique, < 60 chars |
| Meta descriptions | 150-160 chars |
| Heading hierarchy | Proper, no skipping |
| Image alt text | Descriptive |

### Performance SEO

| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |

### Quick Fix Examples

```tsx
// Title tags
export const metadata: Metadata = {
  title: 'John Doe - Full Stack Developer & Designer',
  description: 'Full stack developer specializing in React, Next.js, and TypeScript. View my portfolio and get in touch.',
};
```

```tsx
// Structured data
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'John Doe',
      jobTitle: 'Full Stack Developer',
      url: 'https://johndoe.com',
    }),
  }}
/>
```

### Gate Criteria

- **All checklist items must pass**
- **Produces:** seo_review.md report
- **Weight in Ralph:** 10%

### Full Reference

See `skills/seo-guidelines/SKILL.md`

---

## Combined Skill Compliance in Ralph

Ralph report integrates all skill scores:

```markdown
## Skills Compliance Summary

| Skill | Score | Status | Weight |
|-------|-------|--------|--------|
| react-best-practices | 97% | PASS | 15% |
| web-design-guidelines | 92% | PASS | 15% |
| seo-guidelines | 100% | PASS | 10% |

**Weighted Skills Score:** 96%

### Violations Summary

| Severity | Count | Fixed |
|----------|-------|-------|
| CRITICAL | 0 | N/A |
| HIGH | 0 | N/A |
| MEDIUM | 3 | 3 |
| LOW | 1 | 0 |

### Audit Reports

- [x] audits/react-best-practices.md
- [x] audits/web-design-guidelines.md
- [x] audits/seo_review.md
- [x] audits/audit_summary.md
```

---

## Updating Skills

### From Vercel Agent-Skills

1. Check https://github.com/vercel-labs/agent-skills for updates
2. Compare with local `skills/<skill>/SKILL.md`
3. Merge changes, preserve website-specific customizations
4. Update version in SKILL.md
5. Test with sample website build

### Internal Skills (seo-guidelines)

1. Review SEO best practices documentation
2. Update rules based on Google/Core Web Vitals changes
3. Test against existing websites
4. Update version

---

## Version History

- **1.0** (2026-01-18): Initial skills documentation
