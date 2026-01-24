#!/usr/bin/env node
/**
 * MiniApp Pipeline - Deploy Readiness Check
 *
 * Validates that a Base Mini App build is ready for deployment.
 * Checks prerequisites, manifest, account association, and configuration.
 *
 * Usage:
 *   node miniapp-pipeline/scripts/check-deploy-ready.mjs <build-path>
 *   node miniapp-pipeline/scripts/check-deploy-ready.mjs builds/miniapps/my-miniapp/app
 *
 * Options:
 *   --json     Output results as JSON
 */

import { existsSync, readFileSync, statSync, readdirSync } from 'fs';
import { join, resolve, basename, dirname } from 'path';
import { execSync } from 'child_process';

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
  const config = { path: null, json: false };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--json') config.json = true;
    else if (!args[i].startsWith('-')) config.path = args[i];
  }

  return config;
}

// Result collector
class DeployReadinessResult {
  constructor(buildPath) {
    this.buildPath = buildPath;
    this.miniappName = basename(dirname(buildPath)) || basename(buildPath);
    this.checks = [];
    this.ready = true;
    this.manifestValid = false;
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
      miniappName: this.miniappName,
      manifestValid: this.manifestValid,
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
    console.log(`\n${BOLD}MiniApp Deploy Readiness Check${RESET}`);
    console.log(`${DIM}─────────────────────────────────────${RESET}`);
    console.log(`MiniApp: ${CYAN}${this.miniappName}${RESET}`);
    console.log(`Path:    ${DIM}${this.buildPath}${RESET}`);
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
      console.log(`${DIM}Deploy: cd ${this.buildPath} && vercel${RESET}`);
      console.log(`${DIM}Note: Complete account association after deployment${RESET}\n`);
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
    result.pass('cli', `Vercel CLI installed (${version})`);
  } catch {
    result.fail('cli', 'Vercel CLI not installed', 'npm install -g vercel');
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
      result.fail('files', `Missing ${file} (${purpose})`);
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

// Validate MiniKit manifest (/.well-known/farcaster.json structure)
function checkMiniKitManifest(result, buildPath) {
  // Check for manifest in public directory
  const manifestPath = join(buildPath, 'public', '.well-known', 'farcaster.json');
  const altManifestPath = join(buildPath, 'public', 'farcaster.json');

  let manifest = null;
  let manifestLocation = null;

  if (existsSync(manifestPath)) {
    manifestLocation = manifestPath;
  } else if (existsSync(altManifestPath)) {
    manifestLocation = altManifestPath;
  }

  if (!manifestLocation) {
    result.fail('manifest', 'MiniKit manifest not found',
      'Create public/.well-known/farcaster.json');
    return;
  }

  try {
    manifest = JSON.parse(readFileSync(manifestLocation, 'utf-8'));
    result.pass('manifest', 'MiniKit manifest found and valid JSON');
    result.manifestValid = true;
  } catch (err) {
    result.fail('manifest', `Invalid manifest JSON: ${err.message}`);
    return;
  }

  // Check required manifest fields
  if (manifest.frame) {
    result.pass('manifest', 'Manifest has "frame" section');

    if (manifest.frame.name) {
      result.pass('manifest', `App name: "${manifest.frame.name}"`);
    } else {
      result.fail('manifest', 'Missing frame.name in manifest');
    }

    if (manifest.frame.iconUrl) {
      result.pass('manifest', 'App icon URL configured');
    } else {
      result.warn('manifest', 'Missing frame.iconUrl', 'Add an icon URL for better discoverability');
    }

    if (manifest.frame.splashImageUrl) {
      result.pass('manifest', 'Splash image configured');
    } else {
      result.warn('manifest', 'Missing frame.splashImageUrl');
    }

    if (manifest.frame.homeUrl) {
      result.pass('manifest', 'Home URL configured');
    } else {
      result.warn('manifest', 'Missing frame.homeUrl (will need to set after deployment)');
    }
  } else {
    result.fail('manifest', 'Missing "frame" section in manifest');
  }

  // Check for account association (critical for deployment)
  if (manifest.accountAssociation) {
    result.pass('manifest', 'Account association configured');
  } else {
    result.warn('manifest', 'Account association not yet configured',
      'Complete association after deployment using the Base ecosystem tools');
  }
}

// Check for MiniKit components
function checkMiniKitIntegration(result, buildPath) {
  const packageJsonPath = join(buildPath, 'package.json');

  if (!existsSync(packageJsonPath)) return;

  try {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    // Check for MiniKit SDK
    if (deps['@coinbase/onchainkit'] || deps['@farcaster/frame-sdk']) {
      result.pass('minikit', 'MiniKit/Frame SDK installed');
    } else {
      result.warn('minikit', 'No MiniKit SDK found in dependencies',
        'Install @coinbase/onchainkit or @farcaster/frame-sdk');
    }

    // Check for wagmi (wallet integration)
    if (deps.wagmi) {
      result.pass('minikit', 'Wagmi wallet integration installed');
    }

    // Check for viem (blockchain interaction)
    if (deps.viem) {
      result.pass('minikit', 'Viem blockchain library installed');
    }

  } catch (err) {
    result.warn('minikit', `Could not parse package.json: ${err.message}`);
  }
}

// Check for manifest assets
function checkManifestAssets(result, buildPath) {
  const publicDir = join(buildPath, 'public');

  if (!existsSync(publicDir)) {
    result.warn('assets', 'public/ directory not found');
    return;
  }

  // Check for common required assets
  const commonAssets = [
    { name: 'icon', patterns: ['icon.png', 'icon.svg', 'app-icon.png', 'logo.png'] },
    { name: 'splash', patterns: ['splash.png', 'splash-image.png', 'cover.png'] },
    { name: 'og-image', patterns: ['og-image.png', 'og.png', 'opengraph-image.png'] }
  ];

  for (const { name, patterns } of commonAssets) {
    const hasAsset = patterns.some(p => existsSync(join(publicDir, p)));
    if (hasAsset) {
      result.pass('assets', `${name} asset found`);
    } else {
      result.warn('assets', `No ${name} asset found`, `Add one of: ${patterns.join(', ')}`);
    }
  }
}

// Check package.json scripts
function checkPackageScripts(result, buildPath) {
  const packageJsonPath = join(buildPath, 'package.json');

  if (!existsSync(packageJsonPath)) return;

  try {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    // Check for required scripts
    const requiredScripts = ['build', 'start', 'dev'];
    for (const script of requiredScripts) {
      if (pkg.scripts && pkg.scripts[script]) {
        result.pass('scripts', `package.json has '${script}' script`);
      } else {
        if (script === 'dev') {
          result.warn('scripts', `package.json missing '${script}' script`);
        } else {
          result.fail('scripts', `package.json missing '${script}' script`);
        }
      }
    }

    // Check for Next.js
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

// Check .env.example
function checkEnvironmentDocs(result, buildPath) {
  const envExamplePath = join(buildPath, '.env.example');

  if (!existsSync(envExamplePath)) {
    result.warn('env', '.env.example not found',
      'Create .env.example to document required environment variables');
    return;
  }

  const content = readFileSync(envExamplePath, 'utf-8');
  const vars = content.match(/^[A-Z][A-Z0-9_]+=.*/gm) || [];

  result.pass('env', `.env.example documents ${vars.length} variable(s)`);

  // Check for common MiniApp environment variables
  const commonVars = ['NEXT_PUBLIC_URL', 'NEXT_PUBLIC_ONCHAINKIT_API_KEY'];
  for (const v of commonVars) {
    if (vars.some(line => line.startsWith(v + '='))) {
      result.pass('env', `${v} documented`);
    }
  }
}

// Check documentation
function checkDocumentation(result, buildPath) {
  const readmePath = join(buildPath, 'README.md');

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

  // Check for DEPLOYMENT.md
  const deployPath = join(buildPath, 'DEPLOYMENT.md');
  if (existsSync(deployPath)) {
    result.pass('docs', 'DEPLOYMENT.md exists');
  } else {
    result.warn('docs', 'DEPLOYMENT.md not found',
      'Add deployment and account association instructions');
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
  checkMiniKitManifest(result, absolutePath);
  checkMiniKitIntegration(result, absolutePath);
  checkManifestAssets(result, absolutePath);
  checkPackageScripts(result, absolutePath);
  checkEnvironmentDocs(result, absolutePath);
  checkDocumentation(result, absolutePath);

  return result;
}

// Main
function main() {
  const config = parseArgs();

  if (!config.path) {
    console.log(`
${BOLD}Deploy Readiness Check - MiniApp Pipeline${RESET}

Usage:
  node check-deploy-ready.mjs <build-path>

Options:
  --json     Output results as JSON

Examples:
  node check-deploy-ready.mjs builds/miniapps/my-miniapp/app
  node check-deploy-ready.mjs ../builds/miniapps/gratitude-journal/app --json

Note:
  After deployment, you must complete account association using
  the Base ecosystem tools to make your MiniApp discoverable.
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
