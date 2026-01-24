#!/usr/bin/env node
/**
 * Skill Detection Library
 *
 * Provides runtime detection of optional skills/tools and graceful degradation.
 * Never assumes skills exist - always detects at runtime.
 *
 * Usage:
 *   import { detectSkill, withSkill, getCapabilityLevel } from './lib/skill-detection.mjs';
 *
 *   const hasPlaywright = await detectSkill('playwright');
 *   await withSkill('playwright', async () => { ... }, () => { console.log('Skipping...'); });
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

// Skill Detection Registry
const SKILL_DETECTORS = {
  // Browser Automation
  'playwright': async () => {
    try {
      await execAsync('npx playwright --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },

  // Code Quality
  'eslint': async () => {
    try {
      await execAsync('npx eslint --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },

  'prettier': async () => {
    try {
      await execAsync('npx prettier --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },

  // Performance & Accessibility
  'lighthouse': async () => {
    try {
      await execAsync('npx lighthouse --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },

  'axe': async () => {
    try {
      // Check if @axe-core/cli is available
      await execAsync('npx axe --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },

  // Security
  'semgrep': async () => {
    try {
      await execAsync('npx semgrep --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },

  'npm-audit': async () => {
    try {
      await execAsync('npm --version', { timeout: 5000 });
      return true; // npm always has audit built-in
    } catch {
      return false;
    }
  },

  // Skills Audits
  'vercel-agent-skills': async () => {
    try {
      // Check if @vercel/agent-skills package is available
      const result = await execAsync('npm list -g @vercel/agent-skills 2>/dev/null || npm list @vercel/agent-skills 2>/dev/null', { timeout: 5000 });
      return result.stdout.includes('@vercel/agent-skills');
    } catch {
      return false;
    }
  },

  // Ralph QA
  'ralph': async () => {
    // Ralph is a local script, check if it exists
    const ralphScript = join(process.cwd(), 'ralph', 'run-ralph.sh');
    return existsSync(ralphScript);
  },

  // MCP Servers (require more complex detection)
  'mcp-github': async () => {
    // Check if GITHUB_PERSONAL_ACCESS_TOKEN is set
    return !!process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
  },

  'mcp-playwright': async () => {
    try {
      await execAsync('npx @playwright/mcp --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },

  'mcp-context7': async () => {
    try {
      await execAsync('npx @upstash/context7-mcp --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },

  'mcp-semgrep': async () => {
    try {
      await execAsync('npx @semgrep/mcp-server --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
};

// Cache for skill detection results (valid for current process only)
const detectionCache = new Map();

/**
 * Detect if a skill/tool is available
 * @param {string} skillName - Name of the skill to detect
 * @returns {Promise<boolean>} - True if skill is available
 */
export async function detectSkill(skillName) {
  // Check cache first
  if (detectionCache.has(skillName)) {
    return detectionCache.get(skillName);
  }

  // Get detector function
  const detector = SKILL_DETECTORS[skillName];
  if (!detector) {
    console.warn(`[skill-detection] No detector registered for skill: ${skillName}`);
    return false;
  }

  // Run detection
  try {
    const isAvailable = await detector();
    detectionCache.set(skillName, isAvailable);
    return isAvailable;
  } catch (error) {
    console.warn(`[skill-detection] Error detecting ${skillName}:`, error.message);
    detectionCache.set(skillName, false);
    return false;
  }
}

/**
 * Execute a function if skill is available, otherwise run fallback
 * @param {string} skillName - Name of the skill required
 * @param {Function} ifAvailable - Function to run if skill exists
 * @param {Function} ifUnavailable - Function to run if skill missing
 * @returns {Promise<any>} - Result of executed function
 */
export async function withSkill(skillName, ifAvailable, ifUnavailable) {
  const hasSkill = await detectSkill(skillName);

  if (hasSkill) {
    return await ifAvailable();
  } else {
    return ifUnavailable ? await ifUnavailable() : undefined;
  }
}

/**
 * Detect multiple skills and return results
 * @param {string[]} skillNames - Array of skill names
 * @returns {Promise<Object>} - Object mapping skill names to availability
 */
export async function detectMultipleSkills(skillNames) {
  const results = {};

  await Promise.all(
    skillNames.map(async (name) => {
      results[name] = await detectSkill(name);
    })
  );

  return results;
}

/**
 * Get capability level based on available skills
 * @param {Object} requiredSkills - Object mapping tier names to skill arrays
 * @returns {Promise<string>} - Capability level (baseline/quality/advanced)
 */
export async function getCapabilityLevel(requiredSkills = {}) {
  const baseline = requiredSkills.baseline || [];
  const quality = requiredSkills.quality || [];
  const advanced = requiredSkills.advanced || [];

  // Check baseline (required)
  const baselineResults = await detectMultipleSkills(baseline);
  const hasAllBaseline = Object.values(baselineResults).every(v => v);

  if (!hasAllBaseline) {
    return 'insufficient'; // Missing required baseline skills
  }

  // Check quality (optional)
  const qualityResults = await detectMultipleSkills(quality);
  const hasAllQuality = Object.values(qualityResults).every(v => v);

  // Check advanced (optional)
  const advancedResults = await detectMultipleSkills(advanced);
  const hasAllAdvanced = Object.values(advancedResults).every(v => v);

  if (hasAllAdvanced && hasAllQuality) {
    return 'advanced';
  } else if (hasAllQuality) {
    return 'quality';
  } else {
    return 'baseline';
  }
}

/**
 * Print capability report to console
 * @param {Object} skills - Skills detection results
 * @param {Object} options - Display options
 */
export function printCapabilityReport(skills, options = {}) {
  const { showAll = true, colors = true } = options;

  const GREEN = colors ? '\x1b[32m' : '';
  const YELLOW = colors ? '\x1b[33m' : '';
  const RED = colors ? '\x1b[31m' : '';
  const RESET = colors ? '\x1b[0m' : '';
  const DIM = colors ? '\x1b[2m' : '';

  console.log('\n┌─────────────────────────────────────────┐');
  console.log('│      Capability Detection Report       │');
  console.log('└─────────────────────────────────────────┘\n');

  const available = Object.entries(skills).filter(([_, v]) => v);
  const unavailable = Object.entries(skills).filter(([_, v]) => !v);

  if (available.length > 0) {
    console.log(`${GREEN}✓ Available Skills (${available.length}):${RESET}`);
    available.forEach(([name]) => {
      console.log(`  ${GREEN}●${RESET} ${name}`);
    });
    console.log('');
  }

  if (unavailable.length > 0 && showAll) {
    console.log(`${DIM}○ Unavailable Skills (${unavailable.length}):${RESET}`);
    unavailable.forEach(([name]) => {
      console.log(`  ${DIM}○ ${name}${RESET}`);
    });
    console.log('');
  }

  if (unavailable.length > 0) {
    console.log(`${YELLOW}Note: Unavailable skills will be skipped with graceful degradation.${RESET}\n`);
  } else {
    console.log(`${GREEN}All optional skills available - maximum quality mode enabled!${RESET}\n`);
  }
}

/**
 * Message templates for common degradation scenarios
 */
export const DEGRADATION_MESSAGES = {
  playwright: {
    skipping: '⚠️  Playwright not available - skipping browser verification',
    installing: '📦 Installing Playwright browsers (this may take a few minutes)...',
    failed: '❌ Playwright installation failed - proceeding without browser tests'
  },

  lighthouse: {
    skipping: '⚠️  Lighthouse not available - skipping performance audit',
    alternative: '💡 Install Lighthouse globally for performance audits: npm i -g lighthouse'
  },

  axe: {
    skipping: '⚠️  Axe not available - skipping accessibility audit',
    alternative: '💡 Install Axe CLI for accessibility checks: npm i -g @axe-core/cli'
  },

  'vercel-agent-skills': {
    skipping: '⚠️  @vercel/agent-skills not available - skipping code quality audits',
    alternative: '💡 Install for automated code review: npm i -g @vercel/agent-skills'
  },

  ralph: {
    skipping: '⚠️  Ralph QA not configured - skipping adversarial review',
    alternative: '💡 Ralph QA provides manual adversarial review loops'
  },

  eslint: {
    skipping: '⚠️  ESLint not available - skipping linting',
    alternative: '💡 Install ESLint for code quality: npm i -g eslint'
  },

  prettier: {
    skipping: '⚠️  Prettier not available - skipping code formatting',
    alternative: '💡 Install Prettier for code formatting: npm i -g prettier'
  }
};

/**
 * Get a degradation message for a missing skill
 * @param {string} skillName - Name of the skill
 * @param {string} type - Message type (skipping/installing/failed/alternative)
 * @returns {string} - Formatted message
 */
export function getDegradationMessage(skillName, type = 'skipping') {
  const messages = DEGRADATION_MESSAGES[skillName];
  if (!messages) {
    return `⚠️  ${skillName} not available - skipping`;
  }
  return messages[type] || messages.skipping;
}

// Export all functions
export default {
  detectSkill,
  withSkill,
  detectMultipleSkills,
  getCapabilityLevel,
  printCapabilityReport,
  getDegradationMessage,
  DEGRADATION_MESSAGES
};
