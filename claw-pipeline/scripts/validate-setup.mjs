#!/usr/bin/env node
/**
 * validate-setup.mjs — Validate a Clawbot workspace
 *
 * Checks that all required files exist, config is valid,
 * and the workspace is ready to run.
 *
 * Usage: node scripts/validate-setup.mjs --slug <bot-slug>
 */

import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');

function getSlug() {
  const args = process.argv.slice(2);
  const slugIndex = args.indexOf('--slug');
  if (slugIndex !== -1 && args[slugIndex + 1]) {
    return args[slugIndex + 1];
  }
  return null;
}

function check(label, condition) {
  const icon = condition ? '✅' : '❌';
  console.log(`  ${icon} ${label}`);
  return condition;
}

function main() {
  console.log('\n🔍 Clawbot Workspace Validator\n');
  console.log('━'.repeat(50));

  const slug = getSlug();
  if (!slug) {
    console.error('❌ Usage: node scripts/validate-setup.mjs --slug <bot-slug>');
    process.exit(1);
  }

  const dir = join(ROOT, 'builds', 'claws', slug);
  let passed = 0;
  let total = 0;

  console.log(`\n  Workspace: builds/claws/${slug}/\n`);

  // Core workspace files
  console.log('  📁 Core Files:');
  const coreFiles = [
    'SOUL.md', 'IDENTITY.md', 'AGENTS.md', 'USER.md',
    'TOOLS.md', 'MEMORY.md', 'HEARTBEAT.md', 'BOOTSTRAP.md',
    'config.json', '.env.example',
  ];
  for (const file of coreFiles) {
    total++;
    if (check(file, existsSync(join(dir, file)))) passed++;
  }

  // Agent files
  console.log('\n  🤖 Agent Files:');
  const agentFiles = ['agents/registry.json', 'agents/state.json', 'agents/queue.json', 'agents/WORKING.md'];
  for (const file of agentFiles) {
    total++;
    if (check(file, existsSync(join(dir, file)))) passed++;
  }

  // Task files
  console.log('\n  📋 Task Files:');
  const taskFiles = ['tasks/todo.md', 'tasks/lessons.md'];
  for (const file of taskFiles) {
    total++;
    if (check(file, existsSync(join(dir, file)))) passed++;
  }

  // Memory directory
  console.log('\n  🧠 Memory:');
  total++;
  if (check('memory/ directory', existsSync(join(dir, 'memory')))) passed++;

  // Config validation
  console.log('\n  ⚙️  Config Validation:');
  const configPath = join(dir, 'config.json');
  if (existsSync(configPath)) {
    try {
      const config = JSON.parse(readFileSync(configPath, 'utf-8'));

      total++;
      if (check('config.json is valid JSON', true)) passed++;

      total++;
      if (check('name is set', !!config.name)) passed++;

      total++;
      if (check('slug is set', !!config.slug)) passed++;

      total++;
      if (check('personality configured', !!config.personality)) passed++;

      total++;
      if (check('platforms configured', Array.isArray(config.platforms) && config.platforms.length > 0)) passed++;

      total++;
      if (check('model provider set', !!config.modelProvider)) passed++;

      if (config.token) {
        total++;
        if (check('token chain specified', ['solana', 'base'].includes(config.token.chain))) passed++;

        total++;
        if (check('token wallet set', !!config.token.wallet)) passed++;
      }
    } catch {
      total++;
      check('config.json is valid JSON', false);
    }
  } else {
    total++;
    check('config.json exists', false);
  }

  // Summary
  const pct = Math.round((passed / total) * 100);
  console.log('\n' + '━'.repeat(50));
  console.log(`  Result: ${passed}/${total} checks passed (${pct}%)`);

  if (pct === 100) {
    console.log('  🎉 Workspace is valid and ready!');
  } else if (pct >= 80) {
    console.log('  ⚠️  Workspace has minor issues. Review failed checks above.');
  } else {
    console.log('  ❌ Workspace has significant issues. Re-run configure.mjs.');
  }
  console.log('━'.repeat(50) + '\n');

  process.exit(pct === 100 ? 0 : 1);
}

main();
