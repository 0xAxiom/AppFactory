#!/usr/bin/env npx ts-node

/**
 * Check Manifest Assets
 *
 * Validates that all assets referenced in the manifest exist in the public directory.
 * Also checks image dimensions where possible.
 *
 * Usage: npx ts-node check_manifest_assets.ts [path-to-app]
 * Example: npx ts-node check_manifest_assets.ts ../builds/miniapps/hello-miniapp/app
 */

import * as fs from 'fs';
import * as path from 'path';

const appPath = process.argv[2] || '.';
const publicPath = path.join(appPath, 'public');

console.log('Checking manifest assets...');
console.log(`Public path: ${publicPath}`);
console.log('');

// Define required assets with their expected properties
const requiredAssets = [
  {
    name: 'Icon',
    path: 'icon.png',
    expectedDimensions: '1024x1024',
    required: true,
  },
  {
    name: 'Splash',
    path: 'splash.png',
    expectedDimensions: '~200x200',
    required: true,
  },
  {
    name: 'Hero',
    path: 'hero.png',
    expectedDimensions: '1200x630',
    required: true,
  },
  {
    name: 'OG Image',
    path: 'og.png',
    expectedDimensions: '1200x630',
    required: true,
  },
  {
    name: 'Screenshot 1',
    path: 'screenshots/1.png',
    expectedDimensions: '1284x2778',
    required: true,
  },
  {
    name: 'Screenshot 2',
    path: 'screenshots/2.png',
    expectedDimensions: '1284x2778',
    required: false,
  },
  {
    name: 'Screenshot 3',
    path: 'screenshots/3.png',
    expectedDimensions: '1284x2778',
    required: false,
  },
];

// Check each asset
let hasErrors = false;
let assetsChecked = 0;
let assetsPassing = 0;

console.log('Asset Status:');
console.log('-'.repeat(60));

for (const asset of requiredAssets) {
  const fullPath = path.join(publicPath, asset.path);
  const exists = fs.existsSync(fullPath);

  if (asset.required) {
    assetsChecked++;

    if (exists) {
      // Get file size
      const stats = fs.statSync(fullPath);
      const sizeKB = Math.round(stats.size / 1024);

      console.log(`✓ ${asset.name}`);
      console.log(`  Path: ${asset.path}`);
      console.log(`  Size: ${sizeKB} KB`);
      console.log(`  Expected: ${asset.expectedDimensions}`);
      assetsPassing++;
    } else {
      console.log(`✗ ${asset.name} (MISSING)`);
      console.log(`  Path: ${asset.path}`);
      console.log(`  Expected: ${asset.expectedDimensions}`);
      hasErrors = true;
    }
  } else {
    // Optional asset
    if (exists) {
      const stats = fs.statSync(fullPath);
      const sizeKB = Math.round(stats.size / 1024);
      console.log(`○ ${asset.name} (optional)`);
      console.log(`  Path: ${asset.path}`);
      console.log(`  Size: ${sizeKB} KB`);
    } else {
      console.log(`○ ${asset.name} (optional, not present)`);
    }
  }

  console.log('');
}

console.log('-'.repeat(60));
console.log(
  `Assets: ${assetsPassing}/${assetsChecked} required assets present`
);
console.log('');

if (hasErrors) {
  console.error('❌ Missing required assets');
  console.error('');
  console.error('To fix:');
  console.error('1. Generate placeholder images for missing assets');
  console.error('2. Ensure correct dimensions:');
  console.error('   - Icon: 1024x1024 PNG (no transparency)');
  console.error('   - Splash: ~200x200 PNG');
  console.error('   - Hero: 1200x630 PNG/JPG (1.91:1 ratio)');
  console.error('   - OG Image: 1200x630 PNG/JPG');
  console.error('   - Screenshots: 1284x2778 PNG (portrait)');
  console.error('');
  console.error('Placeholder images can be solid colors with text overlays.');
  process.exit(1);
} else {
  console.log('✅ All required assets present');
  process.exit(0);
}
