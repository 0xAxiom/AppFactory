#!/usr/bin/env node
/**
 * Website Pipeline Regression Guard
 *
 * Verifies that the website pipeline routing and constitution are correctly configured.
 * This script is open-source and can be run by any contributor to verify the system.
 *
 * Usage: node scripts/verify-website-pipeline.mjs
 *
 * Exit codes:
 *   0 - All checks passed
 *   1 - One or more checks failed
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// ANSI colors for terminal output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

let failures = 0;
let passes = 0;

function check(name, condition, details = '') {
  if (condition) {
    console.log(`${GREEN}PASS${RESET} ${name}`);
    passes++;
    return true;
  } else {
    console.log(`${RED}FAIL${RESET} ${name}`);
    if (details) console.log(`     ${YELLOW}${details}${RESET}`);
    failures++;
    return false;
  }
}

function readFile(relativePath) {
  const fullPath = join(ROOT, relativePath);
  if (!existsSync(fullPath)) {
    return null;
  }
  return readFileSync(fullPath, 'utf-8');
}

console.log('\n=== Website Pipeline Regression Guard ===\n');

// 1. Check website-pipeline directory exists
const websitePipelineExists = existsSync(join(ROOT, 'website-pipeline'));
check('website-pipeline/ directory exists', websitePipelineExists);

// 2. Check website-pipeline/CLAUDE.md exists
const websiteClaudeMd = readFile('website-pipeline/CLAUDE.md');
check('website-pipeline/CLAUDE.md exists', websiteClaudeMd !== null);

// 3. Check root CLAUDE.md contains website-pipeline in routing table
const rootClaudeMd = readFile('CLAUDE.md');
check(
  'Root CLAUDE.md lists website-pipeline in routing table',
  rootClaudeMd && rootClaudeMd.includes('website-pipeline'),
  'website-pipeline should be listed in the pipeline routing table'
);

// 4. Check root CLAUDE.md has explicit website intent detection
check(
  'Root CLAUDE.md has Website Intent Detection section',
  rootClaudeMd && rootClaudeMd.includes('Website Intent Detection'),
  'Should have explicit section for routing website intents'
);

// 5. Check root CLAUDE.md does NOT say "dApps and websites" for dapp-factory
const dappAndWebsitesPattern = /dapp-factory.*dApps and websites/i;
check(
  'Root CLAUDE.md does NOT route websites to dapp-factory',
  rootClaudeMd && !dappAndWebsitesPattern.test(rootClaudeMd),
  'dapp-factory should be for Web3/dApps only, not general websites'
);

// 6. Check factory config has website pipeline
const factoryConfig = readFile('plugins/factory/config.default.yaml');
check(
  'Factory config includes website pipeline',
  factoryConfig && factoryConfig.includes('website:') && factoryConfig.includes('website-pipeline'),
  'plugins/factory/config.default.yaml should have website pipeline entry'
);

// 7. Check factory command lists website as option
const factoryCommand = readFile('plugins/factory/commands/factory.md');
check(
  'Factory command lists website as pipeline option',
  factoryCommand && factoryCommand.includes('website'),
  'plugins/factory/commands/factory.md should list website in available pipelines'
);

// 8. Check website-pipeline/CLAUDE.md has EXECUTION-FIRST rule
check(
  'Website pipeline has EXECUTION-FIRST rule',
  websiteClaudeMd && websiteClaudeMd.includes('EXECUTION-FIRST'),
  'website-pipeline/CLAUDE.md should prioritize code over docs'
);

// 9. Check website-pipeline/CLAUDE.md has STICKY UX section
check(
  'Website pipeline has STICKY UX requirements',
  websiteClaudeMd && websiteClaudeMd.includes('STICKY UX'),
  'website-pipeline/CLAUDE.md should define UX requirements'
);

// 10. Check website-pipeline/CLAUDE.md has Minimum Questions Mode
check(
  'Website pipeline limits questions to 6 or fewer',
  websiteClaudeMd && (websiteClaudeMd.includes('≤6') || websiteClaudeMd.includes('<= 6') || websiteClaudeMd.includes('≤ 6')),
  'website-pipeline/CLAUDE.md should limit questions to prevent scope creep'
);

// 11. Check website-pipeline/CLAUDE.md has mandatory launch card
check(
  'Website pipeline has mandatory launch card',
  websiteClaudeMd && websiteClaudeMd.includes('LAUNCH READY') || websiteClaudeMd && websiteClaudeMd.includes('Launch Card'),
  'Every successful run should end with a launch card'
);

// 12. Check no worktree prompting in default flow
check(
  'No worktree prompting in website pipeline',
  websiteClaudeMd && !websiteClaudeMd.includes('where to put worktrees') &&
  !websiteClaudeMd.includes('which directory for worktree'),
  'Worktrees should use default .worktrees/ without asking'
);

// 13. Check website copy never says "dApp"
const websiteSaysDapp = websiteClaudeMd && /\bdApp\b/.test(websiteClaudeMd);
// Allow dApp in the "redirect to dapp-factory" context
const dappInRedirectContext = websiteClaudeMd &&
  websiteClaudeMd.includes('dapp-factory') &&
  (websiteClaudeMd.includes('Use dapp-factory') || websiteClaudeMd.includes('Redirect'));
check(
  'Website pipeline does not conflate with dApp terminology',
  !websiteSaysDapp || dappInRedirectContext,
  'Website pipeline should not use dApp terminology except when redirecting'
);

// 14. Check pipeline detection does not use truncated listings
check(
  'Root CLAUDE.md uses complete pipeline detection',
  rootClaudeMd && rootClaudeMd.includes('find . -maxdepth'),
  'Pipeline detection should use find, not truncated ls'
);

// 15. Check execution-first language exists
check(
  'Website pipeline forbids design-doc theater',
  websiteClaudeMd && (
    websiteClaudeMd.includes('design-doc theater') ||
    websiteClaudeMd.includes('Writing design docs before code')
  ),
  'Should explicitly forbid docs-before-code pattern'
);

// 16. Check scripts/open-url.mjs exists
check(
  'Cross-platform browser opener exists',
  existsSync(join(ROOT, 'scripts', 'open-url.mjs')),
  'scripts/open-url.mjs should exist for opening browser'
);

// 17. Check scripts/local-run-proof-website.mjs exists
check(
  'Website local run proof script exists',
  existsSync(join(ROOT, 'scripts', 'local-run-proof-website.mjs')),
  'scripts/local-run-proof-website.mjs should exist for dev server verification'
);

// 18. Check website-pipeline/scripts/run.mjs exists
check(
  'Website pipeline runner script exists',
  existsSync(join(ROOT, 'website-pipeline', 'scripts', 'run.mjs')),
  'website-pipeline/scripts/run.mjs should implement the interactive 6-step UX'
);

// 19. Check runner script contains 6-step flow
const runnerScript = readFile('website-pipeline/scripts/run.mjs');
check(
  'Runner script implements 6-step flow',
  runnerScript && runnerScript.includes('Step 1') && runnerScript.includes('Step 6'),
  'Runner should have steps 1-6'
);

// 20. Check runner script calls local run proof
check(
  'Runner script integrates local run proof',
  runnerScript && runnerScript.includes('local-run-proof-website'),
  'Runner should call local-run-proof-website.mjs'
);

// Summary
console.log('\n=== Summary ===\n');
console.log(`${GREEN}Passed: ${passes}${RESET}`);
console.log(`${RED}Failed: ${failures}${RESET}`);

if (failures > 0) {
  console.log(`\n${RED}Website pipeline regression detected!${RESET}`);
  console.log('Fix the above issues before merging.\n');
  process.exit(1);
} else {
  console.log(`\n${GREEN}All checks passed!${RESET}`);
  console.log('Website pipeline is correctly configured.\n');
  process.exit(0);
}
