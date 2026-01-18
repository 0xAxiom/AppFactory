# Content Model

**Phase:** 3 - Information Architecture
**Timestamp:** 2026-01-18T10:11:00Z

---

## Content Types

### 1. Project (Case Study)

```typescript
interface Project {
  // Identification
  slug: string;              // URL slug
  title: string;             // Project/client name

  // Hero
  heroImage: string;         // Full-width hero image
  heroAlt: string;           // Alt text for hero

  // Overview
  client: string;            // Client name
  industry: string;          // Industry category
  year: number;              // Year completed
  services: string[];        // Services provided
  excerpt: string;           // Short description (150 chars)

  // Content Sections
  challenge: string;         // The problem/opportunity
  solution: string;          // Our approach
  results?: string;          // Outcomes (optional)

  // Gallery
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];

  // Metadata
  featured: boolean;         // Show on home page
  category: ProjectCategory; // For filtering
  order: number;             // Sort order

  // SEO
  metaTitle?: string;        // Override title
  metaDescription?: string;  // Override description
  ogImage?: string;          // Override OG image
}

type ProjectCategory = 'brand-identity' | 'packaging' | 'digital' | 'print';
```

### 2. Service

```typescript
interface Service {
  slug: string;
  title: string;
  description: string;
  icon: string;             // Lucide icon name
  features: string[];       // Bullet points
  order: number;
}
```

### 3. Team Member

```typescript
interface TeamMember {
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  bio?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    dribbble?: string;
  };
  order: number;
}
```

### 4. Testimonial

```typescript
interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  projectSlug?: string;     // Link to related project
}
```

---

## Sample Content

### Projects

```typescript
const projects: Project[] = [
  {
    slug: 'nexus-tech',
    title: 'Nexus Tech',
    heroImage: '/projects/nexus/hero.jpg',
    heroAlt: 'Nexus Tech brand identity hero showing logo on dark background',
    client: 'Nexus Technologies',
    industry: 'Technology',
    year: 2025,
    services: ['Brand Identity', 'Visual System', 'Brand Guidelines'],
    excerpt: 'A bold rebrand for a B2B SaaS platform helping teams collaborate smarter.',
    challenge: 'Nexus needed to evolve from a startup look to an enterprise-ready brand without losing their innovative spirit.',
    solution: 'We created a dynamic identity system built around the concept of connection—nodes linking together to form something greater.',
    results: 'Post-rebrand, Nexus saw a 40% increase in enterprise demo requests.',
    images: [
      { src: '/projects/nexus/logo.jpg', alt: 'Nexus logo in primary and alternate versions' },
      { src: '/projects/nexus/colors.jpg', alt: 'Nexus color palette' },
      { src: '/projects/nexus/applications.jpg', alt: 'Nexus brand applied to business cards and website' },
    ],
    featured: true,
    category: 'brand-identity',
    order: 1,
  },
  {
    slug: 'bloom-botanicals',
    title: 'Bloom Botanicals',
    heroImage: '/projects/bloom/hero.jpg',
    heroAlt: 'Bloom Botanicals packaging photography with plants',
    client: 'Bloom Botanicals',
    industry: 'Beauty & Wellness',
    year: 2025,
    services: ['Brand Identity', 'Packaging Design', 'Photography Direction'],
    excerpt: 'Organic skincare brand identity rooted in nature and sustainability.',
    challenge: 'Bloom needed a brand that communicated premium quality and environmental responsibility without feeling clinical.',
    solution: 'We developed a warm, organic visual language featuring hand-drawn botanical illustrations and earthy tones.',
    images: [
      { src: '/projects/bloom/logo.jpg', alt: 'Bloom Botanicals logo' },
      { src: '/projects/bloom/packaging.jpg', alt: 'Product packaging lineup' },
      { src: '/projects/bloom/lifestyle.jpg', alt: 'Lifestyle photography' },
    ],
    featured: true,
    category: 'packaging',
    order: 2,
  },
  // ... additional projects
];
```

### Services

```typescript
const services: Service[] = [
  {
    slug: 'brand-identity',
    title: 'Brand Identity',
    description: 'Complete visual identity systems that capture your essence and resonate with your audience.',
    icon: 'Palette',
    features: [
      'Logo design (primary, secondary, icon)',
      'Color palette definition',
      'Typography selection',
      'Visual language guidelines',
    ],
    order: 1,
  },
  {
    slug: 'visual-systems',
    title: 'Visual Systems',
    description: 'Comprehensive design systems that scale with your brand.',
    icon: 'Layers',
    features: [
      'Icon sets',
      'Illustration style',
      'Photography direction',
      'Pattern libraries',
    ],
    order: 2,
  },
  {
    slug: 'brand-guidelines',
    title: 'Brand Guidelines',
    description: 'Documentation that ensures consistency across every touchpoint.',
    icon: 'FileText',
    features: [
      'Usage rules and examples',
      'Do\'s and don\'ts',
      'Application templates',
      'Asset libraries',
    ],
    order: 3,
  },
  {
    slug: 'packaging-design',
    title: 'Packaging Design',
    description: 'Packaging that stands out on shelves and in feeds.',
    icon: 'Package',
    features: [
      'Structural design',
      'Label and wrap design',
      'Material selection',
      'Production-ready files',
    ],
    order: 4,
  },
];
```

### Team Members

```typescript
const team: TeamMember[] = [
  {
    name: 'Alex Chen',
    role: 'Founder & Creative Director',
    image: '/team/alex.jpg',
    imageAlt: 'Alex Chen headshot',
    bio: 'Alex founded Luminary after a decade leading brand teams at top agencies. Obsessed with the intersection of strategy and craft.',
    social: { linkedin: 'alexchen', twitter: 'alexchen' },
    order: 1,
  },
  {
    name: 'Maya Rodriguez',
    role: 'Design Director',
    image: '/team/maya.jpg',
    imageAlt: 'Maya Rodriguez headshot',
    bio: 'Maya brings 8 years of experience in visual identity design. Former lead designer at Collins.',
    social: { dribbble: 'mayarodriguez' },
    order: 2,
  },
  {
    name: 'Jordan Park',
    role: 'Senior Designer',
    image: '/team/jordan.jpg',
    imageAlt: 'Jordan Park headshot',
    bio: 'Jordan specializes in packaging and print design. Award-winning work for clients across industries.',
    order: 3,
  },
];
```

---

## Content Relationships

```
Home
  └── Featured Projects (3-4 projects, featured: true)
  └── Testimonial (1 testimonial)

Work
  └── All Projects (filterable by category)
      └── Case Study (full project detail)
          └── Related Projects (same category)

Services
  └── All Services
      └── Service Detail (on same page)

About
  └── Team Members
```

---

## Content Storage

For this demo, content is stored as TypeScript constants in `/src/lib/data/`.

```
src/lib/data/
├── projects.ts
├── services.ts
├── team.ts
└── testimonials.ts
```

Future: Could migrate to MDX, Contentlayer, or headless CMS.
