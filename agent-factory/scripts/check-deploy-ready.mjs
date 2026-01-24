#!/usr/bin/env node
/**
 * Agent Factory - Deploy Readiness Check
 *
 * Validates that an agent scaffold is ready for deployment.
 * Checks prerequisites, build artifacts, and configuration.
 *
 * Usage:
 *   node agent-factory/scripts/check-deploy-ready.mjs <output-path>
 *   node agent-factory/scripts/check-deploy-ready.mjs outputs/my-agent
 *
 * Options:
 *   --json     Output results as JSON
 */

import { existsSync, readFileSync, statSync } from 'fs';
import { join, resolve, basename } from 'path';
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
  constructor(outputPath) {
    this.outputPath = outputPath;
    this.agentName = basename(outputPath);
    this.checks = [];
    this.ready = true;
    this.deploymentType = null; // 'vercel', 'docker', 'standalone'
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
      outputPath: this.outputPath,
      agentName: this.agentName,
      deploymentType: this.deploymentType,
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
    console.log(`\n${BOLD}Agent Deploy Readiness Check${RESET}`);
    console.log(`${DIM}─────────────────────────────────────${RESET}`);
    console.log(`Agent: ${CYAN}${this.agentName}${RESET}`);
    console.log(`Path:  ${DIM}${this.outputPath}${RESET}`);
    if (this.deploymentType) {
      console.log(`Type:  ${this.deploymentType}`);
    }
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
      this.printDeployCommand();
    } else {
      console.log(`\n${RED}${BOLD}✗ NOT READY TO DEPLOY${RESET}`);
      console.log(`${DIM}Fix the blocking issues above and re-run this check.${RESET}\n`);
    }
  }

  printDeployCommand() {
    switch (this.deploymentType) {
      case 'vercel':
        console.log(`${DIM}Run: cd ${this.outputPath} && vercel${RESET}\n`);
        break;
      case 'docker':
        console.log(`${DIM}Run: cd ${this.outputPath} && docker build -t ${this.agentName} .${RESET}\n`);
        break;
      default:
        console.log(`${DIM}Run: cd ${this.outputPath} && npm start${RESET}\n`);
    }
  }
}

// Detect deployment type
function detectDeploymentType(result, outputPath) {
  const hasVercelJson = existsSync(join(outputPath, 'vercel.json'));
  const hasDockerfile = existsSync(join(outputPath, 'Dockerfile'));

  if (hasVercelJson) {
    result.deploymentType = 'vercel';
    result.pass('type', 'Deployment type: Vercel (serverless)');
  } else if (hasDockerfile) {
    result.deploymentType = 'docker';
    result.pass('type', 'Deployment type: Docker container');
  } else {
    result.deploymentType = 'standalone';
    result.pass('type', 'Deployment type: Standalone Node.js');
  }
}

// Check if required CLI tools are installed
function checkCLITools(result) {
  // Node.js is always required
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
    result.pass('cli', `Node.js installed (${nodeVersion})`);
  } catch {
    result.fail('cli', 'Node.js not installed');
  }

  // Check Vercel CLI if Vercel deployment
  if (result.deploymentType === 'vercel') {
    try {
      const version = execSync('vercel --version', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
      result.pass('cli', `Vercel CLI installed (${version})`);
    } catch {
      result.fail('cli', 'Vercel CLI not installed', 'npm install -g vercel');
    }
  }

  // Check Docker if Docker deployment
  if (result.deploymentType === 'docker') {
    try {
      const version = execSync('docker --version', { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] }).trim();
      result.pass('cli', `Docker installed (${version})`);
    } catch {
      result.fail('cli', 'Docker not installed', 'Install Docker Desktop');
    }
  }
}

// Check required files exist
function checkRequiredFiles(result, outputPath) {
  const requiredFiles = [
    { file: 'package.json', purpose: 'Dependencies' },
    { file: 'tsconfig.json', purpose: 'TypeScript config' }
  ];

  for (const { file, purpose } of requiredFiles) {
    const filePath = join(outputPath, file);
    if (existsSync(filePath)) {
      result.pass('files', `${file} exists (${purpose})`);
    } else {
      result.fail('files', `Missing ${file} (${purpose})`);
    }
  }

  // Check for agent entry point
  const entryPoints = [
    'src/index.ts',
    'src/agent/index.ts',
    'src/server.ts',
    'index.ts'
  ];

  const hasEntryPoint = entryPoints.some(ep => existsSync(join(outputPath, ep)));
  if (hasEntryPoint) {
    result.pass('files', 'Agent entry point found');
  } else {
    result.fail('files', 'No agent entry point found (src/index.ts or similar)');
  }
}

// Check .env.example and required environment variables
function checkEnvironmentDocs(result, outputPath) {
  const envExamplePath = join(outputPath, '.env.example');

  if (!existsSync(envExamplePath)) {
    result.warn('env', '.env.example not found',
      'Create .env.example to document required environment variables');
    return;
  }

  const content = readFileSync(envExamplePath, 'utf-8');
  const vars = content.match(/^[A-Z][A-Z0-9_]+=.*/gm) || [];

  result.pass('env', `.env.example documents ${vars.length} variable(s)`);

  // Check for common agent environment variables
  const commonAgentVars = ['ANTHROPIC_API_KEY', 'OPENAI_API_KEY', 'LLM_API_KEY'];
  const hasLLMKey = commonAgentVars.some(v =>
    vars.some(line => line.startsWith(v + '='))
  );

  if (hasLLMKey) {
    result.pass('env', 'LLM API key documented in .env.example');
  } else {
    result.warn('env', 'No LLM API key documented',
      'Add ANTHROPIC_API_KEY or OPENAI_API_KEY to .env.example');
  }
}

// Check agent definition files
function checkAgentDefinition(result, outputPath) {
  const agentDefinitionPaths = [
    'src/agent/index.ts',
    'src/agent/definition.ts',
    'src/agent.ts',
    'AGENT_ARCHITECTURE.md'
  ];

  const hasAgentDef = agentDefinitionPaths.some(p => existsSync(join(outputPath, p)));

  if (hasAgentDef) {
    result.pass('agent', 'Agent definition found');
  } else {
    result.warn('agent', 'No explicit agent definition file found');
  }

  // Check for tools directory
  const toolsDir = join(outputPath, 'src', 'tools');
  const toolsAltDir = join(outputPath, 'src', 'agent', 'tools');

  if (existsSync(toolsDir) || existsSync(toolsAltDir)) {
    result.pass('agent', 'Tools directory found');
  } else {
    result.warn('agent', 'No tools directory found (src/tools or src/agent/tools)');
  }
}

// Check package.json scripts
function checkPackageScripts(result, outputPath) {
  const packageJsonPath = join(outputPath, 'package.json');

  if (!existsSync(packageJsonPath)) return;

  try {
    const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

    // Check for required scripts
    const requiredScripts = ['build', 'start'];
    for (const script of requiredScripts) {
      if (pkg.scripts && pkg.scripts[script]) {
        result.pass('scripts', `package.json has '${script}' script`);
      } else {
        result.fail('scripts', `package.json missing '${script}' script`);
      }
    }

    // Check for TypeScript
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };
    if (deps.typescript) {
      result.pass('deps', 'TypeScript installed');
    }

    // Check for LLM SDK
    const llmSdks = ['@anthropic-ai/sdk', 'openai', '@langchain/core', 'ai'];
    const hasLLMSdk = llmSdks.some(sdk => sdk in deps);

    if (hasLLMSdk) {
      result.pass('deps', 'LLM SDK found in dependencies');
    } else {
      result.warn('deps', 'No LLM SDK found in dependencies',
        'Install @anthropic-ai/sdk, openai, or similar');
    }

    // Check for Zod (schema validation)
    if (deps.zod) {
      result.pass('deps', 'Zod schema validation installed');
    } else {
      result.warn('deps', 'Zod not installed (recommended for tool schemas)');
    }

  } catch (err) {
    result.fail('scripts', `Invalid package.json: ${err.message}`);
  }
}

// Check documentation
function checkDocumentation(result, outputPath) {
  const readmePath = join(outputPath, 'README.md');

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

  // Check for AGENT_ARCHITECTURE.md
  const archPath = join(outputPath, 'AGENT_ARCHITECTURE.md');
  if (existsSync(archPath)) {
    result.pass('docs', 'AGENT_ARCHITECTURE.md exists');
  }
}

// Main check function
function checkDeployReadiness(outputPath) {
  const absolutePath = resolve(outputPath);

  if (!existsSync(absolutePath)) {
    console.error(`${RED}Error: Output path not found: ${absolutePath}${RESET}`);
    process.exit(1);
  }

  if (!statSync(absolutePath).isDirectory()) {
    console.error(`${RED}Error: Path is not a directory: ${absolutePath}${RESET}`);
    process.exit(1);
  }

  const result = new DeployReadinessResult(absolutePath);

  // Run all checks
  detectDeploymentType(result, absolutePath);
  checkCLITools(result);
  checkRequiredFiles(result, absolutePath);
  checkEnvironmentDocs(result, absolutePath);
  checkAgentDefinition(result, absolutePath);
  checkPackageScripts(result, absolutePath);
  checkDocumentation(result, absolutePath);

  return result;
}

// Main
function main() {
  const config = parseArgs();

  if (!config.path) {
    console.log(`
${BOLD}Deploy Readiness Check - Agent Factory${RESET}

Usage:
  node check-deploy-ready.mjs <output-path>

Options:
  --json     Output results as JSON

Examples:
  node check-deploy-ready.mjs outputs/my-agent
  node check-deploy-ready.mjs ../outputs/code-reviewer --json
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
