/**
 * MiniKit Configuration for Commit
 *
 * Stake ETH on your goals - accountability with skin in the game.
 */

const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000');

export const minikitConfig = {
  accountAssociation: {
    header: '', // FILL AFTER SIGNING - Stage M5
    payload: '', // FILL AFTER SIGNING - Stage M5
    signature: '', // FILL AFTER SIGNING - Stage M5
  },

  miniapp: {
    version: '1',
    name: 'Commit',
    subtitle: 'Stake ETH on your goals',
    description:
      'Set goals, stake crypto, get an accountability partner. Complete your goal and get your stake back. Fail and lose it.',
    tagline: 'Put your money where your mouth is',

    primaryCategory: 'productivity' as const,
    tags: ['goals', 'accountability', 'staking', 'productivity', 'social'],

    homeUrl: ROOT_URL,
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    heroImageUrl: `${ROOT_URL}/hero.png`,
    screenshotUrls: [
      `${ROOT_URL}/screenshots/1.png`,
      `${ROOT_URL}/screenshots/2.png`,
      `${ROOT_URL}/screenshots/3.png`,
    ],
    webhookUrl: `${ROOT_URL}/api/webhook`,

    splashBackgroundColor: '#0A0A0A',

    ogTitle: 'Commit - Stake ETH on Your Goals',
    ogDescription:
      'Accountability with skin in the game. Stake crypto on your goals, get verified by friends.',
    ogImageUrl: `${ROOT_URL}/og.png`,
  },
} as const;

export type MinikitConfig = typeof minikitConfig;
