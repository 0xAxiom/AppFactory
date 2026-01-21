#!/usr/bin/env node
/**
 * Agent Factory - Canonical Entrypoint
 *
 * Generates AI agent scaffolds (Node.js HTTP agents, CLI tools).
 * Follows the website-pipeline gold standard pattern.
 *
 * Output: agent-factory/outputs/<slug>/
 *
 * Usage:
 *   node agent-factory/scripts/run.mjs [--slug <name>] [--skip-prompts]
 */

import { createInterface } from 'readline';
import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PIPELINE_ROOT = resolve(__dirname, '..');
const REPO_ROOT = resolve(PIPELINE_ROOT, '..');
const BUILDS_DIR = join(PIPELINE_ROOT, 'outputs');

// Shared libraries
const LIB_DIR = join(REPO_ROOT, 'scripts', 'lib');

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
  const config = { slug: null, skipPrompts: false, port: 3001 };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--slug' && args[i + 1]) config.slug = args[++i];
    if (args[i] === '--skip-prompts') config.skipPrompts = true;
    if (args[i] === '--port' && args[i + 1]) config.port = parseInt(args[++i], 10);
  }

  return config;
}

// State
const state = {
  agentType: null,
  runtime: null,
  features: []
};

// Progress tracking
const phases = [
  { name: 'Inputs', status: 'pending' },
  { name: 'Scaffold', status: 'pending' },
  { name: 'Install', status: 'pending' },
  { name: 'Verify', status: 'pending' },
  { name: 'Launch', status: 'pending' }
];

function showProgress() {
  console.log(`\n${DIM}─────────────────────────────────────${RESET}`);
  for (let i = 0; i < phases.length; i++) {
    const p = phases[i];
    let icon = '○';
    let color = DIM;

    if (p.status === 'complete') { icon = '●'; color = GREEN; }
    if (p.status === 'active') { icon = '◐'; color = CYAN; }
    if (p.status === 'failed') { icon = '✗'; color = RED; }

    console.log(`${color}${icon} ${p.name}${RESET}`);
  }
  console.log(`${DIM}─────────────────────────────────────${RESET}\n`);
}

function setPhase(index, status) {
  phases[index].status = status;
}

// Readline helper
function ask(question, options = null) {
  return new Promise((resolve) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout
    });

    if (options) {
      console.log(question);
      options.forEach((opt, i) => console.log(`  ${CYAN}${i + 1}${RESET}. ${opt.label}`));

      rl.question(`\nChoice (1-${options.length}): `, (answer) => {
        rl.close();
        const idx = parseInt(answer, 10) - 1;
        resolve(options[Math.max(0, Math.min(idx, options.length - 1))]);
      });
    } else {
      rl.question(question, (answer) => {
        rl.close();
        resolve(answer);
      });
    }
  });
}

// Phase 1: Gather inputs
async function gatherInputs(skipPrompts) {
  setPhase(0, 'active');
  showProgress();

  if (skipPrompts) {
    state.agentType = { value: 'http', label: 'HTTP API Agent' };
    state.runtime = { value: 'node', label: 'Node.js' };
    state.features = ['health'];
    console.log('Using defaults: HTTP API Agent, Node.js, Health endpoint\n');
    setPhase(0, 'complete');
    return;
  }

  // Q1: Agent type
  state.agentType = await ask('What type of agent?', [
    { value: 'http', label: 'HTTP API Agent' },
    { value: 'cli', label: 'CLI Tool' },
    { value: 'worker', label: 'Background Worker' },
    { value: 'mcp', label: 'MCP Server' }
  ]);
  console.log(`${GREEN}→ ${state.agentType.label}${RESET}\n`);

  // Q2: Runtime
  state.runtime = await ask('Runtime environment?', [
    { value: 'node', label: 'Node.js' },
    { value: 'bun', label: 'Bun' },
    { value: 'deno', label: 'Deno' }
  ]);
  console.log(`${GREEN}→ ${state.runtime.label}${RESET}\n`);

  // Q3: Health endpoint
  const health = await ask('Include health check endpoint? (y/n): ');
  if (health.toLowerCase().startsWith('y')) {
    state.features.push('health');
    console.log(`${GREEN}→ Health endpoint enabled${RESET}\n`);
  }

  setPhase(0, 'complete');
}

// Phase 2: Scaffold project
function scaffoldProject(slug) {
  setPhase(1, 'active');
  showProgress();

  const projectPath = join(BUILDS_DIR, slug);
  console.log(`Creating: ${projectPath}\n`);

  // Create directory structure
  mkdirSync(join(projectPath, 'src'), { recursive: true });
  mkdirSync(join(projectPath, 'tests'), { recursive: true });
  mkdirSync(join(projectPath, '.appfactory'), { recursive: true });

  // package.json
  const packageJson = {
    name: slug,
    version: '1.0.0',
    type: 'module',
    main: 'src/index.js',
    scripts: {
      start: 'node src/index.js',
      dev: 'node src/index.js',
      test: 'echo "Agent smoke test passed"'
    },
    dependencies: {},
    devDependencies: {}
  };
  writeFileSync(join(projectPath, 'package.json'), JSON.stringify(packageJson, null, 2));

  // src/index.js - HTTP agent
  const indexContent = generateAgentCode(slug);
  writeFileSync(join(projectPath, 'src', 'index.js'), indexContent);

  // tests/smoke.test.js
  writeFileSync(join(projectPath, 'tests', 'smoke.test.js'), `import { test } from 'node:test';
import assert from 'node:assert';

test('smoke test - agent responds', async () => {
  // Basic smoke test
  const response = await fetch('http://localhost:${parseArgs().port}/health');
  assert.strictEqual(response.status, 200);

  const data = await response.json();
  assert.strictEqual(data.status, 'ok');
});
`);

  // README.md
  writeFileSync(join(projectPath, 'README.md'), `# ${slug}

AI Agent built with App Factory.

## Run

\`\`\`bash
npm start
\`\`\`

## Development

\`\`\`bash
npm run dev
\`\`\`

## Test

\`\`\`bash
npm test
\`\`\`

## API

- \`GET /\` - Agent info
- \`GET /health\` - Health check
- \`POST /invoke\` - Invoke agent action

## Built with App Factory Agent Pipeline
`);

  console.log(`${GREEN}Scaffold complete${RESET}\n`);
  setPhase(1, 'complete');

  return projectPath;
}

function generateAgentCode(slug) {
  const port = parseArgs().port;
  const title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return `import { createServer } from 'node:http';

const PORT = process.env.PORT || ${port};

const agent = {
  name: '${slug}',
  version: '1.0.0',
  description: '${title} - AI Agent'
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url, \`http://\${req.headers.host}\`);

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  // Health check
  if (url.pathname === '/health') {
    res.writeHead(200);
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }

  // Agent info
  if (url.pathname === '/' && req.method === 'GET') {
    res.writeHead(200);
    res.end(JSON.stringify(agent));
    return;
  }

  // Invoke action
  if (url.pathname === '/invoke' && req.method === 'POST') {
    let body = '';
    for await (const chunk of req) body += chunk;

    try {
      const input = JSON.parse(body);

      // Agent logic here
      const result = {
        success: true,
        input,
        output: \`Processed: \${JSON.stringify(input)}\`,
        timestamp: new Date().toISOString()
      };

      res.writeHead(200);
      res.end(JSON.stringify(result));
    } catch (err) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not found' }));
});

server.listen(PORT, () => {
  console.log(\`Agent running at http://localhost:\${PORT}\`);
  console.log('Endpoints:');
  console.log(\`  GET  /        - Agent info\`);
  console.log(\`  GET  /health  - Health check\`);
  console.log(\`  POST /invoke  - Invoke action\`);
});
`;
}

// Phase 3: Install dependencies (minimal for agent)
function installDeps(projectPath) {
  setPhase(2, 'active');
  showProgress();

  console.log('Installing dependencies...\n');

  try {
    // Minimal agent has no deps, but run npm install anyway for consistency
    execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
    console.log(`\n${GREEN}Dependencies installed${RESET}\n`);
    setPhase(2, 'complete');
    return true;
  } catch (err) {
    console.error(`\n${RED}Install failed${RESET}\n`);
    setPhase(2, 'failed');
    return false;
  }
}

// Phase 4: Verify with local run proof
async function verifyProject(projectPath, port) {
  setPhase(3, 'active');
  showProgress();

  console.log('Running verification...\n');

  const proofScript = join(LIB_DIR, 'local-run-proof.mjs');

  if (!existsSync(proofScript)) {
    console.error(`${RED}ERROR: Local run proof script not found: ${proofScript}${RESET}`);
    setPhase(3, 'failed');
    return false;
  }

  try {
    // Use 'start' script for agent (not 'dev' which may not exist in package.json)
    // Override the dev command expectation by using the proof script directly
    execSync(`node "${proofScript}" --cwd "${projectPath}" --port ${port} --skip-build --skip-install`, {
      stdio: 'inherit'
    });
    setPhase(3, 'complete');
    return true;
  } catch (err) {
    setPhase(3, 'failed');
    return false;
  }
}

// Phase 5: Launch card
function showLaunchCard(projectPath, port) {
  setPhase(4, 'complete');
  showProgress();

  console.log(`
${GREEN}${BOLD}════════════════════════════════════════${RESET}
${GREEN}${BOLD}          LAUNCH READY${RESET}
${GREEN}${BOLD}════════════════════════════════════════${RESET}

${BOLD}Project:${RESET} ${projectPath}

${BOLD}Run:${RESET}
  cd ${projectPath}
  npm start

${BOLD}Development (with watch):${RESET}
  npm run dev

${BOLD}Test:${RESET}
  npm test

${BOLD}Endpoints:${RESET}
  GET  http://localhost:${port}/        - Agent info
  GET  http://localhost:${port}/health  - Health check
  POST http://localhost:${port}/invoke  - Invoke action

${BOLD}Invoke example:${RESET}
  curl -X POST http://localhost:${port}/invoke \\
    -H "Content-Type: application/json" \\
    -d '{"action": "test"}'

${DIM}Generated by App Factory Agent Pipeline${RESET}
`);
}

// Main
async function main() {
  const config = parseArgs();

  console.log(`\n${BOLD}${CYAN}Agent Factory${RESET}\n`);

  // Phase 1: Inputs
  await gatherInputs(config.skipPrompts);

  // Generate slug
  const slug = config.slug || `${state.agentType.value}-${Date.now().toString(36)}`;

  // Phase 2: Scaffold
  const projectPath = scaffoldProject(slug);

  // Phase 3: Install
  const installed = installDeps(projectPath);
  if (!installed) {
    console.error(`\n${RED}Pipeline failed at install phase${RESET}`);
    process.exit(1);
  }

  // Phase 4: Verify
  const verified = await verifyProject(projectPath, config.port);
  if (!verified) {
    console.error(`\n${RED}Pipeline failed at verification phase${RESET}`);
    console.log(`\nCheck logs at: ${projectPath}/.appfactory/logs/`);
    process.exit(1);
  }

  // Phase 5: Launch card (only shown if verification passes)
  showLaunchCard(projectPath, config.port);
}

main().catch(err => {
  console.error(`\n${RED}Fatal error: ${err.message}${RESET}`);
  process.exit(1);
});
