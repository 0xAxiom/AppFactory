#!/usr/bin/env node
/**
 * Web3 Factory Build Zipper
 *
 * Creates a zip file per ZIP_CONTRACT.md for upload to factoryapp.dev.
 *
 * Usage: npm run zip (from within a build directory)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

// ESM module (fileURLToPath available if needed)
void fileURLToPath;

// ============================================================================
// ZIP CONTRACT v1.0 - Exclusions
// ============================================================================

/**
 * Patterns to exclude from zip per ZIP_CONTRACT.md
 */
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.git',
  '.next',
  'out',
  'dist',
  '.env',
  '.env.local',
  '.env.production',
  '.DS_Store',
  'Thumbs.db',
];

/**
 * File extensions to exclude
 */
const EXCLUDE_EXTENSIONS = ['.zip'];

/**
 * Size limit per ZIP_CONTRACT.md
 */
const MAX_ZIP_SIZE = 50 * 1024 * 1024; // 50 MB

// ============================================================================
// Zip Creator
// ============================================================================

async function createZip(buildDir: string): Promise<string> {
  const appName = path.basename(buildDir);
  const zipPath = path.join(buildDir, `${appName}.zip`);

  console.log('\n' + '='.repeat(60));
  console.log('  Web3 Factory Zip Creator');
  console.log('  Contract: ZIP_CONTRACT.md v1.0');
  console.log('='.repeat(60) + '\n');

  console.log(`Source:  ${buildDir}`);
  console.log(`Output:  ${zipPath}\n`);

  // Remove existing zip if present
  if (fs.existsSync(zipPath)) {
    fs.unlinkSync(zipPath);
    console.log('Removed existing zip file.\n');
  }

  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Maximum compression
    });

    output.on('close', () => {
      const sizeBytes = archive.pointer();
      const sizeMB = (sizeBytes / (1024 * 1024)).toFixed(2);

      console.log('='.repeat(60));

      if (sizeBytes > MAX_ZIP_SIZE) {
        console.log(`\n  WARNING: ${appName}.zip is ${sizeMB} MB`);
        console.log('  This exceeds the 50 MB limit in ZIP_CONTRACT.md');
        console.log('  Upload may be rejected.\n');
      } else {
        console.log(`\n  SUCCESS: ${appName}.zip (${sizeMB} MB)\n`);
      }

      console.log('  NEXT STEPS:');
      console.log('  1. Go to: https://factoryapp.dev/web3-factory/launch');
      console.log(`  2. Upload: ${appName}.zip`);
      console.log('  3. Fill out token metadata');
      console.log('  4. Connect wallet and sign transaction');
      console.log('  5. Your token launches and app deploys!\n');

      console.log('='.repeat(60) + '\n');

      resolve(zipPath);
    });

    archive.on('error', (err) => {
      reject(err);
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('Warning:', err.message);
      } else {
        reject(err);
      }
    });

    archive.pipe(output);

    // Add manifest per ZIP_CONTRACT.md
    const manifest = {
      app_name: appName,
      created_at: new Date().toISOString(),
      generator: 'web3-factory',
      version: '1.0.0',
      contract_version: '1.0',
    };

    archive.append(JSON.stringify(manifest, null, 2), {
      name: 'manifest.json',
    });
    console.log('Added: manifest.json');

    // Collect all files
    const files = getFilesRecursive(buildDir, buildDir);
    let includedCount = 0;

    for (const file of files) {
      const relativePath = path.relative(buildDir, file);

      // Check exclusions
      const shouldExclude = EXCLUDE_PATTERNS.some((pattern) => {
        return (
          relativePath === pattern ||
          relativePath.startsWith(pattern + '/') ||
          relativePath.includes('/' + pattern + '/') ||
          relativePath.includes('/' + pattern)
        );
      });

      const hasExcludedExt = EXCLUDE_EXTENSIONS.some((ext) => {
        return relativePath.endsWith(ext);
      });

      if (!shouldExclude && !hasExcludedExt) {
        archive.file(file, { name: relativePath });
        includedCount++;
      }
    }

    console.log(`Added: ${includedCount} files from build\n`);

    archive.finalize();
  });
}

function getFilesRecursive(dir: string, baseDir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);

    // Skip excluded directories early
    const shouldSkip = EXCLUDE_PATTERNS.some((pattern) => {
      return item === pattern;
    });

    if (shouldSkip) continue;

    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getFilesRecursive(fullPath, baseDir));
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

// ============================================================================
// Entry Point
// ============================================================================

async function main(): Promise<void> {
  const buildDir = process.cwd();

  // Sanity check
  if (!fs.existsSync(path.join(buildDir, 'package.json'))) {
    console.error('\nError: No package.json found in current directory.\n');
    console.error('Run this command from your build directory:\n');
    console.error('  cd dapp-builds/your-app');
    console.error('  npm run zip\n');
    process.exit(1);
  }

  try {
    await createZip(buildDir);
  } catch (error) {
    console.error('\nFailed to create zip:', error);
    process.exit(1);
  }
}

main();
