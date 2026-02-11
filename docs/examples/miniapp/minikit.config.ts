/**
 * MiniKit Configuration
 *
 * This is the single source of truth for your mini app's manifest.
 * Update these values and the manifest route will automatically reflect them.
 *
 * IMPORTANT: You must complete account association before deploying.
 * See: https://docs.base.org/buildingonbase/guides/miniapps/sign-manifest
 */

export const minikitConfig = {
  // App Identity - nested under miniapp to match template structure
  miniapp: {
    name: 'Mini App Example',
    subtitle: 'A minimal Base Mini App', // Max 30 characters (was: tagline)
    description:
      'A minimal example demonstrating the MiniApp Pipeline structure from App Factory.', // Max 170 characters

    // URLs (update after deploying)
    homeUrl: 'https://your-app.vercel.app',
    webhookUrl: 'https://your-app.vercel.app/api/webhook',

    // Images (relative to public/)
    iconUrl: '/icon.png', // 1024x1024
    splashImageUrl: '/splash.png', // 200x200
    heroImageUrl: '/hero.png', // 1200x630
    ogImageUrl: '/og.png', // 1200x630

    // OG metadata
    ogTitle: 'Mini App Example',
    ogDescription: 'A minimal Base Mini App example from App Factory',

    // Discovery
    category: 'utility' as const, // See categories below
    tags: ['example', 'demo', 'appfactory'],

    // Version
    version: '1.0.0',
  },

  // Account Association (REQUIRED - complete at base.dev)
  // These values must be obtained from the Base account association flow
  accountAssociation: {
    header: '', // Base64 encoded header - fill in after signing
    payload: '', // Base64 encoded payload - fill in after signing
    signature: '', // Signature - fill in after signing
  },
};

/**
 * Valid categories:
 * - games
 * - social
 * - finance
 * - utility
 * - productivity
 * - health-fitness
 * - news-media
 * - music
 * - shopping
 * - education
 * - developer-tools
 * - entertainment
 * - art-creativity
 */

/**
 * Manifest type for TypeScript
 */
export interface FarcasterManifest {
  accountAssociation: {
    header: string;
    payload: string;
    signature: string;
  };
  frame: {
    name: string;
    version: string;
    iconUrl: string;
    splashImageUrl: string;
    splashBackgroundColor: string;
    homeUrl: string;
    webhookUrl: string;
    subtitle: string;
    description: string;
    screenshotUrls: string[];
    primaryCategory: string;
    tags: string[];
    heroImageUrl: string;
    ogTitle: string;
    ogDescription: string;
    ogImageUrl: string;
  };
}
