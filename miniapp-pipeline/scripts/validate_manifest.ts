#!/usr/bin/env npx ts-node

/**
 * Validate Manifest
 *
 * Validates the manifest configuration against Base Mini App requirements.
 * Checks field lengths, required fields, and valid values.
 *
 * Usage: npx ts-node validate_manifest.ts [path-to-app]
 * Example: npx ts-node validate_manifest.ts ../builds/miniapps/hello-miniapp/app
 */

import * as fs from 'fs';
import * as path from 'path';

const appPath = process.argv[2] || '.';
const configPath = path.join(appPath, 'minikit.config.ts');

console.log('Validating manifest configuration...');
console.log(`Config path: ${configPath}`);
console.log('');

// Valid categories
const validCategories = [
  'games',
  'social',
  'finance',
  'utility',
  'productivity',
  'health-fitness',
  'news-media',
  'music',
  'shopping',
  'education',
  'developer-tools',
  'entertainment',
  'art-creativity',
];

// Check if config file exists
if (!fs.existsSync(configPath)) {
  console.error('❌ minikit.config.ts not found');
  process.exit(1);
}

// Read the config file
const configContent = fs.readFileSync(configPath, 'utf-8');

// Extract fields using regex
function extractField(pattern: RegExp): string {
  const match = configContent.match(pattern);
  return match?.[1] || '';
}

const fields = {
  version: extractField(/version:\s*["']([^"']*)["']/),
  name: extractField(/name:\s*["']([^"']*)["']/),
  subtitle: extractField(/subtitle:\s*["']([^"']*)["']/),
  tagline: extractField(/tagline:\s*["']([^"']*)["']/),
  description: extractField(/description:\s*["']([^"']*)["']/),
  primaryCategory: extractField(/primaryCategory:\s*["']([^"']*)["']/),
  splashBackgroundColor: extractField(/splashBackgroundColor:\s*["']([^"']*)["']/),
};

// Extract tags (array)
const tagsMatch = configContent.match(/tags:\s*\[([^\]]*)\]/);
const tagsStr = tagsMatch?.[1] || '';
const tags = tagsStr
  .split(',')
  .map(t => t.trim().replace(/["']/g, ''))
  .filter(t => t.length > 0);

// Validation rules
interface ValidationRule {
  field: string;
  value: string | string[];
  required: boolean;
  maxLength?: number;
  validValues?: string[];
  pattern?: RegExp;
  isArray?: boolean;
  maxItems?: number;
}

const rules: ValidationRule[] = [
  { field: 'version', value: fields.version, required: true, validValues: ['1'] },
  { field: 'name', value: fields.name, required: true, maxLength: 32 },
  { field: 'subtitle', value: fields.subtitle, required: true, maxLength: 30 },
  { field: 'tagline', value: fields.tagline, required: false, maxLength: 30 },
  { field: 'description', value: fields.description, required: true, maxLength: 170 },
  { field: 'primaryCategory', value: fields.primaryCategory, required: true, validValues: validCategories },
  { field: 'splashBackgroundColor', value: fields.splashBackgroundColor, required: true, pattern: /^#[0-9A-Fa-f]{6}$/ },
  { field: 'tags', value: tags, required: true, isArray: true, maxItems: 5, pattern: /^[a-z0-9-]+$/ },
];

// Run validations
let hasErrors = false;
let hasWarnings = false;

console.log('Validation Results:');
console.log('-'.repeat(60));

for (const rule of rules) {
  const value = rule.value;
  const issues: string[] = [];

  // Check required
  if (rule.required) {
    if (rule.isArray) {
      if ((value as string[]).length === 0) {
        issues.push('required but empty');
      }
    } else {
      if (!value || (value as string).length === 0) {
        issues.push('required but missing');
      }
    }
  }

  // Check max length
  if (rule.maxLength && !rule.isArray && typeof value === 'string') {
    if (value.length > rule.maxLength) {
      issues.push(`exceeds max length (${value.length}/${rule.maxLength})`);
    }
  }

  // Check valid values
  if (rule.validValues && !rule.isArray && typeof value === 'string') {
    if (value && !rule.validValues.includes(value)) {
      issues.push(`invalid value "${value}"`);
    }
  }

  // Check pattern
  if (rule.pattern && !rule.isArray && typeof value === 'string') {
    if (value && !rule.pattern.test(value)) {
      issues.push(`invalid format`);
    }
  }

  // Check array items
  if (rule.isArray && Array.isArray(value)) {
    if (rule.maxItems && value.length > rule.maxItems) {
      issues.push(`too many items (${value.length}/${rule.maxItems})`);
    }
    if (rule.pattern) {
      for (const item of value) {
        if (!rule.pattern.test(item)) {
          issues.push(`invalid tag "${item}" (must be lowercase, no spaces)`);
        }
      }
    }
  }

  // Print result
  if (issues.length > 0) {
    hasErrors = issues.some(i => i.includes('required') || i.includes('exceeds') || i.includes('invalid'));
    console.log(`✗ ${rule.field}`);
    issues.forEach(issue => console.log(`  - ${issue}`));
  } else {
    const displayValue = rule.isArray
      ? `[${(value as string[]).join(', ')}]`
      : `"${value}"`;
    console.log(`✓ ${rule.field}: ${displayValue}`);
  }
}

console.log('-'.repeat(60));
console.log('');

// Summary
if (hasErrors) {
  console.error('❌ Manifest validation failed');
  console.error('');
  console.error('Fix the issues above before proceeding.');
  console.error('');
  console.error('Character limits:');
  console.error('  - name: 32 characters');
  console.error('  - subtitle/tagline: 30 characters');
  console.error('  - description: 170 characters');
  console.error('');
  console.error('Valid categories:');
  validCategories.forEach(c => console.error(`  - ${c}`));
  process.exit(1);
} else if (hasWarnings) {
  console.log('⚠️  Manifest validation passed with warnings');
  process.exit(0);
} else {
  console.log('✅ Manifest validation passed');
  process.exit(0);
}
