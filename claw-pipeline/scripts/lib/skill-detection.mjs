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
  },

  // Deployment Tools
  'vercel-cli': async () => {
    try {
      await execAsync('npx vercel --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },

  'expo-cli': async () => {
    try {
      await execAsync('npx expo --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },

  // Database & Backend
  'supabase': async () => {
    try {
      await execAsync('npx supabase --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },

  // Payment SDKs
  'stripe': async () => {
    try {
      await execAsync('npx stripe --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },

  'revenuecat': async () => {
    // RevenueCat is SDK-only, check for env var
    return !!process.env.REVENUECAT_API_KEY;
  },

  // Code Execution
  'e2b': async () => {
    try {
      // Check if E2B SDK is available
      const result = await execAsync('npm list e2b 2>/dev/null || npm list -g e2b 2>/dev/null', { timeout: 5000 });
      return result.stdout.includes('e2b@');
    } catch {
      return false;
    }
  },

  // Design Tools
  'figma': async () => {
    // Figma requires API token
    return !!process.env.FIGMA_ACCESS_TOKEN;
  },

  'mcp-figma': async () => {
    try {
      // Check if Figma MCP server is configured
      await execAsync('npx @figma/mcp-server --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },

  // Additional MCP Servers
  'mcp-supabase': async () => {
    try {
      await execAsync('npx @supabase/mcp-server --version', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  },

  'mcp-filesystem': async () => {
    // Filesystem is typically always available as a local MCP server
    return existsSync(join(process.cwd(), '.mcp.json')) ||
           existsSync(join(process.env.HOME || process.env.USERPROFILE || '', '.config/claude-code/mcp-config.json'));
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
 * Detect heavy dependencies (e.g., Playwright browsers)
 * @param {string} skillName - Name of the skill
 * @returns {Promise<Object>} - Detailed detection result
 */
export async function detectHeavyDependency(skillName) {
  switch (skillName) {
    case 'playwright':
      try {
        // Check if Playwright package exists
        const hasPackage = await detectSkill('playwright');
        if (!hasPackage) {
          return { available: false, reason: 'Package not installed' };
        }

        // Check if browsers are installed
        const browsersPath = join(process.env.HOME || process.env.USERPROFILE || '', '.cache/ms-playwright');
        const hasBrowsers = existsSync(browsersPath);

        return {
          available: hasPackage,
          browsersInstalled: hasBrowsers,
          downloadSize: hasBrowsers ? '0 MB' : '~500 MB',
          needsDownload: !hasBrowsers
        };
      } catch (error) {
        return { available: false, reason: error.message };
      }

    default:
      // Fallback to regular detection
      const result = await detectSkill(skillName);
      return { available: result };
  }
}

/**
 * Check environment variables for capabilities
 * @param {string[]} varNames - Environment variable names to check
 * @returns {Object} - Object mapping var names to availability
 */
export function checkEnvironmentVars(varNames) {
  const results = {};
  for (const varName of varNames) {
    results[varName] = !!process.env[varName];
  }
  return results;
}

/**
 * Get detailed capability report for display
 * @param {Object} options - Detection options
 * @returns {Promise<Object>} - Detailed capability information
 */
export async function getDetailedCapabilities(options = {}) {
  const {
    checkBaseline = true,
    checkQuality = true,
    checkAdvanced = true
  } = options;

  const capabilities = {
    tier: 'baseline',
    baseline: {},
    quality: {},
    advanced: {},
    environment: {}
  };

  // Baseline tools (always check)
  if (checkBaseline) {
    capabilities.baseline = {
      node: !!process.version,
      npm: await detectSkill('npm-audit'), // npm always has audit
      git: existsSync(join(process.cwd(), '.git'))
    };
  }

  // Quality tools (optional)
  if (checkQuality) {
    const [playwright, lighthouse, axe, skills, eslint, prettier, ralph] = await Promise.all([
      detectSkill('playwright'),
      detectSkill('lighthouse'),
      detectSkill('axe'),
      detectSkill('vercel-agent-skills'),
      detectSkill('eslint'),
      detectSkill('prettier'),
      detectSkill('ralph')
    ]);

    capabilities.quality = {
      playwright,
      lighthouse,
      axe,
      'agent-skills': skills,
      eslint,
      prettier,
      ralph
    };

    // Check if all quality tools available
    const qualityCount = Object.values(capabilities.quality).filter(Boolean).length;
    if (qualityCount === Object.keys(capabilities.quality).length) {
      capabilities.tier = 'quality';
    }
  }

  // Advanced tools (optional)
  if (checkAdvanced) {
    const [figma, supabase, stripe, vercel, e2b] = await Promise.all([
      detectSkill('figma'),
      detectSkill('supabase'),
      detectSkill('stripe'),
      detectSkill('vercel-cli'),
      detectSkill('e2b')
    ]);

    capabilities.advanced = {
      figma,
      supabase,
      stripe,
      vercel,
      e2b
    };

    // Check MCP servers
    const [mcpGithub, mcpPlaywright, mcpContext7, mcpSemgrep, mcpFigma, mcpSupabase] = await Promise.all([
      detectSkill('mcp-github'),
      detectSkill('mcp-playwright'),
      detectSkill('mcp-context7'),
      detectSkill('mcp-semgrep'),
      detectSkill('mcp-figma'),
      detectSkill('mcp-supabase')
    ]);

    capabilities.advanced.mcp = {
      github: mcpGithub,
      playwright: mcpPlaywright,
      context7: mcpContext7,
      semgrep: mcpSemgrep,
      figma: mcpFigma,
      supabase: mcpSupabase
    };

    // If all quality + some advanced, upgrade to advanced tier
    if (capabilities.tier === 'quality') {
      const advancedCount = Object.values(capabilities.advanced).filter(v =>
        typeof v === 'boolean' ? v : false
      ).length;
      if (advancedCount > 0) {
        capabilities.tier = 'advanced';
      }
    }
  }

  // Environment variables (relevant for capabilities)
  capabilities.environment = checkEnvironmentVars([
    'GITHUB_PERSONAL_ACCESS_TOKEN',
    'FIGMA_ACCESS_TOKEN',
    'REVENUECAT_API_KEY',
    'SUPABASE_ACCESS_TOKEN',
    'STRIPE_API_KEY'
  ]);

  return capabilities;
}

/**
 * Print capability report to console
 * @param {Object} skills - Skills detection results OR detailed capabilities object
 * @param {Object} options - Display options
 */
export function printCapabilityReport(skills, options = {}) {
  const { showAll = true, colors = true, detailed = false } = options;

  const GREEN = colors ? '\x1b[32m' : '';
  const YELLOW = colors ? '\x1b[33m' : '';
  const _RED = colors ? '\x1b[31m' : '';
  const BLUE = colors ? '\x1b[34m' : '';
  const RESET = colors ? '\x1b[0m' : '';
  const DIM = colors ? '\x1b[2m' : '';
  const BOLD = colors ? '\x1b[1m' : '';

  console.log('\n╔═════════════════════════════════════════╗');
  console.log('║      BUILD CAPABILITY REPORT            ║');
  console.log('╚═════════════════════════════════════════╝\n');

  // Check if this is a detailed capabilities object
  if (skills.tier !== undefined) {
    // Detailed report with tiers
    const tierLabels = {
      baseline: `${YELLOW}BASELINE${RESET} (Core tools only)`,
      quality: `${GREEN}QUALITY${RESET} (Enhanced with quality tools)`,
      advanced: `${BLUE}ADVANCED${RESET} (Full suite available)`
    };

    console.log(`Quality Tier: ${tierLabels[skills.tier] || skills.tier}\n`);

    // Show available tools by category
    if (skills.quality) {
      console.log(`${BOLD}Quality Tools:${RESET}`);
      Object.entries(skills.quality).forEach(([name, available]) => {
        const icon = available ? `${GREEN}✓${RESET}` : `${DIM}✗${RESET}`;
        const label = available ? name : `${DIM}${name}${RESET}`;
        console.log(`  ${icon} ${label}`);
      });
      console.log('');
    }

    if (skills.advanced && showAll) {
      console.log(`${BOLD}Advanced Tools:${RESET}`);
      const flatAdvanced = { ...skills.advanced };
      delete flatAdvanced.mcp; // Handle MCP separately

      Object.entries(flatAdvanced).forEach(([name, available]) => {
        const icon = available ? `${GREEN}✓${RESET}` : `${DIM}✗${RESET}`;
        const label = available ? name : `${DIM}${name}${RESET}`;
        console.log(`  ${icon} ${label}`);
      });

      if (skills.advanced.mcp) {
        console.log(`\n${BOLD}MCP Servers:${RESET}`);
        Object.entries(skills.advanced.mcp).forEach(([name, available]) => {
          const icon = available ? `${GREEN}✓${RESET}` : `${DIM}✗${RESET}`;
          const label = available ? name : `${DIM}${name}${RESET}`;
          console.log(`  ${icon} ${label}`);
        });
      }
      console.log('');
    }

    // Upgrade suggestions
    if (skills.tier === 'baseline') {
      console.log(`${YELLOW}ℹ Upgrade to QUALITY tier:${RESET}`);
      console.log(`  npm install -D playwright @vercel/agent-skills`);
      console.log(`  npx playwright install`);
      console.log('');
    }

    return;
  }

  // Simple report (legacy format)
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
  // Quality Tier Tools
  playwright: {
    skipping: '⚠️  Playwright not available - skipping browser verification',
    installing: '📦 Installing Playwright browsers (~500MB, this may take a few minutes)...',
    failed: '❌ Playwright installation failed - proceeding without browser tests',
    fallback: 'Using HTTP-only verification instead',
    alternative: '💡 Install Playwright: npm install -D playwright && npx playwright install'
  },

  lighthouse: {
    skipping: '⚠️  Lighthouse not available - skipping performance audit',
    fallback: 'Performance metrics will not be available',
    alternative: '💡 Install Lighthouse globally: npm install -g lighthouse'
  },

  axe: {
    skipping: '⚠️  Axe not available - skipping accessibility audit',
    fallback: 'Manual accessibility testing recommended',
    alternative: '💡 Install Axe CLI: npm install -g @axe-core/cli'
  },

  'vercel-agent-skills': {
    skipping: '⚠️  @vercel/agent-skills not available - skipping code quality audits',
    fallback: 'Using ESLint for basic code quality checks',
    alternative: '💡 Install agent-skills: npm install -D @vercel/agent-skills'
  },

  ralph: {
    skipping: '⚠️  Ralph QA not configured - skipping adversarial review',
    fallback: 'Manual QA recommended for production builds',
    alternative: '💡 Ralph QA runner available at: ./ralph/run-ralph.sh'
  },

  eslint: {
    skipping: '⚠️  ESLint not available - skipping linting',
    fallback: 'Code quality checks will be limited',
    alternative: '💡 Install ESLint: npm install -D eslint'
  },

  prettier: {
    skipping: '⚠️  Prettier not available - skipping code formatting',
    fallback: 'Code will not be auto-formatted',
    alternative: '💡 Install Prettier: npm install -D prettier'
  },

  // Advanced Tier Tools
  figma: {
    skipping: '⚠️  Figma integration not available - skipping design sync',
    fallback: 'Manual design implementation required',
    alternative: '💡 Set FIGMA_ACCESS_TOKEN env var to enable Figma integration'
  },

  supabase: {
    skipping: '⚠️  Supabase not available - using local storage',
    fallback: 'Database features will use JSON file storage',
    alternative: '💡 Install Supabase CLI: npm install -g supabase'
  },

  stripe: {
    skipping: '⚠️  Stripe not available - payment features disabled',
    fallback: 'Payment integration will require manual setup',
    alternative: '💡 Install Stripe CLI: npm install -g stripe'
  },

  revenuecat: {
    skipping: '⚠️  RevenueCat not configured - subscription features disabled',
    fallback: 'In-app purchases will require manual configuration',
    alternative: '💡 Set REVENUECAT_API_KEY env var to enable RevenueCat'
  },

  'vercel-cli': {
    skipping: '⚠️  Vercel CLI not available - skipping deployment features',
    fallback: 'Manual deployment required',
    alternative: '💡 Install Vercel CLI: npm install -g vercel'
  },

  e2b: {
    skipping: '⚠️  E2B not available - code execution sandbox disabled',
    fallback: 'Code execution features will be limited',
    alternative: '💡 Install E2B SDK: npm install e2b'
  },

  // MCP Servers
  'mcp-github': {
    skipping: '⚠️  GitHub MCP server not available - repository features limited',
    fallback: 'Using git CLI for repository operations',
    alternative: '💡 Configure GitHub MCP server in .mcp.json with GITHUB_PERSONAL_ACCESS_TOKEN'
  },

  'mcp-playwright': {
    skipping: '⚠️  Playwright MCP server not available - browser automation limited',
    fallback: 'Using local Playwright package if available',
    alternative: '💡 Enable Playwright MCP server in .mcp.json'
  },

  'mcp-context7': {
    skipping: '⚠️  Context7 MCP server not available - documentation lookup disabled',
    fallback: 'Manual documentation reference required',
    alternative: '💡 Configure Context7 MCP server in .mcp.json'
  },

  'mcp-semgrep': {
    skipping: '⚠️  Semgrep MCP server not available - security scanning disabled',
    fallback: 'Manual security review recommended',
    alternative: '💡 Enable Semgrep MCP server in .mcp.json'
  },

  'mcp-figma': {
    skipping: '⚠️  Figma MCP server not available - design sync disabled',
    fallback: 'Manual design implementation required',
    alternative: '💡 Configure Figma MCP server in .mcp.json'
  },

  'mcp-supabase': {
    skipping: '⚠️  Supabase MCP server not available - database features limited',
    fallback: 'Using local database configuration',
    alternative: '💡 Configure Supabase MCP server in .mcp.json'
  }
};

/**
 * Get a degradation message for a missing skill
 * @param {string} skillName - Name of the skill
 * @param {string} type - Message type (skipping/installing/failed/fallback/alternative)
 * @returns {string} - Formatted message
 */
export function getDegradationMessage(skillName, type = 'skipping') {
  const messages = DEGRADATION_MESSAGES[skillName];
  if (!messages) {
    return `⚠️  ${skillName} not available - skipping`;
  }
  return messages[type] || messages.skipping;
}

/**
 * Complete Detect → Degrade → Message pattern implementation
 * @param {string} skillName - Name of the skill to check
 * @param {Function} onAvailable - Function to run if skill is available
 * @param {Function} onUnavailable - Function to run if skill is unavailable (optional)
 * @param {Object} options - Additional options
 * @returns {Promise<any>} - Result of executed function
 */
export async function detectDegradeMessage(skillName, onAvailable, onUnavailable, options = {}) {
  const {
    showMessages = true,
    throwOnUnavailable = false,
    fallbackMessage = true
  } = options;

  // DETECT
  const isAvailable = await detectSkill(skillName);

  if (isAvailable) {
    // Available - execute primary function
    return await onAvailable();
  } else {
    // DEGRADE - MESSAGE
    if (showMessages) {
      console.log(getDegradationMessage(skillName, 'skipping'));

      if (fallbackMessage && DEGRADATION_MESSAGES[skillName]?.fallback) {
        console.log(getDegradationMessage(skillName, 'fallback'));
      }

      if (DEGRADATION_MESSAGES[skillName]?.alternative) {
        console.log(getDegradationMessage(skillName, 'alternative'));
      }

      console.log(''); // Blank line for readability
    }

    if (throwOnUnavailable) {
      throw new Error(`Required skill not available: ${skillName}`);
    }

    // Execute fallback function if provided
    if (onUnavailable) {
      return await onUnavailable();
    }

    return undefined;
  }
}

/**
 * Batch detect skills and return categorized results
 * @param {Object} skillsByTier - Skills organized by tier
 * @returns {Promise<Object>} - Detection results with recommendations
 */
export async function detectSkillsByTier(skillsByTier = {}) {
  const { baseline = [], quality = [], advanced = [] } = skillsByTier;

  const results = {
    tier: 'baseline',
    missing: {
      baseline: [],
      quality: [],
      advanced: []
    },
    available: {
      baseline: [],
      quality: [],
      advanced: []
    },
    recommendations: []
  };

  // Check baseline (critical)
  for (const skill of baseline) {
    const available = await detectSkill(skill);
    if (available) {
      results.available.baseline.push(skill);
    } else {
      results.missing.baseline.push(skill);
    }
  }

  // Check quality (important but optional)
  for (const skill of quality) {
    const available = await detectSkill(skill);
    if (available) {
      results.available.quality.push(skill);
    } else {
      results.missing.quality.push(skill);
    }
  }

  // Check advanced (nice to have)
  for (const skill of advanced) {
    const available = await detectSkill(skill);
    if (available) {
      results.available.advanced.push(skill);
    } else {
      results.missing.advanced.push(skill);
    }
  }

  // Determine tier
  if (results.missing.baseline.length === 0) {
    if (results.available.quality.length === quality.length) {
      if (results.available.advanced.length > 0) {
        results.tier = 'advanced';
      } else {
        results.tier = 'quality';
      }
    } else {
      results.tier = 'baseline';
    }
  } else {
    results.tier = 'insufficient';
  }

  // Generate recommendations
  if (results.missing.quality.length > 0) {
    results.recommendations.push({
      priority: 'high',
      message: 'Install quality tools to upgrade to QUALITY tier',
      skills: results.missing.quality,
      commands: results.missing.quality.map(skill =>
        DEGRADATION_MESSAGES[skill]?.alternative || `Install ${skill}`
      )
    });
  }

  if (results.tier === 'quality' && results.missing.advanced.length > 0) {
    results.recommendations.push({
      priority: 'medium',
      message: 'Optional advanced tools available for specialized features',
      skills: results.missing.advanced.slice(0, 3), // Show top 3
      commands: results.missing.advanced.slice(0, 3).map(skill =>
        DEGRADATION_MESSAGES[skill]?.alternative || `Install ${skill}`
      )
    });
  }

  return results;
}

// Export all functions
export default {
  // Core detection
  detectSkill,
  withSkill,
  detectMultipleSkills,
  detectHeavyDependency,
  checkEnvironmentVars,

  // Capability analysis
  getCapabilityLevel,
  getDetailedCapabilities,
  detectSkillsByTier,

  // Messaging & reporting
  printCapabilityReport,
  getDegradationMessage,
  detectDegradeMessage,

  // Constants
  DEGRADATION_MESSAGES
};
