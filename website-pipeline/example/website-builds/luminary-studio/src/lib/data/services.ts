export interface Service {
  slug: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  order: number;
}

export const services: Service[] = [
  {
    slug: 'brand-identity',
    title: 'Brand Identity',
    description: 'Complete visual identity systems that capture your essence and resonate with your audience. From logo to full brand language.',
    icon: 'Palette',
    features: [
      'Logo design (primary, secondary, icon)',
      'Color palette definition',
      'Typography selection and hierarchy',
      'Visual language guidelines',
      'Brand voice and tone',
    ],
    order: 1,
  },
  {
    slug: 'visual-systems',
    title: 'Visual Systems',
    description: 'Comprehensive design systems that scale with your brand. Every element working together in harmony.',
    icon: 'Layers',
    features: [
      'Custom icon sets',
      'Illustration style guides',
      'Photography direction',
      'Pattern and texture libraries',
      'Motion design principles',
    ],
    order: 2,
  },
  {
    slug: 'brand-guidelines',
    title: 'Brand Guidelines',
    description: 'Documentation that ensures consistency across every touchpoint. Your brand, applied perfectly, every time.',
    icon: 'FileText',
    features: [
      'Comprehensive usage rules',
      'Do\'s and don\'ts examples',
      'Application templates',
      'Digital asset libraries',
      'Training and onboarding materials',
    ],
    order: 3,
  },
  {
    slug: 'packaging-design',
    title: 'Packaging Design',
    description: 'Packaging that stands out on shelves and in feeds. Designed to protect your product and tell your story.',
    icon: 'Package',
    features: [
      'Structural design',
      'Label and wrap design',
      'Material selection',
      'Sustainability consulting',
      'Production-ready files',
    ],
    order: 4,
  },
];
