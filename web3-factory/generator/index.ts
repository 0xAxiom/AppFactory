#!/usr/bin/env node
/**
 * Web3 Factory Build Prompt Generator
 *
 * Generates build instructions for users to run locally with their own AI.
 * NO AI INFERENCE - just creates prompt files.
 *
 * Usage: npm run generate "your app idea"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Handlebars from 'handlebars';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface GeneratorConfig {
  idea: string;
  outputDir: string;
}

interface TemplateContext {
  app_name: string;
  app_slug: string;
  idea: string;
  timestamp: string;
}

/**
 * Generate a slug from the app idea
 */
function generateSlug(idea: string): string {
  const words = idea
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 2)
    .slice(0, 3);

  return words.join('-') || 'web3-app';
}

/**
 * Generate a display name from the slug
 */
function generateAppName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Load a template file
 */
function loadTemplate(templateName: string): string {
  const templatePath = path.join(__dirname, 'templates', `${templateName}.hbs`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }

  return fs.readFileSync(templatePath, 'utf-8');
}

/**
 * Generate all build prompt files
 */
async function generate(config: GeneratorConfig): Promise<void> {
  const { idea, outputDir } = config;

  console.log('\n' + '='.repeat(60));
  console.log('  Web3 Factory Build Prompt Generator');
  console.log('='.repeat(60) + '\n');

  console.log(`Idea: "${idea}"\n`);

  // Generate identifiers
  const appSlug = generateSlug(idea);
  const appName = generateAppName(appSlug);
  const timestamp = new Date().toISOString();

  // Create output directory
  const fullOutputDir = path.join(outputDir, appSlug);
  fs.mkdirSync(fullOutputDir, { recursive: true });

  console.log(`Output: ${fullOutputDir}\n`);

  // Template context - NO fee split or partner keys
  const context: TemplateContext = {
    app_name: appName,
    app_slug: appSlug,
    idea,
    timestamp,
  };

  // Generate each file
  const files = [
    { template: 'build_prompt', output: 'build_prompt.md' },
    { template: 'checklist', output: 'checklist.md' },
    { template: 'contract_spec', output: 'contract_spec.md' },
    { template: 'frontend_spec', output: 'frontend_spec.md' },
  ];

  for (const file of files) {
    try {
      const templateContent = loadTemplate(file.template);
      const compiled = Handlebars.compile(templateContent);
      const output = compiled(context);

      const outputPath = path.join(fullOutputDir, file.output);
      fs.writeFileSync(outputPath, output);

      console.log(`  Created: ${file.output}`);
    } catch (error) {
      console.error(`  Failed: ${file.output} - ${error}`);
      throw error;
    }
  }

  // Print next steps
  console.log('\n' + '='.repeat(60));
  console.log('\n  SUCCESS: Build prompts generated.\n');
  console.log('  NEXT STEPS:');
  console.log(`  1. Open: ${fullOutputDir}/build_prompt.md`);
  console.log('  2. Copy the entire contents');
  console.log('  3. Paste into Claude or Cursor');
  console.log('  4. Let AI generate your app');
  console.log(`  5. Save output to: web3-builds/${appSlug}/`);
  console.log('  6. Run: npm run validate');
  console.log('  7. Run: npm run zip');
  console.log('  8. Upload to: https://factoryapp.dev/web3-factory/launch\n');
  console.log('='.repeat(60) + '\n');
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
Web3 Factory Build Prompt Generator

Usage:
  npm run generate "your app idea"

Examples:
  npm run generate "a roast battle app with 1v1 voice battles"
  npm run generate "a meme coin voting platform"
  npm run generate "a tipping app for streamers"

This generates build prompts that you run locally with Claude or Cursor.
No AI is used by this command - it just creates instruction files.

After building, validate and zip your app, then upload to:
  https://factoryapp.dev/web3-factory/launch
`);
    process.exit(0);
  }

  const idea = args.join(' ');

  if (idea.length < 10) {
    console.error('\nError: Provide a more detailed app idea (at least 10 characters).\n');
    process.exit(1);
  }

  const outputDir = path.join(__dirname, '..', 'generated');

  try {
    await generate({ idea, outputDir });
  } catch (error) {
    console.error('\nGeneration failed:', error);
    process.exit(1);
  }
}

main();
