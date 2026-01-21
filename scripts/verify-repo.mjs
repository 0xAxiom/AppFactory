#!/usr/bin/env node
/**
 * App Factory Repository Verification
 *
 * Checks all critical invariants across the repository.
 * Run this before committing or in CI.
 *
 * Usage: node scripts/verify-repo.mjs
 *
 * Exit codes:
 *   0 - All checks passed
 *   1 - One or more checks failed
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// Colors
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

let passes = 0;
let failures = 0;
let warnings = 0;

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

function warn(name, details = '') {
  console.log(`${YELLOW}WARN${RESET} ${name}`);
  if (details) console.log(`     ${DIM}${details}${RESET}`);
  warnings++;
}

function section(title) {
  console.log(`\n${CYAN}${BOLD}=== ${title} ===${RESET}\n`);
}

function readFile(relativePath) {
  const fullPath = join(ROOT, relativePath);
  if (!existsSync(fullPath)) return null;
  return readFileSync(fullPath, 'utf-8');
}

function fileExists(relativePath) {
  return existsSync(join(ROOT, relativePath));
}

// ===== SECTION 1: SHARED RUNTIME LAYER =====
section('Shared Runtime Layer');

check(
  'scripts/lib/ directory exists',
  fileExists('scripts/lib'),
  'Shared runtime utilities must be in scripts/lib/'
);

check(
  'process-manager.mjs exists',
  fileExists('scripts/lib/process-manager.mjs'),
  'Unified process lifecycle manager required'
);

check(
  'local-run-proof.mjs exists',
  fileExists('scripts/lib/local-run-proof.mjs'),
  'Shared verification script required'
);

const processManager = readFile('scripts/lib/process-manager.mjs');
check(
  'process-manager exports startProcess',
  processManager && processManager.includes('export function startProcess'),
  'Must export startProcess function'
);

check(
  'process-manager exports waitForReady',
  processManager && processManager.includes('async function waitForReady') && processManager.includes('export'),
  'Must export waitForReady function'
);

check(
  'process-manager exports killProcess',
  processManager && processManager.includes('async function killProcess') && processManager.includes('export'),
  'Must export killProcess function'
);

check(
  'process-manager exports openBrowser',
  processManager && processManager.includes('async function openBrowser') && processManager.includes('export'),
  'Must export openBrowser function'
);

// ===== SECTION 2: PIPELINE ENTRYPOINTS =====
section('Pipeline Entrypoints');

// ALL pipelines MUST have canonical entrypoints - this is mandatory
const pipelines = [
  { name: 'website-pipeline', required: true },
  { name: 'dapp-factory', required: true },
  { name: 'app-factory', required: true },
  { name: 'agent-factory', required: true },
  { name: 'plugin-factory', required: true },
  { name: 'miniapp-pipeline', required: true }
];

for (const pipeline of pipelines) {
  const entrypoint = `${pipeline.name}/scripts/run.mjs`;
  const exists = fileExists(entrypoint);
  check(`${pipeline.name} has entrypoint`, exists, `Expected: ${entrypoint}`);
}

// Check ALL pipelines use shared lib
for (const pipeline of pipelines) {
  const runner = readFile(`${pipeline.name}/scripts/run.mjs`);
  check(
    `${pipeline.name} uses shared lib`,
    runner && (runner.includes("'scripts', 'lib'") || runner.includes('scripts/lib')),
    'Must import from scripts/lib/'
  );

  // Check for proof wiring (either local-run-proof or writes certificate directly)
  check(
    `${pipeline.name} has proof wiring`,
    runner && (runner.includes('local-run-proof') || runner.includes('RUN_CERTIFICATE')),
    'Must use local-run-proof or write RUN_CERTIFICATE'
  );
}

// ===== SECTION 3: ROUTING CONFIGURATION =====
section('Routing Configuration');

const rootClaude = readFile('CLAUDE.md');
check(
  'Root CLAUDE.md exists',
  rootClaude !== null,
  'Root orchestrator constitution required'
);

check(
  'website-pipeline in routing table',
  rootClaude && rootClaude.includes('website-pipeline'),
  'website-pipeline must be in routing table'
);

check(
  'Website Intent Detection section exists',
  rootClaude && rootClaude.includes('Website Intent Detection'),
  'Explicit intent detection required'
);

const factoryConfig = readFile('plugins/factory/config.default.yaml');
check(
  'Factory config includes website',
  factoryConfig && factoryConfig.includes('website:'),
  'plugins/factory/config.default.yaml must have website entry'
);

// ===== SECTION 4: NO FORBIDDEN PATTERNS =====
section('Forbidden Patterns');

// Check for design-doc-first patterns
const websiteClaude = readFile('website-pipeline/CLAUDE.md');
check(
  'website-pipeline is execution-first',
  websiteClaude && websiteClaude.includes('EXECUTION-FIRST'),
  'Must declare execution-first pattern'
);

// Check that docs-before-code is listed as FORBIDDEN (not advocated)
check(
  'docs-before-code is forbidden',
  websiteClaude && websiteClaude.includes('Forbidden Patterns') && websiteClaude.includes('docs before code'),
  'CLAUDE.md must list docs-before-code as a forbidden pattern'
);

// Check for worktree prompting
check(
  'No worktree prompting',
  websiteClaude && !websiteClaude.includes('where to put worktrees'),
  'Worktree location should use default silently'
);

// Check for blocking questions in all pipeline runners
const websiteRunner = readFile('website-pipeline/scripts/run.mjs');
check(
  'No ready-to-proceed blocking',
  !websiteRunner || !websiteRunner.includes('ready to proceed'),
  '"Ready to proceed?" pattern is forbidden'
);

// ===== SECTION 5: RUNTIME PROOF INVARIANTS =====
section('Runtime Proof Invariants');

const localRunProof = readFile('scripts/lib/local-run-proof.mjs');

check(
  'Checks for forbidden bypass flags',
  localRunProof && localRunProof.includes('--legacy-peer-deps'),
  'Must detect forbidden npm flags'
);

check(
  'Writes RUN_CERTIFICATE on success',
  localRunProof && localRunProof.includes('RUN_CERTIFICATE'),
  'Must write certificate on success'
);

check(
  'Writes RUN_FAILURE on failure',
  localRunProof && localRunProof.includes('RUN_FAILURE'),
  'Must write failure report on failure'
);

// ===== SECTION 6: NO COMMITTED NODE_MODULES =====
section('Repository Hygiene');

// Check for committed node_modules
try {
  const gitLsFiles = execSync('git ls-files', { cwd: ROOT, encoding: 'utf-8' });
  const hasNodeModules = gitLsFiles.split('\n').some(f => f.includes('node_modules'));
  check(
    'No committed node_modules',
    !hasNodeModules,
    'node_modules should never be committed'
  );
} catch (err) {
  warn('Could not check git files', err.message);
}

// Check .gitignore includes node_modules
const gitignore = readFile('.gitignore');
check(
  '.gitignore includes node_modules',
  gitignore && gitignore.includes('node_modules'),
  'node_modules must be in .gitignore'
);

// ===== SECTION 7: CERTIFICATE REQUIREMENTS =====
section('Certificate Requirements');

// The actual process death check happens in process-manager.mjs's waitForReady
// local-run-proof.mjs checks devHandle.exited in error handler
check(
  'local-run-proof checks process death during health check',
  localRunProof && localRunProof.includes('.exited'),
  'Must check if process died before polling'
);

const processManagerContent = readFile('scripts/lib/process-manager.mjs');
check(
  'waitForReady checks process death before polling',
  processManagerContent && processManagerContent.includes('processHandle.exited'),
  'waitForReady must check if process died during health check'
);

check(
  'process-manager handles Unix process groups',
  processManagerContent && processManagerContent.includes('-pid'),
  'Must use negative PID for process group killing on Unix'
);

check(
  'process-manager handles Windows taskkill',
  processManagerContent && processManagerContent.includes('taskkill'),
  'Must use taskkill on Windows'
);

// ===== SUMMARY =====
section('Summary');

console.log(`${GREEN}Passed: ${passes}${RESET}`);
console.log(`${YELLOW}Warnings: ${warnings}${RESET}`);
console.log(`${RED}Failed: ${failures}${RESET}`);

if (failures > 0) {
  console.log(`\n${RED}${BOLD}Repository verification FAILED${RESET}`);
  console.log('Fix the above issues before committing.\n');
  process.exit(1);
} else if (warnings > 0) {
  console.log(`\n${YELLOW}${BOLD}Repository verification passed with warnings${RESET}`);
  console.log('Consider addressing warnings for full compliance.\n');
  process.exit(0);
} else {
  console.log(`\n${GREEN}${BOLD}Repository verification PASSED${RESET}\n`);
  process.exit(0);
}
