#!/usr/bin/env node
/**
 * Website Pipeline - Deploy Readiness Check
 *
 * Validates that a website build is ready for deployment to Vercel.
 * Checks prerequisites, build artifacts, and configuration.
 *
 * Usage:
 *   node website-pipeline/scripts/check-deploy-ready.mjs <build-path>
 *   node website-pipeline/scripts/check-deploy-ready.mjs website-builds/my-site
 *
 * Options:
 *   --json     Output results as JSON
 *   --fix      Attempt to fix common issues
 */

import { existsSync, readFileSync, statSync } from 'fs';
import { join, resolve, basename } from 'path';
import { execSync, spawnSync } from 'child_process';

// ANSI colors
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

// Parse arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const config = { path: null, json: false, fix: false };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--json') config.json = true;
    else if (args[i] === '--fix') config.fix = true;
    else if (!args[i].startsWith('-')) config.path = args[i];
  }

  return config;
}

// Result collector
class DeployReadinessResult {
  constructor(buildPath) {
    this.buildPath = buildPath;
    this.buildName = basename(buildPath);
    this.checks = [];
    this.ready = true;
  }

  pass(category, message) {
    this.checks.push({ status: 'pass', category, message });
  }

  fail(category, message, fix = null) {
    this.checks.push({ status: 'fail', category, message, fix });
    this.ready = false;
  }

  warn(category, message, fix = null) {
    this.checks.push({ status: 'warn', category, message, fix });
  }

  get passCount() {
    return this.checks.filter(c => c.status === 'pass').length;
  }

  get failCount() {
    return this.checks.filter(c => c.status === 'fail').length;
  }

  get warnCount() {
    return this.checks.filter(c => c.status === 'warn').length;
  }

  toJSON() {
    return {
      buildPath: this.buildPath,
      buildName: this.buildName,
      ready: this.ready,
      summary: {
        passed: this.passCount,
        failed: this.failCount,
        warnings: this.warnCount
      },
      checks: this.checks
    };
  }

  print() {
    console.log(`\n${BOLD}Deploy Readiness Check${RESET}`);
    console.log(`${DIM}─────────────────────────────────────${RESET}`);
    console.log(`Build: ${CYAN}${this.buildName}${RESET}`);
    console.log(`Path:  ${DIM}${this.buildPath}${RESET}`);
    console.log(`${DIM}─────────────────────────────────────${RESET}\n`);

    const failed = this.checks.filter(c => c.status === 'fail');
    const warnings = this.checks.filter(c => c.status === 'warn');
    const passed = this.checks.filter(c => c.status === 'pass');

    if (failed.length > 0) {
      console.log(`${RED}${BOLD}BLOCKING ISSUES (${failed.length})${RESET}`);
      for (const c of failed) {
        console.log(`  ${RED}✗${RESET} [${c.category}] ${c.message}`);
        if (c.fix) console.log(`    ${DIM}Fix: ${c.fix}${RESET}`);
      }
      console.log();
    }

    if (warnings.length > 0) {
      console.log(`${YELLOW}${BOLD}WARNINGS (${warnings.length})${RESET}`);
      for (const c of warnings) {
        console.log(`  ${YELLOW}!${RESET} [${c.category}] ${c.message}`);
        if (c.fix) console.log(`    ${DIM}Fix: ${c.fix}${RESET}`);
      }
      console.log();
    }

    if (passed.length > 0) {
      console.log(`${GREEN}${BOLD}PASSED (${passed.length})${RESET}`);
      for (const c of passed) {
        console.log(`  ${GREEN}✓${RESET} [${c.category}] ${c.message}`);
      }
      console.log();
    }

    console.log(`${DIM}─────────────────────────────────────${RESET}`);
    if (this.ready) {
      console.log(`\n${GREEN}${BOLD}✓ READY TO DEPLOY${RESET}`);
      console.log(`${DIM}Run: cd ${this.buildPath} && vercel${RESET}\n`);
    } else {
      console.log(`\n${RED}${BOLD}✗ NOT READY TO DEPLOY${RESET}`);
      console.log(`${DIM}Fix the blocking issues above and re-run this check.${RESET}\n`);
    }
  }
}

// Check if Vercel CLI is installed
function checkVercelCLI(result) {
  try {
    const version = execSync('vercel --version', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    result.pass('vercel', `Vercel CLI installed (${version})`);
  } catch {
    result.fail('vercel', 'Vercel CLI not installed', 'npm install -g vercel');
  }
}

// Check required files exist
function checkRequiredFiles(result, buildPath) {
  const requiredFiles = [
    { file: 'package.json', purpose: 'Dependencies' },
    { file: 'next.config.js', purpose: 'Next.js config', alt: 'next.config.mjs' },
    { file: 'tsconfig.json', purpose: 'TypeScript config' },
    { file: 'vercel.json', purpose: 'Vercel deployment config' }
  ];

  for (const { file, purpose, alt } of requiredFiles) {
    const filePath = join(buildPath, file);
    const altPath = alt ? join(buildPath, alt) : null;

    if (existsSync(filePath) || (altPath && existsSync(altPath))) {
      result.pass('files', `${file} exists (${purpose})`);
    } else {
      result.fail('files', `Missing ${file} (${purpose})`, `Create ${file} in build directory`);
    }
  }
}

// Check for RUN_CERTIFICATE.json
function checkRunCertificate(result, buildPath) {
  const certPath = join(buildPath, 'RUN_CERTIFICATE.json');

  if (!existsSync(certPath)) {
    result.fail('verification', 'RUN_CERTIFICATE.json not found',
      'Run local-run-proof verification first');
    return;
  }

  try {
    const cert = JSON.parse(readFileSync(certPath, 'utf-8'));
    if (cert.status === 'PASS') {
      result.pass('verification', 'Local Run Proof: PASS');
    } else {
      result.fail('verification', `Local Run Proof: ${cert.status}`,
        'Fix build issues and re-run verification');
    }
  } catch (err) {
    result.fail('verification', `Invalid RUN_CERTIFICATE.json: ${err.message}`);
  }
}

// Check .env.example exists and document required vars
function checkEnvironmentDocs(result, buildPath) {
  const envExamplePath = join(buildPath, '.env.example');

  if (!existsSync(envExamplePath)) {
    result.warn('env', '.env.example not found',
      'Create .env.example to document required environment variables');
    return;
  }

  const content = readFileSync(envExamplePath, 'utf-8');
  const vars = content.match(/^[A-Z][A-Z0-9_]+=.*/gm) || [];

  if (vars.length === 0) {
    result.pass('env', '.env.example exists (no required variables)');
  } else {
    result.pass('env', `.env.example documents ${vars.length} variable(s)`);

    // Check for sensitive values accidentally committed
    const sensitivePatterns = [
      /sk[-_]/i, /api[-_]?key\s*=/i, /secret\s*=/i, /password\s*=/i
    ];

    for (const varLine of vars) {
      const [name, value] = varLine.split('=');
      if (value && value.length > 20 && sensitivePatterns.some(p => p.test(varLine))) {
        result.warn('env', `${name} may contain a real secret in .env.example`,
          'Replace with placeholder value');
      }
    }
  }
}

// Check build output exists
function checkBuildOutput(result, buildPath) {
  const nextDir = join(buildPath, '.next');

  if (!existsSync(nextDir)) {
    result.warn('build', '.next directory not found',
      `Run: cd ${buildPath} && npm run build`);
  } else {
    result.pass('build', 'Build output (.next) exists');
  }
}

// Check README and DEPLOYMENT docs
function checkDocumentation(result, buildPath) {
  const readmePath = join(buildPath, 'README.md');
  const deployPath = join(buildPath, 'DEPLOYMENT.md');

  if (existsSync(readmePath)) {
    const content = readFileSync(readmePath, 'utf-8');
    if (content.length > 200) {
      result.pass('docs', 'README.md exists with content');
    } else {
      result.warn('docs', 'README.md exists but appears minimal');
    }
  } else {
    result.warn('docs', 'README.md not found');
  }

  if (existsSync(deployPath)) {
    result.pass('docs', 'DEPLOYMENT.md exists');
  } else {
    result.warn('docs', 'DEPLOYMENT.md not found',
      'Add deployment instructions for other team members');
  }
}

// Check for common deployment issues
function checkDeploymentIssues(result, buildPath) {
  const packageJsonPath = join(buildPath, 'package.json');

  if (!existsSync(packageJsonPath)) return;

  try {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    // Check for required scripts
    const requiredScripts = ['build', 'start'];
    for (const script of requiredScripts) {
      if (pkg.scripts && pkg.scripts[script]) {
        result.pass('scripts', `package.json has '${script}' script`);
      } else {
        result.fail('scripts', `package.json missing '${script}' script`,
          `Add "${script}" script to package.json`);
      }
    }

    // Check for Next.js dependency
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (deps.next) {
      result.pass('deps', `Next.js ${deps.next} installed`);
    } else {
      result.fail('deps', 'Next.js not in dependencies');
    }

  } catch (err) {
    result.fail('scripts', `Invalid package.json: ${err.message}`);
  }
}

// Main check function
function checkDeployReadiness(buildPath) {
  const absolutePath = resolve(buildPath);

  if (!existsSync(absolutePath)) {
    console.error(`${RED}Error: Build path not found: ${absolutePath}${RESET}`);
    process.exit(1);
  }

  if (!statSync(absolutePath).isDirectory()) {
    console.error(`${RED}Error: Path is not a directory: ${absolutePath}${RESET}`);
    process.exit(1);
  }

  const result = new DeployReadinessResult(absolutePath);

  // Run all checks
  checkVercelCLI(result);
  checkRequiredFiles(result, absolutePath);
  checkRunCertificate(result, absolutePath);
  checkEnvironmentDocs(result, absolutePath);
  checkBuildOutput(result, absolutePath);
  checkDocumentation(result, absolutePath);
  checkDeploymentIssues(result, absolutePath);

  return result;
}

// Main
function main() {
  const config = parseArgs();

  if (!config.path) {
    console.log(`
${BOLD}Deploy Readiness Check - Website Pipeline${RESET}

Usage:
  node check-deploy-ready.mjs <build-path>

Options:
  --json     Output results as JSON

Examples:
  node check-deploy-ready.mjs website-builds/my-portfolio
  node check-deploy-ready.mjs ../website-builds/my-site --json
`);
    process.exit(0);
  }

  const result = checkDeployReadiness(config.path);

  if (config.json) {
    console.log(JSON.stringify(result.toJSON(), null, 2));
  } else {
    result.print();
  }

  process.exit(result.ready ? 0 : 1);
}

main();
