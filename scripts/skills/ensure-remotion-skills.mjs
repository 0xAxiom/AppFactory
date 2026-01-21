#!/usr/bin/env node

/**
 * Ensure Remotion Skills Bootstrap Script
 *
 * Verifies that Remotion skills are available for Claude to use.
 * This script is invoked before video generation to ensure
 * the skill files exist and are valid.
 *
 * Usage:
 *   node scripts/skills/ensure-remotion-skills.mjs [options]
 *
 * Options:
 *   --ci          CI-safe mode (no prompts, exit codes only)
 *   --quiet       Suppress non-error output
 *   --verify-only Check but don't repair
 *
 * Exit codes:
 *   0 - Skills are ready
 *   1 - Skills missing and could not be repaired
 */

import { existsSync, readFileSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const REPO_ROOT = resolve(__dirname, '..', '..');

// ============================================================================
// Configuration
// ============================================================================

const SKILL_PATH = join(REPO_ROOT, '.claude', 'skills', 'remotion', 'SKILL.md');
const MIN_SKILL_SIZE = 1000; // Minimum bytes for a valid skill file

// Required sections in the skill file
const REQUIRED_SECTIONS = [
  'Frame-Based Animations',
  'Interpolate with Clamping',
  'Determinism Requirements',
  'Pipeline Integration',
];

// ============================================================================
// Argument Parsing
// ============================================================================

function parseArgs(argv) {
  return {
    ci: argv.includes('--ci'),
    quiet: argv.includes('--quiet'),
    verifyOnly: argv.includes('--verify-only'),
  };
}

// ============================================================================
// Logging
// ============================================================================

function createLogger(quiet) {
  return {
    info: (msg) => !quiet && console.log(`[skills] ${msg}`),
    success: (msg) => !quiet && console.log(`[skills] \u2714 ${msg}`),
    warn: (msg) => console.warn(`[skills] \u26A0 ${msg}`),
    error: (msg) => console.error(`[skills] \u2718 ${msg}`),
  };
}

// ============================================================================
// Skill Verification
// ============================================================================

function verifySkillFile(log) {
  // Check file exists
  if (!existsSync(SKILL_PATH)) {
    log.error(`Skill file not found: ${SKILL_PATH}`);
    return { valid: false, reason: 'missing' };
  }

  // Check file size (guards against empty/corrupt files)
  const stats = statSync(SKILL_PATH);
  if (stats.size < MIN_SKILL_SIZE) {
    log.error(`Skill file too small (${stats.size} bytes < ${MIN_SKILL_SIZE})`);
    return { valid: false, reason: 'truncated' };
  }

  // Check content has required sections
  const content = readFileSync(SKILL_PATH, 'utf-8');
  const missingSections = [];

  for (const section of REQUIRED_SECTIONS) {
    if (!content.includes(section)) {
      missingSections.push(section);
    }
  }

  if (missingSections.length > 0) {
    log.error(`Skill file missing sections: ${missingSections.join(', ')}`);
    return { valid: false, reason: 'incomplete', missingSections };
  }

  // Check frontmatter
  if (!content.startsWith('---')) {
    log.error('Skill file missing YAML frontmatter');
    return { valid: false, reason: 'no-frontmatter' };
  }

  return { valid: true };
}

// ============================================================================
// Skill Information
// ============================================================================

function getSkillInfo() {
  if (!existsSync(SKILL_PATH)) {
    return null;
  }

  const content = readFileSync(SKILL_PATH, 'utf-8');
  const stats = statSync(SKILL_PATH);

  // Extract name from frontmatter
  const nameMatch = content.match(/^name:\s*(.+)$/m);
  const descMatch = content.match(/^description:\s*(.+)$/m);

  return {
    name: nameMatch ? nameMatch[1].trim() : 'remotion',
    description: descMatch ? descMatch[1].trim() : 'Remotion video generation',
    path: SKILL_PATH,
    size: stats.size,
    modified: stats.mtime.toISOString(),
  };
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  const args = parseArgs(process.argv);
  const log = createLogger(args.quiet);

  log.info('Verifying Remotion skills...');

  // Verify the skill file
  const result = verifySkillFile(log);

  if (result.valid) {
    const info = getSkillInfo();
    log.success(`Remotion skills ready`);

    if (!args.quiet) {
      log.info(`  Name: ${info.name}`);
      log.info(`  Path: ${info.path}`);
      log.info(`  Size: ${info.size} bytes`);
    }

    return 0;
  }

  // Skills are invalid
  if (args.verifyOnly) {
    log.error('Skills verification failed (--verify-only mode)');
    return 1;
  }

  // In repo-local model, skills are version-controlled
  // If they're missing, it's a repo integrity issue
  log.error('Remotion skills are missing or invalid.');
  log.error('This indicates a repository integrity issue.');
  log.error('');
  log.error('To fix:');
  log.error('  1. Ensure .claude/skills/remotion/SKILL.md exists');
  log.error('  2. Run: git checkout .claude/skills/remotion/SKILL.md');
  log.error('  3. Or re-clone the repository');

  return 1;
}

main()
  .then((code) => process.exit(code))
  .catch((err) => {
    console.error('[skills] Unexpected error:', err.message);
    process.exit(1);
  });
