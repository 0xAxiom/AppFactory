#!/usr/bin/env npx ts-node

/**
 * Check Account Association
 *
 * Validates that the minikit.config.ts has all required account association fields.
 * Used as part of the proof gate (Stage M8).
 *
 * Usage: npx ts-node check_account_association.ts [path-to-app]
 * Example: npx ts-node check_account_association.ts ../builds/miniapps/hello-miniapp/app
 */

import * as fs from 'fs';
import * as path from 'path';

const appPath = process.argv[2] || '.';
const configPath = path.join(appPath, 'minikit.config.ts');

console.log('Checking account association...');
console.log(`Config path: ${configPath}`);
console.log('');

// Check if config file exists
if (!fs.existsSync(configPath)) {
  console.error('❌ minikit.config.ts not found');
  console.error('');
  console.error('Create the config file with account association fields.');
  process.exit(1);
}

// Read the config file
const configContent = fs.readFileSync(configPath, 'utf-8');

// Extract account association fields using regex
// (We can't import TypeScript directly without compilation)
const headerMatch = configContent.match(/header:\s*["']([^"']*)["']/);
const payloadMatch = configContent.match(/payload:\s*["']([^"']*)["']/);
const signatureMatch = configContent.match(/signature:\s*["']([^"']*)["']/);

const header = headerMatch?.[1] || '';
const payload = payloadMatch?.[1] || '';
const signature = signatureMatch?.[1] || '';

// Check each field
const results = {
  header: header.length > 0,
  payload: payload.length > 0,
  signature: signature.length > 0,
};

// Display results
console.log('Account Association Fields:');
console.log(`  header:    ${results.header ? '✓ present' : '✗ empty'}`);
console.log(`  payload:   ${results.payload ? '✓ present' : '✗ empty'}`);
console.log(`  signature: ${results.signature ? '✓ present' : '✗ empty'}`);
console.log('');

// Check if all fields are present
const allPresent = results.header && results.payload && results.signature;

if (allPresent) {
  console.log('✅ Account association complete');
  process.exit(0);
} else {
  console.error('❌ Account association incomplete');
  console.error('');
  console.error('To complete account association:');
  console.error('1. Deploy your app to Vercel');
  console.error('2. Disable Vercel Deployment Protection');
  console.error('3. Go to https://base.dev (Build → Account Association)');
  console.error('4. Enter your app URL and sign');
  console.error('5. Copy the values to minikit.config.ts');
  console.error('');
  console.error('See Stage M5 documentation for details.');
  process.exit(1);
}
