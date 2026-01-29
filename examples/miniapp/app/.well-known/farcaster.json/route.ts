/**
 * Farcaster Manifest Route
 *
 * Serves the mini app manifest at /.well-known/farcaster.json
 * This manifest is required for Base app discovery.
 */

import { NextResponse } from 'next/server';
import { minikitConfig, FarcasterManifest } from '../../../minikit.config';

export async function GET() {
  const { miniapp } = minikitConfig;
  
  // Build the manifest from config
  const manifest: FarcasterManifest = {
    accountAssociation: minikitConfig.accountAssociation,
    frame: {
      name: miniapp.name,
      version: miniapp.version,
      iconUrl: miniapp.iconUrl,
      splashImageUrl: miniapp.splashImageUrl,
      splashBackgroundColor: '#1a1a2e',
      homeUrl: miniapp.homeUrl,
      webhookUrl: miniapp.webhookUrl,
      subtitle: miniapp.subtitle,
      description: miniapp.description,
      screenshotUrls: [],
      primaryCategory: miniapp.category,
      tags: miniapp.tags,
      heroImageUrl: miniapp.heroImageUrl,
      ogTitle: miniapp.ogTitle,
      ogDescription: miniapp.ogDescription,
      ogImageUrl: miniapp.ogImageUrl,
    },
  };

  return NextResponse.json(manifest);
}
