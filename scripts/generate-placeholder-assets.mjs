#!/usr/bin/env node
/**
 * App Factory - Shared Placeholder Asset Generator
 *
 * Generates deterministic placeholder assets for any pipeline.
 * Supports mobile apps, websites, miniapps, and plugins.
 *
 * Usage:
 *   node scripts/generate-placeholder-assets.mjs <project-name> <output-dir> [--profile <profile>]
 *
 * Profiles:
 *   mobile   - Expo app assets (icon, splash, adaptive-icon, favicon)
 *   web      - Website assets (og-image, favicon, logo, apple-touch-icon)
 *   miniapp  - Base Mini App assets (icon, splash, og-image, cover)
 *   plugin   - Plugin assets (icon only)
 *
 * Examples:
 *   node scripts/generate-placeholder-assets.mjs "My App" ./assets --profile mobile
 *   node scripts/generate-placeholder-assets.mjs "My Site" ./public --profile web
 */

import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

// ANSI colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

// Asset profiles for different pipeline types
const ASSET_PROFILES = {
  mobile: {
    name: 'Mobile App (Expo)',
    assets: {
      icon: {
        filename: 'icon.png',
        dimensions: { width: 1024, height: 1024 },
        required: true,
        description: 'App icon'
      },
      adaptiveIcon: {
        filename: 'adaptive-icon.png',
        dimensions: { width: 1024, height: 1024 },
        required: false,
        description: 'Android adaptive icon'
      },
      splash: {
        filename: 'splash.png',
        dimensions: { width: 1284, height: 2778 },
        required: true,
        description: 'Splash screen'
      },
      favicon: {
        filename: 'favicon.png',
        dimensions: { width: 32, height: 32 },
        required: false,
        description: 'Web favicon'
      }
    }
  },
  web: {
    name: 'Website',
    assets: {
      ogImage: {
        filename: 'og-image.png',
        dimensions: { width: 1200, height: 630 },
        required: true,
        description: 'Open Graph image'
      },
      favicon: {
        filename: 'favicon.ico',
        dimensions: { width: 32, height: 32 },
        required: true,
        description: 'Favicon'
      },
      faviconPng: {
        filename: 'favicon.png',
        dimensions: { width: 32, height: 32 },
        required: false,
        description: 'Favicon PNG'
      },
      appleTouchIcon: {
        filename: 'apple-touch-icon.png',
        dimensions: { width: 180, height: 180 },
        required: false,
        description: 'Apple touch icon'
      },
      logo: {
        filename: 'logo.png',
        dimensions: { width: 512, height: 512 },
        required: false,
        description: 'Logo'
      }
    }
  },
  miniapp: {
    name: 'Base Mini App',
    assets: {
      icon: {
        filename: 'icon.png',
        dimensions: { width: 512, height: 512 },
        required: true,
        description: 'App icon'
      },
      splash: {
        filename: 'splash.png',
        dimensions: { width: 1200, height: 1200 },
        required: true,
        description: 'Splash image'
      },
      ogImage: {
        filename: 'og-image.png',
        dimensions: { width: 1200, height: 630 },
        required: true,
        description: 'Open Graph image'
      },
      cover: {
        filename: 'cover.png',
        dimensions: { width: 1500, height: 500 },
        required: false,
        description: 'Cover image'
      }
    }
  },
  plugin: {
    name: 'Claude Plugin',
    assets: {
      icon: {
        filename: 'icon.png',
        dimensions: { width: 256, height: 256 },
        required: false,
        description: 'Plugin icon'
      }
    }
  }
};

// Color palettes for variety
const COLOR_PALETTES = [
  { bg: '#2563EB', fg: '#FFFFFF', accent: '#10B981' }, // Blue/Green
  { bg: '#7C3AED', fg: '#FFFFFF', accent: '#F59E0B' }, // Purple/Amber
  { bg: '#DC2626', fg: '#FFFFFF', accent: '#3B82F6' }, // Red/Blue
  { bg: '#059669', fg: '#FFFFFF', accent: '#8B5CF6' }, // Green/Purple
  { bg: '#0891B2', fg: '#FFFFFF', accent: '#F97316' }, // Cyan/Orange
  { bg: '#4F46E5', fg: '#FFFFFF', accent: '#10B981' }, // Indigo/Emerald
];

// Parse arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = {
    name: null,
    outputDir: null,
    profile: 'mobile',
    json: false
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--profile' && args[i + 1]) {
      config.profile = args[i + 1];
      i++;
    } else if (args[i] === '--json') {
      config.json = true;
    } else if (!args[i].startsWith('-')) {
      if (!config.name) config.name = args[i];
      else if (!config.outputDir) config.outputDir = args[i];
    }
  }

  return config;
}

// Get deterministic color palette based on name
function getColorPalette(name) {
  const hash = crypto.createHash('md5').update(name).digest('hex');
  const index = parseInt(hash.slice(0, 2), 16) % COLOR_PALETTES.length;
  return COLOR_PALETTES[index];
}

// Generate SVG content for an asset
function generateSVG(assetType, name, dimensions, colors) {
  const { width, height } = dimensions;
  const initial = name.charAt(0).toUpperCase();

  switch (assetType) {
    case 'icon':
    case 'adaptiveIcon':
    case 'appleTouchIcon':
    case 'logo':
      return `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${colors.bg}"/>
          <circle cx="50%" cy="50%" r="35%" fill="${colors.accent}"/>
          <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${width * 0.35}"
                fill="${colors.fg}" text-anchor="middle" dominant-baseline="central"
                font-weight="bold">${initial}</text>
        </svg>`;

    case 'splash':
      return `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${colors.bg}"/>
          <circle cx="50%" cy="40%" r="${Math.min(width, height) * 0.12}" fill="${colors.accent}"/>
          <text x="50%" y="40%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) * 0.08}"
                fill="${colors.fg}" text-anchor="middle" dominant-baseline="central"
                font-weight="bold">${initial}</text>
          <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) * 0.03}"
                fill="${colors.fg}" text-anchor="middle" dominant-baseline="central">${name}</text>
        </svg>`;

    case 'ogImage':
      return `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${colors.bg}"/>
          <circle cx="25%" cy="50%" r="${height * 0.25}" fill="${colors.accent}"/>
          <text x="25%" y="50%" font-family="Arial, sans-serif" font-size="${height * 0.2}"
                fill="${colors.fg}" text-anchor="middle" dominant-baseline="central"
                font-weight="bold">${initial}</text>
          <text x="65%" y="45%" font-family="Arial, sans-serif" font-size="${height * 0.08}"
                fill="${colors.fg}" text-anchor="middle" dominant-baseline="central"
                font-weight="bold">${name}</text>
          <text x="65%" y="60%" font-family="Arial, sans-serif" font-size="${height * 0.04}"
                fill="${colors.fg}" text-anchor="middle" dominant-baseline="central"
                opacity="0.8">Placeholder Image</text>
        </svg>`;

    case 'cover':
      return `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${colors.bg}"/>
          <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${height * 0.15}"
                fill="${colors.fg}" text-anchor="middle" dominant-baseline="central"
                font-weight="bold">${name}</text>
        </svg>`;

    case 'favicon':
    case 'faviconPng':
      return `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${colors.bg}" rx="4"/>
          <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${width * 0.6}"
                fill="${colors.fg}" text-anchor="middle" dominant-baseline="central"
                font-weight="bold">${initial}</text>
        </svg>`;

    default:
      return `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="${colors.bg}"/>
          <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) * 0.3}"
                fill="${colors.fg}" text-anchor="middle" dominant-baseline="central"
                font-weight="bold">${initial}</text>
        </svg>`;
  }
}

// Check if sharp is available
async function hasSharp() {
  try {
    await import('sharp');
    return true;
  } catch {
    return false;
  }
}

// Generate asset using sharp or fallback to SVG
async function generateAsset(assetType, config, name, targetPath, colors) {
  const svg = generateSVG(assetType, name, config.dimensions, colors);

  if (await hasSharp()) {
    const sharp = (await import('sharp')).default;
    await sharp(Buffer.from(svg))
      .resize(config.dimensions.width, config.dimensions.height)
      .png()
      .toFile(targetPath);
  } else {
    // Fallback: save as SVG (rename to .png but it's actually SVG)
    // Better than nothing for development
    const svgPath = targetPath.replace('.png', '.svg').replace('.ico', '.svg');
    await fs.writeFile(svgPath, svg);
    console.log(`  ${YELLOW}!${RESET} Sharp not available, saved as SVG: ${path.basename(svgPath)}`);
    return false;
  }

  return true;
}

// Calculate file hash
async function calculateHash(filePath) {
  try {
    const content = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
  } catch {
    return 'N/A';
  }
}

// Main generator
async function generateAssets(config) {
  const profile = ASSET_PROFILES[config.profile];

  if (!profile) {
    console.error(`${RED}Error: Unknown profile "${config.profile}"${RESET}`);
    console.log(`Available profiles: ${Object.keys(ASSET_PROFILES).join(', ')}`);
    process.exit(1);
  }

  const outputDir = path.resolve(config.outputDir);
  const colors = getColorPalette(config.name);

  console.log(`\n${BOLD}Placeholder Asset Generator${RESET}`);
  console.log(`${DIM}─────────────────────────────────────${RESET}`);
  console.log(`Project:  ${CYAN}${config.name}${RESET}`);
  console.log(`Profile:  ${profile.name}`);
  console.log(`Output:   ${DIM}${outputDir}${RESET}`);
  console.log(`${DIM}─────────────────────────────────────${RESET}\n`);

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  const results = [];
  const sharpAvailable = await hasSharp();

  if (!sharpAvailable) {
    console.log(`${YELLOW}Warning: Sharp not installed. Install with: npm install sharp${RESET}\n`);
  }

  for (const [assetType, assetConfig] of Object.entries(profile.assets)) {
    const targetPath = path.join(outputDir, assetConfig.filename);
    console.log(`Generating ${assetConfig.description}...`);

    try {
      const success = await generateAsset(
        assetType,
        assetConfig,
        config.name,
        targetPath,
        colors
      );

      if (success) {
        const stats = await fs.stat(targetPath);
        const hash = await calculateHash(targetPath);
        console.log(`  ${GREEN}✓${RESET} ${assetConfig.filename} (${assetConfig.dimensions.width}x${assetConfig.dimensions.height}, ${stats.size} bytes)`);

        results.push({
          type: assetType,
          filename: assetConfig.filename,
          path: targetPath,
          dimensions: assetConfig.dimensions,
          size: stats.size,
          hash,
          success: true
        });
      } else {
        results.push({
          type: assetType,
          filename: assetConfig.filename,
          success: false,
          fallback: 'svg'
        });
      }
    } catch (err) {
      console.log(`  ${RED}✗${RESET} Failed: ${err.message}`);
      results.push({
        type: assetType,
        filename: assetConfig.filename,
        success: false,
        error: err.message
      });
    }
  }

  // Write generation log
  const logPath = path.join(outputDir, 'asset-generation.json');
  const log = {
    timestamp: new Date().toISOString(),
    project: config.name,
    profile: config.profile,
    colorPalette: colors,
    sharpAvailable,
    assets: results
  };
  await fs.writeFile(logPath, JSON.stringify(log, null, 2));

  console.log(`\n${DIM}─────────────────────────────────────${RESET}`);
  const successCount = results.filter(r => r.success).length;
  console.log(`\n${GREEN}${BOLD}✓ Generated ${successCount}/${results.length} assets${RESET}`);
  console.log(`${DIM}Log: ${logPath}${RESET}\n`);

  if (config.json) {
    console.log(JSON.stringify(log, null, 2));
  }

  return results;
}

// Main
async function main() {
  const config = parseArgs();

  if (!config.name || !config.outputDir) {
    console.log(`
${BOLD}Placeholder Asset Generator${RESET}

Usage:
  node generate-placeholder-assets.mjs <project-name> <output-dir> [options]

Options:
  --profile <profile>  Asset profile (default: mobile)
  --json               Output results as JSON

Profiles:
  ${Object.entries(ASSET_PROFILES).map(([k, v]) => `${k.padEnd(10)} ${v.name}`).join('\n  ')}

Examples:
  node generate-placeholder-assets.mjs "My App" ./assets --profile mobile
  node generate-placeholder-assets.mjs "My Site" ./public --profile web
  node generate-placeholder-assets.mjs "My MiniApp" ./public --profile miniapp
`);
    process.exit(0);
  }

  await generateAssets(config);
}

main().catch(err => {
  console.error(`${RED}Error: ${err.message}${RESET}`);
  process.exit(1);
});
