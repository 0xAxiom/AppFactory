/**
 * Farcaster Manifest Route
 *
 * Serves the mini app manifest at /.well-known/farcaster.json
 * This manifest is required for Base app discovery.
 */

import { NextResponse } from 'next/server';
import { minikitConfig, FarcasterManifest } from '../../../minikit.config';

export async function GET() {
  // Build the manifest from config
  const manifest: FarcasterManifest = {
    accountAssociation: minikitConfig.accountAssociation,
    frame: {
      name: minikitConfig.name,
      version: minikitConfig.version,
      iconUrl: minikitConfig.iconUrl,
      splashImageUrl: minikitConfig.splashImageUrl,
      splashBackgroundColor: '#1a1a2e',
      homeUrl: minikitConfig.homeUrl,
      webhookUrl: minikitConfig.webhookUrl,
      tagline: minikitConfig.tagline,
      subtitle: minikitConfig.tagline,
      description: minikitConfig.description,
      screenshotUrls: [],
      primaryCategory: minikitConfig.category,
      tags: minikitConfig.tags,
      heroImageUrl: minikitConfig.heroImageUrl,
      ogTitle: minikitConfig.name,
      ogDescription: minikitConfig.description,
      ogImageUrl: minikitConfig.ogImageUrl,
    },
  };

  return NextResponse.json(manifest);
}
