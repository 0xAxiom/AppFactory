export interface TeamMember {
  name: string;
  role: string;
  image: string;
  imageAlt: string;
  bio: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    dribbble?: string;
  };
  order: number;
}

export const team: TeamMember[] = [
  {
    name: 'Alex Chen',
    role: 'Founder & Creative Director',
    image: '/team/alex.jpg',
    imageAlt: 'Alex Chen, Founder and Creative Director at Luminary Studio',
    bio: 'Alex founded Luminary after a decade leading brand teams at top agencies including Pentagram and Collins. Obsessed with the intersection of strategy and craft, Alex believes great brands are built on truth and expressed through beauty.',
    social: {
      linkedin: 'alexchen',
      twitter: 'alexchen',
    },
    order: 1,
  },
  {
    name: 'Maya Rodriguez',
    role: 'Design Director',
    image: '/team/maya.jpg',
    imageAlt: 'Maya Rodriguez, Design Director at Luminary Studio',
    bio: 'Maya brings 8 years of experience crafting visual identities for brands across technology, wellness, and consumer goods. Former lead designer at Collins, she has a gift for translating complex brand strategies into compelling visual systems.',
    social: {
      dribbble: 'mayarodriguez',
      linkedin: 'mayarodriguez',
    },
    order: 2,
  },
  {
    name: 'Jordan Park',
    role: 'Senior Designer',
    image: '/team/jordan.jpg',
    imageAlt: 'Jordan Park, Senior Designer at Luminary Studio',
    bio: 'Jordan specializes in packaging and print design, with award-winning work for clients across food and beverage, beauty, and retail. Their attention to material and production detail ensures every design translates beautifully to the real world.',
    social: {
      dribbble: 'jordanpark',
    },
    order: 3,
  },
  {
    name: 'Sam Turner',
    role: 'Brand Strategist',
    image: '/team/sam.jpg',
    imageAlt: 'Sam Turner, Brand Strategist at Luminary Studio',
    bio: 'Sam leads strategy engagements, helping clients uncover their unique position and articulate their brand story. With a background in psychology and marketing, they bring a research-driven approach to every project.',
    social: {
      linkedin: 'samturner',
      twitter: 'samturner',
    },
    order: 4,
  },
];
