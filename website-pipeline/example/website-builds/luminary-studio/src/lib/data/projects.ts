export interface Project {
  slug: string;
  title: string;
  heroImage: string;
  heroAlt: string;
  client: string;
  industry: string;
  year: number;
  services: string[];
  excerpt: string;
  challenge: string;
  solution: string;
  results?: string;
  images: {
    src: string;
    alt: string;
    caption?: string;
  }[];
  featured: boolean;
  category: 'brand-identity' | 'packaging' | 'digital' | 'print';
  order: number;
}

export const projects: Project[] = [
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
    challenge: 'Nexus had outgrown their startup-era identity. As they expanded into enterprise markets, they needed a brand that conveyed trust, innovation, and scalability without losing the energy that made them successful.',
    solution: 'We created a dynamic identity system built around the concept of connection—nodes linking together to form something greater. The modular logo adapts across contexts while maintaining recognition. A sophisticated color palette of deep navy and electric blue conveys both stability and forward momentum.',
    results: 'Post-rebrand, Nexus saw a 40% increase in enterprise demo requests and improved close rates with Fortune 500 prospects.',
    images: [
      { src: '/projects/nexus/logo.jpg', alt: 'Nexus logo in primary and alternate versions' },
      { src: '/projects/nexus/colors.jpg', alt: 'Nexus color palette with primary and accent colors' },
      { src: '/projects/nexus/typography.jpg', alt: 'Nexus typography system' },
      { src: '/projects/nexus/applications.jpg', alt: 'Nexus brand applied to business cards and stationery' },
      { src: '/projects/nexus/website.jpg', alt: 'Nexus website homepage design' },
    ],
    featured: true,
    category: 'brand-identity',
    order: 1,
  },
  {
    slug: 'bloom-botanicals',
    title: 'Bloom Botanicals',
    heroImage: '/projects/bloom/hero.jpg',
    heroAlt: 'Bloom Botanicals packaging photography with plants and natural elements',
    client: 'Bloom Botanicals',
    industry: 'Beauty & Wellness',
    year: 2025,
    services: ['Brand Identity', 'Packaging Design', 'Photography Direction'],
    excerpt: 'Organic skincare brand identity rooted in nature and sustainability.',
    challenge: 'Bloom needed a brand that communicated premium quality and environmental responsibility without feeling clinical or preachy. They wanted to stand out in a crowded wellness market while appealing to conscious consumers.',
    solution: 'We developed a warm, organic visual language featuring hand-drawn botanical illustrations and earthy tones. The identity feels crafted and personal, reflecting the handmade nature of their products. Sustainable packaging materials reinforce the brand message.',
    results: 'Bloom launched to immediate sell-out success, with the rebrand contributing to a 65% increase in direct-to-consumer sales.',
    images: [
      { src: '/projects/bloom/logo.jpg', alt: 'Bloom Botanicals logo with botanical illustration' },
      { src: '/projects/bloom/packaging.jpg', alt: 'Product packaging lineup showing various products' },
      { src: '/projects/bloom/details.jpg', alt: 'Close-up of packaging details and textures' },
      { src: '/projects/bloom/lifestyle.jpg', alt: 'Lifestyle photography showing products in use' },
    ],
    featured: true,
    category: 'packaging',
    order: 2,
  },
  {
    slug: 'velocity-sports',
    title: 'Velocity Sports',
    heroImage: '/projects/velocity/hero.jpg',
    heroAlt: 'Velocity Sports athletic apparel brand identity',
    client: 'Velocity Athletics',
    industry: 'Sports & Fitness',
    year: 2024,
    services: ['Brand Identity', 'Visual System', 'Retail Design'],
    excerpt: 'High-performance athletic brand built for the next generation of athletes.',
    challenge: 'Velocity was entering a market dominated by legacy brands. They needed an identity that felt fresh and relevant to younger athletes while maintaining the credibility expected in performance gear.',
    solution: 'We crafted a kinetic identity system that captures movement and speed. The angular logomark suggests forward motion, while a bold color palette of black, white, and electric orange commands attention. Dynamic typography treatments bring energy to every touchpoint.',
    images: [
      { src: '/projects/velocity/logo.jpg', alt: 'Velocity Sports logo' },
      { src: '/projects/velocity/apparel.jpg', alt: 'Athletic apparel featuring brand identity' },
      { src: '/projects/velocity/retail.jpg', alt: 'Retail store design concept' },
    ],
    featured: true,
    category: 'brand-identity',
    order: 3,
  },
  {
    slug: 'harbor-coffee',
    title: 'Harbor Coffee',
    heroImage: '/projects/harbor/hero.jpg',
    heroAlt: 'Harbor Coffee brand identity with coffee cup and packaging',
    client: 'Harbor Coffee Roasters',
    industry: 'Food & Beverage',
    year: 2024,
    services: ['Brand Identity', 'Packaging Design', 'Environmental Design'],
    excerpt: 'Specialty coffee brand celebrating maritime heritage and craft roasting.',
    challenge: 'Harbor Coffee wanted to honor their coastal location while avoiding clichéd nautical themes. They needed a brand that felt premium and artisanal without being pretentious.',
    solution: 'We developed an identity inspired by vintage maritime maps and navigational tools. Subtle wave patterns and compass motifs add depth without overwhelming. A rich, warm color palette evokes the comfort of a great cup of coffee.',
    images: [
      { src: '/projects/harbor/logo.jpg', alt: 'Harbor Coffee logo' },
      { src: '/projects/harbor/bags.jpg', alt: 'Coffee bag packaging design' },
      { src: '/projects/harbor/cups.jpg', alt: 'Branded coffee cups and merchandise' },
      { src: '/projects/harbor/shop.jpg', alt: 'Coffee shop interior design' },
    ],
    featured: true,
    category: 'packaging',
    order: 4,
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);
}

export function getProjectsByCategory(category: Project['category']): Project[] {
  return projects.filter((p) => p.category === category);
}
